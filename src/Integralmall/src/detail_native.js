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
/// <reference path='view/Dropdown.js' />
/// <reference path='view/Overlay.js' />
/// <reference path='utils/Preferences.js' />


var Page = derive(PageBase, function Page() {
    PageBase.call(this, true);

    this._swiperSprite = new Sprite("#detailSwiper");
    this._detailSwiper = new Swiper(this._swiperSprite.natural, {
        "pagination": ".swiper-pagination",
        "loop": true,
        "simulateTouch": false,
        "threshold": 5,
        //"autoplay": 4000,
        "preloadImages": false,
        "lazyLoading": true
    });

    /// 分享提示层
    this._shareButton = $(".share-button");
    this._shareTipLayer = null;


    /// 头/底部工具栏；
    this._topbar = new Sprite("#detTop");
    this._toolbar = new Sprite("#toolbar");


    /// Touch;
    this._startTouchY = 0;

    /// dropdown
    this._descDropdown = new Dropdown("#descDropdown");

    /// 侧边导航；
    this._sideNav = new Sprite("#sideNav");

    /// 侧边显示更多导航；
    this._showOptsOverlay = new Sprite("#showOptsOverlay");
    this._sideBackTop = new Sprite("#sideBackTop");

    /// 工具层；
    this._optsOverlay = new Overlay("#optsOverlay");
    this._optsContent = new Sprite(this._optsOverlay.element.children(".overlay-content"));

    /// 推荐栏（该栏可能没有）；
    this._recommend = document.getElementById("recommend");
    this._recommend = this._recommend ? new Sprite(this._recommend) : null;


    /// 事件处理；
    this._showShareTipLayer = this._showShareTipLayer.bind(this);
    this._hideRecommend = this._hideRecommend.bind(this);
    //this._docTouchHandler = this._docTouchHandler.bind(this);
    //this._dragHandler = this._dragHandler.bind(this);
    this._docScrollHandler = this._docScrollHandler.bind(this);
    this._backToTopHandler = this._backToTopHandler.bind(this);
    this._showOptsOverlayHandler = this._showOptsOverlayHandler.bind(this);
    this._topbarClickHandler = this._topbarClickHandler.bind(this);


    this._shareButton.on("click", this._showShareTipLayer);
    this._sideBackTop.natural.addEventListener("click", this._backToTopHandler);
    this._showOptsOverlay.natural.addEventListener("click", this._showOptsOverlayHandler);
    this._recommend && this._recommend.natural.addEventListener("click", this._hideRecommend);
    this._topbar.natural.addEventListener("click", this._topbarClickHandler);
    //this.addEventListener("dragUp", this._dragHandler);
    //this.addEventListener("dragDown", this._dragHandler);
    //document.addEventListener("touchstart", this._docTouchHandler);
    document.addEventListener("scroll", this._docScrollHandler);
});


Page.prototype._topbarClickHandler = function _topbarClickHandler( evt ) {
    if ( evt ) {
        evt.preventDefault();
    }

    window.scrollTo(0, 0);
}


Page.prototype._showShareTipLayer = function _showShareTipLayer( evt ) {
    if ( !this._shareTipLayer ) {
        this._shareTipLayer = document.createElement("div");
        this._shareTipLayer.className = "share-layer";
        this._shareTipLayer.addEventListener("touchmove", function( evt ) {
            evt.stopPropagation();
            evt.preventDefault();
        });
        this._shareTipLayer.addEventListener("click", function( evt ) {
            document.body.removeChild(this);
        });
    }

    document.body.appendChild(this._shareTipLayer);
}


Page.prototype._backToTopHandler = function _backToTopHandler( evt ) {
    if ( evt ) {
        evt.preventDefault();
    }

    window.scrollTo(0, 0);
}


