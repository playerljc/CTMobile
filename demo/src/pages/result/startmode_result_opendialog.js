import CtMobile from 'ctmobile';

export default class extends CtMobile.Page {
	constructor(ctmobile, id) {
		super(ctmobile, id);
	}

  /**
   * @override
   */
	pageCreate() {
		const $backAndResultJO = this.getPageJO().find(" .backAndResult");
		$backAndResultJO.on("click", () => {
			const request = this.getRequest();
			this.setResult(request.requestCode, {a: 1, b: 2});
			this.over();
		});
	}
}