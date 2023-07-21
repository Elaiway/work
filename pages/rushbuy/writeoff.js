// pages/coupon/myreceive.js
var app = getApp(),
  dsq;
Page({
  data: {
    postList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    app.setNavigationBarTitle('核销')
    app.api.rushbuy(res => {
      this.setData({
        rushbuy: res,
      })
    })
    let scene = decodeURIComponent(options.scene).split(',')
    console.log(decodeURIComponent(options.scene), scene)
    this.setData({
      id: scene,
    })
    app.setNavigationBarColor(this)
    this.goodsInfo()
  },
  //核销订单详情
  goodsInfo(id) {
    let that = this,
      params = this.data.params;
    app.api.prequest({
      "url": app.urlTwo.rushOrderInfo,
      data: {
        id: this.data.id
      },
    }).then(res => {
      res.data.createdAt = app.util.ormatDate(res.data.createdAt).substring(0, 19)
      res.data.showImgs = app.util.getImgUrl(res.data.showImgs)
      that.setData({
        goodsInfo: res.data
      })
      console.log(res.data)
      that.goodsDetail()
    })
  },
  //抢购详情
  goodsDetail(e){
    app.api.prequest({
      'url': app.urlTwo.rushGoodsInfo,
      data: {
        id: this.data.goodsInfo.goodsId
      },
    }).then((res) => {
      //倒计时
      let timeStamp = parseInt(res.data.endTime || 0) - parseInt(new Date().getTime() / 1000);
      this.setData({
        endTime: app.com.countDownTime(timeStamp)
      })
      dsq = setInterval(() => {
        timeStamp -= 1
        if (timeStamp <= 0) clearInterval(dsq)
        this.setData({
          endTime: app.com.countDownTime(timeStamp)
        })
        // console.log('倒计时', this.data.endTime)
      }, 1000)
      //已抢百分比
      let robbed = parseInt(res.data.salesNum / (parseInt(res.data.num) + parseInt(res.data.salesNum)) * 100)
      console.log(parseInt(res.data.salesNum / (parseInt(res.data.num) + parseInt(res.data.salesNum)) * 100))
      this.setData({
        goodsdetail: res.data,
        robbed,
      })
     
    })
  },
  //跳转抢购详情
  goodinfo() {
    wx.navigateTo({
      url: '/pages/rushbuy/detail?id=' + this.data.goodsInfo.goodsId,
    })
  },
  //点击核销
  onverification(e) {
    //return
    let that = this
    console.log(this.data.id)
    wx.showModal({
      title: '提示',
      content: '确认要核销该订单吗？',
      success(res) {
        if (res.confirm) {
          app.api.prequest({
            "url": app.urlTwo.rushVerify,
            'method': 'POST',
            data: {
              id: that.data.id,
              // storeId: that.data.storeId,
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
  onUnload: function () {
    clearInterval(dsq)
  },
  onPullDownRefresh() {}
})