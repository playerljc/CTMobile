/**
 * service
 * @type {{}}
 */
(function () {

  function create() {
    return {};
  }

  if (typeof define === "function" && (define.cmd || define.amd)) {
    define("AngularService", function () {
      return create();
    });
  } else {
    window.AngularService = create();
  }

})();