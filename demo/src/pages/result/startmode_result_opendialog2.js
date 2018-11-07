import {Page} from "ctmobile/index";

export default class extends Page {
	constructor(ctmobile, id) {
		super(ctmobile, id);
	}

	pageCreate() {
		const $backAndResultJO = this.getPageJO().find(" .backAndResult");
		$backAndResultJO.on("click", () => {
			const request = this.getRequest();
			this.setResult(request.requestCode, {a: 1, b: 2});
			this.over();
		});
	}
}