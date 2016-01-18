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
/// <reference path='core/template.js' />
/// <reference path='page/PageBase.js' />
/// <reference path='view/Sprite.js' />
/// <reference path='view/Overlay.js' />



var Page = derive(PageBase, function Page() {
    PageBase.call(this, true);

    /// 配置参数；
    //this._urlFetchCategories = this._appConfigParam["FETCH_CATEGORIES_URL"] || "http://m.vjf.com.cn/index/categorymodel";
    this._urlFetchRecommends = this._appConfigParam["FETCH_RECOMMENDS_URL"] || "http://m.vjf.com.cn/goods/list?page={{pageId}}&pagesize={{pageSize}}";


    /// 图片轮播；
    //this._recentHeight = 0;
    //this._bannerSprite = new Sprite("#bannerSwiper");
    //this._bannerPagination = new Sprite(this._bannerSprite.element.children(".swiper-pagination"));
    //this._bannerWidth  = this._bannerSprite.width;
    //this._bannerHeight = this._bannerSprite.height;
    //this._bannerSwiper = new Swiper(this._bannerSprite.natural, {
    //    "pagination": ".swiper-pagination",
    //    "loop": true,
    //    "simulateTouch": false,
    //    "threshold": 5,
    //    "autoplay": 4000,
    //    "preloadImages": false,
    //    "effect": "coverflow",
    //    "coverflow": { "slideShadows": false, "rotate": 60 },
    //    "cube": { "slideShadows": false, "shadow": false },
    //    "lazyLoading": true,
    //    "autoplayDisableOnInteraction": false
    //});
    //this._slides = this._bannerSprite.natural.querySelectorAll(".swiper-slide");
    //this._slideSprites = [];
    //this._imageSprites = [];

    //for ( var i = 0; i < this._slides.length; ++i ) {
    //    this._slideSprites[i] = new Sprite(this._slides.item(i));
    //    this._imageSprites[i] = new Sprite(this._slides.item(i).querySelector(".swiper-image"));
    //}

    /// 九宫格按钮组；
    //this._scale9Controls = new Sprite("#scale9Controls");
    //this._scale9Position = this._scale9Controls.natural.getBoundingClientRect().top - this._mainContainer.content.natural.getBoundingClientRect().top;
    //this._scale9TranslateY = 0;

    /// 推荐栏（该栏可能没有）；
    //this._recommend = document.getElementById("recommend");
    //this._recommend = this._recommend ? new Sprite(this._recommend) : null;
    //this._recommendOffset = this._bannerHeight + 1; // 增加 1px 偏移（覆盖Swiper），防止Recommend与Swiper因为计算精度产生间隙。

    /// 商品分类容器；
    //this._shopCategories = new Sprite("#shopCategories");

    /// 商品列表容器；
    this._shopTable = new Sprite("#shopTable");
    this._notice = new Sprite("#notice");

    /// 模板；
    //this._tmplCategories = $("#tmplCategories").html();
    //this._tmplCategoriesToken = $("#tmplCategoriesToken").html();
    this._tmplShopItem = $("#tmplShopItem").html();
    this._tmplUpdateNotice = "最后更新于：{{year}}/{{month}}/{{date}} {{hours}}:{{minutes}}";

    /// 加载指示；
    this._moduleTiper = new Sprite("#moduleTiper");


    /// 懒加载；
    this._lazySqueues = [];
    this._totalLazyCount = 0;
    this._isFetchLazyImage = false;
    this._lazyElement = null;

    /// 推荐列表加载；
    this._hasLoadCategories = true;
    this._isFetchRecommends = false;
    this._isFetchRecommendsComplete = false;
    this._pageId   = this._appConfigParam["PAGE_ID"  ] || 1;
    this._pageSize = this._appConfigParam["PAGE_SIZE"] || 8;
    this._pageType = this._appConfigParam["PAGE_TYPE"] || "";

    /// 返回顶部；
    //this._navToIndex = new Sprite("#navToIndex");

    /// 侧边显示更多导航；
    this._showOptsOverlay = new Sprite("#showOptsOverlay");
    this._sideBackTop = new Sprite("#sideBackTop");

    /// 工具层；
    this._optsOverlay = new Overlay("#optsOverlay");
    this._optsContent = new Sprite(this._optsOverlay.element.children(".overlay-content"));

    /// 侧边导航；
    this._sideNav = new Sprite("#sideNav");

    /// 代理；
    this._mainContainerScrollHandler = this._mainContainerScrollHandler.bind(this);
    //this._fetchCategoriesListHandler = this._fetchCategoriesListHandler.bind(this);
    //this._fetchCategoriesListFailure = this._fetchCategoriesListFailure.bind(this);
    this._loadLazyImageHandler = this._loadLazyImageHandler.bind(this);
    this._fetchRecommendsHandler = this._fetchRecommendsHandler.bind(this);
    this._fetchRecommendsFailure = this._fetchRecommendsFailure.bind(this);
    this._backToTopHandler = this._backToTopHandler.bind(this);
    this._showOptsOverlayHandler = this._showOptsOverlayHandler.bind(this);

    window.addEventListener("scroll", this._mainContainerScrollHandler);
    this._initPage();
});


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


