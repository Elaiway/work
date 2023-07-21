// pages/index/help/info.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    app.setNavigationBarTitle('帮助中心')
    var num = wx.getStorageSync('help_info')
    var num2 = num.content.replace(/<img/gi, "<img class='richImg' style='width:auto!important;height:auto!important;max-height:100%;width:100%;'");
    num.content = num2
    console.log(num)
    this.setData({
      help_info:num
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  
})