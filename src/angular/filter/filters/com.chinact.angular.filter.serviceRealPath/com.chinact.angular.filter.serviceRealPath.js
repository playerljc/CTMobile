/**
 * Created by ctsjd on 15-5-21.
 * 给指定路径加上中间件的前缀
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
        angularApp.filter("serviceRealPath", function () {
          return function (input) {
            return context.serviceRealPath + Tool.hexToDec(input);
          }
        });
      }
    });
  }

  if (typeof define === "function" && (define.amd || define.cmd)) {
    define("com.chinact.angular.filter.serviceRealPath", ["jquery", "Tool", "AngularFilter"], function ($, Tool, AngularFilter) {
      return create($, window, Tool, AngularFilter);
    });
  } else {
    Tool.namespace("com.chinact.angular.filter");
    window.com.chinact.angular.filter.serviceRealPath = create(jQuery, window, Tool, AngularFilter);
  }

})();
