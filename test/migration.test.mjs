import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { migrate, convertBody, POLICY } from '../tools/migrate-knowledge.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'knowledge-migration-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const source = path.join(root, 'notes');
  const blog = path.join(root, 'blog');
  fs.mkdirSync(source); fs.mkdirSync(blog);
  const write = (name, content) => { fs.mkdirSync(path.dirname(path.join(source, name)), { recursive: true }); fs.writeFileSync(path.join(source, name), content); };
  const note = body => `---\ntitle: Node.js 运行时\naliases: [Nodejs]\ntype: note\ncreated: 2025-07-04\ntags: []\n---\n${body}`;
  return { source, blog, write, note };
}

test('copies only allowed Markdown and referenced images; never follows private links', t => {
  const f = fixture(t);
  f.write('40-知识库/工具/Node.js 运行时.md', f.note('[[20-项目/private|项目]] ![[99-附件/遗留/used.png]] [[Nodejs]]\n`![[99-附件/遗留/unused.gif]]`'));
  f.write('20-项目/private.md', 'PRIVATE_CONTENT ![[99-附件/遗留/private.png]]');
  f.write('30-研究/private.md', 'PRIVATE_RESEARCH');
  f.write('10-日记/private.md', 'PRIVATE_DIARY');
  f.write('99-附件/遗留/used.png', 'allowed image');
  f.write('99-附件/遗留/unused.gif', 'not used');
  f.write('99-附件/遗留/private.png', 'private image');
  const original = fs.readFileSync(path.join(f.source, '40-知识库/工具/Node.js 运行时.md'));
  const manifest = migrate(f.source, f.blog, { '40-知识库/工具/Node.js 运行时.md': '工具/Nodejs/' });
  assert.equal(manifest.articles.length, 1); assert.equal(manifest.assets.length, 1);
  assert.deepEqual(manifest.policy, POLICY);
  const post = fs.readFileSync(path.join(f.blog, manifest.articles[0].destination), 'utf8');
  assert.match(post, /date: 2025-07-04/); assert.match(post, /permalink: 工具\/Nodejs\//);
  assert.match(post, /项目（未公开）/); assert.match(post, /%E5%B7%A5%E5%85%B7\/Nodejs/);
  assert.equal(manifest.blockedLinks.length, 1);
  assert.ok(!fs.existsSync(path.join(f.blog, 'source/_posts/20-项目')));
  assert.ok(!fs.existsSync(path.join(f.blog, 'source/images/knowledge/private.png')));
  assert.deepEqual(fs.readFileSync(path.join(f.source, '40-知识库/工具/Node.js 运行时.md')), original);
  assert.throws(() => migrate(f.source, f.blog), /already exists/);
});

test('Markdown AST protects fences, nested code, inline code, HTML and escaped brackets', () => {
  const source = '[[Nodejs|别名]]\n\n```md\n[[Nodejs]]\n![[99-附件/遗留/a.png]]\n```\n\n> ```md\n> [[Nodejs]]\n> ```\n\n    [[Nodejs]]\n\n`[[Nodejs]]` \\[[Nodejs]]\n\n<div>[[Nodejs]]</div>\n';
  const current = { source: '40-知识库/test.md', permalink: '工具/Nodejs/', metadata: { title: 'Node' } };
  const result = convertBody(source, current, () => current, () => { throw new Error('Code image must not be read'); }, []);
  assert.equal(result, source.replace('[[Nodejs|别名]]', '[别名](/%E5%B7%A5%E5%85%B7/Nodejs/)'));
});

test('converts heading links, callouts and allowed embeds without transclusion', () => {
  const current = { source: '40-知识库/test.md', permalink: 'knowledge/test/', metadata: { title: 'Test' } };
  const body = '> [!info]+ 导航\n> [[#Some heading|标题]]\n![[Nodejs]]';
  const result = convertBody(body, current, () => current, () => null, []);
  assert.match(result, /> \*\*导航\*\*/); assert.match(result, /#Some-heading/);
  assert.match(result, /\[Test\]\(/); assert.ok(!result.includes('[[Nodejs]]'));
});

test('ordinary Markdown images obey the same asset policy and source-vault web links are blocked', t => {
  const f = fixture(t);
  f.write('40-知识库/test.md', f.note('![safe](99-附件/遗留/a.png)\n![no](99-附件/private.png)\n[project](https://github.com/wliafe/notes/blob/main/20-项目/private.md)\n[docs](https://nodejs.org/)'));
  f.write('99-附件/遗留/a.png', 'image');
  f.write('99-附件/private.png', 'private');
  const m = migrate(f.source, f.blog);
  assert.equal(m.assets.length, 1); assert.equal(m.blockedLinks.length, 2);
  const post = fs.readFileSync(path.join(f.blog, m.articles[0].destination), 'utf8');
  assert.ok(!post.includes('github.com/wliafe/notes')); assert.match(post, /https:\/\/nodejs.org/);
});

test('rejects symlink/traversal outside attachment scope before producing files', t => {
  const f = fixture(t);
  f.write('40-知识库/test.md', f.note('![[99-附件/遗留/../../private.png]]'));
  f.write('private.png', 'private');
  assert.throws(() => migrate(f.source, f.blog), /Outside allowed scope/);
  assert.deepEqual(fs.readdirSync(f.blog), []);
  const g = fixture(t);
  g.write('40-知识库/test.md', g.note('![[99-附件/遗留/leak.png]]'));
  g.write('private.png', 'private');
  fs.mkdirSync(path.join(g.source, '99-附件/遗留'), { recursive: true });
  fs.symlinkSync(path.join(g.source, 'private.png'), path.join(g.source, '99-附件/遗留/leak.png'));
  assert.throws(() => migrate(g.source, g.blog), /outside allowed scope/i);
  assert.deepEqual(fs.readdirSync(g.blog), []);
});

test('rejects source/destination overlap, ambiguous aliases and existing maintained files', t => {
  const f = fixture(t);
  f.write('40-知识库/test.md', f.note('Test'));
  assert.throws(() => migrate(f.source, f.source), /must be separate/);
  f.write('40-知识库/other.md', f.note('Duplicate'));
  assert.throws(() => migrate(f.source, f.blog), /Ambiguous note/);
});

test('keeps directory indexes as comment-free navigation pages', t => {
  const f = fixture(t);
  f.write('40-知识库/知识库.md', '---\ntitle: 知识库\ntype: moc\ncreated: 2026-06-20\n---\n目录');
  const m = migrate(f.source, f.blog);
  assert.equal(m.articles[0].destination, 'source/knowledge/index.md');
  const content = fs.readFileSync(path.join(f.blog, m.articles[0].destination), 'utf8');
  assert.match(content, /layout: page/); assert.match(content, /comments: false/);
});

test('initial migration manifest is complete and build workflow has no notes checkout', () => {
  const root = new URL('../', import.meta.url);
  const m = JSON.parse(fs.readFileSync(new URL('migration/knowledge-manifest.json', root)));
  assert.equal(m.articles.filter(p => p.type === 'note').length, 51);
  assert.equal(m.articles.filter(p => p.type === 'moc').length, 15);
  assert.equal(m.assets.length, 174); assert.equal(m.blockedLinks.length, 3);
  for (const item of [...m.articles, ...m.assets]) {
    assert.ok(item.source.startsWith((item.type ? POLICY.notes : POLICY.assets) + '/'));
    // The manifest is migration provenance, not a lock on future article edits.
    assert.ok(fs.existsSync(new URL(item.destination, root)), item.destination);
  }
  const legacy = JSON.parse(fs.readFileSync(new URL('migration/legacy-permalinks.json', root)));
  assert.equal(Object.keys(legacy).length, 49);
  for (const [source, permalink] of Object.entries(legacy)) assert.equal(m.articles.find(a => a.source === source).permalink, permalink);
  assert.doesNotMatch(fs.readFileSync(new URL('.github/workflows/pages.yml', root), 'utf8'), /wliafe\/notes|Checkout notes/);
});
