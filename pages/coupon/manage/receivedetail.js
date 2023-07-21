// pages/coupon/myreceive.js
const app = getApp();
Page({
  data: {
    key: 0,
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
      state: '',
    },
    statusArray: ['全部', '待核销', '已使用', '已过期', ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    app.setNavigationBarTitle('领取详情')
    this.setData({
      'params.couponId': options.id
    })
    app.setNavigationBarColor(this)
    this.onTabsChange({
      detail: {
        key: this.data.key
      }
    })
    console.log(options)
  },
  //tabs切换
  onTabsChange(e) {
    const {
      key
    } = e.detail
    this.setData({
      key,
      postList: [],
      "params.state": key,
      "params.page": 1,
      mygd: false,
      isget: false,
    })
    this.getPostlist()
  },
  // 获取列表信息
  getPostlist(e) {
    let that = this,
      params = this.data.params;
    app.api.prequest({
      "url": app.urlTwo.couponReceiveCouponList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
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
  //拨打电话
  onlinkTel(e) {
    app.util.makePhoneCall(e.currentTarget.dataset.tel)
  },
  onShow() {},
  onHide() {},
  onPullDownRefresh() {},
  onReachBottom: function () {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  }
})