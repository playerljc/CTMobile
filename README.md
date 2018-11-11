## CTMobile
一个移动端框架，支持页面的多种形式切换，页面转场，页面传值，通知等，适用于开发单页面应用(SPA)，混合开发(Hybrid)，Cordova开发。
## 开发灵感
期初刚接触Hybrid开发的时候公司选用的是jQueryMobile+Cordova的组合来开发混合应用，在用jQueryMobile的时候遇到了很多问题如管理类和Dom之间总是不能很好的有机结合在一起，当初的想法是如果在浏览器端每个局部页面和其管理类能像Android中的Activity一样就好了，所以灵感就来了，CtMobile的实现完全借助于Android中的Activity来实现。
## 三大感念
CtMoble中有三个重要的感念，分别是**Page**，**Router**，**BorasdCast**.
其中Page用来管理页面的创建，初始化，销毁的整个生命周期，Router管理这个框架的路由跳转，BorasdCast用来管理通知和页面之间的数据的通信交互。 
## 开发模式
 1. inline模式
 所有的页面都写在一个html中(一本不推荐使用)
 2. ajax模式
 每个页面在需要的时候才进行加载，且只加载一次
## Page(页面)的启动模式
 3. standard
 多例模式
 4. single
 单例模式(当点击返回时会销毁)
 5. singleInstance
 完全的单例模式(在任何时候都不会被销毁)
 6. result
 带有返回值的(可以向父页面带回返回值)
 7. singleInstanceResult
 带有返回值的完全单例(不会被销毁，可以向父页面带回返回值)
## Page(页面)的转场效果
 页面之间切换支持多种过度效果
 
 8. slideleft-从右到左(overlay)
 9. slideright-从左到右(overlay)
 10. slideup-从下到上(overlay)
 11. slidedown-从上到下(overlay)
 12. wxslideleft-类似于微信的从右到左
 13. wxslideright-类似于微信的从左到右
 14. wxslideup-类似于微信的从下到上
 15. wxslidedown-类似于微信的从上到下
 16. pushslideleft-从右到左(push)
 17. pushslideright-从左到右(push)
 18. pushslideup-从下到上(push)
 19. pushslidedown-从上到下(push)
 20. material-Android Material的风格
##  其他功能
 1. 页面之间的传值
 2. 点击事件是否交由框架处理
 3. ajax内容预加载
 4. 新增页面是否增加历史栈
 5. 功能可以通过配置和api两种方式进行调用

##  安装
```bash
$ npm install ctmobile --save
```
## 快速开始
1. 基本机构
```html
<div ct-data-role="page" id="index"></div>
```
具有ct-data-role="page"属性的元素代表一个基本的页面, id属性唯一标识这个页面，需要注意的是具有ct-data-role="page"属性的元素必须为body的子元素，不能是任意级别的元素。还需要注意的是html中至少含有一个Page的结构来代表第一个显示的页面内容

2. 初始化应用
```js
import CtMobile from "ctmobile";
const Router = {
    index: {
        url: "/static/html/index.html",
        component: import(/* webpackChunkName: "index" */ "../pages/index"),
    },
    info: {
        url: "/static/html/info.html",
        component: import(/* webpackChunkName: "info" */ "../pages/info"),
    },
    about: {
        url: "/static/html/about.html",
        component: import(/* webpackChunkName: "about" */ "../pages/about"),
  },
};
const App = CtMobile.CtMobileFactory.create({
	supportCordova: false,
	linkCaptureReload: false,
	router: Router,
});
```

3. 路由

在初始化应用的代码中需要配置router选项，router是一个对象，对象的键需要和基本结构中id属性的值保持一致，值为一个对象，有两个属性url和component

* url
  代表这个页面引用的html片段地址，片段就是一个Page的基本结构
* component
  返回一个Promise对象，代表这个页面的逻辑处理类，Promise中返回的对象应该是集成了Page类的一个子类。
  如用Webpack进行开发的时候可以定义成
  ```js
  component: import(/* webpackChunkName: "about" */ "../pages/about")
  ```
4. 编写页面对用的Page