Page.prototype._backToTopHandler = function _backToTopHandler( evt ) {
    if ( evt ) {
        evt.preventDefault();
    }

    window.scrollTo(0, 0);
}


Page.prototype._initPage = function _initPage() {
    this._fetchRecommends();
    this._sideBackTop.natural.addEventListener("click", this._backToTopHandler);
    this._showOptsOverlay.natural.addEventListener("click", this._showOptsOverlayHandler);
}


Page.prototype._mainContainerScrollHandler = function _mainContainerScrollHandler() {
    /// 显示隐藏侧边栏；
    if ( window.scrollY >= 960 ) {
        this._showSideNav();
    }

    else {
        this._hideSideNav();
    }

    /// 更新推荐栏位置；
    //if ( this._recommend ) {
    //    var Ypos = Math.max(-this._recommend.height, Math.min(0, this._mainContainer.scrollY + this._recommendOffset));

    //    if ( this._recommend.y != Ypos ) {
    //        this._recommend.y = Ypos;
    //    }
    //}

    /// 拉伸图片轮播；
    //var height = Math.max(0, this._mainContainer.scrollY * 1.5);

    //if ( this._recentHeight != height ) {
    //    this._recentHeight = height;

    //    var scale = (height + this._bannerHeight) / this._bannerHeight;
    //    var Ypos  = -height;

    //    for ( var i = 0; i < this._slideSprites.length; ++i ) {
    //        this._imageSprites[i].scaleX = this._imageSprites[i].scaleY = scale;
    //    }

    //    this._bannerSprite.y = Ypos;
    //    this._bannerPagination.y = height;
    //}

    /// 设置 9 宫格按钮组位置；
    //var scale9Ypos = Math.max(0, -this._mainContainer.scrollY - this._scale9Position);

    //if ( scale9Ypos != this._scale9TranslateY ) {
    //    this._scale9TranslateY = scale9Ypos;
    //    this._scale9Controls.y = this._scale9TranslateY;
    //}

    /// 懒加载；
    //this._fetchLazySqueues();

    /// 加载推荐列表；
    if ( this._hasLoadCategories && this._isLazyOnScreen(this._moduleTiper.natural) ) {
        this._fetchRecommends();
    }
}


Page.prototype._updateTimestamp = function _updateTimestamp() {
    var date = new Date();
    var format = function( n ) { return n < 10 ? "0" + n : "" + n; };

    this._notice.element.find(".text").text(template(this._tmplUpdateNotice, {
        "year" : date.getFullYear(),
        "month": format(date.getMonth() + 1),
        "date" : format(date.getDate()),
        "hours": format(date.getHours()),
        "minutes": format(date.getMinutes())
    }));
}


Page.prototype.createShopItem = function createShopItem( table ) {
    var html = "";

    for ( var i = 0; i < table.length; ++i ) {
        html += template(this._tmplShopItem, table[i]);
    }

    this._shopTable.element.append(html);
    this._updateTimestamp();
    //this._mainContainer.updateFrameSizes();
}


Page.prototype.drawLazyable = function drawLazyable() {
    var elements = $(".lazyable:not(.loaded)");

    for ( var i = 0; i < elements.length; ++i ) {
        var element = elements.eq(i);

        if ( !element.attr("data-lazyId") ) {
            element.attr("data-lazyId", ++this._totalLazyCount);
            this._lazySqueues.push(element);
        }
    }

    this._fetchLazySqueues();
}


Page.prototype._fetchLazySqueues = function _fetchLazySqueues() {
    if ( this._isFetchLazyImage || !this._lazySqueues.length ) {
        /// 正在加载图片或者是所有的图片已经加载完成；
        return;
    }

    this._loadLazyImage(this._getNextLazyElement());
}


Page.prototype._getNextLazyElement = function _getNextLazyElement() {
    /// 获取需要被加载的 lazy 元素；
    for ( var i = 0; i < this._lazySqueues.length; ++i ) {
        var element = this._lazySqueues[i];

        if ( this._isLazyOnScreen(element[0]) ) {
            return element;
        }
    }

    return null;
}


