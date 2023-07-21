const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//字符串单图格式化
const getSingleImgUrl = (string) => {
  let url
  if (string) {
    return getApp().globalData.imgurl + string
  }
  else {
    return '/assets/images/personal/mrtx.png'
  }
}
//[{type：'',url:''}]单图格式化
const getImgUrl = (obj) => {
  let arr
  if (typeof (obj) == 'string') {
    arr = JSON.parse(obj)
  }
  else {
    arr = obj
  }
  if (arr.length) {
    console.log(getApp().globalData.imgurl,333)
    return getApp().globalData.imgurl + arr[0].url
  }
  else {
    return '/assets/images/personal/mrtx.png'
  }
}
//多图格式化为[{type：'',url:''}]
const getTypeImgsUrl = (obj,type) => {
  if (!obj) return ['/assets/images/personal/mrtx.png']
  let arr
  if (typeof (obj) == 'string') {
    arr = JSON.parse(obj)
  }
  else {
    arr = obj
  }
  for (let i = 0; i < arr.length; i++) {
    console.log(arr)
    console.log(getApp().globalData.imgurl)
    arr[i].url = getApp().globalData.imgurl + arr[i].url
  }
  if (arr.length) {
    return arr
  }
  else if(type=='empty'){
    return []
  }
  else {
    return [{type:'img',url:''}]
  }
}
//多图格式化
const getImgsUrl = (obj) => {
  if (!obj) return ['/assets/images/personal/mrtx.png']
  let arr
  if (typeof (obj) == 'string') {
    arr = JSON.parse(obj)
  }
  else {
    arr = obj
  }
  for (let i = 0; i < arr.length; i++) {
    arr[i] = getApp().globalData.imgurl + arr[i].url
  }
  if (arr.length) {
    return arr
  }
  else {
    return ['/assets/images/personal/mrtx.png']
  }
}
//多维数组判断是否存在某值
const ifArrVal = function(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].userId == value) {
            return i; //存在
            break
        }
    }
    return false; //不存在
}
// 检测是否是富文本
const checkHtml = function(htmlStr) {
    var reg = /<[^>]+>/g;
    return reg.test(htmlStr);
}
// 验证手机号
const isTelCode = (str) => {
  var reg = /^(\d{6,})$/;
  // /^[1]\d{10}$/
    return reg.test(str);
    console.log(reg.test(str))
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
// 验证身份证号
const isSfCode = (str) => {
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(str);
  console.log(reg.test(str))
}
// 时间戳与当前时间判断
const Timesize = (time) => {
    var now = new Date();
    var date = new Date(time);
    if (date > now) {
        return true
    } else {
        return false
    }
}
//判断添加标签
const testbq = (str, num) => {
    var arr = str.split(" "),
        newarr = [];
    for (let i in arr) {
        if (arr[i] != '') {
            newarr.push(arr[i])
        }
    };
    // console.log(str,arr,newarr)
    if (newarr.length <= num) {
        return newarr
    } else {
        return false
    }
}
//判断字符合法
const isNull = (str) => {
    if (str == "" || str == null) return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}
//选择位置
const chooseLocation = (option) => {
    var that = this;
    wx.chooseLocation({
        success: function(res) {
            // console.log(res)
            option.success(res)
        },
        fail: function() {
            wx.getSetting({
                success: (res) => {
                    var authSetting = res.authSetting
                    if (authSetting['scope.userLocation'] == false) {
                      wx.showModal({
                        title: '提示',
                        content: '您暂未授权位置信息无法正常使用,请在（右上角 - 关于 - 右上角 - 设置）中开启位置信息授权后，即可正常使用',
                        success: function (res) {
                        }
                      })
                    }
                }
            })
        },
    })
    // wx.getSetting({
    //   success: function (res) {
    //     console.log(res)
    //     if (res.authSetting['scope.userLocation']) {
    //       wx.chooseLocation({
    //         success: function (res) {
    //           console.log(res)
    //           option.success(res)
    //         },
    //         complete: function (res) {
    //           console.log(res)
    //         },
    //       })
    //     }
    //     else {
    //       console.log('未授权过')
    //     }
    //   }
    // })
}
// 编码
const encodeUnicode = (str) => {
    var res = [];
    for (var i = 0; i < str.length; i++) {
        res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return "\\u" + res.join("\\u");
}
// 解码
const decodeUnicode = (str) => {
    str = str.replace(/\\/g, "%");
    return unescape(str);
}
// 秒换算时分秒
const formatSeconds = (value) => {
    var theTime = parseInt(value); // 秒 
    var theTime1 = 0; // 分 
    var theTime2 = 0; // 小时 
    // alert(theTime); 
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        // alert(theTime1+"-"+theTime); 
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    // var result = "" + parseInt(theTime) + "秒";
    var result = '1分钟'
    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分钟";
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
    }
    return result;
}
// 获取用户当前地理位置并转换其所在城市
const getLocation = (option) => {
  var that = this,
        timestamp = Date.parse(new Date()),
        firstdwtime = wx.getStorageSync('firstdwtime'),
        gdlocation = getApp().globalData.gdlocation;
    // console.log(option, timestamp, firstdwtime, firstdwtime + 300 * 1000, gdlocation)
    if (option.type == '0' && gdlocation && timestamp < (firstdwtime + 300 * 1000)) {
        option.success(gdlocation)
        return
    }
    console.log(getApp().system.mapKey,33333333333333)
    var QQMapWX = require('qqmap-wx-jssdk.js'),
    demo = new QQMapWX({key: getApp().system.mapKey});
    new Promise((resolve, reject) => {
    let haveget=false
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        haveget = true
        console.log('定位信息', res)
        resolve(res)
      },
      fail: function (res) {
        console.log('getlcfail', res)
        // console.log(getApp().globalData.city)
        reject({ latitude: getApp().globalData.dZone.lat, longitude: getApp().globalData.dZone.lng })
        wx.getSetting({
          success: (res) => {
            var authSetting = res.authSetting
            if (authSetting['scope.userLocation'] == false) {
              wx.openSetting({
                success: function success(res) { }
              });
            }
          }
        })
      }
    })
    setTimeout(() => {
      console.log(haveget)
      if (haveget) {
        console.log('取到值了')
      }
      else {
        console.log('getovertime')
        reject({ latitude: getApp().globalData.dZone.lat, longitude: getApp().globalData.dZone.lng})
      }
    }, 3000)
  }).then((res)=>{
    // console.log('resolve',res)
    wx.setStorageSync('Location', res)
    getApp().globalData.gdlocation = res
    wx.setStorageSync('firstdwtime', timestamp)
    let latitude = Number(res.latitude),longitude = Number(res.longitude)
    if (option.type == '1') {
      // 调用接口
      demo.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function (res) {
          // console.log(res);
          option.success(res)
        },
        fail: function (res) {
          // console.log(res);
          option.fail(res)
        },
        // complete: function (res) {
        //   // console.log(res);
        // }
      });
    } else if (option.type == '0') {
      option.success(res)
    } else if (option.type == '2') {
      demo.calculateDistance({
        mode: "driving",
        from: {
          latitude: latitude + '',
          longitude: longitude + ''
        },
        to: [{
          latitude: option.latitude,
          longitude: option.longitude
        }],
        success: function (res) {
          console.log(res);
          option.success(res)
        },
      });
    }
  }).catch((res) => {
    console.log('reject', res)
    wx.setStorageSync('Location', res)
    getApp().globalData.gdlocation = res
    wx.setStorageSync('firstdwtime', timestamp)
    let latitude = Number(res.latitude),longitude = Number(res.longitude)
    console.log(latitude,longitude)
    if (option.type == '1') {
      // 调用接口
      demo.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function (res) {
          console.log(res);
          option.success(res)
        },
        fail: function (res) {
          // console.log(res);
          option.fail(res)
        },
      });
    } else if (option.type == '0') {
      option.success(res)
    } else if (option.type == '2') {
      demo.calculateDistance({
        mode: "driving",
        from: {
          latitude: latitude + '',
          longitude: longitude + ''
        },
        to: [{
          latitude: option.latitude,
          longitude: option.longitude
        }],
        success: function (res) {
          console.log(res);
          option.success(res)
        },
      });
    }
  }) 
}
// 获取实时天气数据
const getmyAmapFun = (option) => {
    var that = this;
    var amapFile = require('amap-wx.js');
    var myAmapFun = new amapFile.AMapWX({
        key: getApp().system.gdKey
    });
    myAmapFun.getWeather({
        success: function(data) {
            // console.log(data)
            option.success(data)
            //成功回调
        },
        fail: function(info) {
            //失败回调
            // console.log(info)
        }
    })
}
// 拨打电话
const makePhoneCall = (e) => {
    wx.makePhoneCall({
        phoneNumber: e,
    })
}
// 根据经纬度查看位置
const openlocation = (option) => {
    wx.openLocation({
        latitude: Number(option.latitude),
        longitude: Number(option.longitude),
        name: option.name,
        address: option.address,
        scale: 18,
        success: res => {},
        fail: res => {}
    })
}
const bg1 = (e) => {
    var color = [
        '#40aee3', "#56a564", "#f38761", '#a0ba5d', '#d06493', '#b08cb7', '#7da89c', '#816df4', '#c29a9e', '#3672af'
    ]
    //   return color[Math.floor(Math.random() * 10 + 1)]
    return color[e]
}
// showmodel弹框
const getShowmodel = (e) => {
    wx.showModal({
        title: '温馨提示',
        content: e,
    })
}
// showtoast弹框
const getShowtoast = (e,d,i) => {
    wx.showToast({
        title: e,
        icon: i ? i==2 ? 'none' : 'loading' :'success',
        mask: !0,
        duration:d||1000,
    })
}
// showLoading弹框
const getShowloading = (e) => {
  wx.showLoading({
    title: e || '加载中...',
    mask: !0,
  })
}
// 1s返回
const swnb=(d)=>{
  setTimeout(() => {
    wx.navigateBack({
      delta:d||1
    })
  }, 1000)
}
// 设备信息
const getPhoneInfo = (cb) => {
  if (getApp().phoneInfo) {
    cb && cb(getApp().phoneInfo)
  }
  else {
    wx.getSystemInfo({
      success(res) {
        getApp().phoneInfo = res
        cb && cb(res)
      }
    })
  }
}
/**/
// 计算当前时间是多少天前
const settime = (timestamp) => {
    // 补全为13位
    var arrTimestamp = (timestamp + '').split('');
    for (var start = 0; start < 13; start++) {
        if (!arrTimestamp[start]) {
            arrTimestamp[start] = '0';
        }
    }
    timestamp = arrTimestamp.join('') * 1;

    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - timestamp;
    // 如果本地时间反而小于变量时间
    if (diffValue < 0) {
        return '不久前';
    }

    // 计算差异时间的量级
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;

    // 数值补0方法
    var zero = function(value) {
        if (value < 10) {
            return '0' + value;
        }
        return value;
    };

    // 使用
    if (weekC >=1) {
        // 超过1年，直接显示年月日
        return (function() {
          var date = new Date(timestamp), nowYear = new Date().getFullYear();
          if (weekC >= 1 && nowYear == date.getFullYear()) {
            return zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
          } else {
            return date.getFullYear() + '年' + zero(date.getMonth() + 1) + '月' + zero(date.getDate()) + '日';
          }
        })();
    } else if (monthC >= 1) {
        return parseInt(monthC) + "月前";
    } else if (weekC >= 1) {
        return parseInt(weekC) + "周前";
    } else if (dayC >= 1) {
        return parseInt(dayC) + "天前";
    } else if (hourC >= 1) {
        return parseInt(hourC) + "小时前";
    } else if (minC >= 1) {
        return parseInt(minC) + "分钟前";
    }
    return '刚刚';
}
// 查看当前时间是周几
const getWeek = (e) => {
    var d = new Date();
    var str = ''
    switch (d.getDay()) {
        case 0:
            str = "日";
            break;
        case 1:
            str = "一";
            break;
        case 2:
            str = "二";
            break;
        case 3:
            str = "三";
            break;
        case 4:
            str = "四";
            break;
        case 5:
            str = "五";
            break;
        case 6:
            str = "六";
            break;
    }
    return str
}
// -----------------------------时间戳转换日期时分秒--------------------------------
const ormatDate = function(dateNum) {
    var date = new Date(dateNum * 1000);
    return date.getFullYear() + "-" + fixZero(date.getMonth() + 1, 2) + "-" + fixZero(date.getDate(), 2) + " " + fixZero(date.getHours(), 2) + ":" + fixZero(date.getMinutes(), 2) + ":" + fixZero(date.getSeconds(), 2);

    function fixZero(num, length) {
        var str = "" + num;
        var len = str.length;
        var s = "";
        for (var i = length; i-- > len;) {
            s += "0";
        }
        return s + str;
    }
}
// -----------------------------日期转换时间戳--------------------------------
const ormatTime = function (date) {
  var date = Math.round((new Date(date)).getTime()/1000);
  return date
}
// 获取当前日期
const today = function() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
//
const where = (array, obj) => {
  const keys = Object.keys(obj);
  let arr = array.filter(m => {
    return keys.every(key => m.hasOwnProperty(key) && m[key] === obj[key]);
  });
  if (arr.length > 0) {
    return arr[0]
  }
  else {
    return false
  }
}
const goUrl = (option) => {
  console.log(option)
  let url, type;
  if(option){
    type = option.t || '1'
    switch (option.value) {
      case 'location':
        url = '/pages/location/index?city=' + option.param;
        break;
      case 'help':
        url = '/pages/personal/help/index';
        break;
      case 'postCategory':
        url = '/pages/publish/post/list?id=' + option.param;
        break;
      case 'yellowCategory':
        url = '/pages/yellow/gategorylist?id=' + option.param;
        break;
      case 'businessCategory':
        url = '/pages/store/storelist/storelist?id=' + option.param;
        break;
      case 'newsCategory':
        url = '/pages/message/nav/index?id=' + option.param;
        break;
      case 'postInfo':
        url = '/pages/publish/post/infomation/index?id=' + option.param;
        break;
      case 'businessInfo':
        url = '/pages/store/storemain/storedetail?id=' + option.param;
        break;
      case 'newsInfo':
        url = '/pages/message/info/index?id=' + option.param;
        break;
      case 'typelist':
        url = '/pages/extra/typelist?param=' + JSON.stringify(option.param);
        break;
      case 'call':
        makePhoneCall(option.param.phone)
        break;
      case 'shopCategory':
        url = '/pages/mall/categoryson?param=' + JSON.stringify(option.param);
        break;
      case 'mallDetail':
        url = '/pages/mall/detail?id=' + option.param;
        break;
      case 'activityCategory':
        url = '/pages/activity/category?id=' + option.param;
        break;
      case 'groupCategory': 
        url = '/pages/assemble/categoryson?param=' + JSON.stringify(option.param);
        break; 
      case 'liveBroadcast':
        url = '/pages/personal/live/index';
        break;
      case 'miniTarget':
        if (option.param.appId) {
          type = '4'
        }
        url = option.param.path || '';
        if (url.indexOf('homepage') > -1 && url.indexOf('user_id') == -1){
          url = url + '?user_id=' +getApp().globalData.userInfo.id
        }
        break;
    }
    //url/type赋值
    if (option.value == 'singlePage'){
      console.log(changeUrl(option))
      url = changeUrl(option)
      type='1'
      if (option.param =='index'){
        type='3'
      }
    }
    else if (option.value == 'link'){
      type = '1'
      wx.setStorageSync('vr', option.category)
      url = '/pages/extra/link'
    }
    //跳转类型 
    if (type == '1') {
      wx.navigateTo({
        url: url,
      })
    }
    else if (type == '3') {
      wx.reLaunch({
        url: url,
      })
    }
    else if (type == '4') {
      wx.navigateToMiniProgram({
        appId: option.param.appId,
        path: url
        //  extraData: {
        //   foo: 'bar'
        // },
        // envVersion: 'develop',
      })
    }
  }
  else{
    getShowtoast('跳转路径无效',1000,1)
  }
  console.log(url, type)
}
const changeUrl = (option) => {
  let url
  if (option.value == 'singlePage') {
    switch (option.param) {
      case 'index':
        url = '/pages/index/index'
        break;
      case 'post':
        url = '/pages/publish/post/index'
        break;
      case 'put':
        url = '/pages/publishtype/publishtype'
        break;
      case 'business':
        url = '/pages/store/storemain/storemain'
        break;
      case 'news':
        url = '/pages/message/index/index'
        break;
      case 'userCenter':
        url = '/pages/personal/index'
        break;
      case 'businessJoin':
        url = '/pages/store/storeentry/storeentry'
        break;
      case 'storeRank':
        url = '/pages/store/storelist/storerank'
        break;
      case 'task':
        url = '/pages/sign/task'
        break;
      case 'sign':
        url = '/pages/sign/index'
        break;
      case 'yellow':
        url = '/pages/yellow/index'
        break;
      case 'integralShop':
        url = '/pages/personal/integral/integralmall/index'
        break;
      case 'car':
        url = '/pages/freeride/index'
        break;
      case 'job':
        url = '/pages/jobhunt/index'
        break;
      case 'shop':
        url = '/pages/mall/index'
        break;
      case 'renting':
        url = '/pages/housingdeal/index'
        break;
      case 'activity':
        url = '/pages/activity/index'
        break;
      case 'superCard':
        url = '/pages/businesscard/index'
        break;
      case 'vip':
        url = '/pages/vip/index'
        break;
      case 'group':
        url = '/pages/assemble/index'
        break;
      case 'coupon':
        url = '/pages/coupon/index'
        break;
      case 'bargain':
        url = '/pages/bargain/index'
        break;
      case 'rush':
        url = '/pages/rushbuy/index'
        break;
      case 'customerService':
        url = '/pages/personal/service'
        break;
      case 'helpCenter':
        url = '/pages/personal/help/index'
        break;
      case 'liveBroadcast':
        url = '/pages/personal/live/index'
        break;
        case 'zan':
        url = '/pages/personal/live/index'
        break;
    }
    return url
  }
}
const calculateDiffTime=(start_time, end_time)=> {
  if (start_time.toString().length>10){
    start_time=parseInt(start_time/1000)
    end_time = parseInt(end_time / 1000)
  }
  var startTime = 0, endTime = 0
  if (start_time < end_time) {
    startTime = start_time
    endTime = end_time
  } else {
    startTime = end_time
    endTime = start_time
  }
  // //计算天数
  var timeDiff = endTime - startTime
  var year = Math.floor(timeDiff / 86400 / 365);
  timeDiff = timeDiff % (86400 * 365);
  var month = Math.floor(timeDiff / 86400 / 30);
  timeDiff = timeDiff % (86400 * 30);
  var day = Math.floor(timeDiff / 86400);
  timeDiff = timeDiff % 86400;
  var hour = Math.floor(timeDiff / 3600);
  timeDiff = timeDiff % 3600;
  var minute = Math.floor(timeDiff / 60);
  timeDiff = timeDiff % 60;
  var second = timeDiff;
  return [year, month, day, hour, minute, second]

  // var timeDiff = endTime - startTime
  // var hour = Math.floor(timeDiff / 3600);
  // timeDiff = timeDiff % 3600;
  // var minute = Math.floor(timeDiff / 60);
  // timeDiff = timeDiff % 60;
  // var second = timeDiff;
  // return [hour, minute, second]
}
module.exports = {
    formatTime: formatTime,
    settime: settime,
    getWeek: getWeek,
    getImgUrl: getImgUrl,
    getImgsUrl: getImgsUrl,
    getSingleImgUrl: getSingleImgUrl,
    getTypeImgsUrl: getTypeImgsUrl,
    ormatDate: ormatDate,
  ormatTime: ormatTime,
    today: today,
    getLocation: getLocation,
    getmyAmapFun: getmyAmapFun,
    makePhoneCall: makePhoneCall,
    openlocation: openlocation,
    getShowmodel: getShowmodel,
    bg1: bg1,
    chooseLocation: chooseLocation,
    isNull: isNull,
    Timesize: Timesize,
    testbq: testbq,
    isTelCode: isTelCode,
    ifArrVal: ifArrVal,
    encodeUnicode: encodeUnicode,
    decodeUnicode: decodeUnicode,
    formatSeconds: formatSeconds,
    getShowtoast: getShowtoast,
    getShowloading: getShowloading,
    swnb: swnb,
    checkHtml: checkHtml,
    isSfCode: isSfCode,
  formatNumber: formatNumber,
  where: where,
  goUrl: goUrl,
  changeUrl: changeUrl,
  calculateDiffTime: calculateDiffTime,
  getPhoneInfo,
}