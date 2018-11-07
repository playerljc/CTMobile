import Media from "../util/media";
import {CtMobileFactory} from "ctmobile/index";
import Router from "../util/Router";

class App {
	initial() {
		Media.init();
		this.initCtMobile();
	}

	initCtMobile() {
		this.ctmobile = CtMobileFactory.create({
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
