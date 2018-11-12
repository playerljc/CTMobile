## CTMobile
&ensp;&ensp;一个移动端框架，支持页面的多种形式切换，页面转场，页面传值，通知等，适用于开发单页面应用(SPA)，混合开发(Hybrid)，Cordova开发。
## 开发灵感
&ensp;&ensp;期初刚接触Hybrid开发的时候公司选用的是jQueryMobile+Cordova的组合来开发混合应用，在用jQueryMobile的时候遇到了很多问题如管理类和Dom之间总是不能很好的有机结合在一起，当初的想法是如果在浏览器端每个局部页面和其管理类能像Android中的Activity一样就好了，所以灵感就来了，CtMobile的实现完全借助于Android中的Activity来实现。
## 三大感念
&ensp;&ensp;CtMoble中有三个重要的感念，分别是**Page**，**Router**，**BorasdCast**.
其中Page用来管理页面的创建，初始化，销毁的整个生命周期，Router管理这个框架的路由跳转，BorasdCast用来管理通知和页面之间的数据的通信交互。 
## 开发模式
 1. inline模式
 所有的页面都写在一个html中(一般不推荐使用)
 2. ajax模式
 每个页面在需要的时候才进行加载，且只加载一次
## Page(页面)的启动模式
 1. standard
 多例模式
 2. single
 单例模式(当点击返回时会销毁)
 3. singleInstance
 完全的单例模式(在任何时候都不会被销毁)
 4. result
 带有返回值的(可以向父页面带回返回值)
 5. singleInstanceResult
 带有返回值的完全单例(不会被销毁，可以向父页面带回返回值)
## Page(页面)的转场效果
 页面之间切换支持多种过度效果
 
 1. slideleft-从右到左(overlay)
 2. slideright-从左到右(overlay)
 3. slideup-从下到上(overlay)
 4. slidedown-从上到下(overlay)
 5. wxslideleft-类似于微信的从右到左
 6. wxslideright-类似于微信的从左到右
 7. wxslideup-类似于微信的从下到上
 8. wxslidedown-类似于微信的从上到下
 9. pushslideleft-从右到左(push)
 10. pushslideright-从左到右(push)
 11. pushslideup-从下到上(push)
 12. pushslidedown-从上到下(push)
 13. material-Android Material的风格
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

**1. 基本的html结构**
-------

```html
<div ct-data-role="page" id="index"></div>
```
&ensp;&ensp;具有ct-data-role="page"属性的元素代表一个基本的页面, id属性唯一标识这个页面，需要注意的是具有ct-data-role="page"属性的元素必须为body的子元素，不能是任意级别的元素。还需要注意的是html中至少含有一个Page的结构来代表第一个显示的页面内容

**2. 初始化应用**
--------

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
&ensp;详细参数解释请参考[配置](#配置)。

**3. 路由**
-----

&ensp;&ensp;在初始化应用的代码中需要配置router选项，router是一个对象，对象的键需要和基本结构中id属性的值保持一致，值为一个对象，有两个属性url和component

* url
  代表这个页面引用的html片段地址，片段就是一个Page的基本结构
* component
  返回一个Promise对象，代表这个页面的逻辑处理类，Promise中返回的对象应该是继承了Page类的一个子类。
  如用Webpack进行开发的时候可以定义成
  ```js
  component: import(/* webpackChunkName: "about" */ "../pages/about")
  ```
  component属性可以不进行设置，如果不设置component属性，那么框架会认为url载入的页面只进行显示，不进行逻辑处理。
  

**4. 编写页面对应的Page**
--------------

```js
import CtMobile from 'ctmobile';

export default class extends CtMobile.Page {
    constructor(ctmobile, id) {
      super(ctmobile, id);
    }
    
    /**
     * @override
     */
    pageCreate(){
        console.log('页面初始化');
    }
    
    /**
     * @override
     */
    pageShow() {
      console.log('page的DOM显示时调用');
    }
    
    /**
     * @override
     */
    pageBeforeDestory(){
      console.log('page的DOM销毁之前调用');
    }
}
```
&ensp;&ensp;编写一个类继承自Page类即可完成一个页面的定义，其中构造函数会有两个参数，ctmobile和id，其中ctmobile代表整个App的实例，id代表Page基本机构中的id属性值。
&ensp;&ensp;其中pageCreate，pageShow和pageBeforeDestory是Page的生命周期函数，更多生命周期函数请参考[生命周期](#生命周期)

**5. 跳转到一个新页面**
-----------
&ensp;跳转到一个新页面可以有两种方式
* 配置方式
```js
<a ct-pageId="info">跳转到info页面</a>
```
&ensp;&ensp;在a标签中使用ct-pageId属性就可以跳转到一个新的页面，其中ct-pageId的值为Page基本机构中id的值。

* api方式
使用App.startPage方法跳转到一个新的页面，其中App对象是初始化应用后的返回值，如果是在Page类中可以通过this.getCtMobile()方法获取
```js
this.getCtMobile().startPage("/static/html/info.html?pageId=info");
```
&ensp;&ensp;需要注意的是html路径后会有一个pageId的参数，参数值是Page基本结构中id的值

**6. 页面间传递参数**
---------
* 字符串方式
  * 使用ct-parameter属性
  ```js
  <a ct-pageId="about" ct-parameter="&a=1&b=2"></a>
  ```
  * 使用api方式
  ```js
  this.getCtMobile().startPage("/static/html/info.html?pageId=info&a=1&b=2");
  ```
* 内存方式
&ensp;&ensp;通过调用Page类的setRequest方法进行参数传递，在目标页面调用Page类的getRequest方法获取参数
  
   A.js
   ```js
   <!-- 向B.html传递参数 -->
   this.setRequest('requestCode',{a:1,b:2});
   this.ctmobile.startPage("/static/html/b.html?pageId=b");
   ```
   B.js
   ```js
   pageAfterShow() {
       <!-- 获取A.html传递过来的参数 -->
       const parameter = JSON.stringify(this.getRequest());
	   console.log('parameter',parameter);
	}
   ```
&ensp;&ensp;需要注意的是需要在pageAfterShow的回调中调用getRequest方法，只要pageAfterShow函数被调用，之后在任何地方在调用getRequest方法都可以获取到参数。

**7. 带有返回值的页面**
---------

**8. Page的启动模式**
---------

**9. 页面转场效果**
---------

**10. 广播(borasdcast)**
---------

## 属性配置
