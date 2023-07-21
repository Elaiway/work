// pages/activity/index.js
const app = getApp();
Page({
  data: {
    postList: [],
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
      type: 10,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    app.setNavigationBarTitle('名片夹')
    app.setNavigationBarColor(this)
    that.postList()
  },
  //收藏列表
  postList(e) {
    let that = this,
      params = this.data.params;
    app.api.prequest({
      "url": app.url.my_collection,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        // res.data[i].logo = app.util.getImgUrl(res.data[i].logo)
        if (res.data[i].id == null){
          res.data[i].logo = app.util.getImgUrl(res.data[i].logo)
        } else if (res.data[i].id !== null){
          res.data[i].logo = app.util.getSingleImgUrl(res.data[i].logo[0].url)
        }
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
      let postList = that.data.postList
      postList = postList.concat(res.data)
      that.setData({
        postList,
        isget: true,
      })
      console.log(res.data)
    })
  },
  //名片详情
  cardInfo(e) {
    wx.navigateTo({
      url: '/pages/businesscard/carddetail?id=' + e.currentTarget.dataset.id,
    })
    console.log(e.currentTarget.dataset.id)
  },
  //拨打电话
  callup(e) {
    let isTel = e.currentTarget.dataset.msg.isTel,
      tel = e.currentTarget.dataset.msg.tel
    if (isTel == "2") {
      tel = app.com.hideTel(tel)
      app.util.makePhoneCall(tel)
      console.log(tel)
    }
    else {
      app.util.makePhoneCall(tel)
    }
  },
  onShow() { },
  onHide() { },
  onPullDownRefresh() { },
  onReachBottom() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.postList()
    }
  },
  onShareAppMessage() { }
})