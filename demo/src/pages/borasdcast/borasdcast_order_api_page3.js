import CtMobile from 'ctmobile';;

export default class extends CtMobile.Page {
  constructor(ctmobile, id) {
    super(ctmobile, id);
  }

  onRegisterReceiver(intent, nextOpt) {
    alert(JSON.stringify(intent));
    nextOpt.putExtras({
      ext3: 'ext3',
    });
    nextOpt.next();
  }

  /**
   * @override
   */
  pageCreate() {
    this.onRegisterReceiver = this.onRegisterReceiver.bind(this);

    // 注册borasdcast
    this.ctmobile.registerReceiver({
      el: this.getPageDOM(),
      action: 'borasdcast_order_api',
      priority: 2,
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