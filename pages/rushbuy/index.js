// pages/coupon/index.js
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
    key: 0,
    postNames: [{
      name: '全部',
      id: '',
    }],
    housCategory: [{
        name: "优惠券",
        logo: "/assets/images/personal/mrtx.png",
        type: 3,
      },
      {
        name: "折扣券",
        logo: "/assets/images/personal/mrtx.png",
        type: 2,
      },
      {
        name: "代金券",
        logo: "/assets/images/personal/mrtx.png",
        type: 1,
      },
    ],
    tabs: [{
      name: "最热",
      id: 0,
      type: '3',
    }, {
      name: "最新",
      id: 1,
      type: '1',
    }, {
      name: "精选",
      id: 2,
      type: '2',
    }, ],
    // current: '0',
    postList: [],
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
      type: 3,
      typeId: '',
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    app.api.rushbuy(res => {
      app.setNavigationBarTitle(res.field)
      that.setData({
        rushbuy: res,
      })
      console.log(res)
    })
    app.setNavigationBarColor(this, () => {
      that.indexAdlist()
      app.isLocation(() => {
        //定位后请求头才带有cityId，zoneId
        this.postList()
      })
      this.getPostnav()
    });
    // this.onTabsChange({
    //   detail: {
    //     key: this.data.key
    //   }
    // })
    console.log(this.data.tabs)
  },
  // 获取首页分类
  getPostnav(e) {
    app.api.prequest({
      'url': app.urlTwo.category,
      data: {
        term: 16
      },
    }).then((res) => {
      let postName = res.data
      let all = {
        id:'',
        name: '全部',
        typeId: '',
      }
      res.data.unshift(all)
      console.log(res.data, postName)
      this.setData({
        postName,
        // 'postName[0].name': '全部',
      })
      // this.onTabsChanges({
      //   detail: {
      //     key: this.data.postName[0].id && this.data.postName[0].id
      //   }
      // })
    })
  },
  //tabs切换
  onTabsChanges(e) {
    console.log('onTabsChange', e, e.detail.keys)
    const {
      key
    } = e.detail
    let keyt
    let infos = this.data.postName.find(item => item.typeId == key)
    console.log(key)
    this.setData({
      keyt: key,
      postList: [],
      "params.page": 1,
      "params.typeId": key,
      mygd: false,
      isget: false,
    })
    this.postList()
    console.log(key)
  },
  //点击到优惠券页面
  clicklist(e) {
    let that = this,
      index = e.currentTarget.dataset.index,
      types = this.data.housCategory.find(item => item.type == index)
    that.setData({
      current: index,
    })
    wx.navigateTo({
      url: '/pages/coupon/index',
    })
    // console.log(e.currentTarget, e.detail, index)
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    let info = this.data.tabs.find(item => item.type == key)
    console.log(this.data.tabs[key].type)
    this.setData({
      key,
      postList: [],
      "params.page": 1,
      "params.type": this.data.tabs[key].type,
      mygd: false,
      isget: false,
    })
    this.postList()
    console.log(key)
  },
  //优惠券列表
  postList(e) {
    let that = this,
      params = this.data.params;
    app.api.prequest({
      "url": app.urlTwo.rushGoodsList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
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
      console.log(res.data)
    })
  },
  // 获取信息首页广告位
  indexAdlist(e) {
    let that = this
    app.api.prequest({
      url: app.url.adList,
      data: {
        type: 15,
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
          },
        })
      }
    })
  },
  onShow() {},
  onHide() {},
  onPullDownRefresh() {},
  onReachBottom() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.postList()
    }
  },
  onShareAppMessage: function () {
    return {
      title: `【${this.data.rushbuy.title}】${this.data.rushbuy.shareDescription}`,
      imageUrl: this.data.rushbuy.shareImg,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: `【${this.data.rushbuy.title}】${this.data.rushbuy.shareDescription}`,
      imageUrl: this.data.rushbuy.shareImg,
    }
  }
})