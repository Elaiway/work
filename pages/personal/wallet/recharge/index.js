// pages/personal/wallet/recharge/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ac_index: 0,
    checkboxvalue: true,
    moneyarr: [
      //   {
      //   money: '10',
      //   pay: '1'
      // },
      //  {
      //   money: '20',
      //   pay: '5'
      // }, {
      //   money: '50',
      //   pay: '10'
      // }, {
      //   money: '100',
      //   pay: '20'
      // }, {
      //   money: '500',
      //   pay: '200'
      // }
    ]
  },
  //勾选协议
  clickcheckbox(e) {
    console.log(e.detail)
    this.setData({
      checkboxvalue: e.detail
    })
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var that = this,
      co = this.data,
      v = e.detail.value,
      ac_index = co.ac_index,
      money;
    if (ac_index != -1) {
      money = Number(co.moneyarr[ac_index].money)
    } else {
      money = Number(v.qtje)
    }
    console.log(co, v, ac_index, money);
    // return
    var warn = "";
    var flag = true;
    if (money <= 0) {
      warn = "请选择充值金额！";
    } else if (app.util.isNull(v.checkbox)) {
      warn = "请查看充值须知并勾选";
    } else {
      flag = false;
      that.setData({
        loading: true
      })
      wx.showLoading({
        title: '提交中...',
        mask: true
      })
      console.log('请求接口', )
      //return
      app.api.request({
        'url': app.url.balancePay,
        'method': 'POST',
        data: {
          money: money,
        },
        success: function (res) {
          let payres = res.data;
          console.log(payres)
          if (payres.code != '1') {
            that.setData({
              loading: false
            })
            wx.showModal({
              title: '提示',
              content: payres.msg,
            })
          } else {
            wx.requestPayment({
              timeStamp: payres.data.timeStamp,
              nonceStr: payres.data.nonceStr,
              package: payres.data.package,
              signType: payres.data.signType,
              paySign: payres.data.paySign,
              'complete': function (res) {
                console.log(res);
                if (res.errMsg == 'requestPayment:fail cancel') {
                  wx.showToast({
                    title: '取消支付',
                    icon: 'loading',
                    duration: 1000
                  })
                  that.setData({
                    loading: false
                  })
                } else if (res.errMsg == 'requestPayment:ok') {
                  wx.showToast({
                    title: '提交成功',
                    mask: 1,
                    duration: 1000,
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1000)
                } else {
                  that.setData({
                    loading: false
                  })
                  wx.showModal({
                    title: '提示',
                    content: res.errMsg + res.err_desc,
                  })
                }
              }
            })
          }
        },
        fail: function (res) {
          console.log('fail', res)
          that.setData({
            loading: false
          })
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      })
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarTitle('充值')
    app.setNavigationBarColor(this);
    var t = this;
    //userinfo
    app.api.userinfo((info) => {
      console.log(info)
      t.setData({
        userinfo: info,
      })
    })
    app.api.billSite((info) => {
      t.setData({
        billSite: info,
        moneyarr: info.site,
        ac_index: info.site.length ? 0 : -1,
      })
    })
    app.api.prequest({
      'url': app.url.payConfig,
    }).then((res) => {
      if (res.data.balanceRecharge!='yes'){
        wx.showModal({
          title: '提示',
          content: '余额充值已关闭',
          success:()=>{
            wx.navigateBack({
              
            })
          }
        })
      }
      t.setData({
        payConfig:res.data,
      })
    })
  },
  seleRecharge(e) {
    this.setData({
      ac_index: e.currentTarget.dataset.index
    })
  },
  custom(e) {
    this.setData({
      ac_index: -1
    })
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

  }
})