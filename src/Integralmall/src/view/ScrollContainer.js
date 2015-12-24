/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2015 Samlv9 and other contributors.
/// @MIT-LICENSE | dev-1.0.0 | http://samlv9.com/
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
///                                              }|
///                                              }|
///                                              }|     　 へ　　　 ／|    
///      _______     _______         ______      }|      /　│　　 ／ ／
///     /  ___  |   |_   __ \      .' ____ '.    }|     │　Z ＿,＜　／　　 /`ヽ
///    |  (__ \_|     | |__) |     | (____) |    }|     │　　　　　ヽ　　 /　　〉
///     '.___`-.      |  __ /      '_.____. |    }|      Y　　　　　`　 /　　/
///    |`\____) |    _| |  \ \_    | \____| |    }|    ｲ●　､　●　　⊂⊃〈　　/
///    |_______.'   |____| |___|    \______,'    }|    ()　 v　　　　|　＼〈
///    |=========================================\|    　>ｰ ､_　 ィ　 │ ／／
///    | LESS IS MORE!                           ||     / へ　　 /　ﾉ＜|＼＼
///    `=========================================/|    ヽ_ﾉ　　(_／　 │／／
///                                              }|     7　　　　　　  |／
///                                              }|     ＞―r￣￣`ｰ―＿`
///                                              }|
///                                              }|
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
/// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
/// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
/// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
/// THE SOFTWARE.
///
/// <reference path='../core/derive.js' />
/// <reference path='../core/timing.js' />
/// <reference path='../events/Event.js' />
/// <reference path='./Sprite.js' />
/// <reference path='./ScrollDirection.js' />


var ScrollContainer = derive(Sprite, function ScrollContainer( selector ) {
    /// <summary>
    /// 自定义滚动容器。</summary>
    Sprite.call(this, selector);

    this._content = new Sprite(this._element.children("content"));
    this._scrollX = 0;
    this._scrollY = 0;
    this._scrollRealX = 0;
    this._scrollRealY = 0;
    this._bounces = true;
    this._scrollXEnabled = false;
    this._scrollYEnabled = true;
    this._scrollXIndicator = null;
    this._scrollYIndicator = null;
    this._scrollXTracker = null;
    this._scrollYTracker = null;
    this._disableIndicator = false;
    this._resizeIndicator  = true;

    /// frame
    this._contentWidth   = 0;
    this._contentHeight  = 0;
    this._viewportWidth  = 0;
    this._viewportHeight = 0;

    this._lockAtDir = ScrollDirection.NONE;
    this._startXval = 0;
    this._startYval = 0;
    this._speedXval = 0;
    this._speedYval = 0;
    this._amplsXval = 0;
    this._amplsYval = 0;
    this._touchXval = 0;
    this._touchYval = 0;
    this._targtXval = 0;
    this._targtYval = 0;
    this._velocXval = 0;
    this._velocYval = 0;
    this._distsXval = 0;
    this._distsYval = 0;
    this._forceXval = 0;
    this._forceYval = 0;
    this._edgesXval = 0;
    this._edgesYval = 0;
    this._tickerInt = 0;
    this._timestamp = 0;
    this._pullstamp = 0;
    this._scrollInt = 0;
    this._pullbkInt = 0;
    this._bounceInt = 0;
    this._threshold = 5;
    this._timedelay = 0;
    this._amplsFactor    = 0.5;
    this._timeConstant   = 875;
    this._elasticFactor  = 0.35;
    this._bouncesFactor  = 0.05;
    this._timePullFactor = 0.15;
    this._forceDamping   = 0.85;
    this._speedThreshold = 10;
    //this._lastUpdateTime = -1;
    this._maxTopEdgeBounces = -1;
    this._doAutoScroll        = this._doAutoScroll.bind(this);
    this._doPullback          = this._doPullback.bind(this);
    this._doForceBounces      = this._doForceBounces.bind(this);
    this._doScrollTo          = this._doScrollTo.bind(this);
    this._calcTouchesSpeed    = this._calcTouchesSpeed.bind(this);
    this._calcTouchesPosition = this._calcTouchesPosition.bind(this);
    this._drawScrollContainer = this._drawScrollContainer.bind(this);

    this._initScrollContainer();
});


