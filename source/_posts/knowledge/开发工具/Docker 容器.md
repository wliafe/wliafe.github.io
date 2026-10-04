---
title: Docker 容器
aliases: []
type: note
created: 2022-05-16
area: Developer Tools
status: active
review: reviewed
tags: []
layout: post
date: 2022-05-16
updated: 2022-05-16
categories:
  - 开发工具
permalink: 工具/Docker/
---
> **导航**
> [返回开发工具分类](/categories/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

Docker是一个开源的应用容器引擎，它可以让开发者打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的Linux机器上，也可以实现虚拟化。有关Docker的使用可以参考[Docker官方文档](https://docs.docker.com/)。在[Docker Hub](https://hub.docker.com/)上有很多Docker镜像，其中有官方镜像也有用户上传的镜像，用户可以根据需要下载使用。

本文介绍了我常用几个Docker容器，Docker Desktop for Windows软件，以及其它一些Docker用法。



## Docker容器创建

Nginx容器创建

```bash
docker run --name <Nginx容器名称> -d -p 127.0.0.1:8080:80 nginx:stable-perl
```

> **info**
> 如需随Docker启动容器，可以在创建时指定`--restart=always`，也可以用`docker update --restart=always <容器名称>`修改已有容器。
> 这里将端口绑定到本机回环地址，适合本地测试。省略`127.0.0.1`会默认发布到所有网络接口，开放远程访问前需配置访问控制。

```text
--restart=always
```

## Docker Desktop for Windows

Docker Desktop for Windows由Docker公司提供。在Windows上运行Linux容器时，可使用[WSL 2](/%E5%B7%A5%E5%85%B7/Windows%20Subsystem%20for%20Linux%20(WSL)/)或受支持的其他虚拟化后端，并非所有配置都必须使用WSL。具体要求见[官方安装文档](https://docs.docker.com/desktop/setup/install/windows-install/)。

这是[Docker Desktop for Windows的下载地址](https://www.docker.com/products/docker-desktop/)

## Docker本地和容器之间的文件传输

获取容器ID全称（可选，`docker cp`也接受容器名或短ID）

```bash
docker inspect -f '{{.Id}}' <容器名称>
```

本地文件传输到容器

```bash
docker cp <本地文件路径> <ID全称>:<容器路径>
```

容器文件传输到本地

```bash
docker cp <ID全称>:<容器路径> <本地文件路径>
```

## Docker国内镜像

下面只说明配置格式。只添加自己信任、仍在维护的镜像服务，避免直接复制来源和状态不明的公共镜像列表；不要将私有仓库凭据提供给陌生镜像。修改现有`/etc/docker/daemon.json`时应合并字段，不能覆盖其他配置。`mirror.example.com`是占位地址，需要替换后才能使用。参见[Docker镜像文档](https://docs.docker.com/docker-hub/image-library/mirror/)。

```json daemon.json
{
    "registry-mirrors": [
        "https://mirror.example.com"
    ]
}
```
