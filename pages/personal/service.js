var app = getApp();
Page({
  data: {
    params: {
      size: 10,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('客服')
    app.setNavigationBarColor(this)
    console.log(app.system, app)
    that.setData({
      contactCode: app.system.contactCode,
      qrcode: app.system.qrcode,
      phone: app.system.phone,
      version: app.version,
    })
    console.log(this.data)
  },

  //点击图片预览
  previewtCode(e) {
    let url = this.data.contactCode
    app.com.preImg({ url, urls: [url] })
    console.log(url)
  },

  //点击图片预览
  previewqrcode(e) {
    let url = this.data.qrcode
    app.com.preImg({ url, urls: [url] })
    console.log(url)
  },

  //点击拨打电话
  onCall(e) {
    let phone = this.data.phone;
    app.util.makePhoneCall(phone)
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  }
})