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

test('redirects nine old category URLs to existing new categories with a fallback link', () => {
  const paths = [...Object.values(legacy.categoryRedirects), ...legacy.unchangedCategories];
  const pages = categoryRedirects(legacy.categoryRedirects, paths, 'https://wliafe.github.io');
  assert.equal(pages.length, 9);
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
