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



var Page = derive(PageBase, function Page() {
    PageBase.call(this, true);


    /// 容器；
    this._queryContainer = new Sprite("#queryContainer");
    this._pageId   = this._urlParams["pageId"  ] || 0;
    this._pageNum  = this._urlParams["pageNum" ] || 1;
    this._pageSize = this._urlParams["pageSize"] || 5;
    this._isFetching  = false;

    /// 地址；
    this._allListURL = this._appConfigParam["ALL_LIST_URL"] || "http://quanqiugou.cn/user-message/order-list-ajax?order_type={{pageId}}&pageNo={{pageNum}}&pageSize={{pageSize}}";

    /// 模板
    this._tmplOrderItem = $("#tmplOrderItem").html();
    this._tmplOrderGoods = $("#tmplOrderGoods").html();

    this._fetchDataSuccess = this._fetchDataSuccess.bind(this);
    this._fetchDataFailure = this._fetchDataFailure.bind(this);
    this._listScrollHandler = this._listScrollHandler.bind(this);
    this._initPage();
});


Page.prototype._initPage = function _initPage() {
    this._setupScrollListener(true);
    this._fetchListData(this._pageId, this._pageNum, this._pageSize);

    $("#queryHeader .query-button").eq(this._pageId).addClass("selected");
}


Page.prototype._disablePageLoader = function _disablePageLoader() {
    /// 禁用页面加载；
    var container = this._queryContainer;
    var tiper = container.element.find(".loader-tiper");

    tiper.remove();
    this._setupScrollListener(false);

    /// 显示暂无数据；
    if ( !(container.element.find(".order-cells").length > 0) ) {
        this._setAsNoData();
    }
}


Page.prototype._setupScrollListener = function _setupScrollListener( boolean ) {
    if ( !!boolean ) {
        window.addEventListener("scroll", this._listScrollHandler);
    }

    else {
        window.removeEventListener("scroll", this._listScrollHandler);
    }
}


Page.prototype._listScrollHandler = function _listScrollHandler( evt ) {
    /// 滚动至底部时，加载更多数据；
    var container = this._queryContainer;
    var tiper = container.element.find(".loader-tiper");
    var detectHeight = tiper[0].clientHeight;
    var detectY = detectHeight - container.natural.scrollHeight + container.natural.offsetHeight;
    
    if ( -window.scrollY <= detectY ) {
        this._fetchListData(this._pageId, this._pageNum, this._pageSize);
    }
}


Page.prototype._setAsNoData = function _setAsNoData() {
    document.body.classList.add("no-data");
}


Page.prototype._fetchListData = function _fetchListData( pageId, pageNum, pageSize ) {
    /// 防止重复加载；
    if ( this._isFetching ) {
        return;
    }

    this._isFetching = true;
    this._pageNum++;
    this._queryContainer.natural.classList.add("show-loading");

    /// URL Request;
    var request = this._allListURL
        .replace('{{pageId}}', pageId)
        .replace('{{pageNum}}', pageNum)
        .replace('{{pageSize}}', pageSize);

    var loader = $.ajax({ "url": request, "dataType": "jsonp" });
        loader.fail( this._fetchDataFailure );
        loader.done( this._fetchDataSuccess );
        loader.data = { "pageId": pageId, "pageNum": pageNum, "pageSize": pageSize };

    var pageId = loader.data.pageId;
    var container = this._queryContainer;
    var tiper = container.element.find(".loader-tiper");
        tiper.children(".loader-text").text("加载数据中");
}


Page.prototype._fetchDataFailure = function _fetchDataFailure( loader ) {
    /// 处理数据加载失败；
    var pageId = loader.data.pageId;
    var container = this._queryContainer;
    var tiper = container.element.find(".loader-tiper");
        tiper.children(".loader-text").text("加载失败");

    this._disablePageLoader();
    this._isFetching = false;
}


Page.prototype._fetchDataSuccess = function _fetchDataSuccess( dataJSON, status, loader ) {
    /// 处理数据；
    var pageId = loader.data.pageId;
    var container = this._queryContainer;
    var tiper = container.element.find(".loader-tiper");
        tiper.children(".loader-text").text("加载完成");

    if ( dataJSON.code == "0" ) {
        this._redenPageOrderList(dataJSON.list, loader);
    }

    this._isFetching = false;
}


Page.prototype._redenPageOrderList = function _redenPageOrderList( list, loader ) {
    var pageId    = loader.data.pageId;
    var pageNum   = loader.data.pageNum;
    var pageSize  = loader.data.pageSize;
    var container = this._queryContainer;
    var tiper = container.element.find(".loader-tiper");

    /// 渲染订单列表；
    if ( list && list.length ) {
        for ( var i = 0; i < list.length; ++i ) {
            $(this._rendenPageOrderItem(list[i])).insertBefore(tiper);
        }
    }

    if ( !list || (list.length < pageSize) ) {
        this._disablePageLoader();
    }
}


Page.prototype._rendenPageOrderItem = function _rendenPageOrderItem( item ) {
    /// 渲染单个订单；
    item.status = (item.status == 5 ? "order-done-status" : "");
    item.list   = this._rendenPageOrderGoods(item.list);

    return template(this._tmplOrderItem, item);
}


Page.prototype._rendenPageOrderGoods = function _rendenPageOrderGoods( goods ) {
    /// 渲染单个商品；
    var content = "";

    for ( var i = 0; i < goods.length; ++i ) {
        goods[i].show_market_class = (goods[i].market_price === null || typeof goods[i].market_price == "undefined") ? "hidden-origin" : "";
        content += template(this._tmplOrderGoods, goods[i]);
    }

    return content;
}