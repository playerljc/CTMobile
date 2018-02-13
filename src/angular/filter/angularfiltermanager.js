/**
 * Created by ctsjd on 15-5-20.
 * 过滤器管理类
 */
(function () {

  function create(Tool) {
    var filter_plugins = [
      "com.chinact.angular.filter.hexToDec",
      "com.chinact.angular.filter.decToHex",
      "com.chinact.angular.filter.suffix",
      "com.chinact.angular.filter.prefix"/*,
             "com.chinact.angular.filter.setParameterPrefix"*/
      //"com.chinact.angular.filter.contextRealPath",
      //"com.chinact.angular.filter.userInfo",
      //"com.chinact.angular.filter.serviceRealPath",
    ];

    return {
      /**
       * 注册所有angular的filters
       * @param angularApp angularApp对象
       * @param complete 待所有插件注册完成之后的回调函数
       */
      register: function (angularApp, complete) {
        for (var i = 0, len = filter_plugins.length; i < len; i++) {
          (function (index) {
            try {
              Tool.namespace(filter_plugins[index])["register"](angularApp);
            } catch (e) {
              console.log(e);
            }
          })(i);
        }// end for

        if (complete) {
          complete();
        }
      }// end register
    }// end return
  }

  if (typeof define === "function" && (define.amd || define.cmd)) {
    define("AngularFilterManager", ["Tool"], function (Tool) {
      return create(Tool);
    });
  } else {
    window.AngularFilterManager = create(Tool);
  }

})();