Page.prototype._isLazyOnScreen = function _isLazyOnScreen( element ) {
    /// 判断元素是否出现在屏幕上；
    var rect   = element.getBoundingClientRect();
    var left   = 0;
    var top    = 0;
    var width  = window.innerWidth;
    var height = window.innerHeight;

    /// 判断 X 轴是否重叠；
    var isXOverlap = (rect.left >= left && rect.left <= (left + width))
        || ((rect.left + rect.width) >= left && (rect.left + rect.width) <= (left + width));

    /// 判断 Y 轴是否重复；
    var isYOverlap = (rect.top >= top && rect.top <= (top + height))
        || ((rect.top + rect.height) >= top && (rect.top + rect.height) <= (top + height));

    /// 当 X 轴和 Y 轴都发生重叠时，则矩形发生重叠；
    return isXOverlap && isYOverlap;
}


Page.prototype._loadLazyImage = function _loadLazyImage( element ) {
    if ( this._isFetchLazyImage || !element ) {
        /// 正在加载图片；
        return;
    }

    this._isFetchLazyImage = true;
    this._lazyElement = element;

    var loader = new Image();
    var src = element.attr("data-src");

    if ( !src ) {
        var event = document.createEvent("Event");
            event.initEvent("error", false, false);

        loader.dispatchEvent(event);
        return;
    }

    loader.addEventListener("load", this._loadLazyImageHandler);
    loader.addEventListener("error", this._loadLazyImageHandler);
    loader.src = src;

    if ( loader.width || loader.height || loader.naturalWidth || loader.naturalHeight ) {
        var event = document.createEvent("Event");
            event.initEvent("load", false, false);

        loader.dispatchEvent(event);
        return;
    }
}


Page.prototype._loadLazyImageHandler = function _loadLazyImageHandler( evt ) {
    var loader = evt.currentTarget;
    loader.removeEventListener("load", this._loadLazyImageHandler);
    loader.removeEventListener("error", this._loadLazyImageHandler);


    if ( evt.type == "load" ) {
        if ( this._lazyElement.is("img") ) {
            this._lazyElement.attr("src", loader.src);
            this._lazyElement.addClass("loaded");
        }

        else {
            this._lazyElement.css({ "backgroundImage": "url(" + loader.src + ")" });
            this._lazyElement.addClass("loaded");
        }
    }

    this._removeLazyElement(this._lazyElement);
    this._lazyElement = null;
    this._isFetchLazyImage = false;
    this._fetchLazySqueues();
}


Page.prototype._removeLazyElement = function _removeLazyElement( element ) {
    for ( var i = 0; i < this._lazySqueues.length; ++i ) {
        if ( this._lazySqueues[i][0] === element[0] ) {
            this._lazySqueues.splice(i, 1);
            break;
        }
    }
}


Page.prototype._fetchRecommends = function _fetchRecommends() {
    if ( this._isFetchRecommends || this._isFetchRecommendsComplete ) {
        /// 正在加载推荐商品；
        return;
    }

    this._isFetchRecommends = true;

    var request = this._urlFetchRecommends
       .replace("{{pageId}}", this._pageId)
       .replace("{{pageSize}}", this._pageSize);

    this._pageId++;
    
    $.ajax({ "url": request, "dataType": "jsonp" })
        .fail(this._fetchRecommendsFailure)
        .done(this._fetchRecommendsHandler);
}


Page.prototype._fetchRecommendsFailure = function _fetchRecommendsFailure( loader ) {
    this._isFetchRecommends = false;
}


Page.prototype._fetchRecommendsHandler = function _fetchRecommendsHandler( dataJSON, status, loader ) {
    this._isFetchRecommends = false;

    if ( dataJSON.length ) {
        this.createShopItem(dataJSON);
        //this.drawLazyable();
    }

    else {
        this._doFetchRecommendsComplete();
    }
}


Page.prototype._doFetchRecommendsComplete = function _doFetchRecommendsComplete () {
    this._isFetchRecommendsComplete = true;
    this._moduleTiper.element.find(".swiper-lazy-preloader").hide();
    this._moduleTiper.element.find(".loader-text").text("更多商品，敬请期待！");
    //this._mainContainer.updateFrameSizes();
}


Page.prototype._showSideNav = function _showSideNav () {
    this._sideNav.natural.classList.add("sidenav-showing");
}


Page.prototype._hideSideNav = function _hideSideNav () {
    this._sideNav.natural.classList.remove("sidenav-showing");
}