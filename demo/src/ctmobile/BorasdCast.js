/**
 * Created by lzq on 2018/11/02
 * BorasdCast.js
 */

/**
 * 找到符合intent的receiver的集合
 * @param intent
 */
function getReceiverByIntent(intent) {
  let receiver = [];
  for (let i = 0, len = this.receiverModel.length; i < len; i++) {
    if (this.receiverModel[i].action === intent.action &&
      this.receiverModel[i].categorys.length === intent.categorys.length) {

      let flag = true;
      for (let j = 0; j < intent.categorys.length; j++) {
        if (this.receiverModel[i].categorys.indexOf(intent.categorys[j]) === -1) {
          flag = false;
          break;
        }
      }
      if (flag) {
        receiver.push(this.receiverModel[i]);
      }
    }// end if
  }
  return receiver;
}

export default class {
  constructor() {
    Object.assign(this, {
      /**
       * Receiver Model 用来存储Receivers
       * {
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
   * 执行Receiver通过Id
   * @param id
   * @param jsonStr
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
   * @params handler [Function] receiver执行的handler
   * @params intentFilter [Object]
   * {
   *    action:[string] action
   *    priority:[number] 优先级
   *    categorys:[array] 分类
   * }
   */
  registerReceiver(handler, intentFilter) {
    if (!handler || !intentFilter || !intentFilter.action) return;

    const receiver = {
      action: intentFilter.action,
      categorys: intentFilter.categorys || [],
      handler: handler,
      priority: intentFilter.priority || 0
    };

    this.receiverModel.push(receiver);

    /**
     * 按照priority进行排序
     */
    this.receiverModel.sort(function (o1, o2) {
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
  }

  /**
   * 解除注册Receiver对象
   * @params handler
   */
  unregisterReceiver(handler) {
    if (handler) {
      let flag = false;
      while (true) {
        for (let i = 0, len = this.receiverModel.length; i < len; i++) {
          if (this.receiverModel[i].handler === handler) {
            this.receiverModel.splice(i, 1);
            flag = true;
            break;
          }
        }
        if (!flag || this.receiverModel.length === 0) break;
      }
    }
  }

  /**
   * 发送无序广播
   * @param intent
   * {
   *    action:[string] action
   *    categorys:[array] 分类
   *    bundle:Object 参数
   * }
   */
  sendBroadcast(intent) {
    if (intent) {
      let receivers = getReceiverByIntent(intent);
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
   * @param intent
   * {
   *    action:[string] action
   *    categorys:[array] 分类
   *    bundle:Object 参数
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
      let receivers = getReceiverByIntent(intent);
      receivers = [].concat(receivers);
      args.bundles.push(intent.bundle || {});
      transfer(receivers, args);
    }

    /**
     * 传递
     * @param receivers
     */
    function transfer(receivers) {
      if (receivers.length === 0) return;
      const receiver = receivers.shift();
      if (receiver) {
        no++;
        lock = true;
        receiver.handler(args, {
          /**
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
           * @param bundle
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