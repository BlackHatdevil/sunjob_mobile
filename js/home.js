$(document).on("pageshow","#page_home",function(){
    check_login();
    home_read_user();
});

//读取用户登陆信息
function home_read_user(){
    user=read_from_local(USER_INFO);
    //判断用户登陆信息的存在性
    if(user.is_login==1){
        home_form_user_baseinfo(user);
    }else{
        home_form_need_login();
    }
}
//格式化home页面用户基本信息
function home_form_user_baseinfo(baseinfo){
    user_headimg="<img class='user_head' src='"+baseinfo.img.middle+"'/>"
    user_name="<div>用户："+baseinfo.user_name+"</div>";
    user_email="<div>邮箱："+baseinfo.email+"</div>";
    user_baseinfo=user_headimg+user_name+user_email;
    $("#page_home #content_home #list_user_info .user_base_info a").html(user_baseinfo).attr("href","resume.html");
    $("#page_home #content_home #list_user_info").listview("refresh");
}
//要求登陆
function home_form_need_login(){
    $("#page_home #content_home #list_user_info .user_base_info a").html("<img class='user_head' src='images/home_nologin.jpg'/><h1 style='color:orange;'>亲，请先登陆吧~</h1>").attr("href","login.html");
    $("#page_home #content_home #list_user_info").listview("refresh");
}
