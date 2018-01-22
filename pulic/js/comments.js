/**
 * Created by 袁贤谟 on 2017/12/28.
 */

var prepage = 10;
var page = 1;
var pages = 0;
var comments = [];

var $messageBtn=$('#messageBtn');

$messageBtn.on('click',function () {
    $.ajax({
        type:'post',
        url:'/api/comment/post',
        data:{
            contentid:$("#contentId").val(),
            content:$("#messageContent").val()
        },
        dataType:'json',
        success:function (responseData) {
            console.log(responseData);
            $("#messageContent").val('')
            renderComment(responseData.data.comments)
        }
    })
})


//初始化
/*var val=''
$.ajax({
    type:'post',
    url:'/api/comment/post',
    data:{
        contentid:$("#contentId").val(),
    },
    dataType:'json',
    success:function (responseData) {
        renderComment(responseData.data.comments)
        val=responseData.data.comments
    }
})*/
$('.pager').delegate('a', 'click', function() {
    console.log(1111)
    if ($(this).parent().hasClass('previous')) {
        page--;
    } else {
        page++;
    }
    renderComment(val);
});
function  renderComment(comments) {
    $('#messageCount').html(comments.length);
    pages = Math.max(Math.ceil(comments.length / prepage), 1);
    var start = Math.max(0, (page-1) * prepage);
    var end = Math.min(start + prepage, comments.length);

    var $lis = $('.pager li');
    $lis.eq(1).html( page + ' / ' +  pages);

    if (page <= 1) {
        page = 1;
        $lis.eq(0).html('<span>没有上一页了</span>');
    } else {
        $lis.eq(0).html('<a href="javascript:;">上一页</a>');
    }
    if (page >= pages) {
        page = pages;
        $lis.eq(2).html('<span>没有下一页了</span>');
    } else {
        $lis.eq(2).html('<a href="javascript:;">下一页</a>');
    }

    if (comments.length == 0) {
        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');
    } else {
        var html = '';
        for (var i=start; i<end; i++) {
            html += '<div class="messageBox">'+
                '<p class="name clear"><span class="fl">'+comments[i].username+'</span><span class="fr">'+ formatDate(comments[i].postTime) +'</span></p><p>'+comments[i].content+'</p>'+
                '</div>';
        }
        $('.messageList').html(html);
    }
}

function formatDate(d) {
    var data1=new Date(d);
    return data1.getFullYear()+'年'+(data1.getMonth()+1)+'月'+data1.getDate()+'日'+data1.getHours()+'时'+data1.getMinutes()+'分'+data1.getSeconds()+'秒'
}

/*
*
* 分页*/

