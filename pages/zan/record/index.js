// pages/message/reward/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isget: false,
    list:[],
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  getList(){
    this.setData({
      isget: false,
    })
    var params = {
      page:this.data.page,
      size:10
    }
    app.api.prequest({
      'url': app.urlTwo.myShera,
      data: params,
      'method': 'get',
    }).then(res => {
      this.setData({
        isget: true,
      })
      if (res.code == 1) {
        var arr = this.data.list.concat(res.data)
        this.setData({
          list:arr
        })
      } 
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
    var that = this
    that.setData({
      page: this.data.page + 1
    })
    that.getList()

  },
  /**
   * 用户点击右上角分享
   */


})