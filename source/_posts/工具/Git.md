---
title: Git
date: 2022-03-16 09:15:57
categories:
    - 工具
tags:
    - GitHub
    - Gitee
---

Git作为版本管理工具是每一个程序员必备的技能，学会使用Git对我有很大的帮助。

- 版本管理工具，它可以将我写的代码存档，便于我在已编写好的代码上尝试下一步开发，出现错误时可以及时回退。
- 控制代码上传，在一个项目里，需要上传的代码其实是少数，占用空间并不大，而项目中很大一部分是软件包、执行文件、缓存等，这些文件并不需要上传到GitHub，Git提供了`.gitignore`文件，将不需要上传的文件添加到该文件中，可以避免上传不需要的文件。

当然Git还有其他功能例如团队合作、分支管理等，但目前我只用到上述这些功能，以后用到了会继续更新。

<!--more-->

## 安装Git

Git的安装教程网上数不胜数，其中[Git 详细安装教程（详解 Git 安装过程的每一个步骤）](https://blog.csdn.net/mukes/article/details/115693833)这一篇讲的非常详细，虽然他之后也可能会过时，但我仍想在这里引用他，我在这里就只提一下我自己在安装过程中修改的配置。

这是[Git下载地址](https://git-scm.com/)，选择最新版本下载后点击安装。

这里我选择全选

![Git选择安装组件](1.png)

这里我选择用main，这也是主流的选择，因为**Black Lives Matter（黑人的命也是命）**运动，很多人认为master不尊重黑人，因此改为main。

![初始化仓库主干名](2.png)

这里我选第二个

![Git 调整环境变量](3.png)

之后就一路next直到结束了。

## 配置Git

单机右键，打开Git Bush Here然后通过输入命令配置用户名和邮箱。

配置用户名

```bash
git config --global user.name <仓库的用户名>
```

配置用户邮箱

```bash
git config --global user.email <仓库的绑定邮箱>
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

一般的选择是使用ssh公私钥，但是现在可以直接使用账号密码登录的方式上传代码（无论是GitHub还是Gitee），只需要一次登录就可以上传多次，因此我不再配置ssh了，至于创建`.git`文件，我现在比较喜欢先创建仓库，然后clone仓库，克隆下来的仓库自带`.git`文件，不需要自己创建。

如下图，获取仓库HTTP网址。

![仓库HTTP网址](4.png)

### 直接克隆仓库

```bash
git clone <仓库HTTP网址>
```

### 创建`.git`文件，添加仓库网址

创建Git文件

```bash
git init
```

添加仓库网址

```bash
git remote add origin <仓库HTTP网址>
```

### 编写代码提交到仓库

从仓库中拉取文件覆盖本地文件夹

```bash
git pull origin main
```

添加本地的所有文件放入缓存区

```bash
git add .
```

为放入缓存中的文件添加说明

```bash
git commit -m <注释>
```

上传缓存中的文件到远程仓库

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

```txt .gitignore
node_modules/
*.log
```

每一个程序员都应该养成在项目中设置`.gitignore`文件的习惯。

## 我的仓库管理体系

先简单介绍一下我的仓库管理办法，由于墙的缘故，GitHub时不时无法访问，而我并不希望我的代码管理依赖于代理软件是否好用，因此有了现在的仓库管理体系，简单的说就是利用Gitee的仓库镜像管理功能，将国内的Gitee仓库作为GitHub的加速器，让本地项目直接上传到Gitee，让Gitee帮忙上传到GitHub，这样除了在配置仓库时需要代理软件访问GitHub，在项目开发中就不需要了。

### Gitee仓库创建

当创建一个新项目时，我会在国内的Gitee仓库建立项目，这并不需要代理软件。

![Gitee仓库创建](5.png)

填写仓库信息，根据情况选择开源或私有（对Gitee来说无所谓，反正没人看，但选择私有可能会少些麻烦），我一般也会选择初始化仓库，添加`.gitignore`文件，添加开源协议（开源协议可以根据自己的喜好选），README文件我也会加上，项目写到后期总要介绍的，哪怕只是给未来的自己看。

![Gitee新建仓库信息填写](6.png)

填写完成后，点击创建即可，创建好的仓库是这样的。

![Gitee仓库截图](7.png)

之后就是像前文提到的获取仓库http地址，将仓库地址克隆到本地了。

到这一步，全程没有使用代理软件，我的项目开发也可以步入正轨了，但当我想将项目放到GitHub上时，就需要进行下面的操作，运气好的话可能也不需要代理软件。

### Gitee联动GitHub

打开新建好的仓库，点击管理，选择仓库镜像管理，点击添加镜像。

![Gitee镜像仓库管理](8.png)

#### GitHub导入Gitee仓库

保持页面打开，然后打开GitHub，选择导入仓库。

![GitHub导入仓库](9.png)

填写Gitee仓库信息，最后点击导入。

![GitHub导入仓库填写信息](10.png)

#### 获取GitHub私人令牌

打开GitHub个人设置。

![打开GitHub个人设置](11.png)

选择开发者设置。

![GitHub私人令牌](12.png)

点击创建新令牌。

![创建新令牌](13.png)

填写令牌名（我的习惯是Gitee<仓库名>Mirror），过期时间选择无期限，勾选`repo`，然后点击生成令牌。

![填写令牌信息](14.png)

#### Gitee添加镜像

将生成的令牌复制下来，粘贴到Gitee添加镜像页面私人令牌中，然后在镜像仓库列表里选择我们在GitHub新导入的Gitee仓库，最后点击添加。

![Gitee添加镜像](15.png)

每当Gitee代码仓库更新时，他就会自动同步到GitHub仓库，当然，你也可以通过下图界面手动同步。

![Gitee仓库代码同步](16.png)
