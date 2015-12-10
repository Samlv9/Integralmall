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
/// <reference path='../events/Event.js' />
/// <reference path='../events/EventDispatcher.js' />


var Sprite = derive(EventDispatcher, function Sprite( selector ) {
    /// <summary>
    /// 显示对象基类，提供额外的 CSS 属性获取/设置。</summary>
    /// <param name='selector' type='String'>
    /// 必须，指定创建该类的 DOM 元素的 Zepto 选择器。</param>
    EventDispatcher.call(this);

    this._element = $(selector);
    this._scaleX = 1;
    this._scaleY = 1;
    this._rotation   = 0;
    this._translateX = 0;
    this._translateY = 0;
    this._hrwAccelEnabled = true;

    if ( this._element.length != 1 ) {
        throw new Error("当前选择器选中了零个或多个元素，但 Sprite 必须且只能包含有一个有效的元素。");
    }

    Sprite.reg(this);
});


Object.defineProperties(Sprite.prototype, {
    /// <field type='Zepto'>
    /// 获取显示对象的 Zepto 元素。</field>
    element: {
        get: function () { return this._element; }
    },

    /// <field type='HTMLElement'>
    /// 获取显示对象的 DOM 元素。</field>
    natural: {
        get: function () { return this._element[0]; }
    },

    /// <field type='Boolean'>
    /// 获取/设置是否启用 3d 加速渲染变换矩阵。<field>
    hrwAccelEnabled: {
        get: function () { return this._hrwAccelEnabled; },
        set: function( value ) { this._hrwAccelEnabled = value; }
    },

    /// <field type='Number'>
    /// 获取元素的宽度。</field>
    width: {
        get: function () { return this.natural.clientWidth; }
    },

    /// <field type='Number'>
    /// 获取元素的高度。</field>
    height: {
        get: function () { return this.natural.clientHeight; }
    },

    /// <field type='Number'>
    /// 获取/设置元素的 x 轴坐标。</field>
    x: {
        get: function () { return this._translateX; },
        set: function( value ) { 
            this._translateX = value; 
            this._applyTransform(); 
        }
    },

    /// <field type='Number'>
    /// 获取/设置元素的 y 轴坐标。</field>
    y: {
        get: function () { return this._translateY; },
        set: function( value ) {
            this._translateY = value;
            this._applyTransform();
        }
    },

    /// <field type='Number'>
    /// 获取/设置元素的 x 轴缩放量。</field>
    scaleX: {
        get: function () { return this._scaleX; },
        set: function( value ) {
            this._scaleX = value;
            this._applyTransform();
        }
    },

    /// <field type='Number'>
    /// 获取/设置元素的 y 轴缩放量。</field>
    scaleY: {
        get: function () { return this._scaleY; },
        set: function( value ) {
            this._scaleY = value;
            this._applyTransform();
        }
    },

    /// <field type='Number'>
    /// 获取/设置元素的旋转角度。</field>
    rotation: {
        get: function () { return this._rotation; },
        set: function( value ) {
            this._rotation = value;
            this._applyTransform();
        }
    }
});


Sprite.prototype._applyTransform = function _applyTransform () {
    /// <summary>
    /// 对元素应用变换矩阵。</summary>
    this._setTransform(
        'scale(' + this._scaleX + ',' + this._scaleY + ')' +
        'rotate(' + this._rotation + 'deg)' +
        'translateX(' + this._translateX + 'px)' +
        'translateY(' + this._translateY + 'px)' + (this._hrwAccelEnabled ? 'translateZ(0px)' : '')
    );
}


Sprite.prototype._setTransform = function _setTransform( transform ) {
    /// <summary>
    /// 设置元素 transform 样式。</summary>
    /// <param name='transform' type='String'>
    /// 必须，指定元素的 transform 属性值。</param>

    this.natural.style.transform = 
    this.natural.style.webkitTransform = transform;
}


