export default {
	init() {
		const docEl = document.documentElement, resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
			recalc = function () {
				const clientHeight = docEl.clientHeight;
				if (!clientHeight) return;
				docEl.style.fontSize = 20 * (clientHeight / 667) + "px";
			};

		if (!document.addEventListener) return;
		window.addEventListener(resizeEvt, recalc, false);
		document.addEventListener("DOMContentLoaded", recalc, false);
	}
};