Object.defineProperties(ScrollContainer.prototype, {
    /// <filed type='Number'>
    /// 获取/设置容器的 X 轴滚动位置。</field>
    scrollX: {
        get: function () { return this._scrollX; },
        set: function( value ) {
            this._scrollX = value;

            if ( (this._scrollX >> 0) !== (this._scrollRealX) ) {
                this._scrollRealX = this._scrollX >> 0;
                this._drawScrollPosition();
            }
        }
    },

    /// <filed type='Number'>
    /// 获取/设置容器的 Y 轴滚动位置。</field>
    scrollY: {
        get: function () { return this._scrollY; },
        set: function( value ) {
            if ( this.maxTopEdgeBounces >= 0 ) {
                value = Math.min(this.maxTopEdgeBounces, value);
            }

            this._scrollY = value;

            if ( (this._scrollY >> 0) !== (this._scrollRealY) ) {
                this._scrollRealY = this._scrollY >> 0;
                this._drawScrollPosition();
            }
        }
    },

    /// <field type='Number'>
    /// 指定滚动至边缘时，是立刻停止还是执行回弹效果。</field>
    bounces: {
        get: function () { return this._bounces; },
        set: function( value ) { this._bounces = value; }
    },

    /// <field type='Number'>
    /// 指示是否显示滚动位置指示器。</field>
    disableIndicator: {
        get: function () { return this._disableIndicator; },
        set: function( value ) {
            this._disableIndicator = value;
        }
    },

    /// <field type='Boolean'>
    /// 指示是否动态调整滚动位置指示器的大小。</field>
    resizeIndicator: {
        get: function () { return this._resizeIndicator; },
        set: function( value ) {
            this._resizeIndicator = value;
        }
    },

    /// <field type='Number'>
    /// 获取最大 X 轴滚动范围。（注意：计算百分比时，0 不能作为分母！）</field>
    scrollWidth: {
        get: function () { return Math.max(0, this.contentWidth - this.viewportWidth); }
    },

    /// <field type='Number'>
    /// 获取最大 Y 轴滚动范围。（注意：计算百分比时，0 不能作为分母！）</field>
    scrollHeight: {
        get: function () { return Math.max(0, this.contentHeight - this.viewportHeight); }
    },

    /// <field type='Number'>
    /// 获取内容区的宽度。</field>
    contentWidth: {
        get: function () { return this._contentWidth; }
    },

    /// <field type='Number'>
    /// 获取内容区的高度。</field>
    contentHeight: {
        get: function () { return this._contentHeight; }
    },

    /// <filed type='Number'>
    /// 获取滚动区域的宽度。</field>
    viewportWidth: {
        get: function () { return this._viewportWidth; }
    },

    /// <field type='Number'>
    /// 获取滚动区域的高度。</field>
    viewportHeight: {
        get: function () { return this._viewportHeight; }
    },

    /// <field type='Boolean'>
    /// 获取/设置是否允许容器在 X 轴滚动。</field>
    scrollXEnabled: {
        get: function () { return this._scrollXEnabled; },
        set: function( value ) { this._scrollXEnabled = value; }
    },

    /// <field type='Boolean'>
    /// 获取/设置是否允许容器在 Y 轴滚动。</field>
    scrollYEnabled: {
        get: function () { return this._scrollYEnabled; },
        set: function( value ) { this._scrollYEnabled = value; }
    },

    /// <field type='HTMLElement'>
    /// 获取内容元素容器对象。</field>
    content: {
        get: function () { return this._content; }
    },

    /// <field type='Number'>
    /// 设置 touchmove 阀值。</field>
    threshold: {
        get: function () { return this._threshold; },
        set: function( value ) { this._threshold = value; }
    },

    /// <field type='Number'>
    /// 限制头部最大可拉动距离。</field>
    maxTopEdgeBounces: {
        get: function () { return this._maxTopEdgeBounces; },
        set: function( value ) {
            this._maxTopEdgeBounces = value;
        }
    }
});


