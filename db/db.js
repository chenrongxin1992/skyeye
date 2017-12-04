/**
 *  @Author:    chenrongxin
 *  @Create Date:   2017-11-09
 *  @Description:   数据库配置
 */
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
//服务器上
//const DB_URL = 'mongodb://forkaoqinuse:youtrytry@localhost:27017/kaoqin'
//本地
const DB_URL = 'mongodb://localhost:27017/skyeye'
mongoose.connect(DB_URL,{useMongoClient:true})

/**
 * 连接成功
 */
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + DB_URL);
});

/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

module.exports = mongoose