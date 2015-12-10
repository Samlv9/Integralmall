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


function EventListener( handler, priority ) {
    /// <summary>
    /// 创建一个事件侦听器对象。
    /// 说明：参数 `handler` 可以是一个 Function 类型的对象，或者是一个具有 `handleEvent()` 方法的
    /// Object 类型的对象。</summary>
    /// <param name='handler' type='Function'>
    /// 必须，指定事件处理函数或者事件处理对象。</param>
    /// <param name='priority' type='UInt32' optional='true'>
    /// 可选，默认值：0。指定该侦听器的优先级。</param>

    /// <field type='Function'>
    /// 该侦听器的处理函数。</field>
    this._handler = handler;

    /// <field type='UInt32'>
    /// 指示该侦听器的优先级。</field>
    this._priority = priority || 0;
}


Object.defineProperties(EventListener.prototype, {
    /// <filed type='UInt8'>
    /// 获取该侦听器的优先级。</field>
    priority: {
        get: function () { return this._priority; }
    },

    /// <field type='Function'>
    /// 获取事件处理函数对象。</field>
    handler: {
        get: function () { return this._handler; }
    }
});


EventListener.prototype.handleEvent = function handleEvent( event ) {
    /// <summary>
    /// 调用并执行事件处理函数。</summary>
    /// <param name='event' type='Event'>
    /// 必须，传递给事件处理函数的事件对象。</param>
    /// <returns type='*'>
    /// 返回事件处理函数的返回值。</returns>

    if ( typeof this._handler == "function" ) {
        /// 1，对于 Function 类型的处理函数，将该 Function 中的 this 指向事件的 currentTarget 属性。
        /// 然后执行该函数。
        
        return this._handler.call(event.currentTarget, event);
    }

    /// 2，对于 Object.handleEvent 类型的事件处理对象。
    /// 则可以直接调用该对象的 `handleEvent()` 方法并返回处理结果。
    return this._handler.handleEvent(event);
}