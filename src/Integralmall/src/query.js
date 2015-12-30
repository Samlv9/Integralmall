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
/// <reference path='view/ScrollContainer.js' />


var Page = derive(PageBase, function Page() {
    PageBase.call(this, true);

    /// 容器列表；
    this._querySwiper = new Swiper("#querySwiper", { 
        "threshold": 5,
        "pagination": document.getElementById("queryNav"),
        "paginationClickable": true,
        "bulletClass": "query-button",
        "preventClicksPropagation": false,
        "preventClicks": false,
        "touchMoveStopPropagation": false,
        "bulletActiveClass": "selected",
        "paginationBulletRender": function( index, className ) {
            var labels = [ "所有订单", "未付款", "已付款", "待收货", "交易完成" ];
            return '<a class="' + className + '" href="javascript:void(0);"><span class="query-label">' + labels[index] + '</span></a>';
        }
    });


    this._allOrder = new ScrollContainer("#allOrder");
    this._notPayOrder = new ScrollContainer("#notPayOrder");
    this._hasPayOrder = new ScrollContainer("#hasPayOrder");
    this._flowOrder = new ScrollContainer("#flowOrder");
    this._doneOrder = new ScrollContainer("#doneOrder");
    

    /// Ajax Page Settting
    this._allListContainer = [ this._allOrder, this._notPayOrder, this._hasPayOrder, this._flowOrder, this._doneOrder ];
    this._allListFillData  = [ false, false, false, false, false ];
    this._allListStatus    = [ false, false, false, false, false ];
    this._allListPageNum   = [ 1, 1, 1, 1, 1 ];
    this._allListPageSize  = [ 5, 5, 5, 5, 5 ];
    //this._allListUID = this._appConfigParam["ALL_LIST_UID"] || "1010030";
    this._allListURL = this._appConfigParam["ALL_LIST_URL"] || "http://quanqiugou.cn/user-message/order-list-ajax?order_type={{pageId}}&pageNo={{pageNum}}&pageSize={{pageSize}}";

    /// 模板
    this._tmplOrderItem = $("#tmplOrderItem").html();
    this._tmplOrderGoods = $("#tmplOrderGoods").html();

    this._listScrollHandler = this._listScrollHandler.bind(this);
    this._fetchFirstPageHandler = this._fetchFirstPageHandler.bind(this);
    this._fetchPageOrderListSuccess = this._fetchPageOrderListSuccess.bind(this);
    this._fetchPageOrderListFailure = this._fetchPageOrderListFailure.bind(this);
    this._initPage();
});


Page.prototype._initPage = function _initPage () {
    this._querySwiper.on("onSlideChangeEnd", this._fetchFirstPageHandler);
    this._fetchFirstPageHandler(null);

    for ( var i = 0; i < this._allListContainer.length; ++i ) {
        var container = this._allListContainer[i];

        container.disableIndicator = true;
        container.threshold = 10;
        container.addEventListener("scroll", this._listScrollHandler);
    }
}


Page.prototype._listScrollHandler = function _listScrollHandler( evt ) {
    /// 滚动至底部时，加载更多数据；
    var container = evt.currentTarget;
    var tiper = container.element.find(".loader-tiper");
    var detectHeight = tiper[0].clientHeight;
    var detectY = detectHeight - container.scrollHeight;
    
    if ( container.scrollY <= detectY ) {
        var pageId = this._allListContainer.indexOf(container);
        this._fetchPageOrderListData(pageId, this._allListPageNum[pageId], this._allListPageSize[pageId]);
    }


    //$(".query-label").first().text(++TY);
}


Page.prototype._fetchFirstPageHandler = function _fetchFirstPageHandler( evt ) {
    /// 渲染首屏数据；
    var pageId = this._querySwiper.activeIndex;

    if ( this._allListFillData[pageId] ) {
        return;
    }

    this._allListFillData[pageId] = true;
    this._fetchPageOrderListData(pageId, this._allListPageNum[pageId], this._allListPageSize[pageId]);

    /// #WARN: 从第二次开始，Ajax 每次加载 5 页数据；
    //this._allListPageNum[pageId]++;
    //this._allListPageSize[pageId] = 5;
}


Page.prototype._fetchPageOrderListData = function _fetchPageOrderListData( pageId, pageNum, pageSize ) {
    /// 防止重复加载；
    if ( this._allListStatus[pageId] ) {
        return;
    }

    this._allListStatus[pageId] = true;
    this._allListPageNum[pageId]++;
    this._allListContainer[pageId].natural.classList.add("show-loading");

    /// URL Request;
    var request = this._allListURL
        //.replace('{{UID}}', this._allListUID)
        .replace('{{pageId}}', pageId)
        .replace('{{pageNum}}', pageNum)
        .replace('{{pageSize}}', pageSize);

    var loader = $.ajax({ "url": request, "dataType": "jsonp" });
        loader.fail( this._fetchPageOrderListFailure );
        loader.done( this._fetchPageOrderListSuccess );
        loader.data = { "pageId": pageId, "pageNum": pageNum, "pageSize": pageSize };

    var pageId = loader.data.pageId;
    var container = this._allListContainer[pageId];
    var tiper = container.element.find(".loader-tiper");
        tiper.children(".loader-text").text("加载数据中");

    //console.log("fetch:", request);
}


Page.prototype._fetchPageOrderListFailure = function _fetchPageOrderListFailure( loader ) {
    /// 处理数据加载失败；
    var pageId = loader.data.pageId;
    var container = this._allListContainer[pageId];
    var tiper = container.element.find(".loader-tiper");
        tiper.children(".loader-text").text("加载失败");

    this._disablePageOrderLoader(pageId);
    this._allListStatus[pageId] = false;
}


Page.prototype._fetchPageOrderListSuccess = function _fetchPageOrderListSuccess( dataJSON, status, loader ) {
    /// 处理数据；
    var pageId = loader.data.pageId;
    var container = this._allListContainer[pageId];
    var tiper = container.element.find(".loader-tiper");
        tiper.children(".loader-text").text("加载完成");

    if ( dataJSON.code == "0" ) {
        this._redenPageOrderList(dataJSON.list, loader);
        container.updateFrameSizes();
    }

    else {
        this._fetchPageOrderListFailure(loader);
        return;
    }


    this._allListStatus[pageId] = false;
    //console.log("dataJSON:", dataJSON);
}


Page.prototype._redenPageOrderList = function _redenPageOrderList( list, loader ) {
    var pageId = loader.data.pageId;
    var pageNum = loader.data.pageNum;
    var pageSize = loader.data.pageSize;
    var container = this._allListContainer[pageId];
    var tiper = container.element.find(".loader-tiper");

    /// 渲染订单列表；
    if ( list && list.length ) {
        for ( var i = 0; i < list.length; ++i ) {
            $(this._rendenPageOrderItem(list[i])).insertBefore(tiper);
        }
    }

    if ( !list || (list.length < pageSize) ) {
        this._disablePageOrderLoader(pageId);
    }
}


Page.prototype._disablePageOrderLoader = function _disablePageOrderLoader( pageId ) {
    /// 禁用页面加载；
    var container = this._allListContainer[pageId];
    var tiper = container.element.find(".loader-tiper");

    tiper.remove();
    container.removeEventListener("scroll", this._listScrollHandler);

    /// 显示暂无数据；
    if ( !(container.element.find(".order-cells").length > 0) ) {
        container.natural.classList.add("no-data");
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