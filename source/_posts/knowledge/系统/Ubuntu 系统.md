---
title: Ubuntu 系统
aliases: []
type: note
created: 2022-04-19
area: Systems
status: active
review: reviewed
tags:
  - linux
layout: post
date: 2022-04-19
updated: 2022-04-19
categories:
  - 系统
permalink: 系统/Ubuntu/
---
> **导航**
> [返回系统分类](/categories/%E7%B3%BB%E7%BB%9F/)

Ubuntu是一个基于Debian的Linux发行版，它是一个免费的、开源的、社区驱动的操作系统。Ubuntu默认桌面版的桌面环境是GNOME，它是一个基于GTK+的桌面环境，它的特点是简单、易用、美观，本文主要讲Ubuntu的使用。

## 包管理器

Ubuntu常见的软件包管理工具有：apt、apt-cache、apt-get、dpkg。下文修改系统的命令需要root权限，普通用户应在命令前加`sudo`。

### apt包管理器

更新软件包索引（不会直接升级已安装的软件包）

```bash
apt update
```

模糊查询软件包

```bash
apt search <软件包名>
```

安装软件

```bash
apt install <软件包>
```

下载软件源码（需要先启用对应源码仓库，如`deb-src`，普通用户即可执行）

```bash
apt source <软件包>
```

卸载软件

```bash
apt-get remove <软件包>
```

### dpkg包管理器

查看已安装的软件包

```bash
dpkg --list
```

查看指定软件包的信息

```bash
dpkg --list | grep <软件包>
```

## 防火墙

Ubuntu常用的防火墙配置工具是ufw，底层由Linux的netfilter等机制进行包过滤。参见[Ubuntu防火墙文档](https://ubuntu.com/server/docs/firewalls/)。

> **warning**
> 通过SSH远程操作时，先放行实际使用的SSH端口，再启用防火墙或修改默认策略，避免把自己锁在服务器外。下列规则是独立示例，不要从上到下全部执行。

安装防火墙

```bash
apt install ufw
```

防火墙状态

```bash
ufw status
```

开启防火墙

```bash
ufw enable
```

关闭ufw防火墙（会移除其防护规则，仅在明确需要时使用）

```bash
ufw disable
```

查看防火墙版本

```bash
ufw version
```

设置默认允许入站连接（会扩大暴露面，一般不建议）

```bash
ufw default allow incoming
```

设置默认拒绝入站连接，显式允许规则仍可放行

```bash
ufw default deny incoming
```

开启port端口

```bash
ufw allow <port>/tcp
```

添加拒绝port端口的规则（如果已有同端口的允许规则，应检查规则顺序并删除不再需要的允许规则；它不会停止监听该端口的服务）

```bash
ufw deny <port>/tcp
```

展示已有防火墙规则

```bash
ufw status
```

## 切换到root用户

设置或修改root密码（Ubuntu默认锁定root密码；这会改变该状态，日常管理通常直接使用sudo即可）

```bash
sudo passwd root
```

在当前用户临时进入root，使用当前用户的sudo密码

```bash
sudo -s
```

## 配置C/C++环境

```bash
sudo apt install build-essential gdb
```
