
/// <reference path='core/derive.js' />
/// <reference path='core/template.js' />
/// <reference path='page/PageBase.js' />



var Page = derive(PageBase, function Page() {
    PageBase.call(this,true);
    //this._classifyNav=new ScrollContainer("#classifyNav");
    //this._classifyNav.disableIndicator=true;
    //this._classifyContent=new ScrollContainer("#classifyContent");    
    //this ._classifyContent.disableIndicator=true;
    this._search_bar= $('#search_input');
    this._search_cancel=$( "#search_cancel");
    this. _search_clear=$( "#search_clear");

    //this._search_bar=this._search_bar.bind(this);
    //this._search_cancel=this._search_cancel.bind(this);
    //this._search_clear=this._search_clear.bind(this);
    this._classifynav_li=$("#classifyNav ul li");
    this._search_bar.on("focus",this._searchBarFocus);
    this._search_bar.on("blur",this._searchBarBlur);
   // this._search_bar.on("input",this._searchBarInput);
     this._classifynav_li.on("click",this._classifyNavLiClick);
     this._search_cancel.on("touchend",this._searchCancelTouchend);
      this._search_clear.on("touchend",this._searchClearTouchend);

});


Page.prototype._classifyNavLiClick = function( evt ){
     $(this).addClass("active").siblings().removeClass("active");
}

Page.prototype._searchBarFocus = function( evt ){
     var $weuiSearchBar = $('#search_bar');
    $weuiSearchBar.addClass('weui_search_focusing');
}

Page.prototype._searchBarBlur = function( evt ){
         var $weuiSearchBar = $('#search_bar');
        $weuiSearchBar.removeClass('weui_search_focusing');
        if($(this).val()){
            $('#search_text').hide();
        }else{
            $('#search_text').show();
        }
}

Page.prototype._searchBarInput = function( evt ){
     var $searchShow = $("#search_show");
                    if($(this).val()){
                        $searchShow.show();
                    }else{
                        $searchShow.hide();
                    }
}

Page.prototype._searchCancelTouchend = function( evt ){
       $("#search_show").hide();
        $('#search_input').val('');
}

Page.prototype._searchClearTouchend = function( evt ){
        $("#search_show").hide();
        $('#search_input').val('');
}



                   