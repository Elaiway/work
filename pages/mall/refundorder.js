// pages/mall/refundorder.js
var app = getApp();
Page({
  data: {
    goodscardconfig: {
      nopadb: 1,
      num:1,
    },
    loading:false,
    params:{
      orderId:'',
      state:5,
      reason:''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.setNavigationBarTitle('申请退款')
    app.setNavigationBarColor(this);
    app.util.getShowloading()
    app.api.prequest({
      'url': app.urlTwo.mallOrderInfo,
      data: { orderId: options.id},
    }).then((res) => {
      res.data.goods.forEach(item => {
        item.url = item.img
        item.title=item.name
      })
      this.setData({
        orderInfo:res.data,
        'params.orderId': options.id,
      })
    });
    console.log(options)
  },
  textareachange(e) {
    this.setData({
      'params.reason': e.detail,
    })
    console.log(e)
  },
  confirm() {
    let params = this.data.params;
    if (!params.reason) return app.util.getShowtoast('请输入退款理由', 1000, 1)
    this.setData({
      loading: true,
    })
    app.util.getShowloading('提交中')
    app.api.prequest({
      'url': app.urlTwo.mallCancelOrder,
      'method': 'POST',
      data: params,
    }).then((res) => {
      if (res.code == '1') {
        app.util.getShowtoast('操作成功')
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/mall/order?key=6',
          })
        }, 1000)
      } else {
        app.util.getShowtoast(res.msg, 1000, 1)
      }
    });
    console.log(params)
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onPullDownRefresh: function () {

  }
})