/**
 * Created by ctsjd on 15-5-21.
 * 获取转场参数的服务
 */
(function(){

    function create(AngularService) {
        /**
         * 继承Angularservice
         */
        return $.extend(Object.create(AngularService),{
            /**
             * 注册
             * @param angularApp
             */
            register:function(angularApp){
                angularApp.factory("changPageParams",function(){
                    return function(property){
                        return module.app._changPageParams[property]
                    }
                });
            }
        });
    }

    if(typeof define === "function" &&(define.cmd || define.amd)) {
        define("com.chinact.angular.service.changPageParams",["AngularService"],function(AngularService){
            return create(AngularService);
        });
    } else {
        Tool.namespace("com.chinact.angular.service");
        window.com.chinact.angular.service.changPageParams = create(AngularService);
    }

})();