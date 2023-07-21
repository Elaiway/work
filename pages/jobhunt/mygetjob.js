// pages/job-hunt/myjobhunt.js
const app = getApp();
Page({
  data: {
    jobrecruitResume: [],
    mygd: false,
    isget: false,
    key: '0',
    lookdl:1,
    params: {
      page: 1,
      size: 10,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.setNavigationBarTitle('收到的简历')
    app.setNavigationBarColor(this);
    this.setData({
      'params.recruitId': options.id
    })
    console.log(options.id)
    that.jobrecruitResume()
  },
  //收到的简历列表
  jobrecruitResume(e) {
    let that = this,
      params = this.data.params
    app.api.prequest({
      "url": app.url.jobrecruitResume,
      data: params
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].logo = app.util.getSingleImgUrl(res.data[i].logo)
      }
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      let jobrecruitResume = that.data.jobrecruitResume
      jobrecruitResume = jobrecruitResume.concat(res.data)
      console.log(res.data)
      that.setData({
        jobrecruitResume,
        isget: true,
      })
    })
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.jobrecruitResume()
    }
  },
  onShareAppMessage: function () {

  }
})