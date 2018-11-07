import {Page} from "ctmobile/index";

export default class extends Page {
	constructor(ctmobile, id) {
		super(ctmobile, id);
	}

	pageCreate() {
		const $pageContentJO = this.getPageJO().find(" .ct-content");
		const parameter = this.ctmobile.getParameter();
		$pageContentJO.text(JSON.stringify(parameter));
	}
}