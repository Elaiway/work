// pages/message/reward/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
    isget:false,
    list:[]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options,6666)
    this.setData({
      postId: options.postId,
    })
    this.zanpaihang()
  },
  onPullDownRefresh () {
  wx.stopPullDownRefresh()
  },
  zanpaihang() {
    var params = {
      postId:this.data.postId
    }
    this.setData({
      isget:false
    })
    app.api.prequest({
      'url': app.urlTwo.zanpaihang,
      data: params,
      'method': 'get',
    }).then(res => {
      this.setData({
        isget:true
      })
      if (res.code == 1) {
       this.setData({
        list:res.data
       })
      } else {
        wx.showToast({
          title: res.msg,
          duration: 2000
        })
      }

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
    console.log(36663)
  },
  /**
   * 用户点击右上角分享
   */


})