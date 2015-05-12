/*-----------------------------------script.js公共js文件--------------------------------------*/

/*-----------------------------------------------------------------------定义一些jS全局变量*/
var APP_DOMAIN = "http://192.168.1.122"; //请求域名
var APP_FILE = "/520sunjob";//app在服务上的所属文件夹-->主要用于类的加载访问

/*服务器端模板---------------------------------------------在app/lib/module下-------------*/
var APP_MODULE_mindex=APP_DOMAIN+APP_FILE+"/index.php?ctl=mindex&act="//后面加方法名
var APP_MODULE_muser=APP_DOMAIN+APP_FILE+"/index.php?ctl=muser&act="//后面加方法名
var APP_MODULE_mdeals=APP_DOMAIN+APP_FILE+"/index.php?ctl=mdeals&act="//后面加方法名
var APP_MODULE_mdeal=APP_DOMAIN+APP_FILE+"/index.php?ctl=mdeal&act="//后面加方法名
var APP_MODULE_msettings=APP_DOMAIN+APP_FILE+"/index.php?ctl=msettings&act="//后面加方法名
var APP_MODULE_mresume=APP_DOMAIN+APP_FILE+"/index.php?ctl=mresume&act="//后面加方法名
var APP_MODULE_mavatar=APP_DOMAIN+APP_FILE+"/index.php?ctl=mavatar&act="//后面加方法名
var APP_MODULE_maccount=APP_DOMAIN+APP_FILE+"/index.php?ctl=maccount&act="//后面加方法名
/*---------------------------------------------------------------------------模板结束-----*/

/*------------关于用localStorage存储的cache命名---------*/
var APP_FLEXLIDER = "flexslider";//首页的滑动分类的本地cache命名
var USER_INFO = "userinfo";//专门存储用户登陆后信息的本地cache命名
var USER_RESUME = "resume";//专门存储用户简历
/*------------用localStorage存储的cache命名结束---------*/

var CURRENT_DEAL = null;//存储用户点击的当前deal id
var CURRENT_SIGN = null;//存储用户点击的当前的sign_id
var CURRENT_WORKING = null;//存储用户当前的查看工作
var INDEX_CATE = null;//存储用户在首页选择的某一分类

//关于DEALS加载更多的全局变量

var DEALS_AMOUNT = 10; //每次加载数目
var DEALS_LAST= 0; //当前app页面的deals数目
var DEALS_COUNT = 0; //每次请求服务器获取数据库中deals的数目

/*JS全局变量定义结束-----------------------------------------------------------------------*/

/*jquery.mobile基本事件处理(mobileinit必须绑定在jquery.mobile.js之前，jquery.js之后)*/
$(document).on("mobileinit",function(){
    //支持域名ajax加载
    $.support.cors=true;
    $.mobile.allowCrossDomainPages=true;
    $.mobile.pushState=false;

    //jqm基本设置
    $.mobile.pageLoadErrorMessage='你访问的地方找不到了！';
    $.mobile.loadingMessage="嘿咻嘿咻...";
    //$.mobile.defaultPageTransition="slide";
});
/*jquery.mobile处理结束---在jquery.js之后*/

/*--------------------------------定义公用的函数库-----------------------------------------------------*/

//向服务器判断登陆状况并且保存刷新用户信息的公共函数
function check_login(){
    $.ajax({
        url:APP_MODULE_mindex+"get_login_info",
        type:"post",
        dataType:"json",
        success:function(ajaxobj){
            //如果服务器端有登陆状态就保存到本地
            if(ajaxobj.is_login==1){
                save_to_local(USER_INFO,ajaxobj);//请求成功后刷新并保存传回的数据
            }
            //否则清空本地缓存
            else{
                remove_local(USER_INFO,0);
            }
        },
        error:function(ajaxobj){
            //请求失败上报网络链接错误
            error_report("网络连接错误!");
        }
    });
}
//跳转到主页并且暴力刷新
function location_to_index(){
    location.href="appload.html";
}
//跳转到主页普通刷新(须填写跳转方式)
function to_index(tran){
    $.mobile.changePage("index.html",{
        transition:tran,
    reverse:true,
    }); 
}
//跳转到上一页面
function to_prev_page(){
    history.go(-1);
}
//跳转到个人中心主页的方法
function to_home(tran){
    $.mobile.changePage("home.html",{
        transition:tran,
    reverse:true,
    }); 
}
//保存localStorage的方法
/*************************************************************
 *data=>传入本地数据的命名(字符串)
 *json=>传入服务器获得json(json对象) 
 *************************************************************/
//save_to_local传入json，最终也返回这个json
function save_to_local(dataname,json){
    /*注意用户头像必须加APP_DOMAIN获得完整的域名*/
    if(json.img){
        json.img.small=APP_DOMAIN+json.img.small;
        json.img.middle=APP_DOMAIN+json.img.middle;
        json.img.big=APP_DOMAIN+json.img.big;
    }
    var json_string=JSON.stringify(json);
    localStorage.setItem(dataname,json_string);
    return json;
}
//read_from_local传入要获取的数据命名，返回一个json
function read_from_local(dataname){
    var string_json=localStorage.getItem(dataname);
    if(string_json != null){
        json=JSON.parse(string_json);
        return json;
    }
    return false;
}
//清除本地数据，clear设置是否完全清除，是个bool值，1为清除全部数据
function remove_local(dataname,clear){
    localStorage.removeItem(dataname);
    if(clear==1){
        localStorage.clear();
    }
}

/**
 * jQueryMobile 弹出提示框
 * @param text：提示内容
 * @param callback:点击确定要执行的函数
 */
