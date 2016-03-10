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
/// <reference path='view/WeRadioSheet.js' />


var Page = derive(PageBase, function Page() {
    PageBase.call(this);
    //向页面注入radiasheet
    var title="选择取消订单的理由"
    var radioItems=["A","B","C","D","E"];
    var btnContent="确定";
    var trigger=$("#cancelOrder");
    WeRadioSheet(title,radioItems,btnContent,trigger,this,radioSheetBtnClick);
    /// 发货提醒；
    this._toast = new Sprite("#toast");
    this._toastTrigger = $(".toast-trigger");
    this._toastTrigger.on("click", this._showRemindToast.bind(this));
    
});

//点击确定按钮，post数据到后台
function radioSheetBtnClick(){
    console.log("确定按钮被点击")
}

Page.prototype._showRemindToast = function _showRemindToast() {
    /// <summary>
    /// 显示发货提醒。</summary>

    this._toast.natural.classList.add("show-toast");
    this._toastTrigger.addClass("weui_btn_disabled");

    setTimeout(function() {
        this._toast.natural.classList.remove("weui_loading_toast");
        this._toast.natural.classList.add("toast-complete");
        this._toast.element.find(".weui_toast_content").text("提醒成功");
    }.bind(this), 1000);


    setTimeout(function() {
        this._toast.natural.classList.remove("show-toast");
    }.bind(this), 1800);

    setTimeout(function() {
        this._toast.natural.classList.add("weui_loading_toast");
        this._toast.natural.classList.remove("toast-complete");
        this._toast.element.find(".weui_toast_content").text("请稍后...");
        this._toastTrigger.removeClass("weui_btn_disabled");
    }.bind(this), 2100);
}



                   