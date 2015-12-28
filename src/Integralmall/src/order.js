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
/// <reference path='view/WeDialog.js' />



var Page = derive(PageBase, function Page() {
    PageBase.call(this);

    this._userAddress = '';
    this._isAjax = false;

    this._autoresizes = $(".autoresize");
    this._selectAddress = $("#select-address");

    this._weixinPay = $("#weixin_pay");

    this._resizeTextarea = this._resizeTextarea.bind(this);
    this._selectAddressFun = this._selectAddressFun.bind(this);
    this._weixinPayFun = this._weixinPayFun.bind(this);
    this._selectAddressSuccess = this._selectAddressSuccess.bind(this);
    this._createOrderSuccess = this._createOrderSuccess.bind(this);
    this._initPage();
});


Page.prototype._initPage = function _initPage() {
    this._autoresizes.find(".order-message").on("input change", this._resizeTextarea);

    /// 选择收货地址
    this._selectAddress.on("click", this._selectAddressFun);

    /// 微信支付
    this._weixinPay.on("click", this._weixinPayFun);

}

Page.prototype._selectAddressFun = function ( evt ) {

    /// 选择收货地址
    var currentURL = location.href.split('#')[0];
    var csrf  = $('meta[name="csrf-token"]').attr('content');
    if(!!(this._isAjax)){
        return false;
    }
    this._isAjax = true;
    var ajaxData={
        url: this._appConfigParam.useaddress,
        type:'post',
        data:{
            currentURL:currentURL,
            _csrf:csrf
        },
        datatype:'json',
        async:false,
        success:this._selectAddressSuccess
    };
    $.ajax(ajaxData);
}

Page.prototype._selectAddressSuccess = function( data, textStatus, jqXHR ){
    this._isAjax = false;

    /// 选择收货地址 回调
    var datas = $.parseJSON(data);
    var self = this;
    /************ios 一定要将参数转为字符串,使用toString()函数**********/
    WeixinJSBridge.invoke(
        'editAddress',
        {
            "appId": datas['appId'],
            "scope":'jsapi_address',
            "signType":'sha1',
            "addrSign": datas['addrSign'],
            "timeStamp":datas['timeStamp'].toString(),
            "nonceStr": datas['nonceStr'].toString()
        },


        function (res) {
            if(res == ''){
                WeAlert('温馨提示','请选择收货地址');
                return false;
            }
            if( res.err_msg != 'edit_address:ok'){
                WeAlert('温馨提示', '请选择地址');
                return false;
            }
            $(".username").text(res.userName);
            $(".telnum").text(res.telNumber);
            $(".province").text(res.proviceFirstStageName);
            $(".city").text(res.addressCitySecondStageName);
            $(".region").text(res.addressCountiesThirdStageName);
            $(".street").text(res.addressDetailInfo);
            $("#address").removeClass('no-data');
            self._userAddress = JSON.stringify(res);
            $("input[name='user[province]']").val(res.addressPostalCode);
            $("input[name='user[city]']").val(res.proviceFirstStageName);
            $("input[name='user[area]']").val(res.addressCitySecondStageName);
            $("input[name='user[name]']").val(res.userName);
            $("input[name='user[contact]']").val(res.telNumber);
            $("input[name='user[detailinfo]']").val(res.addressDetailInfo);
        }
    );

}



Page.prototype._weixinPayFun = function( evt ){
    var order = $("#order_product").val();
    if( order == ''){
        WeAlert('温馨提示', '订单信息不存在');
        return false;
    }
    var remark = $("#leave-message").val();
    if(this._userAddress == false){
        WeAlert('温馨提示', '请选择收货地址');
        return false;
    }

    var data = {

        url:this._appConfigParam.order,
        type:'post',
        data:{
            'order':order,
            'user':this._userAddress,
            'remark':remark
        },
        dataType:'json',
        async:false,
        success:this._createOrderSuccess
    };
    $.ajax(data);
}


Page.prototype._createOrderSuccess = function( data, textStatus, jqXHR ){
    /// 选择收货地址 回调
    var url  =  this._appConfigParam.orderDetail;
    var result = data;
    if(result.succeed === true){
        if (typeof window.WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }else{
            window.WeixinJSBridge.invoke(
                'getBrandWCPayRequest', result.js_pay_config,
                function(res){
                    if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                        window.location.href = url + '?oid='+result.order_id;
                        // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                    }else if(res.err_msg == "get_brand_wcpay_request:cancel"){
                        window.location.href = url + '?oid='+result.order_id;
                    }else{
                        window.location.href = url + '?oid='+result.order_id;
                        WeAlert('温馨提示','交易失败');
                    }
                }
            );
        }
    }else{
        alert(result.msg);
    }

}
Page.prototype._resizeTextarea = function _resizeTextarea( evt ) {
    var textarea = evt.currentTarget;

    textarea.style.height = "0px";
    textarea.style.height = textarea.scrollHeight + "px";
}