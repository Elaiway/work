// pages/mall/order.js
var app = getApp();
Page({
  data: {
    params: {
      num: 0,
      receivedName: null, //收货人
      receivedAddress: null, //收货人地址
      receivedTel: null, //收货人电话
      totalMoney: 0, //订单总金额
      freight: 0, //运费
      goodsMoney: 0, //商品总金额
      discountMoney: 0, //优惠总金额
      delivery: 1, //配送方式1快递，2到店
      goods: [], //商品信息二维数组（商品ID‘goodsId’，组合groupId，名称 name，金额money，数量 num，组合值data，图片img）
      couponId: '',
      selfId: '',
      note: '',
    },
    goodscardconfig: {
      num: 1,
      freight: 1,
      nopadb: 1,
    },
  },
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('提交订单')
    app.setNavigationBarColor(this);
    // 获取用户信息
    app.getUserInfo(function(userinfo) {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
    app.util.getShowloading()
    //获取商家信息配送模式
    this.getStoreInfo()
    //构造下单所需goods数组
    let carList = wx.getStorageSync('goodsArr'),
      arr = []
    carList.forEach(store => {
      store.goods.forEach(goods => {
        arr.push({
          goodsId: goods.goodsId,
          name: goods.title,
          img: goods.url, //封面
          freight: +goods.freight,
          money: +goods.money || goods.currentPrice || 0,
          groupId: goods.groupId,
          num: +goods.num,
          storeId: store.storeId,
          data: goods.data,
          childrenId: goods.childrenId || null
        })
      })
    })
    this.setData({
      'params.goods': JSON.stringify(arr),
      carList: wx.getStorageSync('goodsArr')
    })
    //获取优惠券
    app.api.prequest({
      'url': app.urlTwo.mallMyCoupon,
      data: {
        storeId: wx.getStorageSync('goodsArr')[0].storeId
      }
    }).then(res => {
      res.data.forEach(item => {
        item.startTime = app.util.ormatDate(item.startTime).substring(0, 10)
        item.endTime = app.util.ormatDate(item.endTime).substring(0, 10)
      })
      this.setData({
        myAllCoupon: res.data
      })
    })
  },
  //打开优惠券弹窗
  togglePopup() {
    if (this.data.popupshow == undefined) {
      this.changeCoupon()
    }
    this.setData({
      popupshow: !this.data.popupshow,
    })
  },
  //changeCoupon
  changeCoupon() {
    let myAllCoupon = this.data.myAllCoupon,
      goodsMoney = this.data.params.goodsMoney
    myAllCoupon.forEach(item => {
      if (item.reach <= goodsMoney) {
        if (this.data.xzcoupon && this.data.xzcoupon.id == item.id) {
          item.condition = 3 //满足条件且被选中
        } else {
          item.condition = 1 //满足条件未选中
        }
      } else {
        item.condition = 2 //不满足条件
      }
    })
    this.setData({
      myAllCoupon,
    })
    console.log(myAllCoupon, goodsMoney)
  },
  //选中优惠券
  ljsy(e) {
    let info = e.currentTarget.dataset.info
    this.setData({
      xzcoupon: info,
      'params.couponId':info.id,
      popupshow: !this.data.popupshow,
      discountMoney: info.type == 1 ? +info.discount : this.data.params.goodsMoney * (10 - info.discount) / 10
    })
    this.getTotal()
    this.changeCoupon()
    console.log(e.currentTarget.dataset.info)
  },
  //
  getTotal() {
    let carList = this.data.carList,
      totalMoney = 0,
      totalNum = 0,
      totalfreight = 0,
      goodsMoney = 0,
      discountMoney = this.data.discountMoney || 0
    carList.forEach(store => {
      store.goods.forEach(goods => {
        goodsMoney += Number(+goods.num * goods.money);
        totalfreight += goods.isPost == 1 || this.data.params.delivery == 2 || (goods.satisfy <= 0) || (goodsMoney >= +goods.satisfy) ? 0 : +goods.freight;
        totalNum += +goods.num
      })
    })
    totalMoney = (goodsMoney + totalfreight - discountMoney <= 0 ? 0.01 : goodsMoney + totalfreight - discountMoney).toFixed(2)
    this.setData({
      'params.num': totalNum,
      'params.totalMoney': totalMoney,
      'params.freight': totalfreight.toFixed(2),
      'params.goodsMoney': goodsMoney,
      'params.discountMoney': discountMoney,
    })
    wx.hideLoading()
    console.log(totalMoney, totalfreight, totalNum, this.data.params)
  },
  getStoreInfo() {
    app.api.prequest({
      'url': app.url.bussinessInfo,
      data: {
        id: wx.getStorageSync('goodsArr')[0].storeId
      }
    }).then(res => {
      let lcradioarr = []
      if (res.data.deliverMode == 1 || res.data.deliverMode == 3) {
        lcradioarr.push({
          name: '快递发货',
          value: '1',
        })
      }
      if (res.data.deliverMode == 2 || res.data.deliverMode == 3) {
        lcradioarr.push({
          name: '门店自取',
          value: '2',
        })
      }
      lcradioarr[0].checked = true
      this.setData({
        lcradioarr,
        'params.storeId': wx.getStorageSync('goodsArr')[0].storeId,
        'params.delivery': lcradioarr[0].value,
        storeInfo: res.data,
      })
      this.getTotal()
    })
  },
  lcrdioonChange(e) {
    this.setData({
      'params.delivery': e.detail.value
    })
    // console.log(e.detail.value)
    // 门店自提不要运费
    if (e.detail.value=='2'){
      this.setData({
        'goodscardconfig.freight':0,
        'params.freight': 0.00.toFixed(2),
        'params.totalMoney': (+this.data.params.totalMoney - +this.data.params.freight).toFixed(2),
      })
    }
    else{
      this.setData({
        'goodscardconfig.freight': 1,
      })
      this.getTotal()
    }
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
  textareachange(e) {
    console.log(e.detail.value)
    this.setData({
      'params.note': e.detail.value
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
        content: +co.params.totalMoney > 0 ? "需要支付：" + co.params.totalMoney + "元" : '确定下单吗',
        success: (res) => {
          //点击确定
          if (res.confirm) {
            app.util.getShowloading('提交中')
            app.api.prequest({
              'url': app.urlTwo.mallSaveOrder,
              'method': 'POST',
              data: co.params,
            }).then((res) => {
              if (res.code == '1') {
                let oid = res.data
                if (Number(co.params.totalMoney) > 0) {
                  that.setData({
                    isshowpay: true,
                    payobj: {
                      params: {
                        money: co.params.totalMoney,
                        orderId: oid
                      },
                      apiurl: app.url.mallGoodsPay
                    }
                  })
                } else {
                  app.util.getShowtoast('下单成功')
                  setTimeout(()=>{
                    wx.redirectTo({
                      url: '/pages/mall/order',
                    })
                  },1000)
                }
              } else {
                app.util.getShowtoast(res.msg, 1000, 2)
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
    console.log(e.detail)
    if (e.detail == '1' || e.detail == '2') {
      wx.redirectTo({
        url: '/pages/mall/order',
      })
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