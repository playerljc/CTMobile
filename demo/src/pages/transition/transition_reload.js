import CtMobile from 'ctmobile';;

export default class extends CtMobile.Page {
	constructor(ctmobile, id) {
		super(ctmobile, id);
	}

  /**
   * @override
   */
	pageCreate() {
		const $backJO = this.getPageJO().find(" .goto");
		$backJO.on("click", () => {
			this.ctmobile.startPage("/static/html/common.html?pageId=common",{
				reload: true,
			});
		});
	}
}