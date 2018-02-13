/**
 * Created by ctsjd on 15-5-21.
 * 给指定字符串加入后缀
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
                console.log("com.chinact.angular.filter.suffix");
                angularApp.filter("suffix",function(){
                    return function(input,suffix){
                        return input + suffix;
                    }
                });
            }
        });
    }

    if(typeof define === "function" && (define.amd || define.cmd)) {
        define("com.chinact.angular.filter.suffix",["jquery","Tool","AngularFilter"],function($,Tool,AngularFilter){
            return create($,window,Tool,AngularFilter);
        });
    } else {
        Tool.namespace("com.chinact.angular.filter");
        window.com.chinact.angular.filter.suffix = create(jQuery,window,Tool,AngularFilter);
    }

})();
