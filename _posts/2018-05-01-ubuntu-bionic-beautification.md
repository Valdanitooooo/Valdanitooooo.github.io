---
layout: post
title: ubuntu 18.04 LTS(Bionic Beaver)界面美化教程
categories: ubuntu
tags: ubuntu 系统
comments: true
---


ubuntu最新版本[ubuntu 18.04 LTS](https://www.ubuntu.com/download/desktop){:target="_blank"}已经发布了几天，这几天我使用的感受还是不错的，界面上一些明显的bug都有改进，关于更新的一些东西我不赘述了，参看官网的发行说明<https://wiki.ubuntu.com/BionicBeaver/ReleaseNotes>{:target="_blank"}。

言归正传，这篇文章主要讲界面美化，这版ubuntu本身的界面并不算丑，但是如果每天面对它工作的时候，还是一开始就弄得美一点比较好，我的小目标是：简单-优美-不花里胡哨。

先看一下最终效果再看教程
![image001.jpg](/media/images/bionic-beautif
ication/2018-05-01-11-27-16.png)

# 安装gnome-tweak-tool
```shell
sudo apt install gnome-tweak-tool
```
之后我们将使用gnome-tweak-tool设置各种显示效果。

# 安装扩展程序
GNOME Shell 桌面有很多扩展可以安装，可以到这里去选择<https://extensions.gnome.org/>{:target="_blank"}。
安装和卸载扩展非常简单，拖拽右侧滑块即可，如图：
![image001.gif](/media/images/bionic-beautification/2018-05-01-12-41.gif)
我安装了的主要有以下几个：
1. User Themes ：从用户目录加载 shell themes。
2. Dash to Dock : 可以修改左侧菜单栏的一些样式。
3. Dash to Panel ： 这个厉害了，可以把左侧菜单栏和顶部状态栏合并到下面显示，类似windows效果。
4. Arc Menu ： 全新的应用菜单，类似win7内种。

# 下载主题
我这里选的是这款[Matcha Gtk Theme](https://www.gnome-look.org/p/1187179/){:target="_blank"}，可以选择喜欢的颜色下载。
![image002.jpg](/media/images/bionic-beautification/2018-05-01-12-10-
23.png)

# 安装主题
安装这款主题需要先安装GTK+3.0
  ```shell
  安装编译工具:sudo apt-get install build-essential
  安装GTK+3.0：sudo apt-get install libgtk-3-dev
  安装pkg-config：sudo apt-get install pkg-config
  查看版本 确认已安装好
  pkg-config --version
  pkg-config --modversion gtk+-3.0
  ```
在～/.local/share目录下新建themes、icons和fonts目录，分别用于存放主题、图标和字体文件，将之前下载的文件解压后拷贝到对应目录即可，我是直接命令行安装的，参考这个主题的[readme](https://github.com/vinceliuice/matcha){:target="_blank"}。

# 使用gnome-tweak-tool切换主题
主题安装好后就可以到tweak里去切换了
![image003.jpg](/media/images/bionic-beautif
ication/2018-05-01-11-37-35.png)
这是我的选择，Matcha的icon使用后效果不好，我还是用了系统里面的suru，字体我没有改。

# 使用gnome-tweak-tool微调样式
这里我主要说下扩展里面的设置
![image004.jpg](/media/images/bionic-beautification/2018-05-01-12-57-5
0.png)
点击左侧扩展菜单，在右侧显示了我们安装过的扩展，点击扩展的设置按钮进行调整。
1. Arc Menu ：我只改了一处，在Appearance>Customize menu button appearance处点击设置按钮，进入Button appearance，在Select icon for the menu button处我切换了菜单按钮的icon，选择了System Icon
2. Dash to Dock ： 在启动标签下选择全部禁用，不让原来默认的菜单栏显示出来。
![image005.jpg](/media/images/bionic-beautification/2018-05-01-13-08-1
8.png)
3. Dash to Panel ：这里的设置可以多尝试，感觉舒服就行，下面是我做的微调，仅供参考。
![image006.jpg](/media/images/bionic-beautification/2018-05-01-13-13-45.png)
![image007.jpg](/media/images/bionic-beautification/2018-05-01-13-14-05.png)
![image008.jpg](/media/images/bionic-beautification/2018-05-01-13-14-41.png)
微调菜单最下面高级选项
![image009.jpg](/media/images/bionic-beautification/2018-05-01-13-15-37.png)


大概就是这样了，icon可能跟主题配色不太搭，但是suru对菜单里面的分组做的很好，图标也比较全。
再补几张效果图：
![image010.jpg](/media/images/bionic-beautification/2018-05-01-13-28-42.png)
![image011.jpg](/media/images/bionic-beautification/2018-05-01-13-29-08.png)
![image002.gif](/media/images/bionic-beautification/2018-05-01-13-31.gif)
