// pages/extra/verification.js
var app = getApp();
Page({
  data: {
    params:{
      type:1
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('口碑商家')
    // app.setNavigationBarColor(this);
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#F04D3E',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.getList()
  },
  changeBtn(e){
    this.setData({
      'params.type':e.currentTarget.dataset.type,
    })
    this.getList()
  },
  getList() {
    app.api.prequest({
      'url': app.url.businessRank,
      data: this.data.params,
    }).then(res => {
      res.data.forEach(item=>{
        item.storeLogo = app.util.getImgUrl(item.storeLogo)
      })
      this.setData({
        dataList:res.data
      })
    });
    app.api.prequest({
      'url': app.url.configRank,
    }).then(res => {
      this.setData({
        configRank: res.data
      })
    });
  },
  storeInfo(e) {
    app.util.goUrl({
      param: e.currentTarget.dataset.id,
      value: "businessInfo"
    })
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  }
})