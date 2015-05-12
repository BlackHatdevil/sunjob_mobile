$(document).on("pageinit","#page_working",function(){
    working_init_page();
});
//初始化现任工作页面
function working_init_page(){
    var user_info = read_from_local(USER_INFO);
    if(!user_info)
        to_home("slide");
    else{
        ajaxurl=APP_MODULE_maccount+"working";
        $.ajax({
            url:ajaxurl,
            type:"post",
            dataType:"json",
            success:function(ajaxobj){
                if(ajaxobj.status==1){
                    $.each(ajaxobj.works,function(index,value){
                        //.each()函数的第二个callback函数中被apply()传入了两个参数，第一个是数组下标,第二个是当前小标指向的值
                        working_list_works(value);
                    });
                }
            },
            error:function(ajaxobj){
                error_report("网络连接错误!");
            }
        });
    }

}

//列出当前的工作
function working_list_works(value){
    var li_st="<li><a href='working_detail.html' onClick='working_to_detail("+value.id+")' data-transition='slide'>";
    var li_con;
    var li_end="</a></li>";
    var li;
    if(value.sign_status==2)
        var li_status="<div class='lidiv libdiv2 orange'>准备中</div>";
    if(value.sign_status==3)
        var li_status="<div class='lidiv lidiv2 green'>进行中</div>";
    if(value.sign_status==4)
        var li_status="<div class='lidiv lidiv2 gray'>已结束</div>";

    li_con="<div class='lidiv lidiv1'>"+value.deal_name+"</div> "+li_status+" <div class='lidiv lidiv3'>"+value.employ_time+"</div>";

    li=li_st+li_con+li_end;
    $("#page_working #content_working #list_user_works").append(li).listview("refresh");
}
function working_to_detail(wid){
    CURRENT_WORKING = wid;
}
