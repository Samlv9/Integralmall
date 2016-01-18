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
/// <reference path='./StatView.js' />


var Overlay = derive(StatView, function Overlay( selector ) {
    /// <summary>
    /// 悬浮层；</summary>
    StatView.call(this, selector);

    this._statDirection = "NONE";
    this._mask = this.element.children(".overlay-mask");
    this._transitionElement = this._mask[0];

    this._cancelOverlayHandler = this._cancelOverlayHandler.bind(this);
    this._onStatChangeHandler = this._onStatChangeHandler.bind(this);
    this._initOverlayConstructor();
});


Overlay.prototype._initOverlayConstructor = function _initOverlayConstructor() {
    if ( this.natural.classList.contains("overlay-E") ) {
        this._statDirection = "overlay-E";
    }

    else if ( this.natural.classList.contains("overlay-W") ) {
        this._statDirection = "overlay-W";
    }

    this.addEventListener("statChange", this._onStatChangeHandler);
    this._mask  .on("click", this._cancelOverlayHandler);
    this.element.on("click", ".overlay-cancel", this._cancelOverlayHandler);


    if ( document.documentElement.classList.contains("allow-native-touch") ) {
        this.natural.addEventListener("touchmove", function( evt ) {
            evt.stopPropagation();
            evt.preventDefault();
        });
    }
}


Overlay.prototype._onStatChangeHandler = function _onStatChangeHandler( evt ) {
    document.body.classList[(this.statOpen ? "add" : "remove" )](this._statDirection);
}


Overlay.prototype._cancelOverlayHandler = function _cancelOverlayHandler( evt ) {
    evt.preventDefault();
    evt.stopPropagation();

    this.close();
}