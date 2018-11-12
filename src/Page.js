/***
 * Created by lzq on 2018/11/02
 * Page.js
 */

import $ from "jquery";
import Constant from "./Constant";

/**
 * 对数组进行遍历
 * @access private
 * @param {Array} array
 * @param {Function} itemCallback:function(value,index){}
 */
function forEach(array, itemCallback) {
  for (let i = 0, len = array.length; i < len; i++) {
    if (itemCallback) {
      itemCallback.call(array[i], array[i], i);
    }
  }
}

/**
 * 跳转到指定的历史
 * @access private
 * @param {number} index - 历史位置
 * 注释：当前的位置为0 index负值为回退，index正数为前进 都以1开始
 * 例如 -1 为当前页之前的页面,1为当前页之后的页面，0为刷新当前页面
 */
function go(index) {
  this.ctmobile.router.go(index);
}

/**
 * 创建Page的DOM结构
 * @access private
 */
function createPageDOM() {
  const self = this;
  /***
   * 根据pageId克隆模板
   */
  this._pDom = $(this.ctmobile.templateDB[this.pageId])[0];

  /***
   * 设置page真实的id
   */
  this._pDom.setAttribute("id", this.id);

  /***
   * 改变page中所有包含id的属性的值都加入id前缀(根据情况进行扩展)
   * label的for属性
   * input的list属性
   * datalist的id属性
   */
  forEach(this._pDom.querySelectorAll("[id]"), function () {
    this.setAttribute("id", self.id + this.getAttribute("id"));
  });
  forEach(this._pDom.querySelectorAll("label[for]"), function () {
    this.setAttribute("for", self.id + this.getAttribute("for"));
  });
  forEach(this._pDom.querySelectorAll("input[list]"), function () {
    this.setAttribute("list", self.id + this.getAttribute("list"));
  });
  forEach(this._pDom.querySelectorAll("datalist[id]"), function () {
    this.setAttribute("id", self.id + this.getAttribute("id"));
  });

  /***
   * 获取page的页面过渡类型
   */
  if (this._pDom.getAttribute("ct-data-transition")) {
    this.transition = this._pDom.getAttribute("ct-data-transition");
  }

  /***
   * 注册Page的默认事件
   * 在addEventListeners之前的代码调用fireEvent方法去触发事件，因为只有注册后才能触发事件
   */
  addEventListeners.call(this);

  /***
   * 对page中的通知(BorasdcastReceiver)进行处理
   */
  if (this._pDom.getAttribute("ct-data-intentfilter-action")) {
    this.ctmobile.registerReceiver({
      el: this._pDom,
      action: this._pDom.getAttribute("ct-data-intentfilter-action"),
      priority: this._pDom.getAttribute("ct-data-intentfilter-priority") ? parseInt(this._pDom.getAttribute("ct-data-intentfilter-priority")) : 0,
      categorys: this._pDom.getAttribute("ct-data-intentfilter-categorys") ? this._pDom.getAttribute("ct-data-intentfilter-categorys").split(" ") : []
    }, this.pageReceiver);
  }

  /***
   * 获取page中注册的返回按钮
   */
  this._pDom.addEventListener("click", function (e) {
    if (e.target.getAttribute("ct-data-rel") && e.target.getAttribute("ct-data-rel") === "back") {
      go.call(self, -1);
    }
  }, false);

  /***
   * 渲染
   */
  window.document.body.appendChild(this._pDom);

  /***
   * 触发pageCreate事件
   */
  this.ctmobile.fireEvent(this._pDom, "pageCreate");
}

/**
 * 布局
 * @access private
 */
function layout() {
  /***
   * 复位
   */
  slideByTransition.call(this, this.transition, "reset", 0);
}

/**
 * 注册Page的事件
 * @access private
 */
