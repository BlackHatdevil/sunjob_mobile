/*第一部分对应deals.html,显示全部兼职并分类-----------------------------------------------*/
$(document).on("pageinit","#page_deals",function(){
    deals_init_deals();//初始化deals
    deals_bind_province_change();//省份变化
    deals_bind_city_change();//城市变化
    deals_bind_cate_change();//类型变化
    deals_bind_search_change();//搜索框变化
    loaded();
});

$(document).on("pagebeforeshow","#page_deals",function(){
    deals_cate_deal();
});

//初始化deals页面，创造deals.html时候执行
function deals_init_deals(){
    var query = new Object();
    //两个全局分页参数
    query.last = DEALS_LAST;
    query.amount = DEALS_AMOUNT;
    $.ajax({
        url:APP_MODULE_mdeals+"show_deals",
        type:"post",
        data:query,
        dataType:"json",
        success:function(ajaxobj){
            $("#page_deals #content_deals #list_deals").empty();
            DEALS_COUNT = ajaxobj.count;//更新当前数据库deals条数
            //option所有的分类
            $.each(ajaxobj.cate,function(index,value){
                deals_cate_to_option(ajaxobj.cate[index]);
            });
            //option所有的省份
            $.each(ajaxobj.province,function(index,value){
                deals_province_to_option(ajaxobj.province[index]);
            });
            var dom = $("#page_deals #content_deals #list_deals");
            $.each(ajaxobj.deals,function(index,value){
                DEALS_LAST++;
                //下面的方法在script.js函数库中
                list_append_deals(dom,ajaxobj.deals[index]);
            });
        },
        error:function(ajaxobj){
            //请求失败上报网络链接错误
            $("#page_deals #list_deals").html("<div class='error_connect'>糟糕:网络异常</div>");
        }
    });
}

//初始化页面时候列出所有的省份
function deals_province_to_option(province){
    var option="<option value='"+province.id+"'>"+province.name+"</option>";
    $("#page_deals #header_deals #header_deals_filter #province").append(option);
}
//初始化页面时候列出所有的分类
function deals_cate_to_option(cate){
    var option="<option value='"+cate.id+"'>"+cate.name+"</option>";
    $("#page_deals #header_deals #header_deals_filter #cate_id").append(option);
}
//写入对应的城市
function deals_city_to_option(city){
    var option="<option value='"+city.id+"'>"+city.name+"</option>";
    $("#page_deals #header_deals #header_deals_filter #city").append(option);
}
//触发省份变化事件
function deals_bind_province_change(){
    $("#page_deals #header_deals #header_deals_filter #province").on("change",function(){
        //解绑city
        $("#page_deals #header_deals #header_deals_filter #city").unbind("change");

        //重置城市(必须先重置城市，否则原来的那些城市会被一起用来筛选导致错误)
        $("#page_deals #header_deals #header_deals_filter #city").empty();
        $("#page_deals #header_deals #header_deals_filter #city").append("<option selected='true' value='0'>城市</option>").selectmenu("refresh");

        //筛选更新deals数据
        $("#page_deals #content_deals #list_deals").empty().hide();
        DEALS_LAST = 0;
        deals_filter_update(2);
        //省份过滤结束后重新绑定city
        deals_bind_city_change();
    });
}
//触发城市变化事件
function deals_bind_city_change(){
    $("#page_deals #header_deals #header_deals_filter #city").bind("change",function(){
        //由于城市随省份变化较多，为确保select成功，change就刷新
        $(this).selectmenu("refresh");
        $("#page_deals #content_deals #list_deals").empty().hide();
        DEALS_LAST = 0;
        deals_filter_update(3);
    });
}
//触发类型变化事件
function deals_bind_cate_change(){
    $("#page_deals #header_deals #header_deals_filter #cate_id").bind("change",function(){
        $("#page_deals #content_deals #list_deals").empty().hide();
        DEALS_LAST = 0;
        deals_filter_update();
    });
}
//触发搜索变化事件
function deals_bind_search_change(){
    $("#page_deals #header_deals #header_deals_search #search").bind("input oninput",function(){
        $("#page_deals #content_deals #list_deals").empty().hide();
        DEALS_LAST = 0;
        deals_filter_update();
    });
}
//筛选刷新deals
//region_lv
//1=>国家变化
//2=>省份变化
//3=>城市变化
function deals_filter_update(region_lv){
    query=new Object();
    query.province_id=$("#page_deals #header_deals #header_deals_filter #province").val();
    query.city_id=$("#page_deals #header_deals #header_deals_filter #city").val();
    query.cate_id=$("#page_deals #header_deals #header_deals_filter #cate_id").val();
    query.search=$("#page_deals #header_deals #header_deals_search #search").val();
    //分页三大参数
    query.last = DEALS_LAST;
    query.amount = DEALS_AMOUNT;
    query.count = DEALS_COUNT;

    ajaxurl=APP_MODULE_mdeals+"filter_deals";
    $.ajax({ 
        url: ajaxurl,
        dataType: "json",
        data:query,
        type: "POST",
        success: function(ajaxobj){
            DEALS_COUNT = ajaxobj.count;//更新当前数据库deals总数

            //状态为1表示有deals信息下载下来
            if(ajaxobj.status=="1"){
                var dom = $("#page_deals #content_deals #list_deals");
                $.each(ajaxobj.deals,function(index,value){
                    DEALS_LAST++;
                    //下面的list_append_deals方法是源于script,js函数库中
                    list_append_deals(dom,ajaxobj.deals[index]);
                });
                $("#page_deals #content_deals #list_deals").fadeIn(600);
            }else{
                //状态为0或者其他则显示找不到
                //deals_filter_none();
            }
            /*------第一步结束-----------*/

            /*第二步：如果修改的是省份:region_lv=2变动，则写入新城市*/
            if(region_lv==2){
                $.each(ajaxobj.city,function(index,value){
                    //不允许id为0，一旦有为0的城市要被return
                    if(ajaxobj.city[index].id==0){
                        return;
                    }
                    deals_city_to_option(ajaxobj.city[index]);
                });
                $("#page_deals #header_deals #header_deals_filter #city").selectmenu("refresh");
            }
            /*------第二步结束---------------------------------*/
        },
        error:function(ajaxobj){
            $(".more_deals").fadeIn(600);
            loading_end();
            error_report("网络连接错误");
        }
    });
}

