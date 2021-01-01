# 关于

- 这是我的个人博客源码。
- 博客名称：Valdanito's Blog。
- 博客网址：<https://www.valdanito.top>。
- 基于Jekyll工具构建，模板代码基于<https://github.com/Gaohaoyang/gaohaoyang.github.io>, 做了些简单修改。

## 模板使用说明

- 将_posts目录下的文档替换成自己的, 其他一些个人信息自行替换
- 本地可以启用docker调试
  - 在源码根目录下执行`docker-compose up -d`启动容器, 浏览器访问<localhost:3999>
  - 使用`docker logs -f jekyll`命令监控日志, 本地调试修改md, `html`, `js`, `css`等静态文件即时生效
  - 修改一些系统配置文件, 如`Gemfile`, `_config.yml`等需要重启docker容器生效, 执行`docker restart jekyll`

## 联系方式

- Github: [Valdanitooooo](https://github.com/Valdanitooooo)
- Email: valdanito(at)foxmail(.)com

## License

[MIT](http://opensource.org/licenses/MIT)
