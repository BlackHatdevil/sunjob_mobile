$(document).on("pageinit","#page_resume_edit",function(){
    resume_edit_init_page();
    resume_edit_bind_submit_resume();
});
//初始化编辑简历页面
function resume_edit_init_page(){
    var user_info = read_from_local(USER_INFO);
    if(user_info){
        //修改一下list-divider加入用户名
        $("#page_resume_edit #content_resume_edit .ajax_form .resume_title").text(user_info.user_name+"  简历");
        //获取用户的resume
        resume_edit_get_resume();
    }else{
        to_home();
    }
}

//ajax获取resume信息
function resume_edit_get_resume(){
    ajaxobj=read_from_local(USER_RESUME);
    //如果得不到本地resume就发送请求获取
    if(!ajaxobj){
        resume_edit_get_ajax_resume();
        return;
    }

    if(ajaxobj.status==1){
        resume_edit_show_resume(ajaxobj.resume);
        //清空表单数据
        $("#page_resume_edit #content_resume_edit .ajax_form #intention").empty();
        //遍历给出求职意向
        $.each(ajaxobj.intention,function(index,value){
            resume_edit_intention_to_option(ajaxobj.intention[index]);
        });
    }else{
        error_report(ajaxobj.info);
        if(ajaxobj.url!=""){
            to_home();
        }
    }
}

function resume_edit_show_resume(resume){
    var resume_form = $("#page_resume_edit #content_resume_edit .ajax_form");
    resume_form.find("#real_name").val(resume.real_name);
    resume_form.find("#height").val(resume.height);
    resume_form.find("#weight").val(resume.weight);
    resume_form.find("#birth").val(resume.birth);
    resume_form.find("#introme").val(resume.introme);
    resume_form.find("#experience").val(resume.experience);
    if(resume.college!="")
        resume_form.find("#college").text(resume.college);
}
//列出所有的意向,就是分类cate
function resume_edit_intention_to_option(intention){
    if(intention.selected==1){
        var intention_option="<option selected='selected' value='"+intention.id+"'>"+intention.name+"</option>";
    }else{
        var intention_option="<option value='"+intention.id+"'>"+intention.name+"</option>";
    }
    $("#page_resume_edit #content_resume_edit .ajax_form #intention").append(intention_option).selectmenu("refresh");
}
//绑定提交简历按钮
function resume_edit_bind_submit_resume(){
    $("#page_resume_edit #content_resume_edit #submit_form").on("tap",function(){
        resume_edit_do_update_resume();
    });
}
//更新用户简历
function resume_edit_do_update_resume(){
    var query = new Object();
    //多选的下拉菜单遍历获值
    var intention = [];
    $("#page_resume_edit #content_resume_edit .ajax_form #intention option:selected").each(function(i){
        intention[i] = $(this).val();
    });
    /*获取全部的简历表单数据---------------------------------------------------------------------------------*/
    query.intention = intention;
    query.real_name = $("#page_resume_edit #content_resume_edit .ajax_form #real_name").val();
    query.height = $("#page_resume_edit #content_resume_edit .ajax_form #height").val();
    query.weight = $("#page_resume_edit #content_resume_edit .ajax_form #weight").val();
    query.birth = $("#page_resume_edit #content_resume_edit .ajax_form #birth").val();
    query.introme = $("#page_resume_edit #content_resume_edit .ajax_form #introme").val();
    query.experience = $("#page_resume_edit #content_resume_edit .ajax_form #experience").val();
    query.college = $("#page_resume_edit #content_resume_edit .ajax_form #college").text();

    var ajaxurl = APP_MODULE_mresume+"save_resume";
    $.ajax({
        url:ajaxurl,
        type:"post",
        data:query,
        dataType:"json",
        success:function(ajaxobj){
            success_report(ajaxobj.info);
        },
        error:function(ajaxobj){
            error_report("无法连接到网络");
        },
    });
}

/*-----------------------------------------------inc/resume_edit_college.html页面的脚本---------*/
$(document).on("pageinit","#page_resume_edit_college",function(){
    var ajax;

    $("#page_resume_edit_college #content_resume_edit_college #search_college").on("input oninput",function(){
        $("#page_resume_edit_college #content_resume_edit_college #list_college").empty().hide();
        var ajaxurl = APP_MODULE_mresume+"search_get_college";
        var query = new Object();
        query.college=$(this).val();
        if(ajax){
            ajax.abort();
        }
        ajax = $.ajax({
            url:ajaxurl,
             type:"post",
             dataType:"json",
             data:query,
             success:function(ajaxobj){
                 if(ajaxobj){
                     $.each(ajaxobj,function(index,value){
                         resume_edit_college_list_college(ajaxobj[index]);
                     });
                 }
             },
             error:function(ajaxobj){
             }
        });
        $("#page_resume_edit_college #content_resume_edit_college #list_college").fadeIn(800);
    });
})
function resume_edit_college_list_college(college){
    var college_li="<li><a onclick='resume_edit_college_select(\""+college.school_name+"\")'>"+college.school_name+"</a></li>";
    $("#page_resume_edit_college #content_resume_edit_college #list_college").append(college_li).listview("refresh");
}

function resume_edit_college_select(select_college){
    to_prev_page();
    $("#page_resume_edit #content_resume_edit .ajax_form ul li #college").text(select_college);
}

