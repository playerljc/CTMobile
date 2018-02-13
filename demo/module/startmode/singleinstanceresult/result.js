result = (function ($, w) {

    function _$(id) {
        _$.__super__.constructor.call(this, id);
    }

    $.extend(_$.prototype, {
        pageCreate: function () {
            var _self = this;
            this.getPageJO().find(".back").on("click", function () {
                _self.setResult("code1", {a: 1, b: 2});
                _self.over();
            });
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