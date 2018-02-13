/**
 * Created by ctsjd on 15-5-21.
 * 给GET请求路径加上参数前缀?1=1
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
        angularApp.filter("setParameterPrefix", function () {
          return function (input) {
            if (!input) return "";

            if (input.indexOf("?") == -1) {
              return input + "?1=1";
            } else {
              return input;
            }
          }
        });
      }
    });
  }

  if (typeof define === "function" && (define.amd || define.cmd)) {
    define("com.chinact.angular.filter.setParameterPrefix", ["jquery", "Tool", "AngularFilter"], function ($, Tool, AngularFilter) {
      return create($, window, Tool, AngularFilter);
    });
  } else {
    Tool.namespace("com.chinact.angular.filter");
    window.com.chinact.angular.filter.setParameterPrefix = create(jQuery, window, Tool, AngularFilter);
  }

})();