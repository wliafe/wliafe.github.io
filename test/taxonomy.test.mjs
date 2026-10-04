import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import yaml from 'js-yaml';
import hexoUtil from 'hexo-util';
import categoryRedirects from '../tools/category-redirects.cjs';

const legacy = JSON.parse(fs.readFileSync(new URL('../migration/legacy-taxonomy.json', import.meta.url)));

test('keeps all eight original tag URL spellings without case-only duplicate routes', () => {
  const config = yaml.load(fs.readFileSync(new URL('../_config.yml', import.meta.url), 'utf8'));
  assert.deepEqual(config.tag_map, legacy.tagSlugs);
  assert.equal(new Set(Object.values(legacy.tagSlugs).map(slug => slug.toLowerCase())).size, 8);
});

test('redirects all old category URLs to existing new categories with a fallback link', () => {
  const paths = [...Object.values(legacy.categoryRedirects), ...legacy.unchangedCategories];
  const pages = categoryRedirects(legacy.categoryRedirects, paths, 'https://wliafe.github.io');
  assert.equal(pages.length, 14);
  for (const page of pages) {
    const html = hexoUtil.unescapeHTML(page.data);
    assert.ok(page.path.startsWith('categories/'));
    assert.match(page.data, /http-equiv="refresh"/);
    assert.match(page.data, /rel="canonical"/);
    assert.match(html, /<a href="\/categories\//);
    assert.match(html, /rel="canonical" href="https:\/\/wliafe.github.io\/categories\//);
    assert.doesNotMatch(page.data, /<script|notes|20-项目/);
  }
});

test('rejects redirects that shadow real category pages or target absent categories', () => {
  assert.throws(() => categoryRedirects({ 'categories/旧/': 'categories/新/' }, ['categories/旧/', 'categories/新/'], 'https://wliafe.github.io'), /collision/);
  assert.throws(() => categoryRedirects({ 'categories/旧/': 'categories/不存在/' }, [], 'https://wliafe.github.io'), /missing target/);
  assert.throws(() => categoryRedirects({ 'categories/../private/': 'categories/新/' }, ['categories/新/'], 'https://wliafe.github.io'), /Invalid/);
});

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(fs.readFileSync(new URL('migration/knowledge-manifest.json', root)));
function frontMatter(item) {
  const content = fs.readFileSync(new URL(item.destination, root), 'utf8');
  return { data: yaml.load(content.split('---')[1]), content };
}

test('all 51 articles retain their published URLs and use one flat category', () => {
  const counts = {};
  for (const item of manifest.articles.filter(item => item.type === 'note')) {
    const { data } = frontMatter(item);
    assert.equal(data.permalink, item.permalink, item.destination);
    assert.equal(data.categories.length, 1, item.destination);
    assert.equal(typeof data.categories[0], 'string');
    counts[data.categories[0]] = (counts[data.categories[0]] || 0) + 1;
  }
  assert.deepEqual(counts, {
    '开发工具': 23, '深度学习': 2, '系统': 4, '编程语言': 4,
    '网络安全': 3, '数据结构与算法': 2, '软件工程': 10, '博客': 2, '网络爬虫': 1
  });
  const theme = yaml.load(fs.readFileSync(new URL('_config.next.yml', root), 'utf8'));
  assert.equal(theme.utterances.issue_term, 'pathname');
  assert.ok(!Object.values(theme.menu).some(value => String(value).includes('/knowledge/')));
});

test('all 15 old directory indexes are comment-free redirects into current categories', () => {
  const categoryPaths = new Set(manifest.articles.filter(item => item.type === 'note')
    .map(item => '/categories/' + frontMatter(item).data.categories[0] + '/'));
  categoryPaths.add('/categories/');
  const indexes = manifest.articles.filter(item => item.type === 'moc');
  assert.equal(indexes.length, 15);
  for (const item of indexes) {
    const { data, content } = frontMatter(item);
    assert.equal(data.permalink, item.permalink);
    assert.equal(data.layout, false);
    assert.equal(data.comments, false);
    const target = content.match(/http-equiv="refresh" content="0;url=([^"]+)"/)[1];
    assert.ok(categoryPaths.has(decodeURIComponent(target)), item.destination);
    assert.ok(content.includes(`rel="canonical" href="https://wliafe.github.io${target}"`));
    assert.ok(content.includes(`<a href="${target}">`));
    assert.doesNotMatch(content, /返回首页（未公开）|\[.*\]\(\/knowledge\//);
    if (item.permalink === 'knowledge/') assert.equal(target, '/categories/');
  }
});

test('legacy aliases point directly to real, flat categories', () => {
  const categoryPaths = new Set(manifest.articles.filter(item => item.type === 'note')
    .map(item => 'categories/' + frontMatter(item).data.categories[0] + '/'));
  assert.equal(categoryPaths.size, 9);
  assert.equal(Object.keys(legacy.categoryRedirects).length, 14);
  for (const [from, to] of Object.entries(legacy.categoryRedirects)) {
    assert.ok(!categoryPaths.has(from), from);
    assert.ok(categoryPaths.has(to), to);
    assert.ok(!Object.hasOwn(legacy.categoryRedirects, to), 'redirect chain: ' + from);
  }
});


test('all article navigation names and links go directly to the current category', () => {
  const directoryPaths = new Set(manifest.articles.filter(item => item.type === 'moc')
    .map(item => '/' + item.permalink));
  for (const item of manifest.articles.filter(item => item.type === 'note')) {
    const { data, content } = frontMatter(item);
    const category = data.categories[0];
    const expected = `> [返回${category}分类](/categories/${encodeURIComponent(category)}/)`;
    assert.ok(content.includes(`> **导航**\n${expected}`), item.destination);
    assert.doesNotMatch(content, /返回[^\n]*索引|返回知识库/);
    for (const match of content.matchAll(/\]\((\/knowledge\/[^\s)]+)\)/g)) {
      assert.ok(!directoryPaths.has(decodeURIComponent(match[1])), 'obsolete directory link: ' + item.destination);
    }
  }
});