ScrollContainer.prototype.updateFrameSizes = function updateFrameSizes() {
    /// <summary>
    /// 更新滚动条区域；</summary>

    this._contentWidth  = this._content.width;
    this._contentHeight = this._content.height;
    this._viewportWidth = this.width;
    this._viewportHeight= this.height;


    //this._contentWidth  = this._content.natural.scrollWidth;
    //this._contentHeight = this._content.natural.scrollHeight;
    //this._viewportWidth = this._content.natural.offsetWidth;
    //this._viewportHeight= this._content.natural.offsetHeight;
}


ScrollContainer.prototype._initScrollContainer = function _initScrollContainer () {
    /// <summary>
    /// 初始化构造函数。</summary>

    //this._content.natural.addEventListener("touchmove", function( evt ) {
    //    console.log("move");
    //    evt.stopPropagation();

    //});

    this.natural.addEventListener("touchstart",  this._drawScrollContainer);
}


ScrollContainer.prototype._drawScrollPosition = function _drawScrollPosition() {
    /// <summary>
    /// 对元素应用滚动位置属性。</summary>
    
    //this._setScrollPosition(this._scrollRealX, this._scrollRealX);
    //this._content.transform(this._scrollRealX, this._scrollRealY);
    var style = this._content.natural.style;

    style.transform =
    style.webkitTransform = 'translateY(' + this._scrollRealY + 'px) translateZ(0px)';

    /// 调度位置更新事件；
    this.dispatchEvent( new Event("scroll", false, false) );
}


ScrollContainer.prototype._setScrollPosition = function _setScrollPosition( scrollX, scrollY ) {
    /// <summary>
    /// 根据滚动位置更新 DOM 位置。</summary>

    //if ( scrollX > this._maxEdgeBounces ) {
    //    scrollX = this._maxEdgeBounces;
    //}

    //if ( scrollY > this._maxEdgeBounces ) {
    //    scrollY = this._maxEdgeBounces;
    //}

    //if ( scrollX < -this.scrollWidth - this._maxEdgeBounces ) {
    //    scrollX = -this.scrollWidth - this._maxEdgeBounces;
    //}

    //if ( scrollY < -this.scrollHeight - this._maxEdgeBounces ) {
    //    scrollY = -this.scrollHeight - this._maxEdgeBounces;
    //}

    /// TIPS: 子类可自行覆盖实现下拉刷新等效果。
    //this._content.transform(scrollX, scrollY);
    //this._content.natural.scrollTop = -scrollY;
}


ScrollContainer.prototype._setupTouchEvents = function _setupTouchEvents( isSetup ) {
    /// <summary>
    /// 添加/删除滚动容器的 Touch 侦听器。</summary>
    /// <param name='isSetup' type='Boolean'>
    /// 必须，指示是添加侦听器，还是删除侦听器。</param>

    if ( isSetup ) {
        this.natural.addEventListener("touchmove",   this._drawScrollContainer);
        this.natural.addEventListener("touchend",    this._drawScrollContainer);
        this.natural.addEventListener("touchcancel", this._drawScrollContainer);
    }
    
    else {
        this.natural.removeEventListener("touchmove",   this._drawScrollContainer);
        this.natural.removeEventListener("touchend",    this._drawScrollContainer);
        this.natural.removeEventListener("touchcancel", this._drawScrollContainer);
    }
}


