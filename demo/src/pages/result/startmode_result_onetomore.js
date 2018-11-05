import {Page} from 'ctmobile/index';

export default class extends Page {
  constructor(ctmobile, id) {
    super(ctmobile, id);
  }

  pageCreate() {
    const $opendialogJO = this.getPageJO().find(' .opendialog');
    $opendialogJO.on('click', () => {
      this.setRequest('startmode_result_opendialog');
      this.getCtMobile().startPage('/static/html/startmode_result_opendialog.html?pageId=startmode_result_opendialog');
    });

    const $opendialog2JO = this.getPageJO().find(' .opendialog2');
    $opendialog2JO.on('click', () => {
      this.setRequest('startmode_result_opendialog2');
      this.getCtMobile().startPage('/static/html/startmode_result_opendialog2.html?pageId=startmode_result_opendialog2');
    });
  }

  pageResult(e, resultCode, bundle) {
    console.log('resultCode', resultCode, 'bundle', JSON.stringify(bundle));
    alert(`resultCode:${resultCode}\r\nbundle:${JSON.stringify(bundle)}`);
  }
}