// pages/coupon/myreceive.js
const app = getApp();
Page({
  data: {
    postList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    app.setNavigationBarTitle('优惠券详情')
    app.api.coupon(res => {
      that.setData({
        coupon: res,
      })
      console.log(res)
    })
    this.setData({
      logo: options.logo
    })
    console.log(options.logo)
    app.setNavigationBarColor(this, () => {
      this.goodsInfo(options.id)
    });
  },
  //优惠券详情
  goodsInfo(id) {
    let that = this,
      params = this.data.params;
    app.api.prequest({
      "url": app.url.couponCouponOrder,
      data: {
        id,
      },
    }).then(res => {
      res.data.endTime = app.util.ormatDate(res.data.endTime).substring(0, 16)
      res.data.createdAt = app.util.ormatDate(res.data.createdAt).substring(0, 16)
      res.data.storeLogo = app.util.getSingleImgUrl(res.data.storeLogo)
      let arr = [], obj = res.data.service
      for (let i in obj) {
        arr.push(obj[i])
      }
      that.setData({
        goodsInfo: res.data,
        'goodsInfo.service': arr
      })
      that.getCode()
      console.log(res.data)
    })
  },
  //获取二维码
  getCode(e) {
    app.api.prequest({
      "url": app.url.commongetCode,
      // 'method': 'POST',
      data: {
        scene: `${this.data.goodsInfo.id},${this.data.goodsInfo.storeId}`,
        pages: 'pages/coupon/writeoff'
      }
    }).then(res => {
      this.setData({
        hxm: res.data
      })
      // console.log(res.data)
    })
  },
  //预览图片
  previewImage(e) {
    const i = e.currentTarget.dataset.i
    const urls = app.util.getImgsUrl(JSON.parse(JSON.stringify(this.data.goodsInfo.media)))
    app.com.preImg({
      url: urls[i],
      urls
    })
  },
  //拨打电话
  onlinkTel(e) {
    app.util.makePhoneCall(this.data.goodsInfo.userTel)
  },
  //导航位置
  // chooseLocation: function () {
  //   var t = this;
  //   app.util.chooseLocation({
  //     success: res => {
  //       t.setData({
  //         'params.area': app.com.getArea(res.address).City + '-' + app.com.getArea(res.address).Country,
  //         'params.address': res.address + res.name,
  //         'params.lat': res.latitude,
  //         'params.lng': res.longitude,
  //       })
  //     }
  //   })
  // },
  onShow() {},
  onHide() {},
  onPullDownRefresh() {},
  onReachBottom() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.postList()
    }
  }
})