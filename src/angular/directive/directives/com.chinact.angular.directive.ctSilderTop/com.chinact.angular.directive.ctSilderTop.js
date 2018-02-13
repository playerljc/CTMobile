/**
 * Created by ctsjd on 15-5-21.
 * 可以滑动的轮播
 */
(function(){

    function create($,w,AngularDirective,Tool,Swipe) {

        var topHeightScale = 18/71;

        var template =
            '<div class="ct-slide">'+
            '    <ul>'+
            '        <li ng-repeat="n in tops">'+
            '            <a ng-click="intoAction($index)">'+
            '                <img targetSrc="{{n.targetPos | hexToDec}}" width="100%" ct-lazy-img-src>'+
            '            </a>'+
            '            <span class="ct-slide-title" ng-bind="n.title | hexToDec"></span>'+
            '        </li>'+
            '    </ul>'+
            '    <ol>'+
            '        <li ng-if="tops.length > 1" ng-repeat="n in tops" ng-class="{true: \'on\', false: \'\'}[$index == 0]"></li>'+
            '    </ol>'+
            '</div>';

        /**
         * 继承AngularDirective
         */
        var instance = $.extend(Object.create(AngularDirective),{
            /**
             * 注册
             * @param angularApp
             */
            register:function(angularApp){

                console.log("com.chinact.angular.directive.ctSilderTop");

                var _self = this;

                angularApp.directive("ctSilderTop",function(){
                    return {
                        restrict:"A",
                        replace:true,
                        scope:{
                            tops:"=tops",
                            onIntoAction:"&"
                        },
                        template:template,
                        /**
                         * 链接函数
                         * @param scope
                         * @param element
                         * @param attrs
                         * {
                         *    speed:number 轮播时间
                         *    auto:[true|false] 是否自动播放
                         *  }
                         */
                        link:function(scope,element,attrs){

                            /**
                             * 监听tops数据模型的变化
                             */
                            scope.$watch("tops",function(){
                                if(!scope.tops || scope.tops.result) {
                                    return;
                                }
                                var height = $(document.body).outerHeight();
                                var topHeight = Tool.getSizeByScale(topHeightScale,height);
                                scope.height = topHeight;
                                element.height(parseInt(scope.height));

                                /**
                                 * 配置
                                 * @type
                                 * {
                                 *  auto:boolean,
                                 *  speed:number,
                                 *  afterCallback:Function
                                 *  }
                                 */
                                var config = {
                                    afterCallback: function(index,el){
                                        element.find(" > ol > li").removeClass("on");
                                        element.find(" > ol > li:eq("+index+")").addClass("on");
                                    }
                                };

                                if(attrs.auto && Boolean(attrs.auto)) {
                                    config.auto = true;
                                }

                                if(attrs.speed) {
                                    config.speed = attrs.speed;
                                }

                                var swipe = Swipe(element[0],config);
                                element.find("ol li").removeClass("on").eq(0).addClass("on");
                                _self.addInstance(element[0],swipe);
                            });

                            /**
                             * Action
                             */
                            scope.intoAction = function(index) {
                                var item = scope.tops[index];
                                var swipe = _self.getInstance(element[0]);
                                swipe.changeItem = item;
                                scope.onIntoAction();
                            }

                        }
                    }
                });
            },// end register
            slide:function(dom,index){
                this.getInstance(dom).slide(index);
            },
            getPos:function(dom){
                return this.getInstance(dom).getPos();
            },
            prev:function(dom){
                this.getInstance(dom).prev();
            },
            next:function(dom){
                this.getInstance(dom).next();
            }
        });

        return instance;
    }

    if(typeof define === "function" && (define.amd || define.cmd)) {
        define("com.chinact.angular.directive.ctSilderTop",["jquery","AngularDirective","Tool","Swipe"],function($,AngularDirective,Tool,Swipe){
            return create($,window,AngularDirective,Tool,Swipe);
        });
    } else {
        Tool.namespace("com.chinact.angular.directive");
        window.com.chinact.angular.directive.ctSilderTop = create(jQuery,window,AngularDirective,Tool,Swipe);
    }

})();
