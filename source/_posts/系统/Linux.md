---
title: Linux
date: 2022-04-04 11:36:05
categories:
    - 系统
tags:
    - Linux
---

Linux系统是一种基于UNIX的操作系统，它是免费的、开源的、可定制的、支持多用户、支持多任务的操作系统。Linux系统是流传比较广的操作系统，许多后端任务都是在Linux系统上运行的，作为程序员，学好Linux系统是非常有必要的。

<!--more-->

## 操作系统的核心——内核

本文所说的操作系统是指管理和分配计算机资源的核心层软件。

### 内核的作用

+ 进程调度：Linux属于抢占式多任务操作系统
+ 内存管理：Linux采取虚拟内存管理机制。
  + 进程与进程之间、进程与内核之间彼此隔离
  + 只将进程一部分保存在内存中，降低进程对内存的需求
+ 提供文件系统：允许对文件执行创建、获取、更新、删除操作
+ 创建终止进程：内核可将新程序载入内存，为其提供运行所需的资源
+ 对设备的访问：计算机外接设备可实现计算机与外部世界的通信。内核既为程序访问提供简化版的标准接口，同时还要仲裁多个进程对每一个设备的访问。
+ 联网：内核以用户进程的名义收发网络信息。
+ 提供系统调用应用编程接口(API)：进程可利用内核入口点请求内核去执行各种任务。

### 内核态和用户态

在用户态运行时，CPU只能访问被标记为用户空间的内存。在内核态运行时，CPU既能访问用户空间内存，也能访问内核空间内存。

只有处于内核态时，才能执行某些特定操作，例如：执行宕机指令关闭系统，访问内存管理硬件，以及设备I/O操作的初始化。通过这一设计，确保用户进程既不能访问内核指令和数据结构，也无法执行不利于系统运行的操作。

## shell

shell读取用户输入的命令，执行相应程序响应命令。也称之为命令解释器。

## 用户和组

系统的每个用户都拥有唯一的登录名和与之对应的整数型用户ID。系统密码文件`/etc/passwd`为每个用户都定义有一行记录，记录信息包括：

+ 组ID：用户所属的组的整数型组ID
+ 主目录：用户登录后所居于的初始目录
+ 登录shell：执行解释用户命令的程序名称

用户保存在`/etc/passwd`文件中

用户密码保存在`/etc/shadow`文件中

群组保存在`/etc/group`文件中

冷知识：群组密码保存在`/etc/gshadow`文件中

每一个用户都至少属于一个群组，以用户名命名的群组。

用户一开始登录只拥有初始群组的权限，passwd文件中的第三项就是初始群组(gid)，想要获得其他群组权限就要用newgrp命令获取。

创建用户

```bash
useradd <用户名>
```

良好的创建用户办法

```bash
useradd -r -m -s /bin/bash <用户名>
```

删除用户，但删不干净

```bash
userdel <用户名>
```

删除用户，删的很干净

```bash
userdel -r <用户名>
```

修改用户的初始群组(gid)

```bash
usermod -g <组名> <用户名>
```

改变用户有效群组

```bash
newgrp <组名>
```

查看当前用户所在组

```bash
groups
```

添加一个组

```bash
groupadd <组名>
```

删除一个组

```bash
groupdel <组名>
```

将用户添加到组中

```bash
gpasswd -aG <用户名> <组名>
```

将用户从组中删除

```bash
gpasswd -d <用户名> <组名>
```

更改文件所属组

```bash
chgrp <组名> <文件名>
```

更改文件所有者

```bash
chown <用户名> <文件名>
```

更改文件所有者，包括文件内的文件

```bash
chown -R <用户名> <文件名>
```

更改文件权限

```bash
chmod <权限> <文件>
```

## 文件的所有权和权限

系统把用户分为三类，文件的属主、文件组ID相匹配的属组成员用户级其他用户。可为以上三种用户设置三种权限。

+ 读权限：允许查看文件内容。
+ 写权限：允许修改文件内容。
+ 执行权限：允许执行文件。

也可以针对目录进行权限设置，意义稍有不同。

## 进程

进程内存布局：

+ 文本：程序的指令
+ 数据：程序使用的静态变量
+ 堆：程序可从该区域动态分配额外内存
+ 栈：随函数调用、返回而增减的一片内存，用于为局部变量和函数调用链接信息分配存储空间

### 创建进程和执行程序

进程可以使用系统调用fork来创建一个新进程。调用fork的进程称为父进程，新创建的进程称为子进程。exce函数族与进程相关。

### init进程

系统引导时，内核会创建一个名为init的进程，即所有进程之父，系统所有进程都是由init进程直接或间接创建的。init进程由超级用户权限运行，且不可被杀死（包括超级用户）。只有关闭系统才能结束进程。

### 守护进程

守护进程具有特殊用途，系统创建和处理此类进程的方式与其他进程相同，但以下特征是其所独有的：

+ 守护进程通常在系统引导时启动，直至系统关闭。
+ 守护进程在后台运行，且无控制终端供其读取或写入数据。

### 环境列表

每个进程都会维护一组环境变量，fork创建的新进程会继承父进程的环境变量。在shell中，可使用export命令创建环境变量。

环境变量用途多样。shell定义并使用了一系列变量，HOME（明确定义了用户登录目录的路径名）、变量PATH（指明了用户输入命令后，shell查找与之相应程序时所搜索的目录列表）。

### 进程和程序

程序：

+ 二进制格式标志
+ 机器语言指令
+ 程序入口地址
+ 数据
+ 符号表及重定位表
+ 共享库和动态链接信息
+ 其他信息

进程：进程由用户内存空间和一系列内核数据结构组成

用户内存空间：程序代码及代码所使用的变量

内核数据结构：进程标识号、虚拟内存表、打开文件描述符表、信号传递及处理的有关信息、进程资源使用及限制、当前工作目录和大量的其他信息。

## 内存映射

调用系统函数mmap()的进程，会在其虚拟地址空间中创建一个新的内存映射。

映射分为两类。

+ 文件映射：将文件部分区域映射入调用进程的虚拟内存。映射一旦完成，对文件映射内容的访问则转化为对相应内存区域的字节操作。映射页面会按需自动从文件中加载。
+ 相映成趣的是并无文件与之相对应的匿名映射，其映射页面的内容会被初始化为0。

### 映射共享

两种放式：两个进程都针对某一文件的相同部分加以映射或由fork创建的子进程自父进程处继承映射。

当两个进程共享相同页面时，进程之一对页面内容改动是否为其他进程所见取决于创建映射时所传入的标志参数，若为私有则修改对进程不可见且修改内容不会落实到文件，若为共享，则修改内容对其他进程可见，且修改会落实到文件。
