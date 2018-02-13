index = (function ($, w) {

    function _$(id) {
        _$.__super__.constructor.call(this, id);
    }

    $.extend(_$.prototype, {
        pageCreate: function () {

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

        },
        pageResult: function (e, resuleCode, bundle) {
            console.log(resuleCode);
            console.dirxml(bundle)
        }
    });

    return _$;

})(jQuery, window);