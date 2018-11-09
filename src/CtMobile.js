/***
 * Created by lzq on 2018/11/02.
 * CtMobile.js
 * CtMobie移动端开发框架(依赖jQuery)
 * WEB主体形支持三种model模式
 *   mode1: 本地锚点模式(inline模式)
 *           模板都在本地的一个html中进行预先定义
 *   mode2:  Ajax加载模式
 *           只有第一页的模板在html进行预先定义，其他页面的模板用Ajax动态加载
 *   mode3: 混合模式
 *           mode1和mode2混合进行
 */

import $ from "jquery";
import Page from "./Page";
import Router from "./Router";
import BorasdCast from "./BorasdCast";

/**
 * 根据模板pageId获取模板的DOM对象
 * @access private
 * @param {string} pageId
 * @return  {HtmlElement}
 */
function getTemplateDOMById(pageId) {
  if (pageId.indexOf("?") !== -1) {
    pageId = pageId.substring(0, pageId.indexOf("?"));
  }
  return $(this.templateDB[pageId])[0];
}

/**
 * 获取模板的属性
 * @access private
 * @param {string} pageId
 * @param {string} attr
 * @return {Object}
 */
function getTemplateConfig(pageId, attr) {
  const dom = getTemplateDOMById.call(this, pageId);
  let config = dom.getAttribute(attr);
  if ((attr === "ct-data-mode") && !config) {
    config = "standard";
  }
  return config;
}

/**
 * 页面载入完成后,支持Promise
 * @access private
 * @callback
 * @return {Promise}
 */
function readyPromise() {
  return new Promise((resolve) => {
    $(window.document).ready(() => {
      resolve();
    });
  });
}

/**
 * DOM载入完成后，支持Promise
 * @access private
 * @callback
 * @return {Promise}
 */
function DOMContentLoadedPromise() {
  return new Promise((resolve) => {
    window.addEventListener("DOMContentLoaded", () => {
      resolve();
    });
  });
}

/**
 * cordova的设备载入完成后的回调函数,支持Promise
 * @access private
 * @callback
 * @return {Promise}
 */
function devicereadyPromise() {
  return new Promise((resolve) => {
    window.document.addEventListener("deviceready", () => {
      resolve();
    });
  });
}

/**
 * 触发自定义的Html事件
 * @access private
 * @param {HtmlElement} dom - 触发的HTML对象
 * @param {string} type - 触发的事件
 * @param {Array} params - 参数
 */
function fireEvent(dom, type, params = []) {
  $(dom).trigger(type, params);
}

/**
 * 预加载Ajax的页面
 * @access private
 * @callback
 * @param {HtmlElement} pageDOM
 * @return {Promise}
 */
function AjaxPreloadPromise(pageDOM) {
  const self = this;
  return new Promise((resolve, reject) => {
    let asyncTasks = [];
    console.time("预加载Ajax用时");

    /***
     * 查看是否有需要预加载的Ajax页面
     */
    $(pageDOM).find("a[ct-data-preload=true][ct-pageId]").each((index, aDom) => {
      const ctDataAjax = aDom.getAttribute("ct-data-ajax");
      const pageId = aDom.getAttribute("ct-pageId");

      if (
        !pageId &&
        ctDataAjax &&
        ctDataAjax === "false"
      ) {
        return false;
      }

      const pageRouterConfig = self.config.router[pageId];
      const href = (pageRouterConfig && pageRouterConfig.url) ? pageRouterConfig.url : "";
      if (!href) {
        return false;
      }

      asyncTasks.push($.ajax({
        dataType: "text",
        url: href,
        success: (templateText) => {
          this.templateDB[pageId] = CtMobileFactory.getPageTemplateStrByAjaxStr(templateText);
        },
        error: (error, status, thrown) => {
          reject(error);
        }
      }));
    });

    if (asyncTasks.length !== 0) {
      Promise.all(asyncTasks).then(() => {
        console.timeEnd("预加载Ajax用时");
        resolve();
      }).catch(() => {
        reject();
      });
    } else {
      resolve();
    }
  });
}

/**
 * 初始化本地模板
 * 模板是框架的基础，一切都是基于模板生成的
 * 将<div ct-data-role="page"></div>的元素缓存到js对象中
 * {
 *   ct-data-role的值(id):outerHTML为值
 * }
 * @access private
 */
