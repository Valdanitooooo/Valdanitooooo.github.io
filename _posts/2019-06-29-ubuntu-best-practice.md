---
layout: post
title: 'UEFI方式安装Ubuntu系统'
categories: os
tags: ubuntu linux
---

* content
{:toc}

## 第一步 制作U盘启动盘

准备一个至少4G的U盘, 到ubuntu官网(<https://ubuntu.com/download/desktop>{:target="_blank"})下载需要的iso文件, 笔者选择的是18.04 LTS版本, LTS就是long-term support, 长期支持版本.

制作U盘启动盘的软件很多, 笔者选择的是[WinSetupFromUSB](http://www.winsetupfromusb.com){:target="_blank"}, 它的优势是支持的系统安装文件非常多, 并且能够多个安装文件共存, 只要你的U盘足够大, 笔者就装了ubuntu, win10, manjaro三个系统的安装包, WinSetupFromUSB的使用可以参考官网的教程<http://www.winsetupfromusb.com/tutorials/>{:target="_blank"}, 界面简单, 很容易上手.




## 第二步 设置BIOS

如果机器支持Legacy模式, 就切换为Legacy模式, 不支持Legacy就只能用UEFI模式, Legacy更简单, 不需要自己分区. 笔者的之前一直用Legacy模式装系统, 最近这台latitude完全不支持Legacy, 所以这里BIOS就不用设置了, 默认就好.

## 第三步 安装系统

1. 插入U盘, 重启电脑, 在启动界面出来之前, 也就是屏幕刚亮还没有画面的时候连续按F12, 不同型号电脑这个热键可能不同.
2. 然后开始进入安装界面, 接下来语言选择English, 时区选择Shanghai, 先不联网也不不安装第三方软件.
3. 分区, 选择Something else分区, 把现有分区全部使用"-"按钮都减成free space, 再使用"+"按钮进行分区.
   1). 首先创建一个EFI system partition(ESP)类型的分区, 最小200M, 500M最好, 笔者选择的250M.
   2). 创建swap类型的分区: 2048M, 采用Logical Partition.
   3). /分区： 51200M，采用Primary Partition，类型选择Ext 4.
   4). /home分区： 将剩下所有空间分配给/home，采用Logical Partition，类型选择Ext 4.
   5). 笔者是512G的硬盘, 这样分的, 仅供参考, 最开始由于没有做ESP分区踩到了坑, 遇到了`the grub efi amd64 signed package failed to install into target`这个问题, 搜索一下找到的解决办法, 参考连接见文末.
4. 设置pc名, 用户名与密码, 等待安装完成, 拔掉U盘重启电脑即可开始使用这个使用后再也离不开的操作系统.

## 参考资料

* [UEFI 模式下如何安装 Ubuntu 16.04？](https://www.zhihu.com/question/52092661/answer/259583475){:target="_blank"}
  
* [grub-efi-amd64-signed failed installation /target](https://www.zhihu.com/question/52092661/answer/259583475){:target="_blank"}
  
* [Creating_an_EFI_System_Partition](https://help.ubuntu.com/community/UEFI#Creating_an_EFI_System_Partition){:target="_blank"}
  