function addEventListeners() {
  const self = this;

  /***
   * 注册Page的缺省事件
   */
  self.getPageJO().on({
    "pageCreate": self.pageCreate.bind(self),
    "pageBeforeShow": self.pageBeforeShow.bind(self),
    "pageShow": self.pageShow.bind(self),
    "pageAfterShow": self.pageAfterShow.bind(self),
    "pageBeforePause": self.pageBeforePause.bind(self),
    "pageAfterPause": self.pageAfterPause.bind(self),
    "pageBeforeRestore": self.pageBeforeRestore.bind(self),
    "pageRestore": self.pageRestore.bind(self),
    "pageAfterRestore": self.pageAfterRestore.bind(self),
    "pageBeforeDestroy": self.pageBeforeDestroy.bind(self),
    "pageResult": self.pageResult.bind(self),
    "pageReceiver": self.pageReceiver.bind(self)
  });

  /**
   * onTransitionAndAnimationEnd
   * @access private
   * @param {Object} e
   */
  function onTransitionAndAnimationEnd(e) {
    console.log(Constant._debugger, "------------------------------onTransitionAndAnimationEnd");
    /***
     * 如果当前页面的transition为material则肯定不会执行webkitTransitionEnd事件
     */
    if (e.type === "webkitTransitionEnd" && e.target.getAttribute("ct-data-role") !== "page") {
      return;
    }

    if (self.pageTransitionType) {
      if (self.pageTransitionType === "start") {
        delete self.pageTransitionType;
        pageStartTransitionEndCallback.call(self, e);
      } else if (self.pageTransitionType === "finish") {
        delete self.pageTransitionType;
        pageFinishTransitioneEndCallback.call(self, e);
      }
    }
  }

  /***
   * 注册Page的transitionEnd和animationEnd事件
   */
  self.getPageDOM().addEventListener("webkitTransitionEnd", onTransitionAndAnimationEnd, false);
  self.getPageDOM().addEventListener("webkitAnimationEnd", onTransitionAndAnimationEnd, false);
}

/**
 * 调用finish方法后的transitionEnd
 * @access private
 * @callback
 */
function pageFinishTransitioneEndCallback(e) {
  const self = this;

  /***
   * 如果当前页面的transition为material则肯定不会执行webkitTransitionEnd事件
   */
  if ((e.type === "webkitTransitionEnd" && e.target.getAttribute("ct-data-role") !== "page") ||
    (e.type === "webkitAnimationEnd" && e.target.getAttribute("ct-data-role") !== "page")) {
    return;
  }

  e.stopPropagation();
  e.preventDefault();

  /***
   */
  self.getPageDOM().classList.remove("materialHide");

  /***
   * 当前页隐藏
   */
  self.getPageDOM().classList.remove("active");
  self.ctmobile.maskDOM.style.display = "none";
  self.changeKey = false;

  /***
   * 删除DOM
   */
  const ctDataMode = self.ctmobile.getTemplateConfig(self.getPageId(), "ct-data-mode");
  if (ctDataMode.toLowerCase().indexOf("singleinstance") === -1) {
    self.getPageDOM().parentNode.removeChild(self.getPageDOM());
  }

  if (self.ctmobile.getHistoryLength() > 1) {
    const lastPrePageIndex = self.ctmobile.getHistoryLength() - 2;

    /***
     * 当前页之前页恢复之后事件
     */
    self.ctmobile.fireEvent(self.ctmobile.getPageByIndex(lastPrePageIndex).getPageDOM(), "pageAfterRestore");

    /***
     * 如果当前页是带有返回值的页
     */
    if (
      (ctDataMode.toLowerCase().lastIndexOf("result") !== -1) &&
      self.resultIntent &&
      self.resultIntent.resultCode
    ) {
      self.ctmobile.fireEvent(
        self.ctmobile.getPageByIndex(lastPrePageIndex).getPageDOM(),
        "pageResult",
        [self.resultIntent.resultCode, self.resultIntent.bundle]
      );
    }
  }

  /***
   * 出stack
   */
  self.ctmobile.router.removeLastPage();

  if (self.pageTransitionEndCallback) {
    self.pageTransitionEndCallback();
  }
}

/**
 * 调用start方法后的transitionEnd
 * @access private
 * @callback
 * @param {Object} e
 */
