// pages/activity/index.js
const app = getApp();
Page({
  data: {
    notice: {
      "infoList": ["浏览", "发布", "分享"],
    },
    tabs: [{
        name: "最新",
        id: 0,
      },
      {
        name: "精选",
        id: 1,
      }, 
      {
        name: "最热",
        id: 2,
      },
    ],
    postList: [],
    mygd: false,
    isget: false,
    key: '0',
    current: '0',
    types: 1,
    params: {
      page: 1,
      size: 10,
      type: '',
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.api.activity(res => {
      app.setNavigationBarTitle(res.field)
      that.setData({
        activity: res,
      })
      console.log(res)
    })
    app.setNavigationBarColor(this, () => {
      app.isLocation(function() {
        app.util.getLocation({
          type: "0",
          success: res => {
            console.log(res)
          }
        })
        that.indexAdlist()
        that.announceList()
        that.getPostnav()
        that.postList()
      })
    });
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail

    this.setData({
      key,
      postList: [],
      "params.type": key + 1,
      // "params.page": 1,
      mygd: false,
      isget: false,
    })
    this.postList()
    console.log(key)
  },
  // 获取信息首页广告位
  indexAdlist(e) {
    let that = this
    app.api.prequest({
      url: app.url.adList,
      data: {
        type: 12,
        adType: 1,
      },
    }).then(res => {
      console.log('首页轮播图为', res)
      let imgs = res.data
      if (imgs.length > 0) {
        imgs.forEach(item => {
          item.type = 0
          item.url = that.data.url + item.url
        })
        that.setData({
          Swiper: {
            "padding": 0,
            "height": app.system.slideNum,
            "maxLimit": 300,
            "minLimit": 100,
            "swiper": {
              "children": imgs
            }
          }
        })
      }
    })
  },
  // 获取首页公告
  announceList(e) {
    let that = this
    that.setData({
      Headline: {
        notice: {
          color: '#666'
        },
        leftvalue: "活动头条",
        bordercolor: "#f9f9f9",
        color: that.data.color,
      },
    })
  },
  // 获取首页分类
  getPostnav(e) {
    var that = this
    app.api.request({
      'url': app.url.activityCategory,
      // data: {
      //   type: '8'
      // },
      success: function (res) {
        console.log(res)
        var postNav = res.data.data
        for (let i in postNav) {
          postNav[i].url = postNav[i].icon == "''" ? '' : app.util.getImgUrl(postNav[i].icon)
          postNav[i].label = postNav[i].name
          postNav[i].entry = {
            "value": 'activityCategory',
            "param": postNav[i].id
          }
        }
        console.log(postNav)
        that.setData({
          Typeswiper: {
            "color": "#666",
            "shape": 3,
            "buttonNumberOfCol": 5,
            "buttonNumberOfRow": 2,
            "entryButtonList": postNav,
          }
        })
      },
    })
  },
  //分类列表
  // typeList(e){
  //   wx.navigateTo({
  //     url: '/pages/activity/category?msg=' + JSON.stringify(e.currentTarget.dataset.msg)
  //   })
  //   console.log(e.currentTarget.dataset.msg)
  // },
  //活动列表
  postList(e) {
    let that = this,
      params = this.data.params;
    app.api.prequest({
      "url": app.url.activityList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].startTime = app.util.ormatDate(res.data[i].startTime).substring(0, 16)
        res.data[i].createdAt = app.util.settime(res.data[i].createdAt)
        // res.data[i].imgs = app.util.getSingleImgUrl(res.data[i].imgs)
        res.data[i].showImgs = app.util.getImgUrl(res.data[i].showImgs)
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
      // console.log(res.data)
    })
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function () {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.postList()
    }
  },
  onShareAppMessage: function() {

  }
})