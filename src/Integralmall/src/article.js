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
    PageBase.call(this);


    /// 头部栏；
    this._xpHeader = new Sprite("#xpHeader");
    this._xpTitle  = new Sprite(this._xpHeader.element.find(".xp-title"));
    this._isXPHeaderShowing = true;

    this._xpAllNavList = new Sprite("#xpAllNavList");
    this._xpAllNavListTrigger = new Sprite("#xpAllNavListTrigger");
    this._xpShowAllListTrigger = new Sprite("#xpShowAllListTrigger");
    this._xpHeaderMask = new Sprite("#xpHeaderMask");
    this._isShowAllNavList = false;


    this._newsArticle = new Sprite("#newsArticle");
    this._showMoreNews = new Sprite("#showMoreNews");


    /// 分享层；
    this._shareButton = $(".share-button");
    this._shareTipLayer = null;


    /// 二维码；
    this._qrcodeLayer = new Sprite("#qrcodeLayer");
    this._followButton = $(".follow-button");

    this._scrollHandler = this._scrollHandler.bind(this);
    this._toggleAllNavList = this._toggleAllNavList.bind(this);
    this._xpHeaderMaskClickHandler = this._xpHeaderMaskClickHandler.bind(this);
    this._dragContainerHandler = this._dragContainerHandler.bind(this);
    this._mainPullUpHandler = this._mainPullUpHandler.bind(this);
    this._showMoreNewsHandler = this._showMoreNewsHandler.bind(this);
    this._showShareTipLayer = this._showShareTipLayer.bind(this);
    this._showQRCodeLayer = this._showQRCodeLayer.bind(this);
    this._initPage();
});


Page.prototype._initPage = function _initPage() {
    this._mainContainer.addEventListener("scroll", this._scrollHandler);
    //this._mainContainer.addEventListener("drag", this._dragContainerHandler);
    //this._mainContainer.addEventListener("pull", this._mainPullUpHandler);
    this._xpAllNavListTrigger.natural.addEventListener("click", this._toggleAllNavList);
    this._xpShowAllListTrigger.natural.addEventListener("click", this._toggleAllNavList);
    this._xpHeaderMask.natural.addEventListener("click", this._xpHeaderMaskClickHandler);
    this._showMoreNews.natural.addEventListener("click", this._showMoreNewsHandler);
    this._shareButton.on("click", this._showShareTipLayer);
    this._followButton.on("click", this._showQRCodeLayer);

    $("#newsArticle iframe").each(function() {
        var width  = parseFloat($(this).attr("width" ) || 375);
        var height = parseFloat($(this).attr("height") || 280);
        var sizes  = height / width * (window.innerWidth - 30);

        $(this).css({ "height": sizes });
    });
}


Page.prototype._scrollHandler = function _scrollHandler( evt ) {
    if ( this._mainContainer.scrollY <= -10 ) {
        document.body.classList.add("hide-xp-header");
    }

    else {
        document.body.classList.remove("hide-xp-header");
    }
}


Page.prototype._showMoreNewsHandler = function _showMoreNewsHandler( evt ) {
    this._newsArticle.natural.classList.remove("cliped");
    this._showMoreNews.natural.style.display = "none";
    this._mainContainer.updateFrameSizes();
}


Page.prototype._toggleAllNavList = function _toggleAllNavList( evt ) {
    this._isShowAllNavList = !this._isShowAllNavList;

    if ( this._isShowAllNavList ) {
        document.body.classList.add("all-list");
        this._xpAllNavListTrigger.natural.textContent = "收起";
    }

    else {
        document.body.classList.remove("all-list");
        this._xpAllNavListTrigger.natural.textContent = "更多";
    }
}


Page.prototype._xpHeaderMaskClickHandler = function _xpHeaderMaskClickHandler( evt ) {
    if ( this._isShowAllNavList ) {
        this._toggleAllNavList( evt );
    }
}


Page.prototype._dragContainerHandler = function _dragContainerHandler( evt ) {
    if ( evt.vy >= 0 ) {
        document.body.classList.remove("hide-xp-header");
    }

    else {
        document.body.classList.add("hide-xp-header");
    }
}


Page.prototype._mainPullUpHandler = function _mainPullUpHandler( evt ) {
    if ( !this._isShowAllNavList && this._mainContainer.scrollY >= 24 ) {
        this._toggleAllNavList( evt );
    }
}


Page.prototype._showShareTipLayer = function _showShareTipLayer( evt ) {
    if ( !this._shareTipLayer ) {
        this._shareTipLayer = document.createElement("div");
        this._shareTipLayer.className = "share-layer";
        this._shareTipLayer.addEventListener("click", function( evt ) {
            document.body.removeChild(this);
        });
    }

    document.body.appendChild(this._shareTipLayer);
}


Page.prototype._showQRCodeLayer = function _showQRCodeLayer( evt ) {
    this._qrcodeLayer.natural.classList.add("show-qrcode");
    this._qrcodeLayer.natural.addEventListener("click", (function( evt ) {
        //var target = evt.target;

        //while( target && target != this._qrcodeLayer.natural ) {
        //    if ( target.classList.contains("qrcode-content") ) {
        //        return;
        //    }

        //    target = target.parentNode;
        //}

        this._qrcodeLayer.natural.classList.remove("show-qrcode");
    }.bind(this)));
}