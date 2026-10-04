---
title: ArchLinux 系统
aliases: []
type: note
created: 2022-03-17
area: Systems
status: active
review: reviewed
tags:
  - linux
layout: post
date: 2022-03-17
updated: 2022-03-17
categories:
  - 系统
permalink: 系统/ArchLinux/
---
> **导航**
> [返回系统分类](/categories/%E7%B3%BB%E7%BB%9F/)

ArchLinux系统是我大二尝试折腾的一个系统，说实话，当时折腾这个系统确实有点太早了，我也很快认识到了这个问题，因此写完这篇博客没多久就放弃了，Ubuntu还是香的。

## 章节目录

1. [Arch Linux 安装](/%E7%B3%BB%E7%BB%9F/ArchLinux/#%E5%AE%89%E8%A3%85ArchLinux)
2. [Arch Linux 基础配置](/%E7%B3%BB%E7%BB%9F/ArchLinux/#%E9%85%8D%E7%BD%AEArchlinux)
3. [Arch Linux GNOME 桌面](/%E7%B3%BB%E7%BB%9F/ArchLinux/#Gnome%E5%9B%BE%E5%BD%A2%E5%8C%96%E7%95%8C%E9%9D%A2%E5%AE%89%E8%A3%85)
4. [Arch Linux 软件安装](/%E7%B3%BB%E7%BB%9F/ArchLinux/#%E8%BD%AF%E4%BB%B6%E5%AE%89%E8%A3%85)

## 安装ArchLinux

> **warning**
> 本文保留2022年的虚拟机学习记录，不是适用于所有机器的完整安装指南。实际安装请使用当前ISO并对照[官方安装指南](https://wiki.archlinux.org/title/Installation_guide)。分区、格式化和安装引导会改写磁盘，先备份数据并确认目标盘；下面的`/dev/sda`仅为示例。

### 文章参考

- [Arch Linux 安装使用教程 - ArchTutorial - Arch Linux Studio](https://archlinuxstudio.github.io/ArchLinuxTutorial/#/rookie/archlinux_pre_install)

- [ArchWiki](https://wiki.archlinux.org/)

### 前期准备

- 虚拟机软件：VMware Workstation Lite15.5.5
虚拟机的配置：1个处理器+2核+2G内存+20G存储（不安装图形化界面系统部分只用不到5G，包括图形化界面10G左右，虚拟机配置可自由选择。）网络部分是桥接模式。
- ArchLinux系统：ArchLinux-2022.03.01-x86_64.iso
ArchLinux的U盘启动有点像是一个安全模式，本质上就是一个Linux系统，所以ArchLinux的安装就是用Linux系统安装Linux系统。

### 系统连网

第一步是系统连网，由于是虚拟机安装所以网络基本不用配置，尝试ping通就可。

```bash
ping baidu.com
```

### 分区

分区方案取决于引导模式。下面以传统BIOS启动、GPT分区表和GRUB为例，除swap和根分区（/）外，还需要一个约1MiB、类型为BIOS boot且不格式化的引导分区。UEFI启动则需要EFI系统分区，应改用[ArchWiki对应步骤](https://wiki.archlinux.org/title/GRUB)。

展示分区状态

```bash
lsblk
```

分区

```bash
cfdisk /dev/sda
```

`/dev`存放设备节点，`/dev/sda`是此虚拟机的目标磁盘；真实设备也可能使用`/dev/nvme0n1`等名称，不能只按盘符猜测。

分区表选择GPT。在此示例中，将`/dev/sda1`分为2GiB swap，`/dev/sda2`作为根分区，同时预留约1MiB给`/dev/sda3`并将其类型设为BIOS boot；根分区使用其余空间。不要格式化BIOS boot分区。

格式化分区

```bash
mkswap /dev/sda1
```

```bash
mkfs.ext4 /dev/sda2
```

挂载分区

swap分区不用挂载，但要启动

```bash
swapon /dev/sda1
```

这里的/mnt就是Linux安装好后的根目录

```bash
mount /dev/sda2 /mnt
```

### 更换镜像源

文档参考：[源文档](https://mirrors.ustc.edu.cn/help/index.html)

编辑镜像文件

```bash
vim /etc/pacman.d/mirrorlist
```

在文件中添加镜像源（中国国内镜像源选择一个就可以，这里是清华源）

```text
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
```

保存镜像列表后继续安装。`pacstrap`会同步目标系统的软件包数据库；安装后的系统不要只运行`pacman -Sy`或`-Syy`再单独安装软件，应使用`pacman -Syu`完成整体升级，避免[不受支持的部分升级](https://wiki.archlinux.org/title/System_maintenance#Partial_upgrades_are_unsupported)。

### 下载Arch软件

`base`提供基础用户空间，`linux`是内核，`linux-firmware`提供常见硬件固件；`base-devel`是构建软件所用的工具集，并非基本安装的必选项。`dhcpcd`是DHCP客户端，`vim`是编辑器。这里把它们一起装入新系统，便于后续使用。

安装新系统软件

```bash
pacstrap -K /mnt base base-devel linux linux-firmware dhcpcd vim
```

生成文件系统挂载配置（首次写入使用下例；重复执行会追加重复项，应先检查现有fstab）

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

查看文件系统信息

```bash
cat /mnt/etc/fstab
```

### 进入新系统

这个命令将根目录切换为/mnt，也就是/mnt称为新的根目录(/)

```bash
arch-chroot /mnt
```

### 安装系统引导工具

pacman是Archlinux的包管理器

```bash
pacman -S grub
```

```bash
grub-install --target=i386-pc /dev/sda
```

生成默认配置文件

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

上面的GRUB命令仅适用于传统BIOS模式，并要求前述BIOS boot分区已经存在；不能靠`--force`绕过缺失的分区。

### 为root设置密码

```bash
passwd
```

### 解除U盘挂载，重启虚拟机

```bash
exit
```

```bash
umount -R /mnt
```

```bash
reboot
```

至此，你的Archlinux就安装完成了，下面介绍Archlinux的配置方式

## 配置Archlinux

语言区域设置也会影响命令行程序，应按需要配置；中文字体和输入法则在使用图形界面时另行安装。

查看镜像源，重新配置镜像源

重新配置网络

```bash
systemctl enable --now dhcpcd.service
systemctl status dhcpcd.service
```

### 配置语言区域

编辑`/etc/locale.gen`文件，启用所需UTF-8 locale（例如`en_US.UTF-8 UTF-8`和`zh_CN.UTF-8 UTF-8`），运行`locale-gen`，再在`/etc/locale.conf`中设置默认值，如`LANG=en_US.UTF-8`。生成locale本身不会自动选定默认语言

```bash
vim /etc/locale.gen
```

```bash
locale-gen
```

### 配置时区

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

时间同步

```bash
sudo timedatectl set-ntp true
```

检查时间同步状态

```bash
timedatectl
```

### 设置主机名

编辑文件`/etc/hostname`，将名字加入文件

```bash
vim /etc/hostname
```

编辑文件`/etc/hosts`，将名字加入文件

```bash
vim /etc/hosts
```

文件编辑内容

```text hosts
127.0.0.1   localhost
::1         localhost
127.0.1.1   YourHostName
```

### 中文本地化配置

本文只参考这一个命令，拼音输入法建议ibus，具体就不写了。

```bash
pacman -S wqy-zenhei
```

## Gnome图形化界面安装

### 前期准备

- 订阅结点，参考我的文章[上网](/%E5%B7%A5%E5%85%B7/%E4%B8%8A%E7%BD%91/)

添加软件源（可选的第三方Arch Linux CN仓库，安装GNOME本身不需要它；信任该仓库前请查看其当前说明）

文档参考：[源文档](https://mirrors.ustc.edu.cn/help/index.html)

编辑文件`/etc/pacman.conf`，在文件末尾添加。

```text pacman.conf
[archlinuxcn]
SigLevel = Required DatabaseOptional
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
```

按[Arch Linux CN官方说明](https://github.com/archlinuxcn/repo)初始化其签名密钥，再同步数据库并整体升级。若出现未知签名密钥错误，应按仓库文档解决，不要通过关闭签名校验继续安装。

```bash
sudo pacman -Syu archlinuxcn-keyring
```

### Gnome安装

```bash
sudo pacman -S gnome
```

```bash
systemctl enable gdm
```

### 安装插件

原来的`chrome-gnome-shell`已更名为[gnome-browser-connector](https://archlinux.org/packages/extra/any/gnome-browser-connector/)。它让浏览器通过extensions.gnome.org管理GNOME Shell扩展，并非把Chrome扩展装进GNOME桌面

```bash
sudo pacman -S gnome-browser-connector
```

下载谷歌浏览器，安装[插件](https://extensions.gnome.org)

选择插件推荐：

- Desktop lcons NG(DING)
- Dynamic Panel Transparency
- Tray lcons:Reloaded
- User themes
- Dash To Dock

在Linux本地扩展中将插件打开。

至此Gnome的可视化界面安装和插件的安装结束。

## 软件安装

安装AUR助手yay（下例依赖前面配置并信任的Arch Linux CN仓库；yay不是Arch官方仓库中的包）

```bash
sudo pacman -S yay
```

软件模糊搜索

```bash
sudo pacman -Ss <package-name>
```

```bash
yay <package-name>
```

软件安装

```bash
sudo pacman -S <package-name>
```

```bash
yay -S <package-name>
```
