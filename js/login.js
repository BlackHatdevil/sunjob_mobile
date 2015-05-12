/*login.js*/
/*该js用于用户登陆*/
/*login.js所有的function前面加前缀login*/
$(document).on("pageinit","#page_login",function(){
    $("#page_login #user_login_form input").focus(function(){
        $(this).removeAttr("style");
    });
    login_bind_user_login();
    //滑动手势返回主页
    $("#page_login").on("swiperight",function(){
        $.mobile.changePage("index.html",{
            reverse:true,
            transition:"fade",
        });
    });
});

/*----------------------一些方法----------------------------------------------------------------*/

//绑定登陆
function login_bind_user_login()
{
    $("#page_login #submit_form").on("tap",function(){
        login_do_login_user();
    });
}

//登陆上传信息
function login_do_login_user()
{

    if($.trim($("#page_login #user_login_form").find("input[name='email']").val())=="")
    {
        $("#page_login #user_login_form").find("input[name='email']").css("border","2px solid red");
        login_form_tip("请输入邮箱/账号！");
        return false;
    }
    if($.trim($("#page_login #user_login_form").find("input[name='user_pwd']").val())=="")
    {
        $("#page_login #user_login_form").find("input[name='user_pwd']").css("border","2px solid red");
        login_form_tip("请输入密码！");
        return false;
    }


    $("#page_login #submit_form").text("登陆中...").css("color","#FE6B1B").unbind("tap");
    var ajaxurl = APP_MODULE_muser+"do_login";
    var query = $("#page_login form[name='user_login_form']").serialize() ;

    $.ajax({ 
        url: ajaxurl,
        dataType: "json",
        data:query,
        type: "POST",
        success: function(ajaxobj){
            if(ajaxobj.status==1){
                $("#page_login .tip_box").html("");
                login_form_success();
            }
            else{
                //如果登陆失败需要重新绑定登陆按钮的登陆功能
                $("#page_login #submit_form").text("登陆").css("color","black").on("tap",login_bind_user_login());
                login_form_error(ajaxobj.info);							
            }
        },
        error:function(ajaxobj){
            $("#page_login #submit_form").text("登陆").css("color","black").on("tap",login_bind_user_login());
            //弹出找不到服务器窗口
            $("#show_noserver").click();
        }
    });
}

/*对用户的提示*/
function login_form_tip(str){
    $("#page_login .tip_box").html("<div class='form_tip'>"+str+"</div>");
}
/*服务器端返回测错误*/
function login_form_error(str){
    $("#page_login .tip_box").html("<div class='form_error'>"+str+"</div>");
}
/*服务器返回登陆成功*/
function login_form_success(){
    $("#page_login .login_img").css("background","#E1E1E1").attr("src","images/login_success.png");
    $("#page_login #submit_form").text("登陆成功").css("color","green");
    //以下特别注意setTimeout函数必须加上双引号执行函数！！！
    remove_local(USER_INFO,0);
    check_login();//获取登陆后的信息
    setTimeout("login_success_to_index('fade')",850);
}
//登陆成功返回主页的函数
function login_success_to_index(tran){
    /*
    $.mobile.changePage("index.html",{
    //reloadPage:true,
    transition:tran,
    reverse:true,
    }); 
    //展示出index的登陆信息
    index_check_login();
    */
    //返回上一页
    to_prev_page();
    index_check_login();
}
