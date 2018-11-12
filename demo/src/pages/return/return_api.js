import CtMobile from 'ctmobile';;

export default class extends CtMobile.Page {
	constructor(ctmobile, id) {
		super(ctmobile, id);
	}

  /**
   * @override
   */
	pageCreate() {
		const $backJO = this.getPageJO().find(" .ct-back-icon");
		$backJO.on("click", () => {
			this.getCtMobile().back();
		});
	}
}