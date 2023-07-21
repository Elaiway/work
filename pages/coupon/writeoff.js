// pages/coupon/myreceive.js
const app = getApp();
Page({
  data: {
    postList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    app.setNavigationBarTitle('商家扫码核销')
    app.api.coupon(res => {
      that.setData({
        coupon: res,
      })
      console.log(res)
      // scene = 9, 105
    })
    let scene = decodeURIComponent(options.scene).split(',')
    console.log(decodeURIComponent(options.scene), scene)
    this.setData({
      id: scene[0],
      storeId: scene[1],
      // logo: scene[2]
    })
    app.setNavigationBarColor(this)
    this.goodsInfo()
  },
  //订单详情
  goodsInfo(id) {
    let that = this,
      params = this.data.params;
    app.api.prequest({
      "url": app.url.couponCouponOrder,
      data: {
        id: this.data.id
      },
    }).then(res => {
      res.data.endTime = app.util.ormatDate(res.data.endTime).substring(0, 16)
      res.data.createdAt = app.util.ormatDate(res.data.createdAt).substring(0, 16)
      res.data.storeLogo = app.util.getSingleImgUrl(res.data.storeLogo)
      that.setData({
        goodsInfo: res.data
      })
      console.log(res.data)
      this.goodsDetail()
    })
  },
  //优惠券详情
  goodsDetail(e) {
    app.api.prequest({
      'url': app.url.couponInfo,
      data: {
        id: this.data.goodsInfo.couponId
      },
    }).then((res) => {
      res.data.logo = app.util.getSingleImgUrl(res.data.logo)
      this.setData({
        goodsdetail: res.data,
      })
      console.log(res.data)
    })
  },
  //点击核销
  onverification(e) {
    //return
    let that = this
    console.log(this.data.id, this.data.storeId)
    wx.showModal({
      title: '提示',
      content: '确认要核销该订单吗？',
      success(res) {
        if (res.confirm) {
          app.api.prequest({
            "url": app.url.couponUseCoupon,
            'method': 'POST',
            data: {
              id: that.data.id,
              storeId: that.data.storeId,
            }
          }).then(res => {
            console.log(res)
            if (res.code == '1') {
              app.util.getShowtoast("操作成功")
            } else {
              app.util.getShowtoast(res.msg)
            }
            console.log('add', res.msg)
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
        // app.util.getShowloading()
      }
    })
  },
  onShow() {},
  onHide() {},
  onPullDownRefresh() {}
})