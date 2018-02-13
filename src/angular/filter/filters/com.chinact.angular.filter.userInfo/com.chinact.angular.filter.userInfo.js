/**
 * Created by ctsjd on 15-5-21.
 * 获取用户的指定信息
 */
(function(){

    function create($,w,Tool,AngularFilter) {
        /**
         * 继承AngularFilter
         */
        return $.extend(Object.create(AngularFilter),{
            /**
             * 注册
             * @param angularApp
             */
            register:function(angularApp){
                angularApp.filter("userInfo",function(){
                    return function(input,property){
                        if(context.USEROBJ) {
                            return context.USEROBJ[property];
                        } else {
                            return "";
                        }
                    }
                });
            }
        });
    }

    if(typeof define === "function" && (define.amd || define.cmd)) {
        define("com.chinact.angular.filter.userInfo",["jquery","Tool","AngularFilter"],function($,Tool,AngularFilter){
            return create($,window,Tool,AngularFilter);
        });
    } else {
        Tool.namespace("com.chinact.angular.filter");
        window.com.chinact.angular.filter.userInfo = create(jQuery,window,Tool,AngularFilter);
    }

})();