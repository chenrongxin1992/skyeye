/**
 *  @Author:    chenrongxin
 *  @Create Date:   2017-12-03
 *  @Description:
 */
var mongoose = require('./db'),
    Schema = mongoose.Schema,
    moment = require('moment')

var companyAddressSchema = new Schema({
    xuhao : {type:String},//序号
    suoshu : {type:String},//所属中心
    jibie : {type:String},//级别
    shiyanshi : {type:String},//所属实验室
    gongsi : {type:String},//所属公司
    nianfen : {type:String},//年份
    zhuguan : {type:String},//主管中心
    gongsilianjie : {type:String,default:null},//公司信息链接
    gongsidizhi : {type:String,default:null},//公司地址
    insert_ime : {type : String, default : moment().format('YYYY-MM-DD HH:mm:ss') },     //申请时间
    insert_timeStamp : {type : String,default:moment().format('X')}
})

module.exports = mongoose.model('companyAdd',companyAddressSchema);