// pages/coupon/myreceive.js
const app = getApp();
Page({
  data: {
    tabs: [{
      name: "全部",
      id: 0,
    }, {
      name: "未核销",
      id: 1,
    }, {
      name: "已使用",
      id: 2,
    }, {
      name: "已结束",
      id: 3,
    }, ],
    current: '0',
    postList: [],
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
      // type: 0,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    app.api.coupon(res => {
      app.setNavigationBarTitle(res.field)
      that.setData({
        coupon: res,
      })
      console.log(res)
    })
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
      "params.state": key,
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
      "url": app.url.couponMyCoupon,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].logo = app.util.getSingleImgUrl(res.data[i].logo)
        res.data[i].endTime = app.util.ormatDate(res.data[i].endTime).substring(0, 16)
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
  //点击核销
  writeoff(e) {
    wx.navigateTo({
      url: '/pages/coupon/receivedetails?id=' + e.currentTarget.dataset.info.id + '&logo=' + e.currentTarget.dataset.info.logo,
    })
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
  }
})