"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _assign=require("babel-runtime/core-js/object/assign"),_assign2=_interopRequireDefault(_assign),_classCallCheck2=require("babel-runtime/helpers/classCallCheck"),_classCallCheck3=_interopRequireDefault(_classCallCheck2),_createClass2=require("babel-runtime/helpers/createClass"),_createClass3=_interopRequireDefault(_createClass2);function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function getReceiverByIntent(e){for(var r=[],t=0,i=this.receiverModel.length;t<i;t++){var a=this.receiverModel[t];if(a.action===e.action&&a.categorys.length===e.categorys.length){for(var n=!0,s=0;s<e.categorys.length;s++)if(-1===a.categorys.indexOf(e.categorys[s])){n=!1;break}n&&r.push(a)}}return r}var BorasdCast=function(){function e(){(0,_classCallCheck3.default)(this,e),(0,_assign2.default)(this,{receiverModel:[]})}return(0,_createClass3.default)(e,[{key:"executeReceiverById",value:function(e,r){for(var t=0,i=this.receiverModel.length;t<i;t++){var a=this.receiverModel[t];a.innerReceiverId===e&&a.handler&&a.handler(r)}}},{key:"registerReceiver",value:function(e,r){r&&e&&e.action&&e.el&&this.receiverModel.push({el:e.el,action:e.action,categorys:e.categorys||[],handler:r,priority:e.priority||0})}},{key:"unregisterReceiver",value:function(e,r){if(e&&r)for(var t=0;t<this.receiverModel.length;){var i=this.receiverModel[t];i.action===e&&i.handler===r?(this.receiverModel.splice(t,1),t=0):t++}}},{key:"unregisterReceiverByDom",value:function(e){if(e)for(var r=0;r<this.receiverModel.length;){this.receiverModel[r].el===e?(this.receiverModel.splice(r,1),r=0):r++}}},{key:"sendBroadcast",value:function(e){if(e)for(var r=getReceiverByIntent.call(this,e),t=0,i=(r=[].concat(r)).length;t<i;t++)r[t].handler&&r[t].handler((0,_assign2.default)({},e))}},{key:"sendOrderedBroadcast",value:function(e){var i=0,a=!1,n={action:e.action,categorys:e.categorys||[],bundles:[]};if(e){var r=getReceiverByIntent.call(this,e);(r=[].concat(r)).sort(function(e,r){var t=e.priority||0,i=r.priority||0;return t<i?1:i<t?-1:0}),n.bundles.push(e.bundle||{}),function e(r){if(0===r.length)return;var t=r.shift();t&&(i++,a=!0,t.handler(n,{next:function(){a=!1,n.bundles.length!==i+1&&n.bundles.push({}),e(r)},putExtras:function(e){a&&(n.bundles.length===i+1&&n.bundles.pop(),n.bundles.push(e))}}))}(r)}}}]),e}();exports.default=BorasdCast;