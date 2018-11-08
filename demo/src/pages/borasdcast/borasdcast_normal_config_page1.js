import {Page} from "ctmobile/index";

export default class extends Page {
  constructor(ctmobile, id) {
    super(ctmobile, id);
  }

  pageCreate() {
    this.getPageJO().find(' .trigger').on('click', () => {
      this.ctmobile.sendBroadcast({
        action: 'borasdcast_normal_config',
        categorys: [],
        bundle: {
          a: 1,
          b: 2
        }
      });
    });
  }

  pageReceiver(intent) {
    alert(JSON.stringify(intent));
  }
}