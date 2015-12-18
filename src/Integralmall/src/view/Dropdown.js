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
/// <reference path='./Sprite.js' />


var Dropdown = derive(Sprite, function Dropdown( selector ) {
    Sprite.call(this, selector);

    this._dropContainer = this.element.children(".drop-container");
    this._dropContent   = this.element.find(".drop-content");
    this._dropAllow     = this.element.find(".drop-allow");
    this._dropSize = this._dropContainer.height();
    this._dropOnce = this.element.data("droponce");
    
    this._dropToggleHandler = this._dropToggleHandler.bind(this);
    this._initDropdown();
});


Dropdown.prototype._initDropdown = function _initDropdown () {
    if ( this._dropContainer.height() < this._dropContent.height() ) {
        this._dropAllow.show();
        this.natural.addEventListener("click", this._dropToggleHandler);
    }
}


Dropdown.prototype._dropToggleHandler = function _dropToggleHandler( evt ) {
    /// 切换状态；

    this.toggle();
}


Dropdown.prototype.toggle = function toggle() {
    if ( this.element.hasClass("drop-open") ) {
        this._dropContainer.css({ "height": this._dropSize });
        this.element.removeClass("drop-open");
    }

    else {
        this._dropContainer.css({ "height": this._dropContent.height() });
        this.element.addClass("drop-open");

        if ( this._dropOnce ) {
            this.natural.removeEventListener("click", this._dropToggleHandler);
        }
    }
}