ScrollContainer.prototype._drawScrollContainer = function _drawScrollContainer( evt ) {
    /// <summary>
    /// 处理滚动容器触摸事件。</summary>
    
    if ( evt.type == "touchstart" ) {
        var dt = this._calcTouchesPosition(evt);

        if ( this._hasTouched(evt, 2) ) {
            this._touchXval = dt[0];
            this._touchYval = dt[1];
            this._amplsXval = 0;
            this._amplsYval = 0;
            this._velocXval = 0;
            this._velocYval = 0;
            this._forceXval = 0;
            this._forceYval = 0;
            return;
        }

        /// 更新 frame 大小；
        this.updateFrameSizes();

        cancelAnimation(this._pullbkInt);
        cancelAnimation(this._scrollInt);
        cancelAnimation(this._bounceInt);
        cancelAnimation(this._tickerInt);
        
        this._touchXval = dt[0];
        this._touchYval = dt[1];
        this._amplsXval = 0;
        this._amplsYval = 0;
        this._velocXval = 0;
        this._velocYval = 0;
        this._forceXval = 0;
        this._forceYval = 0;
        //this._speedXval = 0;
        //this._speedYval = 0;
        this._startXval = this.scrollX;
        this._startYval = this.scrollY;
        this._tickerInt = requestAnimation(this._calcTouchesSpeed);
        this._lockAtDir = ScrollDirection.NONE;

        this._setupTouchEvents(true);
        //this._showIndicator(0, 0);
        //this._showIndicator(1, 0);
        return;
    }
    
    if ( evt.type == "touchmove" ) {

        var dt = this._calcTouchesPosition(evt);
        var movedXval = dt[0] - this._touchXval;
        var movedYval = dt[1] - this._touchYval;
        var doPrevent = false;
        //var currTime  = Date.now();


        if ( this._lockAtDir == ScrollDirection.NONE ) {
            if ( Math.abs(movedXval) > this._threshold ) {
                this._lockAtDir = ScrollDirection.X_AXIS;
            }

            if ( Math.abs(movedYval) > this._threshold ) {
                if ( this._lockAtDir == ScrollDirection.X_AXIS ) {
                    this._lockAtDir = ScrollDirection.XY_AXIS;
                }

                else {
                    this._lockAtDir = ScrollDirection.Y_AXIS;
                }
            }

            if ( this._lockAtDir == ScrollDirection.NONE ) {
                return;
            }
        }

        if ( this.scrollXEnabled && (this._lockAtDir == ScrollDirection.X_AXIS || this._lockAtDir == ScrollDirection.XY_AXIS) ) {
            doPrevent = true;

            //if ( currTime - this._lastUpdateTime >= 16 ) {
            //    this._lastUpdateTime = currTime;

                if ( this.scrollX > 0 || this.scrollX < -this.scrollWidth ) {
                    this.scrollX = this.scrollX + movedXval * this._elasticFactor;
                }

                else {
                    this.scrollX = this.scrollX + movedXval;
                }

                this._showIndicator(0, 1);
            //}
        } 
            
        if ( this.scrollYEnabled && (this._lockAtDir == ScrollDirection.Y_AXIS || this._lockAtDir == ScrollDirection.XY_AXIS) ) {
            doPrevent = true;
            
            //if ( currTime - this._lastUpdateTime >= 16 ) {
            //    this._lastUpdateTime = currTime;

                if ( this.scrollY > 0 || this.scrollY < -this.scrollHeight ) {
                    this.scrollY = this.scrollY + movedYval * this._elasticFactor;
                }

                else {
                    this.scrollY = this.scrollY + movedYval;
                }

                this._showIndicator(1, 1);
            //}
        }

        if ( doPrevent ) {
            evt.preventDefault();
            evt.stopPropagation();
        }

        this._touchXval = dt[0];
        this._touchYval = dt[1];
        return;
    }

    if ( evt.type == "touchend" || evt.type == "touchcancel" ) {
        if ( this._hasTouched(evt, 1) ) {
            var dt = this._calcTouchesPosition(evt);

            this._touchXval  = dt[0];
            this._touchYval  = dt[1];
            return;
        }
        
        cancelAnimation(this._pullbkInt);
        cancelAnimation(this._scrollInt);
        cancelAnimation(this._bounceInt);
        cancelAnimation(this._tickerInt);

        this._setupTouchEvents(false);

        var doPullXs = false;
        var doPullYs = false;
        var doScroll = false;
        
        if ( this.scrollXEnabled && this.scrollX > 0 ) {
            doPullXs = true;
            this._amplsXval = -this.scrollX;
            this._targtXval = this.scrollX + this._amplsXval;
        }
        
        else if ( this.scrollXEnabled && this.scrollX < -this.scrollWidth ) {
            doPullXs = true;
            this._amplsXval = - this.scrollWidth - this.scrollX;
            this._targtXval = this.scrollX + this._amplsXval;
        }
        
        if ( this.scrollYEnabled && this.scrollY > 0 ) {
            doPullYs = true;
            this._amplsYval = -this.scrollY;
            this._targtYval = this.scrollY + this._amplsYval;
        }
        
        else if ( this.scrollYEnabled && (this.scrollY < -this.scrollHeight) ) {
            doPullYs = true;
            this._amplsYval = -this.scrollHeight - this.scrollY;
            this._targtYval = this.scrollY + this._amplsYval;
        }

        if ( !(doPullXs) && (this._lockAtDir == ScrollDirection.X_AXIS || this._lockAtDir == ScrollDirection.XY_AXIS) ) {
            if ( Math.abs(this._speedXval) >= this._speedThreshold ) {
                doScroll = true;
                this._velocXval = this._amplsFactor * this._speedXval;
                this._distsXval = this.scrollX + this._velocXval;
            }

            else {
                this._showIndicator(0, 0);
            }
        }

        if ( !(doPullYs) && (this._lockAtDir == ScrollDirection.Y_AXIS || this._lockAtDir == ScrollDirection.XY_AXIS) ) {
            if ( Math.abs(this._speedYval) >= this._speedThreshold ) {
                doScroll = true;
                this._velocYval = this._amplsFactor * this._speedYval;
                this._distsYval = this.scrollY + this._velocYval;
            }

            else {
                this._showIndicator(1, 0);
            }
        }

        if ( this._lockAtDir == ScrollDirection.NONE ) {
            this._showIndicator(0, 0);
            this._showIndicator(1, 0);
        }

        if ( doPullXs || doPullYs ) {
            this._pullstamp = Date.now();
            this._pullbkInt = requestAnimation(this._doPullback);
            this.dispatchEvent(new Event("pull", false, false));
        }

        if ( doScroll ) {
            this._timestamp = Date.now();
            this._scrollInt = requestAnimation(this._doAutoScroll);

            var dragEvent = new Event("drag", false, false);
                dragEvent.vx = this._velocXval;
                dragEvent.vy = this._velocYval;

            this.dispatchEvent( dragEvent );
        }
        
        //if ( evt.type == "touchend" && this._lockAtDir == ScrollDirection.NONE) {
        //    /// 触发 tap 事件；
        //    var tapEvent = document.createEvent("Event");
        //        tapEvent.initEvent("tap", true, true);

        //    var target = evt.target;
        //    target.dispatchEvent( tapEvent);
        //}

        return;
    }
}


