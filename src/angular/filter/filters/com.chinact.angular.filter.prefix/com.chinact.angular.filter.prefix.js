/**
 * Created by ctsjd on 15-5-21.
 * 给指定字符串加入前缀
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
        console.log("com.chinact.angular.filter.prefix");
        angularApp.filter("prefix", function () {
          return function (input, prefix) {
            return prefix + input;
          }
        });
      }
    });
  }

  if (typeof define === "function" && (define.amd || define.cmd)) {
    define("com.chinact.angular.filter.prefix", ["jquery", "Tool", "AngularFilter"], function ($, Tool, AngularFilter) {
      return create($, window, Tool, AngularFilter);
    });
  } else {
    Tool.namespace("com.chinact.angular.filter");
    window.com.chinact.angular.filter.prefix = create(jQuery, window, Tool, AngularFilter);
  }

})();
