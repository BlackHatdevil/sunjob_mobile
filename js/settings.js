$(document).on("pageinit","#page_settings",function(){
    //从服务器获取个人信息
    settings_init_user_info();
    settings_bind_province_change();
    settings_bind_submit_form();
});
//初始化个人信息的函数
function settings_init_user_info(){
    var user_info=read_from_local(USER_INFO);
    var ajaxurl=APP_MODULE_msettings+"get_all_settings";
    $.ajax({
        url: ajaxurl,
        dataType: "json",
        type: "POST",
        success: function(ajaxobj){
            if(ajaxobj.status==1){
                if(ajaxobj.province){
                    $.each(ajaxobj.province,function(index,value){
                        settings_province_to_option(ajaxobj.province[index]);
                    });
                }
                if(ajaxobj.city){
                    $.each(ajaxobj.city,function(index,value){
                        settings_city_to_option(ajaxobj.city[index]);
                    });
                }
                if(ajaxobj.contact){
                    $.each(ajaxobj.contact,function(index,value){
                        if(index==0){
                            $("#page_settings #content_settings #contact_box input").eq(0).val(ajaxobj.contact[index].contact);
                        }else{
                            settings_contact_to_input(index,ajaxobj.contact[index]);
                        }
                    });
                }
                var settings_con = $("#page_settings #content_settings");
                settings_con.find("#user_name").val(user_info.user_name).css("color","#FF8700");
                settings_con.find("#email").val(user_info.email).css("color","#FF8700");
                settings_con.find("#intro").val(user_info.intro);
                if(user_info.sex==-1)
                    settings_con.find("#weizhi").attr("checked","checked").checkboxradio("refresh");
                if(user_info.sex==0)
                    settings_con.find("#nv").attr("checked","checked").checkboxradio("refresh");
                if(user_info.sex==1)
                    settings_con.find("#nan").attr("checked","checked").checkboxradio("refresh");
            }else{
                tip("亲，请先登陆！");
                to_home("pop");
            }
        },
        error: function(ajaxobj){
            error_report("网络连接错误！");
        }
    });
}
//初始化所有省份
function settings_province_to_option(province){
    var province_option = "<option value='"+province.id+"'>"+province.name+"</option>";
    if(province.selected==1){
        $("#page_settings #content_settings #province").append(province_option).val(province.id).selectmenu("refresh");
    }else{
        $("#page_settings #content_settings #province").append(province_option).selectmenu("refresh");
    }
}
//列出市级
function settings_city_to_option(city){
    var city_option = "<option value='"+city.id+"'>"+city.name+"</option>";
    if(city.selected==1){
        $("#page_settings #content_settings #city").append(city_option).val(city.id).selectmenu("refresh");
    }else{
        $("#page_settings #content_settings #city").append(city_option).selectmenu("refresh");
    }
}
function settings_contact_to_input(index,contact){
    var contact_input = "<div><input type='text' value='"+contact.contact+"' class='textbox' name='contact[]'/><a href='#' class='contact_click' onClick='settings_del_contact(this)'>删除</a></div>";
    $("#page_settings #content_settings #contact_box").append(contact_input);
}

function settings_bind_province_change(){
    $("#page_settings #content_settings #province").on("change",function(){
        $("#page_settings #content_settings #city").empty();
        $("#page_settings #content_settings #city").append("<option selected='true' value='0'>请选择城市</option>").selectmenu("refresh");
        var ajaxurl = APP_MODULE_msettings+"switch_city";
        var query = new Object();
        query.province_id = $(this).val();
        $.ajax({
            url: ajaxurl,
            dataType: "json",
            data:query,
            type: "POST",
            success: function(ajaxobj){
                $.each(ajaxobj,function(index,value){
                    if(ajaxobj[index].id>0)
                    settings_city_to_option(ajaxobj[index]);
                });
            },
            error: function(ajaxobj){
                error_report("网络连接错误！");
            }
        });
    });
}

//添加和删除联系方式
function settings_add_contact(){
    var contact_input = "<div><input type='text' value='' class='textbox' name='contact[]'/><a href='#' class='contact_click' onClick='settings_del_contact(this)'>删除</a></div>";
    $("#page_settings #content_settings #contact_box").append(contact_input);
}
function settings_del_contact(o){
    $(o).parent().remove();
}

//绑定提交事件
function settings_bind_submit_form(){
    $("#page_settings #content_settings #submit_form").on("tap",function(){
        settings_do_submit();
    });
}
//ajax提交表单
function settings_do_submit(){
    $("#page_settings #content_settings .submit_btn_row").hide();
    $("#page_settings #content_settings .submiting").show();
    var ajaxurl = APP_MODULE_msettings+"save_settings";
    var query = new Object();
    query = $("#page_settings #content_settings .ajax_form").serialize();
    $.ajax({
        url: ajaxurl,
        dataType: "json",
        data:query,
        type: "POST",
        success: function(ajaxobj){
            if(ajaxobj.status==1){
                $("#page_settings #pop_info").text(ajaxobj.info).css("color","green").popup("open");
                //更新本地数据库
                check_login();
            }else{
                $("#page_settings #pop_info").text(ajaxobj.info).css("color","red").popup("open");
                if(ajaxobj.url!=""){
                    //返回页面
                    to_home();
                }
            }
            //恢复按钮
            $("#page_settings #content_settings .submiting").hide();
            $("#page_settings #content_settings .submit_btn_row").show();
        },
        error: function(ajaxobj){
            $("#page_settings #pop_info").text("网络连接错误").css("color","red").popup("open");
            $("#page_settings #content_settings .submiting").hide();
            $("#page_settings #content_settings .submit_btn_row").show();
        }
    });
}
