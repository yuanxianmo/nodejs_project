/**
 * Created by 袁贤谟 on 2017/12/18.
 */
var mongoose=require('mongoose')
var userSchema=require('../schemas/users')

module.exports=mongoose.model('User',userSchema);