import {Page} from 'ctmobile/index';

export default class extends Page {
  constructor(ctmobile, id) {
    super(ctmobile, id);
  }

  pageCreate() {
    this.setRequest(this.getPageId(),{});
  }

  pageResult(e, resultCode, bundle) {
    console.log('resultCode', resultCode, 'bundle', JSON.stringify(bundle));
    alert(`resultCode:${resultCode}\r\nbundle:${JSON.stringify(bundle)}`);
  }
}