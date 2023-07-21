// pages/message/allcomments/index.js
const app = getApp()
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
    console.log(options)
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    app.setNavigationBarTitle('评论详情')
    this.getCommentlist(options)
    this.setData({
    
    })
  },
  // 获取信息列表信息
  getCommentlist(list) {
    var _f = this.data, that = this
    app.api.request({
      url: app.url.commentDetails,
      data: {
        commentId: list.commentId,
      },
      success: res => {
        console.log('评论详情信息', res)
        var commend = res.data.data[0]
        commend.creatTime = app.util.settime(commend.creatTime)
        commend.color = that.data.color
        for (let i in commend.reply) {
          commend.reply[i].creatTime = app.util.settime(commend.reply[i].creatTime)
        }
        that.setData({
          commend: commend
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

  },

})