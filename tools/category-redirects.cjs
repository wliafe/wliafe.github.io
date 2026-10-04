const { escapeHTML } = require('hexo-util');

module.exports = function categoryRedirects(aliases, categoryPaths, siteUrl) {
  const existing = new Set(categoryPaths);
  return Object.entries(aliases).map(([from, to]) => {
    if (!from.startsWith('categories/') || !to.startsWith('categories/') || !from.endsWith('/') || !to.endsWith('/') || /(^|\/)\.\.(\/|$)/.test(from + to)) {
      throw new Error(`Invalid category redirect: ${from}`);
    }
    if (existing.has(from) || !existing.has(to)) throw new Error(`Category redirect collision or missing target: ${from}`);
    const target = '/' + to.split('/').map(encodeURIComponent).join('/');
    const href = escapeHTML(target);
    const canonical = escapeHTML(new URL(target, siteUrl).href);
    return {
      path: from + 'index.html',
      data: `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>分类已移动</title><link rel="canonical" href="${canonical}"><meta http-equiv="refresh" content="0;url=${href}"></head><body><p>分类已移动，<a href="${href}">查看新分类</a>。</p></body></html>`
    };
  });
};
