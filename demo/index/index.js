/**
 * Created by Administrator on 2017/2/6.
 */
window.onload = onready;

/**
  基本
  开发模式
    inline
    ajax
      基本
      预加载
      加载一个页面所需的所有资源
    混合
  启动模式
    standard
    single
    singleInstance
    result
    singleInstanceResult
  界面传递参数
    get方式
    内存方式
  广播
    有序
      api方式
      标签配置方式
    无序
      api方式
      标签配置方式
  页面转场(跳转)
    增加历史
      配置方式
      api方式
    不增加历史
      配置方式
      api方式
    转场效果
      配置方式
      api方式
  事件
  加载指定的锚点
 */
var _menudata = {children:[
 {text: "基本",href:"../module/base/index.html"},
 {
  text: "开发模式",
  children: [{
   text: "inline",
   href:"../module/devmode/inline/index.html"
  },
  {
   text: "ajax",
   children: [{
    text: "基本",
    href:"../module/devmode/ajax/base/index.html"
   }, {
    text: "预加载",
    href:"../module/devmode/ajax/pretreatment/index.html"
   }, {
    text: "加载一个页面所需的所有资源",
    href:"../module/devmode/ajax/loadstaticresource/index.html"
   }]
  }, {
   text: "混合",
   href:"../module/devmode/hybrid/index.html"
  }]
 },
 {
  text: "启动模式",
  children: [{
   text: "standard",
   href:"../module/startmode/standard/index.html"
  }, {
   text: "single",
   href:"../module/startmode/single/index.html"
  }, {
   text: "singleInstance",
   href:"../module/startmode/singleinstance/index.html"
  }, {
   text: "result",
   href:"../module/startmode/result/index.html"
  }, {
   text: "singleInstanceResult",
   href:"../module/startmode/singleinstanceresult/index.html"
  }]
 },
 {
   text:"界面传递参数",
   children:[{
       text:"get方式",
       href:"../module/parametertransfer/get/index.html"
   },{
       text:"内存方式"
   }]
 },
 {
   text:"广播",
   children:[{
      text:"有序",
      children:[{
          text:"api方式"
      },{
          text:"标签配置方式"
      }]
   },{
       text:"无序",
       children:[{
           text:"api方式"
       },{
           text:"标签配置方式"
       }]
   }]
 },
 {
    text:"页面转场(跳转)",
    children:[{
        text:"增加历史",
        children:[{
         text:"配置方式"
        },{
         text:"api方式"
        }]
    },{
        text:"不增加历史",
        children:[{
            text:"配置方式"
        },{
            text:"api方式"
        }]
    },{
        text:"转场效果",
        children:[{
            text:"配置方式"
        },{
            text:"api方式"
        }]
    }]
 },
 {
   text:"事件"
 },
 {
    text:"加载指定的锚点"
 }
]};
var _history = [];

function onready() {
    initEvents();
    loadMenuData(_menudata,false);
}

function initEvents() {
    $("#leftnavul").on("click","a",function() {
       console.dirxml(this);
       loadMenuData(JSON.parse(this.dataset.data),false);
    });

    $("#leftnavbar").on("click",function(){
        if(_history.length === 1) return;
        _history.pop();
        loadMenuData(_history[_history.length - 1],true);
    });
}

function loadMenuData(data,relaod) {
    if(!data || !data.children) {
        $("#frame").attr("src",data.href);
    } else {
        if(!relaod) {
            _history.push(data);
        }
        var $treeJO = $("#leftnavul");
        $treeJO.empty();
        var df = document.createDocumentFragment();
        for(var i = 0,len = data.children.length; i < len; i++) {
            var $JO = $("<li><a data-data='"+JSON.stringify(data.children[i])+"'>" + data.children[i].text + "</a></li>");
            df.appendChild($JO[0]);
        }
        $treeJO[0].appendChild(df);
    }
}
