// pages/vip/index.js
var app = getApp();
Page({
  data: {
    userinfo: {},
    key: '0',
    tabs: [{
        name: "直接购买",
        id: 0,
      },
      {
        name: "使用激活码",
        id: 1,
      },
    ],
    vipConfig: {},
    vipImgArr: [{
        src: '/assets/images/vip/schyj.png',
        title: '商场会员价',
        content: '会员可以在商家指定特权日享受专属优惠'
      },
      {
        src: '/assets/images/vip/qghyj.png',
        title: '抢购会员价',
        content: '可以享受抢购商品VIP特价购买'
      },
      {
        src: '/assets/images/vip/fbxx.png',
        title: '免费发布信息',
        content: '会员可以免费发布信息，免费刷新分类信息'
      },
      {
        src: '/assets/images/vip/shzk.png',
        title: '商户折扣',
        content: '可以享受商城商品VIP特价购买'
      },
    ],
    checkboxvalue: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.api.vip(res => {
      app.setNavigationBarTitle(res.field)
      this.setData({
        vipConfig: res,
      })
    })
    app.setNavigationBarColor(this, () => {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000',
      })
    })
    this.announceList()
    //套餐
    app.api.prequest({
      'url': app.urlTwo.vipSetmeal,
    }).then(res => {
      res.data[0] && (res.data[0].checked = true)
      this.setData({
        radioarr: res.data || []
      })
      console.log(res.data)
    })
  },
  // 获取首页公告
  announceList(e) {
    app.api.prequest({
      'url': app.urlTwo.vipOpenList,
    }).then(res => {
      this.setData({
        Headline: {
          notice: {
            color: '#666'
          },
          isButton: false,
          leftvalue: "商城头条",
          brs: 0,
          pad: '30rpx 30rpx',
          bordercolor: "#f9f9f9",
          color: this.data.color,
          announceList: res.data
        },
      })
      console.log(res.data)
    })
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    this.setData({
      key: e.detail.key,
    })
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    let radioarr = this.data.radioarr;
    for (var i = 0, len = radioarr.length; i < len; ++i) {
      radioarr[i].checked = i == e.detail.value;
    }
    this.setData({
      radioarr,
    });
  },
  //勾选协议
  clickcheckbox(e) {
    console.log(e.detail)
    this.setData({
      checkboxvalue: e.detail
    })
  },
  formSubmit: function(e) {
    let that = this,
      co = this.data,
      v = e.detail.value,
      rztype = co.radioarr[v.radio]
    console.log('form发生了submit事件，携带数据为：', co, v, rztype)
    //校验表单
    let warn = "",
      flag = true;
    if (co.key == 0 && !rztype) {
      warn = "请选择购买套餐";
    } else if (app.util.isNull(v.code) && co.key == 1) {
      warn = "请输入激活码";
    } else if (app.util.isNull(v.checkbox)) {
      warn = "请查看用户协议并勾选";
    } else {
      //return
      flag = false;
      app.util.getShowloading('提交中')
      that.setData({
        loading: true,
      })
      //add
      app.api.prequest({
        'url': co.key == 0 ? app.urlTwo.vipAddvip : app.urlTwo.vipActivation,
        'method': 'POST',
        data: co.key == 0 ? {
          mealId: rztype.id,
          type: +co.key + 1
        } : {
          code: v.code
        },
      }).then(res => {
        if (res.code == '1') {
          let rzId = res.data
          if (Number(rztype.money) > 0 && co.key == 0) {
            that.setData({
              loading: false,
              isshowpay: true,
              payobj: {
                params: {
                  money: rztype.money,
                  orderId: rzId,
                },
                apiurl: app.url.vipPay
              }
            })
          } else {
            app.util.getShowtoast('操作成功')
            setTimeout(() => {
              wx.navigateBack({})
            }, 1000)
          }
        } else {
          app.util.getShowtoast(res.msg, 1000, 1)
          that.setData({
            loading: false
          })
        }
        console.log('add', res.data)
      });
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  payreturn(e) {
    //console.log(e.detail)
    if (e.detail == '1') {
      wx.navigateBack({})
    }
  },
  onShow: function() {
    app.getUserInfo((info) => {
      this.setData({
        isLogin: app.globalData.isLogin
      })
      console.log(info)
      if (app.globalData.isLogin) {
        app.api.userinfo((info) => {
          info.vipEndTime = app.util.ormatDate(info.vipEndTime).substring(0, 10)
          this.setData({
            userinfo: info,
            subtitle: info.vipTypeName && `到期时间 ${info.vipEndTime}` || `您还没加入${app.system.name}专属会员`
          })
          console.log(info)
        })
      }
    })
  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
})