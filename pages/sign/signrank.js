// pages/personal/integral/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: "0",
    tabs: [{
        name: "今日排行",
        id: 0
      },
      {
        name: "总排行",
        id: 1
      }
    ],
  },
  //点击跳转积分明细
  interval(e) {
    wx.navigateTo({
      url: '/pages/personal/integral/index?current=' + e.currentTarget.dataset.type,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.current != null) {
      this.setData({
        key: options.current,
      })
    }
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    app.setNavigationBarTitle('签到排行')
    app.api.userinfo((info) => {
      console.log(info)
      this.setData({
        userinfo: info,
      })
    })
    this.switchOut()
  },
  //今日排行总排行
  switchOut() {
    app.api.prequest({
      url: app.url.signRank,
    }).then(res => {
      let signRank = this.data.key == 0 ? res.data.today : res.data.all, unull = res.data.all
      //无名称无图像用户默认图像名称
      for (let i = 0; i < unull.length;i++){
        if (unull[i].userName == null || unull[i].portrait == null){
          unull[i].userName = '默认名称'
          unull[i].portrait = '/assets/images/personal/mrtx.png'
        }
        // console.log(unull[i].userName == null)
      }
      this.setData({
        signRank,
        myRank: res.data.myRank,
        myRankAll: res.data.myRankAll,
      })
      console.log(this.data.key)
    })
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    this.setData({
      key,
    })
    this.switchOut()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})