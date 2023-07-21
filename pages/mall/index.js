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
    key: '0',
    tabs: [{
      name: "全部",
      id: 0,
      typePid: ''
    }],
    mallConfig: {},
    storeList: [],
    goodlist: [{
        src: 'http://www.pangniujie.com/d/file/tuku/juzhao/2017-11-16/e6dcf037a79731935771155329f34ba4.jpg'
      },
      {
        src: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=863084947,1680560895&fm=27&gp=0.jpg'
      },
      {
        src: 'http://www.pangniujie.com/d/file/tuku/juzhao/2018-06-12/920b8d2c00f4952ebdcc35e5b06825e1.jpg'
      },
      {
        src: 'https://gss2.bdstatic.com/-fo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=37308188247f9e2f70351a0e270b8e19/35a85edf8db1cb13dfef0f7dde54564e93584bdd.jpg'
      },
      {
        src: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=738486752,805713377&fm=27&gp=0.jpg'
      },
      {
        src: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1671020154,321400341&fm=27&gp=0.jpg'
      }
    ],
    postList: [],
    params: {
      page: 1,
      size: 10,
      typePid: '',
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.api.mall(res => {
      app.setNavigationBarTitle(res.field)
      this.setData({
        mallConfig: res,
      })
    })
    app.setNavigationBarColor(this, () => {
      app.isLocation(() => {
        //定位后请求头才带有cityId，zoneId
        this.indexAdlist()
        this.indexAdlist2()
        this.announceList()
        this.getPostlist()
      })
      this.getPostnav()
      this.mallStoreList()
    });
    this.mallFullCategory()
    console.log(options)
  },
  // 广告位1
  indexAdlist(e) {
    let that = this
    app.api.prequest({
      url: app.url.adList,
      data: {
        type: 11,
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
            "height": that.data.mallConfig.slideNum || app.system.slideNum,
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
  //广告位2
  indexAdlist2(e) {
    let that = this
    app.api.prequest({
      url: app.url.adList,
      data: {
        type: 11,
        adType: 2,
      }
    }).then(res => {
      let imgs = res.data
      if (imgs.length > 0) {
        imgs.forEach((item) => {
          item.type = 0
          item.url = that.data.url + item.url
        })
        that.setData({
          SwiperTwo: {
            "padding": 0,
            'topMargin': 20,
            "height": 100,
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
      'url': app.urlTwo.mallNav,
    }).then((res) => {
      var postNav = res.data
      postNav.forEach((item) => {
        item.path = item.url
        item.url = item.icon == "''" ? '' : app.util.getImgUrl(item.icon)
        item.label = item.name
        item.entry = {
          "value": item.path != 'shopCategory' ? 'singlePage' : item.path,
          "param": item.path != 'shopCategory' ? item.path : {
            pid: item.val.split('#')[0],
            id: item.val.split('#')[1]
          }
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
  mallStoreList() {
    app.api.prequest({
      'url': app.urlTwo.mallStoreList,
    }).then((res) => {
      res.data.forEach(item => {
        item.storeLogo = app.util.getImgUrl(item.storeLogo)
      })
      this.setData({
        storeList: res.data
      })
    })
  },
  mallFullCategory() {
    app.api.prequest({
      'url': app.urlTwo.mallFullCategory,
    }).then((res) => {
      let arr = res.data.map((item, index) => {
        return {
          name: item.name,
          id: index + 1,
          typePid: item.id
        }
      })
      this.setData({
        tabs: this.data.tabs.concat(arr)
      })
    })
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    this.setData({
      postList: [],
      'params.page': 1,
      'params.typePid': this.data.tabs[e.detail.key].typePid,
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
      'url': app.urlTwo.mallGoodsList,
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
    console.log('1233',this.data.mallConfig)
    return {
      title: this.data.mallConfig.title,
      imageUrl: this.data.mallConfig.shareImg == '' ? '' : this.data.mallConfig.shareImg,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: this.data.mallConfig.title,
      imageUrl: this.data.mallConfig.shareImg == '' ? '' : this.data.mallConfig.shareImg,
    }
  }
})