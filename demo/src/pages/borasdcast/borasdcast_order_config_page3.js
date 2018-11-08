import {Page} from "ctmobile/index";

export default class extends Page {
  constructor(ctmobile, id) {
    super(ctmobile, id);
  }

  pageReceiver(intent, nextOpt) {
    alert(JSON.stringify(intent));
    nextOpt.putExtras({
      ext3: 'ext3',
    });
    nextOpt.next();
  }

  pageCreate() {
    this.getPageJO().find(' .trigger').on('click', () => {
      this.ctmobile.sendOrderedBroadcast({
        action: 'borasdcast_order_config',
        categorys: [],
        bundle: {
          a: 5,
          b: 6
        }
      });
    });
  }
}