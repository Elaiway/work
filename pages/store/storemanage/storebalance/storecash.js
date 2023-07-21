// pages/personal/storebalance/storecash.js
const app = getApp()
Page({
  data: {
    items: [{
        name: '微信',
        icon: "icon-weixin",
        mode: "微信提现",
        color: "#26C541",
        detail: "申请通过后将自动打入您的零钱账户",
        show: true,
        value: '微信',
      },
      {
        name: '支付宝',
        icon: "icon-zhifubaox",
        mode: "支付宝提现",
        color: "#00aaee",
        detail: "申请通过后将自动打入您的支付宝余额",
        show: true,
        value: '支付宝'
      },
      {
        name: '银行卡',
        icon: "icon-yinxingqia",
        mode: "银行卡提现",
        color: "#F8A911",
        detail: "申请通过后将打入您的银行账户",
        show: true,
        value: '银行卡'
      }
    ],
    fwf: 0,
    sjdz: 0,
    checkboxvalue: true,
  },
  moneyinput(e) {
    let that = this,
      obj = this.data.obj,
      storeconfig = this.data.storeconfig,
      fwf = Number((e.detail.value * (storeconfig.recharge / 100)).toFixed(2)),
      sjdz = Number((e.detail.value - fwf).toFixed(2))
    console.log(e.detail.value, obj, fwf, sjdz)
    that.setData({
      fwf: fwf,
      sjdz: sjdz,
    })
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    app.setNavigationBarTitle('商家提现')
    app.setNavigationBarColor(this);
    this.setData({
      storeId: app.sjdId,
      // storeId: options.storeId //调试
    })
    //userinfo
    // app.api.userinfo((info) => {
    //   console.log(info)
    //   that.setData({
    //     userinfo: info,
    //   })
    // })
    //商家信息
    app.api.prequest({
      url: app.urlTwo.storeBalance,
      data: {
        storeId: this.data.storeId
      }
    }).then(res =>{
      this.setData({
        balancemony: res.data.money,
      })
    })
    app.api.storeconfig((info) => {
      console.log(info)
      that.setData({
        storeconfig: info,
      })
    })
    app.api.request({
      'url': app.url.payConfig,
      success: res => {
        let obj = res.data.data,
          storeconfig = this.data.storeconfig,
          items = this.data.items,newarr=[];
        for (let i in storeconfig.forwardMethod) {
          console.log(i)
          if (i == '1') {
            newarr.push(items[0])
          }
          if (i == '2') {
            newarr.push(items[1])
          }
          if (i == '3') {
            newarr.push(items[2])
          }
        }
        newarr[0].checked = true
        console.log(res, newarr)
        that.setData({
          obj: obj,
          items: newarr,
          name: newarr[0].name,
        })
      },
    })
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
      money = Number(v.money),
      mode,
      ye = Number(co.balancemony.surplusCost); //可提现金额
    if (v.mode == '微信') {
      mode = 1
    }
    if (v.mode == '支付宝') {
      mode = 2
    }
    if (v.mode == '银行卡') {
      mode = 3
    }
    console.log(co, v, money,ye,mode);
    var warn = "";
    var flag = true;
    if (money <= 0) {
      warn = "请输入提现金额！";
    } else if (app.util.isNull(v.accountNumber)) {
      warn = "请输入提现帐号";
    } else if (app.util.isNull(v.zhxx) && mode==3) {
      warn = "请输入支行信息";
    } else if (app.util.isNull(v.name)) {
      warn = "请输入姓名";
    } else if (!app.util.isTelCode(v.linkTel)) {
      warn = "请输入正确的联系方式";
    } else if (ye<money) {
      warn = "提现金额超出您的实际金额";
    } else if (Number(co.storeconfig.limit) > money) {
      warn = "未达到提现门槛";
    } else if (app.util.isNull(v.checkbox)) {
      warn = "请查看提现须知并勾选";
    } else {
      flag = false;
      that.setData({
        loading: true
      })
      wx.showLoading({
        title: '提交中...',
        mask: true
      })
      console.log('请求接口')
      //return
      app.api.request({
        'url': app.urlTwo.applyCash,
        'method': 'POST',
        data: {
          money: money, mode: mode, name: v.name, linkTel: v.linkTel, accountNumber: v.accountNumber, branch: v.zhxx || '', storeId: co.storeId,
        },
        success: function(res) {
          wx.hideLoading()
          let payres = res.data;
          console.log(payres)
          if (payres.code == '1') {
            app.util.getShowtoast('提交成功', 1000)
            // setTimeout(function () {
            //   wx.navigateBack({
            //     delta: 1
            //   })
            // }, 1000)
            app.util.swnb()
          } else {
            that.setData({
              loading: false
            })
            wx.showModal({
              title: '提示',
              content: payres.msg,
            })
          }
        },
        fail: function(res) {
          wx.hideLoading()
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
  //提现明细
  mingxi(e) {
    wx.navigateTo({
      url: '/pages/store/storemanage/storebalance/storecashlist',
    })
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {}
})