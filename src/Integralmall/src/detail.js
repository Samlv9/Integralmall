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
/// <reference path='view/ScrollContainer.js' />
/// <reference path='view/Overlay.js' />
/// <reference path='view/Dropdown.js' />
/// <reference path='utils/Preferences.js' />
/// <reference path='view/WeDialog.js' />


var Page = derive(PageBase, function Page() {
    PageBase.call(this);

    /// 配置参数；
    this._distance = 88;
    this._threshold = 48;
    this._avatarOverlay = 30;
    this._fadeTopDistance = 120;
    this._allowScrollSize = 100;
    this._isShowMore = false;
    this._isLoadMore = false;

    this._buyNow = false;
    this._isAjax = false;

    /// 图片轮播插件；
    this._swiperSprite = new Sprite("#detailSwiper");
    this._detailSwiper = new Swiper(this._swiperSprite.natural, {
        "pagination": ".swiper-pagination",
        "loop": true,
        "simulateTouch": false,
        "threshold": 5,
        "autoplay": 4000,
        "preloadImages": false,
        "lazyLoading": true
    });

    /// 下拉加载更多。
    this._morePromptsSprite = new Sprite("#detailMorePrompts");
    this._backPromptsSprite = new Sprite("#detailBackPrompts");

    /// 简介页面容器；
    this._mainContainer.disableIndicator = true;
    this._mainContainer.maxTopEdgeBounces = 64;
    this._avatar = new Sprite("#avatar");
    this._intros = new Sprite("#detailIntroduct");

    /// 详情页面容器；
    this._sideContainer = new ScrollContainer("#side");
    this._sideContainer.maxTopEdgeBounces = 88;

    /// 属性选择容器；
    this._optionOverlay   = new Overlay("#optionOverlay");
    this._optionContainer = new ScrollContainer("#option");
    this._optionTrigger   = new Sprite("#optionTrigger");


    /// 立即购买
    this._buyNowTrigger = $(".buyNow");
    /// 选择属性确认按钮
    this._chooseAttribute = $("#choose-attribute");

    /// 规格参数层；
    this._specOverlay = new Overlay("#specOverlay");
    this._specContainer = new ScrollContainer("#spec");
    this._specTrigger = new Sprite("#specTrigger");


    /// 头/底部工具栏；
    this._topbar = new Sprite("#detTop");
    this._toolbar = new Sprite("#toolbar");

    /// dropdown
    this._descDropdown = new Dropdown("#descDropdown");

    /// 分享提示层
    this._shareButton = $(".share-button");
    this._shareTipLayer = null;

    /// 事件处理；
    this._showShareTipLayer = this._showShareTipLayer.bind(this);
    this._viewPullUpHandler = this._viewPullUpHandler.bind(this);
    this._viewScrollHandler = this._viewScrollHandler.bind(this);
    this._sidePullUpHandler = this._sidePullUpHandler.bind(this);
    this._sideScrollHandler = this._sideScrollHandler.bind(this);
    this._dragSideViewHandler = this._dragSideViewHandler.bind(this);
    this._topbarClickHandler = this._topbarClickHandler.bind(this);
    this._showOptionLayer = this._showOptionLayer.bind(this);
    this._showSpecLayer = this._showSpecLayer.bind(this);
    this._sidePullDownHandler = this._sidePullDownHandler.bind(this);
    this._chooseAttributeconfirm = this._chooseAttributeconfirm.bind(this);
    this._showBuyNowOptionLayer = this._showBuyNowOptionLayer.bind(this);
    this._sendAjax = this._sendAjax.bind(this);

    this._confirmAjax = this._confirmAjax.bind(this);

    this._mainContainer.addEventListener("pull"  , this._viewPullUpHandler);
    this._mainContainer.addEventListener("scroll", this._viewScrollHandler);
    this._sideContainer.addEventListener("pull"  , this._sidePullUpHandler);
    this._sideContainer.addEventListener("pull"  , this._sidePullDownHandler); 
    this._sideContainer.addEventListener("scroll", this._sideScrollHandler);
    this._sideContainer.addEventListener("drag"  , this._dragSideViewHandler);
    this._topbar.natural.addEventListener("click", this._topbarClickHandler);
    this._optionTrigger.natural.addEventListener("click", this._showOptionLayer);
    this._specTrigger.natural.addEventListener("click", this._showSpecLayer);
    this._shareButton.on("click", this._showShareTipLayer);

    this._buyNowTrigger.on("click", this._showBuyNowOptionLayer);
    this._chooseAttribute.on("click", this._chooseAttributeconfirm);

});

