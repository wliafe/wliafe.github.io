// Compact home-page summaries without changing the article Markdown or body.
const { stripHTML, escapeHTML } = require('hexo-util');

hexo.extend.filter.register('after_post_render', function(data) {
  if (data.layout !== 'post' || data.description) return data;
  const content = (data.excerpt || data.content).replace(/^\s*<blockquote>[\s\S]*?<\/blockquote>/, '');
  const text = stripHTML(content.replace(/<\/(?:p|h[1-6]|li|pre)>/g, '$& ')).replace(/\s+/g, ' ').trim();
  data.excerpt = `<p>${escapeHTML(text.slice(0, 160))}${text.length > 160 ? '…' : ''}</p>`;
  return data;
}, 20);
