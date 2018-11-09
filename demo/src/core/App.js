import Media from "../util/media";
import CtMobile from "ctmobile";
import Router from "../util/Router";

class App {
	initial() {
		Media.init();
		this.initCtMobile();
	}

	initCtMobile() {
		this.ctmobile = CtMobile.CtMobileFactory.create({
			supportCordova: false,
			linkCaptureReload: false,
			router: Router,
		});
	}

	getCtMobile() {
		return this.ctmobile;
	}
}

const ins = new App();

export default ins;
