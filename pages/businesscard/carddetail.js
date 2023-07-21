// pages/activity/index.js
const app = getApp();
Page({
  data: {
    key: '0',
    tabs: [{
        name: "Ta的动态",
        id: 0,
      },
      {
        name: "Ta的店铺",
        id: 1,
      },
    ],
    key: 0,
    detailPage: [],
    postList: [],
    mygd: false,
    isget: false,
    page: 1,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    app.setNavigationBarTitle('名片详情')
    app.setNavigationBarColor(this, () => {});
    this.setData({
      id: options.id
    })
    console.log(options.id)
    that.detailPage()
    app.getUserInfo((userinfo) => {
      // console.log(userinfo)
      that.setData({
        userinfo: userinfo,
        ad: wx.getStorageSync('codeAd')
      })
    })
  },
  //点击导航切换
  lookKey(key) {
    if (key == '0') {
      this.getPostlist()
    }
    if (key == '1') {
      this.postStore()
    }
  },
  //名片详情
  detailPage(e) {
    let that = this
    app.api.prequest({
      "url": app.url.businesscardInfo,
      data: {
        id: this.data.id
      },
    }).then(res => {
      // res.data.logo = app.util.getImgUrl(res.data.logo)
      res.data.logo = app.util.getSingleImgUrl(res.data.logo[0].url)
      if (res.data.followNum == null) {
        res.data.followNum = 0
      }
      if (res.data.viewNum == null) {
        res.data.viewNum = 0
      }
      if (res.data.shareNum == null) {
        res.data.shareNum = 0
      }
      let detailPage = res.data
      that.setData({
        detailPage,
        postList: [],
      })
      this.lookKey(this.data.key)
      that.getCollection()
      // console.log(res.data)
    })
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
      page: 1,
      mygd: false,
      isget: false,
    })
    this.lookKey(key)
  },
  // 获取信息列表信息
  getPostlist(e) {
    let _f = this.data,
      that = this;
    app.api.userPost({
      data: {
        page: _f.page,
        size: 10,
        status: 'display',
        userId: _f.detailPage.userId
      },
      success: res => {
        console.log('信息列表信息', res)
        if (res.data.data.length < 10) {
          that.setData({
            mygd: true,
          })
        } else {
          that.setData({
            page: that.data.page + 1,
          })
        }
        let postList = _f.postList
        postList = postList.concat(res.data.data)
        that.setData({
          postList: postList,
          isget: true,
        })
      }
    })
  },
  // 获取用户的店铺信息
  postStore() {
    let _f = this.data,
      that = this
    app.api.getUserstore({
      data: {
        adminId: _f.detailPage.userId,
      },
      success: res => {
        console.log("该用户的店铺信息为", res)
        that.setData({
          mygd: true,
        })
        let postList = _f.postList
        postList = postList.concat(res.data.data)
        that.setData({
          postList: postList,
          isget: true,
        })
      }
    })
  },
  //查看用户是否收藏
  getCollection(e) {
    let that = this,
      tel = that.data.detailPage.tel;
    if (that.data.detailPage.isTel == '2') {
      tel = app.com.hideTel(tel)
    }
    this.setData({
      "detailPage.tel": tel,
    })
    console.log("tel", tel)
    app.api.prequest({
      url: app.url.collection,
      data: {
        postId: that.data.id,
        userId: wx.getStorageSync('users').id
      }
    }).then(res => {
      console.log("用户的收藏结果为", res, that.data.detailPage.id, wx.getStorageSync('users').id)
      //return
      if (res.code == '1' && that.data.detailPage.id !== wx.getStorageSync('users').id) {
        that.setData({
          foot_menu: {
            menu: [{
                icon: 'icon-shouye',
                name: '首页',
                src: "/pages/businesscard/index",
                navigateType: '3',
                isLogin: 0
              },
              {
                icon: 'icon-fabudianjizhuangtai-',
                name: '发布',
                src: "/pages/businesscard/release",
                navigateType: '1',
                isLogin: 1
              },
              {
                icon: 'icon-shoucang1',
                active: that.data.detailPage.follow,
                name: that.data.detailPage.follow ? '已收藏' : '收藏',
                isLogin: 1
              },
            ],
            main: {
              name: that.data.detailPage.name,
              cName: that.data.detailPage.tel,
              isMain: true,
              isLogin: 1
            },
            color: that.data.color,
            right: true,
          },
        })
      }
    })
  },
  //点击底部按钮
  footclick(e) {
    let that = this
    if (e.detail.name.indexOf('收藏') > -1) {
      that.collection()
    } else if (e.detail.isMain) {
      if (that.data.detailPage.isTel == '2') {
        console.log('电话已隐藏')
        app.util.makePhoneCall(this.data.detailPage.tel)
      } else {
        app.util.makePhoneCall(this.data.detailPage.tel)
      }
    }
    console.log(e.detail, that.data.id)
  },
  //点击收藏
  collection(e) {
    let that = this
    app.util.getShowloading()
    app.api.prequest({
      url: app.url.collection_post,
      method: "POST",
      data: {
        postId: that.data.detailPage.id,
        type: 10,
      }
    }).then(res => {
      if (res.data.status == '1') {
        app.util.getShowtoast('收藏成功')
      } else {
        app.util.getShowtoast('取消成功')
      }
      that.detailPage()
      // that.completeRefresh()
      wx.hideLoading()
      console.log(res.data, that.data.detailPage.id)
    })
  },
  //点赞
  giveup(e) {
    let that = this
    app.util.getShowloading()
    app.api.prequest({
      url: app.url.praise,
      data: {
        postId: that.data.detailPage.id,
        type: 3,
      }
    }).then(res => {
      // console.log('点赞返回信息', res)
      if (that.data.detailPage.love == false) {
        app.util.getShowtoast("点赞成功")
      } else {
        app.util.getShowtoast("取消点赞")
      }
      that.detailPage()
    })
  },
  // 转发分享
  share(e) {
    this.setData({
      onshare: true
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
      this.lookKey(this.data.key)
    }
  },
  onShareAppMessage() {
    return {
      title: '【' + this.data.detailPage.company + '】' + ' ' + this.data.detailPage.name,
      path: '/pages/businesscard/carddetail?id=' + this.data.detailPage.id,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: '【' + this.data.detailPage.company + '】' + ' ' + this.data.detailPage.name,
      path: '/pages/businesscard/carddetail?id=' + this.data.detailPage.id,
    }
  }
})