// One-time, read-only import. Never used by Hexo's build or publishing workflow.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { fromMarkdown } from 'mdast-util-from-markdown';
import yaml from 'js-yaml';
import hexoUtil from 'hexo-util';

const { slugize } = hexoUtil;

export const POLICY = Object.freeze({ notes: '40-知识库', assets: '99-附件/遗留' });
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const url = value => '/' + value.split('/').map(encodeURIComponent).join('/');
const label = value => value.replace(/[\\[\]*_`]/g, '\\$&');
const inside = (root, file) => file === root || file.startsWith(root + path.sep);

function safeFile(root, relative, allowed) {
  const absolute = path.resolve(root, relative);
  if (!inside(path.resolve(root, allowed), absolute)) throw new Error(`Outside allowed scope: ${relative}`);
  if (!inside(path.resolve(root, allowed), fs.realpathSync(absolute))) throw new Error(`Symlink outside allowed scope: ${relative}`);
  if (!fs.statSync(absolute).isFile()) throw new Error(`Not a file: ${relative}`);
  return absolute;
}

function markdownFiles(root, relative = POLICY.notes) {
  const directory = path.resolve(root, relative);
  if (fs.lstatSync(directory).isSymbolicLink()) throw new Error(`Symlink directory: ${relative}`);
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en')).flatMap(entry => {
    const name = path.posix.join(relative, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink: ${name}`);
    return entry.isDirectory() ? markdownFiles(root, name) : /\.md$/i.test(name) ? [name] : [];
  });
}

export function parseNote(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) throw new Error('Missing YAML front matter');
  return { metadata: yaml.load(match[1], { schema: yaml.JSON_SCHEMA }), body: text.slice(match[0].length) };
}

function visit(node, fn) {
  fn(node);
  for (const child of node.children || []) visit(child, fn);
}

export function convertBody(body, current, resolveNote, copyAsset, blocked) {
  const tree = fromMarkdown(body);
  const protectedRanges = [];
  const edits = [];
  const add = (start, end, text) => edits.push({ start, end, text });
  const block = target => { blocked.push({ source: current.source, target }); };
  const noteLink = (target, text) => {
    const [name, heading] = target.split('#');
    const note = name ? resolveNote(name, current) : current;
    if (!note) { block(target); return `${label(text)}（未公开）`; }
    const fragment = heading ? '#' + encodeURIComponent(slugize(heading.trim())) : '';
    // Note embeds become links: never read/transclude a link target recursively.
    return `[${label(text || note.metadata.title)}](${url(note.permalink)}${fragment})`;
  };
  const imageLink = (target, text) => {
    const destination = copyAsset(target, current);
    if (!destination) { block(target); return `${label(text || '图片')}（未公开）`; }
    return `![${label(text || path.posix.basename(target))}](${url(destination)})`;
  };

  visit(tree, node => {
    if (!node.position) return;
    const { start, end } = node.position;
    if (['code', 'inlineCode', 'html', 'link', 'image', 'definition'].includes(node.type)) {
      protectedRanges.push([start.offset, end.offset]);
    }
    if (['link', 'image', 'definition'].includes(node.type)) {
      const target = decodeURI(node.url);
      // Ordinary web links remain intact. Links into the source vault do not bypass policy.
      if (/^(?:https?:)?\/\/(?:raw\.githubusercontent\.com\/wliafe\/notes|github\.com\/wliafe\/notes)(?:\/|$)/i.test(target)) {
        block(target);
        add(start.offset, end.offset, label(node.children?.map(n => n.value || '').join('') || node.alt || '未公开链接'));
      } else if (!/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(target)) {
        if (node.type === 'definition') throw new Error(`Local reference definition needs manual review: ${target}`);
        const text = node.alt || node.children?.map(n => n.value || '').join('') || target;
        const isImage = /\.(png|gif|jpe?g|webp)$/i.test(target);
        add(start.offset, end.offset, isImage ? imageLink(target, text) : noteLink(target, text));
      }
    }
  });

  for (const match of body.matchAll(/(!?)\[\[([^\n]*?)\]\]|^([ \t]*(?:>[ \t]*)+)\[!([\w-]+)\][+-]?[ \t]*([^\n]*)/gm)) {
    if (protectedRanges.some(([start, end]) => match.index < end && match.index + match[0].length > start)) continue;
    // Escaped brackets are literal Markdown.
    let escapes = 0;
    for (let i = match.index - 1; i >= 0 && body[i] === '\\'; i--) escapes++;
    if (escapes % 2) continue;
    if (match[3]) {
      add(match.index, match.index + match[0].length, `${match[3]}**${label(match[5] || match[4])}**`);
    } else {
      const [target, alias] = match[2].split('|');
      const isImage = /\.(png|gif|jpe?g|webp)$/i.test(target);
      // Images can only be imported from the explicitly allowed attachment directory.
      const replacement = isImage ? imageLink(target, alias) : noteLink(target, alias || (target.includes('#') ? target.split('#').at(-1) : ''));
      add(match.index, match.index + match[0].length, replacement);
    }
  }
  edits.sort((a, b) => b.start - a.start);
  let result = body;
  for (const edit of edits) result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
  return result;
}