function resume_edit_get_ajax_resume(){
    var ajaxurl=APP_MODULE_mresume+"get_resume";
    $.ajax({
        url: ajaxurl,
        dataType: "json",
        type: "POST",
        success: function(ajaxobj){
            if(ajaxobj.status==1){
                resume_edit_show_resume(ajaxobj.resume);
                //清空表单数据
                $("#page_resume_edit #content_resume_edit .ajax_form #intention").empty();
                //遍历给出求职意向
                $.each(ajaxobj.intention,function(index,value){
                    resume_edit_intention_to_option(ajaxobj.intention[index]);
                });
            }else{
                error_report(ajaxobj.info);
                if(ajaxobj.url!=""){
                    to_home();
                }
            }
        },error:function(ajaxobj){
            error_report("网络连接错误");
        }
    });
}
/*-----------------------------------------------inc/resume_edit_college.html脚本结束---------*/

/*---------inc/resume_edit_freetime.html页面的脚本--------------------------------------*/
$(document).on("pageinit","#page_resume_edit_freetime",function(){
    resume_edit_freetime_init_page();
    resume_edit_freetime_bind_submit();
});

//初始化用户的空闲时间表
function resume_edit_freetime_init_page(){
    $.ajax({
        url:APP_MODULE_mresume+"show_freetime_table",
        type:"post",
        dataType:"json",
        success:function(ajaxobj){
            if(ajaxobj.status==1){
                if(ajaxobj.time_table!=""){
                    $("#page_resume_edit_freetime #content_resume_edit_freetime .ajax_form").html(ajaxobj.time_table);
                }
            }else{
                error_report(ajaxobj.info);
                if(ajaxobj.url!=""){
                    to_home();
                }
            }
            resume_edit_freetime_bind_time_block();
        },
        error:function(ajaxobj){
            error_report("网络连接错误!");
            resume_edit_freetime_bind_time_block();
        },
    });
}

//绑定点击table事件
function resume_edit_freetime_bind_time_block(){
    $("#page_resume_edit_freetime #content_resume_edit_freetime .ajax_form .time_block").on("tap",function(){
        $(this).toggleClass("time_block_selected");
    });
}
//绑定提交时间表
function resume_edit_freetime_bind_submit(){
    $("#page_resume_edit_freetime #header_resume_edit_freetime #sub_time_table").on("tap",function(){
        var table=$('#page_resume_edit_freetime #content_resume_edit_freetime .ajax_form').html();
        var ajaxurl=APP_MODULE_mresume+"edit_freetime";
        var query = new Object();
        query.time_table = table;
        $.ajax({
            url:ajaxurl,
            type:"post",
            dataType:"json",
            data:query,
            success:function(ajaxobj){
                //保存成功为1
                if(ajaxobj.status==1){
                    success_report(ajaxobj.info);
                }else{
                    error_report(ajaxobj.info);
                    if(ajaxobj.url!=""){
                        to_home();
                    }
                }
            },
            error:function(ajaxobj){
                error_report("网络连接错误!服务器繁忙");
            },
        });
    });
}
/*----------------inc/resume_edit_freetime.html脚本结束------------------------------*/


/*----------------inc/resume_edit_headimg.html使用的js脚本------------------------------*/
$(document).on("pageinit","#page_resume_edit_headimg",function(){
    resume_edit_headimg_show_user_headimg();
    resume_edit_headimg_bind_avatar_file();
});
//显示用户头像当前头像
function resume_edit_headimg_show_user_headimg(){
    var user_info=read_from_local(USER_INFO);
    if(user_info){
        //显示大头像
        $("#page_resume_edit_headimg #content_resume_edit_headimg #user_head_big").attr("src",user_info.img.big);
    }else{
        error_report("错误:找不到登录信息!");
    }
}

function resume_edit_headimg_bind_avatar_file(){
    var user_head = $("#page_resume_edit_headimg #content_resume_edit_headimg .user_head");
    var user_info = read_from_local(USER_INFO);

    user_head.find("#tri_upload").on("tap",function(){
        user_head.find("#avatar_file").trigger("click");

        user_head.find("#avatar_file").bind("change",function(){			
            user_head.find("#tri_upload").hide();
            user_head.find("#img_uploading").show();
            $.ajaxFileUpload({
                url:APP_MODULE_mavatar+'upload&uid='+user_info.id,
                secureuri:false,
                fileElementId:"avatar_file",
                dataType: 'json',
                success: function (data, status){
                    user_head.find("#tri_upload").show();
                    user_head.find("#img_uploading").hide();
                    if(data.status==1){
                        user_head.find("#user_head_big").attr("src",APP_DOMAIN+data.big_url+"?r="+Math.random());
                    }else{
                        error_report(data.msg);
                    }
                    //重置本地存储
                    check_login();
                },
                error: function (data, status, e){
                    user_head.find("#tri_upload").show();
                    user_head.find("#img_uploading").hide();
                    error_report(data.msg);
                }
            });	
            user_head.find("#avatar_file").unbind("change");
        });
    });
}

//重置本地存储
function resume_edit_restore_local(){
    var user_info = read_from_local(USER_INFO);
    //把三张图片的地址做个手脚
    user_info.img.small+=("?r="+Math.random());
    user_info.img.middle+=("?r="+Math.random());
    user_info.img.big+=("?r="+Math.random());

    var json_string=JSON.stringify(user_info);
    localStorage.setItem(dataname,json_string);
}
/*----------------inc/resume_edit_headimg.html脚本结束------------------------------*/

