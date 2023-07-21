// pages/mall/order.js
var app = getApp();
Page({
  data: {
    params: {
      type: null, //1单独够，2拼团
      goodsId: null, //商品Id
      groupId: '', //团Id（参与拼团时传）
      receivedName: '', //收货人
      receivedAddress: '', //收货地址
      receivedTel: '', //收货电话
      totalMoney: 0, //订单金额
      freight: 0, //运费
      goodsMoney: 0, //商品金额
      delivery: 1, //1快递,2到店核销
      note: '', //备注
      num: 1, //购买数量
      selfId: null, //核销地址
    },
    layoutBodyOne: {
      className: 'base-pad2',
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        wid: 200,
        hei: 200,
      },
    },
  },
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('提交订单')
    app.setNavigationBarColor(this);
    //获取商品信息
    app.api.prequest({
      'url': app.urlTwo.groupGoodsInfo,
      data: {
        goodsId: options.goodsId
      },
    }).then((res) => {
      let goodsInfo = res.data
      goodsInfo.limitNum = Number(goodsInfo.limitNum)
      goodsInfo.freight = Number(goodsInfo.freight)
      goodsInfo.isPost = Number(goodsInfo.isPost)
      goodsInfo.satisfy = Number(goodsInfo.satisfy)
      this.setData({
        'params.goodsId': options.goodsId,
        'params.groupId': options.groupId || '',
        'params.type': options.type,
        'params.delivery': goodsInfo.delivery,
        goodsInfo,
      })
      // 需要获取用户信息判断是否VIP
      app.api.userinfo((userinfo) => {
        console.log(userinfo)
        this.setData({
          'params.goodsMoney': options.type == 1 ? goodsInfo.alonePrice : options.type == 2 && app.system.openVip && userinfo.isVip && +goodsInfo.memberPrice > 0 ? +goodsInfo.memberPrice : goodsInfo.groupPrice,
          userinfo,
        })
        this.getTotal()
      })
    })
    console.log(options)
  },
  getTotal() {
    let goodsInfo = this.data.goodsInfo,
      money = this.data.params.goodsMoney * this.data.params.num,
      freight = goodsInfo.isPost == 1 || money >= goodsInfo.satisfy ? 0 : goodsInfo.freight;
    money += freight;
    this.setData({
      freightTips: freight <= 0 ? '包邮' : '含运费 ￥' + ((this.data.goodsInfo.freight || 0).toFixed(2)),
      'params.freight': freight,
      'params.totalMoney': money.toFixed(2),
    })
    console.log(goodsInfo, money, freight, this.data.params)
  },
  getaddress(e) {
    if (e.detail) {
      this.setData({
        'params.receivedName': e.detail.linkName || '',
        'params.receivedAddress': (e.detail.address + e.detail.detailedAddress) || '',
        'params.receivedTel': e.detail.linkTel || '',
      })
    }
    console.log(e.detail, this.data.params)
  },
  getztd(e) {
    if (e.detail) {
      this.setData({
        'params.selfId': e.detail.id
      })
    }
    console.log(e.detail, this.data.params)
  },
  onChange(e) {
    this.setData({
      'params.num': e.detail.value
    })
    this.getTotal()
  },
  textareachange(e) {
    console.log(e.detail)
    this.setData({
      'params.note': e.detail
    })
  },
  storeInfo() {
    wx.navigateTo({
      url: "/pages/store/storemain/storedetail?id=" + this.data.goodsInfo.storeId,
    })
  },
  //立即下单
  formSubmit: function(e) {
    let that = this,
      co = this.data,
      v = e.detail.value;
    //自取时收货人联系方式从用户信息里给  
    if (co.params.delivery == '2') {
      this.setData({
        'params.receivedName': co.userinfo.userName,
        'params.receivedTel': co.userinfo.userTel,
      })
    }
    console.log('form发生了submit事件，携带数据为：', co, co.params, v)
    //校验表单
    let warn = "",
      flag = true;
    if (co.params.delivery == '1' && !co.params.receivedAddress) {
      warn = "请选择收货地址";
    } else if (co.params.delivery == '2' && !co.params.selfId) {
      warn = "请选择自提点";
    } else {
      flag = false;
      //return
      wx.showModal({
        title: '提示',
        content: "需要支付：" + co.params.totalMoney + "元",
        success: (res) => {
          //点击确定
          if (res.confirm) {
            app.util.getShowloading('提交中')
            app.api.prequest({
              'url': app.urlTwo.groupSaveOrder,
              'method': 'POST',
              data: co.params,
            }).then((res) => {
              if (res.code == '1') {
                let oid = res.data
                that.setData({
                  isshowpay: true,
                  payobj: {
                    params: {
                      money: co.params.totalMoney,
                      orderId: oid
                    },
                    apiurl: app.url.groupPay
                  }
                })
                // if (Number(co.params.money) > 0) {
                //   wx.hideLoading()
                //   that.setData({
                //     isshowpay: !that.data.isshowpay,
                //     payobj: {
                //       params: {
                //         money: co.params.totalMoney,
                //         orderId: oid
                //       },
                //       apiurl: app.urlTwo.mallGoodsPay
                //     }
                //   })
                // } else {
                //   app.util.getShowtoast('兑换成功')
                //   setTimeout(()=> {
                //     wx.redirectTo({
                //       url: '/pages/personal/integral/integralmall/myorder',
                //     })
                //   }, 1000)
                // }
              } else {
                app.util.getShowtoast(res.msg, 1000, 1)
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
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
  //支付
  payreturn(e) {
    console.log(e)
    if (e.detail == '1') {
      var params = {
        size:3,
        page:1,
        type:0
      }
    app.api.prequest({
      'url': app.urlTwo.groupMyGroup,
      data: params,
    }).then(res => {
      console.log(res.data)
      wx.navigateTo({
        url: '/pages/assemble/orderdetail?orderId=' + res.data[0].orderId + '&groupId=' + res.data[0].groupId,
      })
    })  
    } else if (e.detail == '2') {
      app.util.swnb()
    }
  },
  
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },



























})