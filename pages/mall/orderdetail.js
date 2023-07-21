// pages/mall/refundorder.js
var app = getApp();
Page({
  data: {
    goodscardconfig: {
      nopadb: 1,
      num: 1,
      className: 'br-r-0'
    },
    loading: false,
    params: {
      orderId: '',
      state: 5,
      reason: ''
    },
    concat: [{
      icon: 'icon-xiaoxi',
      name: '联系客服'
    }, {
      icon: 'icon-dianhua',
      name: '拨打电话'
    }],
    statusArray: ['未付款', '已付款', '已发货', '已评价', '已完成', '申请退款中', '已退款', '已拒绝退款', '已取消', '待评价'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('订单详情')
    app.setNavigationBarColor(this);
    app.util.getShowloading()
    app.api.prequest({
      'url': app.urlTwo.mallOrderInfo,
      data: {
        orderId: options.id
      },
    }).then((res) => {
      res.data.createdAt = app.util.ormatDate(res.data.createdAt)
      res.data.wxImg = app.util.getImgUrl(res.data.wxImg)
      res.data.tips = this.data.statusArray[res.data.state];
      res.data.goods.forEach(item => {
        item.url = item.img
        item.title = item.name
      })
      this.setData({
        orderInfo: res.data,
        'params.orderId': options.id,
      })
      //获取核销码
      if (res.data.delivery == 2 && res.data.state == 2) {
        app.api.prequest({
          'url': app.url.commongetCode,
          data: {
            scene: `2,${res.data.id}`,
            pages: 'pages/bargain/writeoff'
          }
        }).then(res => {
          this.setData({
            hxm: res.data
          })
        })
      }
      // if ((res.data.state == 3||res.data.state == 4 || res.data.state == 9) && res.data.delivery == 2) {
      //   this.setData({
      //     code: res.data.code
      //   })
      // }
      app.api.prequest({
        'url': app.urlTwo.addressInfo,
        data: {
          addressId: res.data.selfId
        },
      }).then((res) => {
        this.setData({
          addressInfo: res.data,
        })
      })
    });
    console.log(options)
  },
  //核销码
  onGetCode(e) {
    console.log(e.detail)
    let code = this.data.orderInfo.code, v = e.detail.val;
    console.log(code, v.join(''), v.toString().replace(/,/g, ""))
    app.util.getShowloading()
    app.api.prequest({
      url: app.urlTwo.validateOrder,
      'method': 'POST',
      data: {
        code: v.toString().replace(/,/g, ""),
        orderId: this.data.orderInfo.id,
      }
    }).then(res => {
      if (res.code) {
        app.util.getShowtoast('核销成功')
        setTimeout((res) => {
          wx.navigateTo({
            url: '/pages/mall/order?key=4',
          })
        }, 1000);
      }
      else {
        app.util.getShowtoast(res.msg, 1000, 1)
      }
    })

  },
  concatClick(e){
    if (e.currentTarget.dataset.idx==0){
      app.com.preImg({ url: this.data.orderInfo.wxImg, urls:[this.data.orderInfo.wxImg] })
    }
    else{
      app.util.makePhoneCall(this.data.orderInfo.linkTel)
    }
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  }
})