Page.prototype._chooseAttributeconfirm = function( evt ){
    /// 选择属性确认按钮
    var product_attributes = $(".product-attributes");
    //skuID
    var sku_prop_id = '';
    //sku名字 返回时使用
    var sku_prop_name = '';
    //数量
    var num = $('.weui_input.counter-input').val();
    for(var i = 0; i < product_attributes.length; i++){
        var ratio_val = $("input[name='"+i+"']:checked").val();
        var ratio_text = $("input[name='"+i+"']:checked").next().text();
        if(typeof ratio_val == 'undefined'){
            var attributes_value = product_attributes.eq(i).find(".option-chooser-title").text();
            WeAlert('温馨提示', '请选择 '+attributes_value, this, this._alertAfter);
            return;
        }else{
            sku_prop_id += ratio_val + ';';
            sku_prop_name += ratio_text + '、';
        }
    }
    $("#formOptionOutput").text(sku_prop_name + num + '件');
    $("#sku_id").val(sku_prop_id);
    $("#num_id").val(num);

    if(product_attributes.length < 0 && sku_prop_id == ''){
        WeAlert('温馨提示', '请选择 完整的属性 ', this, this._alertAfter);
        return;
    }
    this._sendAjax(num,sku_prop_id,evt.currentTarget);


}
////**jiajia start**///

Page.prototype._alertAfter = function(status, dom, evt){

}

Page.prototype._showBuyNowOptionLayer = function( evt ){
    /// <summary>
    /// 立即购买处理；</summary>
    var product_attributes = $(".product-attributes").length;
    if($(evt.currentTarget).hasClass("buyNow")){
        this._buyNow = true;
    }
    if(product_attributes > 0  && $("#checkout-after-data").val() == ''){
        this._optionOverlay.open();
    }else if(product_attributes == 0 && $("#num_id").val() == ''){
        this._optionOverlay.open();
    }else{
        var sku_prop_id = $("#sku_id").val();
        var num         = $(".weui_input.counter-input").val();
        this._sendAjax(num,sku_prop_id,evt.currentTarget);
    }
}


Page.prototype._sendAjax = function(num,sku_prop_id,currentTarget){
    /// <summary>
    /// 发送ajax检验库存等信息；</summary>
    if(!!(this._isAjax)){
        return;
    }

    this._isAjax = true;
    if($(currentTarget).hasClass("buyNow")){
        //立即购买 ajax成功后提交表单
        this._buyNow = true;
    }
    var csrf  = $('meta[name="csrf-token"]').attr('content');
    $.ajax({
        type: "post",
        url: this._appConfigParam.POST_URL,
        data: {
            id:$("#goods_id").val(),
            sid:$("#share_id").val(),
            num:num,sku:sku_prop_id,
            _csrf:csrf
        },
        dataType: "json",
        success: this._confirmAjax
    });

}

Page.prototype._confirmAjax = function(data, textStatus, jqXHR){
    this._isAjax = false;
    if(data.status == true){
        $("#checkout-after-data").val(data.data);
        if(this._buyNow){
            //提交表单
            $('#order-form').submit();
            return ;
        }
        this._optionOverlay.close();
    }else{
        WeAlert('温馨提示', data.message, this, this._alertAfter, {});
    }
}

////**jiajia end**///

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


Page.prototype._sidePullDownHandler = function _sidePullDownHandler() {
    /// 拉动底部，显示购买按钮；
    var bottom = Math.max(0, -this._sideContainer.scrollHeight - this._sideContainer.scrollY);

    if ( bottom >= this._threshold ) {
        this._showTopbar();
        this._showToolbar();
    }
}


Page.prototype._viewScrollHandler = function _viewScrollHandler( evt ) {
    var bound  = this._intros.natural.getBoundingClientRect().top;
    var offset = Math.min((this._avatar.height + this._avatarOverlay), bound);

    /// 头像位置；
    this._avatar.y = offset - (this._avatar.height + this._avatarOverlay);

    /// 更新 Swiper 的偏移位置；
    this._swiperSprite.y = Math.min(this._swiperSprite.height, Math.max(0, -this._mainContainer.scrollY) * 0.5);

    /// 更新 morePrompts 位置;
    var bottom = Math.min(this._distance, Math.max(0, -this._mainContainer.scrollHeight - this._mainContainer.scrollY));
    var height = Math.max(44, bottom * 0.75);

    this._morePromptsSprite.y = bottom * 0.25;
    //this._moreTips.y = bottom * 0.20;
    //this._morePromptsSprite.element.find(".loading").css({ "opacity": bottom / this._distance });

    if ( height >= this._threshold ) {
        this._morePromptsSprite.element.find(".text").text("释放手指，加载图文详情");
        this._morePromptsSprite.element.find(".loading").addClass("fade-in");
    }

    else {
        this._morePromptsSprite.element.find(".text").text("继续拖动，查看图文详情");
        this._morePromptsSprite.element.find(".loading").removeClass("fade-in");
    }
}


