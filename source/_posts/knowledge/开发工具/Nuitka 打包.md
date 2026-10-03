---
title: Nuitka 打包
aliases: []
type: note
created: 2025-08-05
area: Developer Tools
status: active
review: reviewed
tags:
  - python
layout: post
date: 2025-08-05
updated: 2025-08-05
categories:
  - 开发工具
permalink: 工具/Nuitka/
---
> **导航**
> [返回工具索引](/knowledge/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

Nuitka是一个将Python代码编译为C/C++并生成高效可执行文件的工具，显著提升运行性能且无需依赖Python环境。



## 文档

[官方文档](https://nuitka.net/)

关于Nuitka的命令行参数信息我在官方文档并没有找到，这里是[`nuitka --help`文档中文翻译](https://nuitka-doc-zh.erduotong.com/docs/--help.html)

英文命令行参数文档

```bash
nuitka --help
```

## 安装

```bash
uv add nuitka
```

## 编译

```bash
nuitka --onefile --remove-output main.py
```
