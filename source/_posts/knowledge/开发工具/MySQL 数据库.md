---
title: MySQL 数据库
aliases: []
type: note
created: 2022-04-03
area: Developer Tools
status: active
review: reviewed
tags: []
layout: post
date: 2022-04-03
updated: 2022-04-03
categories:
  - 开发工具
permalink: 工具/MySQL/
---
> **导航**
> [返回开发工具分类](/categories/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

MySQL是一个关系型数据库管理系统，是后端常用的数据库系统，MySQL是开源的，可以免费下载使用。



## MySQL数据库安装

### MySQL安装、服务命令

以下服务命令以使用systemd的Ubuntu为例。安装MySQL服务器：

```bash
sudo apt update
sudo apt install mysql-server
```

启动MySQL服务

```bash
sudo systemctl start mysql
```

或

```bash
sudo service mysql start
```

重启MySQL服务

```bash
sudo service mysql restart
```

停止MySQL服务

```bash
sudo service mysql stop
```

显示MySQL状态

```bash
sudo service mysql status
```

设置MySQL服务开机自启动

```bash
sudo systemctl enable mysql
```

Ubuntu默认socket认证下，进入本机数据库：

```bash
sudo mysql
```

已创建密码认证账号时，可按实际主机和账号连接：

```bash
mysql -h <主机IP> -u <数据库用户名> -p
```

退出

```bash
exit
```

### 配置MySQL远程登录

修改`/etc/mysql/mysql.conf.d/mysqld.cnf`配置文件。

默认保留`bind-address = 127.0.0.1`，只允许本机访问。确需远程连接时，绑定服务器实际的私有网络地址，并配置防火墙只允许可信客户端；还需创建最小权限的业务账号，不要直接开放root远程登录。监听地址改变不等于自动获得登录权限。参见[Ubuntu MySQL配置](https://ubuntu.com/server/docs/how-to/databases/install-mysql/)。

修改完成保存后，需要重启MySQL服务才会生效

MySQL默认端口3306

### 配置MySQL

运行MySQL初始化安全脚本

```bash
mysql_secure_installation
```

#### 脚本报错

错误样例

> **danger**
> ... Failed! Error: SET PASSWORD has no significance for user 'root'@'localhost' as the authentication method used doesn't store authentication data in the MySQL server. Please consider using ALTER USER instead if you want to change authentication parameters.

先检查root账号当前的认证插件，不要为了运行脚本而盲目降级认证。在Ubuntu默认socket认证配置下，可尝试使用`sudo mysql`管理本机数据库。

```sql
SELECT user, host, plugin FROM mysql.user WHERE user = 'root';
```

旧教程中的`mysql_native_password`已在MySQL 8.4默认禁用、9.0移除。是否调整root认证应结合已安装版本和实际需求，不能使用固定示例弱密码。参见[MySQL认证插件文档](https://dev.mysql.com/doc/refman/8.4/en/native-pluggable-authentication.html)。

## 常用SQL命令

展示所有数据库

```sql
show databases;
```

使用数据库

```sql
use <数据库名称>;
```

展示当前数据库所有表

```sql
show tables;
```

展示表结构

```sql
desc <表名称>;
```

## Docker创建MySQL容器

下面是本机测试示例，密码需自行替换且不要复用正式凭据。环境变量可被拥有Docker管理权限的人查看；正式部署应采用受控的秘密管理和持久化卷，并固定适用的镜像版本。

```bash
docker run --name <MySQL容器名称> -e MYSQL_ROOT_PASSWORD=<Mysql密码> -d -p 127.0.0.1:3306:3306 mysql:8.4
```

## MySQL数据库导入导出

下面的`-p`不直接跟密码，回车后交互输入，避免密码进入命令历史。原先`-p <密码>`写法还会把空格后的内容误当成其他参数。导入前备份目标数据库，检查SQL是否包含删除或覆盖操作。参见[MySQL密码安全说明](https://dev.mysql.com/doc/refman/8.4/en/password-security-user.html)。

### MySQL数据库导出数据和表结构

```bash
mysqldump -u <用户名> -p <数据库名> > <数据库名>.sql
```

### MySQL数据库导出表结构

```bash
mysqldump -u <用户名> -p -d <数据库名> > <数据库名>.sql
```

### MySQL数据库导入.sql文件

```bash
mysql -u <用户名> -p <数据库名> < <数据库名>.sql
```

数据库中命令方式导入

选择数据库

```sql
use <数据库名称>;
```

导入数据（注意sql文件的路径）

```sql
source <sql文件路径>;
```
