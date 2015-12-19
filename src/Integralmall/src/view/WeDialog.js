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


var WE_DIALOG_TEMPLATE = 
'<div class="{{type}}">' +
    '<div class="weui_mask"></div>' +
    '<div class="weui_dialog">' +
        '<div class="weui_dialog_hd"><strong class="weui_dialog_title">{{title}}</strong></div>' +
        '<div class="weui_dialog_bd">{{message}}</div>' +
        '<div class="weui_dialog_ft">{{button}}</div>'
    '</div>'
'</div>';

var WE_DIALOG_BUTTON_TEMPLATE = '<a href="javascript:void(0);" class="weui_btn_dialog {{type}}" data-rogs="{{rogs}}">{{label}}</a>';


function WeAlert( title, message, dispatcher, callback, config ) {
    var config = config || {};
    var dialog = CreateDialogElement({
        "title": title,
        "type" : "weui_dialog_alert",
        "message": message,
        "controls": [
            { "type": "primary dialog-cancel", "label": config.done || "确认", "rogs": 1 }
        ]
    });

    WeShowDialog(dialog, dispatcher, callback);
}


function WeConfirm( title, message, dispatcher, callback, config ) {
    var config = config || {};
    var dialog = CreateDialogElement({
        "title": title,
        "type" : "weui_dialog_confirm",
        "message": message,
        "controls": [
            { "type": "primary dialog-cancel", "label": config.done || "确认", "rogs": 1 },
            { "type": "default dialog-cancel", "label": config.cancel || "取消", "rogs": 0 }
        ]
    });

    WeShowDialog(dialog, dispatcher, callback);
}


function CreateDialogElement( model ) {
    var tmpl = "";
    var btns = "";

    if ( model.controls && model.controls.length ) {
        for ( var i = 0; i < model.controls.length; ++i ) {
            var data = model.controls[i];

            btns += WE_DIALOG_BUTTON_TEMPLATE.replace('{{type}}', data.type).replace('{{label}}', data.label).replace('{{rogs}}', data.rogs);
        }
    }

    tmpl = WE_DIALOG_TEMPLATE.replace('{{type}}', model.type)
        .replace('{{title}}', model.title)
        .replace('{{message}}', model.message)
        .replace('{{button}}', btns);

    var div = document.createElement('div');
        div.innerHTML = tmpl;

    return div.firstElementChild;
}


function WeShowDialog( dialog, dispatcher, callback ) {
    document.body.appendChild(dialog);

    dialog.addEventListener("click", function( evt ) {
        var target = evt.target;

        while( target && target != dialog ) {
            if ( target.classList.contains("dialog-cancel") ) {
                document.body.removeChild(dialog);
                callback.call(dispatcher, +(target.getAttribute("data-rogs")), target, evt);
                return;
            }

            target = target.parentNode;
        }
    });
}