import {Page} from 'ctmobile/index';

export default class extends Page {
  constructor(ctmobile, id) {
    super(ctmobile, id);
  }

  pageCreate() {
    const $backJO = this.getPageJO().find(' .ct-back-icon');
    $backJO.on('click', () => {
      this.getCtMobile().back();
    });
  }
}