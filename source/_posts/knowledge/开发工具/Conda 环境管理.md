---
title: Conda 环境管理
aliases: []
type: note
created: 2025-05-25
area: Developer Tools
status: active
review: reviewed
tags:
  - python
layout: post
date: 2025-05-25
updated: 2025-05-25
categories:
  - 开发工具
permalink: 工具/Conda/
---
> **导航**
> [返回开发工具分类](/categories/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

本文主要介绍Conda这个工具，Conda是一个用于管理Python环境的工具，它可以帮助我们创建、管理和切换不同的Python环境，避免环境冲突。同时，Conda还可以作为Python包管理器使用，我们可以使用Conda来安装、升级、卸载Python包。然而，pip也可以作为Python包管理器使用，pip与Conda相比，他的包会更加丰富，因为pip有着更大的开源社区。Conda会解析所选渠道中软件包及其依赖，但不能保证完全没有冲突。混用时建议先使用conda安装依赖，再按需使用pip，并在独立环境中操作。

关于Conda的详细内容，我们可以参考[Conda官方文档](https://docs.conda.io/projects/conda/en/latest/)。

## Miniconda安装

Miniconda的安装比较简单，从[Miniconda官网](https://www.anaconda.com/download/success)下载适用于Windows、macOS或Linux的Miniconda安装包，然后按照安装向导安装即可。

## Conda

### Conda管理

获取版本号

```bash
conda --version
```

conda升级

```bash
conda update conda
```

### Conda环境管理

创建环境

```bash
conda create -n <env-name> [list of package]
```

创建特定python版本的环境

```bash
conda create -n <env-name> python=<version>
```

> **warning**
> `conda create -n <env-name>`通常创建空环境，不会自动复制base的Python；指定`python`而不固定版本时，由渠道、依赖和配置决定可用版本。需要固定版本时显式填写`python=<version>`。

激活环境

```bash
conda activate <env-name>
```

退出当前环境

```bash
conda deactivate
```

复制环境

```bash
conda create -n <new-env-name> --clone <old-env-name>
```

列出所有环境

```bash
conda env list
```

删除环境前先退出该环境，并备份其中自行保存的文件；下面命令会删除整个目标环境。

```bash
conda env remove -n <env-name>
```

### Conda包管理

Conda包管理是在当前环境下进行的，对当前环境的操作并不会影响其他环境。

安装包

```bash
conda install <package-name>
```

安装特定版本的包

```bash
conda install <package-name>=<version>
```

查看已安装包

```bash
conda list
```

卸载包

```bash
conda remove <package-name>
```

更新包

```bash
conda update <package-name>
```

更新所有包

```bash
conda update --all
```

搜索包（可以模糊搜索）

```bash
conda search <search-term>
```
