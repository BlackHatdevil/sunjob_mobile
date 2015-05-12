/*-------------------主页的js效果-----------------------------------------------------------*/

$(document).on("pagecreate","#page_index",function(){
    $.mobile.loadPage("deals.html");
    $.mobile.loadPage("home.html");
});
/*pageinit页面初次加载到dom时候的动作*/
$(document).on("pageinit","#page_index",function(){
    check_login();
    index_check_login();
    //绑定分类块块
    index_bind_cate_classify();
});

/*每次显示主页的时候需要执行的js-----------------------------------*/
$(document).on("pageshow","#page_index",function(){
    //滑动切换分类效果
    $("#page_index #content_index .flexslider").flexslider({
        animation:"slide",
        directionNav:false,
        slideshow:false,
    });
    check_login();
    index_check_login();
});

/*index的一些使用的函数-------------------------------------------------------------------*/
/*向服务器检测登陆状态*/
function index_check_login(){
    index_unbind_panel_settings();//解除绑定所有的panel相关
    //从本地读取登陆信息
    user=read_from_local(USER_INFO);
    if(user.is_login==1){
        //显示用户头像
        $("#page_index #header_index .show_user_panel .user_head_img").attr("src",user.img.small);
        $("#page_index #header_index .show_user_panel").fadeIn(800);
        $("#page_index #header_index .go_to_login").hide();
        //绑定panel相关(需传入user相关本地信息)
        index_bind_panel_settings(user);
    }else{
        $("#page_index #header_index .show_user_panel").hide();//隐藏show_user_panel
        $("#page_index .go_to_login").show();//显示登陆按钮
        index_unbind_panel_settings();//解除绑定所有的panel相关
    }
}

/*发起登出请求*/
function index_logout(){
    var query = new Object();
    var ajaxurl = APP_MODULE_muser+"loginout";
    query.ajax = 1;

    $.ajax({
        url: ajaxurl,
        dataType: "json",
        data:query,
        type: "POST",
        success:function(ajaxobj){
            if(ajaxobj.status==1){
                remove_local(USER_INFO,0);//清除本地用户数据
                $("#page_index .user_name div").text("已退出");
                $("#page_index .user_name img").hide();
                setTimeout("index_have_logout()",850);
            }else{
                //非ajax请求(暴力刷新到主页)
                location_to_index();
            }
        },
        error:function(ajaxobj){
            error_report("网络连接错误");
        }
    });
}

//登出后的主页操作
function index_have_logout(){
    $("#page_index #user_panel").panel("close");
    //再次检测登陆情况
    index_check_login();
}

//关于面板的控制功能
function index_bind_panel_settings(user){
    /*向panel中加入用户信息*/
    $("#page_index #user_panel .user_panel .user_name div").text(user.user_name);
    $("#page_index #user_panel .user_panel .user_name img").attr("src",user.img.middle).show();

    //绑定show_user_panel打开panel
    $("#page_index #header_index .show_user_panel").on("tap",function(){
        $("#page_index #user_panel").panel("open");
    });
    //绑定pannel退出
    $( "#page_index #user_panel").panel({ 
        beforeclose: function(){
            $("#page_index #user_panel .user_panel .confirm_logout").hide();
        } 
    });

    $("#page_index #user_panel .user_panel .logout").on("tap",function(){
        $("#page_index #user_panel .user_panel .confirm_logout").slideToggle(650);
    });
    $("#page_index #user_panel .user_panel .confirm_logout .no").on("tap",function(){
        $("#page_index #user_panel .user_panel .confirm_logout").slideToggle(650);
    });
    $("#page_index #user_panel .user_panel .confirm_logout .yes").on("tap",function(){
        index_logout();
        $("#page_index #user_panel .user_panel .confirm_logout").slideToggle(850);
    })
    $("#page_index #user_panel .user_panel .panel_to").click(function(){
        $("#page_index #user_panel").panel("close");
    });

    //手指从左往右滑动显示用户的panel
    $("#page_index").on("swiperight",function(e){
        $("#page_index #user_panel").panel("open");
        e.stopPropagation();
    });
}
//解除绑定panel
function index_unbind_panel_settings(){
    //解绑panel相关
    $("#page_index #header_index .show_user_panel").unbind("tap");
    $("#page_index #user_panel .user_panel .logout").unbind("tap");
    $("#page_index #user_panel .user_panel .confirm_logout .no").unbind("tap");
    $("#page_index #user_panel .user_panel .confirm_logout .yes").unbind("tap");
    $("#page_index").unbind("swiperight");
    $("#page_index #user_panel .user_panel .panel_to").unbind("tap");

}
//制造伪触摸变色事件
function index_bind_cate_classify(){
    $("#page_index #content_index .flexslider .slides .classify_block").on("tap",function(e){
        e.stopPropagation();
        e.preventDefault();
        INDEX_CATE = $(this).attr("value");
        $.mobile.changePage("deals.html",{
            transition:'slide',
        })
    });
}
//panel实现跳转
