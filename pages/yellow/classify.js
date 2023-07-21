// pages/yellow-page/classify.js
var app = getApp();
Page({
  data: {
    Search: {
      "position": 0,
      "shape": 3,
      "height": 55,
      "borderStyle": 0,
      "fontStyle": "left",
      "recommendSearch": 1,
      "searchBoxList": [],
      "keyWords": "全城电话任意搜索..."
    },
    typeArr:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.setNavigationBarColor(this);
    app.api.prequest({
      'url': app.url.yellowConfig,
      'cachetime': 30,
    }).then(res => {
      app.setNavigationBarTitle('分类—'+res.data.field)
    })
    app.api.prequest({
      'url': app.url.category,
      data: { type: '8'}
      }).then(res=>{
        console.log(res)
        var postNav = res.data
        for (let i in postNav) {
          postNav[i].url = postNav[i].icon == "''" ? '' : app.util.getImgUrl(postNav[i].icon)
        }
        that.setData({
          typeArr:postNav
        })
        console.log(postNav)
    })
  },
  listDetail: function(e){
    wx.navigateTo({
      url: '/pages/yellow/listdetail?info=' + JSON.stringify(e.currentTarget.dataset.item),
    })
    //console.log( e.currentTarget.dataset.id)
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
})
