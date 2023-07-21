var app = getApp();
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
    console.log(options, wx.getStorageSync('vr'))
    var that = this;
    that.setData({
      vr: wx.getStorageSync('vr')
    })
  }
})