function pageStartTransitionEndCallback(e) {
  const self = this;
  /***
   * 如果当前页面的transition为material则肯定不会执行webkitTransitionEnd事件
   */
  if ((e.type === "webkitTransitionEnd" && e.target.getAttribute("ct-data-role") !== "page") ||
    (e.type === "webkitAnimationEnd" && e.target.getAttribute("ct-data-role") !== "page")) {
    return;
  }

  e.stopPropagation();
  e.preventDefault();

  /***
   * 当前页移除materialShow
   */
  self.getPageDOM().classList.remove("materialShow");
  /***
   * 最后一页隐藏
   */
  self.ctmobile.getLastPage().getPageDOM().classList.remove("active");

  self.ctmobile.maskDOM.style.display = "none";
  self.changeKey = false;

  /***
   * 当前页入历史
   */
  self.ctmobile.router.addPage(self);

  /***
   * 当前页显示之后事件
   */
  self.ctmobile.fireEvent(self.getPageDOM(), "pageAfterShow");

  /***
   * 当前页之前的页面暂停之后
   */
  if (self.ctmobile.getHistoryLength() >= 2) {
    self.ctmobile.fireEvent(self.ctmobile.getPageByIndex(self.ctmobile.getHistoryLength() - 2).getPageDOM(), "pageAfterPause");
  }

  if (self.pageTransitionEndCallback) {
    self.pageTransitionEndCallback();
  }
}

/**
 * 根据transition进行平移
 * @access private
 * @param {string} transition - 类型
 * @param {string} type - 重置还是显示
 * @param {number} duration - 动画持续的时间
 * @param {Function} beforeCallback - 回调函数
 */
