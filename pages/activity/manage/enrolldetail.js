// pages/activity/enrolldetail/.js
const app = getApp()
Page({
  data: {
    enrollList: [],
    mygd: false,
    isget: false,
    page: 1,
    size: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('报名详情')
    app.setNavigationBarColor(this)
    this.setData({
      id: options.id
    })
    this.enrollList()
  },
  //报名列表
  enrollList() {
    let that = this
    app.api.prequest({
      'url': app.urlTwo.activityEnrollList,
      data: {
        page: 1,
        size: 10,
        activityId: this.data.id
      },
    }).then(res => {
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          page: that.data.page + 1,
        })
      }
      let enrollList = that.data.enrollList
      enrollList = enrollList.concat(res.data)
      let enrollTlist = enrollList.length ? enrollList[0].enroll : '' 
      that.setData({
        enrollList,
        enrollTlist,
        isget: true,
      })
      console.log(res.data, enrollTlist)
    })
  },
  onReady: function() {},
  onHide: function() {},
  onUnload: function() {},
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.enrollList()
    }
  },
  onPullDownRefresh: function() {},
})