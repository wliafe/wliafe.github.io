---
title: Redis 缓存
aliases: []
type: note
created: 2022-09-14
area: Developer Tools
status: active
review: reviewed
tags: []
layout: post
date: 2022-09-14
updated: 2022-09-14
categories:
  - 开发工具
permalink: 工具/Redis/
---
> **导航**
> [返回工具索引](/knowledge/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

Redis是一个开源的内存数据库，它是一个键值对数据库。



## 安装Redis

```bash
apt install redis-server
```

## 配置Redis

修改配置文件`/etc/redis/redis.conf`

设置Redis端口，Redis默认端口为6379，可根据需要修改

![1.png](/images/knowledge/%E5%B7%A5%E5%85%B7/Redis/1.png)

设置Redis密码，在配置文件中添加 requirepass Redis.123

![2.png](/images/knowledge/%E5%B7%A5%E5%85%B7/Redis/2.png)

设置Redis远程连接，注释掉 # bind 127.0.0.1

![3.png](/images/knowledge/%E5%B7%A5%E5%85%B7/Redis/3.png)

最后要重启Redis才能生效

## Docker创建Redis容器

```bash
docker run --name <Redis容器名称> -d -p 6379:6379 redis --requirepass <Redis密码>
```
