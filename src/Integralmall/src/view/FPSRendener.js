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
/// <reference path='./Sprite.js' />


var FPSRendener = derive(Sprite, function FPSRendener() {
    Sprite.call(this, document.createElement("div"));


    this._element.css({
        "position": "fixed",
        "left": "0px",
        "top" : "0px",
        "color": "#04be02",
        "padding": "0px 4px",
        "background": "rgba(255, 255, 255, 0.6)",
        "zIndex": 9999999
    });

    document.body.appendChild(this._natural);

    this._frameRate = 0;
    this._lastTimer = 0;
    this._currTimer = 0;
    this._updateFrameRateHandler = this._updateFrameRateHandler.bind(this);

    requestAnimation(this._updateFrameRateHandler);
});


FPSRendener.prototype._updateFrameRateHandler = function _updateFrameRateHandler( evt ) {
    /// <summary>
    /// 更新帧频；</summary>

    this._frameRate++;
    this._currTimer = Date.now();

    if ( this._currTimer - this._lastTimer >= 1000 ) {
        this._lastTimer = this._currTimer;
        this._updateTextContent();
        this._frameRate = 0;
    }

    requestAnimation(this._updateFrameRateHandler);
}


FPSRendener.prototype._updateTextContent = function _updateTextContent() {
    this._element.text("fps:" + this._frameRate);
}