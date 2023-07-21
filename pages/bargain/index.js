var app = getApp();
Page({
  data: {
    Search: {
      "position": 0,
      "shape": 3,
      "height": 55,
      "borderStyle": 0,
      "fontStyle": "center",
      "recommendSearch": 1,
      "searchBoxList": [],
      "keyWords": "查号码"
    },
    notice: {
      "infoList": ["入驻", "浏览", "分享"],
    },
    key: '0',
    tabs: [{
      name: "最新",
      id: 0,
      type: 'new'
    }, {
      name: "精选",
      id: 1,
      type: 'good'
    }, {
      name: "最热",
      id: 2,
      type: 'hot'
    }],
    groupConfig: {},
    postList: [],
    params: {
      page: 1,
      size: 10,
      sort:'new',
      typePid: '',
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.api.bargain(res => {
      app.setNavigationBarTitle(res.field)
      this.setData({
        bargainConfig: res,
      })
    })
    app.setNavigationBarColor(this, () => {
      app.isLocation(() => {
        //定位后请求头才带有cityId，zoneId
        this.indexAdlist()
        //this.announceList()
        this.getPostlist()
      })
      this.getPostnav()
    });
    console.log(options)
  },
  // 广告位1
  indexAdlist(e) {
    let that = this
    app.api.prequest({
      url: app.url.adList,
      data: {
        type: 17,
        adType: 1,
      }
    }).then(res => {
      let imgs = res.data
      if (imgs.length > 0) {
        imgs.forEach((item) => {
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
  // 获取首页分类
  getPostnav(e) {
    app.api.prequest({
      'url': app.urlTwo.bargainCategory,
    }).then((res) => {
      var postNav = res.data
      postNav.forEach((item) => {
        item.url = item.icon.length ? app.util.getImgUrl(item.icon) : ''
        item.label = item.name
        item.entry = {
          "value": item.url,
          "param": item.id
        }
      })
      console.log(postNav)
      this.setData({
        Typeswiper: {
          "color": "#666",
          "shape": 3,
          "buttonNumberOfCol": 5,
          "buttonNumberOfRow": 2,
          "entryButtonList": postNav,
          "active": true,
        }
      })
    })
  },
  // 获取首页公告
  announceList(e) {
    var that = this
    that.setData({
      Headline: {
        notice: {
          color: '#666'
        },
        isButton: false,
        leftvalue: "商城头条",
        brs: 0,
        pad: '30rpx 30rpx',
        bordercolor: "#f9f9f9",
        color: that.data.color,
      },
    })
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    this.setData({
      postList: [],
      'params.page': 1,
      'params.sort': this.data.tabs[e.detail.key].type,
      mygd: false,
      isget: false,
    })
    this.getPostlist()
  },
  //
  typeSwiperChange(e) {
    this.setData({
      postList: [],
      'params.page': 1,
      'params.typePid': e.detail.id,
      mygd: false,
      isget: false,
    })
    this.getPostlist()
  },
  // 获取信息列表信息
  getPostlist(e) {
    var that = this,
      params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.urlTwo.bargainList,
      data: params,
    }).then(res => {
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      res.data.forEach(item => {
        item.logo = app.util.getSingleImgUrl(item.logo)
      })
      var postList = that.data.postList
      postList = postList.concat(res.data)
      that.setData({
        postList: postList,
        isget: true,
      })
    })
  },
  storeInfo(e) {
    wx.navigateTo({
      url: '/pages/mall/storemall?id=' + e.currentTarget.dataset.id,
    })
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
      this.getPostlist();
    }
  },
  onShareAppMessage: function() {
    return {
      title: `【${this.data.bargainConfig.title}】${this.data.bargainConfig.shareDescription}`,
      imageUrl: this.data.bargainConfig.shareImg,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: `【${this.data.bargainConfig.title}】${this.data.bargainConfig.shareDescription}`,
      imageUrl: this.data.bargainConfig.shareImg,
    }
  }
})