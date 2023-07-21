var util = {};
/**
	构造baseurl地址, 
*/
util.url = function (action, querystring) {
  var app = getApp();
  var url = app.setInfo.siteroot
  if (action) {
    url += action
  }
  if (querystring && typeof querystring === 'object') {
    for (let param in querystring) {
      if (param && querystring.hasOwnProperty(params) && querystring[param]) {
        url += param + '=' + querystring[param] + '&';
      }
    }
  }
  return url;
}
/**
	二次封装微信wx.request函数、增加交互体全、配置缓存、以及格式化返回数据

	@params option 弹出参数表，
	{
		url : 同微信,
		data : 同微信,
		header : 同微信,
		method : 同微信,
		success : 同微信,
		fail : 同微信,
		complete : 同微信,
		cachetime : 缓存周期，在此周期内不重复请求http，默认不缓存
	}
*/
util.request = function (option) {
  // var _ = require('underscore.js');
  var cache = require('cache.js');
  var app = getApp();
  var option = option ? option : {};
  option.cachetime = option.cachetime ? option.cachetime : 0;
  // option.showLoading = typeof option.showLoading != 'undefined' ? option.showLoading : true;

  // var sessionid = wx.getStorageSync('userInfo').sessionid;
  var url = option.url;
  if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
    url = util.url(url);
  }
  // var state = getUrlParam(url, 'state');
  // if (!state && !(option.data && option.data.state) && sessionid) {
  //   url = url + '&state=we7sid-' + sessionid
  // }
  // if (!option.data || !option.data.m) {
  //   var nowPage = getCurrentPages();

  //   if (nowPage.length) {
  //     nowPage = nowPage[getCurrentPages().length - 1];
  //     if (nowPage && nowPage.__route__) {
  //       url = url + '&m=' + nowPage.__route__.split('/')[0];
  //     }
  //   }
  // }

  // var sign = getSign(url, option.data);
  // if (sign) {
  //   url = url + "&sign=" + sign;
  // }
  // if (!url) {
  //   return false;
  // }
  // wx.showNavigationBarLoading();
  if (option.showLoading) {
    util.showLoading();
  }
  if (option.cachetime) {
    var cachekey = cache(url);
    var cachedata = wx.getStorageSync(cachekey);
    var timestamp = Date.parse(new Date());

    if (cachedata && cachedata.data) {
      if (cachedata.expire > timestamp) {
        if (option.complete && typeof option.complete == 'function') {
          option.complete(cachedata);
        }
        if (option.success && typeof option.success == 'function') {
          option.success(cachedata);
        }
        // console.log('cache:' + url);
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        return true;
      } else {
        wx.removeStorageSync(cachekey)
      }
    }
  }
  // console.log(url)
  wx.request({
    'url': url,
    'data': option.data ? option.data : {},
    'header': option.header ? option.header : {},
    'method': option.method ? option.method : 'GET',
    'header': {
      'content-type': 'application/x-www-form-urlencoded',
      "zh-appid": app.setInfo.appid,
      "zh-type": 'mini',
      "zh-city-id": app.globalData.city.cityId,
      "zh-zone-id": app.globalData.city.zoneId,
      "zh-session-key": wx.getStorageSync('sessionKey')
    },
    'success': function (response) {
      // wx.hideNavigationBarLoading();
      // wx.hideLoading();
      // if (response.data.errno) {
      //   if (response.data.errno == '41009') {
      //     wx.setStorageSync('userInfo', '');
      //     util.getUserInfo(function () {
      //       util.request(option)
      //     });
      //     return;
      //   } else {
      //     if (option.fail && typeof option.fail == 'function') {
      //       option.fail(response);
      //     } else {
      //       if (response.data.message) {
      //         if (response.data.data != null && response.data.data.redirect) {
      //           var redirect = response.data.data.redirect;
      //         } else {
      //           var redirect = '';
      //         }
      //         app.util.message(response.data.message, redirect, 'error');
      //       }
      //     }
      //     return;
      //   }
      // } else {

      if (option.success && typeof option.success == 'function') {
        option.success(response);
      }
      //写入缓存，减少HTTP请求，并且如果网络异常可以读取缓存数据
      if (option.cachetime) {
        var cachedata = {
          'data': response.data,
          'expire': timestamp + option.cachetime * 1000
        };
        wx.setStorageSync(cachekey, cachedata);
      }
      // }
    },
    'fail': function (response) {
      // wx.hideNavigationBarLoading();
      // wx.hideLoading();

      //如果请求失败，尝试从缓存中读取数据
      var cache = require('cache.js');
      var cachekey = cache(url);
      var cachedata = wx.getStorageSync(cachekey);
      if (cachedata && cachedata.data) {
        if (option.success && typeof option.success == 'function') {
          option.success(cachedata);
        }
        // console.log('failreadcache:' + url);
        return true;
      } else {
        if (option.fail && typeof option.fail == 'function') {
          option.fail(response);
        }
      }
    },
    'complete': function (response) {
      if (response.data.black) {
        wx.showModal({
          title: '提示',
          content: '您已被限制登录，请联系管理员处理',
          success(res) {
            wx.reLaunch({
              url: '/pages/personal/noresult',
            })
          }
        })
      }
      // wx.hideNavigationBarLoading();
      // wx.hideLoading();
      if (option.complete && typeof option.complete == 'function') {
        option.complete(response);
      }
    }
  });
}
util.prequest = function (option) {
  var cache = require('cache.js');
  var app = getApp();
  var option = option ? option : {};
  option.cachetime = option.cachetime ? option.cachetime : 0;
  var url = option.url;
  if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
    url = util.url(url);
  }
  if (option.showLoading) {
    wx.showLoading({
      title: '加载中...',
    })
  }
  return new Promise((resolve, reject) => {
    if (option.cachetime) {
      var cachekey = cache(url);
      var cachedata = wx.getStorageSync(cachekey);
      var timestamp = Date.parse(new Date());

      if (cachedata && cachedata.data) {
        if (cachedata.expire > timestamp) {
          // if (option.complete && typeof option.complete == 'function') {
          //   option.complete(cachedata);
          // }
          // if (option.success && typeof option.success == 'function') {
          //   option.success(cachedata);
          // }
          resolve(cachedata.data)
          console.log('cache:' + url);
          wx.hideLoading();
          wx.hideNavigationBarLoading();
          return true;
        } else {
          wx.removeStorageSync(cachekey)
        }
      }
    }
    // console.log(url)
    wx.request({
      'url': url,
      'data': option.data ? option.data : {},
      'method': option.method ? option.method : 'GET',
      'header': {
        'content-type': 'application/x-www-form-urlencoded',
        "zh-appid": app.setInfo.appid,
        "zh-type": 'mini',
        "zh-city-id": app.globalData.city.cityId,
        "zh-zone-id": app.globalData.city.zoneId,
        "zh-session-key": wx.getStorageSync('sessionKey')
      },
      'success': function (response) {
        resolve(response.data)
        //写入缓存，减少HTTP请求，并且如果网络异常可以读取缓存数据
        if (option.cachetime) {
          var cachedata = {
            'data': response.data,
            'expire': timestamp + option.cachetime * 1000
          };
          wx.setStorageSync(cachekey, cachedata);
        }
      },
      'fail': function (response) {
        //如果请求失败，尝试从缓存中读取数据
        var cache = require('cache.js');
        var cachekey = cache(url);
        var cachedata = wx.getStorageSync(cachekey);
        if (cachedata && cachedata.data) {
          resolve(cachedata.data)
          // console.log('failreadcache:' + url);
          return true;
        } else {
          reject(response.data)
        }
      },
      'complete': function (response) {
        wx.hideLoading();
        if (response.data.black) {
          wx.showModal({
            title: '提示',
            content: '您已被限制登录，请联系管理员处理',
            success(res) {
              wx.reLaunch({
                url: '/pages/personal/noresult',
              })
            }
          })
        }
      }
    });
  })
}
util.wxUploadImg = (imgarr) => {
  return new Promise((resolve, reject) => {
    util.uploadimg({
      imgarr,
      success: res => {
        resolve(res)
      }
    })
  })
}
util.uploadimg = (option) => {
  var imgArray = [], app = getApp();
  function img(filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: getApp().setInfo.siteroot + '/city/api/common/api_upload',
        filePath: filePath,
        name: 'upfile',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          "zh-appid": app.setInfo.appid,
          "zh-type": 'mini',
          "zh-city-id": app.globalData.city.cityId,
          "zh-zone-id": app.globalData.city.zoneId,
          "zh-session-key": wx.getStorageSync('sessionKey')
        },
        formData: null,
        complete: (resp) => {
          if (JSON.parse(resp.data).code != 0) {
            resolve({
              "type": "img",
              "url": resp.data && JSON.parse(resp.data).src || ''
            })
          } else {
            reject()
            option.fail&&option.fail()
            wx.showToast({
              icon: "none",
              title: JSON.parse(resp.data).msg
            })
          }
        }
      });
    })
  }
  for (let item of option.imgarr) {
    if (item.type) {
      imgArray.push(new Promise((resolve, reject) => {
        resolve({
          "type": "img",
          "url": item.url.substring(app.system.url.length)
        })
      }))
    }
    else{
      imgArray.push(img(item.url))
    }
  }
  Promise.all(imgArray).then(res => {
    option.success(res);
    console.log('111111', res)
  })
  // uploadimg({
  //   url: getApp().setInfo.siteroot + '/city/api/common/api_upload',
  //   path: option.imgarr
  // });

  // function uploadimg(data) {
  //   var i = data.i ? data.i : 0,
  //     success = data.success ? data.success : 0,
  //     fail = data.fail ? data.fail : 0;
  //   wx.uploadFile({
  //     url: data.url,
  //     filePath: data.path[i].url,
  //     name: 'upfile',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded',
  //       "zh-appid": app.setInfo.appid,
  //       "zh-type": 'mini',
  //       "zh-city-id": app.globalData.city.cityId,
  //       "zh-zone-id": app.globalData.city.zoneId,
  //       "zh-session-key": wx.getStorageSync('sessionKey')
  //     },
  //     formData: null,
  //     success: (resp) => {
  //       if (resp.data != '') {
  //         // console.log(JSON.parse(resp.data))
  //         success++;
  //         imgArray.push({
  //           "type": "img",
  //           "url": JSON.parse(resp.data).src
  //         })
  //         console.log(i);
  //         console.log('图片数组', imgArray)
  //       } else {
  //         wx.showToast({
  //           icon: "loading",
  //           title: "请重试"
  //         })
  //       }
  //     },
  //     fail: (res) => {
  //       fail++;
  //       console.log('fail:' + i + "fail:" + fail);
  //     },
  //     complete: () => {
  //       console.log(i);
  //       i++;
  //       if (i == data.path.length) {
  //         // that.setData({
  //         //   images: data.path
  //         // });
  //         wx.hideToast();
  //         console.log('执行完毕');
  //         option.success(imgArray);
  //         console.log('成功：' + success + " 失败：" + fail);
  //       } else {
  //         // console.log(i);
  //         data.i = i;
  //         data.success = success;
  //         data.fail = fail;
  //         uploadimg(data);
  //       }

  //     }
  //   });
  // }
}
util.uploadvideo = (option) => {
  var videoarr = [], app = getApp()
  uploadvideo({
    url: getApp().setInfo.siteroot + '/city/api/common/api_upload?makePreview=1',
    path: option.videoarr
  });

  function uploadvideo(data) {
    var i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'upfile',
      formData: {
        'makePreview': '1'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "zh-appid": app.setInfo.appid,
        "zh-type": 'mini',
        "zh-city-id": app.globalData.city.cityId,
        "zh-zone-id": app.globalData.city.zoneId,
        "zh-session-key": wx.getStorageSync('sessionKey')
      },
      formData: null,
      success: (resp) => {
        if (resp.data != '') {
          //  console.log(JSON.parse(resp.data))
          success++;
          videoarr.push({
            "type": "video",
            "url": JSON.parse(resp.data).src,
            'preview': JSON.parse(resp.data).preview,
          })
          // console.log(i);
          // console.log('图片数组', videoarr)
        } else {
          wx.showToast({
            icon: "loading",
            title: "请重试"
          })
        }
      },
      fail: (res) => {
        fail++;
        // console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        // console.log(i);
        i++;
        if (i == data.path.length) {
          // that.setData({
          //   images: data.path
          // });
          wx.hideToast();
          // console.log('执行完毕');
          option.success(videoarr);
          // console.log('成功：' + success + " 失败：" + fail);
        } else {
          // console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          uploadvideo(data);
        }

      }
    });
  }
}
//layout配置
util.layout = (cb) => {
  var app = getApp();
  util.request({
    'url': app.url.layout,
    success: res => {
      if (res.data.data) {
        // console.log(res)
        let layout = res.data.data
        for (let i = 0; i < layout.page.length; i++) {
          if (layout.page[i].cmpName == 'tabGroup') {
            for (let j in layout.page[i].config.tabList) {
              layout.page[i].config.tabList[j].name = layout.page[i].config.tabList[j].title
              layout.page[i].config.tabList[j].id = j
            }
          }
        }
        getApp().layout = layout
        cb(layout)
      }
      else {
        getApp().layout = null
        cb(res.data.data)
      }
      getApp().globalData.navbar = null
    },
    fail: res => {
      console.log('layoutfail', res)
    }
  })
}
//post配置
util.postconfig = (cb) => {
  var app = getApp();
  util.request({
    'url': app.url.post_config,
    'cachetime': '30',
    success: function (res) {
      // console.log(res)
      if (res.data.data.field == '') {
        res.data.data.field = '信息'
      }
      wx.setStorageSync('postinfo', res.data.data)
      cb(res.data.data)
    },
  })
}
//store配置
util.storeconfig = (cb) => {
  var app = getApp();
  util.request({
    'url': app.url.store_config,
    'cachetime': '30',
    success: function (res) {
      // console.log(res)
      if (res.data.data.field == '') {
        res.data.data.field = '商家'
      }
      wx.setStorageSync('storeinfo', res.data.data)
      cb(res.data.data)
    },
  })
}
//information配置
util.infomationconfig = (cb) => {
  var app = getApp();
  util.request({
    'url': app.url.infomation_config,
    'cachetime': '30',
    success: function (res) {
      // console.log('information配置',res)
      if (res.data.data.field == '') {
        res.data.data.field = '同城资讯'
      }
      wx.setStorageSync('infomation', res.data.data)
      cb(res.data.data)
    },
  })
}
//system配置
util.system = (cb) => {
  var app = getApp(), info = app.system;
  // console.log(info)
  if (info) { cb(info) }
  else {
    util.request({
      'url': app.url.system,
      'cachetime': '30',
      success: function (res) {
        app.system = res.data.data
        // console.log(res)
        cb(res.data.data)
      },
    })
  }
}
//认证设置
util.identSet = (cb) => {
  var app = getApp();
  util.request({
    'url': app.url.identSet,
    'cachetime': '30',
    success: function (res) {
      // console.log(res)
      cb(res.data.data)
    },
  })
}
//余额设置
util.billSite = (cb) => {
  var app = getApp();
  util.request({
    'url': app.url.billSite,
    'cachetime': '30',
    success: function (res) {
      // console.log(res)
      cb(res.data.data)
    },
  })
}
//优惠券配置
util.coupon = (cb) => {
  var app = getApp(), info = app.coupon;
  if (info) { cb && cb(info) }
  else {
    util.prequest({
      'url': app.url.couponSet,
    }).then(res => {
      app.coupon = res.data
      cb && cb(res.data)
    })
  }
}
//名片配置
util.businesscard = (cb) => {
  var app = getApp(), info = app.businesscard;
  if (info) { cb && cb(info) }
  else {
    util.prequest({
      'url': app.url.businesscardSet,
    }).then(res => {
      app.businesscard = res.data
      cb && cb(res.data)
    })
  }
}
//同城活动配置
util.activity = (cb) => {
  var app = getApp(), info = app.activity;
  if (info) { cb && cb(info) }
  else {
    util.prequest({
      'url': app.url.activitySet,
    }).then(res => {
      app.activity = res.data
      cb && cb(res.data)
    })
  }
}
//房屋租售配置
util.housingdeal = (cb) => {
  var app = getApp(), info = app.housingdeal;
  if (info) { cb && cb(info) }
  else {
    util.prequest({
      'url': app.url.housRenting,
    }).then(res => {
      app.housingdeal = res.data
      cb && cb(res.data)
    })
  }
}
//求职招聘配置
util.jobhunt = (cb) => {
  var app = getApp(), info = app.jobhunt;
  if (info) { cb && cb(info) }
  else {
    util.prequest({
      'url': app.url.jobSet,
    }).then(res => {
      app.jobhunt = res.data
      cb && cb(res.data)
    })
  }
}
//顺风车配置
util.freeCar = (cb) => {
  var app = getApp(), info = app.freeCar;
  if (info) { cb && cb(info) }
  else {
    util.prequest({
      'url': app.url.freeCarSet,
    }).then(res => {
      app.freeCar = res.data
      // console.log(res)
      cb && cb(res.data)
    })
  }
}
//黄页配置
util.yellow = (cb) => {
  var app = getApp(), info = app.yellow;
  if (info) { cb && cb(info) }
  else {
    util.prequest({
      'url': app.url.yellowConfig,
    }).then(res => {
      app.yellow = res.data
      // console.log(res)
      cb && cb(res.data)
    })
  }
}
//商城配置
util.mall = (cb) => {
  var app = getApp(), info = app.mall;
  if (info) { cb && cb(info) }
  else {
    util.prequest({
      'url': app.urlTwo.mallConfig,
    }).then(res => {
      app.mall = res.data
      // console.log(res)
      cb && cb(res.data)
    })
  }
}
//会员卡配置
util.vip = (cb) => {
  var app = getApp(), info = app.vip;
  if (info) { cb && cb(info) }
  else {
    util.prequest({
      'url': app.urlTwo.vipConfig,
    }).then(res => {
      app.vip = res.data
      // console.log(res)
      cb && cb(res.data)
    })
  }
}
//拼团配置
util.group = (cb) => {
  var app = getApp(), info = app.group;
  if (info) { cb && cb(info) }
  else {
    util.prequest({
      'url': app.urlTwo.groupConfig,
    }).then(res => {
      app.group = res.data
      // console.log(res)
      cb && cb(res.data)
    })
  }
}
//砍价配置
util.bargain = (cb) => {
  var app = getApp(), info = app.bargain;
  if (info) { cb && cb(info) }
  else {
    util.prequest({
      'url': app.urlTwo.bargainConfig,
    }).then(res => {
      app.bargain = res.data
      cb && cb(res.data)
      })
  }
}

