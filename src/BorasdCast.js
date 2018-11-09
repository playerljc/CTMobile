/***
 * Created by lzq on 2018/11/02
 * BorasdCast.js
 */

/**
 * 找到符合intent的receiver的集合
 * @access private
 * @param intent
 */
function getReceiverByIntent(intent) {
  let receivers = [];

  for (let i = 0, len = this.receiverModel.length; i < len; i++) {
    let receiver = this.receiverModel[i];
    if (
      receiver.action === intent.action &&
      receiver.categorys.length === intent.categorys.length) {

      let flag = true;
      for (let j = 0; j < intent.categorys.length; j++) {
        if (receiver.categorys.indexOf(intent.categorys[j]) === -1) {
          flag = false;
          break;
        }
      }
      if (flag) {
        receivers.push(receiver);
      }
    }// end if
  }
  return receivers;
}

/**
 * BorasdCast 广播
 * @class
 */
export default class {

  /**
   * BorasdCastConstructor
   * @access public
   * @constructor
   */
  constructor() {
    Object.assign(this, {
      /***
       * Receiver Model 用来存储Receivers
       * {
       *   el: [HtmlElement] 页面的dom
       *   action:[string] 标识
       *   categorys:[array] 分类
       *   priority:[number] 优先级
       *   handler:[Function] 执行方法
       * }
       */
      receiverModel: [],
    });
  }

  /**
   * 执行Receiver通过id
   * @access public
   * @param {string} id - id.
   * @param {string} jsonStr - 参数
   */
  executeReceiverById(id, jsonStr) {
    for (let i = 0, len = this.receiverModel.length; i < len; i++) {
      const receiver = this.receiverModel[i];
      if (receiver.innerReceiverId === id) {
        if (receiver.handler) {
          receiver.handler(jsonStr);
        }
      }
    }
  }

  /**
   * 注册Receiver对象
   * @access public
   * @params {Object} intentFilter  -
   * {
   *    el:HtmlElement
   *    action:[string] action
   *    priority:[number] 优先级
   *    categorys:[array] 分类
   * }
   * @params {Function} handler - receiver执行的handler
   */
  registerReceiver(intentFilter, handler) {
    if (!handler || !intentFilter || !intentFilter.action || !intentFilter.el) return;

    this.receiverModel.push({
      el: intentFilter.el,
      action: intentFilter.action,
      categorys: intentFilter.categorys || [],
      handler: handler,
      priority: intentFilter.priority || 0
    });
  }

  /**
   * 解除注册Receiver对象
   * @access public
   * @param {string} action
   * @params {Function} handler
   */
  unregisterReceiver(action, handler) {
    if (!action || !handler) return;
    let index = 0;
    while (index < this.receiverModel.length) {
      const receiver = this.receiverModel[index];
      if (receiver.action === action && receiver.handler === handler) {
        this.receiverModel.splice(index, 1);
        index = 0;
      } else {
        index++;
      }
    }
  }

  /**
   * 接触注册Receiver通过page中的Dom
   * @access public
   * @param {HtmlElement} el
   */
  unregisterReceiverByDom(el) {
    if (!el) return;
    let index = 0;
    while (index < this.receiverModel.length) {
      const receiver = this.receiverModel[index];
      if (receiver.el === el) {
        this.receiverModel.splice(index, 1);
        index = 0;
      } else {
        index++;
      }
    }
  }

  /**
   * 发送无序广播
   * @access public
   * @param {Object} intent -
   * {
   *    action:{string} action
   *    categorys:{Array} 分类
   *    bundle:{Object} 参数
   * }
   */
  sendBroadcast(intent) {
    if (intent) {
      let receivers = getReceiverByIntent.call(this, intent);
      receivers = [].concat(receivers);
      for (let i = 0, len = receivers.length; i < len; i++) {
        if (receivers[i].handler) {
          receivers[i].handler(Object.assign({}, intent));
        }
      }
    }
  }

  /**
   * 发送有序广播
   * @access public
   * @param {Object} intent -
   * {
   *    action:{string} action
   *    categorys:{Array} 分类
   *    bundle:{Object} 参数
   * }
   */
  sendOrderedBroadcast(intent) {
    let no = 0;
    let lock = false;
    const args = {
      action: intent.action,
      categorys: intent.categorys || [],
      bundles: []
    };

    if (intent) {
      let receivers = getReceiverByIntent.call(this, intent);
      receivers = [].concat(receivers);

      /***
       * 按照priority进行排序
       */
      receivers.sort(function (o1, o2) {
        const priority1 = o1.priority || 0;
        const priority2 = o2.priority || 0;
        if (priority1 < priority2) {
          return 1;
        } else if (priority1 > priority2) {
          return -1;
        } else {
          return 0;
        }
      });

      args.bundles.push(intent.bundle || {});
      transfer(receivers, args);
    }

    /**
     * 传递
     * @access private
     * @param {Array} receivers
     */
    function transfer(receivers) {
      if (receivers.length === 0) return;
      const receiver = receivers.shift();
      if (receiver) {
        no++;
        lock = true;
        receiver.handler(args, {
          /**
           * @access private
           * 继续传递
           */
          next() {
            lock = false;
            if (args.bundles.length !== no + 1) {
              args.bundles.push({});
            }
            transfer(receivers);
          },
          /**
           * 传递参数
           * @access private
           * @param {Object} bundle
           */
          putExtras(bundle) {
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