const xlsx = require('node-xlsx')
const async = require('async')
const fs = require('fs')
const request = require('request')
const xpath = require('xpath')
const dom = require('xmldom').DOMParser
const readLineSync = require('readline-sync')

//db
const companyAdd = require('../db/companyAddress')
const fuhuaqi = require('../db/fuhuaqi')
const baiqiangmingdan = require('../db/baiqiangmingdan')
const longhua = require('../db/longhua')

//导入excel到数据库
exports.importExcel_chuangkewei = function () {
    //读取文件内容,获取公司名称，存数组
    let obj = xlsx.parse(__dirname+'/深圳科技创新载体名单.xlsx');
    let excelObj=obj[0].data;//二维数组
    async.eachLimit(excelObj,1,function (item,cb) {
        let saveInfo = new companyAdd({
            xuhao : item[0],
            suoshu : item[1],
            jibie : item[2],
            shiyanshi : item[3],
            gongsi : item[4],
            nianfen : item[5],
            zhuguan : item[6]
        })
        saveInfo.save(function (err) {
            if(err){
                console.log('----- save err -----')
                console.log(err)
                cb(err)
            }
            console.log('----- save success -----')
            console.log('info -->',saveInfo)
            cb(null)
        })
    },function (err) {
        if(err){
            console.log('----- eachLimit err -----')
            console.log(err)
        }
        console.log('----- eachLimit success -----')
    })
}
exports.importExcel_fuhuaqi = function () {
    //读取文件内容,获取公司名称，存数组
    let obj = xlsx.parse(__dirname+'/深圳孵化器名单2016.xlsx');
    let excelObj=obj[0].data;//二维数组
    async.eachLimit(excelObj,1,function (item,cb) {
        let saveInfo = new fuhuaqi({
            xuhao : item[0],
            xiangmumingcheng : item[1],
            danweimingcheng : item[2],
            lixiangniandu : item[3],
            zaitileixing : item[4]
        })
        saveInfo.save(function (err) {
            if(err){
                console.log('----- save err -----')
                console.log(err)
                cb(err)
            }
            console.log('----- save success -----')
            console.log('info -->',saveInfo)
            cb(null)
        })
    },function (err) {
        if(err){
            console.log('----- eachLimit err -----')
            console.log(err)
        }
        console.log('----- eachLimit success -----')
    })
}
exports.importExcel_gongyebaiqiang = function () {
    //读取文件内容,获取公司名称，存数组
    let obj = xlsx.parse(__dirname+'/2016深圳工业百强名单.xlsx');
    let excelObj=obj[0].data;//二维数组
    async.eachLimit(excelObj,1,function (item,cb) {
        let saveInfo = new baiqiangmingdan({
            xuhao : item[0],
            gongsimingcheng : item[1],
            quyu : item[2],
            gongsidizhi : item[3],
            hangye : item[4]
        })
        saveInfo.save(function (err) {
            if(err){
                console.log('----- save err -----')
                console.log(err)
                cb(err)
            }
            console.log('----- save success -----')
            console.log('info -->',saveInfo)
            cb(null)
        })
    },function (err) {
        if(err){
            console.log('----- eachLimit err -----')
            console.log(err)
        }
        console.log('----- eachLimit success -----')
    })
}
exports.importExcel_longhua = function () {
    //读取文件内容,获取公司名称，存数组
    let obj = xlsx.parse(__dirname+'/龙华中小微创新100强2016.xlsx');
    let excelObj=obj[0].data;//二维数组
    async.eachLimit(excelObj,1,function (item,cb) {
        let saveInfo = new longhua({
            xuhao : item[0],
            gongsimingcheng : item[1]
        })
        saveInfo.save(function (err) {
            if(err){
                console.log('----- save err -----')
                console.log(err)
                cb(err)
            }
            console.log('----- save success -----')
            console.log('info -->',saveInfo)
            cb(null)
        })
    },function (err) {
        if(err){
            console.log('----- eachLimit err -----')
            console.log(err)
        }
        console.log('----- eachLimit success -----')
    })
}

