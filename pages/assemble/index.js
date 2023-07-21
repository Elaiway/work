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
      "keyWords": "请输入关键字搜索"
    },
    notice: {
      "infoList": ["入驻", "浏览", "分享"],
    },
    key: '1',
    tabs: [{
      name: "最新",
      id: 1,
      type: ''
    }, {
      name: "精选",
      id: 2,
      type: ''
    }, {
      name: "最热",
      id: 3,
      type: ''
    }],
    groupConfig: {},
    postList: [],
    params: {
      page: 1,
      size: 10,
      type: '1',
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.api.group(res => {
      app.setNavigationBarTitle(res.field)
      this.setData({
        groupConfig: res,
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
        type: 14,
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
      'url': app.urlTwo.category,
      data: {
        term: 15
      },
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
      'params.type': e.detail.key,
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
      'url': app.urlTwo.groupGroupList,
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
        item.showImgs = app.util.getImgUrl(item.showImgs)
        item.label = app.com.objToArr(item.label)
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
      title: `【${this.data.groupConfig.title}】${this.data.groupConfig.shareDescription}`,
      imageUrl: this.data.groupConfig.shareImg,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: `【${this.data.groupConfig.title}】${this.data.groupConfig.shareDescription}`,
      imageUrl: this.data.groupConfig.shareImg,
    }
  }
})