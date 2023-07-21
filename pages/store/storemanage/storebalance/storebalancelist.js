// pages/personal/integral/index.js
const app = getApp()
Page({
  data: {
    key: "0",
    tabs: [{
        name: "已入账",
        id: 0
      },
      {
        name: "未入账",
        id: 1
      }
    ],
    page: 1,
    postList: [],
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
      type: 1,
      item: '',
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    app.setNavigationBarTitle('收入纪录')
    this.setData({
      // 'params.storeId': app.sjdId,
      'params.item': options.item,
      'params.storeId': options.storeId 
    })
    console.log(options, options.item, options.storeId)
    // this.onTabsChange(
    //   {
    //     detail:{
    //       key:this.data.key
    //     }
    //   }
    // )
    this.getPostlist();
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    this.setData({
      key,
      postList: [],
      "params.type": key + 1,
      "params.page": 1,
      mygd: false,
      isget: false,
    })
    this.getPostlist()
  },
  //获取
  getPostlist(e) {
    let that = this,
      params = this.data.params
    app.api.prequest({
      url: app.urlTwo.balanceList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].createdAt = app.util.ormatDate(res.data[i].payTime).substring(5, 16)
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
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  }
})