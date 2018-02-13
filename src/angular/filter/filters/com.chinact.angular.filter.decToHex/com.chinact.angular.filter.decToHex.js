/**
 * Created by ctsjd on 15-5-21.
 * unicode编码
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
                console.log("com.chinact.angular.filter.decToHex");
                angularApp.filter("decToHex",function(){
                    return function(input){
                        return Tool.decToHex(input);
                    }
                });
            }
        });
    }

    if(typeof define === "function" && (define.amd || define.cmd)) {
        define("com.chinact.angular.filter.decToHex",["jquery","Tool","AngularFilter"],function($,Tool,AngularFilter){
            return create($,window,Tool,AngularFilter);
        });
    } else {
        Tool.namespace("com.chinact.angular.filter");
        window.com.chinact.angular.filter.decToHex = create(jQuery,window,Tool,AngularFilter);
    }

})();
