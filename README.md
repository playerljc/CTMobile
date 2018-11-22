english | [简体中文](https://github.com/playerljc/CTMobile/blob/master/README_zh-CN.md "简体中文")

## CtMobile
&ensp;&ensp; A mobile-side framework that supports multiple forms of page switching, page transitions, page values, notifications, etc., suitable for developing single-page applications (SPA), hybrid development (mixed), and Córdoba development.
##Development inspiration
&ensp;&ensp; At the beginning of the hybrid development, the company chose jQueryMobile + Córdoba combination to develop hybrid applications. When using jQueryMobile, I encountered many problems, such as management class and cathedral. The organic combination, the original idea is that if each partial page on the browser side and its management class can be as active as Android, so the inspiration comes, CtMobile's implementation is completely Android. The activity is achieved.
##Three major feelings
&ensp;&ensp; There are three important thoughts in CtMoble, namely ** ** page, ** ** router, ** ** BorasdCast.
The page is used to manage the entire life cycle of page creation, initialization, and destruction. The router manages the routing jump of this framework. BorassdCast is used to manage the communication interaction between the notification and the data between the pages.
##Development model
1. Inline mode
All pages are written in an HTML (generally not recommended)
2. ajax mode
Each page is loaded when needed and only loaded once
## Page (page) startup mode
1. Standard
Multiple case mode
2. Single
Singleton mode (destroyed when clicked back)
3. singleInstance
Complete singleton mode (will not be destroyed at any time)
4. Result
With a return value (can bring back the return value to the parent page)
5. singleInstanceResult
A complete singleton with a return value (will not be destroyed, can bring back the return value to the parent page)
## Page (page) transition effect
Switch between pages to support multiple effects

1. slideleft-from right to left (overlay)
2. slideright - from left to right (overlay)
3. slideup - from bottom to top (overlay)
4. slidedown - from top to bottom (overlay)
5. wxslideleft - similar to WeChat from right to left
6. wxslideright - similar to WeChat from left to right
7. wxslideup - similar to WeChat from bottom to top
8. wxslidedown - similar to WeChat from top to bottom
9. pushslideleft - from right to left (push)
10. pushslideright - from left to right (push)
11. pushslideup - from bottom to top (push)
12. pushslidedown - from top to bottom (push)
13. material-Android Material style
##Other functions
1. The value between pages
2. Click event is handled by the framework
3. ajax content preloading
4. Does the new page increase the history stack?
5. Functions can be called through configuration and api

##installation
``` Celebration
$ npm install ctmobile --save
```

## API Documentation
[documentation] (https://playerljc.github.io/)

##Quick start

**1. Basic HTML structure**
-------

```HTML
<div ct-data-role = "page" id = "index" > </ div>
```
&ensp;&ensp;The element with ct-data-role = "page" attribute represents a basic page, and the id attribute uniquely identifies this page. It should be noted that the element with ct-data-role = "page" attribute must be the body. Child element, can not be an element of any level. Also note that the HTML contains at least one page structure to represent the first displayed page content.

**2. Initialize the application**
--------

```JS
Import CtMobile from "ctmobile";
Const Router = {
Index:{
Url: "/ static / html / index.html",
Component:import(/ * webpackChunkName: "index"* /"../pages/index"),
},
Information: {
Url: "/ static / html / info.html",
Component:import(/ * webpackChunkName: "info"* /"../pages/info"),
},
About: {
Url: "/ static/html/about.html",
Component:import(/ * webpackChunkName: "about"* /"../pages/about"),
},
};
Const App = CtMobile.CtMobileFactory.create({
supportCordova: false,
linkCaptureReload:false,
Router: router,
});
```
&ensp; For detailed parameter explanation, please refer to [Property Configuration] (#Property Configuration).

**3. router**
-----

&ensp;&ensp; In the code to initialize the application, you need to configure the router option. The router is an object. The key of the object needs to be consistent with the value of the id attribute in the basic structure. The value is an object, and the URL and component of the two attributes.

* URL
Represents the address of the HTML fragment referenced by this page. The fragment is the basic structure of a page.
* Components
Returns a non-polar object representing the logical processing class of this page. The object returned in the promise should be a subclass of the inherited web class.
When using a WebPack for development, it can be defined as
```JS
Component:import(/ * webpackChunkName: "about"* /"../pages/about")
```
The component properties can be left unset. If the component properties are not set, the framework will consider that the URL loaded page is only displayed and not logically processed.


**4. Write the page corresponding to the page**
--------------

```JS
Import CtMobile from 'ctmobile';

Export default class extends CtMobile.Page {
Constructor (ctmobile, id){
Super (ctmobile, id);
}

/ **
* @override
* /
pageCreate(){
Console.log('page initialization');
}

/ **
* @override
* /
pageShow(){
Console.log (when the page's DOM is displayed, ');
}

/ **
* @override
* /
pageBeforeDestory(){
The console.log (called before the page's DOM is destroyed));
}
}
```
&ensp;&ensp; Writing a class inherits from the page class to complete a page definition, where the constructor has two parameters, ctmobile and ID, where ctmobile represents the entire application instance and ID represents the ID attribute in the page's underlying organization. value.
&ensp;&ensp; where pageCreate, pageShow, and pageBeforeDestory are page lifecycle functions. For more lifecycle functions, please refer to [page lifecycle] (#9 page lifecycle)

**5. Jump to a new page**
-----------
&ensp; Jumping to a new page can be done in two ways
* Configuration method
```JS
<a ct-pageId="info">Go to the information page</a>
```
&ensp;&ensp; Use the CT-PAGEID property in a tag to jump to a new page, where the value of CT-PAGEID is the value of the ID in the page's underlying organization.

* api mode
Use the App.startPage method to jump to a new page, where the application object is the return value after initializing the application. If it is in the page class, it can be obtained by the this.getCtMobile() method.
```JS
. this.getCtMobile()STARTPAGE("/static/html/in info.html PAGEID=info?");
```
&ensp;&ensp; It should be noted that there will be a PAGEID parameter after the HTML path, and the parameter value is the value of the id in the basic structure of the page.

**6. Passing parameters between pages**
---------
* string mode
* Use the ct-parameter attribute
```JS
<a ct-pageId="about" ct-parameter="&a=1&b=2"> </a>
```
* Use api mode
```JS
. this.getCtMobile()STARTPAGE("/static/html/in info.html PAGEID=info & one = 1&B = 2?");
```
* Memory mode
&ensp;&ensp; By calling the page class's setRequest method for parameter passing, calling the page class's call getRequest method on the target page to get the parameters, the advantage of using the memory method is that you can pass any data type data between pages, the disadvantage is if Refreshing this page directly will not save the last data, unlike the string method, you can permanently retain the value of the parameter.

A.js
```JS
<! - Pass parameters to B.html ->
this.setRequest( 'requestCode', {a:1,B:2});
this.ctmobile.startPage( "/static / HTML / b.html PAGEID = B?");
```
B.js
```JS
pageAfterShow(){
<! - Get the parameters passed in A.html ->
Const parameter = JSON.stringify(this.getRequest());
Console.log( 'parameter', parameter);
}
```
&ensp;&ensp; Note that you need to call the getRequest method in the pageAfterShow callback, as long as the pageAfterShow function is called, and then call the getRequest method anywhere to get the parameters.

**7. Page with return value**
---------
&ensp;&ensp; Add the CT-page mode to the basic structure of the page = "Result" or CT-page mode = "singleInstanceResult" attribute

&ensp;&ensp; For example, there are currently two pages of index.html, PopUpDialog.html two pages. There is an eject button in index.html, click on the button to pop up PopUpDialog, this PopUpDialog page

&ensp;&ensp; definition of index.html
```JS
<div ct-data-role = "page" id = "index" >
    <a ct-pageId="PopUpDialog"> Popup PopUpDialog </a>
    <div class = "resultText"> The return value of PopUpDialog <div>
</div>
```
&ensp;&ensp; index.js definition
```JS
Import CtMobile from 'ctmobile';
Import $ from 'jquery';
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
   * PopUpDialog Trigger on return
   * override
   */
  pageResult(e, resultCode, bundle) {
     console.log("resultCode", resultCode, "bundle", JSON.stringify(bundle));
     alert(`resultCode:${resultCode}\r\nbundle:${JSON.stringify(bundle)}`);
  }
}
```

&ensp;&ensp;PopUpDialog html definition
```html
<div ct-data-role="page" id="PopUpDialog" ct-data-mode="result">
     <button class="result">return</button>
</div>
```
&ensp;&ensp; or
```html
<div ct-data-role="page" id="PopUpDialog" ct-data-mode="singleInstanceResult">
     <button class="result">return</button>
</div>
```

&ensp;&ensp;PopUpDialog.js definition
```js
Import CtMobile from 'ctmobile';
Import $ from 'jquery';

Export default class extends CtMobile.Page {
   Constructor(ctmobile,id){
     Super(ctmobile,id);
   }

   /**
    * override
    */
   pageCreate() {
     Const $btnEL = this.getPageJO().find(' .result');
     $btnEl.on('click' , () => {
        this.setResult('PopUpDialog', {a: 1, b: 2});
        This.over();
     });
   }
}
```
&ensp;&ensp;index.html What needs to be done is to rewrite the pageResult method in index.js. This method is triggered after PopUpDialog returns or manually calls the finish method. The pageResult has three parameters e, resultCode, bundle, where resultCode is used. Differentiating between different sources, the bundle is the value that is brought back.
&ensp;&ensp;PopUpDialog.html What needs to be done is to call the this.setResult(resultCode,bundle); method in PopUpDialog.js to set the returned value. The page closes after calling this.finish();

The page usage scenarios with return values are generally divided into two types.
  * Many to one
  A.html, b.html, c.html... all pop up d.html
  * One to many
  A.html popup b.html, c.html, d.html...

In the case of many-to-one, the flag of the parent page can be passed through the setRequest method.

In the case of one-to-many, different sources can be distinguished by the requestCode of the pageResult method.

**8. Page startup mode**
---------
Set the ct-data-mode attribute value in the basic structure of the page. The framework supports a total of 5 startup modes.
 * standard (default)
  &ensp;&ensp;multiple case mode

  &ensp;&ensp;Multiple patterns are created by configuration or api to jump to this page will create a new instance, the so-called new instance is the Dom and Dom corresponding Page class will be new.

 * single
 &ensp;&ensp; singleton mode (destroyed when clicked back)

 &ensp;&ensp; Same as Single in Android, for example, add the following page development order:
 Index.html -> a.html -> b.html -> c.html -> d.html -> b.html
 If b.html's ct-data-mode is set to single, then after executing the above page order, the history stack is currently index.html -> a.html -> b.html
 Also deleted c.html and d.html, deleted colleagues will also call the corresponding life cycle function.
 But if you click back in b.html then b.html will still be destroyed.

 * singleInstance
 &ensp;&ensp;complete singleton mode (will not be destroyed at any time)

 &ensp;&ensp; A complete singleton is never destroyed at all times and only one instance exists.

 * result
 &ensp;&ensp; with return value (can bring back the return value to the parent page)

 &ensp;&ensp;[See page with return value] (#7-page with return value)

 * singleInstanceResult
 &ensp;&ensp;complete singleton with return value (will not be destroyed, can bring back the return value to the parent page)

 &ensp;&ensp; is just like result, but the instance will not be destroyed.

**9. Page life cycle**
---------
Page 1 has a total of 10 life cycle functions

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;![](https://github.com/playerljc/CTMobile/raw/master/outimages/pagelife.png "Page生命周期")

**10. Page transition effect**
---------
Set the ct-data-transition attribute value in the basic structure of the page. The framework supports a total of 13 pages of excessive effects.

  * slideleft - from right to left (overlay)
  * slideright - from left to right (overlay)
  * slideup - from bottom to top
  * slidedown - from top to bottom
  * wxslideleft - similar to WeChat from right to left
  * wxslideright - similar to WeChat from left to right
  * wxslideup - similar to WeChat from bottom to top
  * wxslidedown - similar to WeChat from top to bottom
  * pushslideleft - from right to left (push)
  * pushslideright - from left to right (push)
  * pushslideup - from bottom to top (push)
  * pushslidedown - from top to bottom (push)
  * material-Android Material style

**11. Broadcast (borasdcast)**
---------
&ensp;&ensp; draws on the concept of Borsdcast in Android, provides a series of functions for data transfer between Pages, broadcast is divided into ordered and unordered, can be broadcast through configuration and api.

 * Register by configuration
   Register the ct-data-intentfilter-action and ct-data-intentfilter-categorys attributes in the basic organization.
   ```html
   <div ct-page-role="page"
    Id="index"
    Ct-data-intentfilter-action="actionCode"
    Ct-data-intentfilter-categorys="c1,c2"
    Ct-data-intentfilter-priority="0"
   ></div>
   ```
   Page rewriting pageReceiver method
   ```js
   Import CtMobile from 'ctmobile';
   Export default class extends CtMobile.Page {
    Constructor(ctmobile,id){
        Super(ctmobile,id);
    }

      /**
       * @override
       */
       pageReceiver(intent) {
         Console.log(intent);
       }
   }
   ```
 * Register via api
   ```js
   Import CtMobile from 'ctmobile';
   Export default class extends CtMobile.Page {
    Constructor(ctmobile,id){
        Super(ctmobile,id);
    }

    onRegisterReceiver(intent) {
        Console.log(JSON.stringify(intent));
    }

    /**
      * @override
     */
     pageCreate() {
        this.onRegisterReceiver = this.onRegisterReceiver.bind(this);

     // Register for borasdcast
     this.ctmobile.registerReceiver({
         Action: 'actionCode',
         Priority: 0,
         Categorys: ['c1','c2']
     }, this.onRegisterReceiver);
    }
   }
   ```
 * Send an unordered broadcast
 Call CtMobile's sendBroadcast method in the Page class
 ```js
 this.ctmobile.sendBroadcast({
    Action: 'actionCode',
    Categorys: ['c1','c2'],
    Bundle: {
     a: 1,
     b: 2
    }
 });
 ```
 * Send an orderly broadcast
 Call CtMobile's sendOrderedBroadcast method in the Page class
 ```js
this.ctmobile.sendOrderedBroadcast({
    Action: 'actionCode',
    Categorys: ['c1','c2'],
    Bundle: {
     a: 1,
     b: 2
    }
 });
 ```
 * Ordered broadcast
   * Priority of notification
   Ordered broadcast notifications are ordered. This order is determined by the priority attribute. The larger the priority, the sooner it is notified. The smaller the later, the more notified.
 Use configuration settings priority
```html
<div ct-page-role="page"
    Id="index"
    Ct-data-intentfilter-priority="0"
   ></div>
```
 Use api registration to set priority
 ```js
 // Register for borasdcast
 this.ctmobile.registerReceiver({
    Action: 'actionCode',
    Priority: 0,
    Categorys: ['c1','c2']
 }, this.onRegisterReceiver);
 ```
  * Pass parameters backwards and terminate delivery

&ensp;&ensp; There are two parameters intent and opt in the callback function of the ordered broadcast, where intent is the parameter passed by the notification, opt is an object, there are 2 methods, putExtras and next, where putExtras is set to pass down Parameters, which are merged together. Only the next method is called to pass down.

   * Classification of notifications (categorys)

&ensp;&ensp; When registering a broadcast, in addition to Action, you can define multiple categories. Category can be considered as a secondary title, which is used to define the action fine-grained.

**12. Other features**
---------
 * Whether to increase history
 If you don't want to add a new page to the history stack, you can set the ct-reload property to true to prevent the browser from adding history.
 ```html
 <a ct-pageId="a" ct-reload="true">a.html</a>
 ```
 ```js
 this.ctmobile.startPage('/static/html/a.html?pageId=a',{
    Reload:true
 });
 ```
 For example, index.html -> a.html, then only a.html in the history stack

 * a label is not handled by the framework
 Sometimes we don't want the framework to handle the behavior of the a tag, so we can add ct-data-ajax="false" to the a tag.

 * ajax content preloading
 ```html
 <div ct-data-role="page" id="index">
    <a ct-pageId="a" ct-data-preload="true">into a.html</a>
    <a ct-pageId="b" ct-data-preload="true">into b.html</a>
    <a ct-pageId="c" ct-data-preload="true">into c.html</a>
    <a ct-pageId="d" ct-data-preload="true">into d.html</a>
    <a ct-pageId="e" ct-data-preload="true">into e.html</a>
 </div>
 ```
 The framework will load the contents of a-e.html at initialization time.
 If there is a page in a-e.html that needs to be preloaded, the framework will also be preloaded.
 Each page will only be preloaded once and will not be preloaded if it is preloaded.

 * Use configuration to return the page
 ```html
 <div ct-data-role="page" id="about">
    <header>
        <a class="ct-back-icon" ct-data-rel="back"></a>
    </header>
 </div>
 ```
 
 ## Attribute Configuration

| property | value | description |
| ------------------------------ | ------------------ -- | ----------------------------------------------- --------- |
| ct-data-role | page | Elements with this attribute represent a page |
| ct-data-rel | true \| false | true when an element with this attribute is clicked to perform a return operation |
| ct-pageId | string | used on the <a> tag to represent the id of the page to be loaded |
| ct-parameter | string | used on the <a> tag to represent the parameters to be passed |
| ct-data-transition | slideleft | from right to left (overlay) |
| | slideright | From left to right (overlay) |
| | slideup | From top to top |
| | slidedown | top to bottom (overlay) |
| | wxslideleft | Similar to WeChat from right to left |
| | wxslideright | Similar to WeChat from left to right |
| | wxslideup | Similar to WeChat from bottom to top |
| | wxslidedown | Similar to WeChat from top to bottom |
| | pushslideleft | from right to left (push) |
| | pushslideright | from left to right (push) |
| | pushslideup | from bottom to top (push) |
| | pushslidedown | From top to bottom (push) |
| | material (default) | Android Material Style |
| ct-data-mode | standard (default) | Multiple Cases |
| | single | Singleton (when clicked back, it will be destroyed) |
| | singleInstance | Complete singleton (will not be destroyed) |
| | result | with return value (can bring back the return value to the parent page) |
| | singleInstanceResult | A complete singleton with a return value (will not be destroyed, can bring back the return value to the parent page) |
| ct-data-ajax | true \| false | Whether to handle the jump of the a tag by the framework |
| ct-data-preload | true \| false | Whether to preload the page of the href attribute of the a tag in advance |
| ct-reload | true \| false | Whether to change the number of window.history.length |
| ct-data-intentfilter-action | string | If the page is to be subscribed to the notification |
| ct-data-intentfilter-categorys | [string1 string2 ...] | Filter parameters at subscription |
| ct-data-intentfilter-priority | number 0 (default) | Priority when sending an ordered broadcast, default is 0 |

## CtMobile App Showcase

## Demo program running
&ensp;&ensp;checkou and enter the demo directory
```bash
$ npm install
$ npm start
```
&ensp;&ensp; Enter localhost:8000 in the browser to access the main page of the demo

## Discussion Group
![](https://github.com/playerljc/CTMobile/raw/master/outimages/qq.png "discussion group")

## Licensing
[MIT](/LICENSE)
