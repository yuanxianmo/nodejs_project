/**
 * Created by 袁贤谟 on 2017/12/19.
 */
var mongoose=require('mongoose')
var contentsSchema=require('../schemas/contents')

module.exports=mongoose.model('Content',contentsSchema);