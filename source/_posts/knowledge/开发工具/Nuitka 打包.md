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
> [返回开发工具分类](/categories/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

Nuitka是Python编译器，可以生成可执行文件。性能收益取决于程序和依赖，不能保证显著加速；只有使用`standalone`或`onefile`等分发模式并正确收集依赖时，目标机器才可不单独安装Python。



## 文档

[官方文档](https://nuitka.net/)

命令行选项可查[官方用户手册](https://nuitka.net/user-documentation/user-manual.html)及当前版本的`--help`。也可参考[`uv run python -m nuitka --help`文档中文翻译](https://nuitka-doc-zh.erduotong.com/docs/--help.html)

英文命令行参数文档

```bash
uv run python -m nuitka --help
```

## 安装

```bash
uv add nuitka
```

## 编译

```bash
uv run python -m nuitka --onefile --remove-output main.py
```
