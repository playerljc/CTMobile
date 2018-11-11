## CTMobile
一个移动端框架，支持页面的多种形式切换，页面转场，页面传值，通知等，适用于开发单页面应用，混合开发，Cordova开发。
##  开发模式
 1. inline模式
 2. ajax模式
##  安装
 npm install ctmobile --save-dev
## 快速开始
1. 基本机构
```html
<div ct-data-role="page" id="index"></div>
```
具有ct-data-role="page"属性的元素代表一个基本的页面, id属性唯一标识这个页面，需要注意的是具有ct-data-role="page"属性的元素必须为body的子元素，不能是任意级别的元素。

2. 初始化
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

2中需要配置router选项，router是一个对象，对象的键需要和基本结构中id属性的值保持一致，值为一个对象，有两个属性url和component

* url
  代表这个页面引用的html片段地址
* component
  返回一个Promise对象，代表这个页面的逻辑处理类