export function migrate(sourceRoot, blogRoot, legacy = {}) {
  sourceRoot = fs.realpathSync(sourceRoot);
  blogRoot = fs.realpathSync(blogRoot);
  // Refuse even an accidental write into the source vault.
  if (inside(sourceRoot, blogRoot) || inside(blogRoot, sourceRoot)) throw new Error('Source and destination must be separate');
  const records = markdownFiles(sourceRoot).map(source => {
    const bytes = fs.readFileSync(safeFile(sourceRoot, source, POLICY.notes));
    const { metadata, body } = parseNote(bytes.toString());
    if (!['note', 'moc'].includes(metadata.type) || !metadata.title || !/^\d{4}-\d{2}-\d{2}$/.test(metadata.created)) throw new Error(`Invalid metadata: ${source}`);
    const relative = source.slice(POLICY.notes.length + 1);
    const stem = relative.slice(0, -3);
    const permalink = metadata.type === 'moc' && stem === '知识库' ? 'knowledge/' : legacy[source] || `knowledge/${stem}/`;
    const destination = metadata.type === 'note' ? `source/_posts/knowledge/${relative}` : `source/${permalink}index.md`;
    return { source, destination, permalink, metadata, body, sourceSha256: sha256(bytes) };
  });
  const keys = new Map();
  for (const record of records) {
    const aliases = Array.isArray(record.metadata.aliases) ? record.metadata.aliases : [];
    for (const key of new Set([record.source.slice(0, -3), record.source, path.posix.basename(record.source, '.md'), record.metadata.title, ...aliases])) {
      if (keys.has(key) && keys.get(key) !== record) throw new Error(`Ambiguous note: ${key}`);
      keys.set(key, record);
    }
  }
  const resolveNote = (name, current) => keys.get(name) || keys.get(path.posix.normalize(path.posix.join(path.posix.dirname(current.source), name)).replace(/\.md$/i, ''));
  const assets = new Map();
  const outputs = new Map();
  const blockedLinks = [];
  const copyAsset = (target, current) => {
    const candidates = [target, path.posix.normalize(path.posix.join(path.posix.dirname(current.source), target))];
    const source = candidates.find(candidate => candidate.startsWith(POLICY.assets + '/') && /\.(png|gif|jpe?g|webp)$/i.test(candidate) && fs.existsSync(path.resolve(sourceRoot, candidate)));
    if (!source) return null;
    const bytes = fs.readFileSync(safeFile(sourceRoot, source, POLICY.assets));
    const destination = 'source/images/knowledge/' + source.slice(POLICY.assets.length + 1);
    assets.set(source, { source, destination, bytes: bytes.length, sha256: sha256(bytes) });
    outputs.set(destination, bytes);
    return destination.slice('source/'.length);
  };
  for (const record of records) {
    const categories = path.posix.dirname(record.source.slice(POLICY.notes.length + 1)).split('/').filter(value => value !== '.');
    const metadata = {
      ...record.metadata,
      layout: record.metadata.type === 'moc' ? 'page' : 'post',
      date: record.metadata.created,
      updated: record.metadata.created,
      categories: record.metadata.type === 'note' ? categories : [],
      permalink: record.permalink,
      ...(record.metadata.type === 'moc' ? { comments: false } : {})
    };
    const body = convertBody(record.body, record, resolveNote, copyAsset, blockedLinks);
    const bytes = Buffer.from('---\n' + yaml.dump(metadata, { schema: yaml.JSON_SCHEMA, lineWidth: -1, noRefs: true }) + '---\n' + body);
    record.destinationSha256 = sha256(bytes);
    outputs.set(record.destination, bytes);
  }
  const destinations = records.map(record => record.destination);
  if (new Set(destinations).size !== records.length || new Set(records.map(record => record.permalink)).size !== records.length) throw new Error('Duplicate destination or permalink');
  // All parsing and boundary checks finish before writing; never overwrite blog edits.
  for (const destination of outputs.keys()) {
    const absolute = path.resolve(blogRoot, destination);
    let parent = path.dirname(absolute);
    while (parent !== blogRoot) {
      if (fs.existsSync(parent) && fs.lstatSync(parent).isSymbolicLink()) throw new Error(`Destination symlink: ${destination}`);
      parent = path.dirname(parent);
    }
    if (!inside(blogRoot, absolute) || fs.existsSync(absolute)) throw new Error(`Destination already exists or is unsafe: ${destination}`);
  }
  const manifest = {
    policy: POLICY,
    articles: records.map(({ source, destination, permalink, metadata, sourceSha256, destinationSha256 }) => ({ source, destination, permalink, type: metadata.type, sourceSha256, destinationSha256 })),
    assets: [...assets.values()],
    blockedLinks
  };
  const manifestPath = path.join(blogRoot, 'migration/knowledge-manifest.json');
  if (fs.existsSync(manifestPath)) throw new Error('Migration manifest already exists; do not rerun over maintained content');
  for (const [destination, bytes] of outputs) {
    const absolute = path.join(blogRoot, destination);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, bytes, { flag: 'wx' });
  }
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  return manifest;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [sourceRoot, blogRoot = process.cwd()] = process.argv.slice(2);
  if (!sourceRoot) throw new Error('Usage: node tools/migrate-knowledge.mjs SOURCE_VAULT [BLOG_ROOT]');
  const legacy = JSON.parse(fs.readFileSync(new URL('../migration/legacy-permalinks.json', import.meta.url)));
  const manifest = migrate(sourceRoot, blogRoot, legacy);
  console.log(`${manifest.articles.length} Markdown, ${manifest.assets.length} referenced images, ${manifest.blockedLinks.length} blocked links`);
}
