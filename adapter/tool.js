/**
 * 工具类
 */
(function () {

    /**
     * create
     * @param $
     * @param w
     * @returns {{namespace: namespace, getUrlParam: getUrlParam, changePage: changePage, getSizeByScale: getSizeByScale, browserVersion: browserVersion, getFileNameByPath: getFileNameByPath, decToHex: decToHex, hexToDec: hexToDec, syncLoadScript: syncLoadScript, extend, create: create, getRandomColor: getRandomColor, renderSize: renderSize, roundFun: roundFun, encodeXmlEntry: encodeXmlEntry, getFileSystem: getFileSystem}}
     */
    function create($, w) {

        return {
            /**
             * 根据ns(例如：com.chinact.oa)创建命名空间，并返回此命名空间对象
             * @param ns
             * @return namespace
             */
            namespace: function (ns) {
                if (ns == undefined || ns == null || (typeof ns) != 'string') {
                    throw new Error("命名空间字符串错误！");
                }

                var nsa = ns.split(".");
                var parent = window;
                for (var i = 0; nsa != null && nsa.length != 0 && i < nsa.length; i++) {
                    if (!parent[nsa[i]]) {
                        parent[nsa[i]] = {};
                    }

                    parent = parent[nsa[i]];
                }

                return parent;
            },
            /**
             * 将get请求部分的参数转换为对象
             * @param arguments
             * @returns {{}}
             */
            getUrlParam: function (arguments) {
                var index = arguments.indexOf("?");
                if (index == -1) {
                }
                var obj = {};
                arguments = arguments.substring(index + 1);
                var strs = arguments.split("&");
                var t = null;
                for (var i = 0, len = strs.length; i < len; i++) {
                    t = strs[i].split("=");
                    obj[t[0]] = Tool.hexToDec(decodeURIComponent(t[1] ? (t[1] === "undefined") ? "" : t[1] : ""));
                }
                return obj;
            },
            /**
             * 页面跳转
             * url:跳转的路径
             * options:配置
             */
            changePage: function (url, options) {
                var defaultOptions = {
                    allowSamePageTransition: false,
                    changeHash: true,
                    data: undefined,
                    dataUrl: undefined,
                    pageContainer: $.mobile.pageContainer,
                    reloadPage: false,
                    reverse: true,
                    role: undefined,
                    showLoadMsg: true,
                    transition: "slide",//$.mobile.defaultPageTransition = 'slide',
                    type: "get"
                };
                var opt = $.extend(defaultOptions, options);

                $.mobile.changePage(url, opt);
            },
            /**
             * 根据比例计算高度
             * */
            getSizeByScale: function (scale, size) {
                return scale * size;
            },
            /**
             * 判断终端浏览器类型
             * */
            browserVersion: function () {
                var u = navigator.userAgent, app = navigator.appVersion;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                }
                // document.writeln(" 是否为移动终端: "+browser.versions.mobile);
                // document.writeln(" ios终端: "+browser.versions.ios);
                // document.writeln(" android终端: "+browser.versions.android);
                // document.writeln(" 是否为iPhone: "+browser.versions.iPhone);
                // document.writeln(" 是否iPad: "+browser.versions.iPad);
                // document.writeln(navigator.userAgent);
            },
            /**
             * 在路径中截取文件名
             * @param fullPath
             * @returns {*}
             */
            getFileNameByPath: function (fullPath) {
                if (!fullPath) return;

                fullPath = fullPath.replace("\\", "/");
                var index = fullPath.lastIndexOf("/");
                if (index == -1) {
                    return fullPath;
                }

                return fullPath.substring(index + 1);
            },
            /**
             * 编码unicode
             * @param {} str 待转换的字符串
             * @return {} 转换后的字符串
             */
            decToHex: function (str) {
                if (str == null || str == "") return "";
                str = (str == null ? "" : str);
                var tmp;
                var sb = new StringBuffer();
                var c;
                var i, j;
                for (i = 0; i < str.length; i++) {
                    c = str.charCodeAt(i);
                    sb.append("\\u");
                    j = (c >>> 8); // 取出高8位
                    tmp = j.toString(16);

                    if (tmp.length == 1) {
                        sb.append("0");
                    }

                    sb.append(tmp);
                    j = (c & 0xFF); // 取出低8位
                    tmp = j.toString(16);
                    if (tmp.length == 1) {
                        sb.append("0");
                    }
                    sb.append(tmp);
                }
                return sb.toString();
            },
            /**
             * 解码unicode
             * @param {} str 待解码的字符串
             * @return {} 解码后的字符串
             */
            hexToDec: function (theString) {
                if (theString == null || theString == "") {
                    return "";
                }

                return unescape(theString.replace(/\\u/g, '%u'));
            },
            /**
             * 同步加载一组js
             *
             * 存放各个文件的加载路径，及其加载完后的回调函数
             * @param group
             * {
             *    url:string
             *    callback:function(){}
             * }
             * 文件都加载完后的回调函数
             * @param complete function(){}
             */
            syncLoadScript: function (group, complete) {
                // 待加载的文件数
                var length = group.length;

                // 当前加载的索引
                var index = 0;

                syncLoad();

                /**
                 * 同步加载一个js文件
                 */
                function syncLoad() {
                    /**
                     * 全部加载完成
                     */
                    if (index >= length) {
                        if (complete) {
                            complete();
                        }
                    }
                    /**
                     * 同步加载指定文件
                     */
                    else {
                        $.getScript(group[index].url, function () {
                            if (group[index].callback) {
                                group[index].callback();
                            }

                            index++;
                            syncLoad();
                        });
                    }
                }
            },
            /**
             * 继承
             */
            extend: (function () {
                // proxy used to establish prototype chain
                var F = function () {
                };
                // extend Child from Parent
                //silderFrame, Tool.create(container)
                return function (Child, Parent) {
                    F.prototype = Parent.prototype;
                    Child.prototype = new F();
                    Child.__super__ = Parent.prototype;
                    Child.prototype.constructor = Child;
                    Parent.prototype.constructor = Parent;
                };
            }()),
            /**
             * 参元方法
             * 以函数包装对象，使其可以被继承
             * @param obj 被参元的对象
             * @returns {Function} 参元后的Function
             */
            create: function (obj) {
                function F() {
                }

                F.prototype = obj;
                return F;
            },
            /*获取随机颜色*/
            getRandomColor: function () {
                return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
            },
            /**
             * 附件大小格式处理
             * @param {} value
             * @param {} p
             * @param {} record
             * @return {String}*/
            renderSize: function (value) {
                if (null == value || value == '') {
                    return "0 Bytes";
                }
                var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
                var index = 0;
                var srcsize = parseFloat(value);
                var size = Tool.roundFun(srcsize / Math.pow(1024, (index = Math.floor(Math.log(srcsize) / Math.log(1024)))), 2);
                return size + unitArr[index];
            },
            /**
             *  四舍五入保留小数位数
             * @param {} numberRound 被处理的数
             * @param {} roundDigit  保留几位小数位
             * @return {}
             */
            roundFun: function (numberRound, roundDigit) { //处理金额 -by hailang
                if (numberRound >= 0) {
                    var tempNumber = parseInt((numberRound * Math.pow(10, roundDigit) + 0.5)) / Math.pow(10, roundDigit);
                    return tempNumber;
                } else {
                    var numberRound1 = -numberRound;
                    var tempNumber = parseInt((numberRound1 * Math.pow(10, roundDigit) + 0.5)) / Math.pow(10, roundDigit);
                    return -tempNumber;
                }
            },
            /**
             * 加密XML实体字符
             * @param str
             * @returns {*}
             */
            encodeXmlEntry: function (str) {
                return str.replace("\"", "&quot").replace("'", "&apos").replace("&", "&amp").replace("<", "&lt").replace(">", "&gt");
            },
            /**
             * 获取文件系统
             * @Params size 初始化大小
             */
            getFileSystem: function (size) {
                var dtd = $.Deferred();
                w.requestFileSystem = w.requestFileSystem || w.webkitRequestFileSystem;
                w.requestFileSystem(
                    1, size || 2 * 1024 * 1024,
                    function (fs) {
                        dtd.resolve(fs);
                    },
                    function () {
                        dtd.reject();
                    }
                );
                return dtd.promise();
            },
            /***
             * 带有删除句柄的setTimeout
             * @param run
             * @param timeout
             */
            setTimeout: function (run, timeout) {
                var handler = w.setTimeout(function () {
                    w.clearTimeout(handler);
                    if (run) {
                        run();
                    }
                }, timeout);
            },
            /**
             * 条件过滤
             */
            on: (function () {

                var _pattern = {
                    // 数字
                    "digit": /^[-]?\d+$/,
                    // email
                    "email": /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                    // phone
                    "phone": /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
                    // tel
                    "tel": /^\d+(-\d+)*$/,
                    // 身份证
                    "idcard": /^[1-9]\d{5}(19\d{2}|[2-9]\d{3})((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{4}|\d{3}X)$/,
                    // 中文
                    "chinese": /^[\u4E00-\u9FA5]+$/
                }
                /**
                 * 链
                 */
                var chains = {
                    // 需要登录
                    "login": login,
                    // 表单验证
                    "submitValidate": submitValidate,
                    // 此功能暂未开放(此功能尚未开放，敬请期待!)
                    "nopening": nopening
                }

                /**
                 * 一个事件的处理(截获)
                 * @param config {
                 *    target: $jo
                 *    filter:filter
                 *    page:page
                 *    beforeCallback:function
                 *    afterCallback:afterCallback
                 *    // 如果需要转场的转场参数
                 *    loginSuccessParams:{
                 *      to:"跳转到哪里",
                 *      params:"&a=1&b=2&c=3"
                 *    }
                 * }
                 */
                function chainDeal(argument, config) {
                    /**
                     * handler 用户的句柄
                     */
                    return (function (h, c) {
                        return function (e) {
                            if (c.beforeCallback) {
                                c.beforeCallback();
                            }

                            var flag = false;
                            // 逐条的对条件进行过滤
                            for (var j = 0; j < c.filter.length; j++) {
                                if (!chains[c.filter[j]](c, this)) {
                                    flag = true;
                                    break;
                                }
                            }

                            // 如果所有验证都通过则调用用户的事件句柄
                            if (!flag) {
                                // 用户的句柄
                                h(e);
                                //if (c.afterCallback) {
                                //    c.afterCallback();
                                //}
                            } else {
                                if (c.afterCallback) {
                                    c.afterCallback();
                                }
                            }
                        }
                    })(argument, config);
                }

                /**
                 * 验证是否登录
                 * @returns {boolean}
                 */
                function login(c, targetDom) {
                    if (app.USEROBJ) {
                        return true;
                    } else {
                        //if (c.page.clear) {
                        //    c.page.clear();
                        //}

                        var to = c.loginSuccessParams.to;
                        var params = c.loginSuccessParams.params || "";
                        Tool.changePage("#" + w.login.getInstance()._id + "?into=" + to + params, {transition: "slideup"});
                        return false;
                    }
                }

                /**
                 * 提交的表单验证
                 * @param page
                 */
                function submitValidate(c, targetDom) {

                    var toastMessage;

                    if (targetDom.classList.contains("disabled")) {
                        return true;
                    }

                    var $pageJO = c.page.getPageJO ? c.page.getPageJO() : c.page.getDom();
                    var items = $pageJO.find("input,textarea,select");

                    //1.required
                    var flag = true;
                    var target;
                    for (var i = 0; i < items.length; i++) {
                        var ele = items.get(i);
                        var required = ele.getAttribute("required");
                        var value = ele.value;
                        if (ele.outerHTML.indexOf("input") !== -1) {
                            value = ele.value;
                        } else if (ele.outerHTML.indexOf("select") !== -1) {
                            if (ele.querySelector("option[value='-1']") && ele.selectedIndex !== 0) {
                                value = "value";
                            } else {
                                value = null;
                            }
                        }
                        var requiredmessage = ele.getAttribute("requiredmessage");
                        if (required && !value) {
                            target = ele;
                            flag = false;
                            toastMessage = requiredmessage;
                            //messageDialog.makeText($pageJO[0], requiredmessage, "bottom", "short");
                            break;
                        }
                    }

                    // 长度
                    if (flag) {
                        for (var i = 0; i < items.length; i++) {
                            var ele = items.get(i);
                            var minlength = ele.getAttribute("minlength");
                            var maxlength = ele.getAttribute("maxlength");
                            var value = ele.value;
                            var lengthmessage = ele.getAttribute("lengthmessage");

                            // 如果value没有值则不验证
                            if (!value) continue;

                            if (minlength && maxlength) {
                                minlength = parseInt(minlength);
                                maxlength = parseInt(maxlength);
                                if (value.length < minlength || value.length > maxlength) {
                                    target = ele;
                                    flag = false;
                                    toastMessage = lengthmessage;
                                    //messageDialog.makeText($pageJO[0], lengthmessage, "bottom", "short");
                                    break;
                                }
                            } else if (minlength) {
                                minlength = parseInt(minlength);
                                if (value.length < minlength) {
                                    target = ele;
                                    flag = false;
                                    toastMessage = lengthmessage;
                                    //messageDialog.makeText($pageJO[0], lengthmessage, "bottom", "short");
                                    break;
                                }
                            } else if (maxlength) {
                                maxlength = parseInt(maxlength);
                                if (value.length > maxlength) {
                                    target = ele;
                                    flag = false;
                                    toastMessage = lengthmessage;
                                    //messageDialog.makeText($pageJO[0], lengthmessage, "bottom", "short");
                                    break;
                                }
                            }
                        }
                    }

                    // 有效性
                    if (flag) {
                        for (var i = 0; i < items.length; i++) {
                            var ele = items.get(i);
                            var value = ele.value;
                            var pattern = ele.getAttribute("pattern");
                            var validmessage = ele.getAttribute("validmessage");

                            if (!value) continue;
                            if (!pattern) continue;

                            // 默认的类型
                            if (_pattern[pattern]) {
                                if (!_pattern[pattern].test(value)) {
                                    target = ele;
                                    flag = false;
                                    toastMessage = validmessage;
                                    //messageDialog.makeText($pageJO[0], validmessage, "bottom", "short");
                                    break;
                                }
                            }
                            // 自定义的正则
                            else {
                                if (!eval(pattern).test(value)) {
                                    target = ele;
                                    flag = false;
                                    toastMessage = validmessage;
                                    //messageDialog.makeText($pageJO[0], validmessage, "bottom", "short");
                                    break;
                                }
                            }
                        }
                    }

                    if (target) {
                        target.focus();
                        //Tool.setTimeout(function () {
                        messageDialog.makeText($pageJO[0], toastMessage, "center", "long");
                        //}, 1000);
                    }

                    return flag;
                }

                /**
                 * 此功能在未开放，敬请期待
                 */
                function nopening(c, targetDom) {
                    var pageDom;
                    if (c.page.getPageJO) {
                        pageDom = c.page.getPageJO()[0];
                    } else if (c.page.getDom) {
                        pageDom = c.page.getDom()[0];
                    }
                    if (pageDom) {
                        messageDialog.makeText(pageDom, "此功能在未开放，敬请期待", "bottom", "long");
                    }
                }

                /**
                 * 函数
                 * arguments
                 * $JO
                 * filter
                 * other
                 */
                return function () {
                    if (arguments.length < 2) return;

                    var config = arguments[0];
                    var $jo = config.target;
                    var params = [];

                    for (var i = 1, len = arguments.length; i < len; i++) {
                        var argument = arguments[i];
                        // 如果参数是function
                        if (typeof argument === 'function') {
                            params.push(chainDeal(argument, config));
                        }
                        // 如果参数是对象
                        else if (typeof argument === "object") {
                            for (var p in argument) {
                                if (typeof argument[p] === 'function') {
                                    params.push(chainDeal(argument[p], config));
                                }
                            }
                        } else {
                            params.push(argument);
                        }
                    }// end for

                    $jo.on.apply($jo, params);
                }
            })(),// end on
            /**
             * 根据URL获取id
             * @param path
             * 1.有hash  截取#到search之间的值
             * 2.没有hash 截取.html文件名
             */
            getPageIdByUrl: function (path) {
                var search = path.indexOf("?") !== -1 ? path.substring(path.indexOf("?")) : "";
                var hash = path.indexOf("#") !== -1 ? path.substring(path.indexOf("#"), search ? path.indexOf(search) : path.length) : "";
                var href = path;

                if (hash) {
                    return hash.substring(1);
                } else {
                    if (search) {
                        href = href.substring(0, href.indexOf(search));
                    }
                    return href.substring(href.lastIndexOf("/") + 1, href.lastIndexOf(".htm"));
                }
            },
            /**
             * 获取UUID
             * @param count 位数
             * @returns {string}
             */
            guid: function (count) {
                var str = new Array(count);
                for (var i = 0; i < count; i++) {
                    str.push("x");
                }

                return str.join("").replace(/x/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },
            /**
             * 事件的桥接
             * @param context 调用上下文
             * @param callFn 调用函数
             * @param params Array 参数
             * @returns {Function}
             */
            eventBridge: function (context, callFn, params) {
                return function () {
                    var tp = Array.prototype.slice.call(arguments);
                    callFn.apply(context || this, params ? tp.concat(params) : tp);
                }
            }
        };
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = create(jQuery, window);
    }
    else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define("Tool", ["jquery"], function ($, window) {
            return create($, window);
        });
    }
    else {
        window.Tool = create(jQuery, window);
    }

})();