function initialLocalTemplatePromise() {
  const self = this;

  return new Promise((resolve, reject) => {
    console.time("初始化本地模板用时:");

    /***
     * 遍历所有含有ct-data-role="page"的元素并且删除
     */
    let ajaxPreloadPromiseTasks = [];

    $(this.bodyDOM).find("div[ct-data-role='page']").each(function () {
      self.templateDB[this.getAttribute("id")] = this.outerHTML;
      /***
       * Ajax预处理
       */
      ajaxPreloadPromiseTasks.push(AjaxPreloadPromise.call(self, this));
      this.parentNode.removeChild(this);
    });

    Promise.all(ajaxPreloadPromiseTasks).then(() => {
      console.timeEnd("初始化本地模板用时:");
      resolve();
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * 预加载pageDom中所有要预加载的页面
 * @access private
 * @param {HtmlElement} pageDom
 * @return {Promise}
 */
function preload(pageDom) {
  const self = this;
  return new Promise((resolve, reject) => {
    let ajaxPreloadPromiseTasks = [];
    /**
     * Ajax预处理
     */
    ajaxPreloadPromiseTasks.push(AjaxPreloadPromise.call(self, pageDom));
    Promise.all(ajaxPreloadPromiseTasks).then(() => {
      resolve();
    }).catch((error) => {
      reject(error);
    });
  });
}

/**
 * 捕获a标签的事件
 * @access private
 * @callback
 * @return {Promise}
 */
function LinkCapturePromise() {
  const self = this;
  return new Promise((resolve) => {
    console.time("捕获a标签用时:");
    /***
     * 初始化 link-capture events
     */
    window.document.addEventListener("click", function (e) {
      e.preventDefault();
      let target = e.target;
      if (!target) return;
      // 不是a元素
      if (
        target.tagName.toLocaleLowerCase() !== "a" &&
        !(target = CtMobileFactory.getParentElementByTag(target, "a"))
      ) {
        return;
      }

      const ctDataAjax = target.getAttribute("ct-data-ajax");
      // 如果用户不想让框架控制a元素
      if (
        ctDataAjax &&
        ctDataAjax === "false"
      ) return;

      const ctPageId = target.getAttribute("ct-pageId");
      console.log(ctPageId);
      const ctParameter = target.getAttribute("ct-parameter") || "";
      if (!ctPageId) {
        return;
      }

      const pageRouterConfig = self.config.router[ctPageId];
      const href = `${(pageRouterConfig && pageRouterConfig.url) ? pageRouterConfig.url : "#" + ctPageId}?pageId=${ctPageId}${ctParameter}`;
      self.startPage(href, {
        reload: target.getAttribute("ct-reload") === "true" ? true : self.config.linkCaptureReload
      });

      return false;
    });
    console.timeEnd("捕获a标签用时:");
    resolve();
  });
}

/**
 * 创建实例
 * @access private
 * @param {Function} Class
 * @param {string} id
 * @param {string} pageId
 * @return {Page}
 */
function newInstance({Class, id, pageId}) {
  const typeofName = (typeof Class).toLowerCase();

  const ctDataMode = getTemplateConfig.call(this, pageId, "ct-data-mode");

  let Constructor;

  /***
   * 如果Class可以实例化
   */
  if (typeofName === "function") {
    Constructor = Class;
  }
  /***
   * 如果Class不可以实例化则用缺省的Page进行实例化
   */
  else if (typeofName === "undefined") {
    Constructor = Page;
  }

  if (!Constructor) {
    throw "页面管理类无法初始化";
    return false;
  }

  /***
   * 如果是singleInstance 或 singleInstanceResult
   */
  if (ctDataMode.toLowerCase().indexOf("singleinstance") !== -1) {
    if (!this.getSingleInstance(pageId)) {
      this.singleInstances[pageId] = new Constructor(this, id);
    }
    return this.singleInstances[pageId];
  } else {
    return new Constructor(this, id);
  }
}

/**
 * 通过ID创建Page对象
 * @access private
 * @param {string} id
 * @return {Promise}
 */
function createPage(id) {
  return new Promise((resolve, reject) => {
    const pageId = id.substring(0, id.lastIndexOf("_"));
    let Class;
    const pageRouterConfig = this.config.router[pageId];
    if (pageRouterConfig) {
      const component = this.config.router[pageId].component;
      if (component && component.then) {
        component.then((Page) => {
          if (Page) {
            Class = Page.default;
            // 可以进行实例化，一般都是inline模式
            if (Class) {
              resolve(newInstance.call(this, {Class, id, pageId}));
            } else {
              reject();
            }
          } else {
            reject();
          }
        }).catch((error) => {
          reject(error);
        });
      } else {
        // 使用缺省的Page实例
        resolve(newInstance.call(this, {Page, id, pageId}));
        //throw `没有${pageId}的页面`;
      }
    } else {
      resolve(newInstance.call(this, {Page, id, pageId}));
    }
  });
}

/**
 * 页面载入完成的回调函数
 * @access private
 * @callback
 */
function onReady() {
  const self = this;

  /***
   * 判断页面是否已经ready
   */
  if (this.hasInited) return;
  this.hasInited = true;

  /***
   * window.document.body的jQuery
   */
  this.bodyDOM = window.document.body;

  /***
   * 存放完全单例对象的容器
   */
  this.singleInstances = null;

  /***
   * 创建page切换时的遮罩层
   */
  this.maskDOM = $(
    "<div class='ct-page-mask'>" +
    " <div opt='animation' class='la-ball-circus la-dark' style='color:#3e98f0;'>" +
    "   <div></div>" +
    "   <div></div>" +
    "   <div></div>" +
    "   <div></div>" +
    "   <div></div>" +
    " </div>" +
    "</div>")[0];
  this.bodyDOM.appendChild(this.maskDOM);


  /***
   * initialLocalTemplate都完成后初始化第一页 and LinkCapture
   */
  Promise.all(
    [
      initialLocalTemplatePromise.call(this),
      LinkCapturePromise.call(this)
    ]
  ).then(() => {
    console.timeEnd("总用时");
    fireEvent(window.document, "pageBeforeChange", [CtMobileFactory.getUrlParam(window.location.hash)]);
    /***
     * 初始化第一页
     * TODO:初始化第一页
     */
    createPage.call(this, this.getFirstId()).then((page) => {
      page.start(0, () => {
          /***
           * if(有hash值) 加载的不是首页而是某一个指定的页面 {
           *   调用startPage即可
           *   startPage需要三部分值
           *   1.html的路径
           *   2.pageId
           *   3.parameter
           * }
           */
          const hash = window.location.hash;
          if (!hash) return false;

          const pageId = self.getPageIdByHash();
          if (!pageId) return false;

          const pageRouterConfig = self.config.router[pageId];
          if ((pageRouterConfig && !pageRouterConfig.url)) return;
          const url = (pageRouterConfig && pageRouterConfig.url) ? pageRouterConfig.url : `#${pageId}`;

          const parameter = self.getParameterByHash();

          self.startPage(`${url}${parameter}${parameter ? `&pageId=${pageId}` : `?pageId=${pageId}`}`, {
            reload: self.config.linkCaptureReload
          });
        }
      );
    });
  });

}

/**
 * initCtMobile
 * @access private
 */
function init() {
  const {supportCordova = false} = this.config;

  onReady = onReady.bind(this);

  /***
   * 如果开启了对cordova的支持
   */
  if (supportCordova) {
    /***
     * 如果开启了对cordova的支持，那么页面完成事件和cordova的deviceReady事件必须同时完成后才能支持后续代码
     */
    Promise.all([
      readyPromise(),
      DOMContentLoadedPromise(),
      devicereadyPromise()
    ]).then(() => {
      onReady();
      fireEvent(window.document, "DOMContentAndDeviceReady");
    }).catch((error) => {

    });
  }
  else {
    /***
     * 页面载入完成事件
     */
    $(window.document).ready(onReady);

    /***
     * 自动 init
     */
    window.addEventListener("DOMContentLoaded", onReady);
  }
}

/**
 * CtMobile
 * @class
 */
class CtMobile {
  /**
   * @constructor
   * @param {Object} config -
   * config {
   *   supportCordova: [true | false],是否支持cordova,默认为false
   *   linkCaptureReload: [true | false],<a>标签加载页面是否改变浏览器历史,默认为true
   *   router: Object {
   *        id (ct-data-role="page"的id属性): Object{
   *          url:String (页面的地址)
   *          component: Function (返回一个Prmise)
   *        }
   *      }
   *   }
   */
  constructor(config) {
    this.config = config;

    // 是否初始化过
    this.hasInited = false;
    // 页面的模板数据
    this.templateDB = {};
    // page的zIndex
    this.zIndex = 0;

    // 路由对象
    this.router = new Router(this);
    // 广播对象
    this.borasdcast = new BorasdCast();

    init.call(this);
  }

  /**
   * 页面跳转
   * @param {string} pageId - (pageId = pageId + params) 如: page1?a=1&b=2;
   * @param {Object} option {
   *   reload : [true | false]
   * }
   */
  startPage(href, option) {
    this.router.startPage(href, option);
  }

  /**
   * 通过ID创建Page对象
   * @param {string} id
   * @return {Page}
   */
  createPage(id) {
    return createPage.call(this, id);
  }

  /**
   * 预加载pageDom中所有要预加载的页面
   * @param {HtmlElement} pageDom
   * @return {Promise}
   */
  preload(pageDom) {
    return preload.call(this, pageDom);
  }

  /**
   * 返回
   */
  back() {
    this.router.go(-1);
  }

  /**
   * 获取第一页真正的ID
   * @return {string}
   */
  getFirstId() {
    return this.getId(this.getFirstPageId());
  }

  /**
   * 根据模板page的ID获取真正page的ID
   * 注释:pageId_时间戳?parameters
   * @param {string} pageId
   * @return {string}
   */
  getId(pageId) {
    let id = "";

    const index = pageId.indexOf("?");
    if (index !== -1) {
      id = pageId.substring(0, index) + "_" + new Date().getTime() + pageId.substring(index);
    } else {
      id = pageId + "_" + new Date().getTime();
    }
    return id;
  }

  /**
   * 通过hash值获取pageId
   * 例子: "#info_1541214530597?id=1"
   * @return {string}
   */
  getPageIdByHash() {
    let hash = window.location.hash;
    if (!hash) return "";

    if (hash.indexOf("?") !== -1) {
      hash = hash.substring(0, hash.lastIndexOf("?"));
      return hash.substring(1, hash.lastIndexOf("_"));
    } else {
      return hash.substring(1, hash.lastIndexOf("_"));
    }
  }

  /**
   * 通过hash获取参数Parameter
   * @return {string}
   */
  getParameterByHash() {
    let hash = window.location.hash;
    if (!hash) return "";

    if (hash.indexOf("?") !== -1) {
      return hash.substring(hash.lastIndexOf("?"));
    } else {
      return "";
    }
  }

  /**
   * 获取第一个页面的pageId
   * @return {string}
   */
  getFirstPageId() {
    let id;
    for (let p in this.templateDB) {
      id = p;
      break;
    }
    return id;
  }

  /**
   * 根据ID获取page对象
   * @param {string} id
   * @return {Page}
   */
  getPageById(id) {
    return this.router.getPageById(this.indexOfById(id));
  }

  /**
   * 根据pageId获取单例对象
   * @param {string} pageId
   * @return {Page}
   */
  getSingleInstance(pageId) {
    if (!this.singleInstances) {
      this.singleInstances = {};
    }
    return this.singleInstances[pageId];
  }

  /**
   * 触发一个自定义事件
   * @param {HtmlElement} dom
   * @param {string} type
   * @param {Object} params
   */
  fireEvent(dom, type, params) {
    fireEvent(dom, type, params);
  }

  /**
   * 获取模板的属性
   * @param {string} pageId
   * @param {string} attr
   * @return {Object}
   */
  getTemplateConfig(pageId, attr) {
    return getTemplateConfig.call(this, pageId, attr);
  }

  /**
   * 根据索引获取page对象
   * @param {string} index
   * @returns {Page}
   */
  getPageByIndex(index) {
    return this.router.getPageByIndex(index);
  }

  /**
   * 根据id获取索引
   * @param {string} id
   * @returns {number}
   */
  indexOfById(id) {
    let index = -1;
    for (let i = 0, len = this.getHistoryLength(); i < len; i++) {
      if (this.getPageByIndex(i).getId() === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  /**
   * 获取历史记录中的栈第一个元素
   * @return {Page}
   */
  getFirstPage() {
    return this.router.getPageByIndex(0);
  }

  /**
   * 获取历史记录中的栈顶的元素
   * @returns {Page}
   */
  getLastPage() {
    return this.router.getLastPage();
  }

  /**
   * 获取转场的参数
   * @return {Object}
   */
  getParameter() {
    return this.router.getParameter();//$.extend({}, _parameter);
  }

  /**
   * 获取历史栈长度
   * @return {number}
   */
  getHistoryLength() {
    return this.router.getHistoryLength();
  }

  /**
   * 获取父窗体的setRequest的值
   * @param {Page} page
   * @return {Object}
   */
  getRequest(page) {
    if (this.getHistoryLength() === 0 || this.getHistoryLength() === 1) {
      return {};
    } else {
      const index = this.indexOfById(page.getId());
      if (index <= 0 || index > this.getHistoryLength() - 1) {
        return {};
      } else {
        return this.getPageByIndex(this.getHistoryLength() - 2).requestIntent || {};
      }
    }
  }

  /**
   * 注册Receiver对象
   * @params {Object} intentFilter -
   * {
   *    el: HtmlElement
	 *    action:[string] action
	 *    priority:[number] 优先级
	 *    categorys:[array] 分类
	 * }
   * @params {Function} handler - receiver执行的handler
   */
  registerReceiver(intentFilter, handler) {
    this.borasdcast.registerReceiver(intentFilter, handler);
  }

  /**
   * 执行Receiver通过Id
   * @param {string} id
   * @param {string} jsonStr
   */
  executeReceiverById(id, jsonStr) {
    this.borasdcast.executeReceiverById(id, jsonStr);
  }

  /**
   * 解除注册Receiver对象
   * @params {Function} handler
   */
  unregisterReceiver(action, handler) {
    this.borasdcast.unregisterReceiver(action, handler);
  }

  /**
   * 解除注册通过Page中的Dom
   * @param {HtmlElement} el
   */
  unregisterReceiverByDom(el) {
    this.borasdcast.unregisterReceiverByDom(el);
  }

  /**
   * 发送无序广播
   * @param {Object} intent -
   * {
	 *    action:[string] action
	 *    categorys:[array] 分类
	 *    bundle:Object 参数
	 * }
   */
  sendBroadcast(intent) {
    this.borasdcast.sendBroadcast(intent);
  }

  /**
   * 发送有序广播
   * @param {Object} intent -
   * {
	 *    action:[string] action
	 *    categorys:[array] 分类
	 *    bundle:Object 参数
	 * }
   */
  sendOrderedBroadcast(intent) {
    this.borasdcast.sendOrderedBroadcast(intent);
  }

}


/**
 * @class
 */
const CtMobileFactory = {
  /**
   * 将转场参数转换为对象
   * @param {string} url
   * @return {Object}
   */
  getUrlParam(url) {
    const reg_url = /^[^\?]+\?([\w\W]+)$/,
      reg_para = /([^&=]+)=([\w\W]*?)(&|$)/g,
      arr_url = reg_url.exec(url),
      ret = {};
    if (arr_url && arr_url[1]) {
      const str_para = arr_url[1];
      let result;
      while ((result = reg_para.exec(str_para)) != null) {
        ret[result[1]] = decodeURI(result[2]);
      }
    }
    return ret;
  },
  /**
   * getParentElementByTag
   * @param {HtmlElement} el
   * @param {string} tag
   * @return {HtmlElement}
   */
  getParentElementByTag(el, tag) {
    if (!tag) return null;
    let element = null, parent = el;
    let popup = function () {
      parent = parent.parentElement;
      if (!parent) return null;
      const tagParent = parent.tagName.toLocaleLowerCase();
      if (tagParent === tag) {
        element = parent;
      } else if (tagParent === "body") {
        element = null;
      } else {
        popup();
      }
    };

    popup();
    return element;
  },
  /**
   * 根据Ajax返回值获取TemplateStr
   * @param {string} templateText
   * @return {string}
   */
  getPageTemplateStrByAjaxStr(templateText) {
    let pageDom;
    templateText = templateText.trim();
    const pageElemRegex = new RegExp("(<[^>]+\\bct-data-role=[\"']?page[\"']?[^>]*>)");
    if (pageElemRegex.test(templateText)) {
      const strArr = templateText.split(/<\/?body[^>]*>/gmi);
      pageDom = $(((strArr || []).length === 0 ? "" : strArr.length > 1 ? strArr[1] : strArr[0]) || "")[0];
    }

    if (pageDom) {
      return pageDom.outerHTML;
    } else {
      return "";
    }
  },
  /**
   * 创建CtMobile
   * @param {object} config
   * @return {CtMobile}
   */
  create(config) {
    return new CtMobile(config);
  }
};

export default CtMobileFactory;