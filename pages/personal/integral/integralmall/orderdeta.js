// pages/integralmall-myorder/index.js
var app = getApp();
Page({
  data: {
    content2: {
      background: '#fff',
      number: 1,
      numberl: 1,
      body: {
        pad: 'pad_20 pa_b0',
        right: 1,
        width: 130,
        height: 130,
        // spec: 1,
      }
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this, j = JSON.parse(options.param)
    console.log(options)
    app.setNavigationBarTitle("订单详情")
    app.setNavigationBarColor(this);
    app.api.prequest({
      url: app.url.orderInfo,
      data: {
        orderId: j.orderId
      }
    }).then(res => {
      let orderInfo = res.data
      let codearr = orderInfo.selfAddress[0]
      orderInfo.createdAt = app.util.ormatDate(orderInfo.createdAt).substring(0, 16)
      // name = JSON.stringify(arr[1]), 
      // tel = JSON.stringify(arr[2]),
      // ads = JSON.stringify(arr[3]);
      // console.log(arrs)
      // let codearr = newval.toString().split('')
      console.log(codearr)
      let arr = []
      for (let i = 0; i < codearr.length; i++) {
        let e = {}
        e.name = codearr[i]
        // 这里还可以继续添加属性 j.属性 = 值
        arr.push(e)
      }
      console.log(codearr,arr[1].name)
      that.setData({
        orderInfo,
        goodsInfo: j,
        "orderInfo.selfAddress":arr[1].name,
        "orderInfo.tel": arr[2].name,
        "orderInfo.ads": arr[3].name,
      })
      let status = this.data.goodsInfo.status, 
      delivery = this.data.goodsInfo.delivery
      if (status == 3 && delivery==2){
        this.setData({
          code:orderInfo.code
        })
      }
      console.log(that.data, orderInfo,this.data.goodsInfo)
    })
  },
  //核销码
  onGetCode(e){
    console.log(e.detail)
    // console.log(j)
    let code = this.data.orderInfo.code, v = e.detail.val;
    // code.join(',')
    // code.split(',')
    console.log(code, v.join(''),v.toString().replace(/,/g, ""))
    
    app.api.prequest({
      url: app.url.orderCon,
      'method': 'POST',
      data:{
        code: v.toString().replace(/,/g, ""),
        orderId: this.data.orderInfo.id,
      }
    }).then(res => {
      if (code == v.join('')) {
        wx.showToast({
          title: '核销成功',
          success:  (res) => {
            setTimeout( (res) => {
              wx.reLaunch({
                url: '/pages/personal/integral/integralmall/myorder',
              })
            }, 1000);
          }
        })
        console.log(v.toString().replace(/,/g, ""))
        this.setData({
          code: v,
        })
      }
      else if (code !== v.join('')){
        wx.showModal({
          title: '核销码错误请重试',
        })
      }
    })
    
  },
  //联系买家
  clickBuyer(e){
    wx.navigateTo({
      url: '/pages/personal/service',
    })
  },
  //拨打电话
  clickCall(e){  
    let orderInfo = this.data.orderInfo;
    app.util.makePhoneCall(orderInfo.receivedTel)
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