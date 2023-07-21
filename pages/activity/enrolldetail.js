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
    app.setNavigationBarTitle('报名详情')
    app.setNavigationBarColor(this)
    this.setData({
      id: options.id,
      system: getApp().system
    })
    console.log(options.id)
    this.detailPage()
  },
  detailPage() {
    var that = this
    console.log(this.data.id)
    app.api.prequest({
      'url': app.url.activityEnrollDetail,
      data: {
        enrollId: this.data.id
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
      that.getCode()
      console.log(res.data, this.data.id)
    })
  },
  //获取二维码
  getCode(e){
    // app.api.prequest({
    //   "url": app.url.activityGetCode,
    //   'method': 'POST',
    //   data:{
    //     activityId: this.data.detailPage.activityId,
    //     enrollId: this.data.id,
    //   }
    // }).then(res =>{
    //   this.setData({
    //     hxm: res.data
    //   })
    //   // console.log(res)
    // })
    app.api.prequest({
      'url': app.url.commongetCode,
      data: {
        scene:this.data.detailPage.activityId+','+ this.data.id,
        pages: 'pages/activity/writeoff'
      }
    }).then(res => {
      this.setData({
        hxm: res.data
      })
    })



















  },
  //拨打电话
  onlinkTel(e){
    app.util.makePhoneCall(this.data.detailPage.linkTel)
  },
  onReady() {},
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
})