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

    this._initAllScrollContainer([ this._allOrder, this._notPayOrder, this._hasPayOrder, this._flowOrder, this._doneOrder ]);

});


Page.prototype._initAllScrollContainer = function _initAllScrollContainer( list ) {
    for ( var i = 0; i < list.length; ++i ) {
        var container = list[i];

        container.disableIndicator = true;
        container.threshold = 10;
    }
}
