---
title: NexT 主题
aliases: []
type: note
created: 2025-07-04
area: Publishing
status: active
review: reviewed
tags: []
layout: post
date: 2025-07-04
updated: 2025-07-04
categories:
  - 博客
permalink: 博客/NexT主题/
---
> **导航**
> [返回博客分类](/categories/%E5%8D%9A%E5%AE%A2/)

我选择NexT主题主要有以下理由。

简约。就我个人而言，在从审美的角度调整博客对我来说是一件困难的事情，如果我选择花里胡哨的主题（像butterfly）那么给博客首页配图，给我的每篇博客配图，就会成为给我造成困扰，所以选择简约的主题是难免的。

稳定、文档完善、社区活跃。NexT主题是一个Hexo经典主题，作为一个经典主题，它的稳定性、文档完善度和社区活跃度都是非常高的，每天有大量的开发者使用，遇到任何问题都可以在社区中得到答案，同时，NexT主题的功能强大，且种类多样，可以为我的博客提供各种必要的功能。

由于以上种种原因，我最终选择了NexT主题，当然，如果后期有时间，我也可能会尝试一下butterfly主题，毕竟Hexo的多种主题设置和切换都非常方便，这为创建多主题博客提供了可能性。

## NexT主题发展史

我当时在GitHub上搜到了三个star较多的NexT仓库，但仅凭头像和star数判断原始仓库并不准确。按[官方升级文档](https://theme-next.js.org/docs/getting-started/upgrade)的历史，2014—2017年的v5在[iissnan/hexo-theme-next](https://github.com/iissnan/hexo-theme-next)，2018—2019年的v6—v7在[theme-next/hexo-theme-next](https://github.com/theme-next/hexo-theme-next)，2020年起的v8在[next-theme/hexo-theme-next](https://github.com/next-theme/hexo-theme-next)。我选择的是最后这个仓库。

![1.png](/images/knowledge/%E5%8D%9A%E5%AE%A2/NexT%E4%B8%BB%E9%A2%98/1.png)

## NexT主题安装

### 一般的主题安装方法

这里先讲一下一般主题安装方式，以NexT主题举例。

找到主题的仓库[next-theme/hexo-theme-next](https://github.com/next-theme/hexo-theme-next)，对于新手来说最好选择稳定的发行版，也就是`Releases`，点击`Releases`。

![2.png](/images/knowledge/%E5%8D%9A%E5%AE%A2/NexT%E4%B8%BB%E9%A2%98/2.png)

选择`Latest release`，点击`Source code (zip)`下载。

![3.png](/images/knowledge/%E5%8D%9A%E5%AE%A2/NexT%E4%B8%BB%E9%A2%98/3.png)

如果没有`Releases`，就只能选择`Code`，点击`Download ZIP`下载。

![4.png](/images/knowledge/%E5%8D%9A%E5%AE%A2/NexT%E4%B8%BB%E9%A2%98/4.png)

下载完成后，解压出来一个文件夹，改名为next，放到themes文件夹下，如下图所示。

![5.png](/images/knowledge/%E5%8D%9A%E5%AE%A2/NexT%E4%B8%BB%E9%A2%98/5.png)

修改blog目录下的配置文件（不是next主题的配置文件）`_config.yml`，将主题改为next，这样主题的最原始状态就可以使用了。

```yml _config.yml
theme: next
```

要想修改主题的配置，最好的办法就是将next目录下的`_config.yml`文件复制出来一份，改名为`_config.next.yml`，存放在blog目录下，通过修改`_config.next.yml`文件来修改主题的配置。

### NexT主题最好的安装办法

NexT仓库[next-theme/hexo-theme-next](https://github.com/next-theme/hexo-theme-next)的其中一位贡献者stevenjoezhang将仓库打包成了一个npm包，并将它发布到了npm官方仓库中了，这给了NexT主题一个全新的，快捷方便的安装方式，即使用npm安装。

Hexo 5.0及以上可以通过下面的命令安装NexT；安装后仍需在站点`_config.yml`中设置`theme: next`，见[官方安装说明](https://theme-next.js.org/docs/getting-started/installation)。

```bash
npm install hexo-theme-next
```

然后在node_modules目录下的hexo-theme-next目录中，找到主题的配置文件`_config.yml`，复制到blog目录下，改名为`_config.next.yml`，这样就可以通过修改`_config.next.yml`文件来修改主题的配置了。

## NexT主题配置

NexT主题的配置文件是`_config.next.yml`，它的配置项非常多，就参考[官方文档](https://theme-next.js.org/docs/)吧，我就不一一介绍了。

### 评论系统Utterances配置遇到的问题

> **danger**
> 我在配置Utterances评论系统时，遇到评论登录GitHub时跳转到了[Example Domain](https://example.com/)，这是因为我在blog目录下`_config.yml`文件中没有配置`url`项，导致Utterances评论系统无法获取到我的博客网址，我在`_config.yml`文件中添加了`url`项，配置我的博客网址，就解决了这个问题。

![6.png](/images/knowledge/%E5%8D%9A%E5%AE%A2/NexT%E4%B8%BB%E9%A2%98/6.png)
