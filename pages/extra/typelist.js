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
    console.log(options, JSON.parse(options.param))
    this.setData({
      'params.typeId': JSON.parse(options.param).id
    })
    app.setNavigationBarTitle(JSON.parse(options.param).title)
    app.setNavigationBarColor(this);
    that.getProlist()
  },
  // 获取商品列表
  getProlist(e) {
    let that = this,
      params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.url.goodsList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].logo = app.util.getImgUrl(res.data[i].logo)
      }
      // if (res.data.length < 10) {
      //   that.setData({
      //     // mygd: true,
      //   })
      // } 
      let typelist = res.data
      that.setData({
        typelist: typelist,
      })
    })
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