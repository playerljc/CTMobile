export default {
	index: {
		url: "/static/html/index.html",
		component: import(/* webpackChunkName: "index" */ "../pages/index"),
	},
	info: {
		url: "/static/html/info.html",
		component: import(/* webpackChunkName: "info" */ "../pages/info"),
	},
	about: {
		url: "/static/html/about.html",
		component: import(/* webpackChunkName: "about" */ "../pages/about"),
	},


	//开发模式
	devmode: {
		url: "/static/html/devmode.html",
	},
	devmode_ajax: {
		url: "/static/html/devmode_ajax.html",
	},
	devmode_ajax_base_page1: {
		url: "/static/html/devmode_ajax_base_page1.html",
	},
	devmode_ajax_base_page2: {
		url: "/static/html/devmode_ajax_base_page2.html",
	},

	devmode_ajax_preload: {
		url: "/static/html/devmode_ajax_preload.html",
	},

	devmode_ajax_preload_init_page1: {
		url: "/static/html/devmode_ajax_preload_init_page1.html",
	},
	devmode_ajax_preload_init_page2: {
		url: "/static/html/devmode_ajax_preload_init_page2.html",
	},
	devmode_ajax_preload_init_page3: {
		url: "/static/html/devmode_ajax_preload_init_page3.html",
	},

	devmode_ajax_preload_dynamic: {
		url: "/static/html/devmode_ajax_preload_dynamic.html",
	},
	devmode_ajax_preload_dynamic1: {
		url: "/static/html/devmode_ajax_preload_dynamic1.html",
	},
	devmode_ajax_preload_dynamic2: {
		url: "/static/html/devmode_ajax_preload_dynamic2.html",
	},
	devmode_ajax_preload_dynamic3: {
		url: "/static/html/devmode_ajax_preload_dynamic3.html",
	},
	devmode_useDefaultPage: {
		url: "/static/html/devmode_useDefaultPage.html",
	},


	//返回
	"return": {
		url: "/static/html/return.html",
	},
	"return_config": {
		url: "/static/html/return_config.html",
	},
	"return_api": {
		url: "/static/html/return_api.html",
		component: import(/* webpackChunkName: "return" */ "../pages/return/return_api"),
	},

	// 启动模式
	startmode: {
		url: "/static/html/startmode.html",
	},
	startmode_standard: {
		url: "/static/html/startmode_standard.html"
	},
	startmode_single: {
		url: "/static/html/startmode_single.html"
	},
	startmode_single_page1: {
		url: "/static/html/startmode_single_page1.html"
	},
	startmode_single_page2: {
		url: "/static/html/startmode_single_page2.html"
	},
	startmode_single_page3: {
		url: "/static/html/startmode_single_page3.html"
	},

	startmode_singleInstance: {
		url: "/static/html/startmode_singleInstance.html",
	},
	startmode_singleInstance_page1: {
		url: "/static/html/startmode_singleInstance_page1.html"
	},
	startmode_singleInstance_page2: {
		url: "/static/html/startmode_singleInstance_page2.html"
	},
	startmode_singleInstance_page3: {
		url: "/static/html/startmode_singleInstance_page3.html"
	},

	startmode_result: {
		url: "/static/html/startmode_result.html",
	},
	startmode_result_moretoone: {
		url: "/static/html/startmode_result_moretoone.html",
	},
	startmode_result_moretoone_page1: {
		url: "/static/html/startmode_result_moretoone_page1.html",
		component: import(/* webpackChunkName: "result" */ "../pages/result/startmode_result_moretoone_page1"),
	},
	startmode_result_moretoone_page2: {
		url: "/static/html/startmode_result_moretoone_page2.html",
		component: import(/* webpackChunkName: "result" */ "../pages/result/startmode_result_moretoone_page2"),
	},


	startmode_result_onetomore: {
		url: "/static/html/startmode_result_onetomore.html",
		component: import(/* webpackChunkName: "result" */ "../pages/result/startmode_result_onetomore"),
	},
	startmode_result_opendialog: {
		url: "/static/html/startmode_result_opendialog.html",
		component: import(/* webpackChunkName: "result" */ "../pages/result/startmode_result_opendialog"),
	},
	startmode_result_opendialog2: {
		url: "/static/html/startmode_result_opendialog2.html",
		component: import(/* webpackChunkName: "result" */ "../pages/result/startmode_result_opendialog2"),
	},


	startmode_singleInstanceResult: {
		url: "/static/html/startmode_singleInstanceResult.html",
		component: import(/* webpackChunkName: "result" */ "../pages/result/startmode_singleInstanceResult"),
	},
	startmode_singleInstanceResult_opendialog: {
		url: "/static/html/startmode_singleInstanceResult_opendialog.html",
		component: import(/* webpackChunkName: "result" */ "../pages/result/startmode_singleInstanceResult_opendialog"),
	},


	// 界面传递参数
	parameter: {
		url: "/static/html/parameter.html",
		component: import(/* webpackChunkName: "parameter" */ "../pages/parameter/parameter")
	},
	parameter_get: {
		url: "/static/html/parameter_get.html",
		component: import(/* webpackChunkName: "parameter" */ "../pages/parameter/parameter_get"),
	},
	parameter_arm: {
		url: "/static/html/parameter_arm.html",
		component: import(/* webpackChunkName: "parameter" */ "../pages/parameter/parameter_arm"),
	},



	// startmode_result_onetomore: {
	//   url: '/static/html/startmode_result_onetomore.html',
	//   component: import(/* webpackChunkName: "return" */ '../pages/result/startmode_result_onetomore'),
	// },

	// 广播
	borasdcast: {
		url: "/static/html/borasdcast.html",
	},
	// 界面转场
	transition: {
		url: "/static/html/transition.html",
	},
	transition_noreload: {
		url: "/static/html/transition_noreload.html",
		component: import(/* webpackChunkName: "transition" */ "../pages/transition/transition_noreload"),
	},
	transition_reload: {
		url: "/static/html/transition_reload.html",
		component: import(/* webpackChunkName: "transition" */ "../pages/transition/transition_reload"),
	},
	transition_mode: {
		url: "/static/html/transition_mode.html",
	},




  transition_mode_slideleft: {
    url: "/static/html/transition_mode_slideleft.html",
  },
  transition_mode_slideright: {
    url: "/static/html/transition_mode_slideright.html",
  },
  transition_mode_slideup: {
    url: "/static/html/transition_mode_slideup.html",
  },
  transition_mode_slidedown: {
    url: "/static/html/transition_mode_slidedown.html",
  },
  transition_mode_wxslideleft: {
    url: "/static/html/transition_mode_wxslideleft.html",
  },
  transition_mode_wxslideright: {
    url: "/static/html/transition_mode_wxslideright.html",
  },
  transition_mode_wxslideup: {
    url: "/static/html/transition_mode_wxslideup.html",
  },
  transition_mode_wxslidedown: {
    url: "/static/html/transition_mode_wxslidedown.html",
  },
  transition_mode_pushslideleft: {
    url: "/static/html/transition_mode_pushslideleft.html",
  },

  transition_mode_pushslideright: {
    url: "/static/html/transition_mode_pushslideright.html",
  },
  transition_mode_pushslideup: {
    url: "/static/html/transition_mode_pushslideup.html",
  },
  transition_mode_pushslidedow: {
    url: "/static/html/transition_mode_pushslidedow.html",
  },
  transition_mode_material: {
    url: "/static/html/transition_mode_material.html",
  },






	// commmon
	common: {
		url: "/static/html/common.html",
	}
};