function slideByTransition(transition, type, duration, beforeCallback) {
  const self = this;
  let x = 0, y = 0;

  /****
   * 重置
   */
  function reset() {
    /***
     * 从右到左
     */
    if (new RegExp(/.+left/g).exec(transition)) {
      x = "100%";
    }
    /***
     * 从左到右
     */
    else if (new RegExp(/.+right/g).exec(transition)) {
      x = "-100%";
    }
    /***
     * 从下到上
     */
    else if (new RegExp(/.+up/g).exec(transition)) {
      y = "100%";
    }
    /***
     * 从上到下
     */
    else if (new RegExp(/.+down/g).exec(transition)) {
      y = "-100%";
    }

    /***
     * 如果过渡类型是微信类型且过渡时间为零则重置之前的面板位置
     */
    if (transition.indexOf("wx") === 0 && duration !== 0) {
      delete self.ctmobile.getPageByIndex(self.ctmobile.getHistoryLength() - 2).pageTransitionType;
      slide.call(self.ctmobile.getPageByIndex(self.ctmobile.getHistoryLength() - 2), 0, 0, duration / 2);
    }
    /***
     * 如果过渡类型是push且过渡时间为零则重置之前的面板位置
     */
    else if (transition.indexOf("push") === 0 && duration !== 0) {
      delete self.ctmobile.getPageByIndex(self.ctmobile.getHistoryLength() - 2).pageTransitionType;
      slide.call(self.ctmobile.getPageByIndex(self.ctmobile.getHistoryLength() - 2), 0, 0, duration);
    }

    /***
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

  /***
   * 显示
   */
  function show() {
    /***
     * 如果过渡类型是微信类型
     */
    if (transition.indexOf("wx") === 0 && duration !== 0) {
      delete self.ctmobile.getLastPage().pageTransitionType;
      if (new RegExp(/.+left/g).exec(transition)) {
        slide.call(self.ctmobile.getLastPage(), "-20%", y, duration / 2);
      } else if (new RegExp(/.+right/g).exec(transition)) {
        slide.call(self.ctmobile.getLastPage(), "20%", y, duration / 2);
      } else if (new RegExp(/.+up/g).exec(transition)) {
        slide.call(self.ctmobile.getLastPage(), x, "-20%", duration / 2);
      } else if (new RegExp(/.+down/g).exec(transition)) {
        slide.call(self.ctmobile.getLastPage(), x, "20%", duration / 2);
      }
    }
    /***
     * 如果过度类型是push
     */
    else if (transition.indexOf("push") === 0 && duration !== 0) {
      delete self.ctmobile.getLastPage().pageTransitionType;
      if (new RegExp(/.+left/g).exec(transition)) {
        slide.call(self.ctmobile.getLastPage(), "-100%", y, duration);
      } else if (new RegExp(/.+right/g).exec(transition)) {
        slide.call(self.ctmobile.getLastPage(), "100%", y, duration);
      } else if (new RegExp(/.+up/g).exec(transition)) {
        slide.call(self.ctmobile.getLastPage(), x, "-100%", duration);
      } else if (new RegExp(/.+down/g).exec(transition)) {
        slide.call(self.ctmobile.getLastPage(), x, "100%", duration);
      }
    }

    /***
     * 当前页firstExecute
     */
    if (transition.indexOf("material") === 0) {
      if (duration !== 0) {
        if (beforeCallback) {
          beforeCallback();
        }
        self.getPageDOM().classList.add("materialShow");
      }
    } else {
      slide.call(this, x, y, duration, beforeCallback);
    }
  }

  /***
   * 重置
   */
  if (type === "reset") {
    reset.call(self);
  }
  /***
   * 显示
   */
  else {
    show.call(self);
  }
}

/**
 * 平移 core
 * @access private
 * @param {number} x - x的平移值
 * @param {number} y - y的平移值
 * @param {number} duration - 平移经过的时间
 * @param {Function} beforeCallback - 平移之前的回调函数
 */
function slide(x, y, duration, beforeCallback) {
  const self = this;
  if (beforeCallback) {
    beforeCallback();
  }

  /***
   * 滑动内部实现
   */
  function slideSub() {
    self.getPageJO().css({
      "transform": "translate3d(" + x + "," + y + ",0)",
      "-webkit-transform": "translate3d(" + x + "," + y + ",0)",
      "transition": "transform " + duration + "ms cubic-bezier(0.1,0.25,0.1,1)",
      "-webkit-transition": "transform " + duration + "ms cubic-bezier(0.1,0.25,0.1,1)"
    });
  }

  if (duration === 0) {
    slideSub();
  } else {
    window.setTimeout(slideSub, 100);
  }
}

/**
 * Page
 * @class Page
 * @classdesc 管理所有和页面相关的操作
 */
class Page {
  /**
   * @constructor
   * @param {CtMobile} ctmobile
   * @param {string} id
   */
  constructor(ctmobile, id) {
    Object.assign(this, {
      ctmobile,
      id,
      pageId: id.substring(0, id.lastIndexOf("_")),
      /*** 默认的页面过渡类型 */
      transition: "material",
      /*** 页面切换时的锁 */
      changeKey: false,
      /*** Page的transition类型[start|finish] */
      pageTransitionType: null,
      /*** Page的transitionEnd后的回调函数 */
      pageTransitionEndCallback: null
    });
    createPageDOM.call(this);
    layout.call(this);
    return this;
  }

  /**
   * 页面创建调用
   * @callback
   * @override
   * @param {Object} e
   */
  pageCreate(e) {
    // console.log(Constant._debugger, "pageCreateParentByParent");
  }

  /***
   * 页面显示之前
   * @callback
   * @override
   * @param {Object} e
   */
  pageBeforeShow(e) {
    // console.log(Constant._debugger, "pageBeforeShowByParent");
  }

  /***
   * 页面显示
   * @callback
   * @override
   * @param {Object} e
   */
  pageShow(e) {
    // console.log(Constant._debugger, "pageShowByParent");
  }

  /***
   *  页面显示之后
   * @callback
   * @override
   * @param {Object} e
   */
  pageAfterShow(e) {
    // console.log(Constant._debugger, "pageAfterShowByParent");
  }

  /***
   * 页面暂停之前
   * @callback
   * @override
   * @param {Object} e
   */
  pageBeforePause(e) {
    // console.log(Constant._debugger, "pageBeforePauseByParent");
  }

  /***
   * 页面暂停之后
   * @callback
   * @override
   * @param {Object} e
   */
  pageAfterPause(e) {
    // console.log(Constant._debugger, "pageAfterPauseByParent");
  }

  /***
   * 页面恢复之前
   * @callback
   * @override
   * @param {Object} e
   */
  pageBeforeRestore(e) {
    // console.log(Constant._debugger, "pageBeforeRestoreByParent");
  }

  /***
   * 页面恢复
   * @callback
   * @override
   * @param {Object} e
   */
  pageRestore(e) {
    // console.log(Constant._debugger, "pageRestoreByParent");
  }

  /***
   * 页面恢复之后
   * @callback
   * @override
   * @param {Object} e
   */
  pageAfterRestore(e) {
    // console.log(Constant._debugger, "pageAfterRestoreByParent");
  }

  /***
   * 页面DOM销毁之前
   * @callback
   * @override
   * @param {Object} e
   */
  pageBeforeDestroy(e) {
    // console.log(Constant._debugger, "pageBeforeDestroyByParent");
  }

  /***
   * pageResult
   * @callback
   * @override
   * @param {Object} e - jQuery的event
   * @param {string} resultCode - 返回的code
   * @param {Object} bundle - 返回的参数
   */
  pageResult(e, resultCode, bundle) {
    // console.log(Constant._debugger, "pageResult");
  }

  /***
   * 如果添加了ct-data-intentfilter-action属性，满足条件后触发
   * @callback
   * @override
   * @param {Object} bundle
   * @param {Object} functions
   */
  pageReceiver(bundle, functions) {
    // console.log(Constant._debugger, "pageReceiver");
  }

  /**
   * 显示
   * @param {string} duration - 完成显示的时间
   * @param {Function} callback - 结束时的回调函数
   */
  start(duration, callback) {
    const self = this;

    /***
     * 如果操作锁定则不进行
     */
    if (self.changeKey) return;

    /***
     * 操作加锁
     * @type {boolean}
     */
    self.changeKey = true;

    /***
     * 修改transitionEnd的类型
     * @type {string}
     */
    self.pageTransitionType = "start";

    /***
     * 修改transitionEnd的回调函数
     */
    self.pageTransitionEndCallback = callback;

    /***
     * 最后一页暂停之前事件
     */
    if (self.ctmobile.getHistoryLength() !== 0) {
      self.ctmobile.fireEvent(self.ctmobile.getLastPage().getPageDOM(), "pageBeforePause");
    }

    /***
     * 当前页显示前事件
     */
    self.ctmobile.fireEvent(self.getPageDOM(), "pageBeforeShow");

    if (duration !== 0) {
      self.ctmobile.maskDOM.style.display = "block";
    }


    /***
     * 当前页面显示
     */
    self.getPageDOM().classList.add("active");
    self.getPageDOM().style.zIndex = ++self.ctmobile.zIndex;
    /***
     * 当前页显示事件
     */
    self.ctmobile.fireEvent(self.getPageDOM(), "pageShow");

    /***
     * 当前页移动
     */
    slideByTransition.call(self, self.transition, "show", duration === 0 ? 0 : Constant._SLIDEDURATION);

    /***
     * 只有一个页的时候
     */
    if (duration === 0) {
      self.ctmobile.router.addPage(self);
      self.changeKey = false;
      self.ctmobile.fireEvent(self.getPageDOM(), "pageAfterShow");
      if (callback) {
        callback();
      }
    }
  }

  /**
   * 销毁
   * @params {string} duration - 完成显示的时间
   * @param {Function} callback - 结束时的回调函数
   * @param {Object} option - 调用startPage的option
   */
  finish(duration, callback, option) {
    const self = this;

    /***
     * 如果操作锁定则不进行
     */
    if (self.changeKey) return;

    /***
     * 操作加锁
     * @type {boolean}
     */
    self.changeKey = true;

    /***
     * 修改transitionEnd的类型
     * @type {string}
     */
    self.pageTransitionType = "finish";

    /***
     * 层级减
     */
    self.ctmobile.zIndex--;

    /***
     * 修改transitionEnd的回调函数
     */
    self.pageTransitionEndCallback = callback;

    /***
     * 当前页销毁之前事件
     */
    const ctDataMode = self.ctmobile.getTemplateConfig(self.getPageId(), "ct-data-mode");

    if (ctDataMode.toLowerCase().indexOf("singleinstance") === -1) {
      self.ctmobile.fireEvent(self.getPageDOM(), "pageBeforeDestroy");
      self.ctmobile.unregisterReceiverByDom(self.getPageDOM());
    } else {
      // 页面暂停之前
      self.ctmobile.fireEvent(self.getPageDOM(), "pageAfterPause");
    }

    // _history中最后一个元素之前的索引
    const lastPrePageIndex = self.ctmobile.getHistoryLength() - 2;

    // (多于一个元素)且(改变浏览器历史)
    if (self.ctmobile.getHistoryLength() > 1 && (!option || !option.reload)) {
      /***
       * 最后一个页之前的页触发恢复之前事件
       */
      self.ctmobile.fireEvent(self.ctmobile.getPageByIndex(lastPrePageIndex).getPageDOM(), "pageBeforeRestore");
    }

    if (duration !== 0) {
      self.ctmobile.maskDOM.style.display = "block";
    }

    // (多于一个元素)且(改变浏览器历史)
    if (self.ctmobile.getHistoryLength() > 1 && (!option || !option.reload)) {
      /***
       * 恢复最后一个页之前的页
       */
      self.ctmobile.getPageByIndex(lastPrePageIndex).getPageDOM().classList.add("active");
      /***
       * 最后一个页之前的页恢复事件
       */
      self.ctmobile.fireEvent(self.ctmobile.getPageByIndex(lastPrePageIndex).getPageDOM(), "pageRestore");
    }

    /***
     * 重置当前页
     */
    slideByTransition.call(this, this.transition, "reset", duration === 0 ? 0 : Constant._SLIDEDURATION);

    /***
     * 只有一个页的时候
     */
    if (duration === 0) {
      self.getPageDOM().classList.remove("active");
      self.changeKey = false;

      /***
       * 删除DOM
       */
      if (ctDataMode.toLowerCase().indexOf("singleinstance") === -1) {
        self.getPageDOM().parentNode.removeChild(self.getPageDOM());
      }

      // (多于一个元素)且(改变浏览器历史)
      if (self.ctmobile.getHistoryLength() > 1 && (!option || !option.reload)) {
        self.ctmobile.fireEvent(self.ctmobile.getPageByIndex(lastPrePageIndex).getPageDOM(), "pageAfterRestore");
        if (
          (ctDataMode.toLowerCase().lastIndexOf("result") !== -1) &&
          self.resultIntent &&
          self.resultIntent.resultCode) {
          self.ctmobile.fireEvent(
            self.ctmobile.getPageByIndex(lastPrePageIndex).getPageDOM(),
            "pageResult",
            [self.resultIntent.resultCode, self.resultIntent.bundle]
          );
        }
      }

      // (多于一个元素)且(不改变浏览器历史)
      if (self.ctmobile.getHistoryLength() > 1 && option && option.reload) {
        self.ctmobile.router.removePageByIndex(lastPrePageIndex, 1);
      } else {
        // 出stack
        self.ctmobile.router.removeLastPage();
      }

      if (callback) {
        callback();
      }
    }
  }

  /**
   * 获取page的DOM对象
   * @returns {HtmlElement}
   */
  getPageDOM() {
    return this._pDom;
  }

  /**
   * 获取当前页面的jQuery对象
   * @returns {*|jQuery|HTMLElement}
   */
  getPageJO() {
    if (!this._pJO) {
      this._pJO = $(this.getPageDOM());
    }
    return this._pJO;
  }

  /**
   * 获取page的实际id
   * @returns {*}
   */
  getId() {
    return this.id;
  }

  /**
   * 获取克隆的pageId
   * @returns {*}
   */
  getPageId() {
    return this.pageId;
  }

  /**
   * 设置请求参数
   * 页面之前传递参数的另一种形式(类似于android的intent)
   * @param {String} requestCode
   * @param {Object} bundle
   */
  setRequest(requestCode = "", bundle = {}) {
    this.requestIntent = {
      requestCode: requestCode,
      bundle: bundle
    };
  }

  /**
   * 获取父页面的请求参数
   * 只有在页面的pageAfterShow中才可以调用此方法获取上一页面调用setRequest传递的参数
   * @param {Function} callback
   * @return {Object} - {
   *   requestCode:String
   *   bundle:Object
   * }
   */
  getRequest(callback) {
    return this.ctmobile.getRequest(this);
  }

  /**
   * 设置返回值
   * 设置返回父页面的数据
   * @param {String} resultCode
   * @param {Object} bundle
   */
  setResult(resultCode = "", bundle = {}) {
    this.resultIntent = {
      resultCode: resultCode,
      bundle: bundle,
    };
  }

  /**
   * 获取resultIntent
   * @param {Function} callback
   * @return {Object}
   */
  getResult(callback) {
    return this.resultIntent;
  }

  /**
   * 当前页面ct-data-mode设置为result或singleInstanceResult时,向父页面返回参数时调用over
   * 只有设置了setRequest后在调用over父页面才能触发pageResult事件
   */
  over() {
    go.call(this, -1);
  }

  /**
   * 获取CtMobile实例
   * @return {CtMobile|*}
   */
  getCtMobile() {
    return this.ctmobile;
  }
}

export default Page;