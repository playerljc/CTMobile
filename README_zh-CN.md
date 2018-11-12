## CtMobile
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
&ensp;详细参数解释请参考[属性配置](#属性配置)。

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
&ensp;&ensp;其中pageCreate，pageShow和pageBeforeDestory是Page的生命周期函数，更多生命周期函数请参考[Page的生命周期](#9-Page的生命周期)

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
&ensp;&ensp;通过调用Page类的setRequest方法进行参数传递，在目标页面调用Page类的getRequest方法获取参数，使用内存方式的好处是可以在页面之间传递任何数据类型的数据，缺点是如果直接刷新此页的话不会保存上一回的数据，不像字符串方式可以永久保留参数的值

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
&ensp;&ensp; 页面的基本结构中加入ct-page-mode="result"或者ct-page-mode="singleInstanceResult"属性

&ensp;&ensp;举个例子，当前有两个页面index.html，PopUpDialog.html两个页面。index.html中有个弹出按钮，点击按钮弹出PopUpDialog页面

&ensp;&ensp;index.html定义
```js
<div ct-data-role="page" id="index">
    <a ct-pageId="PopUpDialog">弹出PopUpDialog</a>
    <div class="resultText">PopUpDialog的返回值<div>
</div>
```
&ensp;&ensp;index.js定义
```js
import CtMobile from 'ctmobile';
import $ from 'jquery';
export default class extends CtMobile.Page{
  constructor(ctmobile,id){
    super(ctmobile,id);
  }

  /**
   * override
   */
  pageCreate() {

  }

  /**
   * PopUpDialog返回时触发
   * override
   */
  pageResult(e, resultCode, bundle) {
     console.log("resultCode", resultCode, "bundle", JSON.stringify(bundle));
     alert(`resultCode:${resultCode}\r\nbundle:${JSON.stringify(bundle)}`);
  }
}
```

&ensp;&ensp;PopUpDialog的html定义
```html
<div ct-data-role="page" id="PopUpDialog" ct-data-mode="result">
    <button class="result">返回</button>
</div>
```
&ensp;&ensp;或者
```html
<div ct-data-role="page" id="PopUpDialog" ct-data-mode="singleInstanceResult">
    <button class="result">返回</button>
</div>
```

&ensp;&ensp;PopUpDialog.js定义
```js
import CtMobile from 'ctmobile';
import $ from 'jquery';

export default class extends CtMobile.Page {
  constructor(ctmobile,id){
    super(ctmobile,id);
  }

  /**
   * override
   */
  pageCreate() {
    const $btnEL = this.getPageJO().find(' .result');
    $btnEl.on('click' , () => {
       this.setResult('PopUpDialog', {a: 1, b: 2});
       this.over();
    });
  }
}
```
&ensp;&ensp;index.html需要做的是在index.js中重写pageResult方法，此方法在PopUpDialog返回或手动调用finish方法后被触发，pageResult的有三个参数e，resultCode，bundle，其中resultCode用来区分不同的来源，bundle是被带回来的值。
&ensp;&ensp;PopUpDialog.html需要做的是在PopUpDialog.js中调用this.setResult(resultCode,bundle);方法来设置返回的值，在调用this.finish();方法后页面关闭。

带有返回值的页面使用场景一般分为两种
 * 多对一
 a.html,b.html,c.html...都弹出d.html
 * 一对多
 a.html弹出b.html,c.html,d.html...

在多对一的情况下可以通过setRequest方法把父页面的标志传递过去。

在一对多的情况下可以通过pageResult方法的requestCode区分不同来源。

**8. Page的启动模式**
---------
在页面的基本结构中设置ct-data-mode属性值即可，框架一共支持5中启动模式
 * standard（默认）
  &ensp;&ensp;多例模式

  &ensp;&ensp;多例模式就是通过配置或者api跳转到此页面的时候都会建立一个新的实例，所谓新的实例就是Dom和Dom对应的Page类都会是新的。

 * single
  &ensp;&ensp;单例模式(当点击返回时会销毁)

  &ensp;&ensp;和Android中single一样,举个例子，加入有如下的页面开发顺序 :
  index.html -> a.html -> b.html -> c.html -> d.html -> b.html
  如果把b.html的ct-data-mode设置为single，那么执行上述页面顺序后，   历史栈中当前是 index.html -> a.html -> b.html
  也是删除了c.html和d.html，删除的同事也会调用相应的生命周期函数。
  但是如果在b.html中点击返回那么b.html还是会销毁的。

 * singleInstance
  &ensp;&ensp;完全的单例模式(在任何时候都不会被销毁)

  &ensp;&ensp;完全单例就是在任何时候都不会被销毁且只有一个实例存在。

 * result
  &ensp;&ensp;带有返回值的(可以向父页面带回返回值)

  &ensp;&ensp;[参见带有返回值的页面](#7-带有返回值的页面)

 * singleInstanceResult
  &ensp;&ensp;带有返回值的完全单例(不会被销毁，可以向父页面带回返回值)

  &ensp;&ensp;和result一样只是实例不会被销毁。

**9. Page的生命周期**
---------
Page一共有10个生命周期函数

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;![](https://github.com/playerljc/CTMobile/raw/master/outimages/pagelife.png "Page生命周期")

**10. 页面转场效果**
---------
在页面的基本结构中设置ct-data-transition属性值即可，框架一共支持13种页面的过度效果

 * slideleft-从右到左(overlay)
 * slideright-从左到右(overlay)
 * slideup-从下到上(overlay)
 * slidedown-从上到下(overlay)
 * wxslideleft-类似于微信的从右到左
 * wxslideright-类似于微信的从左到右
 * wxslideup-类似于微信的从下到上
 * wxslidedown-类似于微信的从上到下
 * pushslideleft-从右到左(push)
 * pushslideright-从左到右(push)
 * pushslideup-从下到上(push)
 * pushslidedown-从上到下(push)
 * material-Android Material的风格

**11. 广播(borasdcast)**
---------
&ensp;&ensp;借鉴了Android中Borasdcast概念，为Page之间的数据传递提供了一系列功能，广播分为有序和无序，可以通过配置和api两种方式实现广播。

 * 通过配置注册
   在基本机构中加入ct-data-intentfilter-action，ct-data-intentfilter-categorys属性进行注册
   ```html
   <div ct-page-role="page"
    id="index"
    ct-data-intentfilter-action="actionCode"
    ct-data-intentfilter-categorys="c1,c2"
    ct-data-intentfilter-priority="0"
   ></div>
   ```
   Page中重写pageReceiver方法
   ```js
   import CtMobile from 'ctmobile';
   export default class extends CtMobile.Page {
      constructor(ctmobile,id){
        super(ctmobile,id);
      }

      /**
       * @override
       */
      pageReceiver(intent) {
        console.log(intent);
      }
   }
   ```
 * 通过api注册
   ```js
   import CtMobile from 'ctmobile';
   export default class extends CtMobile.Page {
     constructor(ctmobile,id){
       super(ctmobile,id);
     }

     onRegisterReceiver(intent) {
        console.log(JSON.stringify(intent));
     }

     /**
       * @override
       */
     pageCreate() {
       this.onRegisterReceiver = this.onRegisterReceiver.bind(this);

       // 注册borasdcast
       this.ctmobile.registerReceiver({
         action: 'actionCode',
         priority: 0,
         categorys: ['c1','c2']
       }, this.onRegisterReceiver);
     }
   }
   ```
 * 发送无序广播
 在Page类中调用CtMobile的sendBroadcast方法
 ```js
 this.ctmobile.sendBroadcast({
    action: 'actionCode',
    categorys: ['c1','c2'],
    bundle: {
      a: 1,
      b: 2
    }
 });
 ```
 * 发送有序广播
 在Page类中调用CtMobile的sendOrderedBroadcast方法
 ```js
 this.ctmobile.sendOrderedBroadcast({
    action: 'actionCode',
    categorys: ['c1','c2'],
    bundle: {
      a: 1,
      b: 2
    }
 });
 ```
 * 有序广播
   * 通知的优先级
   有序广播的通知是有顺序的，这个顺序是有priority这个属性决定的，priority越大越先被通知到，越小越晚被通知到。
 使用配置设置priority
```html
<div ct-page-role="page"
    id="index"
    ct-data-intentfilter-priority="0"
   ></div>
```
 使用api注册设置priority
 ```js
 // 注册borasdcast
 this.ctmobile.registerReceiver({
    action: 'actionCode',
    priority: 0,
    categorys: ['c1','c2']
 }, this.onRegisterReceiver);
 ```
   * 向后传递参数和终止传递

&ensp;&ensp;在有序广播的回调函数中会有2个参数intent和opt，其中intent是通知传递的参数，opt是个对象，其中有2个方法,putExtras和next，其中putExtras设置向下传递的参数，这些参数是合并在一起的。只有调用next方法才向下进行传递。

   * 通知的分类(categorys)

&ensp;&ensp;在注册广播的时候除了Action之外，还可以定义多个category，categorys可以认为是一个二级标题，作用是用来对Action进行细粒度的定义。

**12. 其他功能**
---------
 * 是否增加历史
 如果不想让新跳转的页面增加到历史栈中，可以设置ct-reload属性为true来阻止浏览器增加历史。
 ```html
 <a ct-pageId="a" ct-reload="true">a.html</a>
 ```
 ```js
 this.ctmobile.startPage('/static/html/a.html?pageId=a',{
    reload:true
 });
 ```
 比如index.html -> a.html，那么历史栈中只有a.html

 * a标签不交由框架处理
 有些时候我们不希望让框架来处理a标签的行为，此时就可以在a标签上加入ct-data-ajax="false"

 * ajax内容预加载
 ```html
 <div ct-data-role="page" id="index">
    <a ct-pageId="a" ct-data-preload="true">into a.html</a>
    <a ct-pageId="b" ct-data-preload="true">into b.html</a>
    <a ct-pageId="c" ct-data-preload="true">into c.html</a>
    <a ct-pageId="d" ct-data-preload="true">into d.html</a>
    <a ct-pageId="e" ct-data-preload="true">into e.html</a>
 </div>
 ```
 框架会在初始化的时候就加载a-e.html的内容
 如果a-e.html中还有需要预加载的页面，那框架还会进行预加载
 每个页面只会被预加载一次，如果预加载完了以后就不会在被预加载了。

 * 使用配置进行页面的返回
 ```html
 <div ct-data-role="page" id="about">
    <header>
      <a class="ct-back-icon" ct-data-rel="back"></a>
    </header>
 </div>
 ```

## 属性配置

| 属性(property)                 | 取值                 | 说明                                                     |
| ------------------------------ | -------------------- | -------------------------------------------------------- |
| ct-data-role                   | page                 | 有此属性的元素代表一个页面                               |
| ct-data-rel                    | true \| false        | true的时候带有此属性的元素点击可以执行返回操作           |
| ct-pageId                      | string               | 用在<a>标签上代表要加载页面的id                          |
| ct-parameter                   | string               | 用在<a>标签上代表要传递的参数                            |
| ct-data-transition             | slideleft            | 从右到左(overlay)                                        |
|                                | slideright           | 从左到右(overlay)                                        |
|                                | slideup              | 从下到上(overlay)                                        |
|                                | slidedown            | 从上到下(overlay)                                        |
|                                | wxslideleft          | 类似于微信的从右到左                                     |
|                                | wxslideright         | 类似于微信的从左到右                                     |
|                                | wxslideup            | 类似于微信的从下到上                                     |
|                                | wxslidedown          | 类似于微信的从上到下                                     |
|                                | pushslideleft        | 从右到左(push)                                           |
|                                | pushslideright       | 从左到右(push)                                           |
|                                | pushslideup          | 从下到上(push)                                           |
|                                | pushslidedown        | 从上到下(push)                                           |
|                                | material(缺省)       | Android Material的风格                                   |
| ct-data-mode                   | standard(缺省)       | 多例                                                     |
|                                | single               | 单例(当点击返回时，会销毁)                               |
|                                | singleInstance       | 完全单例(不会被销毁)                                     |
|                                | result               | 带有返回值的(可以向父页面带回返回值)                     |
|                                | singleInstanceResult | 带有返回值的完全单例(不会被销毁，可以向父页面带回返回值) |
| ct-data-ajax                   | true \| false        | 是否交由框架处理a标签的跳转                              |
| ct-data-preload                | true \| false        | 是否提前预加载a标签的href属性的页面                      |
| ct-reload                      | true \| false        | 是否改变window.history.length的数量                      |
| ct-data-intentfilter-action    | string               | 如果页面要订阅通知时的标识                               |
| ct-data-intentfilter-categorys | [string1 string2 …]  | 订阅时的过滤参数                                         |
| ct-data-intentfilter-priority  | number 0(缺省)       | 发送有序广播时的优先级，默认值是0                        |

## CtMobile应用程序展示

## Demo程序的运行
&ensp;&ensp;checkou后进入demo目录
```bash
$ npm install
$ npm start
```
&ensp;&ensp;在浏览器上输入localhost:8000即可访问到demo的主页面

## 讨论群
![](https://github.com/playerljc/CTMobile/raw/master/outimages/qq.png "讨论群")

## 许可
[MIT](/LICENSE)
