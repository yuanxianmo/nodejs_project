/**
 * Created by 袁贤谟 on 2017/12/19.
 */
var mongoose=require('mongoose')
var categoriesSchema=require('../schemas/categories')

module.exports=mongoose.model('Category',categoriesSchema);