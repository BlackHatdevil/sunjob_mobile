$(document).on("pageinit","#page_deal",function(){
    deal_bind_focus();
    deal_bind_sign();
});
$(document).on("pageshow","#page_deal",function(){
    deal_show_deal();
});

//初始化deal页面,显示兼职相关
function deal_show_deal(){
    if(!CURRENT_DEAL){
        /*无法显示或者未知本地存储返回deals页面*/
        to_prev_page();
        return;
    }
    var query = new Object();
    query.id = CURRENT_DEAL;
    var ajaxurl=APP_MODULE_mdeal+"show_deal_all";
    loading_start("正在读取兼职信息");
    $.ajax({
        url:ajaxurl,
        type:"post",
        dataType:"json",
        data:query,
        success:function(ajaxobj){
            loading_end();
            if(ajaxobj.status==1){
                //检查服务器返回的关注
                if(ajaxobj.is_focus==1){
                    $("#page_deal #footer_deal #focus").text("已关注").css("color","green");
                }else{
                    $("#page_deal #footer_deal #focus").text("关注").css("color","#000");
                }
                if(ajaxobj.is_sign==1){
                    $("#page_deal #footer_deal #sign").text("已报名").css("color","green").unbind("click");
                }else{
                    $("#page_deal #footer_deal #sign").text("报名").css("color","#000");
                }

                //格式化出服务器获取的deal信息
                deal_form_deal_info(ajaxobj.deal_info);
            }else{
                error_report(ajaxobj.info);
            }
        },error: function(ajaxobj){
            loading_end();
            error_report("网络连接错误!");
        }
    });
}

//格式化并显示deal全部信息的函数
function deal_form_deal_info(deal_info){
    //不面试隐藏面试相关
    if(deal_info.if_interview==0){
        $("#page_deal #content_deal .contact").hide();
    }
    var deal_base_info=$("#page_deal #content_deal ul .base_info div div");
    var deal_more_info=$("#page_deal #content_deal .more_info li");
    var deal_content=$("#page_deal #content_deal .content li");
    var deal_contact=$("#page_deal #content_deal .contact li");
    /*兼职标题*/
    $("#page_deal #content_deal ul li").eq(0).text(deal_info.name);
    deal_base_info.eq(0).append(deal_info.city);
    deal_base_info.eq(1).append(deal_info.create_time);
    deal_base_info.eq(2).append(deal_info.view_count);
    /*招聘相关*/
    deal_more_info.eq(1).append(deal_info.type);
    if(deal_info.limit_applicant==0)
        deal_info.limit_applicant="不限";
    deal_more_info.eq(2).append(deal_info.limit_applicant+"人");
    if(deal_info.sex==0)
        deal_info.sex="女";
    else if(deal_info.sex==1)
        deal_info.sex="男";
    else
        deal_info.sex="不限";
    deal_more_info.eq(3).append(deal_info.sex);
    deal_more_info.eq(4).append(deal_info.begin_time+"&nbsp;-&nbsp;"+deal_info.end_time);
    deal_more_info.eq(5).append("<a href='tel:+86"+deal_info.contact+"'>"+deal_info.contact+"</a>");
    deal_more_info.eq(6).append(deal_info.company);
    /*工作相关*/
    deal_content.eq(1).append(deal_info.limit_price+"元&nbsp;/&nbsp;"+deal_info.pay_way);
    deal_content.eq(2).append(deal_info.settlement);
    deal_content.eq(3).append(deal_info.workdays);
    deal_content.eq(4).append(deal_info.worktime);
    deal_content.eq(5).append(deal_info.location);
    deal_content.eq(6).html(deal_info.description);
    /*面试相关*/
    deal_contact.eq(1).append(deal_info.interview_time)
    deal_contact.eq(2).append(deal_info.interview_loc)
    deal_contact.eq(3).append(deal_info.interviewer)
    deal_contact.eq(4).append("<a href='tel:+86"+deal_info.interview_contact+"'>"+deal_info.interview_contact+"</a>");
}
//绑定关注按钮
function deal_bind_focus(){
    $("#page_deal #footer_deal #focus").on("click",function(){
        var userinfo = read_from_local(USER_INFO);
        if(userinfo.is_login!==1){
            tip("关注前请先登陆!");
            return;
        }
        var ajaxurl=APP_MODULE_mdeal+"focus";
        var query=new Object();
        query.id=CURRENT_DEAL;
        if(!query.id)
            return;
        $.ajax({
            url:ajaxurl,
            type:"post",
            dataType:"json",
            data:query,
            success:function(ajaxobj){
                if(ajaxobj.status==3){
                }else if(ajaxobj.status==1){
                    $("#page_deal #footer_deal #focus").text("已关注").css("color","green");
                }else if(ajaxobj.status==2){
                    $("#page_deal #footer_deal #focus").text("关注").css("color","#000");
                }else{
                    tip("没有登陆!");
                }
            },
            error:function(ajaxobj){
                error_report("网络连接错误!");
            },
        });
    });
}

function deal_bind_sign(){
    $("#page_deal #footer_deal #sign").on("click",function(){
        var userinfo = read_from_local(USER_INFO);
        if(userinfo.is_login!==1){
            tip("申请工作请先登陆!");
            return;
        }
        confirmJQM('确认要申请这份兼职?', function(e){
            ajaxurl=APP_MODULE_mdeal+"sign";
            var query = new Object();
            query.id = CURRENT_DEAL;
            if(!query.id)
                return;
            ajaxstatus = $.ajax({
                url:ajaxurl,
                type:"post",
                dataType:"json",
                data:query,
                success:function(ajaxobj){
                    if(ajaxobj.status==1){
                        success_report(ajaxobj.info);
                        //解除申请绑定按钮
                        $("#page_deal #footer_deal #sign").text("已报名").css("color","green").unbind("click");
                    }else{
                        $("#page_deal #footer_deal #sign").text("报名").css("color","#000");
                        if(ajaxobj.url!=""){
                            deal_to_deals_page();
                        }
                    }
                },
                error:function(ajaxobj){
                    error_report("网络连接超时");
                },
            });
        });
    });
}

function deal_to_deals_page(){
    $.mobile.changePage("deals.html",{
        transition:"slide",
        reverse:true,
    });
    return false;
}
