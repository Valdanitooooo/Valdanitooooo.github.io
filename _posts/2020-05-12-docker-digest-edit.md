---
layout: post
title: '修改docker镜像Digest信息'
categories: devops
tags: docker ubuntu linux mac k8s
---

* content
{:toc}

## 问题 

minikube启动集群时报错

```sh
Unable to find image 'gcr.io/k8s-minikube/kicbase:v0.0.7@sha256:a6f288de0e5863cdeab711fa6bafa38ee7d8d285ca14216ecf84fcfb07c7d176' locally
```

是由于镜像的RepoDigest丢失





## 解决

### 编辑repositories.json文件

#### 对于linux系统

需要编辑`/var/lib/docker/image/overlay2/repositories.json`这个文件。

##### 对于mac系统

要麻烦一点, 需要进入虚拟机修改

```sh
screen ~/Library/Containers/com.docker.docker/Data/vms/0/tty
cd /var/lib/docker/image/overlay2
# 貌似没有vim命令, 有vi
vi repositories.json
```

这个json没有换行, 直接用vi搜索`gcr.io/k8s-minikube/kicbase`
找到

```json
"gcr.io/k8s-minikube/kicbase":{"gcr.io/k8s-minikube/kicbase:v0.0.7":"sha256:7980bce73693acb180efd04278d5f9fe4a14f75fb8a54f6e119578bdf1e49a72"}
```

在`{}`中再加入

```json
,"gcr.io/k8s-minikube/kicbase@sha256:a6f288de0e5863cdeab711fa6bafa38ee7d8d285ca14216ecf84fcfb07c7d176":"sha256:7980bce73693acb180efd04278d5f9fe4a14f75fb8a54f6e119578bdf1e49a72"
```

变成这样

```json
"gcr.io/k8s-minikube/kicbase":{"gcr.io/k8s-minikube/kicbase:v0.0.7":"sha256:7980bce73693acb180efd04278d5f9fe4a14f75fb8a54f6e119578bdf1e49a72","gcr.io/k8s-minikube/kicbase@sha256:a6f288de0e5863cdeab711fa6bafa38ee7d8d285ca14216ecf84fcfb07c7d176":"sha256:7980bce73693acb180efd04278d5f9fe4a14f75fb8a54f6e119578bdf1e49a72"}
```

`Ctrl-a + d` 退出

重启Docker Desktop

再查看

```sh
docker images --digests | grep kicbase
```

可以看到digests已经有了！

再启动集群就不会报错了

```sh
minikube start --driver=hyperkit --image-mirror-country=cn --image-repository=registry.cn-hangzhou.aliyuncs.com/google_containers --kubernetes-version=v1.18.0 docker-env
```

## 参考资料

* [pulling kic base image does not respect --image-repository or --image-mirror-country flags for CN registry mirrors](https://github.com/kubernetes/minikube/issues/7447){:target="_blank"}
* [minikube-启动失败](https://listenerri.com/2020/04/07/minikube-%E5%90%AF%E5%8A%A8%E5%A4%B1%E8%B4%A5/){:target="_blank"}
* [Where is /var/lib/docker on Mac/OS X](https://stackoverflow.com/a/41226917)
  