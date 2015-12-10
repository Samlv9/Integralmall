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

    /// 配置参数；
    this._distance = 88;
    this._threshold = 56;
    this._isShowMore = false;
    this._isLoadMore = false;

    /// 图片轮播插件；
    this._swiperSprite = new Sprite("#detailSwiper");
    this._detailSwiper = new Swiper(this._swiperSprite.natural, {
        "pagination": ".swiper-pagination",
        "loop": true
    });

    /// 下拉加载更多。
    this._morePromptsSprite = new Sprite("#detailMorePrompts");
    this._backPromptsSprite = new Sprite("#detailBackPrompts");

    /// 详情页面容器；
    this._sideContainer = new ScrollContainer("#side");

    /// 事件处理；
    this._viewPullUpHandler = this._viewPullUpHandler.bind(this);
    this._viewScrollHandler = this._viewScrollHandler.bind(this);
    this._sidePullUpHandler = this._sidePullUpHandler.bind(this);
    this._sideScrollHandler = this._sideScrollHandler.bind(this);

    this._mainContainer.addEventListener("pull"  , this._viewPullUpHandler);
    this._mainContainer.addEventListener("scroll", this._viewScrollHandler);
    this._sideContainer.addEventListener("pull"  , this._sidePullUpHandler);
    this._sideContainer.addEventListener("scroll", this._sideScrollHandler);
});



Page.prototype._viewPullUpHandler = function _viewPullUpHandler( evt ) {
    /// 查看更多
    var bottom = Math.min(this._distance, Math.max(0, -this._mainContainer.scrollHeight - this._mainContainer.scrollY));
    var height = Math.max(44, bottom * 0.75);

    if ( !this._isShowMore && height >= this._threshold ) {
        this._isShowMore = true;
        this._showMorePage();
    }
}


Page.prototype._sidePullUpHandler = function _sidePullUpHandler( evt ) {
    /// 返回简介
    var top = Math.min(this._distance, Math.max(0, this._sideContainer.scrollY));
    var height = Math.max(44, top * 0.75);

    if ( this._isShowMore && height >= this._threshold ) {
        this._isShowMore = false;
        this._showMainPage();
    }
}


Page.prototype._viewScrollHandler = function _viewScrollHandler( evt ) {
    /// 更新 Swiper 的偏移位置；
    this._swiperSprite.y = Math.min(this._swiperSprite.height, Math.max(0, -this._mainContainer.scrollY) * 0.5);

    /// 更新 morePrompts 位置;
    var bottom = Math.min(this._distance, Math.max(0, -this._mainContainer.scrollHeight - this._mainContainer.scrollY));
    var height = Math.max(44, bottom * 0.75);

    this._morePromptsSprite.y = bottom * 0.25;
    this._morePromptsSprite.element.find(".text").css({ "height": height + "px", "line-height": height + "px" });

    if ( height >= this._threshold ) {
        this._morePromptsSprite.element.find(".text").text("释放手指，加载图文详情 >");
    }

    else {
        this._morePromptsSprite.element.find(".text").text("继续拖动，查看图文详情 >");
    }

    /// 更新头部透明度；
    var fixtop = document.getElementById("fixtop");
    var opacity = Math.min(300, Math.max(0, -this._mainContainer.scrollY)) / 300;

    if ( fixtop ) {
        fixtop.style.opacity = opacity;
    }
}


Page.prototype._sideScrollHandler = function _sideScrollHandler( evt ) {
    /// 更新 backPrompts 位置;
    var top = Math.min(this._distance, Math.max(0, this._sideContainer.scrollY));
    var height = Math.max(44, top * 0.75);

    this._backPromptsSprite.y = -top * 0.25;
    this._backPromptsSprite.element.find(".text").css({ "height": height + "px", "line-height": height + "px" });

    if ( height >= this._threshold ) {
        this._backPromptsSprite.element.find(".text").text("释放手指，返回商品简介 >");
    }

    else {
        this._backPromptsSprite.element.find(".text").text("继续拖动，返回商品简介 >");
    }
}


Page.prototype._showMorePage = function _showMorePage () {
    /// 切换至详情页面；
    this.y = -this.height;
}


Page.prototype._showMainPage = function _showMainPage () {
    /// 切换至简介页面
    this.y = 0;
}