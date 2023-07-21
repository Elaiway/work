// pages/coupon/myreceive.js
const app = getApp();
Page({
  data: {
    postList: [],
    // statusArray: ['全部', '已付款', '已使用', '已过期'],
    statusArray: ["未付款", "已付款", "已发货", "已完成", "已过期", '已取消'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    app.setNavigationBarTitle('限时抢购订单详情')
    app.api.rushbuy(res => {
      this.setData({
        rushbuy: res,
      })
    })
    // this.setData({
    //   logo: options.logo
    // })
    // console.log(options.logo)
    app.setNavigationBarColor(this, () => {
      this.goodsInfo(options.id)
    });
  },
  //优惠券详情
  goodsInfo(id) {
    let that = this,
      params = this.data.params;
    app.api.prequest({
      "url": app.urlTwo.rushOrderInfo,
      data: {
        id,
      },
    }).then(res => {
      res.data.expireTime = app.util.ormatDate(res.data.expireTime).substring(0, 16)
      res.data.createdAt = app.util.ormatDate(res.data.createdAt).substring(0, 19)
      res.data.tips = this.data.statusArray[res.data.state];
      res.data.storeLogo = app.util.getSingleImgUrl(res.data.storeLogo)
      // let arr = [], obj = res.data.label
      // for (let i in obj) {
      //   arr.push(obj[i])
      // }
      that.setData({
        goodsInfo: res.data,
        // 'goodsInfo.label': arr
      })
      that.getCode()
      if (res.data.delivery==2){
        that.getAddressInfo()
      }
      console.log(res.data, res.data.label)
    })
  },
  //请求自提点地址信息
  getAddressInfo(e) {
    app.api.prequest({
      "url": app.urlTwo.addressInfo,
      data: {
        addressId: this.data.goodsInfo.selfId
      }
    }).then(res => {
      this.setData({
        addressInfo: res.data
      })
    })
  },
  //获取二维码
  getCode(e) {
    app.api.prequest({
      "url": app.url.commongetCode,
      // 'method': 'POST',
      data: {
        scene: `${this.data.goodsInfo.id}`,
        pages: 'pages/rushbuy/writeoff'
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
    const urls = app.util.getImgsUrl(JSON.parse(JSON.stringify(this.data.goodsInfo.showImgs)))
    app.com.preImg({
      url: urls[i],
      urls
    })
  },
  //拨打电话
  onlinkTel(e) {
    app.util.makePhoneCall(this.data.goodsInfo.userTel)
  },
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
  },
})