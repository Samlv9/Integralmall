/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/// @Copyright ~2016 StefanChen 
/// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//radio表单模板
    var WE_RADIO_SHEET_TEMPLATE='<div id="actionSheet_wrap">'+
        '<div class="weui_mask_transition" id="mask"></div>'+
        '<div class="weui_actionsheet z-index999" id="weui_actionsheet">'+
            '<div class="weui_cells_title">{{TITLE}}</div>'+
            '<div class="weui_cells weui_cells_radio">'+
               '{{RADIO_SHEET}}'+                
        '</div>'+
        '<div class="weui_btn_group">'+
            '<a href="javascript:void(0);" class="weui_btn weui_btn_primary radioSheetBtn"  id="actionsheet_cancel">{{BTN_CONTENT}}</a>'+
        '</div>'+
        // '<div class="weui_btn weui_btn_primary radioSheetBtn" id="actionsheet_cancel">{{BTN_CONTENT}}</div>'+
        '</div>'+
 '</div>';
 //radio模板
   var WE_RADIO_TEMPLATE=' <label class="weui_cell weui_check_label" for="{{FOR_ID}}">'+
                    '<div class="weui_cell_bd weui_cell_primary">'+
                        '<p>{{RADIO_CONTENT}}</p>'+
                    '</div>'+
                    '<div class="weui_cell_ft">'+
                        '<input type="radio" class="weui_check" name="radio1" id="{{ID}}">'+
                        '<span class="weui_icon_checked"></span>'+
                    '</div>'+
                '</label>';
//生成radioItems
function createRadioItems(radioItems){
  var radioItemsHtml="";
  for(var i=0;i<radioItems.length;i++){
    radioItemsHtml+=WE_RADIO_TEMPLATE.replace('{{FOR_ID}}','radio'+i).replace('{{RADIO_CONTENT}}',radioItems[i]).replace('{{ID}}','radio'+i);
  }
  return radioItemsHtml;
}

//生成radiosheet
function createWeRadioSheetElement(title, radioItems,btnContent) {
    var radioItemsHtml=createRadioItems(radioItems);
    //console.log(radioItemsHtml);
    var html = WE_RADIO_SHEET_TEMPLATE.replace("{{TITLE}}",title).replace('{{RADIO_SHEET}}', radioItemsHtml).replace("{{BTN_CONTENT}}",btnContent);
    //console.log(html);
    var div = document.createElement("div");
        div.innerHTML = html;
    return div.firstElementChild;
}


///title:标题
///radioItems:选项集合(数组形式)
///bthContent:按钮文本
///dispatcher:this指向
///callback:点击底部绿色按钮触发的函数
///trigger:触发显示的$对象
function WeRadioSheet( title,radioItems,btnContent,trigger,dispatcher, callback ) {
    var radioSheet=createWeRadioSheetElement(title,radioItems,btnContent);
    document.body.appendChild(radioSheet);

    radioSheet.addEventListener("click", function( evt ) {
	        var target = evt.target;
	        while( target && target != radioSheet ) {
	            if ( target.classList.contains("radioSheetBtn") ) {          
	                //document.body.removeChild(dialog);
	                if ( typeof callback == "function" ) {
	                    //console.log($(".weui_check:checked").parent().parent()[0].innerText.trim());
	                    callback.call(dispatcher || window, target, evt);
	                }
	                return;
	            }
	            target = target.parentNode;
	        }
    	});
    radioSheet.addEventListener("touchmove", function( evt ) {
            evt.stopPropagation();
            evt.preventDefault();
        });
     var mask = $('#mask');
    var weuiActionsheet = $('#weui_actionsheet');
    trigger.on("click",function(){
        weuiActionsheet.addClass('weui_actionsheet_toggle');
        mask.show().addClass('weui_fade_toggle').one('click', function () {
            hideActionSheet(weuiActionsheet, mask);
        });
        $('#actionsheet_cancel').one('click', function () {
            hideActionSheet(weuiActionsheet, mask);
        });
        weuiActionsheet.unbind('transitionend').unbind('webkitTransitionEnd');
    });
  
    function hideActionSheet(weuiActionsheet, mask) {
        weuiActionsheet.removeClass('weui_actionsheet_toggle');
        mask.removeClass('weui_fade_toggle');
        weuiActionsheet.on('transitionend', function () {
            mask.hide();
        }).on('webkitTransitionEnd', function () {
            mask.hide();
        })
}
}