Page.prototype._sideScrollHandler = function _sideScrollHandler( evt ) {
    /// 更新 backPrompts 位置;
    var top = Math.min(this._distance, Math.max(0, this._sideContainer.scrollY));
    var height = Math.max(44, top * 0.75);

    this._backPromptsSprite.y = -top * 0.25;
    this._backPromptsSprite.element.find(".text").css({ "height": height + "px", "line-height": height + "px" });

    if ( height >= this._threshold ) {
        this._backPromptsSprite.element.find(".text").text("释放手指，查看商品简介");
    }

    else {
        this._backPromptsSprite.element.find(".text").text("继续拖动，返回商品简介");
    }

    /// 更新头部位置；
    var factor = Math.min(this._fadeTopDistance, Math.max(0, -this._sideContainer.scrollY - this._allowScrollSize)) / this._fadeTopDistance;
    this._topbar.y = -(1 - factor) * this._topbar.height;

    var showToptip = Preferences.get("showToptip", true) || 0;

    if ( !showToptip && (-this._sideContainer.scrollY >= (this._allowScrollSize + this._fadeTopDistance)) ) {
        Preferences.set("showToptip", 1, true);

        this._topbar.natural.classList.add("tooltip-showing");
    }
}


Page.prototype._dragSideViewHandler = function _dragSideViewHandler( evt ) {
    /// 滑动；
    if ( evt.vy > 0 ) {
        this._showToolbar();
        //this._showTopbar();
    }

    else {
        //this._hideTopbar();
        this._hideToolbar();
    }
}


Page.prototype._topbarClickHandler = function _topbarClickHandler( evt ) {
    if ( this._isShowMore ) {
        this._isShowMore = false;
        this._showMainPage();
        this._mainContainer.scrollY = 0;
        this._avatar.y = 0;
        //this._mainContainer.scrollTo(500, this._mainContainer.scrollX, 0);
        //this._sideContainer.scrollTo(600, this._sideContainer.scrollX, 0);
    } 
}


Page.prototype._showMorePage = function _showMorePage () {
    /// 切换至详情页面；
    this._mainContainer.y = -this.height;
    this._sideContainer.y = -this.height;
}


Page.prototype._showMainPage = function _showMainPage () {
    /// 切换至简介页面
    this._mainContainer.y = 0;
    this._sideContainer.y = 0;
}


Page.prototype._showToolbar = function _showToolbar() {
    // 显示工具条；
    this._toolbar.natural.classList.add("toolbar-showing");
}


Page.prototype._hideToolbar = function _hideToolbar() {
    // 隐藏工具条；
    this._toolbar.natural.classList.remove("toolbar-showing");
}


Page.prototype._showTopbar = function _showTopbar() {
    this._topbar.natural.classList.add("topbar-showing");
}


Page.prototype._hideTopbar = function _hideTopbar() {
    this._topbar.natural.classList.remove("topbar-showing");
}


Page.prototype._showOptionLayer = function _showOptionLayer() {
    /// <summary>
    /// 显示选项弹出层；</summary>


    this._optionOverlay.open();
}


Page.prototype._showSpecLayer = function _showSpecLayer() {
    /// <summary>
    /// 显示规格参数层；</summary>

    this._specOverlay.open();
}


Page.prototype._cancelOverlayHandler = function _cancelOverlayHandler( evt ) {
    evt.preventDefault();
    evt.stopPropagation();

    this.close();
}


Page.prototype._showShareTipLayer = function _showShareTipLayer( evt ) {
    if ( !this._shareTipLayer ) {
        this._shareTipLayer = document.createElement("div");
        this._shareTipLayer.className = "share-layer";
        this._shareTipLayer.addEventListener("click", function( evt ) {
            document.body.removeChild(this);
        });
    }

    document.body.appendChild(this._shareTipLayer);
}