import CtMobile from 'ctmobile';;

export default class extends CtMobile.Page {
  constructor(ctmobile, id) {
    super(ctmobile, id);
  }

  /**
   * @override
   */
  pageReceiver(intent, nextOpt) {
    alert(JSON.stringify(intent));
    nextOpt.putExtras({
      ext2: 'ext2',
    });
    nextOpt.next();
  }

  /**
   * @override
   */
  pageCreate() {
    this.getPageJO().find(' .trigger').on('click', () => {
      this.ctmobile.sendOrderedBroadcast({
        action: 'borasdcast_order_config',
        categorys: [],
        bundle: {
          a: 3,
          b: 4
        }
      });
    });
  }
}