var app = getApp();
Component({
  externalClasses: ['extra-class'],
  options: {},
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    visible: {
      type: Boolean,
      value: false,
    },
    color: {
      type: String,
      value: 'red'
    },
    closepop: {
      type: String,
      value: ''
    },
    mrcolor: {
      type: String,
      value: ''
    },
    payobj: {
      type: Object,
      value: {}
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    radioItems: [],
  },
  attached: function() {
    let that = this
    this.refreshUserInfo()
    app.api.prequest({
      'url': app.url.payConfig,
    }).then((res) => {
      let radioItems = [],
        iosCanUse = (getApp().phoneInfo.system.indexOf("iOS") > -1) && res.data.applePay == '2';
      if (res.code != '1') {
        radioItems.push({
          name: '微信支付',
          value: 'wx',
          img: '/assets/img/pay/wx.png'
        })
      } else {
        if (res.data.wxPay == 'yes' && !iosCanUse) {
          radioItems.push({
            name: '微信支付',
            value: 'wx',
            img: '/assets/img/pay/wx.png'
          })
        }
        if (res.data.balancePay == 'yes') {
          radioItems.push({
            name: '余额支付',
            value: 'ye',
            img: '/assets/img/pay/ye.png'
          })
        }
        if (res.data.integralPay == 'yes1') {
          radioItems.push({
            name: '积分支付',
            value: 'jf',
            img: '/assets/img/pay/ye.png'
          })
        }
      }
      radioItems[0] && (radioItems[0].checked = true);
      that.setData({
        payConfig: res.data,
        iosCanUse,
        radioItems: radioItems,
      })
      console.log('pay', res, getApp().phoneInfo.system.indexOf("iOS"), iosCanUse)
    })
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    refreshUserInfo() {
      app.api.prequest({
        'url': app.url.userInfo,
        data: {
          id: wx.getStorageSync('users').id
        },
      }).then((res) => {
        this.setData({
          userinfo: res.data,
        })
        console.log('userinfo', res)
      })
    },
    closepop() {
      // wx.showModal({
      //   title: '提示',
      //   content: '',
      // })
      this.setData({
        visible: false,
      })
    },
    cz() {
      wx.navigateTo({
        url: '/pages/personal/wallet/recharge/index',
      })
    },
    know() {
      wx.navigateBack({

      })
    },
    // onChange(field, e) {
    //   this.setData({
    //     [field]: e.detail.value
    //   })
    //   console.log('radio发生change事件，携带value值为：', e.detail.value)
    // },
    // typeradioChange(e) {
    //   console.log(e)
    //   this.onChange('paytypevlue', e)
    // },
    radioChange: function(e) {
      console.log('radio发生change事件，携带value值为：', e.detail.value);

      var radioItems = this.data.radioItems;
      for (var i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = radioItems[i].value == e.detail.value;
      }

      this.setData({
        radioItems: radioItems
      });
    },
    formSubmit: function(e) {
      var that = this,
        payobj = that.data.payobj,
        userinfo = that.data.userinfo;
      console.log('form发生了submit事件，携带数据为：', e.detail.value, that.data.payobj, userinfo)
      if (e.detail.value.radiogroup == 'ye' && +payobj.params.money > +userinfo.balance) {
        wx.showModal({
          title: '提示',
          content: '余额不足支付',
        })
        return
      }
      that.setData({
        loading: true
      })
      //
      if (e.detail.value.radiogroup == 'wx') {
        app.api.request({
          'url': payobj.apiurl,
          'cachetime': '0',
          data: payobj.params,
          'method': 'POST',
          success: function(res) {
            let payres = res.data;
            console.log(payobj.apiurl, res, (Date.parse(new Date()) / 1000).toString())
            if (payres.code != '1') {
              that.triggerEvent('complete', '3')
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
                'success': function(res) {
                  console.log(res)
                },
                'complete': function(res) {
                  console.log(res);
                  if (res.errMsg == 'requestPayment:fail cancel') {
                    that.triggerEvent('complete', '2')
                    wx.showToast({
                      title: '取消支付',
                      icon: 'loading',
                      mask: 1,
                      duration: 1000
                    })
                    that.setData({
                      loading: false
                    })
                    // setTimeout(function () {
                    //   wx.reLaunch({
                    //     url: '../wddd/order',
                    //   })
                    // }, 1000)
                  } else if (res.errMsg == 'requestPayment:ok') {
                    wx.showToast({
                      title: '提交成功',
                      mask: 1,
                      duration: 1000,
                    })
                    setTimeout(function() {
                      that.triggerEvent('complete', '1')
                      that.setData({
                        visible: false,
                        loading: false,
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
          fail: function(res) {
            console.log('fail', res)
            that.setData({
              loading: false
            })
            that.triggerEvent('complete', '3')
            wx.showToast({
              title: '网络出错',
              icon: 'loading'
            })
          }
        })
      } else if (e.detail.value.radiogroup == 'ye') {
        let balanceapiurl
        //遍历找到对应余额支付接口
        for (let k in app.url) {
          if (app.url[k] == payobj.apiurl) {
            balanceapiurl = app.url.balance[k]
            break;
          }
        }
        //console.log(payobj.apiurl, balanceapiurl)
        app.api.request({
          'url': balanceapiurl,
          data: payobj.params,
          'method': 'POST',
          success: function(res) {
            let payres = res.data;
            if (payres.code != '1') {
              that.triggerEvent('complete', '3')
              that.setData({
                loading: false
              })
              wx.showModal({
                title: '提示',
                content: payres.msg,
              })
            } else {
              wx.showToast({
                title: '提交成功',
                mask: 1,
                duration: 1000,
              })
              that.refreshUserInfo()
              setTimeout(function() {
                that.triggerEvent('complete', '1')
                that.setData({
                  visible: false,
                  loading: false,
                })
              }, 1000)
            }
          },
          fail: function(res) {
            console.log('fail', res)
            that.setData({
              loading: false
            })
            that.triggerEvent('complete', '3')
            wx.showToast({
              title: '网络出错',
              icon: 'loading'
            })
          }
        })
      }
    },
  }
})