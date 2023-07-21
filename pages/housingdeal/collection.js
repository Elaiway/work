// pages/job-hunt/collction.js
const app = getApp();
Page({
  data: {
    collList: [],
    types: 1,
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
      type: 9,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    app.setNavigationBarTitle('收藏')
    app.setNavigationBarColor(this, () => {
      that.collection()
    });
  },
  //收藏列表
  collection(e) {
    let that = this, params = this.data.params
    console.log(params)
    app.api.prequest({
      url: app.url.my_collection,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].createdAt = app.util.settime(res.data[i].createdAt)
        res.data[i].imgs = app.util.getSingleImgUrl(res.data[i].imgs)
        let str = res.data[i].rent.split(','), a = /[0-9]/, b = /['万']/, c = /['元/平']/, d = /['元/月']/;
        //二手房出售
        if (res.data[i].identifying == '6') {
          if (a.test(str)) {
            if (!b.test(str)) {
              str.push('万')
              res.data[i].rent = str
              res.data[i].rent = res.data[i].rent.join('')
            }
            console.log('包含此字符串', str)
          }
        }
        //新房出售
        else if (res.data[i].identifying == '5') {
          if (a.test(str)) {
            if (!c.test(str)) {
              str.push('元/平')
              res.data[i].rent = str
              res.data[i].rent = res.data[i].rent.join('')
            }
          }
        }
        //房屋出租
        else if (res.data[i].identifying == '3') {
          if (a.test(str)) {
            if (!d.test(str)) {
              str.push('元/月')
              res.data[i].rent = str
              res.data[i].rent = res.data[i].rent.join('')
            }
          }
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
      let collList = that.data.collList
      collList = collList.concat(res.data)
      console.log(collList)
      that.setData({
        collList,
        isget: true,
      })
      console.log('收藏列表', res)
    })
  },
  //取消收藏
  cancelcoll(e) {
    console.log(e.detail)
    let that = this,
      postId = e.detail,
      params,
      key
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
              type: 9,
            }
          }).then(res => {
            console.log("请求成功")
            if (res.code == '1') {
              that.setData({
                collList: [],
                'params.page': 1,
                'params.size': that.data.collList.length,
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
      this.collection()
    }
  },
  onShareAppMessage: function () {

  }
})