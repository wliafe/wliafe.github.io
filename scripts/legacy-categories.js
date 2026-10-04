const { categoryRedirects } = require('../migration/legacy-taxonomy.json');
const generate = require('../tools/category-redirects.cjs');

hexo.extend.generator.register('legacy-category-redirects', function(locals) {
  return generate(categoryRedirects, locals.categories.map(category => category.path), this.config.url);
});