ScrollContainer.prototype._calcTouchesSpeed = function _calcTouchesSpeed () {
    /// <summary>
    /// 计算手指移动速度。</summary>
    var now = Date.now();
    var elapsed = now - this._timestamp;
    
    var deltaXval = this.scrollX - this._startXval;
    var deltaYval = this.scrollY - this._startYval;

    this._startXval = this.scrollX;
    this._startYval = this.scrollY;
    this._speedXval = 0.8 * (1000 * deltaXval / (1 + elapsed)) + 0.2 * this._speedXval;
    this._speedYval = 0.8 * (1000 * deltaYval / (1 + elapsed)) + 0.2 * this._speedYval;

    this._timestamp = now;
    this._tickerInt = requestAnimation(this._calcTouchesSpeed);
}


ScrollContainer.prototype._calcTouchesPosition = function _calcTouchesPosition( evt ) {
    /// <summary>
    /// 计算手指移动位置。</summary>

    if ( evt.type == "touchstart" 
      || evt.type == "touchend" 
      || evt.type == "touchmove" 
      || evt.type == "touchcancel" ) {

        return this._getAverageOfTouches(evt.touches);
    }
}


ScrollContainer.prototype._getAverageOfTouches = function _getAverageOfTouches( touches ) {
    /// <summary>
    /// 计算所有触摸点的平均值。</summary>

    for ( var i = 0, dt = [0, 0]; i < touches.length; ++i ) {

        if ( i == 0 ) {
            dt[0] = touches[i].clientX;
            dt[1] = touches[i].clientY;
        }

        else {
            dt[0] = (dt[0] + touches[i].clientX) * 0.5;
            dt[1] = (dt[1] + touches[i].clientY) * 0.5;
        }
    }

    return dt;
}


