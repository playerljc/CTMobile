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