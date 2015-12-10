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
/// <reference path='./Event.js' />
/// <reference path='./EventPhase.js' />
/// <reference path='./EventListener.js' />


function EventDispatcher( target ) {
    /// <summary>
    /// 定义具备事件调度功能的类型的基类。</summary>
    /// <param name='target' type='Object' optional='true'>
    /// 可选，默认值：null。指示该调度器使用的事件目标对象。</param>

    /// <field type='Object'>
    /// 指示该调度器中捕获阶段的所有侦听器寄存对象。</field>
    this._dispatcherCaptureRegister = {};

    /// <field type='Object'>
    /// 指示该调度器中冒泡阶段的所有的侦听器。</field>
    this._dispatcherBubbleRegister  = {};

    /// <field type='Object'>
    /// 指示该侦听器的事件目标对象。</field>
    this._dispatcherRelatedTarget   = target || this;
}


EventDispatcher.prototype.addEventListener = function addEventListener( type, listener, useCapture, priority ) {
    /// <summary>
    /// 为当前对象注册指定类型的事件侦听器。
    /// 说明：
    ///     1，参数 `listener` 可以是一个 Function 类型的对象，或者是具有 `handleEvent()` 方法的 Object 类型的对象。
    ///     2，使用不同的 `useCapture`（分别使用 true 和 false 值），但使用同一侦听器注册事件时，将注册为不同阶段的事件处理器。
    ///     3，在事件调度过程中，优先级高的侦听器会比优先级低的侦听器更早执行。</summary>
    /// <param name='type' type='String'>
    /// 必须，指定事件类型。</param>
    /// <param name='listener' type='Function'>
    /// 必须，指定事件侦听器。</param>
    /// <param name='useCapture' type='Boolean' optional='true'>
    /// 可选，默认值：false。指示该侦听器是否在捕获阶段处理事件。</param>
    /// <param name='priority' type='UInt32' optional='true'>
    /// 可选，默认值：0。指示该侦听器的优先级。</param>

    /// TODU: 防止相同的事件侦听器被重复注册。
    this.removeEventListener(type, listener, useCapture);


    /// TODU: 为该类型的事件创建一个寄存列表。
    if ( !this._dispatcherCaptureRegister[type] ) {
        this._dispatcherCaptureRegister[type] = [];
    }

    if ( !this._dispatcherBubbleRegister[type] ) {
        this._dispatcherBubbleRegister[type] = [];
    }

    /// TODU: 获取侦听器列表，并将该侦听器按优先级顺序添加进列表中。
    var sortedList = useCapture ? this._dispatcherCaptureRegister[type] : this._dispatcherBubbleRegister[type];
    var listener = new EventListener(listener, priority);
    
    if ( (!sortedList.length) || 
         (listener.priority <= sortedList[sortedList.length - 1].priority) ) {
        /// 通常注册事件都是使用默认的优先级值 0，按照排序规则高优先级在前，低优先级在后。这种类型的注册只需要
        /// 将后添加的侦听器直接 push 到队列的末尾。

        sortedList.push(listener);
    }

    else {
        /// 将优先级高的侦听器放置在队列的前面。
        for ( var i = 0, len = sortedList.length; i < len; ++i ) {
            if ( listener.priority > sortedList[i].priority ) {
                sortedList.splice(i, 0, listener);
                break;
            }
        }
    }
}


EventDispatcher.prototype.removeEventListener = function removeEventListener( type, listener, useCapture ) {
    /// <summary>
    /// 删除指定类型的事件侦听器。
    /// 说明：如果事件侦听器是通过不同的 `useCapture` 值注册的，需要使用对应的 `useCapture` 来删除该侦听器。</summary>
    /// <param name='type' type='String'>
    /// 必须，指定事件类型。</param>
    /// <param name='listener' type='Function'>
    /// 必须，指定事件侦听器。</param>
    /// <param name='useCapture' type='Boolean' optional='true'>
    /// 可选，默认值：false。指示该侦听器是否在捕获阶段处理事件。</param>

    var sortedList = (useCapture ? this._dispatcherCaptureRegister[type] : this._dispatcherBubbleRegister[type]);

    /// TODU: 删除事件侦听器时，必须完全相等才执行删除操作。
    if ( sortedList && sortedList.length ) {
        for ( var i = 0, len = sortedList.length; i < len; ++i ) {
            if ( listener === sortedList[i].handler ) {
                sortedList.splice(i, 1);
                return;
            }
        }
    }
}


EventDispatcher.prototype.hasEventListener = function hasEventListener( type ) {
    /// <summary>
    /// 检查当前对象是否为指定类型的事件注册了任何该类型的侦听器。</summary>
    /// <returns type='Boolean'>
    /// 如果当前对象中存在该类型事件的侦听器，则返回 true，否则返回 false。</returns>

    return (this._dispatcherCaptureRegister.hasOwnProperty(type) && this._dispatcherCaptureRegister[type].length >= 1)
        || (this._dispatcherBubbleRegister .hasOwnProperty(type) && this._dispatcherBubbleRegister [type].length >= 1);
}


