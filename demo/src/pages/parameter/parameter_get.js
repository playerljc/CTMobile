import CtMobile from 'ctmobile';;

export default class extends CtMobile.Page {
	constructor(ctmobile, id) {
		super(ctmobile, id);
	}

	pageCreate() {
		const $pageContentJO = this.getPageJO().find(" .ct-content");
		const parameter = this.ctmobile.getParameter();
		$pageContentJO.text(JSON.stringify(parameter));
	}
}