//抢购配置
util.rushbuy = (cb) => {
  var app = getApp(), info = app.rushbuy;
  if (info) { cb && cb(info) }
  else {
    util.prequest({
      'url': app.urlTwo.rushConfig,
    }).then(res => {
      app.rushbuy = res.data
      cb && cb(res.data)
    })
  }
}

//formId
util.formId = (cb) => {
  var app = getApp()
  //console.log(cb)
    util.prequest({
      'url': app.urlTwo.formId,
      data: {formId: cb },
      'method': 'POST',
    }).then(res => {
      //console.log('返回',res)
    })

}
//userInfo
util.userinfo = (cb) => {
  var app = getApp();
  app.getUserInfo(function (userinfo) {
    // console.log(userinfo)
    util.request({
      'url': app.url.userInfo,
      data: {
        id: userinfo.id
      },
      success: function (res) {
        // console.log(res)
        try{
        res.data.data.userTel = userinfo.userTel
        res.data.data.isVip = res.data.data.isVip == '1'
        cb(res.data.data)
        } catch (e) {
          cb({})
        }
      },
    })
  })
  // var app = getApp(), userinfo = wx.getStorageSync('users');
  // console.log(userinfo)
  // util.request({
  //   'url': app.url.userInfo,
  //   'cachetime': '0',
  //   data: {
  //     id: userinfo.id
  //   },
  //   success: function (res) {
  //     console.log(res)
  //     cb(res.data.data)
  //   },
  // })
}
//获取信息列表信息
util.getPostlist = (option) => {
  var app = getApp();
  util.request({
    'url': app.url.post_list,
    data: option.data,
    success: function (res) {
      // console.log('post_list', res)
      for (let i = 0, len = res.data.data.length; i < len; i++) {
        res.data.data[i].creatTime = app.util.settime(res.data.data[i].creatTime)
        if (res.data.data[i].tag) {
          res.data.data[i].tag = res.data.data[i].tag.split(",")
          res.data.data[i].tag.forEach((item, index, input) => {
            input[index] = { name: item, color: app.util.bg1(index) }
          })
        }
        res.data.data[i].customPortrait && res.data.data[i].customPortrait != '[]' && (res.data.data[i].customPortrait = app.system.url + JSON.parse(res.data.data[i].customPortrait)[0].url)
        if (res.data.data[i].media && res.data.data[i].media.length > 10) {
          res.data.data[i].media = JSON.parse(res.data.data[i].media)
        }
        else {
          res.data.data[i].media = []
        }
        res.data.data[i].body = res.data.data[i].body.replace("↵", "\n");
        for (let j = 0, len = res.data.data[i].media.length; j < len; j++) {
          res.data.data[i].media[j].url = app.system.url + res.data.data[i].media[j].url
          res.data.data[i].media[j].preview && (res.data.data[i].media[j].preview = app.system.url + res.data.data[i].media[j].preview)
        }
      }
      option.success(res)
    },
  })
}
//获取用户列表信息
util.userPost = (option) => {
  var app = getApp();
  util.request({
    'url': app.url.user_post,
    data: option.data,
    success: function (res) {
      // console.log('user_post', res)
      for (let i = 0, len = res.data.data.length; i < len; i++) {
        res.data.data[i].postId = Number(res.data.data[i].postId)
        res.data.data[i].creatTime = app.util.settime(res.data.data[i].creatTime)
        if (res.data.data[i].tag) {
          res.data.data[i].tag = res.data.data[i].tag.split(",")
          res.data.data[i].tag.forEach((item, index, input) => {
            input[index] = { name: item, color: app.util.bg1(index) }
          })
        }
        if (res.data.data[i].media && res.data.data[i].media.length>10) {
          res.data.data[i].media = JSON.parse(res.data.data[i].media)
        }
        else {
          res.data.data[i].media = []
        }
        res.data.data[i].body = res.data.data[i].body.replace("↵", "\n");
        for (let j = 0, len = res.data.data[i].media.length; j < len; j++) {
          res.data.data[i].media[j].url = app.system.url + res.data.data[i].media[j].url
          res.data.data[i].media[j].preview && (res.data.data[i].media[j].preview = app.system.url + res.data.data[i].media[j].preview)
        }
      }
      option.success(res)
    },
  })
}
//sjlist
util.getStorelist = (option) => {
  var app = getApp();
  util.request({
    'url': app.url.store_list,
    data: option.data,
    success: function (res) {
      // console.log('post_list', res)
      for (let i = 0; i < res.data.data.length; i++) {
        res.data.data[i].isTop = app.util.Timesize(res.data.data[i].topEndTime)
        res.data.data[i].rztime = app.util.settime(res.data.data[i].enterTime)
        res.data.data[i].storeLogo = app.util.getTypeImgsUrl(res.data.data[i].storeLogo)
        // res.data.data[i].storeLogo[0]&&(res.data.data[i].storeLogo[0].url = app.util.getImgUrl(res.data.data[i].storeLogo))
        // res.data.data[i].body = res.data.data[i].body.replace("↵", "\n");
      }
      option.success(res)
    },
  })
}
//userstore
util.getUserstore = (option) => {
  var app = getApp();
  util.request({
    'url': app.url.userStore,
    data: option.data,
    success: function (res) {
      console.log('Userstore', res)
      for (let i = 0; i < res.data.data.length; i++) {
        if (res.data.code == '1' && res.data.data.length != 0) {
          res.data.data[i].storeLogo = JSON.parse(res.data.data[i].storeLogo)
          res.data.data[i].storeLogo[0].url = app.system.url + res.data.data[i].storeLogo[0].url
        }
      }
      option.success(res)
    },
  })
}
//个人中心配置
util.powerList = (cb) => {
  var app = getApp(), info = app.powerList;
  if (info) { cb(info) }
  else {
    util.prequest({
      'url': app.urlTwo.powerList,
    }).then(res => {
      cb(res.data)
      app.powerList = res.data
    })
  }
}
//订阅消息配置
util.getSmConfig=(cb)=>{
  var app = getApp(), info = app.smconfig;
  //  console.log('getSmConfiggetSmConfiggetSmConfig',info)
   if (info) { cb(info) }
   else {
    util.request({
    'url': app.url.templateList,
    // showLoading:1,
     success: function (res) {
     app.smconfig = res.data.data
    //  console.log('TemplateListTemplateListTemplateList',res)
     cb(res.data.data)
     },
    })
   }
 }
 util.requestSM = function (type) {
  return new Promise((resolve, reject) => {
   this.getSmConfig((data) => {
    wx.requestSubscribeMessage({
     tmplIds: data[type],
     complete: (res) => {
      resolve()
      // console.log('requestSubscribeMessage',res)
     }
    })
   })
  });
 }
module.exports = util;