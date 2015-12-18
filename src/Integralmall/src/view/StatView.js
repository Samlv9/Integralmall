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
/// <reference path='../core/derive.js' />
/// <reference path='../events/Event.js' />
/// <reference path='./Sprite.js' />


var STAT_VIEW_PAGE_ID_SEED = Date.now();


var StatView = derive(Sprite, function StatView( selector ) {
    Sprite.call(this, selector);

    this._statOpenClass = "stat-open";
    this._transitionElement = null;
    this._useHistoryAPI = true;
    this._statOpen = this.natural.classList.contains(this._statOpenClass);
    this._onStatTransitionEnd = this._onStatTransitionEnd.bind(this);
    this._onHistoryPopStateHandler = this._onHistoryPopStateHandler.bind(this);
    this._restoreHistoryListener();
});


Object.defineProperties(StatView.prototype, {
    /// <field type='Boolean'>
    /// 获取当前视图状态；</field>
    statOpen: {
        get: function () { return this._statOpen; }
    },

    /// <field type='Boolean'>
    /// 指示浏览器是否使用历史记录 API。</field>
    useHistoryAPI: {
        get: function () { return this._useHistoryAPI; },
        set: function( value ) {
            this._useHistoryAPI = !!value;
            this._restoreHistoryListener();
        }
    },

    /// <field type='String'>
    /// 获取当前弹出层的 pageId 值。</field>
    pageId: {
        get: function () { return "StatView-" + STAT_VIEW_PAGE_ID_SEED + "-" + this.natural.getAttribute("data-sprite"); }
    }

});


StatView.prototype._restoreHistoryListener = function _restoreHistoryListener() {
    window[(this._useHistoryAPI ? "addEventListener" : "removeEventListener")]("popstate", this._onHistoryPopStateHandler);
}


StatView.prototype._onHistoryPopStateHandler = function _onHistoryPopStateHandler( evt ) {
    var state = evt.state;

    if ( this._statOpen ) {
        if ( !state || state.page != this.pageId ) {
            this.toggle();
        }
    }

    else {
        if ( state && state.page == this.pageId ) {
            this.toggle();
        }
    }
}


StatView.prototype.open = function open() {
    if ( !this._statOpen ) {
        this.toggle();

        if ( this._useHistoryAPI ) {
            window.history.pushState({ "page": this.pageId }, "StatView");
        }
    }
}


StatView.prototype.close = function close() {
    if ( this._statOpen ) {
        if ( this._useHistoryAPI ) {
            window.history.back();
        }

        else {
            this.toggle(); 
        }
    }
}


StatView.prototype.toggle = function toggle() {
    this._statOpen = !this._statOpen;
    this.dispatchEvent( new Event("statChange", false, false) );

    if ( this._statOpen ) {
        this.natural.style.display = "block";
    }

    else {
        if ( this._transitionElement ) {
            this._transitionElement.addEventListener("transitionEnd", this._onStatTransitionEnd);
            this._transitionElement.addEventListener("webkitTransitionEnd", this._onStatTransitionEnd);
        }

        else {
            this.natural.style.display = "none";
        }
    }

    window.setTimeout((function() {
        this.natural.classList[(this._statOpen ? "add" : "remove")](this._statOpenClass); 
    }.bind(this)), 30);
}


StatView.prototype._onStatTransitionEnd = function _onStatTransitionEnd() {
    this._transitionElement.removeEventListener("transitionEnd", this._onStatTransitionEnd);
    this._transitionElement.removeEventListener("webkitTransitionEnd", this._onStatTransitionEnd);
    this.natural.style.display = "none";
}