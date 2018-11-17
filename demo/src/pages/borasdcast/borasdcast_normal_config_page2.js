import CtMobile from 'ctmobile';;

export default class extends CtMobile.Page {
  constructor(ctmobile, id) {
    super(ctmobile, id);
  }

  /**
   * @override
   */
  pageCreate() {
    this.getPageJO().find(' .trigger').on('click', () => {
      this.ctmobile.sendBroadcast({
        action: 'borasdcast_normal_config',
        categorys: [],
        bundle: {
          a: 3,
          b: 4
        }
      });
    });
  }

  /**
   * @override
   */
  pageReceiver(intent) {
    alert(JSON.stringify(intent));
  }
}