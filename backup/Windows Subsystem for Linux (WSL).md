在Windows上直接编写代码存在不少问题，例如:

- 环境污染: 多个python版本，每个版本不同环境等
- 软件杂而多: 各种软件，多次修改环境变量，导致Windows环境变量乱七八糟
- 运行环境不匹配: 很多软件例如MySQL, Redis等，都比较适合运行在Linux上，但为了在Windows上运行，需要修改环境变量，安装软件，修改配置文件等，非常麻烦

为了解决这个问题，这里我使用一个软件，两个方案，较好的解决这样的问题。

# Windows Subsystem for Linux (WSL)

WSL是微软推出的一个功能，它允许用户在Windows上运行Linux子系统。WSL可以让用户在Windows上运行Linux命令行工具，同时也可以运行Linux应用程序。WSL的出现，使得用户可以在Windows上运行Linux环境，而不需要安装虚拟机。

[WSL文档](https://learn.microsoft.com/zh-cn/windows/wsl/)可以在官网查看

## WSL 安装

这里只介绍一个安装命令

```bash
wsl --install
```

# Linux 环境

当你执行了WSL安装命令，你的电脑会自动安装一个Linux发行版，默认情况下是Ubuntu，你也可以选择其他的Linux发行版。

## Linux 安装

命令安装

```bash
wsl --install <DistributionName>
```

图形化安装

打开Windows Store，搜索Ubuntu，点击安装。

![Windows Store 安装图](https://github.com/user-attachments/assets/71f6759e-82cf-42e8-80c1-a3b830fcb43a)

安装完成后，你可以在Windows的开始菜单中找到Ubuntu，点击打开。

## Linux 卸载

如果你使用命令安装的话，你可以使用以下命令卸载。

```bash
wsl --unregister <DistributionName>
```

如果你使用图形化安装的话可以使用这个命令格式化Linux

如果你想完全卸载Linux，就必须先使用这个命令注销Linux，目的是将注册表中有关Linux的信息删除，然后在Windows的开始菜单中找到Ubuntu，点击卸载。

### 出错原因以及解决方案

> Wsl/Service/CreateInstance/MountVhd/HCS/ERROR_FILE_NOT_FOUND

出现这个错误的可能原因是你曾经安装过这个Linux发行版，但你没有完全删除，导致注册表中有关Linux的信息没有删除，这时候你需要在注册表中将有关这个Linux的信息删除，然后再安装。

图形化安装的Linux的目录如下

```
C:\Users\<UserName>\AppData\Local\Packages\(目录名含有Linux发行版名称)
```

命令安装的Linux的目录如下

```
C:\Users\<UserName>\AppData\Local\wsl
```

注册表路径如下

```
\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Lxss\{特定标识符}
```

根据注册表内容判断特定标识符属于哪个Linux

还有一种错误是你卸载了图形化安装的Linux，但因为某些原因你的Linux目录某些内容并没有删除，这就需要你手动删除Linux目录。才能解决。

# Docker Desktop for Windows

Docker Desktop for Windows是微软推出的一个功能，它允许用户在Windows上运行Docker。Docker Desktop for Windows可以让用户在Windows上运行Docker容器，同时也可以运行Linux容器。Docker Desktop for Windows的出现，使得用户可以在Windows上运行Docker环境，而不需要安装虚拟机。

Docker Desktop for Windows的Linux环境是通过WSL提供的。

[Docker Desktop for Windows 下载地址](https://www.docker.com/products/docker-desktop/)