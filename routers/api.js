/**
 * Created by 袁贤谟 on 2017/12/18.
 */
var express=require('express')
var router=express.Router();

//数据库引用
var User=require('../models/User')

var Content=require('../models/Content')

//统一返回格式
var responseData
router.use(function (req,res,next) {
    responseData={
        code:0,
        message:''
    }
    next()
})
/*
 * 用户注册
 *
 * */

router.post('/user/register',function (req,res,next) {
    //console.log(req.body)
    var username=req.body.username;
    var password=req.body.password;
    var repassword=req.body.repassword;

    //用户名是否为空
    if(username==''){
        responseData.code=1;
        responseData.message='用户名不能为空'
        res.json(responseData)
        return
    }

    //密码是否为空
    if(password==""){
        responseData.code=2;
        responseData.message='密码不能为空'
        res.json(responseData)
        return
    }

    //两次输入的密码不相同
    if(password!=repassword){
        responseData.code=3;
        responseData.message='两次输入的密码不一致'
        res.json(responseData)
        return
    }

    //用户名是否被注册
    User.findOne({
        username:username
    }).then(function (userInfo) {
        if(userInfo){
            responseData.code=4
            responseData.message='用户名被注册'
            res.json(responseData)
            return
        }
        //保存用户注册的信息到数据库中来
        var user=new User({
            username:username,
            password:password
        });
        return user.save()
    }).then(function (newUserInfo) {
        console.log(newUserInfo)
        responseData.message='注册成功'
        res.json(responseData)
    })
})

/*
*用户登录
* */
router.post('/user/login',function (req,res,next) {
    //console.log(req.body)
    var username=req.body.username;
    var password=req.body.password;
    if(username==''||password==""){
        responseData.code=1
        responseData.message='同户名或密码不能为空'
        res.json(responseData)
        return;
    }

    //查询数据库中用户名和密码是否存在
    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.code=2
            responseData.message='同户名或密码错误'
            res.json(responseData)
            return;
        }
        //用户名密码正确
        responseData.message='登录成功'
        responseData.userInfo={
            _id:userInfo._id,
            username:userInfo.username
        }
        //发送cookies
        req.cookies.set('userInfo',JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username
        }))

        res.json(responseData)
        return;
    })
})

/*
* 退出*/
router.get('/user/logout',function (req,res,next) {
    req.cookies.set('userInfo',null)
    res.json(responseData)
})


/*
* 获取评论
* */

router.get('/comment',function (req,res,next) {
    var ContentId=req.body.contentid||''
    Content.findOne({
        _id:ContentId
    }).then(function (content) {
        responseData.data=content.contents
        res.json(responseData)
    })
})


/*
* 留言评论
* */

router.post('/comment/post',function (req,res,next) {
    var ContentId=req.body.contentid||''
    var postData={
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    }

    Content.findOne({
        _id:ContentId
    }).then(function (content) {
        content.comments.push(postData)
        return content.save()
    }).then(function (newContent) {
        console.log(newContent)
        responseData.message='评论成功'
        responseData.data=newContent
        res.json(responseData)
    })

})




module.exports=router;