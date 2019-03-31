---
layout: post
title: 快速上手aria2，docker安装
categories: tools
tags: aria2 docker
---
* content
{:toc}

[aria2](https://aria2.github.io/){:target="_blank"}是一款轻量级的多协议和多源命令行下载工具。它支持HTTP / HTTPS，FTP，SFTP，BitTorrent和Metalink。aria2可以通过内置的JSON-RPC和XML-RPC接口进行操作。
这是aria2官网上的介绍，可以看出aria2支持的协议不少，**还能提供api接口**，这一点很厉害哦。




# docker安装带web界面的aria2

```shell
sudo docker pull xujinkai/aria2-with-webui
sudo docker run -d \
--name aria2-with-webui \
-p 6800:6800 \
-p 6880:80 \
-p 6888:8080 \
-v /DOWNLOAD_DIR:/data \
-v /CONFIG_DIR:/conf \
-e SECRET=YOUR_SECRET_CODE \
xujinkai/aria2-with-webui
```

6800是aria2的web界面端口，6888是浏览数据文件夹的端口，DOWNLOAD_DIR是宿主机存放下载文件的目录，CONFIG_DIR是配置目录。secret我没有设置，因为就自己用。

# aria2的使用

直接访问<http://localhost:6880/>可以进入aria2的web操作页面，如图：
![](https://ws1.sinaimg.cn/large/7bb8bd97gy1fu6nz5xi28j20rb0ck757.jpg)
访问<http://localhost:6888/>可以看到下载的文件目录。
操作都比较简单，关于aria2的参数化配置有很多教程，没必要记，现用现学吧。
