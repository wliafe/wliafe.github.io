---
title: Spring Security 安全框架
aliases: []
type: note
created: 2022-09-23
area: Backend
status: active
review: reviewed
tags:
  - java
layout: post
date: 2022-09-23
updated: 2022-09-23
categories:
  - 软件工程
permalink: 后端/SpringSecurity/
---
> **导航**
> [返回软件工程分类](/categories/%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B/)

SpringSecurity是Spring安全框架的一种，这里是[哔哩哔哩视频](https://www.bilibili.com/video/BV1mm4y1X7Hc/)，以下内容是对SpringSecurity补充。

这些主要是Spring Security 5.x、Spring Boot 2和`javax.servlet`时期的学习片段，邮箱部分还保留了更早版本的截图，不是可直接部署的完整认证系统。`WebSecurityConfigurerAdapter`从5.7弃用，6.x已移除；升级时还需迁移`antMatchers`、方法安全和Jakarta包，不能只删除父类。参见[官方组件式配置说明](https://spring.io/blog/2022/02/21/spring-security-without-the-websecurityconfigureradapter)。

## 章节目录

1. [Spring Security 无适配器配置](/%E5%90%8E%E7%AB%AF/SpringSecurity/#Spring-Security%E6%9B%BF%E6%8D%A2WebSecurityConfigurerAdapter-Deprecated-%E7%9A%84%E6%96%B9%E6%B3%95)
2. [Spring Security JWT 配置](/%E5%90%8E%E7%AB%AF/SpringSecurity/#Spring-Security-JWT%EF%BC%88JSON-Web-Token%EF%BC%89without-WebSecurityConfigurerAdapter)
3. [邮箱验证码原理](/%E5%90%8E%E7%AB%AF/SpringSecurity/#SpringSecurity%E9%82%AE%E7%AE%B1%E9%AA%8C%E8%AF%81%E7%A0%81%E7%99%BB%E5%BD%95%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F)
4. [邮箱验证码发送接口](/%E5%90%8E%E7%AB%AF/SpringSecurity/#%E5%BC%80%E5%8F%91%E9%82%AE%E7%AE%B1%E9%AA%8C%E8%AF%81%E7%A0%81%E6%8E%A5%E5%8F%A3)
5. [邮箱验证码控制器与前端](/%E5%90%8E%E7%AB%AF/SpringSecurity/#%E4%BF%AE%E6%94%B9ValidateCodeController)
6. [邮箱验证码第一次重构](/%E5%90%8E%E7%AB%AF/SpringSecurity/#%E9%87%8D%E6%9E%84%E4%BB%A3%E7%A0%81%EF%BC%88%E4%B8%80%EF%BC%89)
7. [邮箱登录 AuthenticationToken](/%E5%90%8E%E7%AB%AF/SpringSecurity/#%E6%A0%A1%E9%AA%8C%E9%82%AE%E7%AE%B1%E9%AA%8C%E8%AF%81%E7%A0%81%E5%B9%B6%E7%99%BB%E5%BD%95)
8. [邮箱登录 AuthenticationFilter](/%E5%90%8E%E7%AB%AF/SpringSecurity/#%E7%BC%96%E5%86%99EmailAuthenticationFilter)
9. [邮箱登录 AuthenticationProvider](/%E5%90%8E%E7%AB%AF/SpringSecurity/#%E7%BC%96%E5%86%99EmailCodeAuthenticationProvider)
10. [邮箱验证码过滤器](/%E5%90%8E%E7%AB%AF/SpringSecurity/#%E7%BC%96%E5%86%99EmailCodeFilter)
11. [邮箱登录安全配置](/%E5%90%8E%E7%AB%AF/SpringSecurity/#%E7%BC%96%E5%86%99%E9%85%8D%E7%BD%AE%E7%B1%BBEmailCodeAuthenticationSecurityConfig)
12. [邮箱验证码第二次重构](/%E5%90%8E%E7%AB%AF/SpringSecurity/#%E9%87%8D%E6%9E%84%E4%BB%A3%E7%A0%81%EF%BC%88%E4%BA%8C%EF%BC%89)

## Spring Security替换WebSecurityConfigurerAdapter(Deprecated)的方法

### 简介

在本文中，我将提供一个解决方案来配置Spring安全性，而无需WebSecurityConfigurerAdapter类。从SpringSecurity5.7开始，WebSecurityConfigurerAdapter类已被弃用，Spring团队鼓励用户转向基于组件的安全配置。

### 使用WebSecurityConfigurerAdapter

在WebSecurityConfigurerAdapter类被弃用之前，我们正在编写这样的代码。我们创建了一个Spring Java配置类，它扩展了WebSecurityConfigurerAdapter类并覆盖了几个configure()方法：

```java
@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // configure HTTP security...         
    }
 
    @Override
    public void configure(WebSecurity web) throws Exception {         
        // configure Web security...         
    }      
}
```

从Spring Security 5.7.0-M2开始，WebSecurityConfigurerAdapter类已被弃用，Spring团队鼓励用户转向基于组件的安全配置。

### 没有网络安全配置器适配器

在使用基于组件的 Spring 安全配置的新方法中，您需要遵循以下非常简单的步骤：

+ 删除WebSecurityConfigurerAdapter类（不要扩展WebSecurityConfigurerAdapter）
+ 删除网络安全配置器适配器类的所有重写方法
+ 使用SecurityFilterChain配置HttpSecurity，使用WebSecurityCustomizer配置WebSecurity：

```java
@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
         
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
      // configure HTTP security...
      return http.build();
    }
     
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
          return web -> { /* 按需配置；通常优先用permitAll而不是忽略过滤器链 */ };
    }    
}
```

让我们看一个完整的示例供您参考。

### 没有网络安全的Spring安全性配置器适配器示例

考虑我们在下面使用WebSecurityConfigurerAdapter类进行Spring安全配置，稍后我们将看到如何将此安全配置迁移到基于组件的方法。

```java
package net.javaguides.springboot.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import net.javaguides.springboot.service.UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserService userService;
    
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider auth = new DaoAuthenticationProvider();
        auth.setUserDetailsService(userService);
        auth.setPasswordEncoder(passwordEncoder());
        return auth;
    }
    
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authenticationProvider());
    }
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().antMatchers(
                 "/registration**",
                    "/js/**",
                    "/css/**",
                    "/img/**").permitAll()
        .anyRequest().authenticated()
        .and()
        .formLogin()
        .loginPage("/login")
        .permitAll()
        .and()
        .logout()
        .invalidateHttpSession(true)
        .clearAuthentication(true)
        .logoutRequestMatcher(new AntPathRequestMatcher("/logout", "POST"))
        .logoutSuccessUrl("/login?logout")
        .permitAll();
    }

}
```

接下来，这是没有WebSecurityConfigurerAdapter的基于组件的替代方法：

```java
package net.javaguides.springboot.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SpringSecurity {

//    @Autowired
//    private UserDetailsService userDetailsService;

    @Bean
    public static PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    // configure SecurityFilterChain
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/register/**").permitAll()
                .antMatchers("/index").permitAll()
                .antMatchers("/users").hasRole("ADMIN")
                .anyRequest().authenticated()
                .and()
                .formLogin(
                        form -> form
                                .loginPage("/login")
                                .loginProcessingUrl("/login")
                                .defaultSuccessUrl("/users")
                                .permitAll()
                ).logout(
                        logout -> logout
                                .logoutRequestMatcher(new AntPathRequestMatcher("/logout", "POST"))
                                .permitAll()

                );
        return http.build();
    }

//    @Autowired
//    public void configureGlobal(AuthenticationManagerBuilder builder) throws Exception {
//        builder.userDetailsService(userDetailsService)
//                .passwordEncoder(passwordEncoder());
//    }
}
```

上面的例子仍使用5.x的`authorizeRequests`，表单登录和退出部分用了lambda配置；它并没有使用`authorizeHttpRequests`。表单登录保留默认CSRF保护，登录、注册和POST退出请求都要携带CSRF令牌，见[官方CSRF文档](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)。

> **info**
> 在没有自行配置AuthenticationManagerBuilder或AuthenticationProvider等覆盖默认装配的情况下，可以通过UserDetailsService和PasswordEncoder bean配置用户名密码认证。自定义认证管理器时仍要显式检查它使用了哪些provider，见[UserDetailsService文档](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/user-details-service.html)。

### Spring Security JWT（JSON Web Token）without WebSecurityConfigurerAdapter

下面的`csrf().disable()`仅适用于经过评估、不依赖浏览器自动携带凭证的令牌API；如果JWT放在Cookie中，或仍使用Session/Basic认证，`STATELESS`也不能代替CSRF防护。示例把`GET /api/v1/**`设为公开，只能用于确实可匿名读取的数据。JWT过滤器还必须验证签名、允许的算法、有效期以及所需的issuer/audience，这些实现未在本文给出。

考虑我们有以下的Spring安全性和使用WebSecurityConfigurerAdapter类的JWT配置，稍后我们将看到如何将此安全配置迁移到基于组件的方法。

```java
package com.springboot.blog.config;

import com.springboot.blog.security.CustomUserDetailsService;
import com.springboot.blog.security.JwtAuthenticationEntryPoint;
import com.springboot.blog.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint authenticationEntryPoint;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(){
        return  new JwtAuthenticationFilter();
    }

    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .exceptionHandling()
                .authenticationEntryPoint(authenticationEntryPoint)
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers(HttpMethod.GET, "/api/v1/**").permitAll()
                .antMatchers("/api/v1/auth/**").permitAll()
                .antMatchers("/v2/api-docs/**").permitAll()
                .antMatchers("/swagger-ui/**").permitAll()
                .antMatchers("/swagger-resources/**").permitAll()
                .antMatchers("/swagger-ui.html").permitAll()
                .antMatchers("/webjars/**").permitAll()
                .anyRequest()
                .authenticated();
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    //    @Override
//    @Bean
//    protected UserDetailsService userDetailsService() {
//        UserDetails ramesh = User.builder().username("ramesh").password(passwordEncoder()
//                .encode("password")).roles("USER").build();
//        UserDetails admin = User.builder().username("admin").password(passwordEncoder()
//                .encode("admin")).roles("ADMIN").build();
//        return new InMemoryUserDetailsManager(ramesh, admin);
//    }
}
```

接下来，这是没有WebSecurityConfigurerAdapter的基于组件的替代方法：

```java
package com.springboot.blog.config;

import com.springboot.blog.security.CustomUserDetailsService;
import com.springboot.blog.security.JwtAuthenticationEntryPoint;
import com.springboot.blog.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint authenticationEntryPoint;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(){
        return  new JwtAuthenticationFilter();
    }

    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    protected SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .exceptionHandling()
                .authenticationEntryPoint(authenticationEntryPoint)
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests((authorize) -> authorize
                        .antMatchers(HttpMethod.GET, "/api/v1/**").permitAll()
                        .antMatchers("/api/v1/auth/**").permitAll()
                        .antMatchers("/v2/api-docs/**").permitAll()
                        .antMatchers("/swagger-ui/**").permitAll()
                        .antMatchers("/swagger-resources/**").permitAll()
                        .antMatchers("/swagger-ui.html").permitAll()
                        .antMatchers("/webjars/**").permitAll()
                        .anyRequest()
                        .authenticated()
                );
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }


//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http
//                .csrf().disable()
//                .exceptionHandling()
//                .authenticationEntryPoint(authenticationEntryPoint)
//                .and()
//                .sessionManagement()
//                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                .and()
//                .authorizeRequests()
//                .antMatchers(HttpMethod.GET, "/api/v1/**").permitAll()
//                .antMatchers("/api/v1/auth/**").permitAll()
//                .antMatchers("/v2/api-docs/**").permitAll()
//                .antMatchers("/swagger-ui/**").permitAll()
//                .antMatchers("/swagger-resources/**").permitAll()
//                .antMatchers("/swagger-ui.html").permitAll()
//                .antMatchers("/webjars/**").permitAll()
//                .anyRequest()
//                .authenticated();
//        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
//    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

//    @Override
//    @Bean
//    public AuthenticationManager authenticationManagerBean() throws Exception {
//        return super.authenticationManagerBean();
//    }

    //    @Override
//    @Bean
//    protected UserDetailsService userDetailsService() {
//        UserDetails ramesh = User.builder().username("ramesh").password(passwordEncoder()
//                .encode("password")).roles("USER").build();
//        UserDetails admin = User.builder().username("admin").password(passwordEncoder()
//                .encode("admin")).roles("ADMIN").build();
//        return new InMemoryUserDetailsManager(ramesh, admin);
//    }
}
```

## SpringSecurity邮箱验证码登录配置方式

### 简介

> **安全边界**
> 邮箱验证码必须绑定收件账号、短时有效且单次使用，使用安全随机数，并在服务端对发送和验证按账号/IP限流；前端60秒倒计时不是安全控制。下面补充了邮箱绑定和一次尝试后消费，但仍省略了限流、分布式存储及完整集成测试，不能直接用于生产。重构到Processor时也必须保留这些约束，不能只保存验证码。参见[OWASP验证码安全要求](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)。

实现邮箱认证码登录步骤：

+ 电子邮件原理
+ 开发邮箱验证码接口
+ 校验邮箱验证码并登录
+ 重构代码

### 发送接收电子邮件原理

#### 电子邮件服务器

用户要在Internet上提供电子邮件功能，必须有专门的电子邮件服务器。

邮件服务器就好像是互联网世界的邮局。可以划分为两种类型：

+ SMTP邮件服务器：接收客户端提交的邮件，并向其他邮件服务器转发或接收发给本地用户的邮件。(邮递员)
+ POP3/IMAP邮件服务器：用户帮助用户读取SMTP邮件服务器接收进来的邮件。(门前邮递箱)

#### 电子邮箱

而电子邮箱(163、qq、gmail)其实就是用户在电子邮件服务器上申请的账户

#### 邮件客户端

而邮件客户端(FoxMail、Outlook等)集发送和收发功能于一体，帮助用户将邮件发送给SMTP邮件服务器和从POP3/IMAP邮件服务器读取用户的电子邮件。

#### 邮件传输协议

+ 简单邮件传输协议（Simple Mail Transfer Protocol，SMTP）：定义了客户端和SMTP邮件发送服务器之间，以及两台SMTP邮件服务器之间的通信规则。
+ 邮局协议（Post Office Protocol，POP3）：定义了客户端和POP3邮件接收服务器的通信规则。
+ 互联网消息访问协议（Internet Message Access Protocol，IMAP）：与POP3并列的邮件访问协议，支持在服务器上管理文件夹、邮件状态等，并不是POP3的扩展。

#### 邮件格式

下面的RFC822是早期邮件格式规范，后来由RFC2822、[RFC5322](https://www.rfc-editor.org/info/rfc5322/)接替；MIME则扩展了邮件内容类型和编码。

+ RFC822文档
  + 定义的文件格式包括两个部分：邮件头、邮件体。
+ 复杂邮件体的格式（Multipurpose Internet Mail Extensions，MIME）
  + 可以表达多段平行的文本内容和非文本的邮件内容，例如，在邮件体中内嵌的图像数据和邮件附件等。
  + MIME协议的数据格式也可以避免邮件内容在传输过程中发生信息丢失。
  + MIME协议不是对RFC822邮件格式的升级和替代，而是基于RFC822邮件格式的扩展应用。

一言以蔽之，RFC822定义了邮件内容的格式和邮件头字段的详细细节，MIME协议则是定义了如何在邮件体部分表达出的丰富多样的数据内容。

#### 电子邮件发送和接收流程

![1.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/1.png)

+ 用户A的电子邮箱为：<xx@qq.com>，通过邮件客户端软件写好一封邮件，交到QQ的邮件服务器，这一步使用的协议是SMTP,对应图示的①；
+ QQ邮箱服务器 会根据用户A发送的邮件进行解析，根据收件地址判断是否是自己管辖的账户
  + 如果收件地址也是 QQ邮箱服务器 内，那么会直接存放到自己的存储空间。
  + 如果发送给其他服务器（如163），那么QQ邮箱就会将邮件转发到163邮箱服务器，转发使用SMTP协议，对应图示的②；
+ 163邮箱服务器接收到QQ邮箱服务器转发过来的邮件
  + 会判断收件地址是否在自己内部，发现是自己的账户，那么就会将QQ邮箱转发过来的邮件存放到自己的内部存储空间，对应图示的③；
+ 用户B会通过邮件客户端软件先向163邮箱服务器请求，要求收取自己的邮件，对应图示的④；使用的协议是POP3
+ 163邮箱服务器收到用户B的请求后，会从自己的存储空间中取出B未收取的邮件，对应图示⑤；使用的协议是POP3
+ 163邮箱服务器取出用户B未收取的邮件后，将邮件发给用户B，对应图示的⑥；使用的协议是POP3

### 开发邮箱验证码接口

#### 邮箱服务器打开smtp服务

![2.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/2.png)

![3.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/3.png)

#### 引入依赖

```xml
<!--发送邮件:实现邮箱验证码-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

发送email的依赖，springboot帮我们封装好了

截图是旧版JavaMail依赖，不能据此判断当前版本的实现；依赖应由项目对应的Spring Boot版本管理。

![4.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/4.png)

```yml
spring:
  mail:
    # 使用邮箱服务商提供的SMTP主机；下面按隐式TLS端口配置
    host: ${MAIL_HOST}
    port: ${MAIL_PORT:465}
    # 默认即为smtp
    protocol: smtp
    # 设置用户名
    username: ${MAIL_USERNAME}
    # 使用对应邮箱服务商的SMTP授权码，不要将真实凭证提交到仓库
    password: ${MAIL_PASSWORD}
    properties:
      mail.smtp.auth: true
      mail.smtp.ssl.enable: true
      mail.smtp.ssl.checkserveridentity: true
    # 默认即为utf8
    default-encoding: utf-8
```

这份配置要求服务商支持对应端口的隐式TLS；如果服务商要求STARTTLS，应按其文档同时调整端口与TLS配置，不能只改端口。不要通过关闭证书验证来排障，见[RFC8314](https://www.rfc-editor.org/rfc/rfc8314.html)。

#### 编写EmailCodeSender实现

对springboot的sender进一步封装，通过接口能快速更换api

```java
import cn.vshop.security.core.properties.SecurityProperties;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

/**
 * 邮箱发送类的实现
 *
 * @author alan smith
 * @version 1.0
 * @date 2020/4/6 0:47
 */
@Slf4j
@Setter
public class DefaultEmailCodeSender implements EmailCodeSender {

    @Value("${spring.mail.username}")
    private String from;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SecurityProperties securityProperties;

    /**
     * 简单文本邮件
     */
    @Override
    public void send(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        // 设置邮件主题
        //message.setSubject("登录验证码");
        // 邮件的内容
        message.setText(contentBild(code, securityProperties.getCode().getEmail().getExpireIn()));
        // 设置接收者邮箱
        message.setTo(to);
        // 设置发送者邮箱
        message.setFrom(from);
        // 发送
        mailSender.send(message);
    }

    /**
     * 生成邮箱信息
     */
    private String contentBild(String code, int expireIn) {
        StringBuilder sb = new StringBuilder();
        sb.append("您的验证码:");
        sb.append(code);
        sb.append(",有效时效:");
        sb.append(expireIn);
        return sb.toString();
    }
}
```

#### 编写EmailCodeSender接口

```java
/**
 * 邮箱发送器接口
 *
 * @author alan smith
 * @version 1.0
 * @date 2020/4/6 0:42
 */
public interface EmailCodeSender {
    /**
     * 发送验证码到目标邮箱
     *
     * @param to 目标邮箱
     * @param code  验证码
     */
    void send(String to, String code);
}
```

#### 编写校验码生成器EmailCodeGenerator

```java
import cn.vshop.security.core.properties.SecurityProperties;
import cn.vshop.security.core.validate.code.ValidateCode;
import cn.vshop.security.core.validate.code.ValidateCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import java.security.SecureRandom;

/**
 * @author alan smith
 * @version 1.0
 * @date 2020/4/6 11:33
 */
public class EmailCodeGenerator implements ValidateCodeGenerator {

    @Autowired
    private SecurityProperties securityProperties;

    @Override
    public ValidateCode generate(HttpServletRequest request) {
        return new ValidateCode(getCode(), securityProperties.getCode().getEmail().getExpireIn());
    }

    private final SecureRandom random = new SecureRandom();

    private String getCode() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < securityProperties.getCode().getEmail().getLength(); i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

}
```

#### 修改ValidateCodeController

在ValidateCodeController中添加接口，和相应的依赖

按情况修改前面代码的名称，使代码读起来更加合理

```java
import cn.vshop.security.core.validate.code.email.EmailCodeSender;
import cn.vshop.security.core.validate.code.image.ImageCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.social.connect.web.HttpSessionSessionStrategy;
import org.springframework.social.connect.web.SessionStrategy;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.ServletWebRequest;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author alan smith
 * @version 1.0
 * @date 2020/4/5 1:33
 */
@RestController
public class ValidateCodeController {

    /**
     * 图片校验码信息存入session中的key
     */
    public static final String IMAGE_SESSION_KEY = "SESSION_KEY_IMAGE_CODE";

    /**
     * 邮箱校验码信息存入session中的key
     */
    public static final String EMAIL_SESSION_KEY = "SESSION_KEY_EMAIL_CODE";

    /**
     * 注入接口，接口的实现完成【图片】验证码的生成和封装
     */
    @Autowired
    @Qualifier("imageCodeGenerator")
    private ValidateCodeGenerator imageCodeGenerator;

    /**
     * 注入接口，接口的实现完成【邮箱】验证码的生成和封装
     */
    @Autowired
    @Qualifier("emailCodeGenerator")
    private ValidateCodeGenerator emailCodeGenerator;

    /**
     * 发送邮箱的工具实现
     */
    @Autowired
    @Qualifier("emailCodeSender")
    private EmailCodeSender emailCodeSender ;

    /**
     * Spring 的工具类，用以操作session
     */
    private SessionStrategy sessionStrategy = new HttpSessionSessionStrategy();

    /**
     * 图片验证码接口
     */
    @GetMapping("/code/image")
    public void createCode(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // 生成随机的验证码，并封装为 ImageCode
        ImageCode imageCode = (ImageCode) imageCodeGenerator.generate(request);
        // 获取session，并把键值对存入session
        sessionStrategy.setAttribute(
                // ServletWebRequest 是一个适配器（Adapter），把servlet封装成spring的WebRequest（继承了RequestAttributes）
                // 通过把请求传进来，sessionStrategy会从请求中获取session
                new ServletWebRequest(request),
                // 存入session中的key
                IMAGE_SESSION_KEY,
                // 存入session中的值
                imageCode);
        // javax的io工具包
        // 将BufferedImage以指定格式写入输出流中
        ImageIO.write(
                // 以BufferedImage类型的图片
                imageCode.getImage(),
                // 输出的图片格式
                "JPEG",
                // 输出流，输出到响应体中
                response.getOutputStream());

    }

    /**
     * 邮箱验证码接口
     */
    @PostMapping("/code/email")
    public void createEmailCode(HttpServletRequest request, HttpServletResponse response) throws ServletRequestBindingException {
        String email = ServletRequestUtils.getRequiredStringParameter(request, "email").trim();
        // 实际项目在这里先校验邮箱格式，并执行服务端发送限流
        ValidateCode emailCode = emailCodeGenerator.generate(request);
        emailCodeSender.send(email, emailCode.getCode());
        // 将收件邮箱与验证码作为同一个挑战保存，重新发送会替换旧挑战
        sessionStrategy.setAttribute(new ServletWebRequest(request), EMAIL_SESSION_KEY,
                new java.util.AbstractMap.SimpleImmutableEntry<>(email, emailCode));
    }

    @GetMapping("/csrf")
    public CsrfToken csrf(CsrfToken token) {
        return token;
    }

}
```

#### 打开接口的访问权限

允许匿名访问登录页、`GET /csrf`和`POST /code/email`，但保留CSRF保护。`permitAll`不会跳过CSRF校验，也不要将整个安全过滤器链忽略。本文前端从同源`/csrf`获取令牌，登录和发送验证码时一并提交。

![5.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/5.png)

#### 修改application.yml

把登录的界面改成新写的界面

```yml application.yml
v:
  security:
    browser:
      # 登录页面
      loginPage: /login3.html
```

#### 前端代码

创建新的登录页面 login3.html

![6.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/6.png)

下面修正发送按钮误提交表单、读到旧邮箱值和错误响应仍提示成功的问题。静态登录页先获取CSRF令牌；生产环境还应补充网络重试和可访问性提示。

![7.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/7.png)

```html login3.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>

<h2>邮箱登录</h2>
<form id="loginForm" method="post" action="/authentication/email">
    邮箱: <input type="text" name="email" value="user@example.com"><br>
    验证码:<input type="text" name="emailCode">
    <input type="hidden" id="csrfToken">
    <button type="button" id="sendButton" onclick="sendCode(this)" disabled>发送验证码</button>
    <br>
    <input type="checkbox" value="true" name="remember-me">记住我<br>
    <input type="submit" id="loginButton" value="登录" disabled>
</form>

<script>
    let csrfReady = false;
    document.getElementById("loginForm").addEventListener("submit", event => {
        if (!csrfReady) event.preventDefault();
    });
    fetch('/csrf', { credentials: 'same-origin' })
        .then(response => {
            if (!response.ok) throw new Error('无法获取CSRF令牌');
            return response.json();
        })
        .then(csrf => {
            if (!csrf.parameterName || !csrf.token) throw new Error('CSRF令牌不可用');
            const input = document.getElementById("csrfToken");
            input.name = csrf.parameterName;
            input.value = csrf.token;
            csrfReady = true;
            document.getElementById("sendButton").disabled = false;
            document.getElementById("loginButton").disabled = false;
        })
        .catch(() => alert('无法初始化登录，请刷新重试'));

    function sendCode(o) {
        if (!csrfReady) return;
        const form = new FormData(document.getElementById("loginForm"));
        const csrf = document.getElementById("csrfToken");
        const body = new URLSearchParams();
        body.set('email', form.get('email'));
        body.set(csrf.name, csrf.value);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/code/email');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        o.disabled = true;
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                alert("验证码发送成功!");
                time(o);
            } else {
                o.disabled = false;
                alert("发送失败，请稍后重试");
            }
        };
        xhr.onerror = function () {
            o.disabled = false;
            alert("网络异常，请稍后重试");
        };
        xhr.send(body.toString());
    }

    let wait = 60 ;
    let content = "发送验证码"

    function time(o) {
        if (wait == 0) {
            o.removeAttribute("disabled");
            if (content) o.innerHTML = content;
            wait = 60;
        } else {
            o.setAttribute("disabled", true);
            o.innerHTML = wait + "秒后可以重新发送";
            wait--;
            setTimeout(() => {
                time(o)
            }, 1000);
        }
    }
</script>

</body>
</html>
```

#### 访问测试

<http://localhost:8080/login3.html>

写入邮箱

![8.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/8.png)

### 重构代码（一）

重构思路是用模板方法把代码（分级）抽出

+ 声明ValidateCodeProcessor接口（处理验证码生成整个流程）
  + 生成验证码过程抽象为三步：生成、存储、发送
  + 如果整个验证码逻辑发生改变，只需要借助一级创建一个新接口实现即可。
+ 接口有一个抽象的实现AbstractValidateCodeProcessor
  + 实现两步：生成、存储
  + 其中生成逻辑封装在：ValidateCodeGenerator，根据不同类型认证码给出不同实现
+ 而不一样的部分：发送（邮箱发送、图片发送）则写到子类ImageCodeProcessor和EmailCodeProcessor

![9.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/9.png)

#### 重构抽象类generate方法时，用到Spring常见的开发技巧：依赖查找

因为图形验证码和邮箱验证码的生成逻辑都是封装在ValidateCodeGenerator接口下面，当我们（下图）形式注入时

![10.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/10.png)

spring会把实现了接口的bean，以名字作为key，bean的值作为value存入

当收到请求，会从请求中截取认证类型的部分，调用相应的认证类型的ValidateCodeGenerator

![11.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/11.png)

### 校验邮箱验证码并登录

仿照（下图）用户密码登录流程，给出邮箱验证码验证流程

![12.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/12.png)

要创建下面几个类：

+ EmailCodeFilter：拦截邮件认证请求，校验邮箱认证码是否正确
+ EmailAuthenticationFilter：拦截邮件认证请求，通过邮箱获取角色认证
+ EmailAuthenticationToken：邮箱认证Token，封装邮件登录信息
+ EmailAuthenticaionProvider：能对邮件认证Token处理的Provider解析成UserDetails
+ EmailUserDetailsService：根据邮箱获取UserDetails

因为浏览器和手机端都可能使用邮箱验证，因此写在core模块中。

#### 编写EmailAuthenticationToken

直接复制UsernamePasswordAuthenticationToken，并且去掉Credential(密码)部分即可

![13.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/13.png)

```java
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.SpringSecurityCoreVersion;

import java.util.Collection;

/**
 * 封装登录信息
 * <p>
 * 直接复制 {@link UsernamePasswordAuthenticationToken},并且去掉Credential(密码)部分
 *
 * @author alan smith
 * @version 1.0
 * @date 2020/4/6 22:26
 */
public class EmailCodeAuthenticationToken extends AbstractAuthenticationToken {

    private static final long serialVersionUID = SpringSecurityCoreVersion.SERIAL_VERSION_UID;

    // ~ Instance fields
    // ================================================================================================

    /**
     * 登录前：邮箱
     * 登录后：用户信息
     */
    private final Object principal;

    // ~ Constructors
    // ===================================================================================================

    /**
     * This constructor can be safely used by any code that wishes to create a
     * <code>UsernamePasswordAuthenticationToken</code>, as the {@link #isAuthenticated()}
     * will return <code>false</code>.
     */
    public EmailCodeAuthenticationToken(Object email) {
        super(null);
        this.principal = email;
        setAuthenticated(false);
    }

    /**
     * This constructor should only be used by <code>AuthenticationManager</code> or
     * <code>AuthenticationProvider</code> implementations that are satisfied with
     * producing a trusted (i.e. {@link #isAuthenticated()} = <code>true</code>)
     * authentication token.
     *
     * @param principal
     * @param authorities
     */
    public EmailCodeAuthenticationToken(Object principal, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        super.setAuthenticated(true); // must use super, as we override
    }

    // ~ Methods
    // ========================================================================================================


    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return this.principal;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        if (isAuthenticated) {
            throw new IllegalArgumentException(
                    "Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead");
        }

        super.setAuthenticated(false);
    }

    @Override
    public void eraseCredentials() {
        super.eraseCredentials();
    }

}
```

#### 编写EmailAuthenticationFilter

同样的，复制UsernamePasswordAuthenticationFilter，并改成Email形式

![14.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/14.png)

```java
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 拦截邮箱验证码请求，并且组装Token
 * <p>
 * 直接复制 {@link UsernamePasswordAuthenticationFilter},并作出相依修改
 *
 * @author alan smith
 * @version 1.0
 * @date 2020/4/6 22:46
 */
public class EmailCodeAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    // ~ Static fields/initializers
    // =====================================================================================

    // 请求中携带参数的名字
    public static final String SPRING_SECURITY_FORM_EMAIL_KEY = "email";

    private String emailParameter = SPRING_SECURITY_FORM_EMAIL_KEY;
    private boolean postOnly = true;

    // ~ Constructors
    // ===================================================================================================

    public EmailCodeAuthenticationFilter() {
        super(new AntPathRequestMatcher(
                // 匹配的请求
                "/authentication/email", "POST"));
    }

    // ~ Methods
    // ========================================================================================================

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response) throws AuthenticationException {
        // 判断当前请求是否为POST请求，如果不是就抛出异常
        if (postOnly && !request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException(
                    "Authentication method not supported: " + request.getMethod());
        }

        String email = obtainEmail(request);

        if (email == null) {
            email = "";
        }

        email = email.trim();

        EmailCodeAuthenticationToken authRequest = new EmailCodeAuthenticationToken(email);

        // 把请求信息放入Token，比如说IP、session
        // Allow subclasses to set the "details" property
        setDetails(request, authRequest);

        // 使用AuthenticationManager进行认证流程
        return this.getAuthenticationManager().authenticate(authRequest);
    }


    /**
     * Enables subclasses to override the composition of the username, such as by
     * including additional values and a separator.
     *
     * @param request so that request attributes can be retrieved
     * @return the username that will be presented in the <code>Authentication</code>
     * request token to the <code>AuthenticationManager</code>
     */
    protected String obtainEmail(HttpServletRequest request) {
        return request.getParameter(emailParameter);
    }

    /**
     * Provided so that subclasses may configure what is put into the authentication
     * request's details property.
     *
     * @param request     that an authentication request is being created for
     * @param authRequest the authentication request object that should have its details
     *                    set
     */
    protected void setDetails(HttpServletRequest request, EmailCodeAuthenticationToken authRequest) {
        authRequest.setDetails(authenticationDetailsSource.buildDetails(request));
    }

    /**
     * Sets the parameter name which will be used to obtain the username from the login
     * request.
     *
     * @param emailParameter the parameter name. Defaults to "username".
     */
    public void setEmailParameter(String emailParameter) {
        Assert.hasText(emailParameter, "Username parameter must not be empty or null");
        this.emailParameter = emailParameter;
    }


    /**
     * Defines whether only HTTP POST requests will be allowed by this filter. If set to
     * true, and an authentication request is received which is not a POST request, an
     * exception will be raised immediately and authentication will not be attempted. The
     * <tt>unsuccessfulAuthentication()</tt> method will be called as if handling a failed
     * authentication.
     * <p>
     * Defaults to <tt>true</tt> but may be overridden by subclasses.
     */
    public void setPostOnly(boolean postOnly) {
        this.postOnly = postOnly;
    }

    public final String getEmailParameter() {
        return emailParameter;
    }

}
```

#### 编写EmailCodeAuthenticationProvider

提供对我们自定义的EmailAuthenticationToken的认证提供者。这个Provider本身没有验证码凭证，必须确保所有调用路径都先完成邮箱绑定的验证码验证；不能单独注册后暴露只凭邮箱的登录入口。实际项目宜将挑战校验收敛到Provider内部。

![15.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/15.png)

```java
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AccountStatusUserDetailsChecker;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * 邮箱验证码认证的提供者，
 *
 * @author alan smith
 * @version 1.0
 * @date 2020/4/6 23:05
 */
public class EmailCodeAuthenticationProvider implements AuthenticationProvider {

    private UserDetailsService userDetailsService;
    private final AccountStatusUserDetailsChecker accountChecker = new AccountStatusUserDetailsChecker();

    public void setUserDetailsService(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    /**
     * 认证的主要逻辑
     *
     * @param authentication 我们自定义的 EmailCodeAuthenticationToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        // supports方法通过已经说明token为EmailCodeAuthenticationToken，因此可以强转
        EmailCodeAuthenticationToken authenticationToken = (EmailCodeAuthenticationToken) authentication;
        // 此时principal为email，调用（自定义）UserDetailsService，通过email获取UserDetails
        UserDetails user = userDetailsService.loadUserByUsername((String) authenticationToken.getPrincipal());

        if(user==null){
            // 如果查找不到数据，抛出内部服务异常
            // 由认证失败处理器转换为响应，不要向客户端暴露内部细节
            throw new InternalAuthenticationServiceException("无法获取用户信息") ;
        }

        // 自定义Provider也必须检查账号锁定、禁用和过期状态
        accountChecker.check(user);

        // 重新生成（已认证）Token
        EmailCodeAuthenticationToken authenticationResult = new EmailCodeAuthenticationToken(user, user.getAuthorities());
        // 将（未认证）Token中的IP、session等信息放入（已认证）Token中
        authenticationResult.setDetails(authenticationToken.getDetails());

        return authenticationResult;
    }

    /**
     * 判断是否当前认证请求是否是EmailCodeAuthenticationToken
     *
     * @param authentication 当前的请求Token
     * @return 如果是EmailCodeAuthenticationToken或其子类，则返回true，表示支持当前认证
     */
    @Override
    public boolean supports(Class<?> authentication) {
        return EmailCodeAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
```

#### 编写EmailCodeFilter

拦截邮件认证请求，校验邮箱认证码是否正确

参考之前写的ImageCodeFilter

![16.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/16.png)

```java
import cn.vshop.security.core.properties.SecurityProperties;
import cn.vshop.security.core.validate.code.ValidateCode;
import cn.vshop.security.core.validate.code.ValidateCodeException;
import cn.vshop.security.core.validate.code.ValidateCodeProcessor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.social.connect.web.HttpSessionSessionStrategy;
import org.springframework.social.connect.web.SessionStrategy;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.Map;
import javax.servlet.http.HttpSession;

/**
 * 拦截邮箱认证请求，校验邮箱认证码是否正确
 * <p>
 * 每次请求只拦截一次 OncePerRequestFilter
 * 需要初始化 InitializingBean
 *
 * @author alan smith
 * @version 1.0
 * @date 2020/4/7 0:51
 */
@Slf4j
@Setter
public class EmailCodeFilter extends OncePerRequestFilter implements InitializingBean {

    /**
     * spring的工具类，用来匹配Ant风格路径，如：“/user/*”
     */
    private AntPathMatcher pathMatcher = new AntPathMatcher();

    /**
     * 操作session的工具类
     */
    private SessionStrategy sessionStrategy = new HttpSessionSessionStrategy();

    /**
     * 需要拦截的URL
     * (默认添加 /authentication/email)
     */
    private Set<String> urls = new HashSet<>();

    /**
     * (需要手动注入)
     */
    private SecurityProperties securityProperties;
    private AuthenticationFailureHandler authenticationFailureHandler;

    /**
     * 如果在Spring环境中，会在配置加载后执行
     * （这里需要手动执行）
     *
     * @throws ServletException
     */
    @Override
    public void afterPropertiesSet() throws ServletException {
        super.afterPropertiesSet();
        String[] configUrls = securityProperties.getCode().getEmail().getUrls();
        for (String url : configUrls) {
            urls.add(url);
        }
        urls.add("/authentication/email");

    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 循环判断是否执行过滤
        boolean action = false;
        for (String url : urls) {
            if (pathMatcher.match(url, request.getServletPath())) {
                action = true;
                break;
            }
        }

        // 如果是邮箱校验请求，执行邮箱校验逻辑
        if (action && "POST".equals(request.getMethod())) {
            try {
                validate(new ServletWebRequest(request, response));
            } catch (AuthenticationException e) {
                authenticationFailureHandler.onAuthenticationFailure(request, response, e);
                return;
            }
        }

        // 校验通过or不是email校验请求
        filterChain.doFilter(request, response);
    }

    /**
     * 邮箱校验码存储在session中对应的key
     */
    private final static String SESSION_KEY_EMAIL = "SESSION_KEY_EMAIL_CODE"; // 与发送端保持一致

    /**
     * 校验的逻辑，emailCode
     *
     * @param request
     */
    private void validate(ServletWebRequest request) throws ServletRequestBindingException {
        // 仅演示具有稳定Session对象引用的单JVM流程；生产环境使用原子消费
        HttpSession session = request.getRequest().getSession(false);
        if (session == null) {
            throw new ValidateCodeException("验证码不存在");
        }
        Map.Entry<String, ValidateCode> challenge;
        synchronized (session) {
            challenge = (Map.Entry<String, ValidateCode>) sessionStrategy.getAttribute(request, SESSION_KEY_EMAIL);
            sessionStrategy.removeAttribute(request, SESSION_KEY_EMAIL);
        }
        ValidateCode codeInSession = challenge == null ? null : challenge.getValue();
        String emailInRequest = StringUtils.trimToEmpty(request.getRequest().getParameter("email"));
        // 从request中获取请求参数ValidateCode
        String codeInRequest = ServletRequestUtils.getStringParameter(request.getRequest(), "emailCode");
        if (StringUtils.isBlank(codeInRequest)) {
            throw new ValidateCodeException("验证码的值不能为空");
        }
        if (codeInSession == null) {
            throw new ValidateCodeException("验证码不存在");
        }
        if (!StringUtils.equals(challenge.getKey(), emailInRequest)) {
            throw new ValidateCodeException("验证码与邮箱不匹配");
        }
        if (codeInSession.isExpired()) {
            throw new ValidateCodeException("验证码已过期");
        }
        if (!StringUtils.equalsIgnoreCase(codeInSession.getCode(), codeInRequest)) {
            throw new ValidateCodeException("验证码不匹配");
        }
    }
}
```

`ValidateCodeException`需要继承`AuthenticationException`，才能由这里的失败处理器处理。一次输入错误就会消费当前挑战，需要重新发送；这仍不能代替按账号/IP限流。上面的`synchronized`只适用于同一逻辑Session在本地具有相同对象引用的示例；Servlet容器不保证这一点，正式实现需要稳定的Session mutex或存储层原子消费。分布式部署必须使用共享存储的原子校验/消费，不能依赖本地锁。合并为统一Processor时也要同时保留邮箱绑定和原子消费。

#### 编写配置类EmailCodeAuthenticationSecurityConfig

专门进行EmailCode（邮箱验证码）的配置。Provider在`init`阶段注册，`configure`阶段再取得已经构建的AuthenticationManager并安装过滤器；不要到`configure`中才补Provider。

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import cn.vshop.security.core.properties.SecurityProperties;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

/**
 * 关于邮箱验证码的配置
 * <p>
 * (因为既要在浏览器中用，也要在app中用，因此写在core内)
 *
 * 写好后只需在应用配置(如BrowserSecurityConfig)中导入配置即可生效
 *
 * @author alan smith
 * @version 1.0
 * @date 2020/4/7 1:47
 */
@Component
public class EmailCodeAuthenticationSecurityConfig
        // HttpSecurity关于DefaultSecurityFilterChain的配置适配器
        extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity> {

    @Autowired
    private SecurityProperties securityProperties;
    @Autowired
    private AuthenticationSuccessHandler authenticationSuccessHandler;
    @Autowired
    private AuthenticationFailureHandler authenticationFailureHandler;
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    public void init(HttpSecurity http) throws Exception {
        // 在AuthenticationManager构建前注册Provider
        http.authenticationProvider(emailCodeAuthenticationProvider());
    }

    /**
     * 对FilterChain的配置
     * 同{@link WebSecurityConfigurerAdapter}的configure(HttpSecurity http)
     *
     * @param http 封装http的请求响应，可以操作FilterChain
     * @throws Exception
     */
    @Override
    public void configure(HttpSecurity http) throws Exception {
        EmailCodeFilter codeFilter = new EmailCodeFilter();
        codeFilter.setSecurityProperties(securityProperties);
        codeFilter.setAuthenticationFailureHandler(authenticationFailureHandler);
        codeFilter.afterPropertiesSet();
        // 必须先校验挑战，再进入只读取邮箱的认证过滤器；不要在别处重复注册
        http.addFilterBefore(codeFilter, UsernamePasswordAuthenticationFilter.class);
        http
                // 将我们自定义的filter添加到UsernamePasswordAuthenticationFilter的后面
                // 为什么是后面？
                // 因为其他配置均已UsernamePasswordAuthenticationFilter为基准，把校验码的校验如EmailCodeFilter配置在其之前，
                // 对应的这类的认证过滤器就应配置在其之后
                .addFilterAfter(getEmailCodeAuthenticationFilter(http), UsernamePasswordAuthenticationFilter.class);
    }

    /**
     * 构造邮箱验证码校验过滤器
     *
     * @param http
     */
    private EmailCodeAuthenticationFilter getEmailCodeAuthenticationFilter(HttpSecurity http) {
        // 创建邮箱验证码校验过滤器
        EmailCodeAuthenticationFilter filter = new EmailCodeAuthenticationFilter();
        // 设置认证管理器
        filter.setAuthenticationManager(http.getSharedObject(AuthenticationManager.class));
        // 注册successHandler
        filter.setAuthenticationSuccessHandler(authenticationSuccessHandler);
        // 注册failureHandler
        filter.setAuthenticationFailureHandler(authenticationFailureHandler);
        return filter;
    }

    /**
     * 构造邮箱验证码的provider
     *
     * @return
     */
    private EmailCodeAuthenticationProvider emailCodeAuthenticationProvider() {
        EmailCodeAuthenticationProvider provider = new EmailCodeAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }
}
```

#### 修改BrowserSecurityConfig

在应用配置中导入新加的配置。下图是旧版截图，只参考`apply`的位置，不要复制图中的`csrf().disable()`；邮箱登录依赖Session，必须保留CSRF保护并使用上文的令牌提交方式。

![17.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/17.png)

![18.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/18.png)

#### 登录测试

把两种登录方式放入了同一页面login4.html

#### 不输入验证码，直接邮箱登录

![19.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/19.png)

![20.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/20.png)

随便乱输入

![21.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/21.png)

![22.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/22.png)

输入正确验证码

![23.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/23.png)

![24.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/24.png)

等待60s（验证码过期）

![26.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/26.png)

同时，图片验证码也是可用的

### 重构代码（二）

#### 图形验证码和邮箱验证码重复的配置部分

将重复部分抽出为一个个的类，用apply方法应用其配置，使其生效

![27.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/27.png)

图形和邮箱校验码的校验过滤器（validateFilter）合并为一个。以下截图保留旧重构过程；合并时要同步加入上文的邮箱绑定、单次消费、失败处理和限流，不能直接照搬截图中的旧校验逻辑。

![28.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/28.png)

![29.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/29.png)

![30.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/30.png)

![31.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/31.png)

![32.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/32.png)

![33.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/33.png)

![34.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/34.png)

![35.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/35.png)

![36.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/36.png)

![37.png](/images/knowledge/%E5%90%8E%E7%AB%AF/SpringSecurity/37.png)
