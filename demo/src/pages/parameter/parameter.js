import CtMobile from 'ctmobile';;

export default class extends CtMobile.Page {
	constructor(ctmobile, id) {
		super(ctmobile, id);
	}

	pageCreate() {
		debugger;
		const $parameter_armJO = this.getPageJO().find(" .parameter_arm");
		$parameter_armJO.on("click", () => {
			debugger;
			this.setRequest(this.getPageId(),{a:1,b:2});
			this.ctmobile.startPage("/static/html/parameter_arm.html?pageId=parameter_arm");
		});
	}
}