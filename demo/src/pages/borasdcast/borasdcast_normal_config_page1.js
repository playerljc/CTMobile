import CtMobile from 'ctmobile';;

export default class extends CtMobile.Page {
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

  pageReceiver() {
    de
  }
}