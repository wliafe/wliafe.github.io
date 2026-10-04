---
title: Ollama 本地模型
aliases: []
type: note
created: 2024-04-20
area: Developer Tools
status: active
review: reviewed
tags: []
layout: post
date: 2024-04-20
updated: 2024-04-20
categories:
  - 开发工具
permalink: 工具/Ollama/
---
> **导航**
> [返回开发工具分类](/categories/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

Ollama是用于运行和管理大语言模型的工具。可用模型和标签以[官方模型库](https://ollama.com/library)为准，命令参数见[CLI文档](https://docs.ollama.com/cli)。以下`<模型名>`等内容需要替换为实际名称。



## Ollama使用命令

显示模型列表。

```bash
ollama list
```

显示模型的信息

```bash
ollama show <模型名>
```

拉取模型

```bash
ollama pull <模型名>
```

推送模型（需要相应账号/仓库权限，上传前检查模型许可和是否包含私有内容）

```bash
ollama push <用户名>/<模型名>
```

拷贝一个模型

```bash
ollama cp <源模型名> <目标模型名>
```

删除一个模型

```bash
ollama rm <模型名>
```

运行一个模型

```bash
ollama run <模型名>
```
