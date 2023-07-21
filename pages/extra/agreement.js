var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var pages = getCurrentPages()
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.setData({
        checkboxvalue: true,
      })
    }
    wx.navigateBack({

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options)
    app.setNavigationBarTitle(options.xyname)
    app.setNavigationBarColor(this);
    if (options.xyname == '发布相关条款') {
      app.api.postconfig((info) => {
        console.log(info)
        that.setData({
          postconfig: info,
          nodes: info.agreement
        })
      })
    } else if (options.xyname == '用户登录协议') {
      app.api.system((info) => {
        console.log(info)
        that.setData({
          nodes: info.platformAgreement
        })
      })
    } else if (options.xyname == '认证协议') {
      app.api.identSet((info) => {
        console.log(info)
        that.setData({
          nodes: info.identComment
        })
      })
    } else if (options.xyname == '保证金协议') {
      app.api.identSet((info) => {
        console.log(info)
        that.setData({
          nodes: info.bondComment
        })
      })
    } else if (options.xyname == '充值需知') {
      app.api.billSite((info) => {
        that.setData({
          nodes: info.content
        })
      })
    } else if (options.xyname == '提现需知') {
      app.api.request({
        'url': app.url.payConfig,
        success: res => {
          that.setData({
            nodes: res.data.data.notice
          })
        },
      })
    } else if (options.xyname == '活动报名协议') {
      app.api.request({
        'url': app.url.activitySet,
        success: res => {
          that.setData({
            nodes: res.data.data.agreement
          })
        },
      })
    } else if (options.xyname == '顺风车发布协议') {
      app.api.request({
        'url': app.url.freeCarSet,
        success: res => {
          that.setData({
            nodes: res.data.data.agreement
          })
        },
      })
    } else if (options.xyname == '相关协议') {
      app.api.request({
        'url': app.urlTwo.vipConfig,
        success: res => {
          that.setData({
            nodes: res.data.data.agreement
          })
        },
      })
    } else if (options.xyname == '招聘发布协议') {
      app.api.request({
        'url': app.url.jobSet,
        success: res => {
          that.setData({
            nodes: res.data.data.agreement
          })
        },
      })
    } else if (options.xyname == '求职发布协议') {
      app.api.request({
        'url': app.url.jobSet,
        success: res => {
          that.setData({
            nodes: res.data.data.agreement
          })
        },
      })
    } else if (options.xyname == '名片发布协议') {
      app.api.request({
        'url': app.url.businesscardSet,
        success: res => {
          that.setData({
            nodes: res.data.data.agreement
          })
        },
      })
    } else if (options.xyname == '商家协议条款') {
      app.api.storeconfig((info) => {
        console.log(info)
        that.setData({
          nodes: info.businessJoinAgreement
        })
      })
    } else if (options.xyname == '签到规则') {
      app.api.prequest({
        url: app.url.signRule,
      }).then(res => {
        that.setData({
          nodes: res.data.body
        })
      })
    } else if (options.xyname == '用户协议条款') {
      app.api.housingdeal((info) => {
        console.log(info)
        that.setData({
          nodes: info.agreement
        })
      })
    } else if (options.xyname == '入驻协议条款') {
      app.api.yellow((info) => {
        console.log(info)
        that.setData({
          nodes: info.agreement
        })
      })
    }
    else if (options.xyname == '商品发布协议条款') {
      app.api.mall((info) => {
        console.log(info)
        that.setData({
          nodes: info.goodsBody
        })
      })
    }
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
})