ScrollContainer.prototype._hasTouched = function _hasTouched( evt, count ) {
    /// <summary>
    /// 判断是否按下了指定数量的手指。</summary>

    if ( evt.type == "touchstart" 
      || evt.type == "touchmove" 
      || evt.type == "touchend" 
      || evt.type == "touchcancel" ) {

        return (evt.touches.length >= count);
    }

    return false;
}


ScrollContainer.prototype._doAutoScroll = function _doAutoScroll () {
    /// <summary>
    /// 根据移动速度自动滚动一定距离。</summary>

    var fact = Math.exp((this._timestamp - Date.now()) / (this._timeConstant));
    var dist = 0;
    var next = false;
    var bounce = false;

    if ( this._velocXval ) {
        dist = -this._velocXval * fact;

        if ( Math.abs(dist) >= 0.5 ) {
            next = true;
            dist = this._distsXval + dist;
            this._forceXval = 0.8 * (dist - this.scrollX) + 0.2 * this._forceXval;
            this.scrollX = dist;
            this._showIndicator(0, 1);
        }

        else {
            dist = this._distsXval;
            this._forceXval = 0.8 * (dist - this.scrollX) + 0.2 * this._forceXval;
            this.scrollX = dist;
            this._velocXval = 0;
            this._showIndicator(0, 0);
        }

        if ( dist > 0 || dist < -this.scrollWidth ) {
            next = false;
            this._velocXval = 0;
            this.scrollX = dist > 0 ? 0 : -this.scrollWidth;
            
            if ( this._bounces ) {
                bounce = true;
                this._edgesXval = dist > 0 ? 0 : dist < -this.scrollWidth ? -this.scrollWidth : 0;
            }
        }
    }

    if ( this._velocYval ) {
        dist = -this._velocYval * fact;

        if ( Math.abs(dist) >= 0.5 ) {
            next = true;
            dist = this._distsYval + dist;
            this._forceYval = 0.8 * (dist - this.scrollY) + 0.2 * this._forceYval;
            this.scrollY = dist;
            this._showIndicator(1, 1);
        }

        else {
            dist = this._distsYval;
            this._forceYval = 0.8 * (dist - this.scrollY) + 0.2 * this._forceYval;
            this.scrollY = dist;
            this._velocYval = 0;
            this._showIndicator(1, 0);
        }

        if ( dist > 0 || dist < -this.scrollHeight ) {
            next = false;
            this._velocYval = 0;
            this.scrollY = dist > 0 ? 0 : -this.scrollHeight;

            if ( this._bounces ) {
                bounce = true;
                this._edgesYval = dist > 0 ? 0 : dist < -this.scrollHeight ? -this.scrollHeight : 0;
            }
        }
    }

    if ( next ) {
        this._pullbkInt = requestAnimation(this._doAutoScroll);
    }

    if ( bounce ) {
        cancelAnimation(this._bounceInt);
        this._bounceInt = requestAnimation(this._doForceBounces);
    }
}


