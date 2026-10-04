---
title: Windows 子系统
aliases: []
type: note
created: 2025-05-26
area: Developer Tools
status: active
review: reviewed
tags:
  - windows
  - linux
layout: post
date: 2025-05-26
updated: 2025-05-26
categories:
  - 开发工具
permalink: 工具/Windows Subsystem for Linux (WSL)/
---
> **导航**
> [返回开发工具分类](/categories/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

在Windows上直接编写代码存在不少问题，例如:

- 环境污染: 多个python版本，每个版本不同环境等
- 软件杂而多: 各种软件，多次修改环境变量，导致Windows环境变量乱七八糟
- 运行环境不匹配: 很多软件例如MySQL, Redis等，都比较适合运行在Linux上，但为了在Windows上运行，需要修改环境变量，安装软件，修改配置文件等，非常麻烦

Windows Subsystem for Linux (WSL)就可以很好地解决这些问题。

WSL是微软推出的一个功能，它允许用户在Windows上运行Linux环境，无需手动配置传统虚拟机；其中WSL 2实际上使用托管的轻量虚拟机运行Linux内核。详细介绍见[微软的官方文档](https://learn.microsoft.com/zh-cn/windows/wsl/)和[版本对比](https://learn.microsoft.com/en-us/windows/wsl/compare-versions)。

## WSL安装

以下命令在Windows的PowerShell或命令提示符中运行。首次安装请以管理员身份打开PowerShell，并按提示重启；一键安装要求Windows 10版本2004（内部版本19041）及以上或Windows 11，其他情况见[官方安装说明](https://learn.microsoft.com/en-us/windows/wsl/install)。

```bash
wsl --install
```

## Linux环境

当你执行了WSL安装命令，你的电脑会自动安装一个Linux发行版，默认情况下是Ubuntu，你也可以选择其他的Linux发行版。

### Linux安装

#### 命令安装

```bash
wsl --list --online
wsl --install -d <Linux发行版名称>
```

#### 图形化安装

打开Windows Store，搜索Ubuntu，点击安装。

![1.png](/images/knowledge/%E5%B7%A5%E5%85%B7/Windows%20Subsystem%20for%20Linux%20(WSL)/1.png)

安装完成后，你可以在Windows的开始菜单中找到Ubuntu，点击打开。

### Linux卸载

无论通过命令还是Microsoft Store安装，都可以注销指定发行版。先用`wsl --list --verbose`核对名称。

> **danger**
> `wsl --unregister`会永久删除该发行版的数据、软件和设置，不只是清除注册信息。需要保留数据时，先用`wsl --export <Linux发行版名称> <备份文件.tar>`导出并确认备份可用，再决定是否注销。见[官方命令说明](https://learn.microsoft.com/en-us/windows/wsl/basic-commands#unregister-or-uninstall-a-linux-distribution)。

```bash
wsl --unregister <Linux发行版名称>
```

如果还安装了Microsoft Store中的发行版应用，可再从Windows中卸载该应用。注销发行版和卸载应用是不同操作，不要将注销当作无损修复命令。

#### 出错原因以及解决方案

> **danger**
> Wsl/Service/CreateInstance/MountVhd/HCS/ERROR_FILE_NOT_FOUND

这个错误表示挂载发行版虚拟磁盘时找不到所需文件，不能仅凭错误码认定是卸载时残留注册表。先核对报错中的VHD路径和`wsl --list --verbose`结果，确认磁盘文件是否仍在；若需要保留数据，应先备份并按[官方磁盘排障说明](https://learn.microsoft.com/en-us/windows/wsl/disk-space)检查，不要直接删除注册表或发行版目录。

下面的注册表位置可用于核对发行版名称和`BasePath`，不是建议删除的修复步骤

> **info**
> \HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Lxss\{特定标识符}

可以根据`DistributionName`判断标识符属于哪个发行版，再查看其`BasePath`；存储目录因WSL版本、安装方式和自定义位置而异。

> **danger**
> 不要仅根据目录名称手动删除AppData中的WSL文件。目录可能保存整个Linux文件系统，误删会丢失数据；残留目录也不代表必须删除才能修复。

Microsoft Store安装的发行版常见目录示例

> **info**
> C:\Users\<UserName>\AppData\Local\Packages\(目录名含有Linux发行版名称)

部分新版WSL安装使用的目录示例（命令安装并不保证固定在此位置）

> **info**
> C:\Users\<UserName>\AppData\Local\wsl
