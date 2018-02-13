result = (function ($, w) {

  function _$(id) {
    _$.__super__.constructor.call(this, id);
  }

  $.extend(_$.prototype, {
    pageCreate: function () {
      var param = CtMobile.getParameter();
      console.dirxml(param);
    },
    pageBeforeShow: function () {

    },
    pageShow: function () {

    },
    pageAfterShow: function () {

    },
    pageBeforePause: function () {

    },
    pageAfterPause: function () {

    },
    pageBeforeRestore: function () {

    },
    pageRestore: function () {

    },
    pageAfterRestore: function () {

    },
    pageBeforeDestroy: function () {

    },
    pageAfterDestroy: function () {

    }
  });

  return _$;

})(jQuery, window);