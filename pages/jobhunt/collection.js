// pages/job-hunt/collction.js
const app = getApp();
Page({
  data: {
    tabs: [{
      name: "人才招聘",
      id: 0,
    }, {
      name: "找工作",
      id: 1,
    }, ],
    jobCollection: [],
    mygd: false,
    isget: false,
    key: '0',
    params: {
      page: 1,
      size: 10,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    app.setNavigationBarTitle('收藏')
    app.setNavigationBarColor(this);
    // that.jobCollection()
    that.onTabsChange({
      detail: {
        key:0
      }})
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail

    this.setData({
      key,
      jobCollection: [],
      page: 1,
      mygd: false,
      isget: false,
    })
    this.jobCollection()
    console.log(key)
  },
  //收藏列表
  jobCollection(e) {
    let that = this,
      params = this.data.params
    if (this.data.key == 0) {
      that.setData({types:2})
      params = {
        type: 2
      }
    } else if (this.data.key == 1) {
      that.setData({ types: 1 })
      params = {
        type: 1
      }
    }
    app.api.prequest({
      "url": app.url.jobCollection,
      data: params
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].logo = app.util.getSingleImgUrl(res.data[i].logo)
        res.data[i].label = JSON.parse(res.data[i].label)
        res.data[i].labelarr = []
        for (let j in res.data[i].label) {
          res.data[i].labelarr.push(res.data[i].label[j])
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
      let jobCollection = that.data.jobCollection
      jobCollection = jobCollection.concat(res.data)
      console.log(res.data)
      that.setData({
        jobCollection,
        isget: true,
      })
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
          if (that.data.key == 0) {
            params = {
              type: 7,
              postId,
            }
          } else if (that.data.key == 1) {
            params = {
              type: 8,
              postId,
            }
          }
          app.api.prequest({
            url: app.url.collection_post,
            method: "POST",
            data: params
          }).then(res => {
            console.log(res)
            if (res.code == '1') {
              that.setData({
                jobCollection: []
              })
              that.onTabsChange({
                detail: {
                  key:that.data.key
                }
              })
              app.util.getShowtoast("操作成功")
            } else {
              app.util.getShowtoast("请重试")
            }
            console.log('add', res)
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
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.jobCollection()
    }
  }
})