ScrollContainer.prototype._doPullback = function _doPullback () {
    /// <summary>
    /// 边缘拉回。</summary>

    var fact = Math.exp((this._pullstamp - Date.now()) / (this._timeConstant * this._timePullFactor));
    var dist = 0;
    var next = false;

    if ( this._amplsXval ) {
        dist = -this._amplsXval * fact;

        if ( Math.abs(dist) >= 0.5 ) {
            next = true;
            this.scrollX = this._targtXval + dist;
            this._showIndicator(0, 1);
        }

        else {
            this.scrollX = this._targtXval;
            this._amplsXval = 0;
            this._showIndicator(0, 0);
        }
    }

    if ( this._amplsYval ) {
        dist = -this._amplsYval * fact;
        
        if ( Math.abs(dist) >= 0.5 ) {
            next = true;
            this.scrollY = this._targtYval + dist;
            this._showIndicator(1, 1);
        }

        else {
            this.scrollY = this._targtYval;
            this._amplsYval = 0;
            this._showIndicator(1, 0);
        }
    }

    if ( next ) {
        this._pullbkInt = requestAnimation(this._doPullback);
    }
}


ScrollContainer.prototype._doForceBounces = function _doForceBounces() {
    /// <summary>
    /// 边缘回弹。</summary>

    var declsX = 0;
    var declsY = 0;
    var next = false;

    if ( !this._velocXval && this._forceXval ) {
        declsX = (this._edgesXval - this.scrollX) * this._bouncesFactor;

        this._forceXval += declsX;
        this._forceXval *= this._forceDamping;

        if ( Math.abs(this._forceXval) >= 0.001 ) {
            next = true;
            this.scrollX += this._forceXval * this._elasticFactor;
            this._showIndicator(0, 1);
        }

        else {
            this._forceXval = 0;
            this.scrollX = this._edgesXval;
            this._showIndicator(0, 0);
        }
    }

    if ( !this._velocYval && this._forceYval ) {
        declsY = (this._edgesYval - this.scrollY) * this._bouncesFactor;

        this._forceYval += declsY;
        this._forceYval *= this._forceDamping;

        if ( Math.abs(this._forceYval) >= 0.001 ) {
            next = true;
            this.scrollY += this._forceYval * this._elasticFactor;
            this._showIndicator(1, 1);
        }

        else {
            this._forceYval = 0;
            this.scrollY = this._edgesYval;
            this._showIndicator(1, 0);
        }
    }

    if ( next ) {
        this._bounceInt = requestAnimation(this._doForceBounces);
    }
}


ScrollContainer.prototype.scrollTo = function scrollTo( time, x, y ) {
    /// 手动滚动；
    this._stopAllDelayTimer();

    this._distsXval = x;
    this._distsYval = y;
    this._velocXval = this._distsXval - this.scrollX;
    this._velocYval = this._distsYval - this.scrollY;
    this._timedelay = time;
    this._timestamp = Date.now();
    this._scrollInt = requestAnimation(this._doScrollTo);
}


ScrollContainer.prototype._doScrollTo = function _doScrollTo() {
    var time = Date.now() - this._timestamp;
    var next = false;

    if ( (time < this._timedelay) && (this._timedelay > 0) ) {
        if ( Math.abs(this._velocXval) > 0.001 ) {
            next = true;
            this.scrollX = (this._distsXval - this._velocXval) + this._velocXval * (time / this._timedelay);
        }

        if ( Math.abs(this._velocYval) > 0.001 ) {
            next = true;
            this.scrollY = (this._distsYval - this._velocYval) + this._velocYval * (time / this._timedelay);
        }

        if ( next ) {
            this._scrollInt = requestAnimation(this._doScrollTo);
        }
    }

    else {
        this.scrollX = this._distsXval;
        this.scrollY = this._distsYval;
    }
}


ScrollContainer.prototype._stopAllDelayTimer = function _stopAllDelayTimer() {
    cancelAnimation(this._pullbkInt);
    cancelAnimation(this._scrollInt);
    cancelAnimation(this._bounceInt);
    cancelAnimation(this._tickerInt);
}


