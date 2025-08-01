---
title: uv
date: 2025-08-01 09:03:15
categories:
    - 工具
tags:
    - Python
---

uv是Python的包管理工具，它可以用来安装、升级、卸载Python包。使用uv可以大大方便项目的管理，他像npm一样建立了项目环境，但又采用软链接的形式减少了空间占用并加快了安装速度。使用uv是未来管理Python项目的趋势。

[uv官方文档](https://docs.astral.sh/uv/)

<!--more-->

## uv常用命令

初始化项目

```bash
uv init
```

安装包

```bash
uv add <package-name>
```

卸载包

```bash
uv remove <package-name>
```

安装项目依赖

```bash
uv sync
```

创建`uv.lock`文件

```bash
uv lock
```

运行项目

```bash
uv run <command>
```

查看项目依赖树

```bash
uv tree
```

构建项目

```bash
uv build
```

发布项目到pypi

```bash
uv publish
```
