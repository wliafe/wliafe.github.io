---
title: Ubuntu
date: 2023-04-28 17:45:41
categories:
    - 系统
tags:
    - Linux
---

Ubuntu是一个基于Debian的Linux发行版，它是一个免费的、开源的、社区驱动的操作系统。Ubuntu的桌面环境是GNOME，它是一个基于GTK+的桌面环境，它的特点是简单、易用、美观。

<!-- more -->

## 包管理器

Ubuntu包管理器有：apt, apt-cache, apt-get, dpkg

更新包管理器

```bash
apt update
```

模糊查询软件

```bash
apt search 软件包
```

安装软件

```bash
apt install 软件包
```

下载软件源码

```bash
apt source 软件包
```

卸载软件

```bash
apt-get remove 软件包
```

查看已安装的软件包

```bash
dpkg -l
```

查看软件包的依赖项

```bash
dpkg --list | grep 软件包
```

## 防火墙

Ubuntu防火墙是ufw

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

关闭防火墙

```bash
ufw disable
```

查看防火墙版本

```bash
ufw version
```

默认允许外部主机访问

```bash
ufw default allow
```

默认拒绝外部主机访问

```bash
ufw default deny
```

开启${port}端口

```bash
ufw allow ${port}/tcp
```

关闭${port}端口

```bash
ufw deny ${port}/tcp
```

展示已有防火墙规则

```bash
ufw status
```

## 切换到root用户

修改root密码

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
