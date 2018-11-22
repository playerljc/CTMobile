import CtMobile from 'ctmobile';;
export default class extends CtMobile.Page {
  constructor(ctmobile, id) {
    super(ctmobile, id);
  }

  onRegisterReceiver(intent) {
    alert(JSON.stringify(intent));
  }

  /**
   * @override
   */
  pageCreate() {
    this.onRegisterReceiver = this.onRegisterReceiver.bind(this);

    // 注册borasdcast
    this.ctmobile.registerReceiver({
      el: this.getPageDOM(),
      action: 'borasdcast_normal_api',
      priority: 1,
      categorys: []
    }, this.onRegisterReceiver);

    this.getPageJO().find(' .trigger').on('click', () => {
      this.ctmobile.sendBroadcast({
        action: 'borasdcast_normal_api',
        categorys: [],
        bundle: {
          a: 3,
          b: 4
        }
      });
    });
  }
}