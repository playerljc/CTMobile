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

