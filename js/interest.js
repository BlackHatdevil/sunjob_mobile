$(document).on("pageinit","#page_interest",function(){
    interest_init_page();
});
function interest_init_page(){
    //本地检测登陆信息
    var userinfo = read_from_local(USER_INFO);
    if(userinfo.is_login!==1){
        //未登录则移除感兴趣的工作 DOM 并且显示登陆提示
        $("#page_interest #content_interest #list_interest").remove();
        $("#page_interest #content_interest .nologin").show();
        return;
    }

    //请求前隐藏错误提示
    $("#page_interest #content_interest #list_error").hide();
    //向服务器请求感兴趣的工作
    var ajaxurl = APP_MODULE_mdeals+"interest_deals";
    $.ajax({
        url: ajaxurl,
        dataType: "json",
        type: "POST",
        success: function(ajaxobj){
            //服务器端检测出未登录
            if(ajaxobj.status==0){
                $("#page_interest #content_interest #list_interest").empty().remove();
                if(ajaxobj.info!==""){
                    $("#page_interest #content_interest #list_error .nologin a").text(ajaxobj.info);
                }
                $("#page_interest #content_interest #list_error").show();
                $("#page_interest #content_interest #list_error .nologin").show();
            }else if(ajaxobj.status==1){
                var dom = $("#page_interest #content_interest #list_interest");
                dom.find("#loading").hide();
                $.each(ajaxobj.deals,function(index,value){
                    //script.js中的列出函数
                    list_append_deals(dom,ajaxobj.deals[index]);
                });
            }else{
                $("#page_interest #content_interest #list_interest").empty().remove();
                $("#page_interest #content_interest #list_error").show();
                $("#page_interest #content_interest #list_error .noresume").show();
            }
        },error: function(ajaxobj){
            error_report("网络连接错误");
        }
    });
}
