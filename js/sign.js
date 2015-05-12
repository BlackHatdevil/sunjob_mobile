$(document).on("pageinit","#page_sign",function(){
    sign_init_page();
});

//初始化管理申请页面
function sign_init_page(){
    var user_info = read_from_local(USER_INFO);
    if(user_info){
        var ajaxurl=APP_MODULE_maccount+"sign";
        $.ajax({
            url:ajaxurl,
            type:"post",
            dataType:"json",
            success:function(ajaxobj){
                if(ajaxobj.status==1){
                    $.each(ajaxobj.signs,function(index,value){
                        sign_list_signs(ajaxobj.signs[index]);
                    });
                }
            },
            error:function(ajaxobj){
                error_report("网络连接错误!");
            }
        });
    }else{
        to_home("slide");
    }
}

function sign_list_signs(signs){
    var list_start = "<li><a href='sign_deal.html' data-transition='slide' onclick='sign_to_sign_deal("+signs.id+")'>";
    var list_end = "</a></li>";
    var list_title = "<h3>"+signs.deal_name+"</h3>";
    var list;
    if(signs.is_effect==0){
        list = "<li><a href='sign_deal.html' onclick='sign_to_sign_deal("+signs.id+")' data-transition='slide'>"+signs.deal_name+"</a><span class='ui-li-count'>已失效</span></li>";
        $("#page_sign #content_sign #fail_signs").append(list).listview("refresh");
    }else{
        if(signs.sign_status==0){
            list_info = "<p><span class='sign_orange'>状态：待同意</span><span>申请时间："+signs.sign_time+"</span></p>"
        }else if(signs.sign_status==1){
            list_info = "<p><span class='sign_green'>状态：已同意</span><span>同意时间："+signs.agree_time+"</span></p>"
        }else if(signs.sign_status==2){
            list_info = "<p><span class='sign_darkgreen'>状态：已录用</span><span>录用时间："+signs.employ_time+"</span></p>"
        }else{
            return;
        }
        list = list_start+list_title+list_info+list_end;
        $("#page_sign #content_sign .list_signs").append(list).listview("refresh");
    }
}

//跳转详情页面前动作
function sign_to_sign_deal(sign_id){
    CURRENT_SIGN = sign_id;
}
