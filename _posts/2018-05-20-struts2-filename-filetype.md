---
layout: post
title: Struts2获取文件上传文件名和文件类型
categories: develop
tags: sturts java
---

* content
{:toc}

很久没做strust框架的项目了，今天做一个上传文件的功能，上传png格式的文件，结果在action里只能看到tmp结尾的临时文件，没法取到文件名和文件类型，查了一下，找到了方法，在这里记录一下。

以下内容转载自<https://blog.csdn.net/net19880504/article/details/20572867>{:target="_blank"}，我来重新排版一下格式。




---------------------------------

Action中还有两个属性：**uploadFileName**和 **uploadContentType**，这两个属性分别用于封装上传文件的文件名、文件类型。
这是Struts2设计的独到之处：Strut2的Action类直接通过File类型属性直接封装了上传文件的文件内容，但这个File属性无法获取上传文件的文件名和文件类型，所以Struts2就直接将文件域中包含的上传文件名和文件类型的信息封装到uploadFileName和 uploadContentType属性中，也就是说Struts2针对表单中名为xxx的文件域，在对应的Action类中使用3个属性来封装该文件域信息：

- 类型为File的xxx属性：用来封装页面文件域对应的文件内容。
- 类型为String的xxxFileName属性：用来封装该文件域对应的文件的文件名。
- 类型为String的xxxContentType属性：用来封装该文件域应用的文件的文件类型。

---------------------------------

以下是实际代码：

jsp页面：

```<input type="file" id="upload" name="upload"/>```  这个name就是与Action的属性对应

Action类代码：

```java

    private File upload;
    private String uploadFileName;
    private String uploadContentType;

    public void setUpload(File upload) {
        this.upload = upload;
    }

    public void setUploadFileName(String uploadFileName) {
        this.uploadFileName = uploadFileName;
    }

    public void setUploadContentType(String uploadContentType) {
        this.uploadContentType = uploadContentType;
    }

```

设置3个属性。分别给set方法. 这样子，就能够获取上传的文件，文件名，文件类型。

**注意**：这个uploadFileName，uploadContentType。如果File 属性名xxx(private File xxx;) 。那这个必须是xxxFileName, xxxContentType。然后也是分别给set 方法就可以。

**特别注意**：，<s:file/>标志不仅仅是绑定到upload，还有uploadContentType（上传文件的MIME类型）和uploadFileName（上传文件的文件名，该文件名不包括文件的路径）。因此，<s:file name="xxx" />对应Action类里面的xxx、xxxContentType和xxxFileName三个属性。