---
title: JavaScript 前端
aliases: []
type: note
created: 2023-05-03
area: Frontend
status: active
review: reviewed
tags:
  - javascript
layout: post
date: 2023-05-03
updated: 2023-05-03
categories:
  - 软件工程
permalink: 前端/JavaScript前端/
---
> **导航**
> [返回软件工程分类](/categories/%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B/)

这篇文章主要是记录我前端学习的内容。



## 前端环境搭建

### Node.js（运行JavaScript）

使用Vite等构建工具开发前端项目时，需要安装[Node.js 运行时](/%E5%B7%A5%E5%85%B7/Nodejs/)来运行JavaScript。

### WebStorm（前端最好用的编辑器）

WebStorm的安装破解方法在我的博客[JetBrains 开发工具](/%E5%B7%A5%E5%85%B7/JetBrains/)里。

## Vite 配置方法

下面是Vue项目中`vite.config.js`的独立配置片段，按需要合并到同一份配置中。

### base

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({mode}) => {
    return {
        base: './',
        plugins: [vue()],
    }
})
```

### alias

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({mode}) => {
    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    }
})
```

### 生产环境移除console

选择`terser`压缩时，需要先安装`npm install -D terser`，见[Vite构建选项](https://vite.dev/config/build-options.html#build-minify)。

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({mode}) => {
    return {
        plugins: [vue()],
        build: {
            minify: "terser",
            terserOptions: {
                compress: {
                    // 生产环境移除console
                    drop_console: true,
                    drop_debugger: true
                }
            }
        }
    }
})
```

### 配置proxy代理

`server.proxy`只作用于Vite开发服务器；部署后的代理需要在实际后端或反向代理服务器中配置。

```js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({mode}) => {
    return {
        plugins: [vue()],
        server: {
            proxy: {
                '/api': {
                    target: loadEnv(mode, process.cwd()).VITE_BASE_API,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            }
        },
    }
})

```

### env环境变量配置

创建`.env.development`和`.env.production`两个文件。

客户端需要读取的变量使用`VITE_XXX`，通过`import.meta.env.VITE_XXX`访问。它们会进入前端构建产物，不能放数据库密码、私钥等秘密；详见[Vite环境变量文档](https://vite.dev/guide/env-and-mode)。

## TypeScript

### 引入js组件

TypeScript项目引用JavaScript库时，优先使用库自带的类型声明；没有自带声明且存在对应包时，再安装`@types/xxx`。类型声明提供类型检查，不会把库的JavaScript实现转换成TypeScript。

## highlight

Marked从8.0.0起移除了内置`highlight`选项，可以通过`marked-highlight`搭配highlight.js实现代码高亮，见[Marked迁移说明](https://marked.js.org/using_advanced)。

这是[marked-highlight的GitHub链接](https://github.com/markedjs/marked-highlight)在README中有使用样例，可以复制使用。

## 前端网站

### 前端工具文档

[Vue官方文档](https://cn.vuejs.org/)，[Vite官方文档](https://cn.vitejs.dev/)

[Vue Router官方文档](https://router.vuejs.org/zh/)，[Pinia官方文档](https://pinia.vuejs.org/zh/)

[Element Plus官方文档](https://element-plus.org/zh-CN/)

[Axios官方文档](https://www.axios-http.cn/)，[Fetch文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)

[ECharts文档](https://echarts.apache.org/handbook/zh/get-started/)

[marked.js文档](https://marked.js.org/)，[highlight.js下载地址](https://highlightjs.org/)，[highlight.js预览效果](https://highlightjs.org/static/demo/)

### 图标网站

[阿里巴巴矢量图标](https://www.iconfont.cn/)，[标志客网址](https://www.logomaker.com.cn/)，[标小智网址](https://www.logosc.cn/logo/favicon)

### Api接口网站

[聚合数据网址](https://www.juhe.cn/)
