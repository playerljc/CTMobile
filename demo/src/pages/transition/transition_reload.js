import {Page} from "ctmobile/index";

export default class extends Page {
	constructor(ctmobile, id) {
		super(ctmobile, id);
	}

	pageCreate() {
		const $backJO = this.getPageJO().find(" .goto");
		$backJO.on("click", () => {
			this.ctmobile.startPage("/static/html/common.html?pageId=common",{
				reload: true,
			});
		});
	}
}