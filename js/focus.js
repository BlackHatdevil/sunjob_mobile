$(document).on("pageinit","#page_focus",function(){
    focus_init_page();
    focus_bind_deal_unfocus();
});

//初始化我的关注页面
function focus_init_page(){
    var user_info = read_from_local(USER_INFO);
    if(user_info){
        var ajaxurl=APP_MODULE_maccount+"focus";
        $.ajax({
            url:ajaxurl,
            type:"post",
            dataType:"json",
            success:function(ajaxobj){
                if(ajaxobj.status==1){
                    $.each(ajaxobj.deals,function(index,value){
                        focus_list_deals(ajaxobj.deals[index]);
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
//列出用户关注的deals
function focus_list_deals(deals){
    var list_deal = "<li><a onclick='focus_show_deal("+deals.id+")'><h3 class='sign_title'>"+deals.name+"</h3><span class='sign_count'>已报名:"+deals.sign_count+"</span></a><a class='unfocus' value='"+deals.fid+"'>取消关注</a></li>";
    $("#page_focus #content_focus .list_deals").append(list_deal).listview("refresh");
}
//取消关注按钮
function focus_bind_deal_unfocus(){
    $("#page_focus #content_focus .list_deals .unfocus").live("tap",function(){
        //存好需要删除的deal
        var unfocus_deal=$(this).parent();
        var query = new Object();
        query.id = $(this).attr("value");
        var ajaxurl = APP_MODULE_maccount+"del_focus";
        confirmJQM("取消关注?",function(){
            $.ajax({
                url:ajaxurl,
                data:query,
                type:"post",
                dataType:"json",
                success:function(ajaxobj){
                    if(ajaxobj.status==1){
                        unfocus_deal.remove();
                    }else{
                        if(ajaxobj.url!=""){
                            to_home(slide);
                        }
                    }
                },
                error:function(ajaxobj){
                }
            });
        })
    });
}

//查看兼职详情
function focus_show_deal(deal){
    CURRENT_DEAL = deal;
    $.mobile.changePage("deal.html",{
        reloadPage:true,
        transition:"slide",
    });
}
