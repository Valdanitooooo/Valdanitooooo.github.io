---
layout: post
title: 在Centos7上搭建Ldap服务器
categories: develop
tags: LDAP centos
---

* content
{:toc}

# 环境准备

新建两台Linux虚拟机，一台作为服务器一台作为客户端

|   |  Server   |  Client |
| ------------ | ------------ | ------------ |
| 操作系统   | Centos7 - 64 Bit  | Centos7 - 64 Bit  |
|  主机名 |  openldapServer   |  openldapClient |
|  IP地址 |  172.26.17.35  |  172.26.17.36 |





# 服务器配置

- 进入172.26.17.35虚拟机

安装以下软件包：

```shell
yum install -y openldap openldap-clients openldap-servers migrationtools
```

![1](http://p.ananas.chaoxing.com/star3/origin/7234fb7e1b4fb8ddd674cf9488e9928c.jpg)

- 从秘钥生成LDAP密码（这里设为123456）：

```shell
slappasswd -s 123456 -n > /etc/openldap/passwd
```

- 生成有效期为365天的X509证书：

```shell
openssl req -new -x509 -nodes -out /etc/openldap/certs/cert.pem -keyout /etc/openldap/certs/priv.pem -days 365
```

![1](http://p.ananas.chaoxing.com/star3/origin/1533b9f92bc7aab73e5d4c5cde6c3522.jpg)

- 保护/ etc / openldap / certs目录的内容：

```shell
cd /etc/openldap/certs
chown ldap:ldap *
chmod 600 priv.pem
```

- 准备LDAP数据库：

```shell
cp /usr/share/openldap-servers/DB_CONFIG.example /var/lib/ldap/DB_CONFIG
```

- 生成数据库文件（不要担心错误消息！）：

```shell
slaptest
```

![1](http://p.ananas.chaoxing.com/star3/origin/a4d4ce9b86c2a9e1db556ca4757fb97c.jpg)

- 更改LDAP数据库所有权：

```shell
chown ldap:ldap /var/lib/ldap/*
```

- 设置slapd服务开机启动：

```shell
systemctl enable slapd
```

- 启动slapd服务：

```shell
systemctl start slapd
```

- 检查LDAP活动：

```shell
netstat -lt | grep ldap
```

![1](http://p.ananas.chaoxing.com/star3/origin/5bc6b595287da286dac12c360c1cab1c.jpg)

- 要开始配置LDAP服务器，先添加 cosine 和 nis 这两个 LDAP schema：

```shell
cd /etc/openldap/schema
ldapadd -Y EXTERNAL -H ldapi:/// -D "cn=config" -f cosine.ldif
ldapadd -Y EXTERNAL -H ldapi:/// -D "cn=config" -f nis.ldif
```

![1](http://p.ananas.chaoxing.com/star3/origin/e51b0e0bd07cb9c756361a614e185cb5.jpg)

- 然后，创建/etc/openldap/changes.ldif文件（vim /etc/openldap/changes.ldif）并粘贴以下内容，将刚才生成的密码（在/etc/openldap/passwd文件中）粘贴到######处，注意冒号后有一个空格：

```shell
dn: olcDatabase={2}hdb,cn=config
changetype: modify
replace: olcSuffix
olcSuffix: dc=topenldap,dc=com

dn: olcDatabase={2}hdb,cn=config
changetype: modify
replace: olcRootDN
olcRootDN: cn=admin,dc=topenldap,dc=com

dn: olcDatabase={2}hdb,cn=config
changetype: modify
replace: olcRootPW
olcRootPW: ######

dn: cn=config
changetype: modify
replace: olcTLSCertificateFile
olcTLSCertificateFile: /etc/openldap/certs/cert.pem

dn: cn=config
changetype: modify
replace: olcTLSCertificateKeyFile
olcTLSCertificateKeyFile: /etc/openldap/certs/priv.pem

dn: cn=config
changetype: modify
replace: olcLogLevel
olcLogLevel: -1

dn: olcDatabase={1}monitor,cn=config
changetype: modify
replace: olcAccess
olcAccess: {0}to * by dn.base="gidNumber=0+uidNumber=0,cn=peercred,cn=external,cn=auth" read by dn.base="cn=admin,dc=topenldap,dc=com" read by * none
```

![1](http://p.ananas.chaoxing.com/star3/origin/4d2e9c4b43ad6eebafb6a061002ddada.jpg)

- 在这里我们将数据库域名设为topenldap.com，管理员账号为admin，密码为之前生成的密码，日志级别设为-1

slapd -d ?命令可以获取OpenLDAP的日志级别
![1](http://p.ananas.chaoxing.com/star3/origin/69c7e4868b4ad2152c949ee2b9de18d2.jpg)

- 将新配置发送到slapd服务器：

```shell
ldapmodify -Y EXTERNAL -H ldapi:/// -f /etc/openldap/changes.ldif
```

![1](http://p.ananas.chaoxing.com/star3/origin/09610b94fcbc903a7a5f9e8c4ae947fc.jpg)

- 创建/etc/openldap/base.ldif文件并粘贴以下内容：

```shell
dn: dc=topenldap,dc=com
dc: topenldap
objectClass: top
objectClass: domain

dn: ou=People,dc=topenldap,dc=com
ou: People
objectClass: top
objectClass: organizationalUnit

dn: ou=Group,dc=topenldap,dc=com
ou: Group
objectClass: top
objectClass: organizationalUnit
```

![1](http://p.ananas.chaoxing.com/star3/origin/618c4a2e4772ca0061127081b9f4ab18.jpg)

- 构建目录服务的结构：

```shell
ldapadd -x -W -D "cn=admin,dc=topenldap,dc=com" -f /etc/openldap/base.ldif
```

输入密码（123456）
![1](http://p.ananas.chaoxing.com/star3/origin/b6e5e0482116b175003e332a200ab3d7.jpg)

- 创建两个用户进行测试：

```shell
mkdir /home/guests
useradd -d /home/guests/ldapuser01 ldapuser01
passwd ldapuser01
```

设置密码为：userldap01

```shell
useradd -d /home/guests/ldapuser02 ldapuser02
passwd ldapuser02
```

设置密码为：userldap02
![1](http://p.ananas.chaoxing.com/star3/origin/910fe0ff94e5e3a25f5d814738c7a8c1.jpg)

- 现在用户已经创建成功，但这些用户的书写格式是无法直接导入到LDAP服务器上的，所以我们一定要采用格式转换工具migrationtools来转变格式

转到migrationtools的目录：

```shell
cd /usr/share/migrationtools
```

- 编辑migrate_common.ph文件：

![1](http://p.ananas.chaoxing.com/star3/origin/4437dbc8a4df178c43023dae40b9d114.jpg)
将这两行修改为之前我们自定义的域名
![1](http://p.ananas.chaoxing.com/star3/origin/ee7287b623e1dab927750600ecbd1464.jpg)
在目录服务中创建当前用户(输入密码为管理员密码123456）：

```shell
grep ":10[0-9][0-9]" /etc/passwd > passwd
./migrate_passwd.pl passwd users.ldif
ldapadd -x -W -D "cn=admin,dc=topenldap,dc=com" -f users.ldif
grep ":10[0-9][0-9]" /etc/group > group
./migrate_group.pl group groups.ldif
ldapadd -x -W -D cn=admin,dc=topenldap,dc=com -f groups.ldif
```

![1](http://p.ananas.chaoxing.com/star3/origin/4d4f53ab0d3916fb8fbcdb52bace7e49.jpg)

- 使用名为ldapuser01的用户测试配置：

```shell
ldapsearch -x cn=ldapuser01 -b dc=topenldap,dc=com
```

- 也可以查询所有的用户：

```shell
ldapsearch -x -b 'dc=topenldap,dc=com' '(objectclass=*)'
```

![1](http://p.ananas.chaoxing.com/star3/origin/212ad24bab4506ff3777064a625cccde.jpg)
出现以上效果说明用户已经真正的创建成功了

- 向防火墙添加新服务（ldap：port tcp 389）：

```shell
firewall-cmd --permanent --add-service=ldap
```

- 重新加载防火墙配置：

```shell
firewall-cmd --reload
```

![1](http://p.ananas.chaoxing.com/star3/origin/1c8dfc4dae4f13d4c5be5907bfe484ac.jpg)

- 编辑/etc/rsyslog.conf文件并添加以下内容：

```shell
local4.*                     /var/log/ldaplog/ldap.log
```

![1](http://p.ananas.chaoxing.com/star3/origin/70debad62e8e3cd57150c4b9c18048a1.jpg)

- 重新启动rsyslog服务：

```shell
systemctl restart rsyslog
```

服务器配置结束

# 客户端配置

- 进入172.26.17.36虚拟机

安装所需的安装包：

```shell
yum install -y openldap-clients nss-pam-ldapd
```

![1](http://p.ananas.chaoxing.com/star3/origin/6eed9286def0a44141a46d4975f65da7.jpg)

- 链接OpenLDAP服务器进行访问：

```shell
authconfig-tui
```

![1](http://p.ananas.chaoxing.com/star3/origin/3d9839ad016155f58d28f4b37dc301e8.jpg)

- Xsell工具在这里有个bug，总是更改我们配置好的内容，很无奈，只好用TDesktop登录172.26.17.36这台主机进行配置

- 执行authconfig-tui后先将左侧“使用 LDAP”和右侧“使用 LDAP 认证” 勾选上，下一步

![1](http://p.ananas.chaoxing.com/star3/origin/eca530233a54f37da86aef1955446578.jpg)

- 将服务器配置为我们的openldapServer机器的ip：172.26.17.35，确定

![1](http://p.ananas.chaoxing.com/star3/origin/d59a62e7af78d85ffed0576e753d7597.jpg)

- 之后我们可以回到Xsell里继续操作了

首先测试一下客户端的配置是否有效
使用以下命令搜索ldap用户并检查输出。

```shell
getent passwd ldapuser01
```

![1](http://p.ananas.chaoxing.com/star3/origin/645da8d526672d2b87eb6ffbfb9b8d36.jpg)
如果得到以上输出，则我们的LDAP配置可以正常工作。

- 尝试一下用服务器创建的用户登录客户端机器：

```shell
su - ldapuser01
```

![1](http://p.ananas.chaoxing.com/star3/origin/4b4e451a2910a6f1fa1418e0e4e696da.jpg)

- 得到以上输出说明服务端的用户共享是成功的，可以被其他机子访问。

再服务器端查看日志：

```shell
tail -f /var/log/ldaplog/ldap.log
```

至此，一个基本的未加密的openldap服务已经搭建完成

## 配置过程主要参考了以下两篇文章

1. [rhel7-configure-ldap](https://www.certdepot.net/rhel7-configure-ldap-directory-service-user-connection/ "rhel7-configure-ldap"){:target="_blank"}
2. [configure-openldap-server](http://www.learnitguide.net/2016/01/configure-openldap-server-on-rhel7.html "configure-openldap-server"){:target="_blank"}