//获取公司对应的地址
exports.getCompanyAddr_baiqiangmingdan = function () {
    async.waterfall([
        function (cb) {
            let search = baiqiangmingdan.find({"gongsidizhi":null})
            search.exec(function (err,doc) {
                if(err){
                    console.log('----- search err -----')
                    console.log(err)
                    cb(err)
                }
                if(doc && doc.length != 0){
                    console.log('总共有',doc.length,'条记录')
                    cb(null,doc)
                }
            })
        },
        function (arg,cb) {
            async.eachLimit(arg,10,function (item,cbb) {
                let options = {
                    url : item.gongsilianjie,
                    timeout:20000,
                    headers : {
                        'Cookie' : 'aliyungf_tc=AQAAAN+GvTbb4QgAt/UHdBb+JUZsZpM9; csrfToken=rFbwwDoGdbCPBDpFNMXlWSVy; TYCID=e72a0c60d40f11e78c16f3d8e099f01c; undefined=e72a0c60d40f11e78c16f3d8e099f01c; ssuid=7972889235; bannerFlag=true; RTYCID=e297d1b7c09344578dc7940af481bcda; token=486bc541f3524b71af41651377c1131d; _utm=2bcebad11470465ba562abdb33c3159c; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1511855038; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1512114154; tyc-user-info=%257B%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522onum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252213760277012%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A; _csrf=HOwF90694IM3sORe/koTQg==; OA=eTlCK29l7adIfv0aF1YSs9McVL1+ZDrI6btc3xAEmdk=; _csrf_bk=5048d0745ee417bd99d8d7a77bf61b3e',
                        'User-Agent' : 'User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                    }
                }
                request.get(options,
                    function(err,response,body){
                        if(err){
                            console.log('--------------------------- 抓取时错误 ----------------------------')
                            console.log(err)
                            cbb(null)
                        }
                        if(!err && response.statusCode == 200){
                            let doc = new dom().parseFromString(body)
                            let firstTemp = xpath.select('//*[@id="company_web_top"]/div[2]/div[2]/div/div[2]/div[2]/span[2]', doc)
                            if(firstTemp.length != 0){
                                console.log(firstTemp[0].childNodes['0'].nodeValue)
                                let insertVal = firstTemp[0].childNodes['0'].nodeValue
                                let pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;//邮箱
                                if(pattern.test(insertVal)){//匹配到邮箱
                                    let tem = xpath.select('//*[@id="company_web_top"]/div[2]/div[2]/div[1]/div[3]/div[2]/span[2]', doc)
                                    insertVal = tem[0].childNodes['0'].nodeValue
                                    baiqiangmingdan.update({'_id':item._id},{$set:{'gongsidizhi':insertVal}},function(err){
                                        if(err){
                                            console.log('----- eachLimit update err -----')
                                            console.log(err)
                                            cbb(err)
                                        }
                                        console.log('----- eachLimit update success -----')
                                        cbb(null)
                                    })
                                }else{
                                    baiqiangmingdan.update({'_id':item._id},{$set:{'gongsidizhi':insertVal}},function(err){
                                        if(err){
                                            console.log('----- eachLimit update err -----')
                                            console.log(err)
                                            cbb(err)
                                        }
                                        console.log('----- eachLimit update success -----')
                                        cbb(null)
                                    })
                                }
                            }else{
                                //等待输入后再回调
                                let input = readLineSync.question('input something-->');
                                cbb(null)
                            }
                        }
                    })
            },function (err) {
                if(err){
                    console.log('----- eachLimit err -----')
                    console.log(err)
                    cb(err)
                }
                console.log('----- eachLimit success -----')
                cb(null)
            })
        }
    ],function (error,result) {
        if(error){
            console.log('----- async waterfall error -----')
            console.log(error)
        }
        console.log('----- async waterfall success')
    })
}
exports.getCompanyAddr_fuhuaqi = function () {
    async.waterfall([
        function (cb) {
            let search = fuhuaqi.find({"gongsidizhi":null})
            search.exec(function (err,doc) {
                if(err){
                    console.log('----- search err -----')
                    console.log(err)
                    cb(err)
                }
                if(doc && doc.length != 0){
                    console.log('总共有',doc.length,'条记录')
                    cb(null,doc)
                }
            })
        },
        function (arg,cb) {
            async.eachLimit(arg,10,function (item,cbb) {
                let options = {
                    url : item.gongsilianjie,
                    timeout:20000,
                    headers : {
                        'Cookie' : 'aliyungf_tc=AQAAAN+GvTbb4QgAt/UHdBb+JUZsZpM9; csrfToken=rFbwwDoGdbCPBDpFNMXlWSVy; TYCID=e72a0c60d40f11e78c16f3d8e099f01c; undefined=e72a0c60d40f11e78c16f3d8e099f01c; ssuid=7972889235; bannerFlag=true; RTYCID=e297d1b7c09344578dc7940af481bcda; token=486bc541f3524b71af41651377c1131d; _utm=2bcebad11470465ba562abdb33c3159c; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1511855038; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1512114154; tyc-user-info=%257B%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522onum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252213760277012%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A; _csrf=HOwF90694IM3sORe/koTQg==; OA=eTlCK29l7adIfv0aF1YSs9McVL1+ZDrI6btc3xAEmdk=; _csrf_bk=5048d0745ee417bd99d8d7a77bf61b3e',
                        'User-Agent' : 'User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                    }
                }
                request.get(options,
                    function(err,response,body){
                        if(err){
                            console.log('--------------------------- 抓取时错误 ----------------------------')
                            console.log(err)
                            cbb(null)
                        }
                        if(!err && response.statusCode == 200){
                            let doc = new dom().parseFromString(body)
                            let firstTemp = xpath.select('//*[@id="company_web_top"]/div[2]/div[2]/div/div[2]/div[2]/span[2]', doc)
                            if(firstTemp.length != 0){
                                console.log(firstTemp[0].childNodes['0'].nodeValue)
                                let insertVal = firstTemp[0].childNodes['0'].nodeValue
                                let pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;//邮箱
                                if(pattern.test(insertVal)){//匹配到邮箱
                                    let tem = xpath.select('//*[@id="company_web_top"]/div[2]/div[2]/div[1]/div[3]/div[2]/span[2]', doc)
                                    insertVal = tem[0].childNodes['0'].nodeValue
                                    fuhuaqi.update({'_id':item._id},{$set:{'gongsidizhi':insertVal}},function(err){
                                        if(err){
                                            console.log('----- eachLimit update err -----')
                                            console.log(err)
                                            cbb(err)
                                        }
                                        console.log('----- eachLimit update success -----')
                                        cbb(null)
                                    })
                                }else{
                                    fuhuaqi.update({'_id':item._id},{$set:{'gongsidizhi':insertVal}},function(err){
                                        if(err){
                                            console.log('----- eachLimit update err -----')
                                            console.log(err)
                                            cbb(err)
                                        }
                                        console.log('----- eachLimit update success -----')
                                        cbb(null)
                                    })
                                }
                            }else{
                                //等待输入后再回调
                                let input = readLineSync.question('input something-->');
                                cbb(null)
                            }
                        }
                    })
            },function (err) {
                if(err){
                    console.log('----- eachLimit err -----')
                    console.log(err)
                    cb(err)
                }
                console.log('----- eachLimit success -----')
                cb(null)
            })
        }
    ],function (error,result) {
        if(error){
            console.log('----- async waterfall error -----')
            console.log(error)
        }
        console.log('----- async waterfall success')
    })
}
exports.getCompanyAddr_longhua = function () {
    async.waterfall([
        function (cb) {
            let search = longhua.find({"gongsidizhi":null})
            search.exec(function (err,doc) {
                if(err){
                    console.log('----- search err -----')
                    console.log(err)
                    cb(err)
                }
                if(doc && doc.length != 0){
                    console.log('总共有',doc.length,'条记录')
                    cb(null,doc)
                }
            })
        },
        function (arg,cb) {
            async.eachLimit(arg,10,function (item,cbb) {
                let options = {
                    url : item.gongsilianjie,
                    timeout:20000,
                    headers : {
                        'Cookie' : 'aliyungf_tc=AQAAAN+GvTbb4QgAt/UHdBb+JUZsZpM9; csrfToken=rFbwwDoGdbCPBDpFNMXlWSVy; TYCID=e72a0c60d40f11e78c16f3d8e099f01c; undefined=e72a0c60d40f11e78c16f3d8e099f01c; ssuid=7972889235; bannerFlag=true; RTYCID=e297d1b7c09344578dc7940af481bcda; token=486bc541f3524b71af41651377c1131d; _utm=2bcebad11470465ba562abdb33c3159c; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1511855038; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1512114154; tyc-user-info=%257B%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522onum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252213760277012%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A; _csrf=HOwF90694IM3sORe/koTQg==; OA=eTlCK29l7adIfv0aF1YSs9McVL1+ZDrI6btc3xAEmdk=; _csrf_bk=5048d0745ee417bd99d8d7a77bf61b3e',
                        'User-Agent' : 'User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                    }
                }
                request.get(options,
                    function(err,response,body){
                        if(err){
                            console.log('--------------------------- 抓取时错误 ----------------------------')
                            console.log(err)
                            cbb(null)
                        }
                        if(!err && response.statusCode == 200){
                            let doc = new dom().parseFromString(body)
                            let firstTemp = xpath.select('//*[@id="company_web_top"]/div[2]/div[2]/div/div[2]/div[2]/span[2]', doc)
                            if(firstTemp.length != 0){
                                console.log(firstTemp[0].childNodes['0'].nodeValue)
                                let insertVal = firstTemp[0].childNodes['0'].nodeValue
                                let pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;//邮箱
                                if(pattern.test(insertVal)){//匹配到邮箱
                                    let tem = xpath.select('//*[@id="company_web_top"]/div[2]/div[2]/div[1]/div[3]/div[2]/span[2]', doc)
                                    insertVal = tem[0].childNodes['0'].nodeValue
                                    longhua.update({'_id':item._id},{$set:{'gongsidizhi':insertVal}},function(err){
                                        if(err){
                                            console.log('----- eachLimit update err -----')
                                            console.log(err)
                                            cbb(err)
                                        }
                                        console.log('----- eachLimit update success -----')
                                        cbb(null)
                                    })
                                }else{
                                    longhua.update({'_id':item._id},{$set:{'gongsidizhi':insertVal}},function(err){
                                        if(err){
                                            console.log('----- eachLimit update err -----')
                                            console.log(err)
                                            cbb(err)
                                        }
                                        console.log('----- eachLimit update success -----')
                                        cbb(null)
                                    })
                                }
                            }else{
                                //等待输入后再回调
                                let input = readLineSync.question('input something-->');
                                cbb(null)
                            }
                        }
                    })
            },function (err) {
                if(err){
                    console.log('----- eachLimit err -----')
                    console.log(err)
                    cb(err)
                }
                console.log('----- eachLimit success -----')
                cb(null)
            })
        }
    ],function (error,result) {
        if(error){
            console.log('----- async waterfall error -----')
            console.log(error)
        }
        console.log('----- async waterfall success')
    })
}
exports.getCompanyAddr = function () {
    async.waterfall([
        function (cb) {
            let search = companyAdd.find({"gongsidizhi":null})
                search.exec(function (err,doc) {
                    if(err){
                        console.log('----- search err -----')
                        console.log(err)
                        cb(err)
                    }
                    if(doc && doc.length != 0){
                        console.log('总共有',doc.length,'条记录')
                        cb(null,doc)
                    }
                })
        },
        function (arg,cb) {
            async.eachLimit(arg,10,function (item,cbb) {
                    let options = {
                        url : item.gongsilianjie,
                        timeout:20000,
                        headers : {
                            'Cookie' : 'aliyungf_tc=AQAAAN+GvTbb4QgAt/UHdBb+JUZsZpM9; csrfToken=rFbwwDoGdbCPBDpFNMXlWSVy; TYCID=e72a0c60d40f11e78c16f3d8e099f01c; undefined=e72a0c60d40f11e78c16f3d8e099f01c; ssuid=7972889235; bannerFlag=true; RTYCID=e297d1b7c09344578dc7940af481bcda; token=486bc541f3524b71af41651377c1131d; _utm=2bcebad11470465ba562abdb33c3159c; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1511855038; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1512114154; tyc-user-info=%257B%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522onum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252213760277012%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A; _csrf=HOwF90694IM3sORe/koTQg==; OA=eTlCK29l7adIfv0aF1YSs9McVL1+ZDrI6btc3xAEmdk=; _csrf_bk=5048d0745ee417bd99d8d7a77bf61b3e',
                            'User-Agent' : 'User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                        }
                    }
                    request.get(options,
                        function(err,response,body){
                            if(err){
                                console.log('--------------------------- 抓取时错误 ----------------------------')
                                console.log(err)
                                cbb(null)
                            }
                            if(!err && response.statusCode == 200){
                                let doc = new dom().parseFromString(body)
                                let firstTemp = xpath.select('//*[@id="company_web_top"]/div[2]/div[2]/div/div[2]/div[2]/span[2]', doc)
                                if(firstTemp.length != 0){
                                    console.log(firstTemp[0].childNodes['0'].nodeValue)
                                    let insertVal = firstTemp[0].childNodes['0'].nodeValue
                                    let pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;//邮箱
                                    if(pattern.test(insertVal)){//匹配到邮箱
                                        let tem = xpath.select('//*[@id="company_web_top"]/div[2]/div[2]/div[1]/div[3]/div[2]/span[2]', doc)
                                        insertVal = tem[0].childNodes['0'].nodeValue
                                        companyAdd.update({'_id':item._id},{$set:{'gongsidizhi':insertVal}},function(err){
                                            if(err){
                                                console.log('----- eachLimit update err -----')
                                                console.log(err)
                                                cbb(err)
                                            }
                                            console.log('----- eachLimit update success -----')
                                            cbb(null)
                                        })
                                    }else{
                                        companyAdd.update({'_id':item._id},{$set:{'gongsidizhi':insertVal}},function(err){
                                            if(err){
                                                console.log('----- eachLimit update err -----')
                                                console.log(err)
                                                cbb(err)
                                            }
                                            console.log('----- eachLimit update success -----')
                                            cbb(null)
                                        })
                                    }
                                }else{
                                    //等待输入后再回调
                                    let input = readLineSync.question('input something-->');
                                    cbb(null)
                                }
                            }
                        })
            },function (err) {
                if(err){
                    console.log('----- eachLimit err -----')
                    console.log(err)
                    cb(err)
                }
                console.log('----- eachLimit success -----')
                cb(null)
            })
        }
    ],function (error,result) {
        if(error){
            console.log('----- async waterfall error -----')
            console.log(error)
        }
        console.log('----- async waterfall success')
    })
}

//获取公司对应链接
const baseUrl = 'https://www.tianyancha.com/search?key='
exports.getGongsiLianjie_baiqiangmingdan = function () {
    async.waterfall([
        function (cb) {
            let search = baiqiangmingdan.find({})
            search.where('gongsilianjie').equals(null)
            search.exec(function (err,doc) {
                if(err){
                    console.log('----- search err -----')
                    console.log(err)
                    cb(err)
                }
                if(doc && doc.length != 0){
                    console.log('----- search success -----')
                    console.log(doc)
                    console.log('length-->',doc.length)
                    cb(null,doc)
                }
                if(doc.length == 0){
                    console.log('----- search no result -----')
                    console.log('公司链接获取完成')
                    cb(null,null)
                }
            })
        },
        function (arg,cb) {
            if(arg){
                async.eachLimit(arg,5,function (item,cbb) {
                    let url = baseUrl + encodeURIComponent(item.gongsimingcheng)
                    console.log('当前爬取--》',url)
                    let options = {
                        url : url,
                        timeout:20000,
                        headers : {
                            'Cookie' : 'aliyungf_tc=AQAAAN+GvTbb4QgAt/UHdBb+JUZsZpM9; csrfToken=rFbwwDoGdbCPBDpFNMXlWSVy; TYCID=e72a0c60d40f11e78c16f3d8e099f01c; undefined=e72a0c60d40f11e78c16f3d8e099f01c; ssuid=7972889235; bannerFlag=true; RTYCID=e297d1b7c09344578dc7940af481bcda; token=486bc541f3524b71af41651377c1131d; _utm=2bcebad11470465ba562abdb33c3159c; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1511855038; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1512114154; tyc-user-info=%257B%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522onum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252213760277012%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A; _csrf=HOwF90694IM3sORe/koTQg==; OA=eTlCK29l7adIfv0aF1YSs9McVL1+ZDrI6btc3xAEmdk=; _csrf_bk=5048d0745ee417bd99d8d7a77bf61b3e',
                            'User-Agent' : 'User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                        }
                    }
                    request.get(options,
                        function(err,response,body){
                            if(err){
                                console.log('--------------------------- 抓取时错误 ----------------------------')
                                console.log(err)
                                cbb(null)
                            }
                            if(!err && response.statusCode == 200){
                                let doc = new dom().parseFromString(body)
                                let secondTemp = xpath.select('//*[@id="web-content"]/div/div/div/div[1]/div[4]/div[1]/div[2]/div[1]/a/@href', doc)
                                if(secondTemp.length != 0){
                                    console.log(secondTemp[0].value)
                                    //第一种情况，更新公司链接
                                    console.log('----- 情况1 -----')
                                    baiqiangmingdan.update({'_id':item._id},{$set:{'gongsilianjie':secondTemp[0].value}},function(err){
                                        if(err){
                                            console.log('----- eachLimit update err -----')
                                            console.log(err)
                                            cbb(err)
                                        }
                                        console.log('----- eachLimit update success -----')
                                        cbb(null)
                                    })
                                }else{
                                    let thirdTemp = xpath.select('//*[@id="web-content"]/div/div/div/div[1]/div[3]/div[1]/div[2]/div[1]/a/@href', doc)
                                    if(thirdTemp.length != 0){
                                        console.log(thirdTemp[0].value)
                                        //第二种情况，更新公司链接
                                        console.log('----- 情况2 -----')
                                        baiqiangmingdan.update({'_id':item._id},{$set:{'gongsilianjie':thirdTemp[0].value}},function(err){
                                            if(err){
                                                console.log('----- eachLimit update err -----')
                                                console.log(err)
                                                cbb(err)
                                            }
                                            console.log('----- eachLimit update success -----')
                                            cbb(null)
                                        })
                                    }else{
                                        //companyArr.push('no match result')
                                        //第三种情况，标注没有匹配结果
                                        console.log('----- 情况3 -----')
                                        baiqiangmingdan.update({'_id':item._id},{$set:{'gongsilianjie':'no match result'}},function(err){
                                            if(err){
                                                console.log('----- eachLimit update err -----')
                                                console.log(err)
                                                cbb(err)
                                            }
                                            console.log('----- eachLimit update success -----')
                                            //等待输入后再回调
                                            let input = readLineSync.question('input something-->');
                                            cbb(null)
                                        })

                                    }
                                }
                            }
                        })
                },function (err) {
                    if(err){
                        console.log('----- eachLimit err -----')
                        console.log(err)
                        cb(err)
                    }
                    console.log('----- eachLimit 公司链接获取成功 -----')
                    cb(null)
                })
            }else{
                cb(null)
            }
        }
    ],function (error,result) {
        if(error){
            console.log('----- async waterfall error -----')
            console.log(error)
        }
        console.log('----- async waterfalll success -----')
    })
}
exports.getGongsiLianjie_longhua = function () {
    async.waterfall([
        function (cb) {
            let search = longhua.find({})
            search.where('gongsilianjie').equals(null)
            search.exec(function (err,doc) {
                if(err){
                    console.log('----- search err -----')
                    console.log(err)
                    cb(err)
                }
                if(doc && doc.length != 0){
                    console.log('----- search success -----')
                    console.log(doc)
                    console.log('length-->',doc.length)
                    cb(null,doc)
                }
                if(doc.length == 0){
                    console.log('----- search no result -----')
                    console.log('公司链接获取完成')
                    cb(null,null)
                }
            })
        },
        function (arg,cb) {
            if(arg){
                async.eachLimit(arg,5,function (item,cbb) {
                    let url = baseUrl + encodeURIComponent(item.gongsimingcheng)
                    console.log('当前爬取--》',url)
                    let options = {
                        url : url,
                        timeout:20000,
                        headers : {
                            'Cookie' : 'aliyungf_tc=AQAAAN+GvTbb4QgAt/UHdBb+JUZsZpM9; csrfToken=rFbwwDoGdbCPBDpFNMXlWSVy; TYCID=e72a0c60d40f11e78c16f3d8e099f01c; undefined=e72a0c60d40f11e78c16f3d8e099f01c; ssuid=7972889235; bannerFlag=true; RTYCID=e297d1b7c09344578dc7940af481bcda; token=486bc541f3524b71af41651377c1131d; _utm=2bcebad11470465ba562abdb33c3159c; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1511855038; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1512114154; tyc-user-info=%257B%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522onum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252213760277012%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A; _csrf=HOwF90694IM3sORe/koTQg==; OA=eTlCK29l7adIfv0aF1YSs9McVL1+ZDrI6btc3xAEmdk=; _csrf_bk=5048d0745ee417bd99d8d7a77bf61b3e',
                            'User-Agent' : 'User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                        }
                    }
                    request.get(options,
                        function(err,response,body){
                            if(err){
                                console.log('--------------------------- 抓取时错误 ----------------------------')
                                console.log(err)
                                cbb(null)
                            }
                            if(!err && response.statusCode == 200){
                                let doc = new dom().parseFromString(body)
                                let secondTemp = xpath.select('//*[@id="web-content"]/div/div/div/div[1]/div[4]/div[1]/div[2]/div[1]/a/@href', doc)
                                if(secondTemp.length != 0){
                                    console.log(secondTemp[0].value)
                                    //第一种情况，更新公司链接
                                    console.log('----- 情况1 -----')
                                    longhua.update({'_id':item._id},{$set:{'gongsilianjie':secondTemp[0].value}},function(err){
                                        if(err){
                                            console.log('----- eachLimit update err -----')
                                            console.log(err)
                                            cbb(err)
                                        }
                                        console.log('----- eachLimit update success -----')
                                        cbb(null)
                                    })
                                }else{
                                    let thirdTemp = xpath.select('//*[@id="web-content"]/div/div/div/div[1]/div[3]/div[1]/div[2]/div[1]/a/@href', doc)
                                    if(thirdTemp.length != 0){
                                        console.log(thirdTemp[0].value)
                                        //第二种情况，更新公司链接
                                        console.log('----- 情况2 -----')
                                        longhua.update({'_id':item._id},{$set:{'gongsilianjie':thirdTemp[0].value}},function(err){
                                            if(err){
                                                console.log('----- eachLimit update err -----')
                                                console.log(err)
                                                cbb(err)
                                            }
                                            console.log('----- eachLimit update success -----')
                                            cbb(null)
                                        })
                                    }else{
                                        //companyArr.push('no match result')
                                        //第三种情况，标注没有匹配结果
                                        console.log('----- 情况3 -----')
                                        longhua.update({'_id':item._id},{$set:{'gongsilianjie':'no match result'}},function(err){
                                            if(err){
                                                console.log('----- eachLimit update err -----')
                                                console.log(err)
                                                cbb(err)
                                            }
                                            console.log('----- eachLimit update success -----')
                                            //等待输入后再回调
                                            let input = readLineSync.question('input something-->');
                                            cbb(null)
                                        })

                                    }
                                }
                            }
                        })
                },function (err) {
                    if(err){
                        console.log('----- eachLimit err -----')
                        console.log(err)
                        cb(err)
                    }
                    console.log('----- eachLimit 公司链接获取成功 -----')
                    cb(null)
                })
            }else{
                cb(null)
            }
        }
    ],function (error,result) {
        if(error){
            console.log('----- async waterfall error -----')
            console.log(error)
        }
        console.log('----- async waterfalll success -----')
    })
}
exports.getGongsiLianjie_fuhuaqi = function () {
        async.waterfall([
            function (cb) {
                let search = fuhuaqi.find({})
                search.where('gongsilianjie').equals(null)
                search.exec(function (err,doc) {
                    if(err){
                        console.log('----- search err -----')
                        console.log(err)
                        cb(err)
                    }
                    if(doc && doc.length != 0){
                        console.log('----- search success -----')
                        console.log(doc)
                        console.log('length-->',doc.length)
                        cb(null,doc)
                    }
                    if(doc.length == 0){
                        console.log('----- search no result -----')
                        console.log('公司链接获取完成')
                        cb(null,null)
                    }
                })
            },
            function (arg,cb) {
                if(arg){
                    async.eachLimit(arg,5,function (item,cbb) {
                        let url = baseUrl + encodeURIComponent(item.danweimingcheng)
                        console.log('当前爬取--》',url)
                        let options = {
                            url : url,
                            timeout:20000,
                            headers : {
                                'Cookie' : 'aliyungf_tc=AQAAAN+GvTbb4QgAt/UHdBb+JUZsZpM9; csrfToken=rFbwwDoGdbCPBDpFNMXlWSVy; TYCID=e72a0c60d40f11e78c16f3d8e099f01c; undefined=e72a0c60d40f11e78c16f3d8e099f01c; ssuid=7972889235; bannerFlag=true; RTYCID=e297d1b7c09344578dc7940af481bcda; token=486bc541f3524b71af41651377c1131d; _utm=2bcebad11470465ba562abdb33c3159c; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1511855038; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1512114154; tyc-user-info=%257B%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522onum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252213760277012%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A; _csrf=HOwF90694IM3sORe/koTQg==; OA=eTlCK29l7adIfv0aF1YSs9McVL1+ZDrI6btc3xAEmdk=; _csrf_bk=5048d0745ee417bd99d8d7a77bf61b3e',
                                'User-Agent' : 'User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                            }
                        }
                        request.get(options,
                            function(err,response,body){
                                if(err){
                                    console.log('--------------------------- 抓取时错误 ----------------------------')
                                    console.log(err)
                                    cbb(null)
                                }
                                if(!err && response.statusCode == 200){
                                    let doc = new dom().parseFromString(body)
                                    let secondTemp = xpath.select('//*[@id="web-content"]/div/div/div/div[1]/div[4]/div[1]/div[2]/div[1]/a/@href', doc)
                                    if(secondTemp.length != 0){
                                        console.log(secondTemp[0].value)
                                        //第一种情况，更新公司链接
                                        console.log('----- 情况1 -----')
                                        fuhuaqi.update({'_id':item._id},{$set:{'gongsilianjie':secondTemp[0].value}},function(err){
                                            if(err){
                                                console.log('----- eachLimit update err -----')
                                                console.log(err)
                                                cbb(err)
                                            }
                                            console.log('----- eachLimit update success -----')
                                            cbb(null)
                                        })
                                    }else{
                                        let thirdTemp = xpath.select('//*[@id="web-content"]/div/div/div/div[1]/div[3]/div[1]/div[2]/div[1]/a/@href', doc)
                                        if(thirdTemp.length != 0){
                                            console.log(thirdTemp[0].value)
                                            //第二种情况，更新公司链接
                                            console.log('----- 情况2 -----')
                                            fuhuaqi.update({'_id':item._id},{$set:{'gongsilianjie':thirdTemp[0].value}},function(err){
                                                if(err){
                                                    console.log('----- eachLimit update err -----')
                                                    console.log(err)
                                                    cbb(err)
                                                }
                                                console.log('----- eachLimit update success -----')
                                                cbb(null)
                                            })
                                        }else{
                                            //companyArr.push('no match result')
                                            //第三种情况，标注没有匹配结果
                                            console.log('----- 情况3 -----')
                                            fuhuaqi.update({'_id':item._id},{$set:{'gongsilianjie':'no match result'}},function(err){
                                                if(err){
                                                    console.log('----- eachLimit update err -----')
                                                    console.log(err)
                                                    cbb(err)
                                                }
                                                console.log('----- eachLimit update success -----')
                                                //等待输入后再回调
                                                let input = readLineSync.question('input something-->');
                                                cbb(null)
                                            })

                                        }
                                    }
                                }
                            })
                    },function (err) {
                        if(err){
                            console.log('----- eachLimit err -----')
                            console.log(err)
                            cb(err)
                        }
                        console.log('----- eachLimit 公司链接获取成功 -----')
                        cb(null)
                    })
                }else{
                    cb(null)
                }
            }
        ],function (error,result) {
            if(error){
                console.log('----- async waterfall error -----')
                console.log(error)
            }
            console.log('----- async waterfalll success -----')
        })
}
exports.loopGetCompanyAdd = function () {
    setInterval(function () {
        async.waterfall([
            function (cb) {
                let search = companyAdd.find({})
                search.where('gongsilianjie').equals(null)
                search.limit(30)
                search.exec(function (err,doc) {
                    if(err){
                        console.log('----- search err -----')
                        console.log(err)
                        cb(err)
                    }
                    if(doc && doc.length != 0){
                        console.log('----- search success -----')
                        console.log(doc)
                        console.log('length-->',doc.length)
                        cb(null,doc)
                    }
                    if(doc.length == 0){
                        console.log('----- search no result -----')
                        console.log('公司链接获取完成')
                        cb(null,null)
                    }
                })
            },
            function (arg,cb) {
                if(arg){
                    async.eachLimit(arg,5,function (item,cbb) {
                        let url = baseUrl + encodeURIComponent(item.gongsi)
                        console.log('当前爬取--》',url)
                        let options = {
                            url : url,
                            timeout:20000,
                            headers : {
                                'Cookie' : 'aliyungf_tc=AQAAAN+GvTbb4QgAt/UHdBb+JUZsZpM9; csrfToken=rFbwwDoGdbCPBDpFNMXlWSVy; TYCID=e72a0c60d40f11e78c16f3d8e099f01c; undefined=e72a0c60d40f11e78c16f3d8e099f01c; ssuid=7972889235; bannerFlag=true; RTYCID=e297d1b7c09344578dc7940af481bcda; token=486bc541f3524b71af41651377c1131d; _utm=2bcebad11470465ba562abdb33c3159c; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1511855038; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1512114154; tyc-user-info=%257B%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522onum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252213760277012%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A; _csrf=HOwF90694IM3sORe/koTQg==; OA=eTlCK29l7adIfv0aF1YSs9McVL1+ZDrI6btc3xAEmdk=; _csrf_bk=5048d0745ee417bd99d8d7a77bf61b3e',
                                'User-Agent' : 'User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                            }
                        }
                        request.get(options,
                            function(err,response,body){
                                if(err){
                                    console.log('--------------------------- 抓取时错误 ----------------------------')
                                    console.log(err)
                                    cbb(null)
                                }
                                if(!err && response.statusCode == 200){
                                    let doc = new dom().parseFromString(body)
                                    let secondTemp = xpath.select('//*[@id="web-content"]/div/div/div/div[1]/div[4]/div[1]/div[2]/div[1]/a/@href', doc)
                                    if(secondTemp.length != 0){
                                        console.log(secondTemp[0].value)
                                        //第一种情况，更新公司链接
                                        console.log('----- 情况1 -----')
                                        companyAdd.update({'_id':item._id},{$set:{'gongsilianjie':secondTemp[0].value}},function(err){
                                            if(err){
                                                console.log('----- eachLimit update err -----')
                                                console.log(err)
                                                cbb(err)
                                            }
                                            console.log('----- eachLimit update success -----')
                                            cbb(null)
                                        })
                                    }else{
                                        let thirdTemp = xpath.select('//*[@id="web-content"]/div/div/div/div[1]/div[3]/div[1]/div[2]/div[1]/a/@href', doc)
                                        if(thirdTemp.length != 0){
                                            console.log(thirdTemp[0].value)
                                            //第二种情况，更新公司链接
                                            console.log('----- 情况2 -----')
                                            companyAdd.update({'_id':item._id},{$set:{'gongsilianjie':thirdTemp[0].value}},function(err){
                                                if(err){
                                                    console.log('----- eachLimit update err -----')
                                                    console.log(err)
                                                    cbb(err)
                                                }
                                                console.log('----- eachLimit update success -----')
                                                cbb(null)
                                            })
                                        }else{
                                            //companyArr.push('no match result')
                                            //第三种情况，标注没有匹配结果
                                            console.log('----- 情况3 -----')
                                            companyAdd.update({'_id':item._id},{$set:{'gongsilianjie':'no match result'}},function(err){
                                                if(err){
                                                    console.log('----- eachLimit update err -----')
                                                    console.log(err)
                                                    cbb(err)
                                                }
                                                console.log('----- eachLimit update success -----')
                                                //等待输入后再回调
                                                let input = readLineSync.question('input something-->');
                                                cbb(null)
                                            })

                                        }
                                    }
                                }
                            })
                    },function (err) {
                        if(err){
                            console.log('----- eachLimit err -----')
                            console.log(err)
                            cb(err)
                        }
                        console.log('----- eachLimit 公司链接获取成功 -----')
                        cb(null)
                    })
                }else{
                    cb(null)
                }
            }
        ],function (error,result) {
            if(error){
                console.log('----- async waterfall error -----')
                console.log(error)
            }
            console.log('----- async waterfalll success -----')
        })
    },12000)
}

//更新字段gongsilianjie
exports.updateGongsiLianjie_baiqiangmingdan = function () {
    let search = baiqiangmingdan.find({})
    search.where('gongsilianjie').equals('no match result')
    search.exec(function (err,doc) {
        if(err){
            console.log(err)
        }
        console.log('总共有',doc.length,'条记录')
        async.eachLimit(doc,5,function (item,cb) {
            baiqiangmingdan.update({'_id':item._id},{$set:{'gongsilianjie':null}},function (err) {
                if(err){
                    console.log('----- update err -----')
                    console.log(err)
                }
                console.log('----- update success -----')
                cb(null)
            })
        },function (err) {
            if(err){
                console.log('eachLimit err')
            }
            console.log('update finally success')
        })
    })
}
exports.updateGongsiLianjie_fuhuaqi = function () {
    let search = fuhuaqi.find({})
    search.where('gongsilianjie').equals('no match result')
    search.exec(function (err,doc) {
        if(err){
            console.log(err)
        }
        console.log('总共有',doc.length,'条记录')
        async.eachLimit(doc,5,function (item,cb) {
            fuhuaqi.update({'_id':item._id},{$set:{'gongsilianjie':null}},function (err) {
                if(err){
                    console.log('----- update err -----')
                    console.log(err)
                }
                console.log('----- update success -----')
                cb(null)
            })
        },function (err) {
            if(err){
                console.log('eachLimit err')
            }
            console.log('update finally success')
        })
    })
}
exports.updateGongsiLianjie_longhua = function () {
    let search = longhua.find({})
    search.where('gongsilianjie').equals('no match result')
    search.exec(function (err,doc) {
        if(err){
            console.log(err)
        }
        console.log('总共有',doc.length,'条记录')
        async.eachLimit(doc,5,function (item,cb) {
            longhua.update({'_id':item._id},{$set:{'gongsilianjie':null}},function (err) {
                if(err){
                    console.log('----- update err -----')
                    console.log(err)
                }
                console.log('----- update success -----')
                cb(null)
            })
        },function (err) {
            if(err){
                console.log('eachLimit err')
            }
            console.log('update finally success')
        })
    })
}
exports.updateGongsiLianjie = function () {
    let search = companyAdd.find({})
        search.where('gongsilianjie').equals('no match result')
        search.exec(function (err,doc) {
            if(err){
                console.log(err)
            }
            console.log('总共有',doc.length,'条记录')
            async.eachLimit(doc,5,function (item,cb) {
                companyAdd.update({'_id':item._id},{$set:{'gongsilianjie':null}},function (err) {
                    if(err){
                        console.log('----- update err -----')
                        console.log(err)
                    }
                    console.log('----- update success -----')
                    cb(null)
                })
            },function (err) {
                if(err){
                    console.log('eachLimit err')
                }
                console.log('update finally success')
            })
        })
}

//更新字段gongsidizhi
exports.updateGongsiDizhi = function () {
    let search = companyAdd.find({'gongsidizhi':{$ne:null}})
    //search.where('gongsilianjie').equals('no match result')
    search.exec(function (err,doc) {
        if(err){
            console.log(err)
        }
        console.log('总共有',doc.length,'条记录')
        async.eachLimit(doc,5,function (item,cb) {
            companyAdd.update({'_id':item._id},{$set:{'gongsidizhi':null}},function (err) {
                if(err){
                    console.log('----- update err -----')
                    console.log(err)
                }
                console.log('----- update success -----')
                cb(null)
            })
        },function (err) {
            if(err){
                console.log('eachLimit err')
            }
            console.log('update finally success')
        })
    })
}
exports.fetchData = function () {
    //读取文件内容,获取公司名称，存数组
    let obj = xlsx.parse(__dirname+'/深圳科技创新载体名单.xlsx');
    let excelObj=obj[0].data;//二维数组
    let companyNameArr = new Array()
    for (let i in excelObj){
        companyNameArr.push(excelObj[i][4])
    }
    console.log('company name -->',companyNameArr)

    //构造访问链接,存数组
    let urlArr = new Array(),
        baseUrl = 'https://www.tianyancha.com/search?key='
    for (let i in companyNameArr){
        //let buf = iconv.encode(companyNameArr[i], 'utf-8');
        urlArr.push(baseUrl + encodeURIComponent(companyNameArr[i]))
    }
    console.log('urlArr -->',urlArr)

    let fail_company_url_arr = new Array(),//爬取失败链接(获取不到的公司链接)
        fail_result_url_arr = new Array(),
        companyArr = new Array(),
        addressArr = new Array(),//最终地址链接
        count = 0,
        times = 0
    //urlArr = ['https://www.tianyancha.com/search?key=%E6%B7%B1%E5%9C%B3%E5%A4%A7%E5%AD%A6'] //https://www.tianyancha.com/search?key=%E4%B8%AD%E5%9B%BD%E7%A7%91%E5%AD%A6%E9%99%A2%E6%B7%B1%E5%9C%B3%E5%85%88%E8%BF%9B%E6%8A%80%E6%9C%AF%E7%A0%94%E7%A9%B6%E9%99%A2
    //urlArr = ['https://www.tianyancha.com/search?key=%E4%B8%AD%E5%9B%BD%E7%A7%91%E5%AD%A6%E9%99%A2%E6%B7%B1%E5%9C%B3%E5%85%88%E8%BF%9B%E6%8A%80%E6%9C%AF%E7%A0%94%E7%A9%B6%E9%99%A2']
    //爬取链接，正则匹配第一条结果，若成功，则爬取匹配结果，获取地址，并存入数组，不成功则跳过

    async.waterfall([
        function (cb) {
            console.time('获取公司链接时间-->')
            async.eachLimit(urlArr,1,function(item,cbb){
                console.log('当前爬取-->',item)//{url:item, timeout:30000}
                console.log('获取公司链接count-->',count)
                let options = {
                    url : item,
                    timeout:20000,
                    headers : {
                        'Cookie' : 'aliyungf_tc=AQAAAN+GvTbb4QgAt/UHdBb+JUZsZpM9; csrfToken=rFbwwDoGdbCPBDpFNMXlWSVy; TYCID=e72a0c60d40f11e78c16f3d8e099f01c; undefined=e72a0c60d40f11e78c16f3d8e099f01c; ssuid=7972889235; bannerFlag=true; RTYCID=e297d1b7c09344578dc7940af481bcda; token=486bc541f3524b71af41651377c1131d; _utm=2bcebad11470465ba562abdb33c3159c; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1511855038; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1512114154; tyc-user-info=%257B%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522onum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252213760277012%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A; _csrf=HOwF90694IM3sORe/koTQg==; OA=eTlCK29l7adIfv0aF1YSs9McVL1+ZDrI6btc3xAEmdk=; _csrf_bk=5048d0745ee417bd99d8d7a77bf61b3e',
                        'User-Agent' : 'User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                    }
                }
                request.get(options,
                    function(err,response,body){
                        if(err){
                            console.log('--------------------------- 抓取时错误 ----------------------------')
                            console.log(err)
                            fail_company_url_arr.push(decodeURIComponent(item))
                            cbb(null)
                        }
                        if(!err && response.statusCode == 200){
                            //获取第一个结果链接
                            //第一种情况 //*[@id="web-content"]/div/div/div/div[1]
                            let doc = new dom().parseFromString(body)
                            // let firstTemp = xpath.select('//*[@id="web-content"]/div/div/div/div[1]/div[1]', doc)
                            // console.log('firstTemp-->',firstTemp)
                            //if(firstTemp.length != 0){
                                //console.log('ffffffffffffffff')
                                let secondTemp = xpath.select('//*[@id="web-content"]/div/div/div/div[1]/div[4]/div[1]/div[2]/div[1]/a/@href', doc)
                                if(secondTemp.length != 0){
                                    console.log('kkkk')
                                    companyArr.push(secondTemp[0].value)
                                    console.log(secondTemp[0].value)
                                }else{console.log('yyyy')
                                    let thirdTemp = xpath.select('//*[@id="web-content"]/div/div/div/div[1]/div[3]/div[1]/div[2]/div[1]/a/@href', doc)
                                    if(thirdTemp.length != 0){
                                        companyArr.push(thirdTemp[0].value)
                                        console.log(thirdTemp[0].value)
                                    }else{
                                        companyArr.push('no match result')
                                    }
                                    //companyArr.push('no match result')
                                }
                            //}
                            /*else{
                                console.log('dddd')
                                let secondTemp = xpath.select('//!*[@id="web-content"]/div/div/div/div[1]/div[3]/div[1]/div[2]/div[1]/a/@href', doc)
                                console.log('secondTemp-->',secondTemp)
                                if(secondTemp.length != 0){
                                    companyArr.push(secondTemp[0].value)
                                }else{
                                    companyArr.push('no match result')
                                }
                            }*/
                            count++
                            let check = count%500
                            console.log('check is -->',check)
                            console.log('companyArr -- >',companyArr)
                            if(check === 0){//每获取20条暂停1分钟
                                times++
                                console.log('第',times,'次暂停')
                                setTimeout(function() {
                                    cbb(null)
                                }, 1800000);
                            }else{
                                let random = Math.floor(Math.random()*6 + 3),//3-9
                                    random_1 = random + '0000',
                                    random_2 = parseInt(random_1)
                                console.log('random-->',random)
                                console.log('random_2-->',random_2)
                                setTimeout(function() {
                                    cbb(null)
                                }, random_2);
                            }
                        }
                    })
            },function(error){
                if(error){
                    console.log('----- eachLimit error -----')
                    console.log(error)
                    cb(error)
                }
                console.log('companyArr -- >',companyArr)
                console.timeEnd('获取公司链接时间-->')
                setTimeout(function() {
                    cb(null)
                }, 1800000);
            })
        },
        function (cb) {
            times = 0,count = 0

            async.eachLimit(companyArr,1,function (item,cbb) {
                console.log('当前爬取-->',item)//{url:item, timeout:30000}
                console.log('爬取公司链接count-->',count)
                if(item === 'no match result'){
                    addressArr.push('no match result')
                }else{
                    let options = {
                        url : item,
                        timeout:20000,
                        headers : {
                            'Cookie' : 'aliyungf_tc=AQAAAN+GvTbb4QgAt/UHdBb+JUZsZpM9; csrfToken=rFbwwDoGdbCPBDpFNMXlWSVy; TYCID=e72a0c60d40f11e78c16f3d8e099f01c; undefined=e72a0c60d40f11e78c16f3d8e099f01c; ssuid=7972889235; bannerFlag=true; RTYCID=e297d1b7c09344578dc7940af481bcda; token=486bc541f3524b71af41651377c1131d; _utm=2bcebad11470465ba562abdb33c3159c; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1511855038; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1512114154; tyc-user-info=%257B%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522vipManager%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522onum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252213760277012%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMzc2MDI3NzAxMiIsImlhdCI6MTUxMjExNDE5NSwiZXhwIjoxNTI3NjY2MTk1fQ.vv0FRCK8ovQYNrBQ440-kjZLUtwAn2WcZSfnWJAoKYFd4SFLpj4IxHonlxd7Ne9mFtLExYXm4WPywrCzoTMw6A; _csrf=HOwF90694IM3sORe/koTQg==; OA=eTlCK29l7adIfv0aF1YSs9McVL1+ZDrI6btc3xAEmdk=; _csrf_bk=5048d0745ee417bd99d8d7a77bf61b3e',
                            'User-Agent' : 'User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                        }
                    }
                    request.get(options,
                        function(err,response,body){
                            if(err){
                                console.log('--------------------------- 抓取时错误 ----------------------------')
                                console.log(err)
                                fail_result_url_arr.push(item)
                                cbb(null)
                            }
                            if(!err && response.statusCode == 200){
                                //获取第一个结果链接
                                //第一种情况 //*[@id="web-content"]/div/div/div/div[1]
                                let doc = new dom().parseFromString(body)
                                let firstTemp = xpath.select('//*[@id="company_web_top"]/div[2]/div[2]/div/div[2]/div[2]/span[2]', doc)
                                //console.log('firstTemp-->',firstTemp[0].childNodes['0'].nodeValue)
                                if(firstTemp.length != 0){
                                    addressArr.push(firstTemp[0].childNodes['0'].nodeValue)
                                    console.log(firstTemp[0].childNodes['0'].nodeValue)
                                }else{
                                    addressArr.push('no match result')
                                }

                                count++
                                let check = count%500
                                console.log('check is -->',check)
                                console.log('addressArr-->',addressArr)
                                if(check === 0){//每获取30条暂停1.5分钟
                                    times++
                                    console.log('第',times,'次暂停')
                                    setTimeout(function() {
                                        cbb(null)
                                    }, 1800000);
                                }else{
                                    let random = Math.floor(Math.random()*6 + 3),//3-9
                                        random_1 = random + '0000',
                                        random_2 = parseInt(random_1)
                                    setTimeout(function() {
                                        cbb(null)
                                    }, random_2);
                                }
                            }
                        })
                }
            },function (error) {
                if(error){
                    console.log('----- eachLimit error -----')
                    console.log(error)
                    cb(error)
                }
                console.log('addressArr -- >',addressArr)
                //console.timeEnd('获取公司链接时间-->')
                cb(null)
            })
        },
        function (cb) {
            console.log('addressArr length -->',addressArr.length)
            for(let i in excelObj){
                //console.log('i -- >',i)
                excelObj[i][7] = addressArr[i]
            }
            console.log(excelObj[0])
            let buffer = xlsx.build([
                {
                    name:'sheet1',
                    data:excelObj
                }
            ]);
            fs.writeFileSync('test1.xlsx',buffer,{'flag':'w'});   //生成excel
            cb(null)
        }
    ],function (error,result) {
        if(error){
            console.log('waterfall error')
            console.log(error)
        }
        console.log('finally success')
    })
}

//导出excel
exports.exportExcel = function () {
    console.log('ddd')
    let data = new Array()
    let search = companyAdd.find({})
        search.exec(function (err,doc) {
            if(err){
                console.log(err)
            }
            async.eachLimit(doc,1,function (item,cb) {
                let tempArr = new Array()
                tempArr.push(item.xuhao)
                tempArr.push(item.suoshu)
                tempArr.push(item.jibie)
                tempArr.push(item.shiyanshi)
                tempArr.push(item.gongsi)
                tempArr.push(item.nianfen)
                tempArr.push(item.zhuguan)
                tempArr.push(item.gongsidizhi)
                data.push(tempArr)
                delete tempArr
                cb()
            },function (err) {
                if(err){
                    console.log(err)
                }
                let buffer = xlsx.build([
                {
                    name:'sheet1',
                    data:data
                }
                 ]);
                console.log(data)
                fs.writeFileSync('test1.xlsx',buffer,{'flag':'w'});   //生成excel
            })
        })
}
exports.exportExcel_longhua = function () {
    console.log('ddd')
    let data = new Array()
    let search = longhua.find({})
    search.exec(function (err,doc) {
        if(err){
            console.log(err)
        }
        async.eachLimit(doc,1,function (item,cb) {
            let tempArr = new Array()
            tempArr.push(item.xuhao)
            tempArr.push(item.gongsimingcheng)
            tempArr.push(item.gongsidizhi)
            data.push(tempArr)
            delete tempArr
            cb()
        },function (err) {
            if(err){
                console.log(err)
            }
            let buffer = xlsx.build([
                {
                    name:'sheet1',
                    data:data
                }
            ]);
            console.log(data)
            fs.writeFileSync('longhua.xlsx',buffer,{'flag':'w'});   //生成excel
        })
    })
}
exports.exportExcel_fuhuaqi = function () {
    console.log('ddd')
    let data = new Array()
    let search = fuhuaqi.find({})
    search.exec(function (err,doc) {
        if(err){
            console.log(err)
        }
        async.eachLimit(doc,1,function (item,cb) {
            let tempArr = new Array()
            tempArr.push(item.xuhao)
            tempArr.push(item.xiangmumingcheng)
            tempArr.push(item.danweimingcheng)
            tempArr.push(item.lixiangniandu)
            tempArr.push(item.zaitileixing)
            tempArr.push(item.gongsidizhi)
            data.push(tempArr)
            delete tempArr
            cb()
        },function (err) {
            if(err){
                console.log(err)
            }
            let buffer = xlsx.build([
                {
                    name:'sheet1',
                    data:data
                }
            ]);
            console.log(data)
            fs.writeFileSync('fuhuaqi.xlsx',buffer,{'flag':'w'});   //生成excel
        })
    })
}
exports.exportExcel_baiqiangmingdan = function () {
    console.log('ddd')
    let data = new Array()
    let search = baiqiangmingdan.find({})
    search.exec(function (err,doc) {
        if(err){
            console.log(err)
        }
        async.eachLimit(doc,1,function (item,cb) {
            let tempArr = new Array()
            tempArr.push(item.xuhao)
            tempArr.push(item.gongsimingcheng)
            tempArr.push(item.quyu)
            tempArr.push(item.hangye)
            tempArr.push(item.gongsidizhi)
            data.push(tempArr)
            delete tempArr
            cb()
        },function (err) {
            if(err){
                console.log(err)
            }
            let buffer = xlsx.build([
                {
                    name:'sheet1',
                    data:data
                }
            ]);
            console.log(data)
            fs.writeFileSync('baiqiangmingdan.xlsx',buffer,{'flag':'w'});   //生成excel
        })
    })
}

