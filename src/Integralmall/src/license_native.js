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
/// <reference path='core/derive.js' />
/// <reference path='page/PageBase.js' />
/// <reference path='view/Sprite.js' />



var Page = derive(PageBase, function Page() {
    PageBase.call(this, true);


    this._showLicense = new Sprite("#showLicense");
    this._fScrollY = 0;
    this._tScrollY = 0;
    this._showLicenseHandler = this._showLicenseHandler.bind(this);
    this._showLicense.natural.addEventListener("click", this._showLicenseHandler);
});


Page.prototype._showLicenseHandler = function _showLicenseHandler( evt ) {
    //if ( this._mainContainer ) {
    //    if ( document.body.classList.contains("show-license") ) {
    //        this._tScrollY = this._mainContainer.scrollY;
    //        document.body.classList.toggle('show-license');
    //        this._mainContainer._stopAllDelayTimer();
    //        this._mainContainer.updateFrameSizes();
    //        this._mainContainer.scrollY = this._fScrollY;
    //        this._mainContainer._showIndicator(1, 0);
    //    }

    //    else {
    //        this._fScrollY = this._mainContainer.scrollY;
    //        document.body.classList.toggle('show-license');
    //        this._mainContainer._stopAllDelayTimer();
    //        this._mainContainer.updateFrameSizes();
    //        this._mainContainer.scrollY = this._tScrollY;
    //        this._mainContainer._showIndicator(1, 0);
    //    }
    //}

    //else {
        document.body.classList.toggle('show-license');

    //}
}
