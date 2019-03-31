---
layout: post
title: 正确的理解LDAP中的ObjectClass和Attribute
categories: develop
tags: LDAP
---

* content
{:toc}
初学LDAP,无论是用java还是Python来添加Entry都报了很多错,各种各样的错,原来以为是引用的的第三方库不好用,或者自己代码漏洞太多,甚至配置的LDAP服务器有问题,现在终于搞清楚,其实是自己对ObjectClass和Attribute之间的关系了解的不够透彻,找过许多的中文资料都没有得到答案,现在终于有所突破,赶紧记录下来.
他们之间的关系与Java里面的一些概念很相似，LDAP中每一个Entry必须属于某一个ObjectClass，用Java的方式来理解这个Entry对应着一个Instance，而 ObjectClass自然就是class了。
我们再详细了解一下ObjectClass和Attribute。<!-- more -->

# ObjectClass

一个ObjectClass是属性的集合（或属性容器），并具有以下特点：

1. ObjectClass在Schema中定义
2. ObjectClass可以是对象类层次结构的一部分，在这种情况下，它继承其父对象的所有属性。 例如，inetOrgPerson是organizationalPerson的子类，organizationalPerson是person的子类，person是top的子类（ABSTRACT objectClass，它终止每个对象类层次结构）。
3. ObjectClass具有全局唯一的名称或标识符。
4. ObjectClass以及作为属性容器，也是属性，并且可以出现在搜索操作中。
5. ObjectClass定义了它的成员属性以及这些属性必须存在（强制）还是可能存在（可选）。
6. 必须存在一个或多个ObjectClass。
7. 一个LDAP条目中必须存在一个且只有一个STRUCTURAL ObjectClass。
8. 由LDAP服务器支持的每个ObjectClass形成称为objectclasses的集合的一部分，可以通过子Schema发现。




在Java中Class大致可以分为Abstract，concrete两种，只有concrete Class才能生成Instance。而在LDAP中ObjectClass分为三种：Abstract(抽象型)，Structural(结构型)，Auxiliary(辅助型)。具体定义如下：

```shell
* Abstract object classes are only intended to be extended by other object classes. An entry must not contain any abstract class unless it also contains a structural or auxiliary class that dervies from that abstract class (i.e., includes a non-abstract object class which has the abstract class in its inheritance chain). All entries must contain at least the “top” abstract object class, in the inheritance chain for their structural class. They may or may not contain other abstract classes in the inheritance chains for their structural class or any of their auxiliary classes.
* Structural object classes are intended to define the crux of what an entry represents. Every entry must include exactly one structural object class chain, and the root of that chain must ultimately be the “top” abstract object class. The structural object class for an entry is not allowed to be changed.
* Auxiliary object classes are intended to define additional qualities of entries. An entry may contain zero or more auxiliary classes, and the set of auxiliary classes associated with an entry may change over time.
```

简单描述就是:
抽象型ObjectClass只用来被其它ObjectClass继承，只有当其被结构型ObjectClass继承时才出现。
要定义一个Entry必须有且只有一个结构型的ObjectClass。
Top是一个顶级抽象型ObjectClass，里面定义了一个MUST Attribute：ObjectClass，这就决定了必须有一个其它的结构型ObjectClass才能定义一个Entry.	其中ObjectClass又可以存在继承关系，该继承关系于Java中有点相似，子ObjectClass会继承父ObjectClass中的全部Attributes.
objectClass有着严格的等级之分，最顶层是top和alias。例如，organizationalPerson这个ObjectClass就隶属于person，而person又隶属于top。

# Attribute

属性（Attribute）类似于程序设计中的变量，可以被赋值。在OpenLDAP中声明了许多常用的Attribute（用户也可自己定义Attribute）。
ObjectClass可以看做是一种特殊的Attribute，它包含其他用到的Attribute以及其自身。

# ObjectClass与Attribute的关系

接下来看一看ObjectClass与Attribute的关系。
如同Java里面的一个类可以包括多个Field，在业务上可能会定义某些Field是必须的，另外一些是可选的。在LDAP中也存在类似关系，每一个ObjectClass都定义了一些Attribute，其Attribute仍然可以是ObjectClass。在这些Attriubte中分为两种类型MUST，MAY， MUST表示这个Entry必须包括的属性，MAY为可选。一个ObjectClass的Attribute也包括所有继承自父ObjectClass和自身定义的ObjectClass。

下面用一个类型进行说明：

```shell
objectclass ( 2.5.6.0 NAME 'top' ABSTRACT
    MUST objectClass )
objectclass ( 1.3.6.1.4.1.1466.344 NAME 'dcObject'
    DESC 'RFC2247: domain component object'
    SUP top AUXILIARY
    MUST dc )
```

上面是两个objectclass的定义，其中top为ABSTRACT，dcObject为AUXILIARY，这两个类型都不能定义Entry.下面这个LDIF文件在导入到LDAP时会出错：

```shell
dn: dc=java,dc=com
objectClass:dcObject
dc: java.com
```

要定义这个Entry必须找到一个STRUCTURAL类型的ObjectClass。

```shell
objectClasses: ( 2.5.6.4 NAME 'organization'
  DESC 'RFC2256: an organization' SUP top STRUCTURAL
  MUST o
  MAY ( userPassword $ searchGuide $ seeAlso $ businessCategory
   $ x121Address $ registeredAddress $ destinationIndicator
   $ preferredDeliveryMethod $ telexNumber $ teletexTerminalIdentifier
   $ telephoneNumber $ internationaliSDNNumber $ facsimileTelephoneNumber
   $ street $ postOfficeBox $ postalCode $ postalAddress
   $ physicalDeliveryOfficeName $ st $ l $ description ) )
```

这个objectClass的类型为STRUCTURAL，因此可以用来定义Entry.具体定义如下

```shell
dn: dc=java,dc=com
objectClass:dcObject
objectClass:organization
dc: java.com
o: java.com
```

其中dc：java.com为dcObject的MUST Attribute，o: java.com为organization的MUST Attribute。

# 总结

只要清楚了ObjectClass与Attribute之间的关系，无论是用什么语言来操作ldap，都会增添很多信心。

## 参考资料：

[Appendix E: LDAP - Object Classes and Attributes](http://www.zytrax.com/books/ldap/ape/){:target="_blank"}
