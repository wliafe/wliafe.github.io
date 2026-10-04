---
title: MyBatis-Plus 持久层
aliases: []
type: note
created: 2022-09-17
area: Backend
status: active
review: reviewed
tags:
  - java
layout: post
date: 2022-09-17
updated: 2022-09-17
categories:
  - 软件工程
permalink: 后端/MyBatis-Plus/
---
> **导航**
> [返回软件工程分类](/categories/%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B/)

MyBatis-Plus是Java后端开发对数据库进行操作的工具，这里是[MyBatis-Plus的官方文档](https://baomidou.com/)，同时这里还有[哔哩哔哩的视频](https://www.bilibili.com/video/BV1Bq4y1f7YD/)可以学习。

主要内容可以根据这两个网址进行学习，以下是对MyBatis-Plus的补充内容。



## 事务管理

### 简介

事务主要用于处理操作量大，复杂度高的数据。比如说，在人员管理系统中，你删除一个人员，你既需要删除人员的基本资料，也要删除和该人员相关的信息，如信箱，文章等等，这样，这些数据库操作语句就构成一个事务！

使用Spring声明式事务时，可以在`@Configuration`类上加`@EnableTransactionManagement`。Spring Boot在满足自动配置条件时通常已启用事务管理，不一定需要重复添加。下面保留旧版MyBatis-Plus配置；3.4.0起应使用`MybatisPlusInterceptor`配合`OptimisticLockerInnerInterceptor`、`PaginationInnerInterceptor`，见[官方插件文档](https://baomidou.com/plugins/)。

```java
/**
 * mybatisplus配置类
 */
//扫描mapper文件夹
@MapperScan("com.sec.mapper")
@EnableTransactionManagement//事务
@Configuration//配置类
public class MybatisPlusConf {


    //配置乐观锁插件
    @Bean
    public OptimisticLockerInterceptor optimisticLockerInterceptor() {
        return new OptimisticLockerInterceptor();
    }

    //配置分页插件
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        PaginationInterceptor paginationInterceptor = new PaginationInterceptor();
        paginationInterceptor.setOverflow(false);
        return paginationInterceptor;
    }
}
```

在Spring管理的service方法上加`@Transactional`声明事务，还需要可用的事务管理器。默认代理模式下，同一个对象内部的自调用不会经过事务代理，不能只加注解就认为事务一定生效。

> **info**
> `@Transactional`默认对`RuntimeException`和`Error`回滚，对受检异常通常不回滚。Spring不会把所有异常都改写为`RuntimeException`；需要对受检异常回滚时，可显式使用`@Transactional(rollbackFor = Exception.class)`。自定义或全局回滚规则也会影响结果，见[Spring事务文档](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)。
>
> 如果在事务方法内部吞掉异常，事务拦截器通常无法据此触发回滚；如果事务已被内部参与者标记为rollback-only，捕获异常也不会让它恢复可提交。

```java
@Transactional
    public void buy() throws Exception {
        try{
        // 扣钱
        } catch (Exception e) {
            // catch了自己处理，也就是异常被自己吞了，外层并不知道，此时也不会回滚
        }
        // 扣库存
    }
```

当我们需要在事务控制的service层类中使用try catch去捕获异常后，就会使事务控制失效，因为该类的异常并没有抛出，就不是触发事务管理机制。怎样才能即使用try catch去捕获异常，而又让出现异常后Spring回滚呢，这里就要用到TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();

```java
//假设这是一个service类的片段

try{
    //出现异常
} catch (Exception e) {
            e.printStackTrace();
           //设置手动回滚
            TransactionAspectSupport.currentTransactionStatus()
                    .setRollbackOnly();
        }
//此时return语句能够执行
return  xxx;
```
