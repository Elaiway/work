// pages/message/reward/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ac_index: 0,
    isshowpay: false,
    price: [
      '1', '2', '3', '5', '10',
    ],
    money: '1',
    color: "#5DB271"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    app.setNavigationBarTitle('打赏楼主')
    app.getUserInfo(function(userinfo) {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
        id: options.id
      })
    })
    app.api.prequest({
      'url': app.url.zxReward,
    }).then(res => {
      this.setData({
        price: res.data.map(v=>v.money||1),
      })
    })
  },
  reward(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      ac_index: index,
      money: e.currentTarget.dataset.price
    })
  },
  // 调用支付
  giveMoney(e) {
    console.log(this.data)
    // app.getShowmodel(this.data.money+'')
    this.setData({
      isshowpay: !this.data.ishowpay,
      payobj: {
        params: {
          money: this.data.money,
          informationId: this.data.id,
          userId: this.data.userinfo.id
        },
        apiurl: app.url.rewardPay
      }
    })
  },
  // 支付成功
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      wx.navigateBack({
        
      })
    }
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

  },

})