Page.prototype._showOptsOverlayHandler = function _showOptsOverlayHandler( evt ) {
    this._optsOverlay.open();
    var oPos = (evt.currentTarget).getBoundingClientRect().top - this._optsContent.height;

    /// #微信BUG: getBoundingClientRect() 的值包含 scrollY 的值；
    //alert(navigator.userAgent);
    if ( navigator.userAgent.toLowerCase().indexOf("micromessenger") >= 0 ) {
        oPos += window.scrollY;
    }

    this._optsContent.natural.style.top = (oPos - 12) + "px";
    //alert("show:" + oPos + ":" + this._optsContent.height + ":" + (evt.currentTarget).getBoundingClientRect().top + ":" + window.scrollY);
}


Page.prototype._docScrollHandler = function _docScrollHandler( evt ) {
    //var top = Math.max(0, Math.min(window.innerWidth - 80, window.scrollY));

    //this._avatar.y = top;
    var top = $("#specTrigger").offset().top;
    //console.log("top:", top);

    if ( window.scrollY >= top ) {
        this._showToolbar();
        this._showSideNav();
        this._showTopbar();
        //this._topbar.element.show();

        if ( !(Preferences.get("showToptip", true) || 0) ) {
            Preferences.set("showToptip", 1, true);
            this._topbar.natural.classList.add("tooltip-showing");
        }
    }

    else {
        this._hideToolbar();
        this._hideSideNav();
        this._hideTopbar();
        //this._topbar.element.hide();
    }
}


//Page.prototype._docTouchHandler = function _docTouchHandler( evt ) {
//    if ( evt.type == "touchstart" ) {
//        if ( evt.touches.length >= 2 ) {
//            return;
//        }

//        this._startTouchY = evt.targetTouches[0].clientY;
//        this._startTouchI = evt.targetTouches[0].identifier;
        
//        document.addEventListener("touchend", this._docTouchHandler);
//        document.addEventListener("touchcancel", this._docTouchHandler);
//        return;
//    }

//    if ( evt.type == "touchend" ) {
//        document.removeEventListener("touchend", this._docTouchHandler);
//        document.removeEventListener("touchcancel", this._docTouchHandler);

//        var touch = null;

//        for ( var i = 0; i < evt.changedTouches.length; ++i ) {
//            if ( evt.changedTouches[i].identifier === this._startTouchI ) {
//                touch = evt.changedTouches[i];
//                break;
//            }
//        }

//        if ( !touch || Math.abs(touch.clientY - this._startTouchY) <= 5) {
//            return;
//        }

//        if ( touch.clientY >= this._startTouchY ) {
//            this.dispatchEvent(new Event("dragDown", false, false));
//        }

//        else {
//            this.dispatchEvent(new Event("dragUp", false, false));
//        }

//        return;
//    }

//    if ( evt.type == "touchcancel" ) {
//        document.removeEventListener("touchend", this._docTouchHandler);
//        document.removeEventListener("touchcancel", this._docTouchHandler);
//        return;
//    }
//}


//Page.prototype._dragHandler = function _dragHandler( evt ) {
//    if ( evt.type == "dragUp" ) {
//        this._hideToolbar();
//        this._hideTopbar();
//        return;
//    }


//    if ( evt.type == "dragDown" ) {
//        this._showToolbar();
//        this._showTopbar();

//        return;
//    }
//}



Page.prototype._showToolbar = function _showToolbar() {
    // 显示工具条；
    this._toolbar.natural.classList.add("toolbar-showing");
}


Page.prototype._hideToolbar = function _hideToolbar() {
    // 隐藏工具条；
    this._toolbar.natural.classList.remove("toolbar-showing");
}


Page.prototype._showTopbar = function _showTopbar() {
    this._topbar.natural.classList.add("topbar-showing");
}


Page.prototype._hideTopbar = function _hideTopbar() {
    this._topbar.natural.classList.remove("topbar-showing");
}


Page.prototype._showSideNav = function _showSideNav () {
    this._sideNav.natural.classList.add("sidenav-showing");
}


Page.prototype._hideSideNav = function _hideSideNav () {
    this._sideNav.natural.classList.remove("sidenav-showing");
}


Page.prototype._hideRecommend = function _hideRecommend( evt ) {
    this._recommend.natural.classList.add("hidden-recommend");
}