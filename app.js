//app.js
App({
  onLaunch: function () {
    // var that = this
    // // 用户登录 这里和页面的app.getUserInfo会同时触发，所以这里注释了，而且onLaunch和页面的onload是同时触发的，
    // this.getUserInfo(function(userinfo) {
    //   console.log(userinfo)
    // //   that.isLogin()
    // })
  },
  onShow: function () {},
  Getroute: function (e) {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    return url
  },
  imgsrc: require('setinfo.js').siteroot,
  setInfo: require('setinfo.js'),
  api: require('/utils/api.js'),
  url: require('/utils/config.js'),
  urlTwo: require('/utils/config-two.js'),
  util: require('/utils/util.js'),
  com: require('/utils/common.js'),
  //检查是否定位
  isLocation(cb) {
    if (!this.globalData.orientate) {
      console.log("用户还没定位")
      this.getLocation(function (location) {
        //console.log(location)
        if (location == true) {
          cb()
        }
      })
    } else {
      console.log("用户已经定位过了")
      cb()
    }
  },
  //   获取当前定位位置
  getLocation(location) {
    // console.log(location)
    // wx.showLoading({
    //   title: '正在定位',
    //   mask: !0,
    // })
    var that = this
    // 获取默认
    that.api.request({
      'url': that.url.defaultZone,
      success: function (res) {
        // console.log('defaultZone', res)
        res.data.data.lat = Number(res.data.data.lat.toFixed(5))
        res.data.data.lng = Number(res.data.data.lng.toFixed(5))
        // if (res.data.data.zoneId == null || res.data.data.zoneId == '0') {
        //   res.data.data.defaultCity = res.data.data.cityName
        //   res.data.data.defaultId = res.data.data.cityId
        //   res.data.data.manual = false
        // } else {
        //   res.data.data.defaultCity = res.data.data.zoneName
        //   res.data.data.defaultId = res.data.data.zoneId
        //   res.data.data.manual = false
        // }
        that.globalData.dZone = res.data.data
        //定位
        that.util.getLocation({
          type: "0",
          success: res => {}
        })
        // location.seleCity()
        // 获取当前城市定位
        that.util.getLocation({
          type: "1",
          success: res => {
            let dwjwd = res.result.location
            let city = res.result.ad_info.city
            let district = res.result.ad_info.district
            // wx.hideLoading()
            that.api.request({
              url: "/city/api/post/zone",
              data: {
                city: city,
                zone: district
              },
              success: res => {
                console.log("当前的定位市区为==============" + city + '=======' + district, res)
                that.globalData.orientate = true
                if (res.data.data.zoneId == null || res.data.data.zoneId == '0') {
                  res.data.data.defaultCity = res.data.data.cityName
                  res.data.data.defaultId = res.data.data.cityId
                  res.data.data.manual = false
                } else {
                  res.data.data.defaultCity = res.data.data.zoneName
                  res.data.data.defaultId = res.data.data.zoneId
                  res.data.data.manual = false
                }
                that.globalData.city = res.data.data
                // wx.hideLoading()
                that.api.layout((info) => {
                  // console.log(info)
                  location(true)
                })
              }
            })
          },
          fail: res => {
            console.log("失败信息", res)
          }
        })
      },
    })
    // wx.request({
    //   url: 'https://apis.map.qq.com/ws/location/v1/ip?key=' + getApp().system.mapKey,
    //   success(ipres) {
    //     // console.log('ip', ipres)
    //     that.api.request({
    //       url: "/city/api/post/zone",
    //       data: {
    //         city: ipres.data.result.ad_info.city,
    //         zone: ipres.data.result.ad_info.district,
    //       },
    //       success: res => {
    //         // console.log("当前的定位市区为==============" + ipres.data.result.ad_info.city + '=======' + ipres.data.result.ad_info.district, res)
    //         that.globalData.orientate = true
    //         if (res.data.data.zoneId == null || res.data.data.zoneId == '0') {
    //           res.data.data.defaultCity = res.data.data.cityName
    //           res.data.data.defaultId = res.data.data.cityId
    //           res.data.data.manual = false
    //         } else {
    //           res.data.data.defaultCity = res.data.data.zoneName
    //           res.data.data.defaultId = res.data.data.zoneId
    //           res.data.data.manual = false
    //         }
    //         that.globalData.city = res.data.data
    //         // wx.hideLoading()
    //         that.api.layout((info) => {
    //           // console.log(info)
    //           location(true)
    //         })
    //       }
    //     })
    //   }
    // })
  },
  //登录
  getUserInfo: function (cb) {
    var that = this,
      userinfo = this.globalData.userInfo;
    if (userinfo) {
      typeof cb == "function" && cb(userinfo)
    } else {
      wx.login({
        success: function (res) {
          wx.showLoading({
            title: "正在登录",
            mask: !0
          })
          that.api.request({
            'url': '/city/api/login/login',
            'cachetime': '0',
            data: {
              code: res.code,
              type: 'mini',
              sessionKey: wx.getStorageSync('sessionKey')
            },
            success: function (res) {
              // console.log('login信息', res)
              let lres = res.data
              that.globalData.black = lres.black
              if (lres.code == 0) {
                wx.clearStorageSync('sessionKey')
                if (lres.msg == '获取不到openId') {
                  that.getUserInfo(cb)
                }
                if (lres.msg == '获取openId失败') {
                  wx.showModal({
                    title: '提示',
                    content: lres.msg + '请检查appid及相关配置',
                    success(res) {
                      wx.reLaunch({
                        url: '/pages/personal/noresult',
                      })
                    }
                  })
                }
                that.globalData.isLogin = 0
                wx.setStorageSync('openid', lres.data.openid)
                // wx.setStorageSync('jmkey', lres.data.session_key)
                that.globalData.userInfo = {}
                typeof cb == "function" && cb(that.globalData.isLogin)
              } else if (lres.code == 1 && lres.data.user != null) {
                that.globalData.isLogin = 1
                wx.setStorageSync('sessionKey', lres.data.sessionKey)
                wx.setStorageSync('users', lres.data.user)
                that.globalData.userInfo = lres.data.user
                typeof cb == "function" && cb(that.globalData.userInfo)
              } else if (lres.code == 1 && lres.data.user == null && lres.msg == '无需登录') {
                that.globalData.isLogin = 1
                that.globalData.userInfo = wx.getStorageSync('users')
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            },
            fail: function (res) {},
            complete: function (res) {
              wx.hideLoading()
            },
          })
        }
      });
      let iptime = wx.getStorageSync('iptime')
      // console.log(iptime,typeof(iptime))
      if (iptime) {
        // console.log('有', iptime, new Date().getTime())
        // console.log(that.util.calculateDiffTime(iptime, new Date().getTime()))
        if (that.util.calculateDiffTime(iptime, new Date().getTime())[3] > 0) {
          wx.setStorageSync('iptime', new Date().getTime())
          that.api.request({
            'url': that.url.increvisit,
            data: {
              type: 'ip'
            },
            success: res => {
              console.log(res)
            },
          })
        }
      } else {
        // console.log('无', (new Date()).getTime())
        wx.setStorageSync('iptime', new Date().getTime())
        that.api.request({
          'url': that.url.increvisit,
          data: {
            type: 'ip'
          },
          success: res => {
            console.log(res)
          },
        })
      }
    }
  },
  // 查看用户是否登录过
  isLogin(e) {
    if (this.globalData.isLogin == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '您需要绑定手机号才可以进行操作哦',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/logincode/index',
            })
          } else {
            // getApp().isLogin()
          }
        }
      })
    } else {
      return true
    }
  },
  //全局设置
  setNavigationBarTitle: function (title) {
    wx.setNavigationBarTitle({
      title: title,
    })
  },
  setNavigationBarColor: function (n, cb) {
    var that = this,
      t = this.globalData.color,
      url = this.globalData.imgurl;
    // console.log(t, url, n,cb)
    t && (wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: t,
      }),
      n.setData({
        color: t,
        url: url,
        imgsrc: that.setInfo.siteroot,
      }),
      cb && cb()
    )
    var e = this;
    t || e.api.system((info) => {
      // console.log(info)
      e.globalData.color = info.color == null ? '#5DB271' : info.color
      e.globalData.imgurl = info.url
      // getApp().system = info
      // e.globalData.color = t.data.color
      e.setNavigationBarColor(n, cb)
      // 0 == t.code && (wx.setStorageSync("_navigation_bar_color", t.data), e.setNavigationBarColor())
    }), this.util.getPhoneInfo()
    t && that.api.request({
      'url': that.url.increvisit,
      data: {
        type: 'pv'
      },
      success: res => {
        // console.log(res)
      },
    })
  },
  pageOnLoad: function (e) {
    var that = this;

    function a(t) {
      var a = !1,
        o = e.route || e.__route__ || null;
        console.log(t,3333)
        if(wx.getStorageSync('postinfo').release=='close'){
          t.navs[2].link=""
          // t.navs.splice(2,1)
         
        }
      for (var n in t.navs) t.navs[n].link === "/" + o ? (t.navs[n].active = !0, a = !0) : t.navs[n].active = !1;
      a && e.setData({
        _navbar: t
      })
      a || e.setData({
        _navbar: null
      })
    }
    var navdata = {
      // background_image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX///+nxBvIAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==",
      border_color: "rgba(0,0,0,.1)",
      bottomTabStyle: (getApp().layout && getApp().layout.nav.config) ? getApp().layout.nav.config.bottomTabStyle : '',
      color: (getApp().layout && getApp().layout.nav.config) ? getApp().layout.nav.config.color : '',
      colorOff: '#888',
    }
    var o = that.globalData.navbar;
    // console.log('pageOnLoad', o, getApp().layout)
    o && a(o);
    o || (function () {
      let nav = getApp().layout && getApp().layout.nav.config ? JSON.parse(JSON.stringify(getApp().layout.nav.config.bottomTabList)) : []
      console.log(nav)
      
      for (let i in nav) {
        var postNum = wx.getStorageSync('postinfo').release;
        console.log(postNum,9999)
        nav[i].link = that.util.changeUrl(nav[i].link)
      }
      if (nav.length >= 0) {
        navdata.navs = nav
        a(navdata)
        that.globalData.navbar = navdata
      } else {
        // let arr = [{
        //   icon:{active: '/assets/img/foot/syf.png',
        //   normal: '/assets/img/foot/sy.png'},
        //   legend: '首页',
        //   link: "/pages/index/index"
        // }, {
        //   icon:{active: '/assets/img/foot/flf.png',
        //   normal: '/assets/img/foot/fl.png'},
        //   legend: '分类',
        //   link: "/pages/publish/post/index"
        // }, {
        //   icon:{active: '/assets/img/foot/fb.png',
        //   normal: '/assets/img/foot/fb.png'},
        //   legend: '发布',
        //   link: "/pages/publishtype/publishtype"
        // }, {
        //   icon:{active: '/assets/img/foot/dpf.png',
        //   normal: '/assets/img/foot/dp.png'},
        //   legend: '商圈',
        //   link: "/pages/store/storemain/storemain"
        // },
        // {
        //   icon: {active: '/assets/img/foot/dpf.png',
        //   normal: '/assets/img/foot/dp.png'},
        //   legend: '资讯',
        //   link: "/pages/message/index/index"
        // },
        // {
        //   icon: {active: '/assets/img/foot/wdf.png',
        //   normal: '/assets/img/foot/wd.png'},
        //   legend: '我的',
        //   link: "/pages/personal/index"
        // }]
        // navdata.navs = arr
        // a(navdata)
        // that.globalData.navbar = navdata
      }
    })()
  },
  globalData: {
    userInfo: null,
    isLogin: 0,
    city: {
      cityId: "",
      cityName: "",
      defaultCity: "",
      defaultId: "",
      manual: false,
      zoneId: "",
      zoneName: "",
    },
    orientate: false,
  },
  version: '0.0.4.22'
})