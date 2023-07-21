// pages/integral/integralmall/payment.js
var app = getApp();
Page({
  data: {
    content1: {
      background: '',
      type: 1,
      body: {
        width: 180,
        height: 180,
        secright: 1,
        third: 1,
        spec: "商品规格商品规格",
        num: 1
      }
    },
   
    // "goodsInfo.specification": "商品规格商品规格",
    paybtn: '立即下单',
    // max:'2',
    // content2: {
    //   background: '',
    //   type: 1,
    //   goodsinfo: {
    //     right: 1,
    //     width: 130,
    //     height: 130,
    //   }
    // },
    // content3: {
    //   background: '#fff',
    //   header: 1,
    //   number: 1,
    //   footer: 1,
    //   type:3,
    //   goodsinfo: {
    //     pad:'pa_l30',
    //     third: 1,
    //     width: 180,
    //     height: 180,
    //   },
    //   footerb: {
    //     btnl: "查看详情",
    //     btnr: "去支付",
    //   }
    // },
    params:{},
  },
  lcrdioonChange(e) {
    this.setData({
      'params.lcradiovalue': e.detail.value
    })
  },
  getaddress(e) {
    if(e.detail){
      this.setData({
        'params.receivedName': e.detail.linkName || '',
        'params.receivedAddress': (e.detail.address + e.detail.detailedAddress) || '',
        'params.receivedTel': e.detail.linkTel || '',
      })
    }
    else{
      this.setData({
        'params.receivedAddress': '',
      })
    }
    console.log(e.detail, this.data.params)
  },
  onChange(e) {
    let score = this.data.goodsinfo.score
    let money = this.data.goodsinfo.money
    let deliveryMoney = this.data.goodsinfo.deliveryMoney
    let integral = this.data.userinfo.integral
    // let paybtn = this.data.paybtn
    // console.log(this.data.paybtn)
    // if (integral < e.detail.value * score) {
    //   this.setData({
    //     paybtn: '积分不足',
    //   })
    //   return
    // }
    this.setData({
      value: e.detail.value,
      "params.num": e.detail.value,
      "params.score": e.detail.value * score,
      "params.money": (e.detail.value * money + deliveryMoney).toFixed(2),
    })

    console.log(e.detail.value)
    console.log('积分', score)
    console.log('配送费', deliveryMoney)
  },

  //
  // textareachange(e) {
  //   console.log(e.detail)
  //   this.setData({
  //     'params.textareavalue': e.detail
  //   })
  // },
  // formSubmit(e) {
  //   console.log('form发生了submit事件，携带数据为：', e.detail.value, this.data.params)
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log(options)
    app.setNavigationBarTitle("订单支付")
    app.setNavigationBarColor(this);
    app.api.prequest({
      url: app.url.goodsinfo,
      data: {
        id: options.id,
      }
    }).then(res => {
      res.data.logo = app.util.getImgUrl(res.data.logo)
      res.data.score = +res.data.score
      res.data.money = +res.data.money
      res.data.deliveryMoney = +res.data.deliveryMoney
      let goodsinfo = res.data,
      // let str = 'content1.goodsinfo',
        lcradioarr = [{
            name: '快递发货',
            value: '1',
            checked: true
          },
          {
            name: '到店自取',
            value: '2',
          }
        ];
      // let score = res.data.score
      // let params = res.data
      console.log(goodsinfo)
      // Object.assign(goodsinfo, {
      //   width: 180,
      //   height: 180,
      //   secright: 1,
      //   third: 1,
      //   num: 1
      // })
      let yf = goodsinfo.deliveryMoney
      if (goodsinfo.delivery == 1) {
        lcradioarr.splice(1, 1)
      }
      if (goodsinfo.delivery == 2) {
        lcradioarr.splice(0, 1)
        lcradioarr[0].checked = true
        yf = 0
      }
      // console.log(res.data)
      // console.log(this.data.params.address.linkTel);
      // let tel = that.data.params.address.linkTel;
      // let name = that.data.params.address.linkName
      // let ads = that.data.params.address.address
      that.setData({
        lcradioarr,
        // [str]: goodsinfo,
        goodsinfo: goodsinfo,
        params: {
          lcradiovalue: '1',
          goodsId: goodsinfo.id,
          score: goodsinfo.score,
          money: goodsinfo.money + yf,
          num: 1,
          deliveryMoney: goodsinfo.deliveryMoney,
        },
      })
      app.api.prequest({
        url: app.url.userInfo
      }).then(ures => {
        // let int = ures.data.integral
        let userinfo = ures.data
        let max = parseInt(ures.data.integral / goodsinfo.score)
        console.log(ures.data.integral)
        console.log(goodsinfo.score)
        that.setData({
          userinfo,
          max,
          // "that.data.max":max,
        })
        console.log(that.data)
      })
      // app.api.prequest({
      //   url: app.url.myAddress,
      //   // data:{
      //   //   num:1
      //   // },
      // }).then(res => {
      //   console.log(res.data)
      //   let address = res.data
        
      // })
    })

  },
  //立即下单
  formSubmit: function(e) {
    let that = this,
      co = this.data,
      v = e.detail.value;
    console.log('form发生了submit事件，携带数据为：', co, co.params, v)
    //校验表单
    let warn = "",
      flag = true;
    // console.log('12345',co.lcradioarr)
    if (co.lcradioarr[0].value=='1' &&!co.params.receivedAddress) {
      warn = "请选择收货地址";
    } else {
      flag = false;
      app.util.getShowloading('提交中')
      console.log('请求接口')
      // return
      //add
      app.api.request({
        'url': app.url.saveOrder,
        'method': 'POST',
        data: co.params,
        success: function (res) {
          if (res.data.code == '1') {
            let oid = res.data.data
            if (Number(co.params.money) > 0) {
              wx.hideLoading()
              that.setData({
                isshowpay: !that.data.ishowpay,
                payobj: {
                  params: {
                    money: co.params.money,
                    orderId: oid
                  },
                  apiurl: app.url.integralPay
                }
              })
            } else {
              app.util.getShowtoast('兑换成功', 1000)
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/personal/integral/integralmall/myorder',
                })
              }, 1000)
            }
          } else {
            app.util.getShowtoast(res.data.msg, 1000, 2)
          }
          console.log('add', res.data)
        }
      });
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
    if (e.detail == '1') {
      wx.redirectTo({
        url: '/pages/personal/integral/integralmall/myorder',
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
  onShareAppMessage: function() {

  }
})