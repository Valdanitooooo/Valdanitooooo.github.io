---
layout: post
title: SpringMvc框架实现优雅的页面跳转
categories: develop
tags: java springmvc
---

* content
{:toc}

WEB-INF是安全目录，没法通过地址栏直接访问，下面我来总结一下几种访问WEB-INF下jsp的方法。

# 在controller处理

比较传统的做法。

```java
    @RequestMapping(value="/index")
    public String index(){
        return "index";
    }
```




# 在web.xml中配置servlet

也是比较传统的做法。

```xml
  <servlet>
    <servlet-name>goto_index</servlet-name>
    <jsp-file>/WEB-INF/index.jsp</jsp-file>
  </servlet>
  <servlet-mapping>
    <servlet-name>goto_index</servlet-name>
    <url-pattern>/index</url-pattern>
  </servlet-mapping>
```

# 使用<jsp:forward>标签

重定向一个HTML文件，JSP文件，或者是一个程序段。不优雅，不推荐。

```html
<jsp:forward page="/WEB-INF/index.jsp" />
```

# jsp也是servlet

还是一个字，不优雅。

```javascript
<%
  request.getRequestDispatcher("/index").forward(request, response);
%>
```

# 在springmvc中使用mvc:view-controller标签

直接将访问url和视图进行映射，而无需要通过控制器。
举个栗子：
![](http://tva2.sinaimg.com/large/7bb8bd97gy1fu6nsjyottj207t0c6gmn.jpg)
现在我要访问这个index.jsp
在spring的配置文件里这样写就好啦
![](http://tva2.sinaimg.com/large/7bb8bd97gy1fu6nsk0t3gj20i705k75r.jpg)
path是我访问的url，view-name是要访问的页面，配合视图解析器使用。
配置完之后请求地址‘/’访问的页面就是‘/WEB-INF/views/index/index.jsp’。
如果配置完mvc:view-controller后你的其他的通过controller的url出现404错误，那可能是没有开启SpringMVC注解模式，在spring配置文件里加上`<mvc:annotation-driven>`。

当然，配置这一切的前提是你的配置文件里要引入mvc的命名空间。
加上这三行就没问题啦
![](http://tva2.sinaimg.com/large/7bb8bd97gy1fu6nsk3xk9j20pq079wjk.jpg)

这是我目前得到的最好方案了，不侵入jsp，符合mvc的理念，代码量少，一行解决。
