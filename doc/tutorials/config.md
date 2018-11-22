## 属性配置

| 属性(property)                 | 取值                 | 说明                                                     |
| ------------------------------ | -------------------- | -------------------------------------------------------- |
| ct-data-role                   | page                 | 有此属性的元素代表一个页面                               |
| ct-data-rel                    | boolean       | true的时候带有此属性的元素点击可以执行返回操作           |
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
| ct-data-ajax                   | boolean       | 是否交由框架处理a标签的跳转                              |
| ct-data-preload                | boolean       | 是否提前预加载a标签的href属性的页面                      |
| ct-reload                      | boolean        | 是否改变window.history.length的数量                      |
| ct-data-intentfilter-action    | string               | 如果页面要订阅通知时的标识                               |
| ct-data-intentfilter-categorys | [string1 string2 …]  | 订阅时的过滤参数                                         |
| ct-data-intentfilter-priority  | number 0(缺省)       | 发送有序广播时的优先级，默认值是0                        |