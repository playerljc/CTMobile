/**
 * Created by ctsjd on 15-5-21.
 * 给指定路径加上工程的上下文路径
 */
(function () {

  function create($, w, Tool, AngularFilter) {
    /**
     * 继承AngularFilter
     */
    return $.extend(Object.create(AngularFilter), {
      /**
       * 注册
       * @param angularApp
       */
      register: function (angularApp) {
        angularApp.filter("contextRealPath", function () {
          return function (input) {
            return context.contextRealPath + Tool.hexToDec(input);
          }
        });
      }
    });
  }

  if (typeof define === "function" && (define.amd || define.cmd)) {
    define("com.chinact.angular.filter.contextRealPath", ["jquery", "Tool", "AngularFilter"], function ($, Tool) {
      return create($, window, Tool, AngularFilter);
    });
  } else {
    Tool.namespace("com.chinact.angular.filter");
    window.com.chinact.angular.filter.contextRealPath = create(jQuery, window, Tool, AngularFilter);
  }
})();
