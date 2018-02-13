/**
 * filter
 * @type {{}}
 */
(function () {

  function create() {
    return {};
  }

  if (typeof define === "function" && (define.amd || define.cmd)) {
    define("AngularFilter", function () {
      return create();
    });
  } else {
    window.AngularFilter = create();
  }

})();