// pages/location/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotcity: [],
    color: "#5DB271",
    catalogSelect:0,
    openrSelect:'a'
  },
  selectMenu: function (e) {
    var that = this, typeindex = e.currentTarget.dataset.index, openl = this.data.openl, open = this.data.open;
    // console.log(typeindex, openl, open, open[typeindex - 1])
    this.setData({
      catalogSelect: typeindex,
      openr: typeindex==0 ? open : [open[typeindex-1]],
      // toView: 'order' + typeindex.toString(),
      // toType: 'type' + (typeindex - 2),
      scroll: ""
    });
    setTimeout(function () {
      that.setData({
        scroll: "scroll"
      });
    }, 500)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    app.setNavigationBarTitle('定位')
    this.getCity()
    this.setData({
      city: options.city
    })
  },
  getCity(e) {
    var that = this
    app.api.request({
      url: app.url.open,
      success: res => {
        console.log(res)
        var open = res.data.data
        that.setData({
          openl: [{ id: '', name: '全部' }].concat(open),
          openr:open,
          open: open,
        })
      }
    })
  },
  citys(e) {
    var data = e.currentTarget.dataset;
    console.log(data)
    // return
    app.globalData.city.cityName = data.psname
    app.globalData.city.cityId = data.psid
    app.globalData.city.zoneId = data.pssid
    app.globalData.city.defaultCity = data.pssname
    if (data.pssid == 0) {
      app.globalData.city.defaultId = data.psid
      app.globalData.city.zoneName = ''
    } else {
      app.globalData.city.defaultId = data.pssid
      app.globalData.city.zoneName = data.pssname
    }
    app.globalData.city.manual = true
    console.log(app.globalData.city)
    //获取已经打开的页面的数组
    var pages = getCurrentPages();
    //获取上一个页面的所有的方法和data中的数据
     
    var lastpage = pages[pages.length - 2]
    lastpage.seleCity()
    wx.navigateBack({
      delta: 1
    })
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