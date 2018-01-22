/**
 * Created by 袁贤谟 on 2017/12/18.
 */
var  express=require('express');
var router=express.Router();

var User=require('../models/User')
var Category=require('../models/Category')
var Content=require('../models/Content')
router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
        res.send('对不起您不是管理员');
        return
    }
    next()
})


/*
* 首页*/
router.get('/',function (req,res,next) {
    res.render('admin/index',{
        userInfo:req.userInfo
    })
})

/*用户管理
* */
router.get('/user',function (req,res,next) {
    /*
    * 从数据库读取所用用户数据
    *
    * limit(Nubmer)限制获取的数据条数
    *
    * skip()忽略数据的条数
    * */
    var page=Number(req.query.page||1);
    //显示几条
    var limit=10

    var pages=0;
    User.count().then(function (count) {
        //console.log(count)
        //总页数
        pages=Math.ceil(count/limit);
        //数值不能超过总页数
        page=Math.min(page,pages)
        //数值不能小于1
        page=Math.max(page,1)
        var skip=(page-1)*limit
        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                count:count,
                pages:pages,
                limit:limit,
                page:page
            })
        })
    })



})

/*
* 分类首页
* */
router.get('/category',function (req,res,next) {
    var page=Number(req.query.page||1);
    //显示几条
    var limit=10

    var pages=0;
    Category.count().then(function (count) {
        //console.log(count)
        //总页数
        pages=Math.ceil(count/limit);
        //数值不能超过总页数
        page=Math.min(page,pages)
        //数值不能小于1
        page=Math.max(page,1)
        var skip=(page-1)*limit
        /*
        * 1为升序
        * -1为降序
        * */
        Category.find().sort({_id:-1}).limit(10).skip(skip).then(function (categoryies) {
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                categoryies:categoryies,
                count:count,
                pages:pages,
                limit:limit,
                page:page
            })
        })
    })

    /*res.render('admin/category_index',{
        userInfo:req.userInfo
    })*/
})


/*
* 添加分类
* */
router.get('/category/add',function (req,res,next) {
    res.render('admin/category_add',{
        userInfo:req.userInfo
    })
})


/*
* 分类的保存
* 
* */
router.post('/category/add',function (req,res) {
    //console.log(req.body)
    var name=req.body.name||'';
    if(name==""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空',
        })
        return
    }

    //数据库查询是否有相同的名称
    Category.findOne({
        name:name
    }).then(function (rs) {
        if(rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类存在',
            })
            return Promise.reject()
        }else{
            return new Category({
                name:name
            }).save()
        }
    }).then(function (nameCategory) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'分类保存成功',
            url:'/admin/category'
        })
    })
})

/*
* 分类修改
* */
router.get('/category/edit',function (req,res,next) {

    //获取要删除的分类信息
    //console.log(req.query.id)
    var id=req.query.id||'';
    Category.findOne({
        _id:id
    }).then(function (category) {
        console.log(category)
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            })
        }else{
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            })
        }
    })

})
/*
* 分类并保存
* */

router.post('/category/edit',function (req,res,next) {
    var id=req.query.id||'';
    var name=req.body.name||'';

    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类存在',
            })
            return Promise.reject()
        }else{
            if(name==category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'修改成功',
                    url:'/admin/category'
                })
                return Promise.reject()
            }else{
                return Category.findOne({
                    _id:{$ne:id},
                    name:name
                })
            }
        }
    }).then(function (sanmeCategory) {
        if(sanmeCategory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'数据库存在相同的名称',
            })
            return Promise.reject()
        }else{
           return  Category.update({
                _id:id
            },{
                name:name
            })
        }
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/category'
        })
    })
})

/*
 * 分类删除
 * */
router.get('/category/delete',function (req,res,next) {
    var id=req.query.id||'';
    Category.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/category'
        })
    })
})

/*
* 内容首页
* */
router.get('/content',function (req,res) {
    var page=Number(req.query.page||1);
    var limit=10
    var pages=0;
    Content.count().then(function (count) {
        pages=Math.ceil(count/limit);
        page=Math.min(page,pages)
        page=Math.max(page,1)
        var skip=(page-1)*limit
        Content.find().limit(limit).skip(skip).populate(['category','user']).sort({addTime:-1}).then(function (contents) {
           console.log(contents)
            res.render('admin/content_index',{
                userInfo:req.userInfo,
                contents:contents,
                count:count,
                pages:pages,
                limit:limit,
                page:page
            })
        })
    })
})
/*
 * 内容首页内容添加
 * */
router.get('/content/add',function (req,res) {

    Category.find().then(function (categoryies) {
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categoryies:categoryies
        })
    })
})

/*
* 内容添加提交
* */

router.post('/content/add',function (req,res,next) {

    //console.log(req.body)
    if(req.body.category==""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类内容不能为空'
        })
    }
    if(req.body.title==""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类标题不能为空'
        })
    }

    //保存数据到数据库中

    new Content({
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id.toString(),
        description:req.body.description,
        content:req.body.content
    }).save().then(function (rs) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content'
        })
    });
})

/*
* 内容修改
* */

router.get('/content/edit',function (req,res,next) {

    var id=req.query.id||'';
    var categoryies=[]
    //console.log(id);
    Category.find().then(function (rs) {
        categoryies=rs
        return Content.findOne({
            _id:id
        }).populate('category')
    }).then(function (content) {
        console.log(content)
        if(!content){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'内容不存在'
            });
            return Promise.reject()
        }else{
            res.render('admin/content_edit',{
                userInfo:req.userInfo,
                content:content,
                categoryies:categoryies
            })
        }
    })
})

/*
* 内容保存
* */

router.post('/content/edit',function (req,res,next) {
    var id=req.query.id||'';
    if(req.body.category==""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类内容不能为空'
        })
    }
    if(req.body.title==""){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'分类标题不能为空'
        })
    }

    Content.update({
        _id:id
    },{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content'
        })
    })
})

/*
* 
* 内容删除*/

router.get('/content/delete',function (req,res,next) {
    var id=req.query.id||'';
    Content.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/content'
        })
    })
})


module.exports=router;