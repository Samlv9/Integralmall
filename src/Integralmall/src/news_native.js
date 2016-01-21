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

    this._bannerSprite = new Sprite("#bannerSwiper");
    this._bannerWidth  = this._bannerSprite.width;
    this._bannerHeight = this._bannerSprite.height;
    this._bannerSwiper = new Swiper(this._bannerSprite.natural, {
        "pagination": ".swiper-pagination",
        "loop": true,
        "simulateTouch": false,
        "threshold": 5,
        "autoplay": 4000,
        "preloadImages": false,
        //"effect": "coverflow",
        "coverflow": { "slideShadows": false, "rotate": 60 },
        "cube": { "slideShadows": false, "shadow": false },
        "lazyLoading": true,
        "autoplayDisableOnInteraction": false
    });


    /// 头部栏；
    this._xpHeader = new Sprite("#xpHeader");
    this._xpTitle  = new Sprite(this._xpHeader.element.find(".xp-title"));
    this._xpHeaderOffset = this._bannerHeight;
    this._xpHeaderPosition = this._xpTitle.height;
    this._isXPHeaderShowing = true;

    this._xpAllNavList = new Sprite("#xpAllNavList");
    this._xpAllNavListTrigger = new Sprite("#xpAllNavListTrigger");
    this._isShowAllNavList = false;

    this._xpHeaderMask = new Sprite("#xpHeaderMask");

    this._scrollHandler = this._scrollHandler.bind(this);
    this._toggleAllNavList = this._toggleAllNavList.bind(this);
    this._xpHeaderMaskClickHandler = this._xpHeaderMaskClickHandler.bind(this);
    this._initPage();
});


Page.prototype._initPage = function _initPage() {
    window.addEventListener("scroll", this._scrollHandler);
    this._xpAllNavListTrigger.natural.addEventListener("click", this._toggleAllNavList);
    this._xpHeaderMask.natural.addEventListener("click", this._xpHeaderMaskClickHandler);

    $(".disable-touchmove").on("touchmove", function( evt ) {
        evt.preventDefault();
    });
}


Page.prototype._scrollHandler = function _scrollHandler( evt ) {
    if ( this._isXPHeaderShowing ) {
        if ( window.scrollY >= this._xpHeaderOffset ) {
            this._hideXPHeader();
        }
    }

    else {
        if ( window.scrollY < this._xpHeaderOffset ) {
            this._showXPHeader();
        }
    }

    /// 这里触发下拉加载更多；
}


Page.prototype._showXPHeader = function _showXPHeader() {
    this._isXPHeaderShowing = true;
    this._xpHeader.y = 0;
}


Page.prototype._hideXPHeader = function _hideXPHeader() {
    this._isXPHeaderShowing = false;
    this._xpHeader.y = -this._xpHeaderPosition;
}


Page.prototype._toggleAllNavList = function _toggleAllNavList( evt ) {
    this._isShowAllNavList = !this._isShowAllNavList;

    if ( this._isShowAllNavList ) {
        document.body.classList.add("all-list");
        this._xpAllNavListTrigger.natural.textContent = "收起";
        this._xpAllNavList.natural.style.height = this._xpAllNavList.element.children(".xp-nav-list").height() + "px";
    }

    else {
        document.body.classList.remove("all-list");
        this._xpAllNavListTrigger.natural.textContent = "更多";
        this._xpAllNavList.natural.style.height = "32px";
    }
}


Page.prototype._xpHeaderMaskClickHandler = function _xpHeaderMaskClickHandler( evt ) {
    if ( this._isShowAllNavList ) {
        this._toggleAllNavList( evt );
    }
}
