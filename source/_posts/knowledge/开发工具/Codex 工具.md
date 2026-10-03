---
title: Codex 工具
aliases: []
type: note
created: 2026-07-06
area: Developer Tools
status: active
review: reviewed
tags: []
layout: post
date: 2026-07-06
updated: 2026-07-06
categories:
  - 开发工具
permalink: knowledge/开发工具/Codex 工具/
---
> **导航**
> [返回工具索引](/knowledge/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

## Codex Reconnecting 问题

如果 Codex 每次启动或回答前都出现多次 `Reconnecting`，但最后又能正常使用，常见原因是 WebSocket 没有正确走代理。Codex 会先尝试 WebSocket 连接，失败多次后再回退到普通 HTTP，因此会产生等待。

## 方案：让 WebSocket 也走代理

推荐在 Codex 配置目录中创建 `.env` 文件，而不是直接禁用 WebSocket。

macOS / Linux：

```bash
~/.codex/.env
```

Windows：

```text
C:\Users\你的用户名\.codex\.env
```

文件内容：

```env
HTTP_PROXY="http://127.0.0.1:你的代理端口"
HTTPS_PROXY="http://127.0.0.1:你的代理端口"
NO_PROXY="localhost,127.0.0.1,::1"
```

常见端口：

| 代理软件 | 常见端口 |
| --- | --- |
| Clash | `7890` |
| v2rayN | `10808` |

端口必须以本机代理软件实际显示为准。配置完成后重启 Codex。

## 注意事项

- 文件名必须是 `.env`，不是 `.env.txt`。
- 这个方案的重点是保留 WebSocket，并让 WebSocket 握手也能走代理。
- `NO_PROXY` 保留本机地址，避免本地服务访问被代理影响。
- 如果该方案仍无效，再考虑禁用 WebSocket 或使用 TUN 作为兜底方案。

## 来源

- [Codex 每次都要 Reconnecting 5 次？三个方案彻底解决](https://ncepuee.github.io/2026/05/24/Codex-Reconnecting-Fix-2026/)
