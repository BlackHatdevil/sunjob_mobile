/*register.js*/
/*该js用于注册会员，企业和个人公用*/
/*对于所有该页面的function都要加前缀register_*/
$(document).on("pageinit","#page_register",function(){
    $("#page_register #user_register_form input").focus(function(){
        $(this).removeAttr("style");
    });
    register_bind_user_register();
    //手势滑动返回登陆页面
    $("#page_register").on("swiperight",function(){
        $.mobile.changePage("login.html",{
            reverse:true,
            transition:"slide",
        });
    });
});

/*方法*/

//绑定点击注册
function register_bind_user_register(){
    $("#page_register #submit_form").on("tap",function(){
        if(register_check_register_user_name()&&register_check_register_email()&&register_check_register_user_pwd()&&register_check_register_confirm_user_pwd()){
            $("#page_register .tip").html("");
            register_do_register();
        }
    });
}

//注册
var is_submiting = false;
function register_do_register(){
    //防止用户反复提交
    if(!is_submiting){
        is_submiting = true;
        var email = $.trim($("#user_register_form").find("input[name='email']").val());
        var user_pwd = $.trim($("#user_register_form").find("input[name='user_pwd']").val());
        var confirm_user_pwd = $.trim($("#user_register_form").find("input[name='confirm_user_pwd']").val());
        var user_name = $.trim($("#user_register_form").find("input[name='user_name']").val());
        var ajaxurl = APP_MODULE_muser+"do_register";
        var query = new Object();
        query.email = email;
        query.user_name = user_name;
        query.user_pwd = user_pwd;
        query.confirm_user_pwd = confirm_user_pwd;
        $("#page_register #submit_form").text("注册中...").css("color","orange");

        $.ajax({ 
            url: ajaxurl,
            dataType: "json",
            data:query,
            type: "POST",
            success: function(ajaxobj){
                if(ajaxobj.status==1){
                    $("#page_register #submit_form").text("注册成功").css("color","green");
                    register_form_success("注册成功，即将跳转到登陆页面.......");
                    setTimeout('register_success_to_login()',850);
                }
                else{
                    is_submiting = false;
                    $("#page_register #submit_form").text("注册").css("color","black");
                    /*
                       注意这里的代码是用户要审核的操作，可用于企业，暂时注释对应muserModule的29行
                       if(ajaxobj.info!=""){
                       $.showErr(ajaxobj.info,function(){
                       location.href = APP_DOMAIN+"/";
                       });
                       }
                       */
                    for(var i=0;i<ajaxobj.data.length;i++){
                        if(ajaxobj.data[i].type=="form_success"){
                            register_form_success("");
                        }
                        if(ajaxobj.data[i].type=="form_error"){
                            register_form_error(ajaxobj.data[i].info);
                        }
                        if(ajaxobj.data[i].type=="register_form_tip"){
                            register_form_tip(ajaxobj.data[i].info);
                        }						
                    }
                }
            },
            error:function(ajaxobj)
            {
                is_submiting = false;
                //弹出找不到服务器窗口
                $("#page_register #submit_form").text("注册").css("color","black");
                $("#page_register #show_noserver").click();
            }
        });
    }
}
//检查邮箱输入
function register_check_register_email(){
    var mail=$.trim($("#user_register_form").find("input[name='email']").val());
    if(mail==""){
        register_form_tip("请输入邮箱！");		
        $("#user_register_form").find("input[name='email']").css("border","solid 2px red");
        return false;
    }
    //验证邮箱格式
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    if (!reg.test(mail)) {
        register_form_tip('邮箱格式不正确！');
        $("#user_register_form").find("input[name='email']").css("border","solid 2px red");
        return false;
    }
    return true;
}

//检查用户名
function register_check_register_user_name(){
    if($.trim($("#user_register_form").find("input[name='user_name']").val())=="")
    {
        register_form_tip("请输入会员帐号！");
        $("#user_register_form").find("input[name='user_name']").css("border","solid 2px red");
        return false;
    }
    return true;
}

//检查用户密码
function register_check_register_user_pwd(){
    var password=$.trim($("#user_register_form").find("input[name='user_pwd']").val());
    if(password=="")
    {
        register_form_tip("请输入密码！");
        $("#user_register_form").find("input[name='user_pwd']").css("border","solid 2px red");
        return false;
    }
    else if(password.length<4)
    {
        register_form_tip("密码不得小于四位！");
        $("#user_register_form").find("input[name='user_pwd']").css("border","solid 2px red");
        return false;
    }
    return true;
}

//检查确认密码
function register_check_register_confirm_user_pwd(){
    if($.trim($("#user_register_form").find("input[name='confirm_user_pwd']").val())!=$.trim($("#user_register_form").find("input[name='user_pwd']").val()))
    {
        register_form_tip("确认密码不一致！");
        $("#user_register_form").find("input[name='confirm_user_pwd']").css("border","solid 2px red");
        return false;
    }
    return true;
}

//客户端提示
function register_form_tip(str){
    $("#page_register .tip_box").html("<div class='form_tip'>"+str+"</div>");
}
//成功请求提示
function register_form_success(str){
    $("#page_register .tip_box").html("<div class='form_success'>"+str+"</div>");
}
//返回错误提示
function register_form_error(str){
    $("#page_register .tip_box").html("<div class='form_error'>"+str+"</div>");
}
//注册成功返回登陆页面
function register_success_to_login(){
    to_prev_page();
}
/*求职者结束*/
