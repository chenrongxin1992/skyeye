/**
 *  @Author:    chenrongxin
 *  @Create Date:   2017-12-04
 *  @Description:
 */
var mongoose = require('./db'),
    Schema = mongoose.Schema,
    moment = require('moment')

var baiqiangmingdanSchema = new Schema({
    xuhao : {type:String},//序号
    gongsimingcheng : {type:String},//
    quyu : {type:String},//
    gongsilianjie : {type:String,default:null},//公司信息链接
    gongsidizhi : {type:String,default:null},//公司地址
    hangye : {type:String,default:null},
    insert_ime : {type : String, default : moment().format('YYYY-MM-DD HH:mm:ss') },     //
    insert_timeStamp : {type : String,default:moment().format('X')}
})

module.exports = mongoose.model('baiqiangmingdan',baiqiangmingdanSchema);