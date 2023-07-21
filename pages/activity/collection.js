// pages/freeride/index/.js
const app = getApp()
Page({

  data: {
    collList: [],
    params: {
      page: 1,
      size: 10,
      type: 11,
    },
  },
  onLoad: function (options) {
    let that = this;
    app.setNavigationBarTitle('我的收藏')
    app.setNavigationBarColor(this)
    this.collection()
  },
  collection() {
    let that = this, params = this.data.params
    // console.log(params)
    app.api.prequest({
      'url': app.url.my_collection,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].showImgs = app.util.getImgUrl(res.data[i].showImgs)
        res.data[i].startTime = app.util.ormatDate(res.data[i].startTime).substring(0, 16)
        res.data[i].endTime = app.util.ormatDate(res.data[i].endTime).substring(0, 16)
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
      let collList = that.data.collList
      collList = collList.concat(res.data)
      that.setData({
        collList,
        isget: true,
      })
      // console.log(res.data)
    })
  },
//取消收藏
  cancelcoll(e){
    console.log(e.currentTarget.dataset.id)
    let that = this,
      postId = e.currentTarget.dataset.id,
      params
    wx.showModal({
      title: '取消收藏',
      content: '确认取消收藏吗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.getShowloading('提交中')
          app.api.prequest({
            url: app.url.collection_post,
            method: "POST",
            data: {
              postId,
              type: 11,
            }
          }).then(res => {
            console.log("请求成功")
            if (res.code == '1') {
              that.setData({
                collList: [],
                // 'params.page': 1,
                // 'params.size': that.data.collList.length,
              })
              that.completeRefresh()
              // that.collList()
              app.util.getShowtoast("操作成功")
            }
            else {
              app.util.getShowtoast("请重试")
            }
            console.log(res)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //完成后刷新
  completeRefresh() {
    if (getCurrentPages().length != 0) {
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
  },
  //点击详情
  goDetail(e){
   wx.navigateTo({
     url: '/pages/activity/detail?id=' + e.currentTarget.dataset.id,
   })
  },
  //去报名
  goEnroll(e){
    let etime = e.currentTarget.dataset.collmsg.enrollEndTime,
      id = e.currentTarget.dataset.collmsg.activityId
    etime = app.util.ormatDate(etime)
    if (app.util.Timesize(etime)) {
      wx.navigateTo({
        url: '/pages/activity/enroll?id=' + id,
      })
    }else {
      wx.showModal({
        title: '提示',
        content: '报名时间已过',
      })
    }
    console.log(e, etime, id)
  },
  onReady: function () {

  },
  onHide: function () {

  },

  onUnload: function () {

  },
  onReachBottom: function () {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.collection()
    }
  },
  onPullDownRefresh: function () {

  },
})