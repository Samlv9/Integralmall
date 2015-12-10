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
/// <reference path='./EventPhase.js' />


function Event( type, bubbles, cancelable ) {
    /// <summary>
    /// 定义一个自定义的事件对象。</summary>
    /// <param name='type' type='String'>
    /// 必须，指定事件类型。</param>
    /// <param name='bubbles' type='Boolean' optional='true'>
    /// 可选，默认值：false。指定该事件是否为冒泡型事件。</param>
    /// <param name='cancelable' type='Boolean' optional='true'>
    /// 可选，默认值：false。指定该事件是否可以由侦听器取消相关的默认行为。</param>

    /// <field type='String'>
    /// 事件的类型。</field>
    this._type = type;

    /// <field type='Boolean'>
    /// 指示事件是否参与冒泡。</field>
    this._bubbles = bubbles;

    /// <field type='Boolean'>
    /// 指示事件是否可取消默认行为。</field>
    this._cancelable = cancelable;

    /// <field type='EventDispatcher'>
    /// 该事件起始目标对象。</field>
    this._target = null;

    /// <field type='EventDispatcher'>
    /// 该事件当前目标对象。</field>
    this._currentTarget = null;

    /// <field type='UInt8'>
    /// 该事件当前状态。</field>
    this._eventPhase = EventPhase.NONE;

    /// <field type='Boolean'>
    /// 指示事件是否已经取消了默认行为。</field>
    this._defaultPrevented = false;

    /// <field type='Boolean'>
    /// 指示事件是否应该在调度完当前节点后停止调度。</field>
    this._needStopPropagation = false;

    /// <field type='Boolean'>
    /// 指示事件是否应该立刻停止调度，当前节点的后续侦听器以及后续所有节点的侦听器都不会收到该事件。</field>
    this._needStopImmediatePropagation = false;
}


Object.defineProperties(Event.prototype, {
    /// <value type='String'>
    /// 获取事件类型。</value>
    type: {
        get: function () { return this._type; }
    },

    /// <value type='String'>
    /// 获取该事件是否参与冒泡。</value>
    bubbles: {
        get: function () { return this._bubbles; }
    },

    /// <value type='Boolean'>
    /// 获取该事件是否可以取消默认行为。</value>
    cancelable: {
        get: function () { return this._cancelable; }
    },

    /// <value type='EventTarget'>
    /// 获取事件的起始目标对象。</value>
    target: {
        get: function () { return this._target; }
    },

    /// <value type='EventTarget'>
    /// 获取事件的当前目标对象。</value>
    currentTarget: {
        get: function () { return this._currentTarget; }
    },

    /// <value type='UInt8'>
    /// 获取事件当前状态。</value>
    eventPhase: {
        get: function () { return this._eventPhase; }
    },

    /// <value type='Boolean'>
    /// 指示该事件是否已经取消了默认行为。</value>
    defaultPrevented: {
        get: function () { return this._defaultPrevented; }
    }
});


Event.prototype.preventDefault = function preventDefault() {
    /// <summary>
    /// 取消该事件相关的默认行为。</summary>

    if ( this._cancelable ) {
        this._defaultPrevented = true;
    }
}


Event.prototype.stopPropagation = function stopPropagation() {
    /// <summary>
    /// 停止该传递事件，事件目标的后续节点将不会收到该事件。</summary>

    this._needStopPropagation = true;
}


Event.prototype.stopImmediatePropagation = function stopImmediatePropagation() {
    /// <summary>
    /// 立刻停止传递该事件，事件的后续侦听器以及事件目标后续所有节点都不会收到该事件。</summary>

    this._needStopPropagation = true;
    this._needStopImmediatePropagation = true;
}