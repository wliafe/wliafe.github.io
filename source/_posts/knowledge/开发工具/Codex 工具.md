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
> [返回开发工具分类](/categories/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

## Codex Reconnecting 问题

如果 Codex 每次启动或回答前都出现多次 `Reconnecting`，可以检查代理和网络连接，但仅凭这个提示不能确定原因。WebSocket重试和HTTPS回退行为与客户端版本、服务端和网络环境有关，应结合日志判断。

## 方案：让 WebSocket 也走代理

以下是针对本机代理的排查办法，并非所有重连问题的通用修复。当前[Codex源码](https://github.com/openai/codex/blob/main/codex-rs/arg0/src/lib.rs)会读取`CODEX_HOME`目录中的`.env`；默认目录如下。若已设置`CODEX_HOME`，应使用实际目录。先备份已有文件，确认代理正在运行，再修改对应配置。

macOS / Linux：

```text
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
- 如果仍无效，先检查日志、代理端口和客户端版本，不要仅凭重连提示关闭安全功能或反复改动网络设置。
- 代理端口变更或不再使用代理后，应移除失效的代理变量；残留配置本身也可能造成连接失败。

## 来源

- [Codex 每次都要 Reconnecting 5 次？三个方案彻底解决](https://ncepuee.github.io/2026/05/24/Codex-Reconnecting-Fix-2026/)
