// pages/vip/index.js
var app = getApp();
Page({
  data: {
    layoutBodyOne: {
      hd: 1,
      bd: {
        styleName: 'padding:0rpx 20rpx 10rpx 0'
      },
      img: {
        brs: 'br-r-10',
        wid: 170,
        hei: 170,
      },
    },
    key: '0',
    tabs: [{
        name: "未使用",
        id: 0,
      },
      {
        name: "已使用",
        id: 1,
      },
      {
        name: "已过期",
        id: 2,
      },
      {
        name: "礼包",
        id: 3,
      },
    ],
    storeList: [],
    goodlist: [],
    postList: [],
    params: {
      page: 1,
      size: 10,
      state:1,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('我的优惠')
    app.setNavigationBarColor(this)
    this.getPostlist(true)
  },
  //tabs切换
  onTabsChange(e) {
    this.setData({
      key: e.detail.key,
      'params.page': 1,
      'params.state': +e.detail.key+1,
      mygd: false,
      isget: false,
    })
    this.getPostlist(true)
    console.log('onTabsChange', e)
  },
  // 获取特权列表
  getPostlist(refresh) {
    app.util.getShowloading()
    let that = this, url = this.data.key == 3 ? 'vipMyPackage' :'vipMyPrivilege',
      params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.urlTwo[url],
      data: params,
    }).then(res => {
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      if (this.data.key != 3){
        res.data.forEach(item => {
          item.logo = app.util.getSingleImgUrl(item.logo)
        })
      }
      else{
        res.data.forEach(item => {
          item.endTime = app.util.ormatDate(item.endTime).substring(0,16)
        })
      }
      let postList = refresh ? res.data : that.data.postList.concat(res.data)
      that.setData({
        postList: postList,
        isget: true,
      })
    })
  },
  openMethod() {
    if (app.isLogin()) {
      wx.navigateTo({
        url: 'entervip',
      })
    }
  },
  goodinfo(e) {
    wx.navigateTo({
      url: 'giftdetails?id=' + e.currentTarget.dataset.id,
    })
  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  },
})