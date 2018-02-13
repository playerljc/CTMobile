/**
 * Created by ctsjd on 2016/6/28 0028.
 * 指令管理类
 */
(function () {

  function create(Tool) {
    /**
     *
     * @type {Array}
     */
    var directive_plugins = [
      "com.chinact.angular.directive.ctLazyImageSrc",
      "com.chinact.angular.directive.ctLazyBackground",
      "com.chinact.angular.directive.ctSilderTop"
    ];

    return {
      /**
       * 注册所有angular的directives
       * @param angularApp angularApp对象
       * @param complete 等待所有插件注册完成之后的回调函数
       */
      register: function (angularApp, complete) {
        for (var i = 0, len = directive_plugins.length; i < len; i++) {
          (function (index) {
            try {
              Tool.namespace(directive_plugins[index])["register"](angularApp);
            } catch (e) {
              console.log(e);
            }
          })(i);
        }// end for

        if (complete) {
          complete();
        }
      }// end register
    };// end return
  }

  if (typeof define === "function" && (define.amd || define.cmd)) {
    define("AngularDirectiveManager", ["Tool"], function (Tool) {
      return create(Tool);
    });
  } else {
    window.AngularDirectiveManager = create(Tool);
  }

})();