---
title: CMake 构建工具
aliases: []
type: note
created: 2022-03-16
area: Developer Tools
status: active
review: reviewed
tags:
  - cpp
layout: post
date: 2022-03-16
updated: 2022-03-16
categories:
  - 开发工具
permalink: 工具/CMake/
---
> **导航**
> [返回开发工具分类](/categories/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

CMake是一个跨平台的构建系统生成工具，常用于C和C++项目，可以为不同平台生成相应的构建文件。



## CMake的简单使用

下面是一个简单的CMake用法，Windows、Linux和macOS都可以使用；需要先安装对应的编译器和构建工具。

下载CMake软件后，创建文件夹作为一个项目。

在文件夹中新建`CMakeLists.txt`文件。

```text CMakeLists.txt
cmake_minimum_required(VERSION 3.5)#最低CMake版本

project (projectname)# 工程名

#添加源文件
aux_source_directory(${CMAKE_SOURCE_DIR} MAIN_FUNC_SRCS)#源文件目录（项目根目录的绝对路径）


#添加.h文件
include_directories(${CMAKE_SOURCE_DIR})#.h文件目录（项目根目录的绝对路径）


#指定生成目标
add_executable(${PROJECT_NAME} ${MAIN_FUNC_SRCS})
# 参数依次为：生成的可执行文件名、所有源文件
```

CMake命令

```bash
mkdir build
```

```bash
cd build
```

```bash
cmake ..
```

```bash
cmake --build . --config Release
```

`cmake --build`会调用当前生成器对应的构建工具；只有生成Makefile时才直接使用`make`。参见[CMake命令行文档](https://cmake.org/cmake/help/latest/manual/cmake.1.html)。

## 文件目录理想结构

```text
└── ttms
     ├── config
     │     └── config
     ├── src
     │    ├── include
     │    └── main.cpp
     └── CMakeLists.txt
```

## CMake较理想结构

下面是结构模板：必须在`add_library`中填入实际库源文件，或后续用`target_sources`补充；不能把空库模板直接用于构建。如果只有`src/main.cpp`，直接用`add_executable`即可。

```text CMakeLists.txt
cmake_minimum_required(VERSION 3.20.2)
project(SunProject)

set(CMAKE_CXX_STANDARD 14)

add_library(${PROJECT_NAME}-lib
        
        )

add_definitions(
       
)

target_include_directories(${PROJECT_NAME}-lib PUBLIC src)

add_executable(${PROJECT_NAME}-exe src/main.cpp)

target_link_libraries(${PROJECT_NAME}-exe PRIVATE ${PROJECT_NAME}-lib)
```

## add_definitions( )

`-D`是编译器的宏定义选项前缀，不是宏名称的一部分；下面定义的宏名是`CONFIG_FILE`。

CMake文件：

```text CMakeLists.txt
add_definitions(
        -DCONFIG_FILE="${CMAKE_CURRENT_SOURCE_DIR}/config"
)
```

cpp文件：

```cpp
std::ifstream conf(CONFIG_FILE"/config");
```

## CMake说明网站

[CMake菜谱](https://www.bookstack.cn/read/CMake-Cookbook/content-preface-preface-chinese.md)

[GitBook](https://sfumecjf.github.io/cmake-examples-Chinese/)

[CMake 3.21 (中文)](https://runebook.dev/zh-CN/docs/cmake/-index-)