//从主页跳转选择分类进入deals页面的操作
function deals_cate_deal(){
    //获取判断用户在主页选择的分类
    var cate = INDEX_CATE;
    if(cate!=null){
        $("#page_deals #header_deals #header_deals_filter #cate_id").val(cate).selectmenu("refresh");
        $("#page_deals #content_deals #list_deals").empty().hide();
        DEALS_LAST = 0;
        deals_filter_update();
        INDEX_CATE = null;
    }else{
        return;
    }
}

/*deals部分结束--------------------------------------------------------------------------------------*/





/*----------------第二部分,接下来定义的是deals_latest.html的脚本，因为我认为deals最新和deals可以在一类中*/
$(document).on("pageinit","#page_deals_latest",function(){
    //初始化最新兼职
    deals_latest_bind_province_change();
    deals_latest_bind_city_change();
});
$(document).on("pageshow","#page_deals_latest",function(){
    deals_latest_init_deals();
});

/*最新兼职的函数库----------------------------------*/
//初始化最新兼职页面
function deals_latest_init_deals(){
    $("#page_deals_latest #content_deals_latest #list_deals").empty().hide();
    loading_start("正在读取最新的兼职");
    $.ajax({
        url:APP_MODULE_mdeals+"show_latest_deals",
        type:"post",
        dataType:"json",
        success:function(ajaxobj){
            loading_end();
            //显示最初的最新的兼职信息
            var dom = $("#page_deals_latest #content_deals_latest #list_deals");
            $.each(ajaxobj.deals,function(index,value){
                list_append_deals(dom,ajaxobj.deals[index]);
            })
            //option所有的省份
            $.each(ajaxobj.province,function(index,value){
                deals_latest_province_to_option(ajaxobj.province[index]);
            })
            $("#page_deals_latest #content_deals_latest #list_deals").fadeIn(600);
        },
        error:function(ajaxobj){
            loading_end();
            //请求失败上报网络链接错误
            $("#page_deals_latest #list_deals").html("<div class='error_connect'>糟糕:网络异常</div>");
        }
    });

}
//绑定省份变化
function deals_latest_bind_province_change(){
    $("#page_deals_latest #footer_deals_latest #footer_filter #province").on("change",function(){
        //绑定省份的前解绑city
        $("#page_deals_latest #footer_deals_latest #footer_filter #city").unbind("change");
        //重置城市(必须先重置城市，否则原来的那些城市会被一起用来筛选导致错误)
        $("#page_deals_latest #footer_deals_latest #footer_filter #city").empty();
        $("#page_deals_latest #footer_deals_latest #footer_filter #city").append("<option selected='true' value='0'>城市</option>").selectmenu("refresh");
        //筛选更新deals数据
        deals_latest_filter_update(2);
        //省份过滤结束后重新绑定city
        deals_latest_bind_city_change();
    });
}
//绑定城市改变
function deals_latest_bind_city_change(){
    $("#page_deals_latest #footer_deals_latest #footer_filter #city").bind("change",function(){
        //由于城市随省份变化较多，为确保select成功，change就刷新
        $(this).selectmenu("refresh");
        deals_latest_filter_update(3);
    });

}
//最新兼职city变动
function deals_latest_city_to_option(city){
    var option="<option value='"+city.id+"'>"+city.name+"</option>";
    $("#page_deals_latest #footer_deals_latest #footer_filter #city").append(option);
}
//初始化所有省份
function deals_latest_province_to_option(province){
    var option="<option value='"+province.id+"'>"+province.name+"</option>";
    $("#page_deals_latest #footer_deals_latest #footer_filter #province").append(option);
}
function deals_latest_filter_update(region_lv){
    /*第一步是修改筛选后的deals*/
    $("#page_deals_latest #content_deals_latest #list_deals").hide().empty();
    loading_start("读取最新兼职中");

    query=new Object();
    query.province_id=$("#page_deals_latest #footer_deals_latest #footer_filter #province").val();
    query.city_id=$("#page_deals_latest #footer_deals_latest #footer_filter #city").val();
    $.ajax({
        url:APP_MODULE_mdeals+"filter_deals_latest",
        type:"post",
        dataType:"json",
        data:query,
        success:function(ajaxobj){
            loading_end();
            //显示最初的最新的兼职信息
            if(ajaxobj.status=="1"){
                var dom = $("#page_deals_latest #content_deals_latest #list_deals");
                $.each(ajaxobj.deals,function(index,value){
                    list_append_deals(dom,ajaxobj.deals[index]);
                });
                $("#page_deals_latest #content_deals_latest #list_deals").fadeIn(600);
            }else{
                //状态为0或者其他则显示找不到
                //deals_filter_none();
            }

            /*第二步：如果修改的是省份:region_lv=2变动，则写入新城市*/
            if(region_lv==2){
                $.each(ajaxobj.city,function(index,value){
                    //不允许id为0，一旦有为0的城市要被return
                    if(ajaxobj.city[index].id==0){
                        return;
                    }
                    deals_latest_city_to_option(ajaxobj.city[index]);
                });
                $("#page_deals_latest #footer_deals_latest #footer_filter #city").selectmenu("refresh");
            }
            /*------第二步结束---------------------------------*/
        },
        error:function(ajaxobj){
            loading_end();
            //请求失败上报网络链接错误
            error_report("网络连接错误!");
        }
    });
}
/*---------------------------------------------------------------------------------------------------*/




