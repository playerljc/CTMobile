/**
 * Created by ctsjd on 15-5-21.
 * image标签延迟加载图片
 */
(function(){

    function create($,w,AngularDirective) {
        /**
         * 继承AngularDirective
         */
        return $.extend(Object.create(AngularDirective),{
            /**
             * 注册
             * @param angularApp
             */
            register:function(angularApp){
                console.log("com.chinact.angular.directive.ctLazyImageSrc");
                angularApp.directive(
                    "ctLazyImgSrc",
                    function () {
                        return {
                            restrict: "A",
                            link: function (scope, element, attrs) {

                                var defaultSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC";
                                if(attrs.default) {
                                    defaultSrc = attrs.default;
                                }

                                element.attr("src",defaultSrc);
                                setTimeout(function(){
                                    element.attr("src",attrs.targetsrc);
                                },300);
                            }
                        }
                    }
                );
            }
        });
    }

    if(typeof define === "function" && (define.amd || define.cmd)) {
        define("com.chinact.angular.directive.ctLazyImageSrc",["jquery","AngularDirective"],function($,AngularDirective){
            return create($,window,AngularDirective);
        });
    } else {
        Tool.namespace("com.chinact.angular.directive");
        window.com.chinact.angular.directive.ctLazyImageSrc = create(jQuery,window,AngularDirective);
    }

})();
