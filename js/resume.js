$(document).on("pageshow","#page_resume",function(){
    resume_init_page();
    resume_to_resume_edit();
    //删除缓存的编辑页面节点
});

//初始化简历信息
function resume_init_page(){
    //清空简历信息,重新加载分配
    $('#page_resume #content_resume .right').empty();
    var user_info = read_from_local(USER_INFO);
    if(user_info){
        /*布局基本的本地信息--------------------------------------------------------------------*/
        $("#page_resume #content_resume #user_head div img").attr("src",user_info.img.big);
        $("#page_resume #content_resume #user_head #signature").text("“ "+user_info.intro+" ”");
        var base_name="<p>昵称："+user_info.user_name+"</p>";
        if(user_info.sex==-1){
            var base_sex="<p>性别：未知</p>";
        }else if(user_info.sex==0){
            var base_sex="<p>性别：女</p>";
        }else if(user_info.sex==1){
            var base_sex="<p>性别：男</p>";
        }else{
            var base_sex="<p>性别：</p>";
        }
        var base_location="<p>位置："+user_info.province+"&nbsp;&nbsp;"+user_info.city+"</p>";
        base_all=base_name+base_sex+base_location;
        $("#page_resume #content_resume #resume_info #base_info .right").append(base_all);

        /*以上是从本地缓存中获取的信息,下面的简历相关需要从服务器端ajax获取--------------------------*/
        resume_init_page_ajax();
    }else{
        to_home();
    }
}

//获取更多的简历信息ajax请求,在初始化resume页面的时候调用
function resume_init_page_ajax(){
    loading_start("读取个人简历中");
    var ajaxurl=APP_MODULE_mresume+"get_resume";
    $.ajax({
        url: ajaxurl,
        dataType: "json",
        type: "POST",
        success: function(ajaxobj){
            loading_end();
            if(ajaxobj.status==1){
                //更新本地的简历
                update_local_resume(ajaxobj);
                $.each(ajaxobj.contact,function(index,value){
                    resume_list_contact(ajaxobj.contact[index]);
                });
                $.each(ajaxobj.intention,function(index,value){
                    resume_list_intention(ajaxobj.intention[index]);
                });
                $("#page_resume #content_resume #introme .right").html("<p>"+ajaxobj.resume.introme+"</p>");
                $("#page_resume #content_resume #experience .right").html("<p>"+ajaxobj.resume.experience+"</p>");
                $("#page_resume #content_resume #college .right").html("<p>"+ajaxobj.resume.college+"</p>");
                $("#page_resume #content_resume #base_info .right").append("<p>姓名："+ajaxobj.resume.real_name+"</p>");
                $("#page_resume #content_resume #base_info .right").append("<p>身高："+ajaxobj.resume.height+"&nbsp;cm</p>");
                $("#page_resume #content_resume #base_info .right").append("<p>体重："+ajaxobj.resume.weight+"&nbsp;kg</p>");
            }else{
                error_report(ajaxobj.info);
                if(ajaxobj.url!=""){
                    to_home();
                }
            }
        },
        error: function(ajaxobj){
            loading_end();
            error_report("网络连接错误!");
        },
    });
}
//列出联系方式
function resume_list_contact(contact){
    var contact_p="<p>"+contact.contact+"</p>";
    $("#page_resume #content_resume #resume_info #contact .right").append(contact_p);
}
//列出求职意向
function resume_list_intention(intention){
    if(intention.selected==1){
        var intention_div="<div class='intention'>"+intention.name+"</div>";
        $("#page_resume #content_resume #resume_info #intention .right").append(intention_div);
    }
}
//转向编辑resume页面的动作
function resume_to_resume_edit(){
    $("#page_resume #header_resume .to_resume_edit").on("tap",function(e){
        //进入编辑模式前初始化
        resume_edit_init_page();
    });
}