ScrollContainer.prototype._showIndicator = function _showIndicator( type, alpha ) {
    /// 显示/绘制/更新滚动位置指示器。

    if ( this._disableIndicator ) {
        /// 禁止显示指示器
        return;
    }

    this._createIndicator();

    if ( type == 0 && this._scrollXTracker ) {
        if ( alpha == 1 ) {
            this._updateIndicator(type);
            this._scrollXTracker.natural.classList.remove("scroll-track-showing");
        }

        else {
            this._scrollXTracker.natural.classList.remove("scroll-track-showing");
        }
    }

    if ( type == 1 && this._scrollYTracker ) {
        if ( alpha == 1 ) {
            this._updateIndicator(type);
            this._scrollYTracker.natural.classList.add("scroll-track-showing");
        }

        else {
            this._scrollYTracker.natural.classList.remove("scroll-track-showing");
        }
    }
}


ScrollContainer.prototype._createIndicator = function _createIndicator() {
    if ( this.scrollXEnabled && !this._scrollXIndicator ) {
        this._scrollXTracker = new Sprite(document.createElement("div"));
        this._scrollXTracker.natural.className = "scroll-track scroll-x-track";
        this._scrollXIndicator = new Sprite(document.createElement("div"));
        this._scrollXIndicator.natural.className = "scroll-indicator";

        this._scrollXTracker.natural.appendChild(this._scrollXIndicator.natural);
        this.natural.appendChild(this._scrollXTracker.natural);
    }

    if ( this.scrollYEnabled && !this._scrollYIndicator ) {
        this._scrollYTracker = new Sprite(document.createElement("div"));
        this._scrollYTracker.natural.className = "scroll-track scroll-y-track";
        this._scrollYIndicator = new Sprite(document.createElement("div"));
        this._scrollYIndicator.natural.className = "scroll-indicator";

        this._scrollYTracker.natural.appendChild(this._scrollYIndicator.natural);
        this.natural.appendChild(this._scrollYTracker.natural);
    }
}


ScrollContainer.prototype._updateIndicator = function _updateIndicator( type ) {
    if ( type == 0 ) {
        var scale = ((this.viewportWidth <= 0 || this.contentWidth <= 0) ? 0 : this.viewportWidth / this.contentWidth);
        var value = (this.scrollX > 0 ? 0 : this.scrollX < -this.scrollWidth ? this.scrollWidth : -this.scrollX);
        var percent = (this.scrollWidth <= 0 ? (this.scrollY >= 0 ? 0 : 1) : value / this.scrollWidth);


        if ( this.resizeIndicator ) {
            var width = this._scrollXTracker.width * scale;
            var flowX = this.scrollX > 0 ? this.scrollX : this.scrollX < -this.scrollWidth ? -this.scrollWidth - this.scrollX : 0;
                flowX = (width <= 0 ? 0 : 1 - Math.min(1, flowX / width)); 

            this._scrollXIndicator.natural.style.width = (width * flowX) + "px";
        }

        this._scrollXIndicator.x = Math.max(0, this._scrollXTracker.width - this._scrollXIndicator.width) * percent;
    }

    if ( type == 1 ) {
        var scale = ((this.viewportHeight <= 0 || this.contentHeight <= 0) ? 0 : this.viewportHeight / this.contentHeight);
        var value = (this.scrollY > 0 ? 0 : this.scrollY < -this.scrollHeight ? this.scrollHeight : -this.scrollY);
        var percent = (this.scrollHeight <= 0 ? (this.scrollY >= 0 ? 0 : 1) : value / this.scrollHeight);


        if ( this.resizeIndicator ) {
            var height = this._scrollYTracker.height * scale;
            var flowY  = this.scrollY > 0 ? this.scrollY : this.scrollY < -this.scrollHeight ? -this.scrollHeight - this.scrollY : 0;
                flowY = (height <= 0 ? 0 : 1 - Math.min(1, flowY / height)); 

            this._scrollYIndicator.natural.style.height = (height * flowY) + "px";
        }

        this._scrollYIndicator.y = Math.max(0, this._scrollYTracker.height - this._scrollYIndicator.height) * percent;
    }
}