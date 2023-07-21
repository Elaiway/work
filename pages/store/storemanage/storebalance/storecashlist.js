// pages/personal/storebalance/storecashlist.js
const app = getApp()
Page({
  data: {
    key: "0",
    tabs: [{
        name: "积分明细",
        id: 0
      },
      {
        name: "兑换记录",
        id: 1
      }
    ],
    postList: [],
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
    }
  },
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    app.setNavigationBarTitle('提现记录')
    this.setData({
      'params.storeId': app.sjdId,
      // 'params.storeId': options.storeId //调试
    })
    console.log(options)
    this.getPostlist();
  },
  //获取数据
  getPostlist(e) {
    let that = this,
      params = this.data.params
    app.api.prequest({
      url: app.urlTwo.cashList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].creatTime = app.util.ormatDate(res.data[i].creatTime).substring(5, 16)
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
      var postList = that.data.postList
      postList = postList.concat(res.data)
      that.setData({
        postList,
        isget: true,
      })
      console.log(res.data)
    })
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  }
})