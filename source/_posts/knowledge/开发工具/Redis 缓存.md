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
> [返回开发工具分类](/categories/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

Redis是一个开源的内存数据库，它是一个键值对数据库。



## 安装Redis

```bash
apt install redis-server
```

## 配置Redis

修改配置文件`/etc/redis/redis.conf`

设置Redis端口，Redis默认端口为6379，可根据需要修改

![1.png](/images/knowledge/%E5%B7%A5%E5%85%B7/Redis/1.png)

设置Redis密码时使用独立的强随机密码，例如配置`requirepass <强随机密码>`，不要照抄截图中的示例密码。Redis 6及以上还可以用ACL限制不同用户的权限。

![2.png](/images/knowledge/%E5%B7%A5%E5%85%B7/Redis/2.png)

默认保留本机绑定，不要把“注释bind”当作通用远程连接方法。确需远程访问时，绑定实际私有网络地址，仅允许可信客户端通过防火墙访问，配置认证并保留保护模式；不要把6379端口直接暴露到公网。跨不可信网络还需要TLS或受控隧道，密码认证本身不加密数据。参见[Redis安全文档](https://redis.io/docs/latest/operate/oss_and_stack/management/security/)。

![3.png](/images/knowledge/%E5%B7%A5%E5%85%B7/Redis/3.png)

最后要重启Redis才能生效

## Docker创建Redis容器

以下仅用于本机测试。密码写在命令参数中可能进入历史或容器配置，正式部署应通过受控配置/秘密管理提供，不能复用真实生产密码。

```bash
docker run --name <Redis容器名称> -d -p 127.0.0.1:6379:6379 redis --requirepass <Redis密码>
```
