// pages/mall/category.js
var app = getApp();
Page({
  data: {
    acindex:0,
  },
  onLoad: function (options) {
    var that = this;
    app.setNavigationBarTitle('分类')
    app.api.mall(res => {
      app.setNavigationBarTitle(res.field)
      this.setData({
        mallConfig: res,
      })
    })
    app.setNavigationBarColor(this, ()=>{
      this.mallFullCategory()
    });
    wx.getSystemInfo({
      success: function (res) {
        console.log(res, parseInt((750 / res.windowWidth) * res.windowHeight) - 115)
        that.setData({
          height: parseInt((750 / res.windowWidth) * res.windowHeight) - 115,
        })
      }
    })
  },
  selectMenu(e){
    this.setData({
      acindex: e.currentTarget.dataset.pindex,
      toType: 'type' + (e.currentTarget.dataset.pindex - 2),
      toSonType: 'type' + e.currentTarget.dataset.pindex,
      // scrolltop: 0,
    })
  },
  mallFullCategory() {
    app.api.prequest({
      'url': app.urlTwo.mallFullCategory,
    }).then((res) => {
      res.data.forEach(item=>{
        for(let i in item.son){
          if (item.son[i].name){
            item.son[i].icon = app.util.getImgUrl(item.son[i].icon)
          }
        }
      })
      this.setData({
        category: res.data
      })
    })
  },
  goson(e){
    console.log(e)
    app.util.goUrl({
      param: e.currentTarget.dataset.item,
      // param: `${e.currentTarget.dataset.item.pid},${e.currentTarget.dataset.item.id}`,
      value: "shopCategory"
    })
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})