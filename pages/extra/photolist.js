var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.navigateBack({

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(JSON.parse(options.arr))
    app.setNavigationBarTitle('相册')
    app.setNavigationBarColor(this);
    that.setData({
      photoList: JSON.parse(options.arr)
    })
  },
  previewImage: function (e) {
    var that = this,
      urls = that.data.photoList.map((item) => {
        return item.url
      });
    console.log(e,urls)
    wx.previewImage({
      current: e.currentTarget.id,
      urls: urls
    })
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
})