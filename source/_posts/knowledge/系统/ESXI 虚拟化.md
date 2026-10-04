---
title: ESXI 虚拟化
aliases: []
type: note
created: 2022-04-04
area: Systems
status: active
review: reviewed
tags:
  - linux
layout: post
date: 2022-04-04
updated: 2022-04-04
categories:
  - 系统
permalink: 系统/ESXI/
---
> **导航**
> [返回系统分类](/categories/%E7%B3%BB%E7%BB%9F/)

ESXI系统是我大二折腾的一个系统，当时痴迷于虚拟机管理系统，所以就着手研究ESXI系统。ESXI作为虚拟机管理系统还是运行相当稳定的。

这是原简介：

为了将一台电脑分为多个服务器，我尝试安装ESXI系统，尝试过许多教程，下面是对教程的整理。



> **warning**
> 下面是旧版ESXi的个人实验记录，涉及第三方驱动、绕过安装检查和重新分区，不是当前版本的通用安装方案。仅在可丢弃的测试机或虚拟机中参考；生产环境应使用受支持的硬件、镜像和配置，并先备份目标磁盘上的数据。

## ESXI下载

[官方镜像与补丁下载说明](https://knowledge.broadcom.com/external/article/372545/download-esxi-patches-and-isos-for-lates.html)

[当时参考的脚本之家教程](https://www.jb51.net/softjc/717737_all.html)

镜像和许可证应从官方渠道获取，不要使用来源不明的共享密钥或修改版镜像。免费版的可用版本和限制以[官方免费Hypervisor说明](https://knowledge.broadcom.com/external/article/399823/vmware-esxi-80-update-3e-now-available-a.html)为准。

ESXi镜像并非完全没有网卡驱动；`No Network Adapters`通常表示当前网卡没有被受支持的驱动识别。在虚拟机中测试也需要选择目标ESXi版本支持的虚拟网卡。

如果你是在实体机上安装，请先核对硬件兼容性，再参考下面的历史记录。

## No Network Adapters问题

### 根据网卡型号选择驱动

设备管理器里找到自己的网卡型号。

![1.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/1.png)

根据网卡型号选择合适的驱动：[网站链接](https://vibsdepot.v-front.de/wiki/index.php/List_of_currently_available_ESXi_packages)

![2.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/2.png)

net55-r8168驱动支持网卡型号（Realtek RTL8111B / RTL8168B / RTL8111/RTL8168 / RTL8111C / RTL8111CP / RTL8111D(L) / RTL8168C / RTL8111DP / RTL8111E / RTL8168E / RTL8111F / RTL8411 / RTL8111G / RTL8111GUS / RTL8411B(N) / RTL8118AS / D-Link DGE-528T）

> **warning**
> 上述[net55-r8168包说明](https://vibsdepot.v-front.de/wiki/index.php/Net55-r8168)仅列出ESXi 5.5至6.7兼容性。ESXi 7.0已移除它依赖的旧vmkapi接口，不能把这套驱动直接封装进7.x/8.x镜像；见[官方兼容性说明](https://knowledge.broadcom.com/external/article/318024)。

### 根据下面的教程将网卡驱动封装到系统中

教程太多了，就不在这里描述了，在这里附[链接](https://blog.whsir.com/post-4462.html)，希望不会失效吧。

下面保留当时的第三方封装镜像链接，仅作历史参考，未验证现有文件的完整性、版本和来源；实际安装优先使用官方镜像与匹配的受信驱动。

[百度网盘资源](https://pan.baidu.com/s/1XuOWRG-kNes3gi2lzyX_CA?pwd=91bb)

### 制作系统启动盘，安装系统

制作启动盘装，这个略过不提。

安装系统可根据脚本之家网站教程进行安装。

## 内存过小，无法安装

### 问题描述

在安装过程中我又遇到了这个问题，我的内存是3.9G的，但他需要的最小内存为4G。

下面的方法只记录旧版安装器中的实验。绕过内存检查不代表硬件达到官方要求，也不能保证稳定运行；不同版本的最低内存和安装器实现不同，不建议照搬。

有些机器本身是4G内存，也许因为部分内存被核显使用，或者需要被BMC/BIOS/UEFI预留，或者其它ESXI系统的计算方法，会在启动时显示为3.xGB内存，这样因为差一点点内存不能使用ESXI系统还是有点可惜的，就可以想办法绕过内存检查脚本。

### 解决方法

U盘启动安装ESXI系统，在黄色背景界面看到内存为3.7GiB(我使用物理ESXI嵌套安装，分配的3.75GiB内存)。

![3.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/3.png)

识别到3.7GiB内存

同意协议，选择安装介质，设置密码等一系列操作后，遇到内存检查错误，提示需要4.00GiB。

![4.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/4.png)

内存检查错误

在上图界面键盘按下ALT+F1，进入下图界面，然后用户名root，密码为空(之前设置的密码还未生效)。

![5.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/5.png)

ALT+F1进入Shell

执行如下命令切换到检查脚本所在目录。

```bash
cd /usr/lib/vmware/weasel/util
```

备份原有脚本，设置权限, 然后vi修改。

```bash
mv upgrade_precheck.py upgrade_precheck.py.bak
```

```bash
cp upgrade_precheck.py.bak upgrade_precheck.py
```

```bash
chmod u+w upgrade_precheck.py
```

```bash
vi upgrade_precheck.py
```

vi编辑器中搜索 “MEM_MIN_SIZE"，在vi中输入/MEM_MIN_SIZE。

![6.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/6.png)

vi搜索MEM_MIN_SIZE

第一次搜索命中结果应该定位到如下图光标位置。

![7.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/7.png)

第一次命中结果

我们要修改的就在下方，使用光标定位到下面或者在搜索时按下n键去找第二次命中应该就是了。

![8.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/8.png)

需要修改的部分

定位光标到第一个4后面，按i进入编辑模式，退格删除4，修改为2。

![9.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/9.png)

修改最小内存为2GiB

按ESC进入命令模式，输入:wq,回车保存退出。

下面的旧版命令会强制终止匹配到的weasel安装器进程，以重新载入检查脚本。先核对匹配进程，且只能在尚未开始写盘的实验安装阶段使用；安装或升级写盘过程中不要强制结束安装器。

```bash
kill -9 $(ps -c | grep weasel | grep -v grep | awk '{print $1}')
```

然后就又回到熟悉的安装界面了。

![10.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/10.png)

回到安装界面

一系列操作后，当时不再出现内存检查错误，而是进入确认安装界面。按F11前务必核对目标磁盘；安装可能重分区并覆盖目标盘数据，不能把目标磁盘与安装U盘混淆。

![11.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/11.png)

没有再次出现内存检查错误

然后就是等进度条啦。

![12.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/12.png)

开始等进度条

安装结束，提示拔下ESXI安装盘，比如U盘，然后回车重启。

![13.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/13.png)

安装完成

ESXI重启加载完毕后。

![14.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/14.png)

重启完毕

访问ESXI网页控制台，当时测试环境能够识别3.75GiB内存并启动；这不代表该配置满足受支持的运行要求。

![15.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/15.png)

3.75GiB正确识别并启动成功

## 如果你的存储太小，那么你有可能遇到新的问题

### 问题描述

我当时在虚拟机安装时，只给它分了40G的空间，安装好后没有可用的数据存储空间。这与ESXi 7的系统存储分区布局有关，不能仅根据系统文件体积判断剩余空间；小磁盘需要先核对版本对应的分区要求。

### 解决方法

在启动显示以下界面时在3秒内按下SHIFT+O组合键（字母O不是数字0）即可修改引导选项。

![16.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/16.png)

下图记录的是旧版实验中用`autoPartitionOSDataSize`调整ESX-OSData分区大小的做法，并非“虚拟闪存”配置。不要直接照搬到其他版本；从ESXi 7.0 Update 1c起，官方提供`systemMediaSize`安装引导选项，例如`systemMediaSize=min`对应约33GB系统存储分区，具体见[官方说明](https://knowledge.broadcom.com/external/article/345195/boot-option-to-configure-the-size-of-esx.html)。

![17.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/17.png)

> **warning**
> 引导参数之间必须用空格分隔。截图中的8GiB设置仅是旧实验记录，不是官方最低存储建议；不要混用旧参数的数值单位和`systemMediaSize`的命名档位。

然后一路安装即可，在部分主机上使用DP接口可能无法看到此界面，可以在按电源后一直按着组合键或者尝试使用VGA接口显示器（如果有的话）。

当时重新安装后，ESX-OSData分区约为8GiB，并腾出了数据存储空间。重新安装会改写分区，必须先备份；今天安装应按对应版本的官方分区方案执行。

![18.png](/images/knowledge/%E7%B3%BB%E7%BB%9F/ESXI/18.png)
