// pages/vip/index.js
var app = getApp();
Page({
  data: {
    userinfo: {},
    Typeswiper: {
      noTab:true,
      "color": "#666",
      "shape": 3,
      "buttonNumberOfCol": 4,
      "buttonNumberOfRow": 1,
      "entryButtonList": [{
          label: '尊贵标识',
          url: '/assets/images/vip/zgbs.png'
        },
        {
          label: '开卡送积分',
          url: '/assets/images/vip/sjf.png'
        },
        {
          label: '签到双倍积分',
          url: '/assets/images/vip/sbsjf.png'
        },
        {
          label: '享优惠折扣',
          url: '/assets/images/vip/yhzk.png'
        },
      ],
    },
    layoutBodyOne: {
      hd: 1,
      bd: {
        styleName: 'padding:0rpx 20rpx 10rpx 0'
      },
      img: {
        brs: 'br-r-10',
        wid: 170,
        hei: 170,
      },
    },
    key: '0',
    tabs: [{
        name: "今日特权",
        id: 0,
      },
      {
        name: "全部特权",
        id: 1,
      },
    ],
    activeDay: 1,
    vipConfig: {},
    storeList: [],
    goodlist: [],
    postList: [],
    params: {
      page: 1,
      size: 10,
      week: '',
      day: '',
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.api.vip(res => {
      app.setNavigationBarTitle(res.field)
      this.setData({
        vipConfig: res,
      })
    })
    app.setNavigationBarColor(this, () => {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000',
      })
      app.isLocation(() => {})
    })
    this.announceList()
    //开卡礼包
    app.api.prequest({
      'url': app.urlTwo.vipPackageList,
    }).then(res => {
      this.setData({
        lbList: res.data
      })
      console.log(res.data)
    })
    //特权日期列表
    app.api.prequest({
      'url': app.urlTwo.vipPrivilegeDay,
    }).then(res => {
      res.data.forEach(item => {
        item.weekName = app.com.changeWeek(item.week)
        item.dayName = item.day
        //item.dayName=item.day.split('-')[2]
      })
      res.data[0].dayName = '今天'
      this.setData({
        'params.week': res.data[0].week,
        'params.day': res.data[0].day,
        privilegeDay: [{
          week: '',
          day: '',
          weekName: `${new Date().getMonth() + 1}月`,
          dayName: '全部',
          count: 0
        }].concat(res.data)
      })
      this.getPostlist(true)
      console.log(res.data)
    })
    console.log(options)
  },
  // 获取首页公告
  announceList(e) {
    app.api.prequest({
      'url': app.urlTwo.vipOpenList,
    }).then(res => {
      this.setData({
        Headline: {
          notice: {
            color: '#666'
          },
          isButton: false,
          leftvalue: "商城头条",
          brs: 0,
          pad: '30rpx 30rpx',
          bordercolor: "#f9f9f9",
          color: this.data.color,
          announceList: res.data
        },
      })
      console.log(res.data)
    })
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    if (e.detail.key == 0) {
      this.setData({
        'params.page': 1,
        'params.week': this.data.privilegeDay[1].week,
        'params.day': this.data.privilegeDay[1].day,
        mygd: false,
        isget: false,
      })
      this.getPostlist(true)
    } else {
      wx.navigateTo({
        url: 'privilegelist',
      })
    }
  },
  clickDay(e) {
    let day = this.data.privilegeDay[e.currentTarget.dataset.idx]
    this.setData({
      activeDay: e.currentTarget.dataset.idx,
      'params.page': 1,
      'params.week': day.week,
      'params.day': day.day,
      mygd: false,
      isget: false,
    })
    this.getPostlist(true)
    console.log(e, day)
  },
  // 获取特权列表
  getPostlist(refresh) {
    app.util.getShowloading()
    var that = this,
      params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.urlTwo.vipPrivilegeList,
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
      let postList = refresh ? res.data : that.data.postList.concat(res.data)
      that.setData({
        postList: postList,
        isget: true,
      })
    })
  },
  openMethod() {
    if (app.isLogin()) {
      wx.navigateTo({
        url: 'entervip',
      })
    }
  },
  goodinfo(e) {
    wx.navigateTo({
      url: 'giftdetails?id=' + e.currentTarget.dataset.id,
    })
    //console.log(e.currentTarget.dataset.id)
  },
  onShow: function() {
    app.getUserInfo((info) => {
      this.setData({
        isLogin: app.globalData.isLogin
      })
      console.log(info)
      if (app.globalData.isLogin) {
        app.api.userinfo((info) => {
          info.vipEndTime = app.util.ormatDate(info.vipEndTime).substring(0, 10)
          this.setData({
            userinfo: info,
            subtitle: info.vipTypeName && `到期时间 ${info.vipEndTime}` || `您还没加入${app.system.name}专属会员`
          })
          console.log(info)
        })
      }
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
      this.getPostlist();
    }
  },
  onShareAppMessage: function() {
    return {
      title: this.data.vipConfig.title,
      imageUrl: this.data.vipConfig.shareImg == '' ? '' : this.data.vipConfig.shareImg,
      path: '/pages/vip/index?id=' + this.data.userinfo.id,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: this.data.vipConfig.title,
      imageUrl: this.data.vipConfig.shareImg == '' ? '' : this.data.vipConfig.shareImg,
      path: '/pages/vip/index?id=' + this.data.userinfo.id,
    }
  }
})