Sprite.prototype.transform = function transform( x, y, scaleX, scaleY, rotation ) {
    /// <summary>
    /// 同时设置多个 transform 属性值。</summary>
    /// <param name='x' type='Number' optional='true'>
    /// 可选，设置元素在 x 轴上的偏移量。</param>
    /// <param name='y' type='Number' optional='true'>
    /// 可选，设置元素在 y 轴上的偏移量。</param>
    /// <param name='scaleX' type='Number' optional='true'>
    /// 可选，设置元素在 x 轴上的缩放量。</param>
    /// <param name='scaleY' type='Number' optional='true'>
    /// 可选，设置元素在 y 轴上的缩放量。</param>
    /// <param name='rotation' type='Number' optional='true'>
    /// 可选，设置元素的旋转角度。</param>

    if ( x        !== null && typeof x        != "undefined" ) { this._translateX = x; }
    if ( y        !== null && typeof y        != "undefined" ) { this._translateY = y; }
    if ( scaleX   !== null && typeof scaleX   != "undefined" ) { this._scaleX     = scaleX; }
    if ( scaleY   !== null && typeof scaleY   != "undefined" ) { this._scaleY     = scaleY; }
    if ( rotation !== null && typeof rotation != "undefined" ) { this._rotation   = rotation; }

    this._applyTransform();
}


/// ================================================================================
/// SPID 
/// ================================================================================
var SPID_POINTER = 0;
var SPID_DICTION = {};


Sprite.reg = function reg( sprite ) {
    /// <summary>
    /// 注册 Sprite 类型的实例，以便通过 Sprite.get() 获取实例的引用。</summary>
    /// <param name='sprite' type='Sprite'>
    /// 必须，指定注册到引用池中的 Sprite 类型的实例。</param>
    /// <returns type='Sprite'>
    /// 返回对 Sprite 实例的引用。</returns>

    if ( !(sprite instanceof Sprite) ) {
        throw new Error("Sprite: reg() 方法的注册对象必须为 Sprite 类型的实例。");
    }

    SPID_DICTION[SPID_POINTER] = sprite;
    sprite.natural.setAttribute("data-sprite", SPID_POINTER++);

    return sprite;
}


Sprite.get = function get( spid ) {
    /// <summary>
    /// 通过 SPID 获取引用池中指定的 Sprite 实例对象。<br/>
    /// 支持以下方式：                  <br/>
    ///     Sprite.get('spid');       <br/>
    ///     Sprite.get(HTMLElement);  <br/>
    ///     Sprite.get(Zepto);</summary>
    /// <param name='spid' type='String'>
    /// 必须，指定 Sprite 的 spid 值。可以是 String|HTMLElement|ZeptoElement。</param>

    if ( spid === null || typeof spid == "undefined" ) {

        return null;
    }

    if ( typeof spid == "object" ) {

        if ( typeof spid.getAttribute == "function" ) {

            return SPID_DICTION[spid.getAttribute("data-sprite")] || null;
        }

        else {

            return SPID_DICTION[spid[0].getAttribute("data-sprite")] || null;
        }
    }

    return SPID_DICTION["" + spid] || null;
}


Sprite.cls = function cls( spid ) {
    /// <summary>
    /// 通过 SPID 删除引用池中指定的 Sprite 实例对象。<br/>
    /// 支持以下方式：                  <br/>
    ///     Sprite.cls('spid');       <br/>
    ///     Sprite.cls(HTMLElement);  <br/>
    ///     Sprite.cls(Zepto);</summary>
    /// <param name='spid' type='String'>
    /// 必须，指定 Sprite 的 spid 值。可以是 String|HTMLElement|ZeptoElement。</param>

    if ( spid === null || typeof spid == "undefined" ) {
        
        return;
    }

    if ( spid instanceof Sprite ) {

        SPID_DICTION[spid.natural.getAttribute("data-sprite")] = null;
        return;
    }

    if ( typeof spid == "object" ) {

        if ( typeof spid.getAttribute == "function" ) {

            SPID_DICTION[spid.getAttribute("data-sprite")] = null;
        }

        else {

            SPID_DICTION[spid[0].getAttribute("data-sprite")] = null;
        }
    }

    SPID_DICTION["" + spid] = null;
}