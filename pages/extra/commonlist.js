// pages/job-hunt/myjobhunt.js
const app = getApp();
Page({
  data: {
    postList: [],
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let oparams = JSON.parse(options.params)
    app.setNavigationBarTitle(oparams.name)
    app.setNavigationBarColor(this);
    this.setData({
      oparams,
    })
    if (oparams.name = '特权领取列表') {
      this.setData({
        'params.id': oparams.id
      })
    }
    this.postList()
    console.log(options)
  },
  //我的发布列表
  postList(e) {
    let params = this.data.params
    console.log(params)
    app.api.prequest({
      "url": app.urlTwo.privileReceive,
      data: params
    }).then(res => {
      res.data.forEach(item => {
        item.creatTime = app.util.ormatDate(item.creatTime).substring(0, 16)
      })
      if (res.data.length < 10) {
        this.setData({
          mygd: true,
        })
      } else {
        this.setData({
          'params.page': this.data.params.page + 1,
        })
      }
      let postList = this.data.postList.concat(res.data)
      console.log(res.data)
      this.setData({
        postList,
        isget: true,
      })
    })
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
      this.postList()
    }
  }
})