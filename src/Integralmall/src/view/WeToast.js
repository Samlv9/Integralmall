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


var WE_TOAST_TEMPLATE  = '<div class="{{IS_LOADING_TOAST}}">'
    + '<div class="weui_mask_transparent"></div>'
    + '<div class="weui_toast">'
    + '{{TOAST_LOADING}}'
    + '<div class="weui_toast_content">请稍后...</div>'
    + '</div>'
    + '</div>';

var WE_TOAST_LOADING = '<div class="weui_loading">'
    + '<div class="weui_loading_leaf weui_loading_leaf_0"></div>'
    + '<div class="weui_loading_leaf weui_loading_leaf_1"></div>'
    + '<div class="weui_loading_leaf weui_loading_leaf_2"></div>'
    + '<div class="weui_loading_leaf weui_loading_leaf_3"></div>'
    + '<div class="weui_loading_leaf weui_loading_leaf_4"></div>'
    + '<div class="weui_loading_leaf weui_loading_leaf_5"></div>'
    + '<div class="weui_loading_leaf weui_loading_leaf_6"></div>'
    + '<div class="weui_loading_leaf weui_loading_leaf_7"></div>'
    + '<div class="weui_loading_leaf weui_loading_leaf_8"></div>'
    + '<div class="weui_loading_leaf weui_loading_leaf_9"></div>'
    + '<div class="weui_loading_leaf weui_loading_leaf_10"></div>'
    + '<div class="weui_loading_leaf weui_loading_leaf_11"></div>'
    + '</div>';

var WE_TOAST_ICON = '<i class="weui_icon_toast"></i>';


var WE_TOAST_ELEMENT = null;
var WE_TOAST_INTERVAL = 0;
var WE_DONE_TOAST_ELEMENT = null;
var WE_DONE_TOAST_INTERVAL = 0;


function ShowWeToast( textContent, autoRemove ) {
    if ( !WE_TOAST_ELEMENT ) {
        WE_TOAST_ELEMENT = CreateToastElement('weui_loading_toast');
    }

    textContent = textContent || '请稍后...';
    WE_TOAST_ELEMENT.querySelector('.weui_toast_content').textContent = textContent;
    document.body.appendChild(WE_TOAST_ELEMENT);

    if ( autoRemove && autoRemove >= 100 ) {
        clearTimeout(WE_TOAST_INTERVAL);
        WE_TOAST_INTERVAL = setTimeout(HideWeToast, autoRemove);
    }
}


function ShowWeToastDone( textContent, autoRemove ) {
    if ( !WE_DONE_TOAST_ELEMENT ) {
        WE_DONE_TOAST_ELEMENT = CreateToastElement('');
    }

    textContent = textContent || '已完成';
    WE_DONE_TOAST_ELEMENT.querySelector('.weui_toast_content').textContent = textContent;
    document.body.appendChild(WE_DONE_TOAST_ELEMENT);

    if ( autoRemove && autoRemove >= 100 ) {
        clearTimeout(WE_DONE_TOAST_INTERVAL);
        WE_DONE_TOAST_INTERVAL = setTimeout(HideWeToast, autoRemove);
    }
}


function HideWeToast() {
    if ( WE_TOAST_ELEMENT ) {
        document.body.removeChild(WE_TOAST_ELEMENT);
    }
}

function HideWeToastDone() {
    if ( WE_DONE_TOAST_ELEMENT ) {
        document.body.removeChild(WE_DONE_TOAST_ELEMENT);
    }
}


function CreateToastElement( isLoadingToast ) {
    var html = WE_TOAST_TEMPLATE.replace('{{TOAST_LOADING}}', WE_TOAST_LOADING);
        html = html.replace('{{IS_LOADING_TOAST}}', isLoadingToast);
    var div = document.createElement("div");
        div.innerHTML = html;

    return div.firstElementChild;
}


