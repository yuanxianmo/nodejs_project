/**
 * Created by 袁贤谟 on 2017/12/15.
 * 应用程序的启动（入口）文件
 */

//加载express模块
var express = require('express');
//加载模板处理模块
var swig = require('swig');
//加载数据库模块
var mongoose=require('mongoose');
//加载body-parser,用来处理post提交过来的数据
var bodyParser=require('body-parser');
//加载cookies模块
var Cookies=require('cookies')
//创建app应用 => NodeJS Http.createServer();
var app = express();
var User=require('./models/User')
//设置静态文件托管
app.use('/pulic',express.static(__dirname+'/pulic'))

//配置模板
//定义当前应用所使用的模板引擎
//第一个参数，模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine('html', swig.renderFile);
//设置模板文件存放的目录 第一个参数必须是views，第二个参数是目录
app.set('views', './views');
//注册所使用的模板引擎，第一个参数必须是view engine,第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）必须一致
app.set('view engine', 'html');
//取消模板缓存
swig.setDefaults({cache:false})

//设置body-parser
app.use(bodyParser.urlencoded({extended:true}))

//设置cookies
app.use(function (req,res,next) {
    req.cookies = new Cookies(req,res)

    //解析登录用户的cookies信息
    req.userInfo={}
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo=JSON.parse(req.cookies.get('userInfo'))
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin)
                next()
            })
        }catch(e){
            next()
        }
    }else{
        //console.log(req.cookies.get('userInfo'))

        next();
    }

});

/*
* 根据不同的功能划分模块
* */
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

//监听http请求
mongoose.connect('mongodb://localhost:27018/blog',{useMongoClient: true},function (err) {
    if(err){
       console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        app.listen(8090);
    }

});








