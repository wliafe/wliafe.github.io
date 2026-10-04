---
title: C++ 语言
aliases: []
type: note
created: 2021-03-18
area: Programming
status: active
review: reviewed
tags:
  - cpp
layout: post
date: 2021-03-18
updated: 2021-03-18
categories:
  - 编程语言
permalink: 语言/Cpp/
---
> **导航**
> [返回编程语言分类](/categories/%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80/)

C++语言在C语言基础上发展而来，支持面向对象等多种编程方式。C++功能强大，可以编写高效的程序；运行速度和编译后软件大小还取决于具体实现。



## Hello world

C++的第一个程序

```cpp
#include<iostream>
using namespace std;
int main() {
    cout << "Hello world!";
}
```

## 变量

变量提供一个具名的、可供程序操作的存储空间。

对象：对象是指一块能储存数据并具有某种类型的内存空间。

当对象在创建时获得了一个特定的值，我们就说这个对象被初始化了。

> **info**
> 在C++中初始化和赋值不能混为一谈

下面是四种独立的初始化写法，不能在同一作用域中重复定义同名变量。

```cpp
int units_sold = 0;
int units_sold = { 0 };
int units_sold{ 0 };
int units_sold(0);
```

花括号的初始化方法被称为**列表初始化**。

默认初始化：如果我们没有指定初始值，则变量会被默认初始化。

> **info**
> 建议初始化每一个内置类型的变量

### 变量的声明和定义

C++语言支持分离式编译。

为了支持分离式编译，C++语言将声明和定义区分开来。

声明：一个文件想要使用别处定义的名字必须包含对那个名字的声明。

定义：定义负责创建与名字关联的实体。

仅声明而不定义变量时不提供初始化值；例如extern声明若带初始化值，就同时是定义。

> **info**
> 变量只能被定义一次，但是可以被声明多次。

```cpp
extern int i;//这是声明
```

![1.png](/images/knowledge/%E8%AF%AD%E8%A8%80/Cpp/1.png)

![2.png](/images/knowledge/%E8%AF%AD%E8%A8%80/Cpp/2.png)

### 变量名的作用域

局部变量的块作用域通常以花括号为界，此外还有命名空间作用域、类作用域等。

> **info**
> 建议：当你第一次使用变量的时候定义他。

## 基本类型

### 算术类型

算术类型是最基本的类型，是用来存储一个数字，或一个字符的类型，

![3.png](/images/knowledge/%E8%AF%AD%E8%A8%80/Cpp/3.png)

字面值常量：

+ 在程序中，42，就是一个字面值常量，“”，其中的内容也是字面值常量。
+ 不带后缀的十进制整数字面量优先使用int，超出范围时依次考虑long、long long；八进制和十六进制还可能使用无符号类型。
+ 用单引号的单个字符默认为char型，双引号的字符默认为字符串数组型。
+ 浮点数默认为double型。

用前缀和后缀可以定义字面值常量的类型，具体用法如下。

![4.png](/images/knowledge/%E8%AF%AD%E8%A8%80/Cpp/4.png)

上图按C++11整理；从C++20起，u8字符串字面量的元素类型是char8_t。各类型的实际大小与实现有关。

### 复合类型

引用：引用为对象起了另外一个名字，引用类型引用另外一种类型。

引用在定义时就要初始化，引用和被引用的变量指向同一个内存空间。

```cpp
int &refVal=ival;//这是引用
int*&r=p;//r是一个对指针p的引用
```

### const限定符

对于变量来讲，加上const就变成了一个常量，不能通过赋值运算符改变const定义的变量。

对于指针来讲，const分为顶层const和底层const

```cpp
int i=1;
int j=2;
const int *p1;//这是底层const
p1=&i;//不能通过p1修改i的值，但可以让p1指向&j
int *const p2=&i;//这是顶层const，不能改变p2指向的对象，一开始定义就要初始化
```

constexpr：这个变量所声明的值必须是常量表达式。

```cpp
constexpr int *p = nullptr;//指针本身具有顶层const，定义时必须用常量表达式初始化
```

### 处理类型

auto和decltype是两个重要的类型推导工具：auto通常根据初始化表达式推导类型，decltype取得表达式的类型，也可用于声明函数返回类型。

## 命名空间using声明

C++标准库中的许多名字位于std命名空间，例如使用using std::cout后可以省略cout前面的std::。

## 标准库string

定义在string头文件中

使用string类型必须添加头文件

```cpp
#include<string>
```

![5.png](/images/knowledge/%E8%AF%AD%E8%A8%80/Cpp/5.png)

s.size()的返回类型是无符号的string::size_type。与有符号负数混合比较时可能发生无符号转换，结果取决于运算符和值，不能简单地认为一定是true。

C++支持字符串相加，但不能将字面量与字面量相加。

string处理字符的库：cctype头文件

![6.png](/images/knowledge/%E8%AF%AD%E8%A8%80/Cpp/6.png)

## vector类型

定义在vector头文件中

暂不理解，以后再写。

## 迭代器

![7.png](/images/knowledge/%E8%AF%AD%E8%A8%80/Cpp/7.png)

不同类别的迭代器支持的操作不同，例如--iter要求双向或随机访问迭代器。

## 数组

数组与vector相似，都是存放类型相同的对象的容器，但数组大小确定不变，不能随意增加元素。

cstddef头文件：size_t是sizeof结果使用的无符号整数类型，范围有限；ptrdiff_t是同一数组内两个指针相减所得的有符号整数类型。

iterator头文件：begin，end函数

cstring头文件：

![8.png](/images/knowledge/%E8%AF%AD%E8%A8%80/Cpp/8.png)
