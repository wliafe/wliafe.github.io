---
title: pytorch
date: 2025-03-20 17:13:19
categories:
    - 机器学习
tags:
    - Python
---

pytorch是一个基于Python的科学计算库，它主要用于深度学习领域。

<!--more-->

## pytorch安装

### pytorch对应的python版本

安装最新版本的pytorch，可以直接去[官方文档](https://pytorch.ac.cn/)查看所需python版本和安装命令。

需要安装旧版的pytorch，就要查看旧版pytorch对应的python版本，官方提供的版本对照表不在官方文档中，而在GitHub源代码仓库里，这里是[版本对照表](https://github.com/pytorch/pytorch/blob/main/RELEASE.md#release-compatibility-matrix)，这里是[旧版pytorch 的安装命令](https://pytorch.ac.cn/get-started/previous-versions/)。

## 常用pytorch环境

### pytorch 环境

```bash
conda create -n pytorch python=3.10
```

```bash
conda activate pytorch
```

```bash
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128
```

```bash
conda install jupyter
```

```bash
pip3 install pandas matplotlib
```

### limu 环境(d2l 环境)

```bash
conda create -n limu python=3.8
```

```bash
conda activate limu
```

```bash
conda install pytorch==2.1.0 torchvision==0.16.0 torchaudio==2.1.0 pytorch-cuda=12.1 -c pytorch -c nvidia
```

```bash
conda install jupyter==1.0.0
```

```bash
pip3 install d2l==0.17.5
```
