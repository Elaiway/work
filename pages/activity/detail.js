// pages/freeride/index/.js
const app = getApp()
Page({
  data: {
    header: {
      hd: {
        link: '/pages/activity/index'
      },
      bd: ['活动', '详情', '评论'],
      ft: 1
    },
    detailPage: [],
    isshowpay: false,
    payTel: false,
  },
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('活动详情')
    app.setNavigationBarColor(this, () => {
      app.api.prequest({
        'url': app.url.activitySet,
        'cachetime': 30,
      }).then(res => {
        that.detailPage()
        that.setData({
          activitySet: res.data,
        })
        console.log(res)
      })
    });
    this.setData({
      id: options.id
    })
    console.log(options.id)
    this.detailPage()
    // 获取用户信息
    app.getUserInfo((userinfo) => {
      // console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
  },
  //活动详情
  detailPage() {
    var that = this
    app.api.prequest({
      'url': app.url.activityInfo,
      data: {
        activityId: this.data.id
      }
    }).then(res => {
      res.data.enrollStartTime = app.util.ormatDate(res.data.enrollStartTime).substring(0, 16)
      res.data.enrollEndTime1 = app.util.ormatDate(res.data.enrollEndTime).substring(0, 16)
      res.data.enrollEndTime2 = res.data.enrollEndTime
      res.data.startTime = app.util.ormatDate(res.data.startTime).substring(0, 16)
      res.data.endTime = app.util.ormatDate(res.data.endTime).substring(0, 16)
      // res.data.detailImgs = app.util.getImgUrl(res.data.detailImgs)
      res.data.detailImgs = app.util.getTypeImgsUrl(res.data.detailImgs)
      res.data.showImgs = app.util.getTypeImgsUrl(res.data.showImgs)
      res.data.storeLogo = app.util.getImgUrl(res.data.storeLogo)
      for (let i = 0; i < res.data.comment.length;i++){
        res.data.comment[i].creatTime = app.util.settime(res.data.comment[i].creatTime)
      }
      let detailPage = res.data
      that.setData({
        detailPage,
        enrollEndTime2: res.data.enrollEndTime,
        Swiper: {
          "padding": 0,
          "height": 200,
          "maxLimit": 300,
          "minLimit": 100,
          "swiper": {
            "children": res.data.showImgs
          }
        },
        foot_menu: {
          menu: [{
            icon: 'icon-shouye fon_30',
              name: '首页',
              src: "/pages/activity/index",
              navigateType: '3',
              isLogin: 0
            },
            {
              icon: 'icon-zhanghao fon_30',
              name: '我的',
              src: "/pages/activity/order",
              navigateType: '1',
              isLogin: 0
            },
            {
              icon: 'icon-kefu fon_30',
              name: '客服',
              isLogin: 0
            },
          ],
          main: {
            name: that.data.detailPage.isJoin ? '联系主办方' : '立即报名',
            isMain: true,
            isLogin: 1
          },
          color: that.data.color,
          right: true,
        },
      })
      // console.log(res.data, this.data.id)
    })
  },
  //收藏
  collection(e) {
    var that = this
    app.util.getShowloading()
    app.api.prequest({
      url: app.url.collection_post,
      method: "POST",
      data: {
        postId: that.data.detailPage.id,
        type: 11,
      }
    }).then(res => {
      if (res.data.status == '1') {
        app.util.getShowtoast('收藏成功')
      } else {
        app.util.getShowtoast('取消成功')
      }
      that.detailPage()
      wx.hideLoading()
      // console.log(res.data, that.data.detailPage.id)
    })
  },
  //底部导航栏点击
  footclick(e) {
    if (e.detail.name == '客服') {
      app.util.makePhoneCall(this.data.detailPage.linkTel)
    } else if (e.detail.name == '立即报名') {
      var etime = this.data.enrollEndTime2
      var timestamp = Math.round(new Date().getTime() / 1000).toString()
      if (timestamp <= etime){
        wx.navigateTo({
          url: '/pages/activity/enroll?id=' + this.data.id,
        }) 
        console.log(this.data.id)
        // console.log('报名时间截止时间/当前时间', etime, timestamp)
        // console.log('报名时间截止', new Date(etime).getTime())
      }
      else{
        // app.util.getShowloading()
        wx.showModal({
          title: '提示',
          content:'报名时间已过',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/activity/index',
              })
              console.log('用户点击确定')
            } else if (res.cancel) {
              wx.navigateTo({
                url: '/pages/activity/index',
              })
              console.log('用户点击取消')
            }
            app.util.getShowloading()
          }
        })
      }
      console.log(!app.util.Timesize(etime))
    } else if (e.detail.name == '联系主办方'){
      app.util.makePhoneCall(this.data.detailPage.linkTel)
    }
    console.log(e.detail)
  },
  //头部点击跳转滚动
  bdclick(e) {
    if (this.data.heightarr) {
      wx.pageScrollTo({
        scrollTop: this.data.heightarr[e.detail] - this.data.heightarr[0],
      })
    } else {
      this.getContext(e.detail)
    }
    console.log(e.detail)
  },
  //获取节点top值用于滚动
  getContext(index) {
    let query = wx.createSelectorQuery()
    query.selectAll('#activitydl').boundingClientRect()
    query.exec((res) => {
      this.setData({
        heightarr: res[0].map(item => (item.top))
      })
      this.bdclick({
        detail: index
      })
      console.log(res)
    })
  },
  //点击到店铺
  clickedShop(e) {
    let storeId = this.data.detailPage.storeId
    if (storeId !== null) {
      wx.navigateTo({
        url: '/pages/store/storemain/storedetail?id=' + storeId,
      })
    }
  },
  //播放视频
  // videoErrorCallback: function (e) {
  //   console.log('视频错误信息:' + e.detail.errMsg);
  // },
  onReady: function() {

  },
  onHide: function() {

  },

  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onShareAppMessage: function() {
    return {
      // title: '【' + this.data.detailPage.storeName + '】' + ' ' + this.data.detailPage.name,
      title: this.data.detailPage.name,
      path: '/pages/activity/detail?id=' + this.data.detailPage.id,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: this.data.detailPage.name,
      path: '/pages/activity/detail?id=' + this.data.detailPage.id,
    }
  }
})