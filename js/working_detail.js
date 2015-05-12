$(document).on("pageinit","#page_working_detail",function(){
    working_detail_init_page();
});
function working_detail_init_page(){
    if(!CURRENT_WORKING){
        to_prev_page();
        return;
    }
    var query = new Object();
    query.id=CURRENT_WORKING;
    var ajaxurl = APP_MODULE_maccount+"show_working_detail";
    loading_start("读取工作详情");
    $.ajax({
        url:ajaxurl,
        type:"post",
        data:query,
        dataType:"json",
        success:function(ajaxobj){
           loading_end();
           if(ajaxobj.status==1){
               working_detail_list_working(ajaxobj.detail);
           }else if(ajaxobj.status==0){
               tip(ajaxobj.info);
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

function working_detail_list_working(detail){
    var working_detail=$("#page_working_detail #content_working_detail #list_working li");
    working_detail.eq(0).text(detail.name);
    if(detail.sign_status==2)
        detail.sign_status="<font color='#f90'>已录用，准备开工</font>";
    working_detail.eq(1).append(detail.sign_status);
    working_detail.eq(2).append(detail.limit_price+"元&nbsp;/&nbsp;"+detail.pay_way);
    working_detail.eq(3).append(detail.settlement);
    working_detail.eq(4).append(detail.workdays);
    working_detail.eq(5).append(detail.worktime);
    working_detail.eq(6).append(detail.location);
    working_detail.eq(7).append("<a href='tel:+86"+detail.contact+"'>"+detail.contact+"</a>");
    working_detail.eq(8).append(detail.description);
    working_detail.parent("#list_working").listview("refresh");
    return;
}
