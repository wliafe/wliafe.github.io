---
title: Git 版本控制
aliases: []
type: note
created: 2022-03-16
area: Developer Tools
status: active
review: reviewed
tags: []
layout: post
date: 2022-03-16
updated: 2022-03-16
categories:
  - 开发工具
permalink: 工具/Git/
---
> **导航**
> [返回开发工具分类](/categories/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/)

Git作为版本管理工具是每一个程序员必备的技能，学会使用Git对我有很大的帮助。

- 版本管理工具，它可以将我写的代码存档，便于我在已编写好的代码上尝试下一步开发，出现错误时可以及时回退。
- 控制代码上传，在一个项目里，需要上传的代码其实是少数，占用空间并不大，而项目中很大一部分是软件包、执行文件、缓存等，这些文件并不需要上传到GitHub，Git提供了`.gitignore`文件，将不需要上传的文件添加到该文件中，可以避免上传不需要的文件。

当然Git还有其他功能例如团队合作、分支管理等，但目前我只用到上述这些功能，以后用到了会继续更新。



## 安装Git

Git的安装教程网上数不胜数，其中[Git 详细安装教程（详解 Git 安装过程的每一个步骤）](https://blog.csdn.net/mukes/article/details/115693833)这一篇讲的非常详细，虽然他之后也可能会过时，但我仍想在这里引用他，我在这里就只提一下我自己在安装过程中修改的配置。

这是[Git下载地址](https://git-scm.com/)，选择最新版本下载后点击安装。

这里我选择全选

![1.png](/images/knowledge/%E5%B7%A5%E5%85%B7/Git/1.png)

这里我选择用main，这也是主流的选择，因为**Black Lives Matter（黑人的命也是命）**运动，很多人认为master不尊重黑人，因此改为main。

![2.png](/images/knowledge/%E5%B7%A5%E5%85%B7/Git/2.png)

这里我选第二个

![3.png](/images/knowledge/%E5%B7%A5%E5%85%B7/Git/3.png)

之后就一路next直到结束了。

## 配置Git

单击右键，打开Git Bash Here，然后配置提交作者姓名和邮箱。`user.name`、`user.email`用于提交记录，不是远程登录凭据，也不必与账号用户名相同。

配置用户名

```bash
git config --global user.name "<提交作者姓名>"
```

配置用户邮箱

```bash
git config --global user.email "<提交邮箱>"
```

查看用户名

```bash
git config --global user.name
```

查看用户邮箱

```bash
git config --global user.email
```

## Git链接仓库

Git远程认证可以使用SSH密钥，也可以使用HTTPS。GitHub的HTTPS Git操作不再支持账号密码，应使用Git Credential Manager的浏览器登录或个人访问令牌；Gitee以其当前认证要求为准。凭据管理器可以在授权后复用登录。参见[GitHub认证文档](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)。我现在比较喜欢先创建仓库，再clone到本地；普通克隆会自动生成`.git`目录，不需要手动创建。

如下图，获取仓库HTTP网址。

![4.png](/images/knowledge/%E5%B7%A5%E5%85%B7/Git/4.png)

### 直接克隆仓库

```bash
git clone <仓库HTTP网址>
```

<span id="创建-git文件，添加仓库网址"></span>

### 创建`.git`目录，添加仓库网址

初始化Git仓库

```bash
git init
```

添加仓库网址

```bash
git remote add origin <仓库HTTP网址>
```

### 编写代码提交到仓库

获取远程提交并整合到当前分支；`git pull`不是直接覆盖本地文件，存在分歧或本地修改时可能需要处理冲突。先确认当前分支和工作区状态。

```bash
git pull origin main
```

将当前目录下的修改加入暂存区（受`.gitignore`影响）

```bash
git add .
```

提交暂存区内容并添加提交说明

```bash
git commit -m <注释>
```

将本地main分支的提交推送到远程main分支（不会推送未提交的暂存内容）

```bash
git push origin main
```

### 分支管理

查看本地分支

```bash
git branch
```

在本地新建分支

```bash
git branch <分支名>
```

切换本地分支

```bash
git checkout <分支名>
```

删除本地分支

```bash
git branch -d <分支名>
```

### 其他

取消文件或文件夹的版本控制

```bash
git rm -r --cached <要取消版本控制的文件或文件夹>
```

查看文件修改历史

```bash
git blame <file>
```

## Git代理设置

如果要用Git同步GitHub仓库，推荐使用代理客户端软件。

## `.gitignore`文件

`.gitignore`文件用于指定Git不应该跟踪的文件，详细的语法规则可以参考[`.gitignore`的官方文档](https://git-scm.com/docs/gitignore/zh_HANS-CN)。

我一般在创建仓库时使用仓库提供的`.gitignore`文件，或者创建的项目自带`.gitignore`文件，然后我会根据自己的需要添加部分配置。

例如，如果想忽略`node_modules`文件夹，忽略所有`.log`文件，那么就在`.gitignore`文件中添加以下内容：

```conf .gitignore
node_modules/
*.log
```

每一个程序员都应该养成在项目中设置`.gitignore`文件的习惯。

## git配置镜像

下面是历史配置示例，域名可用性和运营方未核实，不建议直接复制。`insteadOf`会改写所有匹配的远程URL，尤其不要将私有仓库或认证请求转给不可信镜像。优先通过官方域名访问，确需镜像时只用于公开仓库并核对来源。已有全局改写可先用`git config --global --get-regexp '^url\..*\.insteadof$'`检查。参见[Git URL改写文档](https://git-scm.com/docs/git-config#Documentation/git-config.txt-urlltbasegtinsteadOf)。

### Github镜像

[镜像链接](https://freevaults.com/github-mirror-daily-updates.html)

命令配置

```bash
git config --global url."https://bgithub.xyz/".insteadOf "https://github.com/"
```

或配置文件配置

```conf .gitconfig
[url "https://bgithub.xyz/"]
    insteadOf = https://github.com/
```

### Hugging Face镜像

命令配置

```bash
git config --global url."https://hf-mirror.com/".insteadOf "https://huggingface.co/"
```

或配置文件配置

```conf .gitconfig
[url "https://hf-mirror.com/"]
    insteadOf = https://huggingface.co/
```
