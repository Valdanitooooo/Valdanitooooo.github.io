---
layout: post
title: 访问WEB-INF目录下jsp的几种方式
categories: 开发
tags: WEB-INF jsp springmvc
comments: no
---


WEB-INF是安全目录，没法通过地址栏直接访问，下面我来总结一下几种访问WEB-INF下jsp的方法。

# 在controller处理
比较传统的做法。
{% highlight java linenos %}
    @RequestMapping(value="/index")
    public String index(){
        return "index";
    }
{% endhighlight %}

# 在web.xml中配置servlet
也是比较传统的做法。
{% highlight xml linenos %}
  <servlet>
    <servlet-name>goto_index</servlet-name>
    <jsp-file>/WEB-INF/index.jsp</jsp-file>
  </servlet>
  <servlet-mapping>
    <servlet-name>goto_index</servlet-name>
    <url-pattern>/index</url-pattern>
  </servlet-mapping>
{% endhighlight %}

# 使用<jsp:forward>标签
重定向一个HTML文件，JSP文件，或者是一个程序段。不优雅，不推荐。
{% highlight html linenos %}
<jsp:forward page="/WEB-INF/index.jsp" />
{% endhighlight %}

# jsp也是servlet
还是一个字，不优雅。
{% highlight html linenos %}
<%
  request.getRequestDispatcher("/index").forward(request, response);
%>
{% endhighlight %}

#在springmvc中使用mvc:view-controller标签
直接将访问url和视图进行映射，而无需要通过控制器。
举个栗子：
![目录](/media/images/accessed-web-inf-jsp/Image1.jpg)
现在我要访问这个index.jsp
在spring的配置文件里这样写就好啦
![配置文件](/media/images/accessed-web-inf-jsp/Image2.jpg)
path是我访问的url，view-name是要访问的页面，配合视图解析器使用。
配置完之后请求地址‘/’访问的页面就是‘/WEB-INF/views/index/index.jsp’。
如果配置完mvc:view-controller后你的其他的通过controller的url出现404错误，那可能是没有开启SpringMVC注解模式，在spring配置文件里加上<mvc:annotation-driven>。

当然，配置这一切的前提是你的配置文件里要引入mvc的命名空间。
加上这三行就没问题啦
![目录](/media/images/accessed-web-inf-jsp/Image3.jpg)

这是我目前得到的最好方案了，不侵入jsp，符合mvc的理念，代码量少，一行解决。
