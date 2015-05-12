$(document).on("pageinit","#page_sign_deal",function(){
    sign_deal_bind_del_sign();
});

$(document).on("pageshow","#page_sign_deal",function(){
    sign_deal_show();
});

//显示报名和兼职详情
function sign_deal_show(){
    if(!CURRENT_SIGN){
        to_prev_page();
        return;
    }
    var query = new Object();
    query.id = CURRENT_SIGN;
    var ajaxurl = APP_MODULE_maccount+"show_sign_deal";
    loading_start("读取申请详情");
    $.ajax({
        url:ajaxurl,
        type:"post",
        data:query,
        dataType:"json",
        success:function(ajaxobj){
            loading_end();
            if(ajaxobj.status==1){
                sign_deal_list_deal(ajaxobj);
            }else if(ajaxobj.status==0){
                tip(ajaxobj.info);
                to_home();
            }else{
                error_report(ajaxobj.info);
            }
        },
        error:function(ajaxobj){
            loading_end();
            error_report("网络连接错误！");
        }
    });
}

function sign_deal_list_deal(ajaxinfo){
    var main = $("#page_sign_deal #content_sign_deal .main li");
    var work = $("#page_sign_deal #content_sign_deal .work li");

    /*主要信息，重点在面试信息*/
    main.eq(0).text(ajaxinfo.deal.name);
    main.eq(1).html("<img src='images/cate_icon_"+ajaxinfo.deal.cate_id+".png'/>"+"<h3>"+ajaxinfo.cate+"</h3><p>"+ajaxinfo.deal.province+"&nbsp;&nbsp;"+ajaxinfo.deal.city+"</p>");
    main.eq(2).append(ajaxinfo.deal.interview_time);
    main.eq(3).append(ajaxinfo.deal.interview_loc);
    main.eq(4).append(ajaxinfo.deal.interviewer);
    main.eq(5).append("<a href='tel:+86"+ajaxinfo.deal.interview_contact+"'>"+ajaxinfo.deal.interview_contact+"</a>");

    if(ajaxinfo.sign.is_effect == 0){
        main.eq(6).append("<font color='gray'>已失效</font>");
    }else{
        if(ajaxinfo.sign.sign_status == 0){
            main.eq(6).append("<font color='orange'>待同意</font>");
        }else if(ajaxinfo.sign.sign_status == 1){
            main.eq(6).append("<font color='green'>待面试</font>");
        }else if(ajaxinfo.sign.sign_status == 2){
            main.eq(6).append("<font color='green'>已录用</font>");
        }else{
            return;
        }
    }

    /*工作相关*/
    if(ajaxinfo.deal.limit_applicant <= 0){
        work.eq(1).append("不限");
    }else{
        work.eq(1).append(ajaxinfo.deal.limit_applicant);
    }
    if(ajaxinfo.deal.sex==1){
        work.eq(2).append("男");
    }else if(ajaxinfo.deal.sex==0){
        work.eq(2).append("女");
    }else{
        work.eq(2).append("无要求");
    }
    work.eq(3).append(ajaxinfo.deal.end_time);
    work.eq(4).append("<a href='tel:+86"+ajaxinfo.deal.contact+"'>"+ajaxinfo.deal.contact+"</a>");
    work.eq(5).append(ajaxinfo.deal.company);
    work.eq(6).append(ajaxinfo.deal.limit_price+"元&nbsp;/&nbsp;"+ajaxinfo.deal.pay_way);
    work.eq(7).append(ajaxinfo.deal.settlement);
    work.eq(8).append(ajaxinfo.deal.workdays);
    work.eq(9).append(ajaxinfo.deal.worktime);
    work.eq(10).append(ajaxinfo.deal.location);
    work.eq(11).html(ajaxinfo.deal.description);

    //刷新ui
    main.parent(".main").listview("refresh");
    work.parent(".work").listview("refresh");
}

//撤消一个报名
function sign_deal_bind_del_sign(){
    $("#page_sign_deal #header_sign_deal #del_sign").on("click",function(){

        var ajaxurl = APP_MODULE_maccount+"delete_sign";
        var query = new Object();
        query.id = CURRENT_SIGN;//获取当前的申请id

        confirmJQM("确认撤消该工作的申请?",function(){
            $.ajax({
                url:ajaxurl,
                type:"post",
                dataType:"json",
                data:query,
                success:function(ajaxobj){
                    if(ajaxobj.status == 0){
                        error_report(ajaxobj.info);
                        if(ajaxobj.url !== ""){
                            to_home();
                        }
                    }else{
                        to_prev_page();
                    }
                },error:function(ajaxobj){
                },
            });
        });
    });
}
