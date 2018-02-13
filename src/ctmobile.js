/**
 * Created by lzq on 2015/12/1.
 * ctmobile.js
 * CtMobie移动端开发框架(依赖jQuery)
 * 1.支持AMD和CMD规范
 * 2.支持WEB主体形和mulitview两种混合开发模式
 * 3.WEB主体形支持三种model模式
 *   mode1: 本地锚点模式(inline模式)
 *           模板都在本地的一个html中进行预先定义
 *   mode2:  Ajax加载模式
 *           只有第一页的模板在html进行预先定义，其他页面的模板用Ajax动态加载
 *   mode3: 混合模式
 *           mode1和mode2混合进行
 *
 *
 *
 * 1.转场动画
 * 2.转场传参(pageBeforeChange事件)(ok)
 * 3.带有返回值的(ok)
 * 4.通知(ok 无序不能传递参数)
 * 5.头
 * 6.转场mask
 * 7.多个module module1(WebView),module2(WebView),module3(WebView)
 * 8.
 */
(function (factory) {

  /**
   * 创建框架对象
   * @param $　                     jquery
   * @param w                       window
   * @param exports                 require的exports
   * @param require                 require的require
   * @param AngularDirectiveManager angular的directiveManager
   * @param AngularFilterManager    angular的filterManager
   * @param AngularServiceManager   angular的serviceManager
   * @returns CTMobile
   */
  function createMobile($,
                        w,
                        exports,
                        require,
                        AngularDirectiveManager,
                        AngularFilterManager,
                        AngularServiceManager) {

    var obj = {
      /**
       * 配置方法
       * @param _config {
       *     mode:[web | mulitview],模式類型
       *     supportAngular:[true | false]，是否支持angular
       *     supportCordova:[true | false]，是否支持cordova
       *     linkCaptureReload:[true | false] <a>標籤加載頁面是否改變瀏覽器歷史
       *     Ajax加載的js路徑
       *     paths:{
       *       id:[]
       *     }
       * }
       */
      config: function (_config) {
        obj = factory(
          obj,
          $,
          w,
          exports,
          require,
          /**
           * mode共有2种类型[web|mulitview]
           */
          _config.mode || "web",
          /*angular配置*/
          {
            supportAngular: _config.supportAngular || false, /*是否支持angular*/
            appName: "ctmobile", /*ng-app的名称*/
            angular: w.angular/*angular对象*/
          },
          /*cordova配置*/
          {
            supportCordova: _config.supportCordova || false/*是否支持cordovs*/
          },
          _config.linkCaptureReload || false,
          AngularDirectiveManager,
          AngularFilterManager,
          AngularServiceManager,
          (_config.paths || {})
        )
      }
    };

    return obj;
  }

  /**
   * 如果支持amd或cmd模块
   */
  if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(
      [
        "jquery",
        "exports",
        "require",
        "AngularDirectiveManager",
        "AngularFilterManager",
        "AngularServiceManager"
      ],
      function (jQuery,
                exports,
                require,
                AngularDirectiveManager,
                AngularFilterManager,
                AngularServiceManager) {
        return createMobile(
          jQuery,
          window,
          exports,
          require,
          AngularDirectiveManager,
          AngularFilterManager,
          AngularServiceManager
        );
      }
    );
  }
  /**
   * 不支持amd或cmd模块
   */
  else {
    CtMobile = createMobile(
      jQuery,
      window,
      {},
      {},
      AngularDirectiveManager,
      AngularFilterManager,
      AngularServiceManager
    );
  }
})(
  /**
   * factory
   * @param root 根对象
   * @param $ jQuery | Zepto | 自行实现的对象
   * @param w Window
   * @param exports require的exports
   * @param require require的require
   * @param mode [web|mulitview]
   * @param angular的配置
   * angularConfig {
   *     supportAngular:[true | false] 是否支持angular
   *     appName: String ng-app的名称
   *     angular: angular的对象
   * }
   * @param cordova的配置
   * cordovaConfig{
   *     supportCordova:[true | false] 是否支持cordova
   * }
   * linkCaptureReload [true | false] <a>標籤加載頁面是否改變瀏覽器歷史 默認值是false
   * @param paths Ajax加载page对应的管理类js路径
   * {
   *   id:path
   * }
   * @returns {*|{}}
   */
  function (root,
            $,
            w,
            exports,
            require,
            _mode,
            angularConfig,
            cordovaConfig,
            linkCaptureReload,
            AngularDirectiveManager,
            AngularFilterManager,
            AngularServiceManager,
            paths) {

    /**-----------------------------------------------  全局对象的定义 ---------------------------------------------------**/
    /**
     * 滑动缺省的时间
     */
    var _SLIDEDURATION = 500,
      /**
       * 是否开启调试
       * @type {boolean}
       * @private
       */
      _debugger = true,
      /**
       * 是否初始化过
       */
      _hasInited = false,
      /**
       * 页面的模板数据
       */
      _templateDB = {},
      /**
       * zIndex
       */
      _zIndex = 0,
      /**
       * 历史栈
       */
      _history = [],
      /**
       * bodyDom
       */
      _bodyDOM = null,
      /**
       * angularApp
       */
      _angularApp = null,
      /**
       * angularConfig
       */
      _angularConfig = angularConfig,
      /**
       * cordovaConfig
       */
      _cordovaConfig = cordovaConfig,
      /**
       * maskDOM
       */
      _maskDOM = null,
      /**
       * 页面切换时的锁
       */
      _changeKey = false,
      /**
       * 默认的页面过渡类型
       */
      _transition = "material",
      /**
       * 存放完全单例对象的容器
       */
      _singleInstances = null,
      /**
       * clientWidth
       */
      _clientWidth = null,
      /**
       * clientHeight
       */
      _clientHeight = null,
      /**
       * requirejs的exports
       */
      _exports = exports,
      /**
       * require的require
       */
      _require = require;

    /**----------------------------------- Page类定义 --------------------------------**/
    // TODO:Page类定义
    /**
     * 代表一个页面对象
     * Class _page
     *
     *  ***************
     *  *                                                       pageEvents                                          *
     *  ***************
     * ------pageCreate
     * 注释：page的DOM创建完成时调用
     *
     * ------pageBeforeShow
     * 注释：page的DOM显示之前调用
     *
     * ------pageShow
     * 注释：page的DOM显示时调用
     *
     * ------pageAfterShow
     * 注释：page的DOM显示之后调用
     *
     * ------pageBeforePause
     * 注释：page的DOM暂停之前调用
     *
     * ------pageAfterPause
     * 注释：page的DOM暂停之后调用
     *
     * ------pageAfterRestore
     * 注释：page的DOM恢复之前调用
     *
     * ------pageRestore
     * 注释：page的DOM恢复时调用
     *
     * ------pageAfterRestore
     * 注释：page的DOM恢复之后调用
     *
     * ------pageBeforeDestroy
     * 注释：page的DOM销毁之前调用
     *
     * ------pageResult
     * 注释：当ct-data-mode设置为result时,当page代表的对象调用over时,并且设置了setResult(resultCode,bundle)后
     * 调用对象的pageResult事件会被触发
     *
     * -----pageAngularInjectorBefore
     * 注释：当angularConfig中配置了开启angular操作后，页面渲染之后，用angular编译page之前触发pageAngularInjectorBefore事件
     *
     * -----pageReceiver
     * 注释：当设置了ct-data-intentfilter-action时,满足条件时触发
     *
     * pageBeforeChange
     * 注释：页面切换之前调用，一般用于截获转场的参数
     *
     * DOMContentAndDeviceReady
     * 注释：如果开启了对cordova的支持，当dom和device都加载完成时触发
     *
     *  ***************
     *  *                                                       ct-data-*                                           *
     *  ***************
     *
     * -----                                                    ct-data-role(表示一个页面)
     * 只能取值为page
     *
     * -----                                                    ct-data-transition(过渡类型)
     * 缺省值:slideright
     * slideleft:从右到左
     * slideright:从左到右
     * slideup:从下到上
     * slidedown:从上到下
     *
     * wxslideleft:类似于微信的从右到左
     * wxslideright:类似于微信的从左到右
     * wxslideup:类似于微信的从下到上
     * wxslidedown:类似于微信的从上到下
     *
     * pushslideleft:推模式从右到左
     * pushslideright:推模式从左到右
     * pushslideup:推模式从下到上
     * pushslidedown:推模式从上到下
     *
     * material:Android Material的风格
     *
     *
     *
     * -----                                                    ct-data-rel = true(是否支持返回操作)
     * true:是返回按钮
     *
     * -----                                                    ct-data-mode(page的模式)
     * 缺省值:standard
     * standard:多例
     * single:单例(回路单例)
     * singleInstance:完全单例
     * result:有返回值的
     * singleInstanceResult:有返回值的完全单例
     *
     * -----                                                    ct-data-ajax(是否交由框架处理a标签的跳转)
     * 缺省:交由框架处理
     * true:交由框架处理
     * false:不交由框架处理
     * 注意：如果a标签交由框架处理那么a的href属性值代表的地址中必须要有pageId=自定义pageId的值，也就是说框架占用了pageId键，所有GET请求参数
     *       中用户不能定义pageId键
     *
     * -----                                                    ct-data-preload(是否提前用Ajax预加载a标签的href属性的页面)
     * 缺省:不进行预加载
     * true:进行预加载
     * false:不进行预加载
     * 注意：只有a标签的href属性是可以用ajax加载的地址且a标签的跳转交由框架处理
     *
     *
     * -----                                                    ct-reload(是否改變瀏覽器路徑)
     * 缺省值: false
     * true: 不改變瀏覽器歷史
     * false: 改變瀏覽器歷史
     *
     * ------------------------------------------------------------ 通知(BroadcastReceiver) ------------------------------------------------------------------
     * 实现了Android中的BroadcastReceiver的功能，通知分为“无序通知”和 “有序通知”
     * 无序通知: 用Action和Category进行查找，Action只有1个，但Category有多个，只有都匹配的才能进行通知，且通知不能继续传递
     * 有序通知: 用Action和Category进行查找，Action只有1个，但Category有多个，匹配的同时按照Priority的值从小到大进行通知，通知是逐层传递了，并且上一层
     *           可以添加附加参数到下一层，任意一层都可以中断通知
     * 使用方法:分为API方式和属性方式
     *         API方式:调用CtMobile.registerReceiver(handler,intent)进行订阅，调用unregisterReceiver(handler)进行解除订阅
     *         属性方式:在div上添加ct-data-intentfilter-action属性 ct-data-intentfilter-categorys和ct-data-intentfilter-priority为辅助属性
     *                  如果订阅成功会触发pageReceiver方法
     *                                                         ct-data-intentfilter-action(broadcatsReceiver的Action)
     * 缺省值：无
     * 注意：如果想让页面接收通知必须添加此属性
     *                                                         ct-data-intentfilter-categorys(broadcatsReceiver的Categorys,多个用空格间隔)
     * 缺省值：无
     * 注意：可以不填
     *                                                         ct-data-intentfilter-priority(broadcatsReceiver的Priority，优先级)
     * 缺省值：0
     * 注意：可以不填
     * ------------------------------------------------------------ 通知(BroadcastReceiver) ------------------------------------------------------------------
     */
    var _page = (function () {

      /**
       * 创建Page的DOM结构
       */
      function createPageDOM() {
        var _self = this;
        /**
         * 根据pageId克隆模板
         */
        // TODO:(模板)change
        this._pDom = createElement(_templateDB[this.pageId]);

        /**
         * 设置page真实的id
         */
        this._pDom.setAttribute("id", this.id);

        /**
         * 改变page中所有包含id的属性的值都加入id前缀(根据情况进行扩展)
         * label的for属性
         * input的list属性
         * datalist的id属性
         */
        forEach(this._pDom.querySelectorAll("[id]"), function () {
          this.setAttribute("id", _self.id + this.getAttribute("id"));
        });
        forEach(this._pDom.querySelectorAll("label[for]"), function () {
          this.setAttribute("for", _self.id + this.getAttribute("for"));
        });
        forEach(this._pDom.querySelectorAll("input[list]"), function () {
          this.setAttribute("list", _self.id + this.getAttribute("list"));
        });
        forEach(this._pDom.querySelectorAll("datalist[id]"), function () {
          this.setAttribute("id", _self.id + this.getAttribute("id"));
        });

        /**
         * 获取page的页面过渡类型
         */
        if (this.getPageDOM().getAttribute("ct-data-transition")) {
          this.transition = this.getPageDOM().getAttribute("ct-data-transition");
        }

        /**
         * 注册Page的默认事件
         * 在addEventListeners之前的代码调用fireEvent方法去触发事件，因为只有注册后才能触发事件
         */
        addEventListeners.call(this);

        /**
         * 对page中的通知(BorasdcastReceiver)进行处理
         */
        if (this.getPageDOM().getAttribute("ct-data-intentfilter-action")) {
          root.registerReceiver(this.pageReceiver, {
            action: this.getPageDOM().getAttribute("ct-data-intentfilter-action"),
            priority: this.getPageDOM().getAttribute("ct-data-intentfilter-priority") ? parseInt(this.getPageDOM().getAttribute("ct-data-intentfilter-priority")) : 0,
            categorys: this.getPageDOM().getAttribute("ct-data-intentfilter-categorys") ? this.getPageDOM().getAttribute("ct-data-intentfilter-categorys").split(" ") : []
          });
        }

        /**
         * 获取page中注册的返回按钮
         */
        //this._$p.delegate("[ct-data-rel='back']" , "click", function () {
        //    go(-1);
        //});
        this._pDom.addEventListener("click", function (e) {
          if (e.target.getAttribute("ct-data-rel") && e.target.getAttribute("ct-data-rel") === "back") {
            go(-1);
          }
        }, false);
        //var aBackDom = _self._pDom.querySelector("a[ct-data-rel='back']");
        //if(aBackDom) {
        //    aBackDom.addEventListener("click",function(e){
        //        if("mulitview" === _mode) {
        //            w.mulitview.finish(function(){},function(){});
        //        } else {
        //            go(-1);
        //        }
        //    },false);
        //}

        /**
         * 渲染
         */
        _bodyDOM.appendChild(w.document.createDocumentFragment().appendChild(this._pDom));

        ///**
        // * 注册Page的默认事件
        // * 在addEventListeners之前的代码调用fireEvent方法去触发事件，因为只有注册后才能触发事件
        // */
        //addEventListeners.call(this);

        /**
         * 如果支持angular,并且page中注册了controller
         */
        if (isSupportAngular() && isEnableAngular.call(this)) {
          /**
           * 替换page中所有ct-ng-controller为ng-controller，且ng-controller的值加入id前缀
           */
          /**
           * 替换ct-data-role="page"的controller
           */
          if (this._pDom.getAttribute("ct-ng-controller")) {
            this._pDom.setAttribute("ng-controller", _self.id + this._pDom.getAttribute("ct-ng-controller"));
            this._pDom.removeAttribute("ct-ng-controller");
          }
          /**
           * 替换page中所有元素的controller
           */
          forEach(this._pDom.querySelectorAll("[ct-ng-controller]"), function () {
            this.setAttribute("ng-controller", _self.id + this.getAttribute("ct-ng-controller"));
            this.removeAttribute("ct-ng-controller");
          });

          /**
           * 触发pageAngularInjectorBefore事件
           * 一般类中去动态的注册页面用到的controller
           */
          fireEvent(_self.getPageDOM(), "pageAngularInjectorBefore", [_angularApp]);

          /**
           * 编译page触发controller的$scope等服务的实例化
           */
          angularInjector.call(this);

          /**
           * 重新编译主体部分使其加入到angular的管理中
           * 只有控制UI的angular指令才加入ct前缀，现在有ng-repeat,ng-if
           * 表达式需要转译成[[]]
           */
          var innerHTML = _self.getPageDOM().innerHTML;
          var cloneDom = w.document.createElement("div");
          cloneDom.innerHTML = innerHTML;
          forEach(cloneDom.querySelectorAll("*"), function () {

            /**
             * 寻找属性
             */
            for (var i = 0, len = this.attributes.length; i < len; i++) {
              /**
               * 寻找带有"ct-ng-" | "ct-directive-"开头的属性,将其替换
               */
              if (this.attributes[i].nodeName.indexOf("ct-ng-") == 0) {
                this.setAttribute(this.attributes[i].nodeName.substring(3), this.attributes[i].value);
                this.removeAttribute(this.attributes[i].nodeName);
              } else if (this.attributes[i].nodeName.indexOf("ct-directive-") == 0) {
                this.setAttribute(this.attributes[i].nodeName.substring("ct-directive-".length), this.attributes[i].value);
                this.removeAttribute(this.attributes[i].nodeName);
              }

              /**`
               * 寻找属性中带有[[]]的属性(angular表达式的替换)
               */
              if (new RegExp(/\[\[.+\]\]/g).exec(this.attributes[i].value)) {
                this.attributes[i].value = this.attributes[i].value.replace(/\[\[/g, "{{");
                this.attributes[i].value = this.attributes[i].value.replace(/\]\]/g, "}}");
              }
            }

            /**
             * 如果当前节点是纯文本节点且有angular表达式则替换
             */
            if (this.children.length === 0 && this.childNodes.length === 1 && this.childNodes[0].nodeType === 3) {
              var innerText = this.innerText;
              if (innerText) {
                innerText = innerText.replace(/\[\[/g, "{{");
                innerText = innerText.replace(/\]\]/g, "}}");
                this.innerText = innerText;
              }
            }
          });
          innerHTML = cloneDom.innerHTML;
          _self.getPageDOM().innerHTML = "";
          angularInjectorBody.call(this, innerHTML);
        }

        /**
         * 触发pageCreate事件
         */
        fireEvent(_self.getPageDOM(), "pageCreate");
      }

      /**
       * 布局
       */
      function layout() {
//                /**
//                 * 设置page的高
//                 */
        //this.getPageDOM().style.height = root.getClientHeight() + "px";
        //this.getPageDOM().height(root.getClientHeight());
        /**
         * 复位
         */
        slideByTransition.call(this, this.transition, "reset", 0);
      }

      /**
       * 注册Page的事件
       */
      function addEventListeners() {
        var _self = this;

        /**
         * 注册Page的缺省事件
         */
        _self.getPageJO().on({
          "pageCreate": _self.pageCreate.bind(_self),
          "pageBeforeShow": _self.pageBeforeShow.bind(_self),
          "pageShow": _self.pageShow.bind(_self),
          "pageAfterShow": _self.pageAfterShow.bind(_self),
          "pageBeforePause": _self.pageBeforePause.bind(_self),
          "pageAfterPause": _self.pageAfterPause.bind(_self),
          "pageBeforeRestore": _self.pageBeforeRestore.bind(_self),
          "pageRestore": _self.pageRestore.bind(_self),
          "pageAfterRestore": _self.pageAfterRestore.bind(_self),
          "pageBeforeDestroy": _self.pageBeforeDestroy.bind(_self),
          "pageResult": _self.pageResult.bind(_self),
          "pageAngularInjectorBefore": _self.pageAngularInjectorBefore.bind(_self),
          "pageReceiver": _self.pageReceiver.bind(_self)
        });

        /**
         *
         * @param e
         */
        function onTransitionAndAnimationEnd(e) {
          console.assert(_debugger, "------------------------------onTransitionAndAnimationEnd");
          /**
           * 如果当前页面的transition为material则肯定不会执行webkitTransitionEnd事件
           */
          if (e.type === "webkitTransitionEnd" && e.target.getAttribute("ct-data-role") !== "page") {
            return;
          }

          if (_self.pageTransitionType) {
            if (_self.pageTransitionType === "start") {
              delete _self.pageTransitionType;
              pageStartTransitionEndCallback.call(_self, e);
            } else if (_self.pageTransitionType === "finish") {
              delete _self.pageTransitionType;
              pageFinishTransitioneEndCallback.call(_self, e);
            }
          }
        }

        /**
         * 注册Page的transitionEnd和animationEnd事件
         */
        _self.getPageDOM().addEventListener("webkitTransitionEnd", onTransitionAndAnimationEnd, false);
        _self.getPageDOM().addEventListener("webkitAnimationEnd", onTransitionAndAnimationEnd, false);
      }

      /**
       * 平移 core
       * @param x x的平移值
       * @param y y的平移值
       * @param duration 平移经过的时间
       * @param beforeCallback 平移之前的回调函数
       */
      function slide(x, y, duration, beforeCallback) {
        var _self = this;
        if (beforeCallback) {
          beforeCallback();
        }

        /**
         * 滑动内部实现
         */
        function slideSub() {
          w.requestAnimationFrame(function () {
            _self.getPageJO().css({
              "transform": "translate3d(" + x + "," + y + ",0)",
              "-webkit-transform": "translate3d(" + x + "," + y + ",0)",
              "transition": "transform " + duration + "ms cubic-bezier(0.1,0.25,0.1,1)",
              "-webkit-transition": "transform " + duration + "ms cubic-bezier(0.1,0.25,0.1,1)"
            });
          });
        }

        if (duration == 0) {
          slideSub();
        } else {
          w.requestAnimationFrame(slideSub);
          //setTimeout(slideSub,100);
        }
      }

      /**
       * 根据transition进行平移
       * @param transition 类型
       * @param type 重置还是显示
       * @param duration 动画持续的时间
       * @param beforeCallback 回调函数
       */
      function slideByTransition(transition, type, duration, beforeCallback) {
        var _self = this, x = 0, y = 0;

        /**
         * 重置
         */
        function reset() {
          /**
           * 从右到左
           */
          if (new RegExp(/.+left/g).exec(transition)) {
            x = "100%";
          }
          /**
           * 从左到右
           */
          else if (new RegExp(/.+right/g).exec(transition)) {
            x = "-100%";
          }
          /**
           * 从下到上
           */
          else if (new RegExp(/.+up/g).exec(transition)) {
            y = "100%";
          }
          /**
           * 从上到下
           */
          else if (new RegExp(/.+down/g).exec(transition)) {
            y = "-100%";
          }

          /**
           * 如果过渡类型是微信类型且过渡时间为零则重置之前的面板位置
           */
          if (transition.indexOf("wx") === 0 && duration !== 0) {
            delete root.getPageByIndex(_history.length - 2).pageTransitionType;
            slide.call(root.getPageByIndex(_history.length - 2), 0, 0, duration / 2);
          }
          /**
           * 如果过渡类型是push且过渡时间为零则重置之前的面板位置
           */
          else if (transition.indexOf("push") === 0 && duration !== 0) {
            delete root.getPageByIndex(_history.length - 2).pageTransitionType;
            slide.call(root.getPageByIndex(_history.length - 2), 0, 0, duration);
          }

          /**
           * 当前页firstExecute
           */
          if (transition.indexOf("material") === 0) {
            if (duration !== 0) {
              if (beforeCallback) {
                beforeCallback();
              }
              this.getPageDOM().classList.add("materialHide");
            }
          } else {
            slide.call(this, x, y, duration, beforeCallback);
          }
        }

        /**
         * 显示
         */
        function show() {
          /**
           * 如果过渡类型是微信类型
           */
          if (transition.indexOf("wx") === 0 && duration !== 0) {
            delete root.getLastPage().pageTransitionType;
            if (new RegExp(/.+left/g).exec(transition)) {
//                            slide.call(root.getLastPage(), -parseFloat(w.getComputedStyle(root.getLastPage().getPageDOM(), null).getPropertyValue("width"))/5, y, duration/2);
              slide.call(root.getLastPage(), "-20%", y, duration / 2);
            } else if (new RegExp(/.+right/g).exec(transition)) {
//                            slide.call(root.getLastPage(), parseFloat(w.getComputedStyle(root.getLastPage().getPageDOM(),null).getPropertyValue("width"))/5, y, duration/2);
              slide.call(root.getLastPage(), "20%", y, duration / 2);
            } else if (new RegExp(/.+up/g).exec(transition)) {
//                            slide.call(root.getLastPage(), x, -parseFloat(w.getComputedStyle(root.getLastPage().getPageDOM(),null).getPropertyValue("height"))/5, duration/2);
              slide.call(root.getLastPage(), x, "-20%", duration / 2);
            } else if (new RegExp(/.+down/g).exec(transition)) {
//                            slide.call(root.getLastPage(), x, parseFloat(w.getComputedStyle(root.getLastPage().getPageDOM(),null).getPropertyValue("height"))/5, duration/2);
              slide.call(root.getLastPage(), x, "20%", duration / 2);
            }
          }
          /**
           * 如果过度类型是push
           */
          else if (transition.indexOf("push") === 0 && duration !== 0) {
            delete root.getLastPage().pageTransitionType;
            if (new RegExp(/.+left/g).exec(transition)) {
//                            slide.call(root.getLastPage(), -parseFloat(w.getComputedStyle(root.getLastPage().getPageDOM(),null).getPropertyValue("width")), y, duration);
              slide.call(root.getLastPage(), "-100%", y, duration);
            } else if (new RegExp(/.+right/g).exec(transition)) {
//                            slide.call(root.getLastPage(), parseFloat(w.getComputedStyle(root.getLastPage().getPageDOM(),null).getPropertyValue("width")), y, duration);
              slide.call(root.getLastPage(), "100%", y, duration);
            } else if (new RegExp(/.+up/g).exec(transition)) {
//                            slide.call(root.getLastPage(), x, -parseFloat(w.getComputedStyle(root.getLastPage().getPageDOM(),null).getPropertyValue("height")), duration);
              slide.call(root.getLastPage(), x, "-100%", duration);
            } else if (new RegExp(/.+down/g).exec(transition)) {
//                            slide.call(root.getLastPage(), x, parseFloat(w.getComputedStyle(root.getLastPage().getPageDOM(),null).getPropertyValue("height")), duration);
              slide.call(root.getLastPage(), x, "100%", duration);
            }
          }

          /**
           * 当前页firstExecute
           */
          if (transition.indexOf("material") === 0) {
            if (duration !== 0) {
              if (beforeCallback) {
                beforeCallback();
              }
              _self.getPageDOM().classList.add("materialShow");
            }
          } else {
            slide.call(this, x, y, duration, beforeCallback);
          }
        }

        /**
         * 重置
         */
        if (type === "reset") {
          reset.call(_self);
        }
        /**
         * 显示
         */
        else {
          show.call(_self);
        }
      }

      /**
       * 调用finish方法后的transitionEnd
       */
      function pageFinishTransitioneEndCallback(e) {
        var _self = this;

        /**
         * 如果当前页面的transition为material则肯定不会执行webkitTransitionEnd事件
         */
        if ((e.type === "webkitTransitionEnd" && e.target.getAttribute("ct-data-role") !== "page") ||
          (e.type === "webkitAnimationEnd" && e.target.getAttribute("ct-data-role") !== "page")) {
          return;
        }

        e.stopPropagation();
        e.preventDefault();

        /**
         */
        _self.getPageDOM().classList.remove("materialHide");

        /**
         * 当前页隐藏
         */
        _self.getPageDOM().classList.remove("active");
        _maskDOM.style.display = "none";
        _changeKey = false;

        /**
         * 删除DOM
         */
        var ctDataMode = getTemplateConfig(_self.getPageId(), "ct-data-mode");//_self.getPageDOM().getAttribute("ct-data-mode");
        //if("singleInstance" !== ctDataMode && "singleInstanceResult" !== ctDataMode) {
        if (ctDataMode.toLowerCase().indexOf("singleinstance") === -1) {
          _self.getPageDOM().parentNode.removeChild(_self.getPageDOM());
        }

        if (_history.length > 1) {

          var lastPrePageIndex = _history.length - 2;

          /**
           * 当前页之前页恢复之后事件
           */
          fireEvent(root.getPageByIndex(lastPrePageIndex).getPageDOM(), "pageAfterRestore");

          /**
           * 如果当前页是带有返回值的页
           */
          var ctDataMode = getTemplateConfig(_self.getPageId(), "ct-data-mode");
          if ((ctDataMode.toLowerCase().lastIndexOf("result") !== -1) && _self.resultIntent && _self.resultIntent.resultCode) {
            fireEvent(root.getPageByIndex(lastPrePageIndex).getPageDOM(), "pageResult", [_self.resultIntent.resultCode, _self.resultIntent.bundle]);
          }
        }

        /**
         * 出stack
         */
        _history.pop();

        if (_self.pageTransitionEndCallback) {
          _self.pageTransitionEndCallback();
        }
      }

      /**
       * 调用start方法后的transitionEnd
       */
      function pageStartTransitionEndCallback(e) {
        var _self = this;
        /**
         * 如果当前页面的transition为material则肯定不会执行webkitTransitionEnd事件
         */
        if ((e.type === "webkitTransitionEnd" && e.target.getAttribute("ct-data-role") !== "page") ||
          (e.type === "webkitAnimationEnd" && e.target.getAttribute("ct-data-role") !== "page")) {
          return;
        }

        e.stopPropagation();
        e.preventDefault();

        /**
         * 当前页移除materialShow
         */
        _self.getPageDOM().classList.remove("materialShow");
        /**
         * 最后一页隐藏
         */
        root.getLastPage().getPageDOM().classList.remove("active");

        _maskDOM.style.display = "none";
        _changeKey = false;

        /**
         * 当前页入历史
         */
        _history.push(_self);

        /**
         * 当前页显示之后事件
         */
        fireEvent(_self.getPageDOM(), "pageAfterShow");

        /**
         * 当前页之前的页面暂停之后
         */
        if (_history.length >= 2) {
          fireEvent(root.getPageByIndex(_history.length - 2).getPageDOM(), "pageAfterPause");
        }

        if (_self.pageTransitionEndCallback) {
          _self.pageTransitionEndCallback();
        }
      }

      /**
       * angular重新编译当前page
       */
      function angularInjector() {
        var _self = this;
        var $pageJO = _self.getPageJO();
        var element = _angularConfig.angular.element($pageJO);
        var injector = element.injector();
        var scope = element.scope();
        injector.invoke(["$compile", function ($compile) {
          $compile($pageJO)(scope);
          scope.$digest();
        }]);
      }

      /**
       * angular重新编译当前page的body部分
       * @params HTML 编译的内容
       */
      function angularInjectorBody(HTML) {
        var _self = this;
        var $pageJO = _self.getPageJO();
        var element = _angularConfig.angular.element($pageJO);
        var injector = element.injector();
        var scope = element.scope();
        injector.invoke(["$compile", function ($compile) {
          $pageJO.append($compile(HTML)(scope));
        }]);
      }

      /**
       * 是否启用了angular(页面中注册了controller)
       */
      function isEnableAngular() {
        var index = this.getPageDOM().outerHTML.indexOf("ct-ng-controller");
        if (index == -1) {
          return false
        } else {
          return true;
        }
      }

      /**
       * constructor
       * @param id 实际的id
       */
      function page(id) {
        // $.extend(this, {
        //     id: id,
        //     pageId: id.substring(0, id.lastIndexOf("_")),
        //     transition: _transition
        //     /**
        //      * Page的transition类型[start|finish]
        //      */
        //     //pageTransitionType;
        //     /**
        //      * Page的transitionEnd后的回调函数
        //      */
        //     //pageTransitionEndCallback
        // });
        Object.assign(this, {
          id: id,
          pageId: id.substring(0, id.lastIndexOf("_")),
          transition: _transition
          /**
           * Page的transition类型[start|finish]
           */
          //pageTransitionType;
          /**
           * Page的transitionEnd后的回调函数
           */
          //pageTransitionEndCallback
        });
        createPageDOM.call(this);
        layout.call(this);
        return this;
      }

      /**
       * public method
       * @type {{}}
       */
      page.prototype = {
        /**
         * DOM创建之后
         */
        pageCreate: function (e) {
          console.assert(_debugger, "pageCreateParentByParent");
        },
        /**
         * 页面显示之前
         */
        pageBeforeShow: function (e) {
          console.assert(_debugger, "pageBeforeShowByParent");
        },
        /**
         * 页面显示
         */
        pageShow: function (e) {
          console.assert(_debugger, "pageShowByParent");
        },
        /**
         *  页面显示之后
         */
        pageAfterShow: function (e) {
          console.assert(_debugger, "pageAfterShowByParent");
        },
        /**
         * 页面暂停之前
         */
        pageBeforePause: function (e) {
          console.assert(_debugger, "pageBeforePauseByParent");
        },
        /**
         * 页面暂停之后
         */
        pageAfterPause: function (e) {
          console.assert(_debugger, "pageAfterPauseByParent");
        },
        /**
         * 页面恢复之前
         */
        pageBeforeRestore: function (e) {
          console.assert(_debugger, "pageBeforeRestoreByParent");
        },
        /**
         * 页面恢复
         */
        pageRestore: function (e) {
          console.assert(_debugger, "pageRestoreByParent");
        },
        /**
         * 页面恢复之后
         */
        pageAfterRestore: function (e) {
          console.assert(_debugger, "pageAfterRestoreByParent");
        },
        /**
         * 页面DOM销毁之前
         */
        pageBeforeDestroy: function (e) {
          console.assert(_debugger, "pageBeforeDestroyByParent");
        },
        /**
         * pageResult
         * @param e jQuery的event
         * @param resultCode string 返回的code
         * @param bundle Object 返回的参数
         */
        pageResult: function (e, resultCode, bundle) {
          console.assert(_debugger, "pageResult");
        },
        /**
         * angularConfig中配置了对angular的支持后，当前页面渲染完成之后用angular编译page之前触发
         * @param e jQuery的event
         * @param angularApp 调用angular.module之后的返回值
         */
        pageAngularInjectorBefore: function (e, angularApp) {
          console.assert(_debugger, "pageAngularInjectorBefore");
        },
        /**
         * 如果添加了ct-data-intentfilter-action属性，满足条件后触发
         */
        pageReceiver: function (bundle, functions) {
          console.assert(_debugger, "pageReceiver");
        },

        /**
         * 显示
         * @param duration 完成显示的时间
         * @param callback 结束时的回调函数
         */
        start: function (duration, callback) {
          var _self = this;

          /**
           * 如果操作锁定则不进行
           */
          if (_changeKey) return;

          /**
           * 操作加锁
           * @type {boolean}
           */
          _changeKey = true;

          /**
           * 修改transitionEnd的类型
           * @type {string}
           */
          _self.pageTransitionType = "start";

          /**
           * 修改transitionEnd的回调函数
           */
          _self.pageTransitionEndCallback = callback;

          /**
           * 最后一页暂停之前事件
           */
          if (_history.length !== 0) {
            fireEvent(root.getLastPage().getPageDOM(), "pageBeforePause");
          }

          /**
           * 当前页显示前事件
           */
          fireEvent(_self.getPageDOM(), "pageBeforeShow");

          if (duration !== 0) {
            _maskDOM.style.display = "block";
          }


          /**
           * 当前页面显示
           */
          _self.getPageDOM().classList.add("active");
          _self.getPageDOM().style.zIndex = ++_zIndex;
          /**
           * 当前页显示事件
           */
          fireEvent(_self.getPageDOM(), "pageShow");

          /**
           * 当前页移动
           */
          slideByTransition.call(_self, _self.transition, "show", duration === 0 ? 0 : _SLIDEDURATION);

          /**
           * 只有一个页的时候
           */
          if (duration === 0) {
            _history.push(_self);
            _changeKey = false;
            fireEvent(_self.getPageDOM(), "pageAfterShow");
            if (callback) {
              callback();
            }
          }
        },
        /**
         * 销毁
         * @params duration 完成显示的时间
         * @param callback 结束时的回调函数
         * @param option 调用startPage的option
         */
        finish: function (duration, callback, option) {
          var _self = this;

          /**
           * 如果操作锁定则不进行
           */
          if (_changeKey) return;

          /**
           * 操作加锁
           * @type {boolean}
           */
          _changeKey = true;

          /**
           * 修改transitionEnd的类型
           * @type {string}
           */
          _self.pageTransitionType = "finish";

          /**
           * 层级减
           */
          _zIndex--;

          /**
           * 修改transitionEnd的回调函数
           */
          _self.pageTransitionEndCallback = callback;

          /**
           * 当前页销毁之前事件
           */
          var ctDataMode = getTemplateConfig(_self.getPageId(), "ct-data-mode");//_self.getPageDOM().getAttribute("ct-data-mode");
          //if("singleInstance" !== _self.getPageDOM().getAttribute("ct-data-mode") && "singleInstanceResult" !== _self.getPageDOM().getAttribute("ct-data-mode")) {
          if (ctDataMode.toLowerCase().indexOf("singleinstance") === -1) {
            fireEvent(_self.getPageDOM(), "pageBeforeDestroy");
          } else {
            // 页面暂停之前
            fireEvent(_self.getPageDOM(), "pageAfterPause");
          }

          // _history中最后一个元素之前的索引
          var lastPrePageIndex = _history.length - 2;

          // (多于一个元素)且(改变浏览器历史)
          if (_history.length > 1 && (!option || !option.reload)) {
            /**
             * 最后一个页之前的页触发恢复之前事件
             */
            fireEvent(root.getPageByIndex(lastPrePageIndex).getPageDOM(), "pageBeforeRestore");
          }

          if (duration !== 0) {
            _maskDOM.style.display = "block";
          }

          // (多于一个元素)且(改变浏览器历史)
          if (_history.length > 1 && (!option || !option.reload)) {
            /**
             * 恢复最后一个页之前的页
             */
            root.getPageByIndex(lastPrePageIndex).getPageDOM().classList.add("active");
            /**
             * 最后一个页之前的页恢复事件
             */
            fireEvent(root.getPageByIndex(lastPrePageIndex).getPageDOM(), "pageRestore");
          }

          /**
           * 重置当前页
           */
          slideByTransition.call(this, this.transition, "reset", duration === 0 ? 0 : _SLIDEDURATION);

          /**
           * 只有一个页的时候
           */
          if (duration === 0) {
            _self.getPageDOM().classList.remove("active");
            _changeKey = false;


            /**
             * 删除DOM
             */
            var ctDataMode = getTemplateConfig(_self.getPageId(), "ct-data-mode");//_self.getPageDOM().getAttribute("ct-data-mode");
            //if("singleInstance" !== ctDataMode && "singleInstanceResult" !== ctDataMode) {
            if (ctDataMode.toLowerCase().indexOf("singleinstance") === -1) {
              _self.getPageDOM().parentNode.removeChild(_self.getPageDOM());
            }

            // (多于一个元素)且(改变浏览器历史)
            if (_history.length > 1 && (!option || !option.reload)) {
              fireEvent(root.getPageByIndex(lastPrePageIndex).getPageDOM(), "pageAfterRestore");
              var ctDataMode = getTemplateConfig(_self.getPageId(), "ct-data-mode");
              if ((ctDataMode.toLowerCase().lastIndexOf("result") !== -1) && _self.resultIntent && _self.resultIntent.resultCode) {
                fireEvent(root.getPageByIndex(lastPrePageIndex).getPageDOM(), "pageResult", [_self.resultIntent.resultCode, _self.resultIntent.bundle]);
              }
            }

            // (多于一个元素)且(不改变浏览器历史)
            if (_history.length > 1 && option && option.reload) {
              _history.splice(lastPrePageIndex, 1);
            } else {
              // 出stack
              _history.pop();
            }

            if (callback) {
              callback();
            }
          }
        },
        /**
         * 获取page的DOM对象
         * @returns {*}
         */
        getPageDOM: function () {
          return this._pDom;
        },
        /**
         * 获取当前页面的jQuery对象
         * @returns {*|jQuery|HTMLElement}
         */
        getPageJO: function () {
          if (!this._pJO) {
            this._pJO = $(this.getPageDOM());
          }
          return this._pJO;
        },
        /**
         * 获取page的实际id
         * @returns {*}
         */
        getId: function () {
          return this.id;
        },
        /**
         * 获取克隆的pageId
         * @returns {*}
         */
        getPageId: function () {
          return this.pageId;
        },

        /**
         * 设置请求参数
         * @param requestCode String
         * @param bundle Object
         * 页面之前传递参数的另一种形式(类似于android的intent)
         */
        setRequest: function (requestCode, bundle) {
          if ("mulitview" === _mode) {
            w.mulitview.setRequest(function () {
            }, function () {
            }, requestCode, bundle);
          } else {
            this.requestIntent = {
              requestCode: requestCode || "",
              bundle: bundle || {}
            }
          }
        },
        /**
         * 获取父页面的请求参数
         * 只有在页面的pageAfterShow中才可以调用此方法获取上一页面调用setRequest传递的参数
         * @return {
         *   requestCode:String
         *   bundle:Object
         * }
         */
        getRequest: function (callback) {
          if ("mulitview" === _mode) {
            w.mulitview.getRequest(function (requestIntent) {
              if (callback) {
                callback(requestIntent);
              }
            }, function () {
            });
          } else {
            return root.getRequest(this);
          }
        },
        /**
         * 设置返回值
         * @param resultCode String
         * @param bundle Object
         * 设置返回父页面的数据
         */
        setResult: function (resultCode, bundle) {
          if ("mulitview" === _mode) {
            w.mulitview.setResult(function () {
            }, function () {
            }, resultCode, bundle);
          } else {
            this.resultIntent = {
              resultCode: resultCode || "",
              bundle: bundle || {}
            }
          }
        },
        /**
         * 获取resultIntent
         * @param callback
         */
        getResult: function (callback) {
          if ("mulitview" === _mode) {
            w.mulitview.getResult(function (resultIntent) {
              if (callback) {
                callback(resultIntent);
              }
            }, function () {
            });
          } else {
            return this.resultIntent;
          }
        },

        /**
         * 当前页面ct-data-mode设置为result或singleInstanceResult时,向父页面返回参数时调用over
         * 只有设置了setRequest后在调用over父页面才能触发pageResult事件
         */
        over: function () {
          if ("mulitview" === _mode) {
            w.mulitview.over(function () {
            }, function () {
            });
          } else {
            go(-1);
          }
        }
      }

      /**
       * required
       * @type {page}
       */
      page.prototype.constructor = page;

      return page;
    })();

    /**----------------------------------- Router类定义 --------------------------------**/
      // TODO:Router类定义
    var _router = (function () {

        var _paths = paths;

        /**
         * 初始化
         */
        function initial() {

          /**
           * 注册hashchange事件
           */
          w.addEventListener("hashchange", onHashchange, false);

          /**
           * 注册页面转场事件
           */
          $(w.document).on("pageBeforeChange", function (e, params) {
            console.dirxml(params);
            router._parameter = params;
          });
        }

        /**
         * hashchange的回调函数
         */
        function onHashchange() {
          debugger
          // #page1_134567890232323?id=123_456
          var hash = w.location.hash;
          hashChange(hash);
        }

        /**
         * hashChange的处理
         * @param hash 哈希值
         * @param option {
         *  reload :[true | false]
         * }
         */
        function hashChange(hash, option) {
          /**
           * 转场的id(没有重复)
           * @type {string}
           */
          var id = "";

          if (hash) {
            id = hash.indexOf("?") !== -1
              ? hash.substring(1, hash.indexOf("?"))
              : hash.substring(1)

            var index = id.lastIndexOf("_");
            /**
             * 用户自定义的锚点跳转
             */
            if (index === -1) {
              return false;
            } else {
              var pageId = id.substring(0, index);
              /**
               * 用户自定义的锚点跳转
               */
              if (!w.document.querySelector("[ct-data-role='page'],#" + pageId)) {
                return false;
              }
              //if($("[ct-data-role='page'],#"+pageId).size() === 0) {
              //    return false;
              //}
              fireEvent(w.document, "pageBeforeChange", [root.getUrlParam(hash)]);
            }
          }
          /**
           * 首页
           */
          else {
            fireEvent(w.document, "pageBeforeChange", [root.getUrlParam(hash)]);
            if (/*如果栈顶元素的pageId == 模板中第一页的id*/root.getFirstPage().getPageId() == root.getFirstPageId()) {
              // 说明是从模板的第一页进入主应用的
              id = root.getFirstPage().getId();
            }
            else {
              // 不是从模板的第一页进入主应用的
              createPage(root.getId(root.getFirstPageId())).done(function (_page) {
                _page.start(_SLIDEDURATION, function () {
                  _history.shift();
                });
              });
              return;
            }
          }

          //hash ? (hash.indexOf("?") != -1
          //    ? id = hash.substring(1, hash.indexOf("?"))
          //    : id = hash.substring(1))
          //    : id = root.getFirstPage().getId();

          /**
           * 新的页面
           */
          var curPage = root.getPageById(id);
          if (!curPage) {
            createPage(id).done(function (_page) {
              _page.start(_SLIDEDURATION, function () {
                // 如果不改变浏览器历史且历史栈长度大于1
                if (option && option.reload && _history.length > 1) {
                  var preHistoryIndex = _history.length - 2;
                  var preHistoryPage = root.getPageByIndex(preHistoryIndex);
                  if (preHistoryPage) {
                    preHistoryPage.finish(0, null, option);
                  }
                  //_history.splice(preHistoryIndex,1);
                }
              });
            });
          }
          /**
           * 回退
           */
          else {
            //  如果刷新的是栈顶的页面
            if (id == root.getLastPage().getId()) {
              return;
            } else {
              // 依次出栈
              var index = root.indexOfById(id);
              for (var i = _history.length - 1; i > index; i--) {
                if (i === index + 1) {
                  root.getPageByIndex(i).finish(_SLIDEDURATION);
                } else {
                  root.getPageByIndex(i).finish(0);
                }
              }
            }
          }
        }

        var router = {
          /**
           * 页面跳转
           * @param pageId (pageId = pageId + params) 如: page1?a=1&b=2;
           * @param option {
           *     reload : [true | false]
           * }
           */
          startPage: function (href, option) {
            var pageId = "", paramsQuery = "";

            // Ajax加载
            if (href.indexOf("#") !== 0) {
              var params = root.getUrlParam(href);
              pageId = params.pageId;

              delete params.pageId;
              var paramsQueryArr = [];
              for (var p in params) {
                if (params.hasOwnProperty(p)) {
                  paramsQueryArr.push(p + "=" + params[p]);
                }
              }
              paramsQuery = paramsQueryArr.join("&") ? ("?" + paramsQueryArr.join("&")) : "";

              // _templateDB中没有pageId的模板,则需要Ajax进行加载模板操作
              if (!(pageId in _templateDB)) {
                $.ajax({
                  dataType: "text",
                  url: href,
                  success: function (templateText) {
                    _templateDB[pageId] = getPageTemplateStrByAjaxStr(templateText);

                    // TODO:NATIVE------调用插件添加模板
                    if (_mode === "mulitview") {
                      var temp = {};
                      temp[pageId] = templateText;
                      w.mulitview.addTemplateDB(function () {
                        dispatcher();
                      }, function () {
                      }, temp);
                    } else {
                      dispatcher();
                    }
                  },
                  error: function (error, status, thrown) {

                  }
                });
              } else {
                dispatcher();
              }
            }
            // 本地锚点加载
            else {
              href = href.substring(1);
              if (href.indexOf("?") !== -1) {
                paramsQuery = href.substring(href.indexOf("?"));
                pageId = href.substring(0, href.indexOf("?"));
              } else {
                pageId = href;
              }
              dispatcher();
            }

            /**
             * 分派
             */
            function dispatcher() {
              // TODO:NATIVE------调用插件调转页面
              if (_mode === "mulitview") {
                w.mulitview.startPage(function () {
                }, function () {
                }, pageId, root.getUrlParam(href));
              } else {
                /**
                 * 获取page的模式
                 */
                var mode = getTemplateConfig(pageId, "ct-data-mode");
                var hash;
                //if(/*单例*/mode === "single" || /*完全单例*/mode === "singleInstance" || /*带返回值的完全单例*/mode === "singleInstanceResult") {
                if (mode.toLowerCase().indexOf("single") !== -1) {
                  var index = indexOfHistoryByPageId(pageId);
                  if (/*_history中没有以pageId开头的page*/index === -1) {
                    //1.用pageId生成真实的id转换锚点
                    //if("singleInstance" === mode || "singleInstanceResult" === mode) {
                    if (mode/*.toLowerCase()*/.indexOf("singleInstance") !== -1) {
                      if (root.getSingleInstance(pageId)) {
                        hash = root.getSingleInstance(pageId).getId();
                      } else {
                        hash = root.getId(pageId + paramsQuery);
                      }
                    } else {
                      hash = root.getId(pageId + paramsQuery);
                    }

                    if (option && option.reload) {
                      w.history.replaceState(null, "", "#" + hash);
                      hashChange("#" + hash, option);
                    } else {
                      w.location.hash = "#" + hash;
                    }
                  } else {
                    if (/*如果page不是栈顶,依次出栈,调用finish*/root.getPageByIndex(index) != root.getLastPage()) {
                      // 假如现在_history中的顺序是1,2,3,4,5,6，3是单例，现在要跳转到3,那么6,5,4所代表的page依次调用finish方法
                      // history.go(找到3相对于当前页的阈值)
                      go(-(_history.length - 1 - index));
                    } else {
                      // history.go(0);
                      //go(0);
                      fireEvent(root.getLastPage().getPageDOM(), "pageShow");
                    }
                  }
                } else if (/*多例*/mode === "standard" || mode === "result") {
                  //1.用pageId生成真实的id转换锚点
                  hash = root.getId(pageId + paramsQuery);
                  if (option && option.reload) {
                    w.history.replaceState(null, "", "#" + hash);
                    hashChange("#" + hash, option);
                  } else {
                    w.location.hash = "#" + hash;
                  }
                }
              }// end else
            }
          },
          /**
           * 跳转到指定的历史
           * @param index 历史位置
           * 注释：当前的位置为0 index负值为回退，index正数为前进 都以1开始
           * 例如 -1 为当前页之前的页面,1为当前页之后的页面，0为刷新当前页面
           */
          go: function (index) {
            w.history.go(index);
          },
          /**
           * 返回
           */
          back: function () {
            router.go(-1);
          },
          /**
           * 获取转场的参数
           */
          getParameter: function () {
            return $.extend({}, router._parameter);
          },
          /**
           * 根据id获取Page资源的加载路径
           * @param id
           */
          getResPath: function (id) {
            return _paths[id];
          },
          /**
           * 异步的加载Page所需的js和css
           * @param _paths
           */
          loadAsyncScriptAndCss: function (_paths) {
            var dtd = $.Deferred();
            var scriptPaths = [];
            var cssPaths = [];
            for (var i = 0, len = _paths.length; i < len; i++) {
              var path = _paths[i].replace(/^\s|\s$/g, "");
              var att = path.split('.');
              var isCSS = att[att.length - 1].toLowerCase() == "css";
              var isScript = att[att.length - 1].toLowerCase() == "js";
              if (isCSS) {
                cssPaths.push({
                  url: path
                });
              } else if (isScript) {
                scriptPaths.push({
                  url: path
                });
              }
            }

            $.when.apply(this, [
              router.syncLoadScript(scriptPaths),
              router.syncLoadCss(cssPaths)
            ]).done(function () {
              dtd.resolve();
            }).fail(function () {
              dtd.reject();
            });

            return dtd.promise();
          },
          /**
           * 同步加载一组js
           *
           * 存放各个文件的加载路径，及其加载完后的回调函数
           * @param group
           * {
                 *    url:string
                 *    callback:function(){}
                 * }
           * 文件都加载完后的回调函数
           * @param complete function(){}
           */
          syncLoadScript: function (group) {

            var dtd = $.Deferred();

            $.ajaxSetup({
              cache: true
            });

            // 待加载的文件数
            var length = group.length;

            // 当前加载的索引
            var index = 0;

            syncLoad();

            /**
             * 同步加载一个js文件
             */
            function syncLoad() {
              /**
               * 全部加载完成
               */
              if (index >= length) {
                $.ajaxSetup({
                  cache: false
                });
                dtd.resolve();
              }
              /**
               * 同步加载指定文件
               */
              else {
                $.getScript(group[index].url, function () {
                  if (group[index].callback) {
                    group[index].callback();
                  }

                  index++;
                  syncLoad();
                });
              }
            }

            return dtd.promise();
          },
          /**
           * 同步加载一组css
           *
           * 存放各个文件的加载路径，及其加载完后的回调函数
           * @param group
           * {
                 *    url:string
                 *    callback:function(){}
                 * }
           * 文件都加载完后的回调函数
           * @param complete function(){}
           */
          syncLoadCss: function (group) {

            var dtd = $.Deferred();

            // 待加载的文件数
            var length = group.length;

            // 当前加载的索引
            var index = 0;

            syncLoad();

            /**
             * 同步加载一个css文件
             */
            function syncLoad() {
              /**
               * 全部加载完成
               */
              if (index >= length) {
                dtd.resolve();
              }
              /**
               * 同步加载指定文件
               */
              else {
                var headDom = document.getElementsByTagName("head")[0];
                var linkDom = document.createElement("link");
                linkDom.onload = function () {
                  if (group[index].callback) {
                    group[index].callback();
                  }

                  index++;
                  syncLoad();
                }
                linkDom.setAttribute("rel", "stylesheet");
                linkDom.setAttribute("type", "text/css");
                linkDom.setAttribute("href", group[index].url);
                headDom.appendChild(linkDom);
              }
            }

            return dtd.promise();
          }
          /*,
           /!**
           * 加载js文件
           * @param jspath
           *!/
           loadScript:function(jspath){
           var dtd = $.Deferred();
           $.ajaxSetup({
           cache: true
           });
           $.getScript(jspath, function () {
           $.ajaxSetup({
           cache: false
           });
           dtd.resolve();
           });
           return dtd.promise();
           }*/
        }

        initial();

        return router;

      })();

    /**----------------------------------- Borasdcast类定义 --------------------------------**/
      // TODO:Borasdcast类定义
    var _borasdcast = (function () {

        /**
         * Receiver Model 用来存储Receivers
         * {
             *   action:[string] 标识
             *   categorys:[array] 分类
             *   priority:[number] 优先级
             *   handler:[Function] 执行方法
             * }
         */
        var _receiverModel = [];

        /**
         * 找到符合intent的receiver的集合
         * @param intent
         */
        function getReceiverByIntent(intent) {
          var receiver = [];
          for (var i = 0, len = _receiverModel.length; i < len; i++) {
            if (_receiverModel[i].action == intent.action &&
              _receiverModel[i].categorys.length == intent.categorys.length) {

              var flag = true;
              for (var j = 0; j < intent.categorys.length; j++) {
                if (_receiverModel[i].categorys.indexOf(intent.categorys[j]) === -1) {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                receiver.push(_receiverModel[i]);
              }
            }// end if
          }
          return receiver;
        }

        var borasdcast = {
          /**
           * 执行Receiver通过Id
           * @param id
           * @param jsonStr
           */
          executeReceiverById: function (id, jsonStr) {
            for (var i = 0, len = _receiverModel.length; i < len; i++) {
              var receiver = _receiverModel[i];
              if (receiver.innerReceiverId === id) {
                if (receiver.handler) {
                  receiver.handler(jsonStr);
                }
              }
            }
          },
          /**
           * 注册Receiver对象
           * @params handler [Function] receiver执行的handler
           * @params intentFilter [Object]
           * {
                 *    action:[string] action
                 *    priority:[number] 优先级
                 *    categorys:[array] 分类
                 * }
           */
          registerReceiver: function (handler, intentFilter) {
            if (!handler || !intentFilter || !intentFilter.action) return;

            var receiver = {
              action: intentFilter.action,
              categorys: intentFilter.categorys || [],
              handler: handler,
              priority: intentFilter.priority || 0
            };

            _receiverModel.push(receiver);

            /**
             * 按照priority进行排序
             */
            _receiverModel.sort(function (o1, o2) {
              var priority1 = o1.priority || 0;
              var priority2 = o2.priority || 0;
              if (priority1 < priority2) {
                return 1;
              } else if (priority1 > priority2) {
                return -1;
              } else {
                return 0;
              }
            });

            // 如果是mulitview模式
            if (_mode === "mulitview") {
              w.mulitview.registerReceiver(function (innerReceiverId) {
                // 会返回一个BroadcastReceiver的对象id
                receiver.innerReceiverId = innerReceiverId;
              }, function () {
              }, {
                action: intentFilter.action,
                categorys: intentFilter.categorys || [],
                priority: intentFilter.priority || 0
              });
            }
          },
          /**
           * 解除注册Receiver对象
           * @params handler
           */
          unregisterReceiver: function (handler) {
            if (handler) {
              var flag = false;
              while (true) {
                for (var i = 0, len = _receiverModel.length; i < len; i++) {
                  if (_receiverModel[i].handler === handler) {
                    if (_mode === "mulitview") {
                      w.mulitview.unregisterReceiver(function () {
                      }, function () {
                      }, _receiverModel[i].innerReceiverId);
                    }
                    _receiverModel.splice(i, 1);
                    flag = true;
                    break;
                  }
                }
                if (!flag || _receiverModel.length === 0) break;
              }
            }
          },
          /**
           * 发送无序广播
           * @param intent
           * {
           *    action:[string] action
           *    categorys:[array] 分类
           *    bundle:Object 参数
           * }
           */
          sendBroadcast: function (intent) {
            if (intent) {
              if (_mode === "mulitview") {
                w.mulitview.sendBroadcast(function () {
                }, function () {
                }, intent);
              } else {
                var receivers = getReceiverByIntent(intent);
                receivers = [].concat(receivers);
                for (var i = 0, len = receivers.length; i < len; i++) {
                  if (receivers[i].handler) {
                    receivers[i].handler($.extend({}, intent));
                  }
                }
              }
            }
          },
          /**
           * 发送有序广播
           * @param intent
           * {
                 *    action:[string] action
                 *    categorys:[array] 分类
                 *    bundle:Object 参数
                 * }
           */
          sendOrderedBroadcast: function (intent) {
            if (_mode === "mulitview") {
              w.mulitview.sendOrderedBroadcast(function () {
              }, function () {
              }, intent);
            } else {
              var no = 0;
              var lock = false;
              var args = {
                action: intent.action,
                categorys: intent.categorys || [],
                bundles: []
              };

              if (intent) {
                var receivers = getReceiverByIntent(intent);
                receivers = [].concat(receivers);
                args.bundles.push(intent.bundle || {});
                transfer(receivers, args);
              }

              /**
               * 传递
               * @param receivers
               */
              function transfer(receivers) {
                if (receivers.length == 0) return;
                var receiver = receivers.shift();
                if (receiver) {
                  no++;
                  lock = true;
                  receiver.handler(args, {
                    /**
                     * 继续传递
                     */
                    next: function () {
                      lock = false;
                      if (args.bundles.length != no + 1) {
                        args.bundles.push({});
                      }
                      transfer(receivers);
                    },
                    /**
                     * 传递参数
                     * @param bundle
                     */
                    putExtras: function (bundle) {
                      if (lock) {
                        if (args.bundles.length === no + 1) {
                          args.bundles.pop();
                        }
                        args.bundles.push(bundle);
                      }
                    }
                  });
                }
              }
            }
          }
        }

        return borasdcast;
      })();


    // TODO:私有方法
    /**--------------------------------root private method-----------------------------*/
    /**
     * 通过ID创建Page对象
     * @param id
     */
    function createPage(id) {
      var dtd = $.Deferred();

      var pageId = id.substring(0, id.lastIndexOf("_"));
      var Class;
      /**
       * 如果支持amd或cmd则用_require获取Class
       */
      if (typeof define === 'function' && (define.amd || define.cmd)) {
        Class = _require(pageId);
      } else {
        Class = root.namespaceToObj(w, pageId);
      }

      // 可以进行实例化，一般都是inline模式
      if (Class) {
        dtd.resolve(newInstance(Class));
      }
      // Ajax模式，动态加载Page所需要的资源(js和css)
      else {
        var respath = root.router.getResPath(pageId);
        // 如果设置了Page所需的资源
        if (respath) {
          root.router.loadAsyncScriptAndCss(respath).done(function () {
            Class = root.namespaceToObj(w, pageId);
            dtd.resolve(newInstance(Class));
          });
        }
        // 没有设置就用缺省的Page进行实例化
        else {
          dtd.resolve(newInstance(Class));
        }
      }

      /**
       * 创建实例
       * @returns {*}
       */
      function newInstance(Class) {
        // 让模块或类继承自Page
        root.extend(Class, root.Page);

        var typeofName = (typeof Class).toLowerCase();

        var ctDataMode = getTemplateConfig(pageId, "ct-data-mode");

        var Constructor;

        /**
         * 如果Class可以实例化
         */
        if (typeofName === "function") {
          Constructor = Class;
        }
        /**
         * 如果Class不可以实例化则用缺省的Page进行实例化
         */
        else if (typeofName === "undefined") {
          Constructor = _page;
        }

        /**
         * 如果是singleInstance 或 singleInstanceResult
         */
        if (ctDataMode.toLowerCase().indexOf("singleinstance") !== -1) {
          if (!root.getSingleInstance(pageId)) {
            _singleInstances[pageId] = new Constructor(id);
          }
          return _singleInstances[pageId];
        } else {
          return new Constructor(id);
        }
      }

      return dtd.promise();
    }

    /**
     * 根据模板pageId获取模板的DOM对象
     * @param pageId
     */
    function getTemplateDOMById(pageId) {
      // TODO:(模板)change
      if (pageId.indexOf("?") !== -1) {
        pageId = pageId.substring(0, pageId.indexOf("?"));
      }
      return createElement(_templateDB[pageId]);
    }

    /**
     * 获取模板的属性
     * @param pageId
     * @param attr
     */
    function getTemplateConfig(pageId, attr) {
      var dom = getTemplateDOMById(pageId);
      var config = dom.getAttribute(attr);
      if ((attr === "ct-data-mode") && !config) {
        config = "standard";
      }
      return config;
    }

    /**
     * history中是否有pageId开头的page对象
     * @param pageId
     */
    function indexOfHistoryByPageId(pageId) {
      if (pageId.indexOf("?") !== -1) {
        pageId = pageId.substring(0, pageId.indexOf("?"));
      }

      var index = -1;
      for (var i = 0, len = _history.length; i < len; i++) {
        if (_history[i].getPageId() === pageId) {
          index = i;
          break;
        }
      }
      return index;
    }

    /**
     * 触发自定义的Html事件
     * @param dom 触发的HTML对象
     * @param htmlEvent 触发的事件
     */
    function fireEvent(dom, type, params) {
      $(dom).trigger(type, params || []);
    }

    /**
     * 页面载入完成的回调函数
     */
    function onReady() {
      /**
       * 判断页面是否已经ready
       */
      if (_hasInited) return;

      _hasInited = true;

      /**
       * window.document.body的jQuery
       */
      _bodyDOM = w.document.body;

      //            /**
      //             *  设置body的高
      //             */
      //            w.document.body.style.height = root.getClientHeight() + "px";

      /**
       * 创建page切换时的遮罩层
       */
      _maskDOM = createElement("<div class='ct-page-mask'><div opt='animation' class='la-ball-circus la-dark' style='color:#3e98f0;'><div></div><div></div><div></div><div></div><div></div></div></div>");
      _bodyDOM.appendChild(w.document.createDocumentFragment().appendChild(_maskDOM));

      ///**
      // * 注册hashchange事件
      // */
      //w.addEventListener("hashchange", onHashchange, false);

      console.time("总用时");
      /**
       * initialLocalTemplate都完成后初始化第一页 and LinkCapture
       */
      $.when(
        initialLocalTemplatePromise(),
        LinkCapturePromise()
      ).done(function () {
        console.timeEnd("总用时");
        fireEvent(w.document, "pageBeforeChange", [root.getUrlParam(w.location.hash)]);
        /**
         * 初始化第一页
         * TODO:初始化第一页
         */
        createPage(root.getFirstId()).done(function (_page) {
          _page.start(0);
        });
      });
    }

    /**
     * 预加载Ajax的页面
     * @constructor
     */
    function AjaxPreloadPromise(pageDOM) {
      var dtd = $.Deferred(),
        asyncTasks = [];
      console.time("预加载Ajax用时");

      /**
       * 查看是否有需要预加载的Ajax页面
       */
      forEach(pageDOM.querySelectorAll("a[ct-data-preload=true][href]"), function (aDom, index) {
        var ctDataAjax = aDom.getAttribute("ct-data-ajax"),
          //ctDataPreload = aDom.getAttribute("ct-data-preload"),
          href = aDom.getAttribute("href");

        if (/*href &&*/
        href.indexOf("#") === -1 &&
        ctDataAjax &&
        ctDataAjax === "false") return;

        //if (ctDataPreload && ctDataPreload === "true") {
        asyncTasks.push($.ajax({
          dataType: "text",
          url: href,
          success: function (templateText) {
            var params = root.getUrlParam(href);
            _templateDB[params.pageId] = getPageTemplateStrByAjaxStr(templateText);
          },
          error: function (error, status, thrown) {

          }
        }));
        //}
      });

      if (asyncTasks.length !== 0) {
        $.when.apply(this, asyncTasks).done(function () {
          console.timeEnd("预加载Ajax用时");
          dtd.resolve();
        }).fail(function () {
          dtd.reject();
        });
      } else {
        dtd.resolve();
      }

      return dtd.promise();
    }

    /**
     * 捕获a标签的事件
     * @constructor
     */
    function LinkCapturePromise() {
      var dtd = $.Deferred();

      console.time("捕获a标签用时:");

      /**
       * 初始化 link-capture events
       */
      w.document.addEventListener("click", function (e) {
        var target = e.target;
        if (!target) return;
        // 不是a元素
        if (target.tagName.toLocaleLowerCase() !== "a" && !(target = target.getParentElementByTag("a"))) {
          return;
        }

        var href = target.getAttribute("href"),
          ctDataAjax = target.getAttribute("ct-data-ajax");
        // 如果用户不想让框架控制a元素
        if (href &&
          href.indexOf("#") === -1 &&
          ctDataAjax &&
          ctDataAjax === "false") return;

        if (!href || href.length <= 1) {
          return;
        }

        root.startPage(href, {
          reload: target.getAttribute("ct-reload") === "true" ? true : linkCaptureReload
        });

        e.preventDefault();
        return false;
      });
      console.timeEnd("捕获a标签用时:");
      dtd.resolve();
      return dtd.promise();
    }

    /**
     * 初始化本地模板
     * 模板是框架的基础，一切都是基于模板生成的
     * 将<div ct-data-role="page"></div>的元素缓存到js对象中
     * {
     *   ct-data-role的值(id):outerHTML为值
     * }
     */
    function initialLocalTemplatePromise() {
      var dtd = $.Deferred();

      console.time("初始化本地模板用时:");

      // TODO:(模板)new
      /**
       * 遍历所有含有ct-data-role="page"的元素并且删除
       */
      var ajaxPreloadPromiseTasks = [];
      forEach(_bodyDOM.querySelectorAll("div[ct-data-role='page']"), function () {
        _templateDB[this.getAttribute("id")] = this.outerHTML;
        /**
         * Ajax预处理
         */
        ajaxPreloadPromiseTasks.push(AjaxPreloadPromise(this));
        this.parentNode.removeChild(this);
      });

      $.when.apply(this, ajaxPreloadPromiseTasks).done(function () {
        // TODO:NATIVE------调用插件添加模板(上来就执行)
        if (_mode === "mulitview") {
          w.mulitview.addTemplateDB(function () {
            console.timeEnd("初始化本地模板用时:");
            dtd.resolve();
          }, function () {
          }, _templateDB);
        } else {
          console.timeEnd("初始化本地模板用时:");
          dtd.resolve();
        }
      });
      return dtd.promise();
    }

    /**
     * 页面载入完成后,支持Promise
     */
    function readyPromise() {
      var dtd = $.Deferred();
      $(w.document).ready(function () {
        dtd.resolve();
      });
      return dtd.promise();
    }

    /**
     * DOM载入完成后，支持Promise
     * @returns {*}
     * @constructor
     */
    function DOMContentLoadedPromise() {
      var dtd = $.Deferred();
      w.addEventListener("DOMContentLoaded", function () {
        dtd.resolve();
      });
      return dtd.promise();
    }

    /**
     * cordova的设备载入完成后的回调函数,支持Promise
     */
    function devicereadyPromise() {
      var dtd = $.Deferred();
      w.document.addEventListener("deviceready", function () {
        dtd.resolve();
      });
      return dtd.promise();
    }

    /**
     * 跳转到指定的历史
     * @param index 历史位置
     * 注释：当前的位置为0 index负值为回退，index正数为前进 都以1开始
     * 例如 -1 为当前页之前的页面,1为当前页之后的页面，0为刷新当前页面
     */
    function go(index) {
      root.router.go(index);
    }

    /**
     * 对angular进行初始化
     */
    function initAngular() {
      /**
       * 获取angularApp
       * @type {module|*}
       * @private
       */
      _angularApp = _angularConfig.angular.module(_angularConfig.appName, ['ngTouch']);

      /**
       * 对angular进行配置
       */
      _angularApp.config(["$controllerProvider", "$compileProvider", "$filterProvider", "$provide", function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
        _angularApp.register = {
          controller: $controllerProvider.register,
          directive: $compileProvider.directive,
          filter: $filterProvider.register,
          factory: $provide.factory,
          service: $provide.service
        };
      }]);

      /**
       * 注册自定义angular的filters
       */
      if (AngularFilterManager && AngularFilterManager.register) {
        AngularFilterManager.register(_angularApp, function () {
          /**
           * 注册自定义angular的service
           */
          if (AngularServiceManager && AngularServiceManager.register) {
            AngularServiceManager.register(_angularApp, function () {
              /**
               * 注册自定义angular的directives
               */
              if (AngularDirectiveManager && AngularDirectiveManager.register) {
                AngularDirectiveManager.register(_angularApp, function () {

                });
              }
            });
          }
        });
      }
    }

    /**
     * 判断是否支持angular
     */
    function isSupportAngular() {
      if (_angularConfig
        && _angularConfig.supportAngular
        && _angularConfig.appName
        && _angularConfig.angular) {
        return true;
      } else {
        return false;
      }
    }

    /**
     * 判断是否支持cordova
     */
    function isSupportCordova() {
      if (_cordovaConfig && _cordovaConfig.supportCordova) {
        return true;
      } else {
        return false;
      }
    }

    /**
     * 根据Ajax返回值获取TemplateStr
     * @param id
     */
    function getPageTemplateStrByAjaxStr(templateText) {
      var pageDom;
      templateText = templateText.trim();
      var pageElemRegex = new RegExp("(<[^>]+\\bct-data-role=[\"']?page[\"']?[^>]*>)");
      if (pageElemRegex.test(templateText)) {
        var strArr = templateText.split(/<\/?body[^>]*>/gmi);
        pageDom = $(((strArr || []).length === 0 ? "" : strArr.length > 1 ? strArr[1] : strArr[0]) || "")[0];
      }

      if (pageDom) {
        return pageDom.outerHTML;
      } else {
        return "";
      }

    }

    /**
     * -----------------------------------------公共方法和属性的定义-----------------------------------
     */
    $.extend(root, {
      /**
       * version
       */
      version: "1.0.0",
      /**
       * Page
       * 代表一个DIV
       * <div ct-data-role='page'></div>
       * @param id
       * @constructor
       */
      Page: _page,
      /**
       * 路由的對象
       */
      router: _router,
      /**
       * 广播的对象
       */
      borasdcast: _borasdcast,
      /**
       * 将转场参数转换为对象
       * @param url
       * @returns {{}}
       */
      getUrlParam: function (url) {
        var reg_url = /^[^\?]+\?([\w\W]+)$/,
          reg_para = /([^&=]+)=([\w\W]*?)(&|$)/g,
          arr_url = reg_url.exec(url),
          ret = {};
        if (arr_url && arr_url[1]) {
          var str_para = arr_url[1], result;
          while ((result = reg_para.exec(str_para)) != null) {
            ret[result[1]] = decodeURI(result[2]);
          }
        }
        return ret;
      },
      /**
       * 将命名空间字符串代表的对象转换为srcObj下的对象
       * @param srcObj源对象
       * @param namespace 命名空间字符串
       * @return
       */
      namespaceToObj: function (srcObj, namespace) {
        if (!namespace) return;
        var obj = srcObj || {}, items = namespace.split(".");
        for (var i = 0, len = items.length; i < len; i++) {
          obj = obj[items[i]];
        }
        return obj;
      },
      /**
       * 继承
       * @param Child 子类的Prototype
       * @param Parent 父类的Prototype
       */
      extend: (function () {
        // proxy used to establish prototype chain
        var F = function () {
        };
        // extend Child from Parent
        return function (Child, Parent) {
          if (!Child || !Parent) return;
          F.prototype = Parent.prototype;
          var f = new F();
          $.extend(f, Child.prototype);
          Child.prototype = f;
          Child.__super__ = Parent.prototype;
          Child.prototype.constructor = Child;
        };
      }()),
      /**
       * 获取视口的宽度
       * @returns {number}
       */
      getClientWidth: function () {
        if (!_clientWidth) {
          _clientWidth = Math.max(
            w.document.body.clientWidth, w.document.documentElement.clientWidth, w.document.body.offsetWidth, w.document.documentElement.offsetWidth
          );
        }
        return _clientWidth;
      },
      /**
       * 获取视口的高度
       * @returns {number}
       */
      getClientHeight: function () {
        if (!_clientHeight) {
          _clientHeight = Math.max(
            w.document.body.clientHeight, w.document.documentElement.clientHeight, w.document.body.offsetHeight, w.document.documentElement.offsetHeight
          );
        }
        return _clientHeight;
      },
      /**
       * 根据模板page的ID获取真正page的ID
       * 注释:pageId_时间戳?parameters
       * @param pageId
       */
      getId: function (pageId) {
        var id = "";

        var index = pageId.indexOf("?");
        if (index !== -1) {
          id = pageId.substring(0, index) + "_" + new Date().getTime() + pageId.substring(index);
        } else {
          id = pageId + "_" + new Date().getTime();
        }
        return id;
      },
      /**
       * 获取第一页真正的ID
       */
      getFirstId: function () {
        var hash = w.location.hash;
        if (hash) {
          if (hash.indexOf("?") != -1) {
            return hash.substring(1, hash.indexOf("?"));
          } else {
            return hash.substring(1);
          }
        } else {
          return root.getId(root.getFirstPageId());// + "_" + new Date().getTime();
        }
      },
      /**
       * 页面跳转
       * @param pageId (pageId = pageId + params) 如: page1?a=1&b=2;
       * @param option {
       *     reload : [true | false]
       * }
       */
      startPage: function (href, option) {
        root.router.startPage(href, option);
      },
      /**
       * 获取第一个页面的pageId
       */
      getFirstPageId: function () {
        //return root.$body.find("[ct-data-role='page']:eq(0)").attr("id");
        //TODO:(模板)change
        var id;
        for (var p in _templateDB) {
          id = p;
          break;
        }
        return id;
      },
      /**
       * 根据ID获取page对象
       * @param property 属性
       * @param value
       * @returns {*}
       */
      getPageById: function (id) {
        return _history[this.indexOfById(id)];
      },
      /**
       * 根据id获取索引
       * @param id
       * @returns {number}
       */
      indexOfById: function (id) {
        var index = -1;
        for (var i = 0, len = _history.length; i < len; i++) {
          if (_history[i].getId() === id) {
            index = i;
            break;
          }
        }
        return index;
      },
      /**
       * 根据索引获取page对象
       * @param index
       * @returns {*}
       */
      getPageByIndex: function (index) {
        return _history[index];
      },
      /**
       * 获取历史记录中的栈第一个元素
       */
      getFirstPage: function () {
        return _history[0];
      },
      /**
       * 获取历史记录中的栈顶的元素
       * @returns {*}
       */
      getLastPage: function () {
        return _history[_history.length - 1];
      },
      /**
       * 获取转场的参数
       */
      getParameter: function () {
        return root.router.getParameter()//$.extend({}, _parameter);
      },
      /**
       * 获取历史栈长度
       */
      getHistoryLength: function () {
        return _history.length;
      },
      /**
       * 根据pageId获取单例对象
       */
      getSingleInstance: function (pageId) {
        if (!_singleInstances) {
          _singleInstances = {};
        }
        return _singleInstances[pageId];
      },
      /**
       * 获取父窗体的setRequest的值
       */
      getRequest: function (page) {
        if (_history.length === 0 || _history.length === 1) {
          return {};
        } else {
          var index = root.indexOfById(page.getId());
          if (index <= 0 || index > _history.length - 1) {
            return {};
          } else {
            return _history[_history.length - 2].requestIntent || {};
          }
        }
      },
      /**
       * 触发一个自定义事件
       * @param dom
       * @param type
       * @param params
       */
      fireEvent: function (dom, type, params) {
        fireEvent(dom, type, params);
      },

      /**
       * 执行Receiver通过Id
       * @param id
       * @param jsonStr
       */
      executeReceiverById: function (id, jsonStr) {
        root.borasdcast.executeReceiverById(id, jsonStr);
      },
      /**
       * 注册Receiver对象
       * @params handler [Function] receiver执行的handler
       * @params intentFilter [Object]
       * {
       *    action:[string] action
       *    priority:[number] 优先级
       *    categorys:[array] 分类
       * }
       */
      registerReceiver: function (handler, intentFilter) {
        root.borasdcast.registerReceiver(handler, intentFilter);
      },
      /**
       * 解除注册Receiver对象
       * @params handler
       */
      unregisterReceiver: function (handler) {
        root.borasdcast.unregisterReceiver(handler);
      },
      /**
       * 发送无序广播
       * @param intent
       * {
       *    action:[string] action
       *    categorys:[array] 分类
       *    bundle:Object 参数
       * }
       */
      sendBroadcast: function (intent) {
        root.borasdcast.sendBroadcast(intent);
      },
      /**
       * 发送有序广播
       * @param intent
       * {
       *    action:[string] action
       *    categorys:[array] 分类
       *    bundle:Object 参数
       * }
       */
      sendOrderedBroadcast: function (intent) {
        root.borasdcast.sendOrderedBroadcast(intent);
      }
    });

    // TODO:初始化
    /**--------------------------------初始化-----------------------------*/
    /**
     * 初始化angular
     * 如果开启了对angular的支持,且用户引用了angular的库文件
     */
    if (isSupportAngular()) {
      initAngular();
    }

    /**
     * 如果开启了对cordova的支持
     */
    if (isSupportCordova()) {
      /**
       * 如果开启了对cordova的支持，那么页面完成事件和cordova的deviceReady事件必须同时完成后才能支持后续代码
       */
      $.when(readyPromise(), DOMContentLoadedPromise(), devicereadyPromise()).done(function () {
        onReady();
        fireEvent(w.document, "DOMContentAndDeviceReady");
      }).fail(function () {
      });
    }
    else {
      /**
       * 页面载入完成事件
       */
      $(w.document).ready(onReady);

      /**
       * 自动 init
       */
      w.addEventListener("DOMContentLoaded", onReady);
    }

    //        /**
    //         * 注册页面的onresize事件
    //         */
    //        window.onresize = function(e) {
    //            /**
    //             * 解决定位元素在键盘出现和小时自定义工具栏出现和消失时界面布局问题
    //             * window.document.documentElememt.clientHeight是变化后的高度
    //             * document的body高度当resize时是不改变的
    //             * 将window.document.documentElement.clientHeight赋值给docuemnt.body.style.height
    //             * @type {string}
    //             */
    //            w.document.body.style.height = e.target.document.documentElement.clientHeight + "px";
    //        }

    ///**
    // * 注册页面转场事件
    // */
    //$(w.document).on("pageBeforeChange", function (e, params) {
    //    console.assert(_debugger,"pageBeforeChange:" + params);
    //    for (var p in params) {
    //        console.assert(_debugger,"p:" + params[p]);
    //    }
    //    _parameter = params;
    //});

    // TODO:扩展
    /**--------------------------------expand-----------------------------*/
    /**
     * @param tag
     */
    Element.prototype.getParentElementByTag = function (tag) {
      if (!tag) return null;
      var element = null, parent = this;
      var popup = function () {
        parent = parent.parentElement;
        if (!parent) return null;
        var tagParent = parent.tagName.toLocaleLowerCase();
        if (tagParent == tag) {
          element = parent;
        } else if (tagParent == "body") {
          element = null;
        } else {
          popup();
        }
      }
      popup();
      return element;
    }

    /**
     * 用html字符串创建元素
     */
    function createElement(html) {
      var dom = document.createElement("div");
      dom.innerHTML = html;
      return dom.firstChild;
    }

    /**
     * 对数组进行遍历
     * @param array Array
     * @param itemCallback:function(value,index){}
     */
    function forEach(array, itemCallback) {
      for (var i = 0, len = array.length; i < len; i++) {
        if (itemCallback) {
          itemCallback.call(array[i], array[i], i);
        }
      }
    }

    return Object.freeze(root || {});

  }
);