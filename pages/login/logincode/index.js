// pages/login/index/index.js
/*
 *根据缓存判断用户是否登录过
 *再根据返回的值查看用户是否已经绑定了
 *没有登录 但是缓存的openid和当前获取到的绑定账号不匹配则执行登录
 *登录过 
 *没有直接跳转到绑定页面
 *登录过直接跳过绑定页面
 */
const cdata = require('../../../assets/countryJson.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getmsg: '获取验证码',
    send: false,
    checkboxvalue: true,
    tel: '',
    popupshow: false,
    cdata: cdata['cn'],
    areaName: cdata['cn'][0].county,
    areaCode: cdata['cn'][0].phoneCo,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  selectCode(e){
    this.setData({
      areaCode: e.currentTarget.dataset.p,
      areaName: e.currentTarget.dataset.c,
      popupshow:false,
    })
  },
  codeOpen() {
    this.setData({
      popupshow: true,
    })
  },
  qdcode(){
    this.setData({
      popupshow: false,
    })
  },
  //勾选协议
  clickcheckbox(e) {
    console.log(e.detail)
    this.setData({
      checkboxvalue: e.detail
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarTitle('用户登录')
    app.setNavigationBarColor(this);
    app.api.request({
      url: app.url.system,
      success: res => {
        this.setData({
          system: res.data.data
        })
      }
    })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.provingLogin()
  },
  provingLogin(e) {
    var that = this
    //调用登录接口
    wx.getSetting({
      success: res => {
        var auth = res.authSetting
        console.log(11,auth)
        if (auth["scope.userInfo"] != true) {
          console.log('检测到用户没有授权')
          that.setData({
            empower: true
          })
        } else {
          console.log('检测到用户已经授权')
          that.setData({
            empower: true
          })
          wx.getUserProfile({
            desc: '用于完善资料',
            success: (res) => {
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
              this.provingLogin()
            }
          })
          // wx.getUserInfo({
          //   withCredentials: false,
          //   success: function(res) {
          //     console.log(res)
          //     that.setData({
          //       userInfo: res.userInfo
          //     })
          //   }
          // })
        }
      }
    })
  },
  sign_up(e) {
    wx.navigateTo({
      url: '/pages/login/sign/index',
    })
  },
  login(e) {
    wx.navigateTo({
      url: '/pages/login/index/index',
    })
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          empower: false
        })
      }
    })
  },
  bindGetUserInfo: function(e) {
    console.log(e)
    if (e.detail.errMsg == 'getUserInfo:ok') {
      this.provingLogin()
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '您拒绝了信息授权，将无法正常使用小程序',
      })
    }
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var detail = e.detail.value,
      userInfo = this.data.userInfo,
      tel = detail.tel,
      code = detail.code,
      num = this.data.num
    if (tel == '') {
      app.util.getShowmodel("请输入手机号")
    } else if (code == '') {
      app.util.getShowmodel("请输入验证码")
    } else if (code != num) {
      app.util.getShowmodel("验证码输入错误")
    } else if (this.data.checkboxvalue == false) {
      app.util.getShowmodel("您还没勾选用户登录协议")
    } else {
      wx.showLoading({
        title: "正在提交",
        mask: !0
      })
      app.api.request({
        url: app.url.bind,
        data: {
          userName: userInfo.nickName,
          portrait: userInfo.avatarUrl,
          openId: wx.getStorageSync('openid'),
          userTel: tel,
          encode: 'no',
          type: "mini"
        },
        // 'method': 'POST',
        success: res => {
          console.log(res)
          wx.hideLoading()
          if (res.data.code == '1') {
            app.globalData.userInfo = null
            app.util.getShowtoast('绑定成功')
            setTimeout(function() {
              app.getUserInfo(function(userinfo) {
                console.log(userinfo)
                // 用户注册了返回上一级
                wx.navigateBack({
                  delta: 1
                })
              })
            }, 1500)
          } else {
            app.util.getShowtoast(res.data.msg)
          }
        }
      })
    }
  },
  getTel(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  // 发送短信
  sendmsg(e) {
    var that = this,
      tel = that.data.tel
    console.log(app.util.isTelCode(tel))
    if (tel == '' || app.util.isTelCode(tel) == false) {
      app.util.getShowmodel("请输入正确的手机号")
    } else {
      // 获取6位数的随机数
      var Num = "";
      for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      // 随机数传给后台
      console.log(Num)
      wx.showLoading({
        title: "正在发送短信",
        mask: !0
      })
      app.api.request({
        url: app.url.send,
        data: {
          tel: that.data.tel,
          code: Num,
          areaCode: that.data.areaCode.substr(1)
        },
        success: res => {
          console.log(res)

        }
      })
      that.setData({
        num: Num
      })
      // 倒计时
      var time = 59
      var inter = setInterval(function() {
        wx.hideLoading()
        that.setData({
          getmsg: time + "s后重新发送",
          send: true
        })
        time--
        if (time <= 0) {
          // 停止倒计时
          clearInterval(inter)
          that.setData({
            getmsg: "获取验证码",
            send: false,
          })
        }
      }, 1000)
    }
  },
  // 获取微信绑定的手机号
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg != 'getPhoneNumber:fail user deny') {
      var that = this,
        iv = e.detail.iv,
        data = e.detail.encryptedData,
        userInfo = this.data.userInfo
      app.api.request({
        url: app.url.bind,
        data: {
          userName: userInfo.nickName,
          portrait: userInfo.avatarUrl,
          openId: wx.getStorageSync('openid'),
          // openId: wx.getStorageSync('jmkey'),
          userTel: '',
          iv: iv,
          data: data,
          encode: 'yes',
          type: "mini"
        },
        // 'method': 'POST',
        success: res => {
          console.log(res)
          wx.hideLoading()
          if (res.data.code == '1') {
            app.globalData.userInfo = null
            app.util.getShowtoast('绑定成功')
            setTimeout(function() {
              app.getUserInfo(function(userinfo) {
                console.log(userinfo)
                // 用户注册了返回上一级
                wx.navigateBack({
                  delta: 1
                })
              })
            }, 1500)
          } else {
            app.util.getShowtoast(res.data.msg)
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

})