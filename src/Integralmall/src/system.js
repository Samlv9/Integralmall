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
/// <reference path='utils/Device.js' />


/// TODU:
/// 这里在 `document` 上取消 `touchmove` 默认行为，防止浏览器出现弹性滚动条。
if ( !Device.isIOS() ) {

    document.documentElement.classList.add("allow-native-touch");
}

else {
    document.addEventListener("touchmove", function disableMovement( evt ) {
        /// 启用自定义的滚动行为。
        evt.preventDefault();
    });
}


/// TODU:
/// 这里禁用 `click` 事件的 300ms 延时；
var startX = 0;
var startY = 0;
var startT = 0;
var identy = 0;
var isMove = false;
var threshold = 5;
var holdDelay = 1000;


function doTapClickHandler( evt ) {
    if ( evt.type == "touchstart" ) {
        if ( evt.targetTouches.length >= 2 ) {
            return;
        }

        var target = evt.target;
        var nodeName = target.nodeName.toLowerCase();
        var nodeType = target.nodeType;

        if ( (nodeType == 1) && (nodeName == "input" || nodeName == "textarea") ) {
            /// 忽略 Input/Textarea；
            return;
        }

        while( target && target != document ) {
            if ( target.classList.contains(".not-click") ) {
                /// 常规的 click 对象；
                return;
            }

            target = target.parentNode;
        }

        isMove = false;
        startT = Date.now();
        identy = evt.targetTouches[0].identifier;
        startX = evt.targetTouches[0].clientX;
        startY = evt.targetTouches[0].clientY;
        
        document.addEventListener("touchmove", doTapClickHandler, true);
        document.addEventListener("touchend" , doTapClickHandler, true);
        document.addEventListener("touchcancel", doTapClickHandler, true);

        

        /// 隐藏焦点状态；
        if ( document.activeElement ) {
            document.activeElement.blur();
        }
        return;
    }

    if ( evt.type == "touchmove" ) {
        if ( isMove ) {
            return;
        }

        var distX = evt.changedTouches[0].clientX - startX;
        var distY = evt.changedTouches[0].clientY - startY;

        if ( (distX * distX + distY * distY) <= (threshold * threshold) ) {
            /// 移动距离小于阀值；
            return;
        }

        isMove = true;
        return;
    }

    if ( evt.type == "touchend" ) {
        /// 禁用默认的 click 事件调度；
        evt.preventDefault();

        document.removeEventListener("touchmove", doTapClickHandler, true);
        document.removeEventListener("touchend" , doTapClickHandler, true);
        document.removeEventListener("touchcancel", doTapClickHandler, true);

        if ( isMove ) {
            return;
        }

        var type   = ((Date.now() - startT) >= holdDelay) ? "hold" : "click";
        var touch  = evt.changedTouches[0];
        var target = evt.target;
        var event  = document.createEvent("MouseEvent");

        event.initMouseEvent(
            type, true, true, evt.view, evt.detail, 
            touch.screenX, touch.screenY, touch.clientX, touch.clientY, 
            false, false, false, false, 
            0, null);
        
		target.dispatchEvent(event);
        return;
    }

    if ( evt.type == "touchcancel" ) {
        document.removeEventListener("touchmove", doTapClickHandler, true);
        document.removeEventListener("touchend" , doTapClickHandler, true);
        document.removeEventListener("touchcancel", doTapClickHandler, true);
        return;
    }
}


document.addEventListener("touchstart", doTapClickHandler);


