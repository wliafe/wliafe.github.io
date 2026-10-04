---
title: Java 后端
aliases: []
type: note
created: 2022-09-15
area: Backend
status: active
review: reviewed
tags:
  - java
layout: post
date: 2022-09-15
updated: 2022-09-15
categories:
  - 软件工程
permalink: 后端/Java后端/
---
> **导航**
> [返回软件工程分类](/categories/%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B/)

这是一篇Java后端学习的博客，讲述Java的一些配置，文章是基于Ubuntu系统配置的。



## 安装OpenJDK（Java环境）

> **info**
> headless是OpenJDK的无头版本，即没有图形用户界面(GUI)的版本。无头版本通常用于服务器环境或不需要图形界面的应用程序。它们减少了对图形显示环境的依赖，但不代表所有图像处理API都不可用。所以，openjdk-11-jre-headless中的headless表示没有图形界面。

开发和编译Java代码需要JDK，只有JRE不能提供`javac`。下面是Ubuntu软件源提供该版本时的JDK 11安装示例；版本应与项目匹配，例如Spring Boot 3最低要求Java 17。

```bash
sudo apt install openjdk-11-jdk-headless
```

## shell脚本

为了方便且快速地配置Java环境，这里我提供了自己编写的shell脚本，脚本的仓库为[java-web-environment](https://github.com/wliafe/java-web-environment)

## IntelliJ IDEA

IntelliJ IDEA的安装破解方法在我的博客[JetBrains 开发工具](/%E5%B7%A5%E5%85%B7/JetBrains/)里。

## Maven（Java包管理工具）

Maven是Java常用的构建和依赖管理工具之一，这是[Maven官方网站](https://maven.apache.org/)。[MVN Repository](https://mvnrepository.com/)是第三方依赖检索站点，并不是Maven官网，也不保证收录所有仓库中的包。

### Hutool

一个Java后端综合工具，这是他的[官方网址](https://www.hutool.cn/)