EventDispatcher.prototype.willTrigger = function willTrigger( type ) {
    /// <summary>
    /// 检测当前对象以及当前对象的传递路径中是否为指定事件类型注册了任何该类型的侦听器。</summary>
    /// <returns type='Boolean'>
    /// 如果存在该类型的侦听器，则返回 true。否则返回 false。</returns>

    if ( this.hasEventListener(type) ) {
        return true;
    }

    for ( var tempToken; tempToken = tempToken.parent; ) {
        if ( tempToken.hasEventListener(type) ) {
            return true;
        }
    }

    return false;
}


EventDispatcher.prototype.dispatchEvent = function dispatchEvent( event ) {
    /// <summary>
    /// 调度一个事件到当前对象的事件流中。</summary>
    /// <param name='event' type='Event'>
    /// 必须，指定被调度到事件流中的事件对象。</param>
    /// <returns type='Boolean'>
    /// 当事件传递完成时，如果没取消默认行为。则返回 true，否则返回 false。
    /// 补充说明：
    ///     1，如果事件在传递过程中被中断，则返回 false 值。
    ///     2，如果事件不参与冒泡行为并且没有被取消默认行为，则返回 true 值。</returns>

    if ( event.eventPhase !== EventPhase.NONE ) {
        /// 该事件已经被调度过一次时，抛出状态异常。
        throw new Error("无效的事件对象。");
    }

    if ( !event.bubbles || !this.parent ) {
        /// TODU: 事件不参与冒泡行为，则直接在目标阶段调度。
        event._target        = this._dispatcherRelatedTarget;
        event._currentTarget = this._dispatcherRelatedTarget;
        event._eventPhase    = EventPhase.AT_TARGET;

        this._dispatchEvent( event );
        return !event.defaultPrevented;
    }

    /// TODU: 构建事件传递路径。
    var tempChain = [];
    var tempToken = this;

    for ( ;tempToken = tempToken.parent; ) {
        tempChain.push( tempToken );
    }

    var selfIndex = tempChain.length;
    var selfChain = [];

    /// 1，捕获阶段（EventPhase.CAPTURING_PHASE）。
    for ( var i = tempChain.length - 1; i >= 0; --i ) {
        selfChain.push(tempChain[i]);
    }

    /// 2，冒泡阶段（EventPhase.AT_TARGET）。
    selfChain.push(this);

    /// 3，冒泡阶段（EventPhase.BUBBLING_PHASE）。
    for ( var i = 0; i < tempChain.length; ++i ) {
        selfChain.push(tempChain[i]);
    }

    /// TODU: 调度事件至事件流中。
    for ( var i = 0; i < selfChain.length && !event._needStopPropagation; ++i ) {
        /// 更新事件目标以及状态；
        event._target = this._dispatcherRelatedTarget;
        event._currentTarget = selfChain[i]._dispatcherRelatedTarget;
        event._eventPhase = (selfIndex == i ? EventPhase.AT_TARGET : selfIndex < i ? EventPhase.BUBBLING_PHASE : EventPhase.CAPTURING_PHASE);

        selfChain[i]._dispatchEvent(event);
    }

    return !event.defaultPrevented && !event._needStopPropagation;
}


EventDispatcher.prototype._dispatchEvent = function _dispatchEvent( event ) {
    /// <summary>
    /// 为指定状态的事件调用注册的侦听器来处理该事件。</summary>
    /// <param name='event' type='Event'>
    /// 必须，指定调用侦听器的事件对象。</param>

    var sortedList = [];
    /// WARING：在调用侦听器时，不能直接使用原始的寄存数组，因为在调用侦听器函数内部如果调用了删除事件侦听器的方法。
    /// 如 `removeEventListener()`，原始的寄存数组会被修改。这将导致后续其他侦听器的调用发生不可预知的状况。

    /// TODU: 捕获阶段仅触发 `_dispatcherCaptureRegister` 寄存对象中的侦听器。
    if ( event.eventPhase == EventPhase.CAPTURING_PHASE ) {
        sortedList = sortedList.concat(this._dispatcherCaptureRegister[event.type] || []);
    }

    /// TODU: 目标阶段触发所有（`_dispatcherCaptureRegister` 和 `_dispatcherBubbleRegister`）的侦听器。
    if ( event.eventPhase == EventPhase.AT_TARGET ) {
        sortedList = sortedList.concat(this._dispatcherCaptureRegister[event.type] || []);
        sortedList = sortedList.concat(this._dispatcherBubbleRegister [event.type] || []);
    }

    /// TODU: 冒泡阶段仅触发 `_dispatcherBubbleRegister` 寄存对象中的侦听器。
    if ( event.eventPhase == EventPhase.BUBBLING_PHASE ) {
        sortedList = sortedList.concat(this._dispatcherBubbleRegister [event.type] || []);
    }

    /// TODU: 遍历并执行当前列出的所有的侦听器。
    for ( var i = 0; i < sortedList.length && !event._needStopImmediatePropagation; ++i ) {
        sortedList[i].handleEvent( event );
    }
}