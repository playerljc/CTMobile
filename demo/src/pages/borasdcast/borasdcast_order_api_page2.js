import {Page} from "ctmobile/index";

export default class extends Page {
  constructor(ctmobile, id) {
    super(ctmobile, id);
  }

  onRegisterReceiver(intent, nextOpt) {
    alert(JSON.stringify(intent));
    nextOpt.putExtras({
      ext2: 'ext2',
    });
    nextOpt.next();
  }

  pageCreate() {
    this.onRegisterReceiver = this.onRegisterReceiver.bind(this);

    // 注册borasdcast
    this.ctmobile.registerReceiver({
      el: this.getPageDOM(),
      action: 'borasdcast_order_api',
      priority: 1,
      categorys: []
    }, this.onRegisterReceiver);

    this.getPageJO().find(' .trigger').on('click', () => {
      this.ctmobile.sendOrderedBroadcast({
        action: 'borasdcast_order_api',
        categorys: [],
        bundle: {
          a: 1,
          b: 2
        }
      });
    });
  }
}