function confirmJQM(text, callback) {
    var popupDialogId = 'popupDialogC';
    $('<div data-role="popup" id="' + popupDialogId + '" data-confirmed="no" data-position-to="window" data-transition="pop" data-theme="b" data-dismissible="false" style="max-width:500px;">'+  
            '<div role="main" class="ui-content" style="text-align: center;text-shadow:none;">'+  
            '<h3 class="ui-title">' + text + '</h3>'+  
            '<p></p>'+
            '<a data-role="button" data-theme="a" class="optionCancel" data-mini="true" data-inline="true" onclick="$(\'#popupDialogC\').popup(\'close\');" >取消</a>'+ 
            '<a data-role="button" data-theme="a" class="optionConfirm" data-transition="flow" data-inline="true" data-mini="true">确定</a>'+  
            '</div>'+  
            '</div>').appendTo($.mobile.pageContainer);  
    var popupDialogObj = $('#' + popupDialogId);  
    popupDialogObj.trigger('create');  //动态加载时 需要重新刷新下 也就是给popup赋上jqm对应的css

    //初始化popup
    popupDialogObj.popup({
        //关闭时 绑定的事件
        afterclose: function (event, ui) {  
            ifconfirm = popupDialogObj.attr('data-confirmed'); 
            $("#popupDialogC .optionConfirm").unbind('click'); //关闭时 需要清除确定按钮上 绑定的事件
            //获取用户单击选项
            popupDialogObj.remove();//删除 创建的 popup
            //调用回调函数
            if( ifconfirm=="yes" && callback && callback instanceof Function ){
                callback();
            }
        },

        //显示时 绑定的事件
        afteropen: function (event, ui) {
            $("#popupDialogC .optionConfirm").on('click', function () {  
                //设置用户选择了yes
                popupDialogObj.attr('data-confirmed', 'yes'); 
                $('#popupDialogC').popup('close');
            });
            popupDialogObj.attr('data-confirmed', 'no'); 
        }  
    });  
    //打开
    popupDialogObj.popup('open');  
}

//添加并且陈列兼职的函数
//注意:所有要列出各种兼职的地方都可以使用这个函数
//传入两个参数:ul-dom对象,json数据
function list_append_deals(dom,deal){
    var deal_li_img="<img src='images/cate_icon_"+deal.cate_id+".png'/>";//要求兼职分类图片为png格式
    var deal_li_title="<h3 class='ellipsis'>"+deal.name+"</h3>";
    var deal_li_deal_city="<span class='deal_city'>位置："+deal.city+"</span>";
    var deal_li_deal_sign_count="<span class='deal_sign_count'>名额："+deal.sign_count+"&nbsp;/&nbsp;"+deal.limit_applicant+"</span>";
    var deal_li_deal_price="<span class='deal_price'>工资："+deal.limit_price+"元&nbsp;/&nbsp;"+deal.pay_way+"</span>";
    var deal_li_deal_create_time="<span class='deal_create_time'>"+deal.create_time+"</span>";
    var deal_li_info="<div class='deal_skim'>"+deal_li_deal_city+deal_li_deal_sign_count+deal_li_deal_price+deal_li_deal_create_time+"</div>"
        var deal_li="<li data-theme='c'><a href='deal.html' data-transition='slide' onclick='show_deal("+deal.id+")'>"+deal_li_img+deal_li_title+deal_li_info+"</a></li>";
    dom.append(deal_li).listview("refresh");
}
//点击进入deal.html的详情查看页面
function show_deal(deal){
    CURRENT_DEAL = deal;//修改全局变量
}
//更新本地的简历
function update_local_resume(resume){
    remove_local(USER_RESUME,0);
    save_to_local(USER_RESUME,resume);
}

//所有页面的错误报告
function error_report(error_msg){
    $("<div class='pop_error pop_box' data-role='popup' data-dismissible='false' data-transition='fade'>"+error_msg+"</div>").appendTo($.mobile.pageContainer);
    error_obj = $(".pop_error");
    error_obj.trigger("create");
    error_obj.popup({
        afterclose: function (event, ui) {  
            error_obj.remove();//删除 创建的 popup
        },
    });
    error_obj.popup("open");
    setTimeout(function(){
        error_obj.popup("close");
    },800);
}
//成功后的提示
function success_report(success_msg){
    $("<div class='pop_success pop_box' data-role='popup' data-transition='fade' data-dismissible='false'>"+success_msg+"</div>").appendTo($.mobile.pageContainer);
    success_obj = $(".pop_success");
    success_obj.trigger("create");
    success_obj.popup({
        afterclose: function (event, ui) {  
            success_obj.remove();//删除 创建的 popup
        },
    });
    success_obj.popup("open");
    setTimeout(function(){
        success_obj.popup("close");
    },800);
}
//普通提示
function tip(tip){
    $("<div class='tip pop_box' data-role='popup' data-dismissible='false' data-transition='fade'>"+tip+"</div>").appendTo($.mobile.pageContainer);
    tip_obj = $(".tip");
    tip_obj.trigger("create");
    tip_obj.popup({
        afterclose: function (event, ui) {  
            tip_obj.remove();//删除 创建的 popup
        },
    });
    tip_obj.popup("open");
    setTimeout(function(){
        tip_obj.popup("close");
    },800);
}
//读取中的ui
function loading_start(loading_msg){
    $('<div data-role="popup" data-dismissible="false" data-transition="pop"  class="pop_loading" data-shadow="false"><img src="images/pop_loading.gif" alt="loading..."/><h3>'+loading_msg+'</h3></div>').appendTo($.mobile.pageContainer);
    loading = $(".pop_loading");
    loading.trigger("create");
    loading.popup({
        afterclose: function (event, ui) {  
            loading.remove();//删除 创建的 popup
        },
    });
    //打开pop
    loading.popup("open");
}
function loading_end(){
    $(".pop_loading").popup("close");
}
