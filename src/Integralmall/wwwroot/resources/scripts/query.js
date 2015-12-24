(function(domain,undefined){"use strict";function derive(t,e){if("function"==typeof t){for(var i=Object.create(t.prototype),s=e.prototype,r=Object.getOwnPropertyNames(s),l={},a=0;a<r.length;++a)l[r[a]]=Object.getOwnPropertyDescriptor(s,r[a]);return e.prototype=i,Object.defineProperties(e.prototype,l),e}}function template(t,e){return e?(""+t).replace(/\{\{\s*([^\}\s]+)\s*\}\}/g,function(t,i,s,r){return i in e?e[i]:t}):t}function EventPhase(){throw new Error("无法创建常量枚举类型的实例。")}function Event(t,e,i){this._type=t,this._bubbles=e,this._cancelable=i,this._target=null,this._currentTarget=null,this._eventPhase=EventPhase.NONE,this._defaultPrevented=!1,this._needStopPropagation=!1,this._needStopImmediatePropagation=!1}function EventListener(t,e){this._handler=t,this._priority=e||0}function EventDispatcher(t){this._dispatcherCaptureRegister={},this._dispatcherBubbleRegister={},this._dispatcherRelatedTarget=t||this}function ScrollDirection(){throw new Error("无法创建静态类型的实例。")}Object.defineProperties(EventPhase,{NONE:{value:0},CAPTURING_PHASE:{value:1},AT_TARGET:{value:2},BUBBLING_PHASE:{value:3}}),Object.defineProperties(Event.prototype,{type:{get:function(){return this._type}},bubbles:{get:function(){return this._bubbles}},cancelable:{get:function(){return this._cancelable}},target:{get:function(){return this._target}},currentTarget:{get:function(){return this._currentTarget}},eventPhase:{get:function(){return this._eventPhase}},defaultPrevented:{get:function(){return this._defaultPrevented}}}),Event.prototype.preventDefault=function(){this._cancelable&&(this._defaultPrevented=!0)},Event.prototype.stopPropagation=function(){this._needStopPropagation=!0},Event.prototype.stopImmediatePropagation=function(){this._needStopPropagation=!0,this._needStopImmediatePropagation=!0},Object.defineProperties(EventListener.prototype,{priority:{get:function(){return this._priority}},handler:{get:function(){return this._handler}}}),EventListener.prototype.handleEvent=function(t){return"function"==typeof this._handler?this._handler.call(t.currentTarget,t):this._handler.handleEvent(t)},EventDispatcher.prototype.addEventListener=function(t,e,i,s){this.removeEventListener(t,e,i),this._dispatcherCaptureRegister[t]||(this._dispatcherCaptureRegister[t]=[]),this._dispatcherBubbleRegister[t]||(this._dispatcherBubbleRegister[t]=[]);var r=i?this._dispatcherCaptureRegister[t]:this._dispatcherBubbleRegister[t],e=new EventListener(e,s);if(!r.length||e.priority<=r[r.length-1].priority)r.push(e);else for(var l=0,a=r.length;a>l;++l)if(e.priority>r[l].priority){r.splice(l,0,e);break}},EventDispatcher.prototype.removeEventListener=function(t,e,i){var s=i?this._dispatcherCaptureRegister[t]:this._dispatcherBubbleRegister[t];if(s&&s.length)for(var r=0,l=s.length;l>r;++r)if(e===s[r].handler)return void s.splice(r,1)},EventDispatcher.prototype.hasEventListener=function(t){return this._dispatcherCaptureRegister.hasOwnProperty(t)&&this._dispatcherCaptureRegister[t].length>=1||this._dispatcherBubbleRegister.hasOwnProperty(t)&&this._dispatcherBubbleRegister[t].length>=1},EventDispatcher.prototype.willTrigger=function(t){if(this.hasEventListener(t))return!0;for(var e;e=e.parent;)if(e.hasEventListener(t))return!0;return!1},EventDispatcher.prototype.dispatchEvent=function(t){if(t.eventPhase!==EventPhase.NONE)throw new Error("无效的事件对象。");if(!t.bubbles||!this.parent)return t._target=this._dispatcherRelatedTarget,t._currentTarget=this._dispatcherRelatedTarget,t._eventPhase=EventPhase.AT_TARGET,this._dispatchEvent(t),!t.defaultPrevented;for(var e=[],i=this;i=i.parent;)e.push(i);for(var s=e.length,r=[],l=e.length-1;l>=0;--l)r.push(e[l]);r.push(this);for(var l=0;l<e.length;++l)r.push(e[l]);for(var l=0;l<r.length&&!t._needStopPropagation;++l)t._target=this._dispatcherRelatedTarget,t._currentTarget=r[l]._dispatcherRelatedTarget,t._eventPhase=s==l?EventPhase.AT_TARGET:l>s?EventPhase.BUBBLING_PHASE:EventPhase.CAPTURING_PHASE,r[l]._dispatchEvent(t);return!t.defaultPrevented&&!t._needStopPropagation},EventDispatcher.prototype._dispatchEvent=function(t){var e=[];t.eventPhase==EventPhase.CAPTURING_PHASE&&(e=e.concat(this._dispatcherCaptureRegister[t.type]||[])),t.eventPhase==EventPhase.AT_TARGET&&(e=e.concat(this._dispatcherCaptureRegister[t.type]||[]),e=e.concat(this._dispatcherBubbleRegister[t.type]||[])),t.eventPhase==EventPhase.BUBBLING_PHASE&&(e=e.concat(this._dispatcherBubbleRegister[t.type]||[]));for(var i=0;i<e.length&&!t._needStopImmediatePropagation;++i)e[i].handleEvent(t)};var Sprite=derive(EventDispatcher,function t(e){if(EventDispatcher.call(this),this._element=$(e),this._natural=this._element[0],this._scaleX=1,this._scaleY=1,this._rotation=0,this._translateX=0,this._translateY=0,this._hrwAccelEnabled=!0,1!=this._element.length)throw new Error("当前选择器选中了零个或多个元素，但 Sprite 必须且只能包含有一个有效的元素。");t.reg(this)});Object.defineProperties(Sprite.prototype,{element:{get:function(){return this._element}},natural:{get:function(){return this._natural}},hrwAccelEnabled:{get:function(){return this._hrwAccelEnabled},set:function(t){this._hrwAccelEnabled=t}},width:{get:function(){return this.natural.clientWidth}},height:{get:function(){return this.natural.clientHeight}},x:{get:function(){return this._translateX},set:function(t){this._translateX=t,this._applyTransform()}},y:{get:function(){return this._translateY},set:function(t){this._translateY=t,this._applyTransform()}},scaleX:{get:function(){return this._scaleX},set:function(t){this._scaleX=t,this._applyTransform()}},scaleY:{get:function(){return this._scaleY},set:function(t){this._scaleY=t,this._applyTransform()}},rotation:{get:function(){return this._rotation},set:function(t){this._rotation=t,this._applyTransform()}}}),Sprite.prototype._applyTransform=function(){this._setTransform("scale("+this._scaleX+","+this._scaleY+")rotate("+this._rotation+"deg)translateX("+this._translateX+"px)translateY("+this._translateY+"px)"+(this._hrwAccelEnabled?"translateZ(0px)":""))},Sprite.prototype._setTransform=function(t){this.natural.style.transform=this.natural.style.webkitTransform=t},Sprite.prototype.transform=function(t,e,i,s,r){null!==t&&"undefined"!=typeof t&&(this._translateX=t),null!==e&&"undefined"!=typeof e&&(this._translateY=e),null!==i&&"undefined"!=typeof i&&(this._scaleX=i),null!==s&&"undefined"!=typeof s&&(this._scaleY=s),null!==r&&"undefined"!=typeof r&&(this._rotation=r),this._applyTransform()};var SPID_POINTER=0,SPID_DICTION={};Sprite.reg=function(t){if(!(t instanceof Sprite))throw new Error("Sprite: reg() 方法的注册对象必须为 Sprite 类型的实例。");return SPID_DICTION[SPID_POINTER]=t,t.natural.setAttribute("data-sprite",SPID_POINTER++),t},Sprite.get=function(t){return null===t||"undefined"==typeof t?null:"object"==typeof t?"function"==typeof t.getAttribute?SPID_DICTION[t.getAttribute("data-sprite")]||null:SPID_DICTION[t[0].getAttribute("data-sprite")]||null:SPID_DICTION[""+t]||null},Sprite.cls=function(t){if(null!==t&&"undefined"!=typeof t){if(t instanceof Sprite)return void(SPID_DICTION[t.natural.getAttribute("data-sprite")]=null);"object"==typeof t&&("function"==typeof t.getAttribute?SPID_DICTION[t.getAttribute("data-sprite")]=null:SPID_DICTION[t[0].getAttribute("data-sprite")]=null),SPID_DICTION[""+t]=null}};var requestAnimation=window.requestAnimationFrame||window.webkitRequestAnimationFrame,cancelAnimation=window.cancelAnimationFrame||window.webkitCancelAnimationFrame;Object.defineProperties(ScrollDirection,{NONE:{value:0},X_AXIS:{value:1},Y_AXIS:{value:2},Z_AXIS:{value:3},XY_AXIS:{value:4},XZ_AXIS:{value:5},YZ_AXIS:{value:6},LEFT:{value:16},RIGHT:{value:17},UP:{value:18},DOWN:{value:19},IN:{value:20},OUT:{value:21}});var ScrollContainer=derive(Sprite,function(t){Sprite.call(this,t),this._content=new Sprite(this._element.children("content")),this._scrollX=0,this._scrollY=0,this._scrollRealX=0,this._scrollRealY=0,this._bounces=!0,this._scrollXEnabled=!1,this._scrollYEnabled=!0,this._scrollXIndicator=null,this._scrollYIndicator=null,this._scrollXTracker=null,this._scrollYTracker=null,this._disableIndicator=!1,this._resizeIndicator=!0,this._contentWidth=0,this._contentHeight=0,this._viewportWidth=0,this._viewportHeight=0,this._lockAtDir=ScrollDirection.NONE,this._startXval=0,this._startYval=0,this._speedXval=0,this._speedYval=0,this._amplsXval=0,this._amplsYval=0,this._touchXval=0,this._touchYval=0,this._targtXval=0,this._targtYval=0,this._velocXval=0,this._velocYval=0,this._distsXval=0,this._distsYval=0,this._forceXval=0,this._forceYval=0,this._edgesXval=0,this._edgesYval=0,this._tickerInt=0,this._timestamp=0,this._pullstamp=0,this._scrollInt=0,this._pullbkInt=0,this._bounceInt=0,this._threshold=5,this._timedelay=0,this._amplsFactor=.5,this._timeConstant=875,this._elasticFactor=.35,this._bouncesFactor=.05,this._timePullFactor=.15,this._forceDamping=.85,this._speedThreshold=10,this._maxTopEdgeBounces=-1,this._doAutoScroll=this._doAutoScroll.bind(this),this._doPullback=this._doPullback.bind(this),this._doForceBounces=this._doForceBounces.bind(this),this._doScrollTo=this._doScrollTo.bind(this),this._calcTouchesSpeed=this._calcTouchesSpeed.bind(this),this._calcTouchesPosition=this._calcTouchesPosition.bind(this),this._drawScrollContainer=this._drawScrollContainer.bind(this),this._initScrollContainer()});Object.defineProperties(ScrollContainer.prototype,{scrollX:{get:function(){return this._scrollX},set:function(t){this._scrollX=t,this._scrollX>>0!==this._scrollRealX&&(this._scrollRealX=this._scrollX>>0,this._drawScrollPosition())}},scrollY:{get:function(){return this._scrollY},set:function(t){this.maxTopEdgeBounces>=0&&(t=Math.min(this.maxTopEdgeBounces,t)),this._scrollY=t,this._scrollY>>0!==this._scrollRealY&&(this._scrollRealY=this._scrollY>>0,this._drawScrollPosition())}},bounces:{get:function(){return this._bounces},set:function(t){this._bounces=t}},disableIndicator:{get:function(){return this._disableIndicator},set:function(t){this._disableIndicator=t}},resizeIndicator:{get:function(){return this._resizeIndicator},set:function(t){this._resizeIndicator=t}},scrollWidth:{get:function(){return Math.max(0,this.contentWidth-this.viewportWidth)}},scrollHeight:{get:function(){return Math.max(0,this.contentHeight-this.viewportHeight)}},contentWidth:{get:function(){return this._contentWidth}},contentHeight:{get:function(){return this._contentHeight}},viewportWidth:{get:function(){return this._viewportWidth}},viewportHeight:{get:function(){return this._viewportHeight}},scrollXEnabled:{get:function(){return this._scrollXEnabled},set:function(t){this._scrollXEnabled=t}},scrollYEnabled:{get:function(){return this._scrollYEnabled},set:function(t){this._scrollYEnabled=t}},content:{get:function(){return this._content}},threshold:{get:function(){return this._threshold},set:function(t){this._threshold=t}},maxTopEdgeBounces:{get:function(){return this._maxTopEdgeBounces},set:function(t){this._maxTopEdgeBounces=t}}}),ScrollContainer.prototype.updateFrameSizes=function(){this._contentWidth=this._content.width,this._contentHeight=this._content.height,this._viewportWidth=this.width,this._viewportHeight=this.height},ScrollContainer.prototype._initScrollContainer=function(){this.natural.addEventListener("touchstart",this._drawScrollContainer)},ScrollContainer.prototype._drawScrollPosition=function(){var t=this._content.natural.style;t.transform=t.webkitTransform="translateY("+this._scrollRealY+"px) translateZ(0px)",this.dispatchEvent(new Event("scroll",!1,!1))},ScrollContainer.prototype._setScrollPosition=function(t,e){},ScrollContainer.prototype._setupTouchEvents=function(t){t?(this.natural.addEventListener("touchmove",this._drawScrollContainer),this.natural.addEventListener("touchend",this._drawScrollContainer),this.natural.addEventListener("touchcancel",this._drawScrollContainer)):(this.natural.removeEventListener("touchmove",this._drawScrollContainer),this.natural.removeEventListener("touchend",this._drawScrollContainer),this.natural.removeEventListener("touchcancel",this._drawScrollContainer))},ScrollContainer.prototype._drawScrollContainer=function(t){if("touchstart"==t.type){var e=this._calcTouchesPosition(t);return this._hasTouched(t,2)?(this._touchXval=e[0],this._touchYval=e[1],this._amplsXval=0,this._amplsYval=0,this._velocXval=0,this._velocYval=0,this._forceXval=0,void(this._forceYval=0)):(this.updateFrameSizes(),cancelAnimation(this._pullbkInt),cancelAnimation(this._scrollInt),cancelAnimation(this._bounceInt),cancelAnimation(this._tickerInt),this._touchXval=e[0],this._touchYval=e[1],this._amplsXval=0,this._amplsYval=0,this._velocXval=0,this._velocYval=0,this._forceXval=0,this._forceYval=0,this._startXval=this.scrollX,this._startYval=this.scrollY,this._tickerInt=requestAnimation(this._calcTouchesSpeed),this._lockAtDir=ScrollDirection.NONE,void this._setupTouchEvents(!0))}if("touchmove"==t.type){var e=this._calcTouchesPosition(t),i=e[0]-this._touchXval,s=e[1]-this._touchYval,r=!1;if(this._lockAtDir==ScrollDirection.NONE&&(Math.abs(i)>this._threshold&&(this._lockAtDir=ScrollDirection.X_AXIS),Math.abs(s)>this._threshold&&(this._lockAtDir==ScrollDirection.X_AXIS?this._lockAtDir=ScrollDirection.XY_AXIS:this._lockAtDir=ScrollDirection.Y_AXIS),this._lockAtDir==ScrollDirection.NONE))return;return!this.scrollXEnabled||this._lockAtDir!=ScrollDirection.X_AXIS&&this._lockAtDir!=ScrollDirection.XY_AXIS||(r=!0,this.scrollX>0||this.scrollX<-this.scrollWidth?this.scrollX=this.scrollX+i*this._elasticFactor:this.scrollX=this.scrollX+i,this._showIndicator(0,1)),!this.scrollYEnabled||this._lockAtDir!=ScrollDirection.Y_AXIS&&this._lockAtDir!=ScrollDirection.XY_AXIS||(r=!0,this.scrollY>0||this.scrollY<-this.scrollHeight?this.scrollY=this.scrollY+s*this._elasticFactor:this.scrollY=this.scrollY+s,this._showIndicator(1,1)),r&&(t.preventDefault(),t.stopPropagation()),this._touchXval=e[0],void(this._touchYval=e[1])}if("touchend"!=t.type&&"touchcancel"!=t.type);else{if(this._hasTouched(t,1)){var e=this._calcTouchesPosition(t);return this._touchXval=e[0],void(this._touchYval=e[1])}cancelAnimation(this._pullbkInt),cancelAnimation(this._scrollInt),cancelAnimation(this._bounceInt),cancelAnimation(this._tickerInt),this._setupTouchEvents(!1);var l=!1,a=!1,o=!1;if(this.scrollXEnabled&&this.scrollX>0?(l=!0,this._amplsXval=-this.scrollX,this._targtXval=this.scrollX+this._amplsXval):this.scrollXEnabled&&this.scrollX<-this.scrollWidth&&(l=!0,this._amplsXval=-this.scrollWidth-this.scrollX,this._targtXval=this.scrollX+this._amplsXval),this.scrollYEnabled&&this.scrollY>0?(a=!0,this._amplsYval=-this.scrollY,this._targtYval=this.scrollY+this._amplsYval):this.scrollYEnabled&&this.scrollY<-this.scrollHeight&&(a=!0,this._amplsYval=-this.scrollHeight-this.scrollY,this._targtYval=this.scrollY+this._amplsYval),l||this._lockAtDir!=ScrollDirection.X_AXIS&&this._lockAtDir!=ScrollDirection.XY_AXIS||(Math.abs(this._speedXval)>=this._speedThreshold?(o=!0,this._velocXval=this._amplsFactor*this._speedXval,this._distsXval=this.scrollX+this._velocXval):this._showIndicator(0,0)),a||this._lockAtDir!=ScrollDirection.Y_AXIS&&this._lockAtDir!=ScrollDirection.XY_AXIS||(Math.abs(this._speedYval)>=this._speedThreshold?(o=!0,this._velocYval=this._amplsFactor*this._speedYval,this._distsYval=this.scrollY+this._velocYval):this._showIndicator(1,0)),this._lockAtDir==ScrollDirection.NONE&&(this._showIndicator(0,0),this._showIndicator(1,0)),(l||a)&&(this._pullstamp=Date.now(),this._pullbkInt=requestAnimation(this._doPullback),this.dispatchEvent(new Event("pull",!1,!1))),o){this._timestamp=Date.now(),this._scrollInt=requestAnimation(this._doAutoScroll);var n=new Event("drag",!1,!1);n.vx=this._velocXval,n.vy=this._velocYval,this.dispatchEvent(n)}}},ScrollContainer.prototype._calcTouchesSpeed=function(){var t=Date.now(),e=t-this._timestamp,i=this.scrollX-this._startXval,s=this.scrollY-this._startYval;this._startXval=this.scrollX,this._startYval=this.scrollY,this._speedXval=.8*(1e3*i/(1+e))+.2*this._speedXval,this._speedYval=.8*(1e3*s/(1+e))+.2*this._speedYval,this._timestamp=t,this._tickerInt=requestAnimation(this._calcTouchesSpeed)},ScrollContainer.prototype._calcTouchesPosition=function(t){return"touchstart"==t.type||"touchend"==t.type||"touchmove"==t.type||"touchcancel"==t.type?this._getAverageOfTouches(t.touches):void 0},ScrollContainer.prototype._getAverageOfTouches=function(t){for(var e=0,i=[0,0];e<t.length;++e)0==e?(i[0]=t[e].clientX,i[1]=t[e].clientY):(i[0]=.5*(i[0]+t[e].clientX),i[1]=.5*(i[1]+t[e].clientY));return i},ScrollContainer.prototype._hasTouched=function(t,e){return"touchstart"==t.type||"touchmove"==t.type||"touchend"==t.type||"touchcancel"==t.type?t.touches.length>=e:!1},ScrollContainer.prototype._doAutoScroll=function(){var t=Math.exp((this._timestamp-Date.now())/this._timeConstant),e=0,i=!1,s=!1;this._velocXval&&(e=-this._velocXval*t,Math.abs(e)>=.5?(i=!0,e=this._distsXval+e,this._forceXval=.8*(e-this.scrollX)+.2*this._forceXval,this.scrollX=e,this._showIndicator(0,1)):(e=this._distsXval,this._forceXval=.8*(e-this.scrollX)+.2*this._forceXval,this.scrollX=e,this._velocXval=0,this._showIndicator(0,0)),(e>0||e<-this.scrollWidth)&&(i=!1,this._velocXval=0,this.scrollX=e>0?0:-this.scrollWidth,this._bounces&&(s=!0,this._edgesXval=e>0?0:e<-this.scrollWidth?-this.scrollWidth:0))),this._velocYval&&(e=-this._velocYval*t,Math.abs(e)>=.5?(i=!0,e=this._distsYval+e,this._forceYval=.8*(e-this.scrollY)+.2*this._forceYval,this.scrollY=e,this._showIndicator(1,1)):(e=this._distsYval,this._forceYval=.8*(e-this.scrollY)+.2*this._forceYval,this.scrollY=e,this._velocYval=0,this._showIndicator(1,0)),(e>0||e<-this.scrollHeight)&&(i=!1,this._velocYval=0,this.scrollY=e>0?0:-this.scrollHeight,this._bounces&&(s=!0,this._edgesYval=e>0?0:e<-this.scrollHeight?-this.scrollHeight:0))),i&&(this._pullbkInt=requestAnimation(this._doAutoScroll)),s&&(cancelAnimation(this._bounceInt),this._bounceInt=requestAnimation(this._doForceBounces))},ScrollContainer.prototype._doPullback=function(){var t=Math.exp((this._pullstamp-Date.now())/(this._timeConstant*this._timePullFactor)),e=0,i=!1;this._amplsXval&&(e=-this._amplsXval*t,Math.abs(e)>=.5?(i=!0,this.scrollX=this._targtXval+e,this._showIndicator(0,1)):(this.scrollX=this._targtXval,this._amplsXval=0,this._showIndicator(0,0))),this._amplsYval&&(e=-this._amplsYval*t,Math.abs(e)>=.5?(i=!0,this.scrollY=this._targtYval+e,this._showIndicator(1,1)):(this.scrollY=this._targtYval,this._amplsYval=0,this._showIndicator(1,0))),i&&(this._pullbkInt=requestAnimation(this._doPullback))},ScrollContainer.prototype._doForceBounces=function(){var t=0,e=0,i=!1;!this._velocXval&&this._forceXval&&(t=(this._edgesXval-this.scrollX)*this._bouncesFactor,this._forceXval+=t,this._forceXval*=this._forceDamping,Math.abs(this._forceXval)>=.001?(i=!0,this.scrollX+=this._forceXval*this._elasticFactor,this._showIndicator(0,1)):(this._forceXval=0,this.scrollX=this._edgesXval,this._showIndicator(0,0))),!this._velocYval&&this._forceYval&&(e=(this._edgesYval-this.scrollY)*this._bouncesFactor,this._forceYval+=e,this._forceYval*=this._forceDamping,Math.abs(this._forceYval)>=.001?(i=!0,this.scrollY+=this._forceYval*this._elasticFactor,this._showIndicator(1,1)):(this._forceYval=0,this.scrollY=this._edgesYval,this._showIndicator(1,0))),i&&(this._bounceInt=requestAnimation(this._doForceBounces))},ScrollContainer.prototype.scrollTo=function(t,e,i){this._stopAllDelayTimer(),this._distsXval=e,this._distsYval=i,this._velocXval=this._distsXval-this.scrollX,this._velocYval=this._distsYval-this.scrollY,this._timedelay=t,this._timestamp=Date.now(),this._scrollInt=requestAnimation(this._doScrollTo)},ScrollContainer.prototype._doScrollTo=function(){var t=Date.now()-this._timestamp,e=!1;t<this._timedelay&&this._timedelay>0?(Math.abs(this._velocXval)>.001&&(e=!0,this.scrollX=this._distsXval-this._velocXval+this._velocXval*(t/this._timedelay)),Math.abs(this._velocYval)>.001&&(e=!0,this.scrollY=this._distsYval-this._velocYval+this._velocYval*(t/this._timedelay)),e&&(this._scrollInt=requestAnimation(this._doScrollTo))):(this.scrollX=this._distsXval,this.scrollY=this._distsYval)},ScrollContainer.prototype._stopAllDelayTimer=function(){cancelAnimation(this._pullbkInt),cancelAnimation(this._scrollInt),cancelAnimation(this._bounceInt),cancelAnimation(this._tickerInt)},ScrollContainer.prototype._showIndicator=function(t,e){this._disableIndicator||(this._createIndicator(),0==t&&this._scrollXTracker&&(1==e?(this._updateIndicator(t),this._scrollXTracker.natural.classList.remove("scroll-track-showing")):this._scrollXTracker.natural.classList.remove("scroll-track-showing")),1==t&&this._scrollYTracker&&(1==e?(this._updateIndicator(t),this._scrollYTracker.natural.classList.add("scroll-track-showing")):this._scrollYTracker.natural.classList.remove("scroll-track-showing")))},ScrollContainer.prototype._createIndicator=function(){this.scrollXEnabled&&!this._scrollXIndicator&&(this._scrollXTracker=new Sprite(document.createElement("div")),this._scrollXTracker.natural.className="scroll-track scroll-x-track",this._scrollXIndicator=new Sprite(document.createElement("div")),this._scrollXIndicator.natural.className="scroll-indicator",this._scrollXTracker.natural.appendChild(this._scrollXIndicator.natural),this.natural.appendChild(this._scrollXTracker.natural)),this.scrollYEnabled&&!this._scrollYIndicator&&(this._scrollYTracker=new Sprite(document.createElement("div")),this._scrollYTracker.natural.className="scroll-track scroll-y-track",this._scrollYIndicator=new Sprite(document.createElement("div")),this._scrollYIndicator.natural.className="scroll-indicator",this._scrollYTracker.natural.appendChild(this._scrollYIndicator.natural),this.natural.appendChild(this._scrollYTracker.natural))},ScrollContainer.prototype._updateIndicator=function(t){if(0==t){var e=this.viewportWidth<=0||this.contentWidth<=0?0:this.viewportWidth/this.contentWidth,i=this.scrollX>0?0:this.scrollX<-this.scrollWidth?this.scrollWidth:-this.scrollX,s=this.scrollWidth<=0?this.scrollY>=0?0:1:i/this.scrollWidth;if(this.resizeIndicator){var r=this._scrollXTracker.width*e,l=this.scrollX>0?this.scrollX:this.scrollX<-this.scrollWidth?-this.scrollWidth-this.scrollX:0;l=0>=r?0:1-Math.min(1,l/r),this._scrollXIndicator.natural.style.width=r*l+"px"}this._scrollXIndicator.x=Math.max(0,this._scrollXTracker.width-this._scrollXIndicator.width)*s}if(1==t){var e=this.viewportHeight<=0||this.contentHeight<=0?0:this.viewportHeight/this.contentHeight,i=this.scrollY>0?0:this.scrollY<-this.scrollHeight?this.scrollHeight:-this.scrollY,s=this.scrollHeight<=0?this.scrollY>=0?0:1:i/this.scrollHeight;if(this.resizeIndicator){var a=this._scrollYTracker.height*e,o=this.scrollY>0?this.scrollY:this.scrollY<-this.scrollHeight?-this.scrollHeight-this.scrollY:0;o=0>=a?0:1-Math.min(1,o/a),this._scrollYIndicator.natural.style.height=a*o+"px"}this._scrollYIndicator.y=Math.max(0,this._scrollYTracker.height-this._scrollYIndicator.height)*s}};var PageBase=derive(Sprite,function(t){Sprite.call(this,document.body),this._appConfigParam=domain.APP_CONFIG_PARAMS||{},t||(this._mainContainer=new ScrollContainer("#main")),window.addEventListener("load",function(t){document.body.classList.add("body-load")})}),Page=derive(PageBase,function(){PageBase.call(this,!0),this._querySwiper=new Swiper("#querySwiper",{threshold:5,pagination:document.getElementById("queryNav"),paginationClickable:!0,bulletClass:"query-button",preventClicksPropagation:!1,preventClicks:!1,touchMoveStopPropagation:!1,bulletActiveClass:"selected",paginationBulletRender:function(t,e){var i=["所有订单","未付款","已付款","待收货","交易完成"];return'<a class="'+e+'" href="javascript:void(0);"><span class="query-label">'+i[t]+"</span></a>"}}),this._allOrder=new ScrollContainer("#allOrder"),this._notPayOrder=new ScrollContainer("#notPayOrder"),this._hasPayOrder=new ScrollContainer("#hasPayOrder"),this._flowOrder=new ScrollContainer("#flowOrder"),this._doneOrder=new ScrollContainer("#doneOrder"),this._allListContainer=[this._allOrder,this._notPayOrder,this._hasPayOrder,this._flowOrder,this._doneOrder],this._allListFillData=[!1,!1,!1,!1,!1],this._allListStatus=[!1,!1,!1,!1,!1],this._allListPageNum=[1,1,1,1,1],this._allListPageSize=[5,5,5,5,5],this._allListURL=this._appConfigParam.ALL_LIST_URL||"http://quanqiugou.cn/user-message/order-list-ajax?order_type={{pageId}}&pageNo={{pageNum}}&pageSize={{pageSize}}",this._tmplOrderItem=$("#tmplOrderItem").html(),this._tmplOrderGoods=$("#tmplOrderGoods").html(),this._listScrollHandler=this._listScrollHandler.bind(this),this._fetchFirstPageHandler=this._fetchFirstPageHandler.bind(this),this._fetchPageOrderListSuccess=this._fetchPageOrderListSuccess.bind(this),this._fetchPageOrderListFailure=this._fetchPageOrderListFailure.bind(this),this._initPage()});Page.prototype._initPage=function(){this._querySwiper.on("onSlideChangeEnd",this._fetchFirstPageHandler),this._fetchFirstPageHandler(null);for(var t=0;t<this._allListContainer.length;++t){var e=this._allListContainer[t];e.threshold=10,e.addEventListener("scroll",this._listScrollHandler)}},Page.prototype._listScrollHandler=function(t){var e=t.currentTarget,i=e.element.find(".loader-tiper"),s=i[0].clientHeight,r=s-e.scrollHeight;if(e.scrollY<=r){var l=this._allListContainer.indexOf(e);this._fetchPageOrderListData(l,this._allListPageNum[l],this._allListPageSize[l])}},Page.prototype._fetchFirstPageHandler=function(t){var e=this._querySwiper.activeIndex;this._allListFillData[e]||(this._allListFillData[e]=!0,this._fetchPageOrderListData(e,this._allListPageNum[e],this._allListPageSize[e]))},Page.prototype._fetchPageOrderListData=function(t,e,i){if(!this._allListStatus[t]){this._allListStatus[t]=!0,this._allListPageNum[t]++,this._allListContainer[t].natural.classList.add("show-loading");var s=this._allListURL.replace("{{pageId}}",t).replace("{{pageNum}}",e).replace("{{pageSize}}",i),r=$.ajax({url:s,dataType:"jsonp"});r.fail(this._fetchPageOrderListFailure),r.done(this._fetchPageOrderListSuccess),r.data={pageId:t,pageNum:e,pageSize:i};var t=r.data.pageId,l=this._allListContainer[t],a=l.element.find(".loader-tiper");a.children(".loader-text").text("加载数据中")}},Page.prototype._fetchPageOrderListFailure=function(t){var e=t.data.pageId,i=this._allListContainer[e],s=i.element.find(".loader-tiper");s.children(".loader-text").text("加载失败"),this._disablePageOrderLoader(e),this._allListStatus[e]=!1},Page.prototype._fetchPageOrderListSuccess=function(t,e,i){var s=i.data.pageId,r=this._allListContainer[s],l=r.element.find(".loader-tiper");l.children(".loader-text").text("加载完成"),"0"==t.code&&this._redenPageOrderList(t.list,i),this._allListStatus[s]=!1,r.updateFrameSizes()},Page.prototype._redenPageOrderList=function(t,e){var i=e.data.pageId,s=(e.data.pageNum,e.data.pageSize),r=this._allListContainer[i],l=r.element.find(".loader-tiper");if(t&&t.length)for(var a=0;a<t.length;++a)$(this._rendenPageOrderItem(t[a])).insertBefore(l);(!t||t.length<s)&&this._disablePageOrderLoader(i)},Page.prototype._disablePageOrderLoader=function(t){var e=this._allListContainer[t],i=e.element.find(".loader-tiper");i.remove(),e.removeEventListener("scroll",this._listScrollHandler),e.element.find(".order-cells").length>0||e.natural.classList.add("no-data")},Page.prototype._rendenPageOrderItem=function(t){return t.status=5==t.status?"order-done-status":"",t.list=this._rendenPageOrderGoods(t.list),template(this._tmplOrderItem,t)},Page.prototype._rendenPageOrderGoods=function(t){for(var e="",i=0;i<t.length;++i)t[i].show_market_class=null===t[i].market_price||"undefined"==typeof t[i].market_price?"hidden-origin":"",e+=template(this._tmplOrderGoods,t[i]);return e};if(typeof Page == "function" && !document.currentPage){domain.currentPage=new Page();}}(this||window));
//# sourceMappingURL=query.js.map
