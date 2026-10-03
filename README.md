# wliafe的博客

## 简介

这里是wliafe的博客，记录我在学习和工作中的一些思考和经验。

## 环境搭建

```bash
npm ci
```

使用 Node.js 22，保持锁文件中的 Hexo 7.3.0 和 NexT 8.27.0。

## 常用命令

创建博客

```bash
npx hexo new -p <文件路径> <文章名>
```

文章直接维护在本仓库的 `source/_posts/` 中。例如：

```bash
npx hexo new -p knowledge/开发工具/新文章 "新文章"
```

在 front matter 填写 `date`、`categories`、`tags`，已经发布的文章保留原有 `permalink`。
图片放在文章同名资源文件夹，或 `source/images/` 中，并使用标准 Markdown 图片链接。
目录导航页位于 `source/knowledge/`，知识库入口是 `/knowledge/`。

本地查看博客

```bash
npm run server
```

测试和仅构建：

```bash
npm test
npm run clean
npm run build
```

`server`、`test` 和 `build` 不发布网站。Pages 工作流仍为手动触发。

## 知识库迁移

本仓库已一次性复制 `40-知识库` 的 51 篇文章、15 篇目录索引，以及它们实际引用的
174 张图片/GIF。源 notes 保持不变；日记、项目、研究等其他目录和未引用附件未迁入。
博客构建和发布不再检出或读取 notes。

迁移清单、允许范围、文件校验值和三个未公开的笔记链接见
[migration/knowledge-manifest.json](migration/knowledge-manifest.json)。
49 个既有文章地址见 [migration/legacy-permalinks.json](migration/legacy-permalinks.json)，
已与原站归档核对。保留这些地址可以继续关联以 `pathname` 为标识的 Utterances 评论。
新文章和索引使用 `/knowledge/` 路径；索引页关闭评论，不进入文章列表。

旧分类/标签地址也保持兼容：八个标签通过 `tag_map` 保留原有 URL 大小写，
九个改名或改变层级的分类生成静态跳转页，系统分类地址保持不变。
对应清单见 [migration/legacy-taxonomy.json](migration/legacy-taxonomy.json)。
这些兼容措施不改文章正文；标签名称仍沿用知识库中的名称。

`tools/migrate-knowledge.mjs` 仅保留作迁移记录和复验工具，**不要在日常构建或写作时重新运行**。
它只枚举允许目录，不沿笔记链接递归，不覆盖现有文件，不下载外部内容。
代码块、行内代码、HTML 中的双链示例保留原样；普通双链、标题链接、图片嵌入和 callout
转换为标准 Markdown。笔记嵌入转换为链接，范围外笔记链接显示为“未公开”。

迁移后请在博客中直接编辑 Markdown 和导航索引；清单中的哈希记录的是初次迁移状态，
不限制之后正常修改文章。
