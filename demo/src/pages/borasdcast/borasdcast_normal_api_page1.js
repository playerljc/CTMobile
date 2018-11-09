// import CtMobile from 'ctmobile';;
import CtMobile from 'ctmobile';

export default class extends CtMobile.Page {
  constructor(ctmobile, id) {
    super(ctmobile, id);
  }

  onRegisterReceiver(intent) {
    alert(JSON.stringify(intent));
  }

  pageCreate() {
    this.onRegisterReceiver = this.onRegisterReceiver.bind(this);

    // 注册borasdcast
    this.ctmobile.registerReceiver({

      action: 'borasdcast_normal_api',
      priority: 0,
      categorys: []
    }, this.onRegisterReceiver,);

    this.getPageJO().find(' .trigger').on('click', () => {
      this.ctmobile.sendBroadcast({
        action: 'borasdcast_normal_api',
        categorys: [],
        bundle: {
          a: 1,
          b: 2
        }
      });
    });
  }

  pageBeforeDestroy() {
    this.ctmobile.unregisterReceiver('borasdcast_normal_api', this.onRegisterReceiver);
  }
}