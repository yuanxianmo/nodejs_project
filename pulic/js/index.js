/**
 * Created by 袁贤谟 on 2017/12/18.
 */
$(function () {
    var $loginBox=$("#loginBox")
    var $registerBox=$("#registerBox")
    var $userInfo=$("#userInfo")
    var $logoutBtn=$("#logoutBtn")

    //切换到注册面板上
    $loginBox.find('a.colMint').on('click',function () {
        $registerBox.show();
        $loginBox.hide()
    })

    //切换登录面板上
    $registerBox.find('a.colMint').on('click',function () {
        $loginBox.show();
        $registerBox.hide()
    })

    //注册
    $registerBox.find('button').on('click',function () {
        //提交请求
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$registerBox.find('[name=username]').val(),
                password:$registerBox.find('[name=password]').val(),
                repassword:$registerBox.find('[name=repassword]').val()
            },
            dataType:'json',
            success:function (result) {
               // console.log(result)
                $registerBox.find('.colWarning').html(result.message)
                if(!result.code){
                    //注册成功
                    setTimeout(function () {
                        $loginBox.show();
                        $registerBox.hide()
                    },1000)
                }
            }
        })
    })

    //登录
    $loginBox.find('button').on('click',function () {
        //提交请求
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$loginBox.find('[name=username]').val(),
                password:$loginBox.find('[name=password]').val(),
            },
            dataType:'json',
            success:function (result) {
                 //console.log(result)
                $loginBox.find('.colWarning').html(result.message)
                if(!result.code){
                    //登录成功
                    window.location.reload()
                }

            }
        })
    })

    /*
    * 回车键登录
    * */
    $(window).keydown(function (event) {
        if(event.keyCode==13){
            $.ajax({
                type:'post',
                url:'/api/user/login',
                data:{
                    username:$loginBox.find('[name=username]').val(),
                    password:$loginBox.find('[name=password]').val(),
                },
                dataType:'json',
                success:function (result) {
                    //console.log(result)
                    $loginBox.find('.colWarning').html(result.message)
                    if(!result.code){
                        //登录成功
                        window.location.reload()
                    }

                }
            })
        }

    })
    
    
    //退出
    $logoutBtn.on('click',function(){
        $.ajax({
            url:'/api/user/logout',
            success:function (result) {
                if(!result.code){
                    window.location.reload()
                }
            }
        })
    })

})