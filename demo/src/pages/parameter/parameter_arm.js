import CtMobile from 'ctmobile';;

export default class extends CtMobile.Page {
	constructor(ctmobile, id) {
		super(ctmobile, id);
	}

	pageAfterShow() {
		const parameter = JSON.stringify(this.getRequest());
		const $pageContentJO = this.getPageJO().find(" .ct-content");
		$pageContentJO.text(parameter);
	}
}