/*----------------------------------------下拉刷新和上拉加载----------------------------------*/
var myScroll,
	pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset;

/**
 * 下拉刷新 （自定义实现此方法）
 */
function pullDownAction () {
    setTimeout(function () {
        //deals_list置空
        $("#page_deals #content_deals #list_deals").empty().hide();
        //重置当前deals数目
        DEALS_LAST = 0;
        deals_filter_update();
        myScroll.refresh();
    }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

/**
 * 滚动翻页 （自定义实现此方法）
 * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
 */
function pullUpAction () {
    setTimeout(function () {
        deals_filter_update();
        myScroll.refresh();
    }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
}

function loaded() {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = document.getElementById('pullUp');	
    pullUpOffset = pullUpEl.offsetHeight;

    myScroll = new iScroll('content_deals', {
        scrollbarClass: 'myScrollbar', /* 重要样式 */
             useTransition: false, /* 此属性不知用意，本人从true改为false */
             topOffset: 90,
             onRefresh: function () {
                 if (pullDownEl.className.match('loading')) {
                     pullDownEl.className = '';
                     pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                 } else if (pullUpEl.className.match('loading')) {
                     pullUpEl.className = '';
                     pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                 }
             },
             onScrollMove: function () {
                 if (this.y > 5 && !pullDownEl.className.match('flip')) {
                     pullDownEl.className = 'flip';
                     pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                     this.minScrollY = 0;
                 } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                     pullDownEl.className = '';
                     pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                     this.minScrollY = -pullDownOffset;
                 } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                     pullUpEl.className = 'flip';
                     pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
                     this.maxScrollY = this.maxScrollY;
                 } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                     pullUpEl.className = '';
                     pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                     this.maxScrollY = pullUpOffset;
                 }
             },
             onScrollEnd: function () {
                 if (pullDownEl.className.match('flip')) {
                     pullDownEl.className = 'loading';
                     pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';				
                     pullDownAction();	// Execute custom function (ajax call?)
                 } else if (pullUpEl.className.match('flip')) {
                     pullUpEl.className = 'loading';
                     pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';				
                     pullUpAction();	// Execute custom function (ajax call?)
                 }
             }
    });
}
