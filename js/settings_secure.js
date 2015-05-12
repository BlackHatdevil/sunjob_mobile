$(document).on("pageinit","#page_settings_secure",function(){
    //更新以及确认登陆信息
    check_login();
    var userinfo = read_from_local(USER_INFO);
    if(userinfo.is_login!==1){
        to_home();
    }
    settings_secure_bind_change_password();
    settings_secure_bind_input_focus();
});

//函数库
function settings_secure_bind_change_password(){
    $("#page_settings_secure #content_settings_secure #submit_form").on("tap",function(){
        if(settings_secure_check_user_pwd()&&settings_secure_check_confirm_user_pwd()){
            settings_secure_do_change_password();
        }
    });
}

//发送请求
function settings_secure_do_change_password(){
    $("#page_settings_secure .submit_btn_row").hide();
    $("#page_settings_secure .submiting").show();
    var ajaxurl = APP_MODULE_msettings+"save_password";
    var query = new Object();
    query = $("#page_settings_secure #content_settings_secure .ajax_form").serialize();
    $.ajax({
        url:ajaxurl,
        type:"post",
        dataType:"json",
        data:query,
        success:function(ajaxobj){
            if(ajaxobj.status==1){
                $("#page_settings_secure #pop_info").text(ajaxobj.info).css("color","green").popup("open");
            }else{
                $("#page_settings_secure #pop_info").text(ajaxobj.info).css("color","red").popup("open");
                if(ajaxobj.url!=""){
                    to_home();
                }
            }
            $("#page_settings_secure .submiting").hide();
            $("#page_settings_secure .submit_btn_row").show();
        },
        error:function(ajaxobj){
            $("#page_settings_secure #pop_info").text("网络连接错误").css("color","red").popup("open");
            $("#page_settings_secure .submiting").hide();
            $("#page_settings_secure .submit_btn_row").show();
        },
    });
}

//检查用户密码
function settings_secure_check_user_pwd(){
    var password=$.trim($("#page_settings_secure #content_settings_secure #user_pwd").val());
    if(password=="")
    {
        $("#page_settings_secure #content_settings_secure .password_title").text("请输入密码！").css("color","#E40000");
        return false;
    }
    else if(password.length<4)
    {
        $("#page_settings_secure #content_settings_secure .password_title").text("密码不能小于四位！").css("color","#E40000");
        return false;
    }
    return true;
}

//检查确认密码
function settings_secure_check_confirm_user_pwd(){
    if($.trim($("#page_settings_secure #content_settings_secure #confirm_user_pwd").val())!=$.trim($("#page_settings_secure #content_settings_secure #user_pwd").val())){
        $("#page_settings_secure #content_settings_secure .password_title").text("确认密码不一致！").css("color","#E40000");
        return false;
    }
    return true;
}
function settings_secure_bind_input_focus(){
    $("#page_settings_secure #content_settings_secure .ajax_form input").focus(function(){
        $("#page_settings_secure #content_settings_secure .password_title").text("修改密码").css("color","#fff");
    });
}
