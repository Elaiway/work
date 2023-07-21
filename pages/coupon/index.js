// pages/coupon/index.js
const app = getApp();
Page({
  data: {
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
      name: "最新",
      id: 0,
      sort: 'new',
    }, {
      name: "精选",
      id: 1,
      sort: 'good',
    }, {
      name: "最热",
      id: 2,
      sort: 'hot',
    }, ],
    current: '0',
    postList: [],
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
      sort: 0,
      type: 0,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    app.api.coupon(res => {
      app.setNavigationBarTitle(res.field)
      that.setData({
        coupon: res,
      })
      console.log(res)
    })
    app.setNavigationBarColor(this, () => {
      that.indexAdlist()
      that.indexAdlist2()
      app.isLocation(() => {
        //定位后请求头才带有cityId，zoneId
        // this.indexAdlist()
        this.postList()
      })
    });
    console.log(this.data.tabs)
  },
  //点击分类列表
  clicklist(e) {
    let that = this,
      index = e.currentTarget.dataset.index,
      types = this.data.housCategory.find(item => item.type == index)
    that.setData({
      postList: [],
      'params.type': this.data.housCategory[index].type,
      mygd: false,
      isget: false,
      current: index,
    })
    that.postList()
    console.log(e.currentTarget, e.detail, index)
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    let info = this.data.tabs.find(item => item.sort == key)
    console.log(this.data.tabs[key].sort)
    this.setData({
      key,
      postList: [],
      "params.page": 1,
      "params.sort": this.data.tabs[key].sort,
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
      "url": app.url.couponList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].logo = app.util.getSingleImgUrl(res.data[i].logo)
        if (app.system.openVip) {
          res.data[i].vipMoney = res.data[i].vipMoney
        } else {
          res.data[i].vipMoney = ''
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
        type: 16,
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
  // 获取中部广告位
  indexAdlist2(e) {
    let that = this
    app.api.prequest({
      url: app.url.adList,
      data: {
        type: 16,
        adType: 2,
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
          Swiper2: {
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
  onShareAppMessage() {
    return {
      title: `【${this.data.coupon.title}】${this.data.coupon.shareDescription}`,
      imageUrl: this.data.coupon.shareImg,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: `【${this.data.coupon.title}】${this.data.coupon.shareDescription}`,
      imageUrl: this.data.coupon.shareImg,
    }
  }
})