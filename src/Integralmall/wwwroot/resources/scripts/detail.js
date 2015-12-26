(function(domain,undefined){"use strict";function derive(t,e){if("function"==typeof t){for(var i=Object.create(t.prototype),s=e.prototype,r=Object.getOwnPropertyNames(s),o={},n=0;n<r.length;++n)o[r[n]]=Object.getOwnPropertyDescriptor(s,r[n]);return e.prototype=i,Object.defineProperties(e.prototype,o),e}}function EventPhase(){throw new Error("无法创建常量枚举类型的实例。")}function Event(t,e,i){this._type=t,this._bubbles=e,this._cancelable=i,this._target=null,this._currentTarget=null,this._eventPhase=EventPhase.NONE,this._defaultPrevented=!1,this._needStopPropagation=!1,this._needStopImmediatePropagation=!1}function EventListener(t,e){this._handler=t,this._priority=e||0}function EventDispatcher(t){this._dispatcherCaptureRegister={},this._dispatcherBubbleRegister={},this._dispatcherRelatedTarget=t||this}function ScrollDirection(){throw new Error("无法创建静态类型的实例。")}function Preferences(){throw new Error("静态类型无法创建实例！")}function WeAlert(t,e,i,s,r){var r=r||{},o=CreateDialogElement({title:t,type:"weui_dialog_alert",message:e,controls:[{type:"primary dialog-cancel",label:r.done||"确认",rogs:1}]});WeShowDialog(o,i,s)}function WeConfirm(t,e,i,s,r){var r=r||{},o=CreateDialogElement({title:t,type:"weui_dialog_confirm",message:e,controls:[{type:"primary dialog-cancel",label:r.done||"确认",rogs:1},{type:"default dialog-cancel",label:r.cancel||"取消",rogs:0}]});WeShowDialog(o,i,s)}function CreateDialogElement(t){var e="",i="";if(t.controls&&t.controls.length)for(var s=0;s<t.controls.length;++s){var r=t.controls[s];i+=WE_DIALOG_BUTTON_TEMPLATE.replace("{{type}}",r.type).replace("{{label}}",r.label).replace("{{rogs}}",r.rogs)}e=WE_DIALOG_TEMPLATE.replace("{{type}}",t.type).replace("{{title}}",t.title).replace("{{message}}",t.message).replace("{{button}}",i);var o=document.createElement("div");return o.innerHTML=e,o.firstElementChild}function WeShowDialog(t,e,i){document.body.appendChild(t),t.addEventListener("click",function(s){for(var r=s.target;r&&r!=t;){if(r.classList.contains("dialog-cancel"))return document.body.removeChild(t),void("function"==typeof i&&i.call(e||window,+r.getAttribute("data-rogs"),r,s));r=r.parentNode}})}function Device(){throw new Error("无法创建静态类型的实例。")}Object.defineProperties(EventPhase,{NONE:{value:0},CAPTURING_PHASE:{value:1},AT_TARGET:{value:2},BUBBLING_PHASE:{value:3}}),Object.defineProperties(Event.prototype,{type:{get:function(){return this._type}},bubbles:{get:function(){return this._bubbles}},cancelable:{get:function(){return this._cancelable}},target:{get:function(){return this._target}},currentTarget:{get:function(){return this._currentTarget}},eventPhase:{get:function(){return this._eventPhase}},defaultPrevented:{get:function(){return this._defaultPrevented}}}),Event.prototype.preventDefault=function(){this._cancelable&&(this._defaultPrevented=!0)},Event.prototype.stopPropagation=function(){this._needStopPropagation=!0},Event.prototype.stopImmediatePropagation=function(){this._needStopPropagation=!0,this._needStopImmediatePropagation=!0},Object.defineProperties(EventListener.prototype,{priority:{get:function(){return this._priority}},handler:{get:function(){return this._handler}}}),EventListener.prototype.handleEvent=function(t){return"function"==typeof this._handler?this._handler.call(t.currentTarget,t):this._handler.handleEvent(t)},EventDispatcher.prototype.addEventListener=function(t,e,i,s){this.removeEventListener(t,e,i),this._dispatcherCaptureRegister[t]||(this._dispatcherCaptureRegister[t]=[]),this._dispatcherBubbleRegister[t]||(this._dispatcherBubbleRegister[t]=[]);var r=i?this._dispatcherCaptureRegister[t]:this._dispatcherBubbleRegister[t],e=new EventListener(e,s);if(!r.length||e.priority<=r[r.length-1].priority)r.push(e);else for(var o=0,n=r.length;n>o;++o)if(e.priority>r[o].priority){r.splice(o,0,e);break}},EventDispatcher.prototype.removeEventListener=function(t,e,i){var s=i?this._dispatcherCaptureRegister[t]:this._dispatcherBubbleRegister[t];if(s&&s.length)for(var r=0,o=s.length;o>r;++r)if(e===s[r].handler)return void s.splice(r,1)},EventDispatcher.prototype.hasEventListener=function(t){return this._dispatcherCaptureRegister.hasOwnProperty(t)&&this._dispatcherCaptureRegister[t].length>=1||this._dispatcherBubbleRegister.hasOwnProperty(t)&&this._dispatcherBubbleRegister[t].length>=1},EventDispatcher.prototype.willTrigger=function(t){if(this.hasEventListener(t))return!0;for(var e;e=e.parent;)if(e.hasEventListener(t))return!0;return!1},EventDispatcher.prototype.dispatchEvent=function(t){if(t.eventPhase!==EventPhase.NONE)throw new Error("无效的事件对象。");if(!t.bubbles||!this.parent)return t._target=this._dispatcherRelatedTarget,t._currentTarget=this._dispatcherRelatedTarget,t._eventPhase=EventPhase.AT_TARGET,this._dispatchEvent(t),!t.defaultPrevented;for(var e=[],i=this;i=i.parent;)e.push(i);for(var s=e.length,r=[],o=e.length-1;o>=0;--o)r.push(e[o]);r.push(this);for(var o=0;o<e.length;++o)r.push(e[o]);for(var o=0;o<r.length&&!t._needStopPropagation;++o)t._target=this._dispatcherRelatedTarget,t._currentTarget=r[o]._dispatcherRelatedTarget,t._eventPhase=s==o?EventPhase.AT_TARGET:o>s?EventPhase.BUBBLING_PHASE:EventPhase.CAPTURING_PHASE,r[o]._dispatchEvent(t);return!t.defaultPrevented&&!t._needStopPropagation},EventDispatcher.prototype._dispatchEvent=function(t){var e=[];t.eventPhase==EventPhase.CAPTURING_PHASE&&(e=e.concat(this._dispatcherCaptureRegister[t.type]||[])),t.eventPhase==EventPhase.AT_TARGET&&(e=e.concat(this._dispatcherCaptureRegister[t.type]||[]),e=e.concat(this._dispatcherBubbleRegister[t.type]||[])),t.eventPhase==EventPhase.BUBBLING_PHASE&&(e=e.concat(this._dispatcherBubbleRegister[t.type]||[]));for(var i=0;i<e.length&&!t._needStopImmediatePropagation;++i)e[i].handleEvent(t)};var Sprite=derive(EventDispatcher,function t(e){if(EventDispatcher.call(this),this._element=$(e),this._natural=this._element[0],this._scaleX=1,this._scaleY=1,this._rotation=0,this._translateX=0,this._translateY=0,this._hrwAccelEnabled=!0,1!=this._element.length)throw new Error("当前选择器选中了零个或多个元素，但 Sprite 必须且只能包含有一个有效的元素。");t.reg(this)});Object.defineProperties(Sprite.prototype,{element:{get:function(){return this._element}},natural:{get:function(){return this._natural}},hrwAccelEnabled:{get:function(){return this._hrwAccelEnabled},set:function(t){this._hrwAccelEnabled=t}},width:{get:function(){return this.natural.clientWidth}},height:{get:function(){return this.natural.clientHeight}},x:{get:function(){return this._translateX},set:function(t){this._translateX=t,this._applyTransform()}},y:{get:function(){return this._translateY},set:function(t){this._translateY=t,this._applyTransform()}},scaleX:{get:function(){return this._scaleX},set:function(t){this._scaleX=t,this._applyTransform()}},scaleY:{get:function(){return this._scaleY},set:function(t){this._scaleY=t,this._applyTransform()}},rotation:{get:function(){return this._rotation},set:function(t){this._rotation=t,this._applyTransform()}}}),Sprite.prototype._applyTransform=function(){this._setTransform("scale("+this._scaleX+","+this._scaleY+")rotate("+this._rotation+"deg)translateX("+this._translateX+"px)translateY("+this._translateY+"px)"+(this._hrwAccelEnabled?"translateZ(0px)":""))},Sprite.prototype._setTransform=function(t){this.natural.style.transform=this.natural.style.webkitTransform=t},Sprite.prototype.transform=function(t,e,i,s,r){null!==t&&"undefined"!=typeof t&&(this._translateX=t),null!==e&&"undefined"!=typeof e&&(this._translateY=e),null!==i&&"undefined"!=typeof i&&(this._scaleX=i),null!==s&&"undefined"!=typeof s&&(this._scaleY=s),null!==r&&"undefined"!=typeof r&&(this._rotation=r),this._applyTransform()};var SPID_POINTER=0,SPID_DICTION={};Sprite.reg=function(t){if(!(t instanceof Sprite))throw new Error("Sprite: reg() 方法的注册对象必须为 Sprite 类型的实例。");return SPID_DICTION[SPID_POINTER]=t,t.natural.setAttribute("data-sprite",SPID_POINTER++),t},Sprite.get=function(t){return null===t||"undefined"==typeof t?null:"object"==typeof t?"function"==typeof t.getAttribute?SPID_DICTION[t.getAttribute("data-sprite")]||null:SPID_DICTION[t[0].getAttribute("data-sprite")]||null:SPID_DICTION[""+t]||null},Sprite.cls=function(t){if(null!==t&&"undefined"!=typeof t){if(t instanceof Sprite)return void(SPID_DICTION[t.natural.getAttribute("data-sprite")]=null);"object"==typeof t&&("function"==typeof t.getAttribute?SPID_DICTION[t.getAttribute("data-sprite")]=null:SPID_DICTION[t[0].getAttribute("data-sprite")]=null),SPID_DICTION[""+t]=null}};var requestAnimation=window.requestAnimationFrame||window.webkitRequestAnimationFrame,cancelAnimation=window.cancelAnimationFrame||window.webkitCancelAnimationFrame;Object.defineProperties(ScrollDirection,{NONE:{value:0},X_AXIS:{value:1},Y_AXIS:{value:2},Z_AXIS:{value:3},XY_AXIS:{value:4},XZ_AXIS:{value:5},YZ_AXIS:{value:6},LEFT:{value:16},RIGHT:{value:17},UP:{value:18},DOWN:{value:19},IN:{value:20},OUT:{value:21}});var ScrollContainer=derive(Sprite,function(t){Sprite.call(this,t),this._content=new Sprite(this._element.children("content")),this._scrollX=0,this._scrollY=0,this._scrollRealX=0,this._scrollRealY=0,this._bounces=!0,this._scrollXEnabled=!1,this._scrollYEnabled=!0,this._scrollXIndicator=null,this._scrollYIndicator=null,this._scrollXTracker=null,this._scrollYTracker=null,this._disableIndicator=!1,this._resizeIndicator=!0,this._contentWidth=0,this._contentHeight=0,this._viewportWidth=0,this._viewportHeight=0,this._lockAtDir=ScrollDirection.NONE,this._startXval=0,this._startYval=0,this._speedXval=0,this._speedYval=0,this._amplsXval=0,this._amplsYval=0,this._touchXval=0,this._touchYval=0,this._targtXval=0,this._targtYval=0,this._velocXval=0,this._velocYval=0,this._distsXval=0,this._distsYval=0,this._forceXval=0,this._forceYval=0,this._edgesXval=0,this._edgesYval=0,this._tickerInt=0,this._timestamp=0,this._pullstamp=0,this._scrollInt=0,this._pullbkInt=0,this._bounceInt=0,this._threshold=5,this._timedelay=0,this._amplsFactor=.5,this._timeConstant=650,this._elasticFactor=.35,this._bouncesFactor=.05,this._timePullFactor=.15,this._forceDamping=.85,this._speedThreshold=10,this._maxTopEdgeBounces=-1,this._doAutoScroll=this._doAutoScroll.bind(this),this._doPullback=this._doPullback.bind(this),this._doForceBounces=this._doForceBounces.bind(this),this._doScrollTo=this._doScrollTo.bind(this),this._calcTouchesSpeed=this._calcTouchesSpeed.bind(this),this._calcTouchesPosition=this._calcTouchesPosition.bind(this),this._drawScrollContainer=this._drawScrollContainer.bind(this),this._initScrollContainer()});Object.defineProperties(ScrollContainer.prototype,{scrollX:{get:function(){return this._scrollX},set:function(t){this._scrollX=t,this._scrollX>>0!==this._scrollRealX&&(this._scrollRealX=this._scrollX>>0,this._drawScrollPosition())}},scrollY:{get:function(){return this._scrollY},set:function(t){this.maxTopEdgeBounces>=0&&(t=Math.min(this.maxTopEdgeBounces,t)),this._scrollY=t,this._scrollY>>0!==this._scrollRealY&&(this._scrollRealY=this._scrollY>>0,this._drawScrollPosition())}},bounces:{get:function(){return this._bounces},set:function(t){this._bounces=t}},disableIndicator:{get:function(){return this._disableIndicator},set:function(t){this._disableIndicator=t}},resizeIndicator:{get:function(){return this._resizeIndicator},set:function(t){this._resizeIndicator=t}},scrollWidth:{get:function(){return Math.max(0,this.contentWidth-this.viewportWidth)}},scrollHeight:{get:function(){return Math.max(0,this.contentHeight-this.viewportHeight)}},contentWidth:{get:function(){return this._contentWidth}},contentHeight:{get:function(){return this._contentHeight}},viewportWidth:{get:function(){return this._viewportWidth}},viewportHeight:{get:function(){return this._viewportHeight}},scrollXEnabled:{get:function(){return this._scrollXEnabled},set:function(t){this._scrollXEnabled=t}},scrollYEnabled:{get:function(){return this._scrollYEnabled},set:function(t){this._scrollYEnabled=t}},content:{get:function(){return this._content}},threshold:{get:function(){return this._threshold},set:function(t){this._threshold=t}},maxTopEdgeBounces:{get:function(){return this._maxTopEdgeBounces},set:function(t){this._maxTopEdgeBounces=t}}}),ScrollContainer.prototype.updateFrameSizes=function(){this._contentWidth=this._content.width,this._contentHeight=this._content.height,this._viewportWidth=this.width,this._viewportHeight=this.height},ScrollContainer.prototype._initScrollContainer=function(){this.natural.addEventListener("touchstart",this._drawScrollContainer)},ScrollContainer.prototype._drawScrollPosition=function(){var t=this._content.natural.style;t.transform=t.webkitTransform="translateY("+this._scrollRealY+"px) translateZ(0px)",this.dispatchEvent(new Event("scroll",!1,!1))},ScrollContainer.prototype._setScrollPosition=function(t,e){},ScrollContainer.prototype._setupTouchEvents=function(t){t?(this.natural.addEventListener("touchmove",this._drawScrollContainer),this.natural.addEventListener("touchend",this._drawScrollContainer),this.natural.addEventListener("touchcancel",this._drawScrollContainer)):(this.natural.removeEventListener("touchmove",this._drawScrollContainer),this.natural.removeEventListener("touchend",this._drawScrollContainer),this.natural.removeEventListener("touchcancel",this._drawScrollContainer))},ScrollContainer.prototype._drawScrollContainer=function(t){if("touchstart"==t.type){var e=this._calcTouchesPosition(t);return this._hasTouched(t,2)?(this._touchXval=e[0],this._touchYval=e[1],this._amplsXval=0,this._amplsYval=0,this._velocXval=0,this._velocYval=0,this._forceXval=0,void(this._forceYval=0)):(this.updateFrameSizes(),cancelAnimation(this._pullbkInt),cancelAnimation(this._scrollInt),cancelAnimation(this._bounceInt),cancelAnimation(this._tickerInt),this._touchXval=e[0],this._touchYval=e[1],this._amplsXval=0,this._amplsYval=0,this._velocXval=0,this._velocYval=0,this._forceXval=0,this._forceYval=0,this._startXval=this.scrollX,this._startYval=this.scrollY,this._tickerInt=requestAnimation(this._calcTouchesSpeed),this._lockAtDir=ScrollDirection.NONE,void this._setupTouchEvents(!0))}if("touchmove"==t.type){var e=this._calcTouchesPosition(t),i=e[0]-this._touchXval,s=e[1]-this._touchYval,r=!1;if(this._lockAtDir==ScrollDirection.NONE&&(Math.abs(i)>this._threshold&&(this._lockAtDir=ScrollDirection.X_AXIS),Math.abs(s)>this._threshold&&(this._lockAtDir==ScrollDirection.X_AXIS?this._lockAtDir=ScrollDirection.XY_AXIS:this._lockAtDir=ScrollDirection.Y_AXIS),this._lockAtDir==ScrollDirection.NONE))return;return!this.scrollXEnabled||this._lockAtDir!=ScrollDirection.X_AXIS&&this._lockAtDir!=ScrollDirection.XY_AXIS||(r=!0,this.scrollX>0||this.scrollX<-this.scrollWidth?this.scrollX=this.scrollX+i*this._elasticFactor:this.scrollX=this.scrollX+i,this._showIndicator(0,1)),!this.scrollYEnabled||this._lockAtDir!=ScrollDirection.Y_AXIS&&this._lockAtDir!=ScrollDirection.XY_AXIS||(r=!0,this.scrollY>0||this.scrollY<-this.scrollHeight?this.scrollY=this.scrollY+s*this._elasticFactor:this.scrollY=this.scrollY+s,this._showIndicator(1,1)),r&&(t.preventDefault(),t.stopPropagation()),this._touchXval=e[0],void(this._touchYval=e[1])}if("touchend"!=t.type&&"touchcancel"!=t.type);else{if(this._hasTouched(t,1)){var e=this._calcTouchesPosition(t);return this._touchXval=e[0],void(this._touchYval=e[1])}cancelAnimation(this._pullbkInt),cancelAnimation(this._scrollInt),cancelAnimation(this._bounceInt),cancelAnimation(this._tickerInt),this._setupTouchEvents(!1);var o=!1,n=!1,a=!1;if(this.scrollXEnabled&&this.scrollX>0?(o=!0,this._amplsXval=-this.scrollX,this._targtXval=this.scrollX+this._amplsXval):this.scrollXEnabled&&this.scrollX<-this.scrollWidth&&(o=!0,this._amplsXval=-this.scrollWidth-this.scrollX,this._targtXval=this.scrollX+this._amplsXval),this.scrollYEnabled&&this.scrollY>0?(n=!0,this._amplsYval=-this.scrollY,this._targtYval=this.scrollY+this._amplsYval):this.scrollYEnabled&&this.scrollY<-this.scrollHeight&&(n=!0,this._amplsYval=-this.scrollHeight-this.scrollY,this._targtYval=this.scrollY+this._amplsYval),o||this._lockAtDir!=ScrollDirection.X_AXIS&&this._lockAtDir!=ScrollDirection.XY_AXIS||(Math.abs(this._speedXval)>=this._speedThreshold?(a=!0,this._velocXval=this._amplsFactor*this._speedXval,this._distsXval=this.scrollX+this._velocXval):this._showIndicator(0,0)),n||this._lockAtDir!=ScrollDirection.Y_AXIS&&this._lockAtDir!=ScrollDirection.XY_AXIS||(Math.abs(this._speedYval)>=this._speedThreshold?(a=!0,this._velocYval=this._amplsFactor*this._speedYval,this._distsYval=this.scrollY+this._velocYval):this._showIndicator(1,0)),this._lockAtDir==ScrollDirection.NONE&&(this._showIndicator(0,0),this._showIndicator(1,0)),(o||n)&&(this._pullstamp=Date.now(),this._pullbkInt=requestAnimation(this._doPullback),this.dispatchEvent(new Event("pull",!1,!1))),a){this._timestamp=Date.now(),this._scrollInt=requestAnimation(this._doAutoScroll);var l=new Event("drag",!1,!1);l.vx=this._velocXval,l.vy=this._velocYval,this.dispatchEvent(l)}}},ScrollContainer.prototype._calcTouchesSpeed=function(){var t=Date.now(),e=t-this._timestamp,i=this.scrollX-this._startXval,s=this.scrollY-this._startYval;this._startXval=this.scrollX,this._startYval=this.scrollY,this._speedXval=.8*(1e3*i/(1+e))+.2*this._speedXval,this._speedYval=.8*(1e3*s/(1+e))+.2*this._speedYval,this._timestamp=t,this._tickerInt=requestAnimation(this._calcTouchesSpeed)},ScrollContainer.prototype._calcTouchesPosition=function(t){return"touchstart"==t.type||"touchend"==t.type||"touchmove"==t.type||"touchcancel"==t.type?this._getAverageOfTouches(t.touches):void 0},ScrollContainer.prototype._getAverageOfTouches=function(t){for(var e=0,i=[0,0];e<t.length;++e)0==e?(i[0]=t[e].clientX,i[1]=t[e].clientY):(i[0]=.5*(i[0]+t[e].clientX),i[1]=.5*(i[1]+t[e].clientY));return i},ScrollContainer.prototype._hasTouched=function(t,e){return"touchstart"==t.type||"touchmove"==t.type||"touchend"==t.type||"touchcancel"==t.type?t.touches.length>=e:!1},ScrollContainer.prototype._doAutoScroll=function(){var t=Math.exp((this._timestamp-Date.now())/this._timeConstant),e=0,i=!1,s=!1;this._velocXval&&(e=-this._velocXval*t,Math.abs(e)>=.5?(i=!0,e=this._distsXval+e,this._forceXval=.8*(e-this.scrollX)+.2*this._forceXval,this.scrollX=e,this._showIndicator(0,1)):(e=this._distsXval,this._forceXval=.8*(e-this.scrollX)+.2*this._forceXval,this.scrollX=e,this._velocXval=0,this._showIndicator(0,0)),(e>0||e<-this.scrollWidth)&&(i=!1,this._velocXval=0,this.scrollX=e>0?0:-this.scrollWidth,this._bounces&&(s=!0,this._edgesXval=e>0?0:e<-this.scrollWidth?-this.scrollWidth:0))),this._velocYval&&(e=-this._velocYval*t,Math.abs(e)>=.5?(i=!0,e=this._distsYval+e,this._forceYval=.8*(e-this.scrollY)+.2*this._forceYval,this.scrollY=e,this._showIndicator(1,1)):(e=this._distsYval,this._forceYval=.8*(e-this.scrollY)+.2*this._forceYval,this.scrollY=e,this._velocYval=0,this._showIndicator(1,0)),(e>0||e<-this.scrollHeight)&&(i=!1,this._velocYval=0,this.scrollY=e>0?0:-this.scrollHeight,this._bounces&&(s=!0,this._edgesYval=e>0?0:e<-this.scrollHeight?-this.scrollHeight:0))),i&&(this._pullbkInt=requestAnimation(this._doAutoScroll)),s&&(cancelAnimation(this._bounceInt),this._bounceInt=requestAnimation(this._doForceBounces))},ScrollContainer.prototype._doPullback=function(){var t=Math.exp((this._pullstamp-Date.now())/(this._timeConstant*this._timePullFactor)),e=0,i=!1;this._amplsXval&&(e=-this._amplsXval*t,Math.abs(e)>=.5?(i=!0,this.scrollX=this._targtXval+e,this._showIndicator(0,1)):(this.scrollX=this._targtXval,this._amplsXval=0,this._showIndicator(0,0))),this._amplsYval&&(e=-this._amplsYval*t,Math.abs(e)>=.5?(i=!0,this.scrollY=this._targtYval+e,this._showIndicator(1,1)):(this.scrollY=this._targtYval,this._amplsYval=0,this._showIndicator(1,0))),i&&(this._pullbkInt=requestAnimation(this._doPullback))},ScrollContainer.prototype._doForceBounces=function(){var t=0,e=0,i=!1;!this._velocXval&&this._forceXval&&(t=(this._edgesXval-this.scrollX)*this._bouncesFactor,this._forceXval+=t,this._forceXval*=this._forceDamping,Math.abs(this._forceXval)>=.001?(i=!0,this.scrollX+=this._forceXval*this._elasticFactor,this._showIndicator(0,1)):(this._forceXval=0,this.scrollX=this._edgesXval,this._showIndicator(0,0))),!this._velocYval&&this._forceYval&&(e=(this._edgesYval-this.scrollY)*this._bouncesFactor,this._forceYval+=e,this._forceYval*=this._forceDamping,Math.abs(this._forceYval)>=.001?(i=!0,this.scrollY+=this._forceYval*this._elasticFactor,this._showIndicator(1,1)):(this._forceYval=0,this.scrollY=this._edgesYval,this._showIndicator(1,0))),i&&(this._bounceInt=requestAnimation(this._doForceBounces))},ScrollContainer.prototype.scrollTo=function(t,e,i){this._stopAllDelayTimer(),this._distsXval=e,this._distsYval=i,this._velocXval=this._distsXval-this.scrollX,this._velocYval=this._distsYval-this.scrollY,this._timedelay=t,this._timestamp=Date.now(),this._scrollInt=requestAnimation(this._doScrollTo)},ScrollContainer.prototype._doScrollTo=function(){var t=Date.now()-this._timestamp,e=!1;t<this._timedelay&&this._timedelay>0?(Math.abs(this._velocXval)>.001&&(e=!0,this.scrollX=this._distsXval-this._velocXval+this._velocXval*(t/this._timedelay)),Math.abs(this._velocYval)>.001&&(e=!0,this.scrollY=this._distsYval-this._velocYval+this._velocYval*(t/this._timedelay)),e&&(this._scrollInt=requestAnimation(this._doScrollTo))):(this.scrollX=this._distsXval,this.scrollY=this._distsYval)},ScrollContainer.prototype._stopAllDelayTimer=function(){cancelAnimation(this._pullbkInt),cancelAnimation(this._scrollInt),cancelAnimation(this._bounceInt),cancelAnimation(this._tickerInt)},ScrollContainer.prototype._showIndicator=function(t,e){this._disableIndicator||(this._createIndicator(),0==t&&this._scrollXTracker&&(1==e?(this._updateIndicator(t),this._scrollXTracker.natural.classList.remove("scroll-track-showing")):this._scrollXTracker.natural.classList.remove("scroll-track-showing")),1==t&&this._scrollYTracker&&(1==e?(this._updateIndicator(t),this._scrollYTracker.natural.classList.add("scroll-track-showing")):this._scrollYTracker.natural.classList.remove("scroll-track-showing")))},ScrollContainer.prototype._createIndicator=function(){this.scrollXEnabled&&!this._scrollXIndicator&&(this._scrollXTracker=new Sprite(document.createElement("div")),this._scrollXTracker.natural.className="scroll-track scroll-x-track",this._scrollXIndicator=new Sprite(document.createElement("div")),this._scrollXIndicator.natural.className="scroll-indicator",this._scrollXTracker.natural.appendChild(this._scrollXIndicator.natural),this.natural.appendChild(this._scrollXTracker.natural)),this.scrollYEnabled&&!this._scrollYIndicator&&(this._scrollYTracker=new Sprite(document.createElement("div")),this._scrollYTracker.natural.className="scroll-track scroll-y-track",this._scrollYIndicator=new Sprite(document.createElement("div")),this._scrollYIndicator.natural.className="scroll-indicator",this._scrollYTracker.natural.appendChild(this._scrollYIndicator.natural),this.natural.appendChild(this._scrollYTracker.natural))},ScrollContainer.prototype._updateIndicator=function(t){if(0==t){var e=this.viewportWidth<=0||this.contentWidth<=0?0:this.viewportWidth/this.contentWidth,i=this.scrollX>0?0:this.scrollX<-this.scrollWidth?this.scrollWidth:-this.scrollX,s=this.scrollWidth<=0?this.scrollY>=0?0:1:i/this.scrollWidth;if(this.resizeIndicator){var r=this._scrollXTracker.width*e,o=this.scrollX>0?this.scrollX:this.scrollX<-this.scrollWidth?-this.scrollWidth-this.scrollX:0;o=0>=r?0:1-Math.min(1,o/r),this._scrollXIndicator.natural.style.width=r*o+"px"}this._scrollXIndicator.x=Math.max(0,this._scrollXTracker.width-this._scrollXIndicator.width)*s}if(1==t){var e=this.viewportHeight<=0||this.contentHeight<=0?0:this.viewportHeight/this.contentHeight,i=this.scrollY>0?0:this.scrollY<-this.scrollHeight?this.scrollHeight:-this.scrollY,s=this.scrollHeight<=0?this.scrollY>=0?0:1:i/this.scrollHeight;if(this.resizeIndicator){var n=this._scrollYTracker.height*e,a=this.scrollY>0?this.scrollY:this.scrollY<-this.scrollHeight?-this.scrollHeight-this.scrollY:0;a=0>=n?0:1-Math.min(1,a/n),this._scrollYIndicator.natural.style.height=n*a+"px"}this._scrollYIndicator.y=Math.max(0,this._scrollYTracker.height-this._scrollYIndicator.height)*s}};var FPSRendener=derive(Sprite,function(){Sprite.call(this,document.createElement("div")),this._element.css({position:"fixed",left:"0px",top:"0px",color:"#04be02",padding:"0px 4px",background:"rgba(255, 255, 255, 0.6)",zIndex:9999999}),document.body.appendChild(this._natural),this._frameRate=0,this._lastTimer=0,this._currTimer=0,this._updateFrameRateHandler=this._updateFrameRateHandler.bind(this),requestAnimation(this._updateFrameRateHandler)});FPSRendener.prototype._updateFrameRateHandler=function(t){this._frameRate++,this._currTimer=Date.now(),this._currTimer-this._lastTimer>=1e3&&(this._lastTimer=this._currTimer,this._updateTextContent(),this._frameRate=0),requestAnimation(this._updateFrameRateHandler)},FPSRendener.prototype._updateTextContent=function(){this._element.text("fps:"+this._frameRate)};var PageBase=derive(Sprite,function(t){Sprite.call(this,document.body),new FPSRendener,console.log("PageBase -> Remote Init: "+(new Date).toJSON()),this._appConfigParam=domain.APP_CONFIG_PARAMS||{},t||(this._mainContainer=new ScrollContainer("#main")),window.addEventListener("load",function(t){document.body.classList.add("body-load")})}),STAT_VIEW_PAGE_ID_SEED=Date.now(),StatView=derive(Sprite,function(t){Sprite.call(this,t),this._statOpenClass="stat-open",this._transitionElement=null,this._useHistoryAPI=!0,this._statOpen=this.natural.classList.contains(this._statOpenClass),this._onStatTransitionEnd=this._onStatTransitionEnd.bind(this),this._onHistoryPopStateHandler=this._onHistoryPopStateHandler.bind(this),this._restoreHistoryListener()});Object.defineProperties(StatView.prototype,{statOpen:{get:function(){return this._statOpen}},useHistoryAPI:{get:function(){return this._useHistoryAPI},set:function(t){this._useHistoryAPI=!!t,this._restoreHistoryListener()}},pageId:{get:function(){return"StatView-"+STAT_VIEW_PAGE_ID_SEED+"-"+this.natural.getAttribute("data-sprite")}}}),StatView.prototype._restoreHistoryListener=function(){window[this._useHistoryAPI?"addEventListener":"removeEventListener"]("popstate",this._onHistoryPopStateHandler)},StatView.prototype._onHistoryPopStateHandler=function(t){var e=t.state;this._statOpen?e&&e.page==this.pageId||this.toggle():e&&e.page==this.pageId&&this.toggle()},StatView.prototype.open=function(){this._statOpen||(this.toggle(),this._useHistoryAPI&&window.history.pushState({page:this.pageId},"StatView"))},StatView.prototype.close=function(){this._statOpen&&(this._useHistoryAPI?window.history.back():this.toggle())},StatView.prototype.toggle=function(){this._statOpen=!this._statOpen,this.dispatchEvent(new Event("statChange",!1,!1)),this._statOpen?this.natural.style.display="block":this._transitionElement?(this._transitionElement.addEventListener("transitionEnd",this._onStatTransitionEnd),this._transitionElement.addEventListener("webkitTransitionEnd",this._onStatTransitionEnd)):this.natural.style.display="none",window.setTimeout(function(){this.natural.classList[this._statOpen?"add":"remove"](this._statOpenClass)}.bind(this),30)},StatView.prototype._onStatTransitionEnd=function(){this._transitionElement.removeEventListener("transitionEnd",this._onStatTransitionEnd),this._transitionElement.removeEventListener("webkitTransitionEnd",this._onStatTransitionEnd),this.natural.style.display="none"};var Overlay=derive(StatView,function(t){StatView.call(this,t),this._statDirection="NONE",this._mask=this.element.children(".overlay-mask"),this._transitionElement=this._mask[0],this._cancelOverlayHandler=this._cancelOverlayHandler.bind(this),this._onStatChangeHandler=this._onStatChangeHandler.bind(this),this._initOverlayConstructor()});Overlay.prototype._initOverlayConstructor=function(){this.natural.classList.contains("overlay-E")?this._statDirection="overlay-E":this.natural.classList.contains("overlay-W")&&(this._statDirection="overlay-W"),this.addEventListener("statChange",this._onStatChangeHandler),this._mask.on("click",this._cancelOverlayHandler),this.element.on("click",".overlay-cancel",this._cancelOverlayHandler)},Overlay.prototype._onStatChangeHandler=function(t){document.body.classList[this.statOpen?"add":"remove"](this._statDirection)},Overlay.prototype._cancelOverlayHandler=function(t){t.preventDefault(),t.stopPropagation(),this.close()};var Dropdown=derive(Sprite,function(t){Sprite.call(this,t),this._dropContainer=this.element.children(".drop-container"),this._dropContent=this.element.find(".drop-content"),this._dropAllow=this.element.find(".drop-allow"),this._dropSize=this._dropContainer.height(),this._dropOnce=this.element.data("droponce"),this._dropToggleHandler=this._dropToggleHandler.bind(this),this._initDropdown()});Dropdown.prototype._initDropdown=function(){this._dropContainer.height()<this._dropContent.height()&&(this._dropAllow.show(),this.natural.addEventListener("click",this._dropToggleHandler))},Dropdown.prototype._dropToggleHandler=function(t){this.toggle()},Dropdown.prototype.toggle=function(){this.element.hasClass("drop-open")?(this._dropContainer.css({height:this._dropSize}),this.element.removeClass("drop-open")):(this._dropContainer.css({height:this._dropContent.height()}),this.element.addClass("drop-open"),this._dropOnce&&this.natural.removeEventListener("click",this._dropToggleHandler))},Preferences.set=function(t,e,i){return i?void(Preferences["."+t]=e):localStorage.setItem("Preferences."+t,Preferences["."+t]=e)},Preferences.get=function(t,e){return e?Preferences["."+t]:t in Preferences?Preferences["."+t]:Preferences["."+t]=localStorage.getItem("Preferences."+t)||null};var WE_DIALOG_TEMPLATE='<div class="{{type}}"><div class="weui_mask"></div><div class="weui_dialog"><div class="weui_dialog_hd"><strong class="weui_dialog_title">{{title}}</strong></div><div class="weui_dialog_bd">{{message}}</div><div class="weui_dialog_ft">{{button}}</div>',WE_DIALOG_BUTTON_TEMPLATE='<a href="javascript:void(0);" class="weui_btn_dialog {{type}}" data-rogs="{{rogs}}">{{label}}</a>';Device.isWindowsPhone=function(){return navigator.userAgent.indexOf("Windows Phone")>=0},Device.isAndroid=function(){return!Device.isAndroid&&navigator.userAgent.indexOf("Android")>=0},Device.isIOS=function(){return!Device.isWindowsPhone()&&/iP(ad|hone|od)/.test(navigator.userAgent)};var Page=derive(PageBase,function(){PageBase.call(this),this._distance=88,this._threshold=48,this._avatarOverlay=30,this._fadeTopDistance=120,this._allowScrollSize=100,this._isShowMore=!1,this._isLoadMore=!1,this._isIOS=Device.isIOS(),this._buyNow=!1,this._isAjax=!1,this._swiperSprite=new Sprite("#detailSwiper"),this._detailSwiper=new Swiper(this._swiperSprite.natural,{pagination:".swiper-pagination",loop:!0,simulateTouch:!1,threshold:5,autoplay:4e3,preloadImages:!1,lazyLoading:!0}),this._morePromptsSprite=new Sprite("#detailMorePrompts"),this._backPromptsSprite=new Sprite("#detailBackPrompts"),this._mainContainer.disableIndicator=!0,this._mainContainer.maxTopEdgeBounces=64,this._resetAvatarTransition=!1,this._avatar=new Sprite("#avatar"),this._intros=new Sprite("#detailIntroduct"),this._sideContainer=new ScrollContainer("#side"),this._sideContainer.maxTopEdgeBounces=92,this._optionOverlay=new Overlay("#optionOverlay"),this._optionContainer=new ScrollContainer("#option"),this._optionTrigger=new Sprite("#optionTrigger"),this._buyNowTrigger=$(".buyNow"),this._chooseAttribute=$("#choose-attribute"),this._specOverlay=new Overlay("#specOverlay"),this._specContainer=new ScrollContainer("#spec"),this._specTrigger=new Sprite("#specTrigger"),this._topbar=new Sprite("#detTop"),this._toolbar=new Sprite("#toolbar"),this._descDropdown=new Dropdown("#descDropdown"),this._shareButton=$(".share-button"),this._shareTipLayer=null,this._showShareTipLayer=this._showShareTipLayer.bind(this),this._viewPullUpHandler=this._viewPullUpHandler.bind(this),this._viewScrollHandler=this._viewScrollHandler.bind(this),this._sidePullUpHandler=this._sidePullUpHandler.bind(this),this._sideScrollHandler=this._sideScrollHandler.bind(this),this._dragSideViewHandler=this._dragSideViewHandler.bind(this),this._topbarClickHandler=this._topbarClickHandler.bind(this),
this._showOptionLayer=this._showOptionLayer.bind(this),this._showSpecLayer=this._showSpecLayer.bind(this),this._sidePullDownHandler=this._sidePullDownHandler.bind(this),this._chooseAttributeconfirm=this._chooseAttributeconfirm.bind(this),this._showBuyNowOptionLayer=this._showBuyNowOptionLayer.bind(this),this._sendAjax=this._sendAjax.bind(this),this._confirmAjax=this._confirmAjax.bind(this),this._mainContainer.addEventListener("pull",this._viewPullUpHandler),this._mainContainer.addEventListener("scroll",this._viewScrollHandler),this._sideContainer.addEventListener("pull",this._sidePullUpHandler),this._sideContainer.addEventListener("pull",this._sidePullDownHandler),this._sideContainer.addEventListener("drag",this._dragSideViewHandler),this._topbar.natural.addEventListener("click",this._topbarClickHandler),this._optionTrigger.natural.addEventListener("click",this._showOptionLayer),this._specTrigger.natural.addEventListener("click",this._showSpecLayer),this._shareButton.on("click",this._showShareTipLayer),this._buyNowTrigger.on("click",this._showBuyNowOptionLayer),this._chooseAttribute.on("click",this._chooseAttributeconfirm)});Page.prototype._chooseAttributeconfirm=function(t){for(var e=$(".product-attributes"),i="",s="",r=$(".weui_input.counter-input").val(),o=0;o<e.length;o++){var n=$("input[name='"+o+"']:checked").val(),a=$("input[name='"+o+"']:checked").next().text();if("undefined"==typeof n){var l=e.eq(o).find(".option-chooser-title").text();return void WeAlert("温馨提示","请选择 "+l,this,this._alertAfter)}i+=n+";",s+=a+"、"}return $("#formOptionOutput").text(s+r+"件"),$("#sku_id").val(i),$("#num_id").val(r),e.length<0&&""==i?void WeAlert("温馨提示","请选择 完整的属性 ",this,this._alertAfter):void this._sendAjax(r,i,t.currentTarget)},Page.prototype._alertAfter=function(t,e,i){},Page.prototype._showBuyNowOptionLayer=function(t){var e=$(".product-attributes").length;if($(t.currentTarget).hasClass("buyNow")&&(this._buyNow=!0),e>0&&""==$("#checkout-after-data").val())this._optionOverlay.open();else if(0==e&&""==$("#num_id").val())this._optionOverlay.open();else{var i=$("#sku_id").val(),s=$(".weui_input.counter-input").val();this._sendAjax(s,i,t.currentTarget)}},Page.prototype._sendAjax=function(t,e,i){if(!this._isAjax){this._isAjax=!0,$(i).hasClass("buyNow")&&(this._buyNow=!0);var s=$('meta[name="csrf-token"]').attr("content");$.ajax({type:"post",url:this._appConfigParam.POST_URL,data:{id:$("#goods_id").val(),sid:$("#share_id").val(),num:t,sku:e,_csrf:s},dataType:"json",success:this._confirmAjax})}},Page.prototype._confirmAjax=function(t,e,i){if(this._isAjax=!1,1==t.status){if($("#checkout-after-data").val(t.data),this._buyNow)return void $("#order-form").submit();this._optionOverlay.close()}else WeAlert("温馨提示",t.message,this,this._alertAfter,{})},Page.prototype._viewPullUpHandler=function(t){var e=Math.min(this._distance,Math.max(0,-this._mainContainer.scrollHeight-this._mainContainer.scrollY)),i=Math.max(44,.75*e);!this._isShowMore&&i>=this._threshold&&(this._isShowMore=!0,this._showMorePage(),this._showToolbar(),this._showTopbar())},Page.prototype._sidePullUpHandler=function(t){var e=Math.min(this._distance,Math.max(0,this._sideContainer.scrollY)),i=Math.max(44,.75*e);this._isShowMore&&i>=this._threshold&&(this._isShowMore=!1,this._showMainPage(),this._mainContainer.scrollY=0,this._avatar.y=0)},Page.prototype._sidePullDownHandler=function(){var t=Math.max(0,-this._sideContainer.scrollHeight-this._sideContainer.scrollY);t>=this._threshold&&(this._showTopbar(),this._showToolbar())},Page.prototype._viewScrollHandler=function(t){if(this._isIOS){var e=this._intros.natural.getBoundingClientRect().top,i=Math.min(this._avatar.height+this._avatarOverlay,e);this._avatar.y=i-(this._avatar.height+this._avatarOverlay),this._resetAvatarTransition||(this._resetAvatarTransition=!0,this._avatar.natural.style.transition=this._avatar.natural.style.webkitTransition="none"),this._swiperSprite.y=Math.min(this._swiperSprite.height,.5*Math.max(0,-this._mainContainer.scrollY))}else{var s=this._mainContainer.scrollY,r=window.innerWidth-154;-r>=s?this._avatar.natural.style.display="none":this._avatar.natural.style.display="block"}var o=Math.min(this._distance,Math.max(0,-this._mainContainer.scrollHeight-this._mainContainer.scrollY)),n=Math.max(44,.75*o);this._isIOS&&(this._morePromptsSprite.y=.25*o),n>=this._threshold?(this._morePromptsSprite.element.find(".text").text("释放手指，加载图文详情"),this._morePromptsSprite.element.find(".loading").addClass("fade-in")):(this._morePromptsSprite.element.find(".text").text("继续拖动，查看图文详情"),this._morePromptsSprite.element.find(".loading").removeClass("fade-in"))},Page.prototype._sideScrollHandler=function(t){},Page.prototype._dragSideViewHandler=function(t){if(t.vy>0){this._showToolbar(),this._showTopbar();var e=Preferences.get("showToptip",!0)||0;!e&&-this._sideContainer.scrollY>=this._allowScrollSize+this._fadeTopDistance&&(Preferences.set("showToptip",1,!0),this._topbar.natural.classList.add("tooltip-showing"))}else this._hideTopbar(),this._hideToolbar()},Page.prototype._topbarClickHandler=function(t){this._isShowMore&&(this._isShowMore=!1,this._showMainPage(),this._mainContainer.scrollY=0,this._avatar.y=0)},Page.prototype._showMorePage=function(){this._mainContainer.y=-this.height,this._sideContainer.y=-this.height},Page.prototype._showMainPage=function(){this._mainContainer.y=0,this._sideContainer.y=0},Page.prototype._showToolbar=function(){this._toolbar.natural.classList.add("toolbar-showing")},Page.prototype._hideToolbar=function(){this._toolbar.natural.classList.remove("toolbar-showing")},Page.prototype._showTopbar=function(){this._topbar.natural.classList.add("topbar-showing")},Page.prototype._hideTopbar=function(){this._topbar.natural.classList.remove("topbar-showing")},Page.prototype._showOptionLayer=function(){this._optionOverlay.open()},Page.prototype._showSpecLayer=function(){this._specOverlay.open()},Page.prototype._cancelOverlayHandler=function(t){t.preventDefault(),t.stopPropagation(),this.close()},Page.prototype._showShareTipLayer=function(t){this._shareTipLayer||(this._shareTipLayer=document.createElement("div"),this._shareTipLayer.className="share-layer",this._shareTipLayer.addEventListener("click",function(t){document.body.removeChild(this)})),document.body.appendChild(this._shareTipLayer)};if(typeof Page == "function" && !document.currentPage){domain.currentPage=new Page();}}(this||window));
//# sourceMappingURL=detail.js.map
