/**
 * Created by ctsjd on 15-5-20.
 * 服务管理类
 */
(function(){

    function create(Tool) {
        var service_plugins = [
            //"com.chinact.angular.service.changPageParams",
        ];

        return{
            /**
             * 注册所有angular的services
             * @param angularApp angularApp对象
             * @param complete 待所有插件注册完成之后的回调函数
             */
            register:function(angularApp,complete){
                for (var i = 0,len = service_plugins.length; i < len; i++) {
                    (function (index) {
                        Tool.namespace(service_plugins[index])["register"](angularApp);
                    })(i);
                }// end for

                if(complete) {
                    complete();
                }
            }// end register
        }// end return
    }

    if(typeof define === "function" && (define.cmd || define.amd)) {
        define("AngularServiceManager",["Tool"],function(Tool){
            return create(Tool);
        });
    } else {
        window.AngularServiceManager = create(Tool);
    }

})();