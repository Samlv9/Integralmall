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


/// <var type='Function'>
/// 启动一个同步页面的计时器。</var>
var requestAnimation = window.requestAnimationFrame 
                     || window.webkitRequestAnimationFrame;

/// <var type='Function'>
/// 取消一个同步页面的计时器。</var>
var cancelAnimation  = window.cancelAnimationFrame
                     || window.webkitCancelAnimationFrame;


var __TIMER_OBJ__ = null;
var __TIMER_KEY__ = null;


if ( window.performance ) {
    if ( typeof window.performance.now == "function" ) {
        __TIMER_OBJ__ = window.performance;
        __TIMER_KEY__ = "now";
    }

    else if ( typeof window.performance.webkitNow == "function" ) {
        __TIMER_OBJ__ = window.performance;
        __TIMER_KEY__ = "webkitNow";
    }
}


if ( !__TIMER_OBJ__ || !__TIMER_KEY__ ) {
    __TIMER_OBJ__ = Date;
    __TIMER_KEY__ = "now";
}


function timeNow() {
    /// <summary>
    /// 获取系统当前时间戳（浮点数）。</summary>

    return __TIMER_OBJ__[__TIMER_KEY__]();
}