// pages/coupon/myreceive.js
const app = getApp();
Page({
  data: {
    tabs: [{
      name: "全部",
      id: 0,
    }, {
      name: "未使用",
      id: 1,
    }, {
      name: "已使用",
      id: 2,
    }, {
      name: "已过期",
      id: 3,
    }, ],
    current: '0',
    postList: [],
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
      type: 0,
    },
    statusArray: ['', '已付款', '已发货', '已完成','已过期'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    app.api.rushbuy(res => {
      that.setData({
        rushbuy: res,
      })
      console.log(res)
    })
    app.setNavigationBarTitle('限时抢购订单')
    app.setNavigationBarColor(this)
    this.postList()
    // app.setNavigationBarColor(this, () => {
    //   app.isLocation(() => {
    //     //定位后请求头才带有cityId，zoneId
    //   })
    // });
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    let info = this.data.tabs.find(item => item.id == key)
    this.setData({
      key,
      postList: [],
      // "params.state": key,
      "params.type": key,
      "params.page": 1,
      mygd: false,
      isget: false,
    })
    this.postList()
    console.log(key)
  },
  //领取列表
  postList(e) {
    let that = this,
      params = this.data.params;
    app.api.prequest({
      "url": app.urlTwo.rushOrderList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].showImgs = app.util.getImgUrl(res.data[i].showImgs)
        res.data[i].expireTime = app.util.ormatDate(res.data[i].expireTime).substring(0, 16)
        res.data[i].createdAt = app.util.ormatDate(res.data[i].createdAt).substring(0, 16)
        res.data[i].tips = this.data.statusArray[res.data[i].state]
      }
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      let postList = that.data.postList
      postList = postList.concat(res.data)
      that.setData({
        postList,
        isget: true,
      })
      console.log(res.data)
    })
  },
  //详情页面
  writeoff(e){
    wx.navigateTo({
      url: '/pages/rushbuy/receivedetails?id=' + e.currentTarget.dataset.info.orderId,
    })
  },
  //点击按钮
  // writeoff(e) {
  //   wx.navigateTo({
  //     url: '/pages/rushbuy/receivedetails?id=' + e.currentTarget.dataset.info.orderId,
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