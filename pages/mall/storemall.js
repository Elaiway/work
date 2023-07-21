// pages/mall/cart.js
var app = getApp();
Page({
  data: {
    foot_menu: {
      type: 2,
      menu: [{
          icon: 'icon-shouye fon_36 mar_r',
          name: '首页',
          src: "/pages/mall/index",
          navigateType: '3',
          isLogin: 0
        },
        {
          icon: 'icon-shangdian fon_36 mar_r',
          name: '商家详情',
          isLogin: 0
        },
        {
          icon: 'icon-dianhua3 fon_36 mar_r',
          name: '联系客服',
          isLogin: 0
        },
      ],
      border:true,
      direction: 'flex-center',
      nameClass: 'fon_32'
    },
    layoutBodyOne: {
      hd: 1,
      bd: 1,
      ft: {
        className: 'flex-x-center'
      },
      img: {
        wid: 120,
        hei: 120,
      },
    },
    tabs: [{
      name: "全部",
      id: 0,
      sort: 'default'
    }, {
      name: "热销",
      id: 1,
      sort: 'salesNum'
    }, {
      name: "上新",
      id: 2,
      sort: 'new'
    }],
    postList: [],
    params: {
      page: 1,
      size: 10,
      storeId: '',
      sort: 'default',
    },
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      'params.storeId': options.id,
    })
    app.setNavigationBarTitle('店铺商品')
    app.setNavigationBarColor(this, () => {
      this.getPostlist()
      app.api.prequest({
        'url': app.url.bussinessInfo,
        data: {
          id: options.id
        }
      }).then(res => {
        res.data.storeLogo = app.util.getImgUrl(res.data.storeLogo)
        that.setData({
          storeInfo: res.data,
          follow: res.data.follow
        })
      })
    });
  },
  changeClass() {
    this.setData({
      mallClass: !this.data.mallClass
    })
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    this.setData({
      postList: [],
      'params.page': 1,
      'params.sort': this.data.tabs[e.detail.key].sort,
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
      'url': app.urlTwo.mallStoreGoodsList,
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
  //用户收藏操作 
  collection_store(e) {
    var that = this
    wx.showLoading({
      mask: !0
    })
    app.api.prequest({
      url: app.url.collection_post,
      method: "POST",
      data: {
        postId: that.data.storeInfo.id,
        userId: wx.getStorageSync('users').id,
        type: 2,
      },}).then(res => {
        if (res.data.status == '1') {
          app.util.getShowtoast('关注成功')
        } else {
          app.util.getShowtoast('取消关注')
        }
        that.setData({
          follow:!that.data.follow
        })
        wx.hideLoading()
      })
  },
  footclick(e) {
    if (e.detail.name=='商家详情') {
      app.util.goUrl({
        param: this.data.storeInfo.id,
        value: "businessInfo"
      })
    }
    else if (e.detail.name == '联系客服'){
      app.util.makePhoneCall(this.data.storeInfo.linkTel)
    }
    console.log(e.detail.name)
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

  }
})