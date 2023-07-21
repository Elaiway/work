// pages/yellow-listdetail/myrecord.js
var app = getApp();
Page({
  data: {
    postList: [],
    mygd: false,
    isget: false,
    params:{
      page:1,
      size:10,
      typeId:'',
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.setNavigationBarColor(this);
    // app.api.prequest({
    //   'url': app.url.yellowConfig,
    //   'cachetime': 30,
    // }).then(res => {
    //   app.setNavigationBarTitle('黄页分类—' + res.data.field)
    //   that.setData({
    //     yellowConfig: res.data,
    //   })
    //   console.log(res)
    // })
    console.log(options)
    this.setData({
      'params.typeId': JSON.parse(options.info).id
    })
    app.setNavigationBarTitle(JSON.parse(options.info).name)
    that.getPostlist()
  },
  // 获取信息列表信息
  getPostlist(e) {
    var that = this;
    console.log(that.data.params)
    app.api.prequest({
      'url': app.url.yellowList,
       data: that.data.params,
    }).then(res => {
      console.log('yellowlist', res)
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].logo = app.util.getImgUrl(res.data[i].logo)
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
      var postList = that.data.postList
      postList = postList.concat(res.data)
      that.setData({
        postList: postList,
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
      this.getPostlist();
    }
  },
  onShareAppMessage: function () {

  }
})