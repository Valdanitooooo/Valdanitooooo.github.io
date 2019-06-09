---
layout: post
title: 'nginx容器启动时读取数据卷中的配置文件'
categories: devops
tags: docker nginx
---

* content
{:toc}

使用docker-compose部署项目时遇到的问题，记录一下。

问题：应用容器与nginx容器共享一个数据卷(如下配置)，nginx配置文件跟随应用有版本管理，部署时nginx怎样读取到这份配置文件

```yaml
version: "3.2"
services:

  static:
    image: xxx:v1.0
    container_name: valdanito-static
    working_dir: /usr/src/app
    ports:
      - 8000:8000
    volumes:
      - static-content:/usr/src/app
    command:
      - /bin/sh
      - -c
      - |
        cd /usr/src/app && ls *.tar | xargs -n1 tar xvf
        env port=8000 node index.js

  nginx:
    depends_on:
      - static
    image: nginx:latest
    container_name: valdanito-nginx
    ports:
      - "8180:80"
    volumes:
      - static-content:/usr/src/app

volumes:
  static-content:
```





当然最简单的做法是挂载主机目录，把配置文件塞进去，nginx容器能读到就ok了，这也是搜索引擎告诉我的最多的答案，但是我不想这么做，一方面这么做增加了维护成本，也不想把静态文件暴露在服务器上，另一方面这两个容器已经共享一个数据卷了，凭什么就读不到配置文件呢。

我的尝试：

```yaml
command: ln -s /usr/src/app/conf.d/docker.conf /etc/nginx/conf.d/a.conf
```

不行，容器起不来，也不报错。

再尝试：

```yaml
command:
   - /bin/bash
   - -c
   - |
    rm -rf /etc/nginx/conf.d/*
    cp /usr/src/app/conf.d/docker.conf /etc/nginx/conf.d
```

还是不行。

没招了，自己构建个nginx镜像：

```dockerfile
FROM nginx:latest
LABEL MAINTAINER = "valdanito@qq.com"

RUN mkdir -p /usr/src/app/data/conf.d
RUN touch /usr/src/app/conf.d/docker.conf
RUN ln -s /usr/src/app/conf.d/docker.conf /etc/nginx/conf.d/docker.conf
RUN rm /etc/nginx/conf.d/default.conf
```

这里只是把nginx默认的镜像删除，并且做个软连接到运行时数据卷中配置文件的位置。

构建一下：

```shell
docker build -t valdanito_nginx:v1.0 .
```

最终的docker-compose文件就是把nginx:lastest的镜像替换成valdanito_nginx:v1.0就可以了

这回nginx容器就能使用数据卷中的配置文件了，可以愉快地一键部署了。

虽然最终效果优雅了，但是这个方法不是很优雅，以后看看有什么更好的办法吧，先解决目前的问题。
