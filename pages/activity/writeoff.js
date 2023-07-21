// pages/freeride/index/.js
const app = getApp()
Page({
  data: {
    detailPage: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('报名核销')
    app.setNavigationBarColor(this)
    let scene = decodeURIComponent(options.scene).split(',')
    console.log(decodeURIComponent(options.scene), scene)
    this.setData({
      activityId: scene[0],
      enrollId: scene[1]
    })
    console.log(scene[0], scene[1])
    this.detailPage()
    //获取用户信息
    app.getUserInfo((userinfo) => {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
        validateId: userinfo.id
      })
    })
  },
  detailPage() {
    var that = this
    // console.log(this.data.id)
    app.api.prequest({
      'url': app.url.activityEnrollDetail,
      data: {
        enrollId: this.data.enrollId
      }
    }).then(res => {
      res.data.showImgs = app.util.getImgUrl(res.data.showImgs)
      res.data.startTime = app.util.ormatDate(res.data.startTime).substring(0, 16)
      res.data.endTime = app.util.ormatDate(res.data.endTime).substring(0, 16)
      res.data.payTime = app.util.ormatDate(res.data.payTime).substring(0, 16)
      let detailPage = res.data
      that.setData({
        detailPage,
      })
      // console.log(res.data, this.data.id)
    })
  },
  //点击核销
  onverification(e) {
    let that = this
    console.log(this.data.activityId, this.data.enrollId, this.data.validateId)
    wx.showModal({
      title: '提示',
      content: '确认要核销该订单吗？',
      success(res) {
        if (res.confirm) {
          app.api.prequest({
            "url": app.url.activityVerification,
            'method': 'POST',
            data: {
              activityId: that.data.activityId,
              enrollId: that.data.enrollId,
              validateId: that.data.validateId
            }
          }).then(res => {
            console.log(res)
            if (res.code == '1') {
              app.util.getShowtoast("操作成功")
              wx.navigateTo({
                    url: '/pages/activity/index'
                  })
            } else {
              app.util.getShowtoast(res.msg)
            }
            console.log('add', res.msg)
          })
          console.log('用户点击确定')
        } 
        else if (res.cancel) {
          console.log('用户点击取消')
        }
        // app.util.getShowloading()
      }
    })
  },
  onReady() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
})