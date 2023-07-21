// pages/yellow-page/index.js
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
      "keyWords": "输入电话号码搜索"
    },
    notice: {
      "infoList": ["入驻", "浏览", "分享"],
    },
    postList: [],
    siteroot: app.setInfo.siteroot,
    page: 1,
    key: '0',
    tabs: [{ name: "常用", id: 0, sort: 'hot' }, { name: "最新", id: 1, sort: 'new' }, { name: "附近", id: 2, sort: 'nearest' }]
  },
  // 获取信息首页广告位
  indexAdlist(e) {
    var that = this
    app.api.request({
      url: app.url.adList,
      data: {
        type: 7,
        adType: 1,
      },
      success: res => {
        console.log('首页轮播图为', res)
        var imgs = res.data.data
        if (imgs.length > 0) {
          for (let i in imgs) {
            imgs[i].type = 0
            imgs[i].url = that.data.url + imgs[i].url
          }
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

      }
    })
  },
  // 获取首页分类
  getPostnav(e) {
    var that = this
    app.api.request({
      'url': app.url.category,
      data: {
        type: '8'
      },
      success: function(res) {
        console.log(res)
        var postNav = res.data.data
        for (let i in postNav) {
          postNav[i].url = postNav[i].icon == "''" ? '' : app.util.getImgUrl(postNav[i].icon)
          postNav[i].label = postNav[i].name
          postNav[i].entry = {
            "value": 'yellowCategory',
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
  // 获取首页公告
  announceList(e) {
    var that = this
    that.setData({
      Headline: {
        notice: {
          color: '#666'
        },
        isButton: false, //右边的button按钮是否显示
        right_button: "我要入驻", //button按钮的文字
        right_src: '/pages/store/storeentry/storeentry', //button按钮对应的路径
        leftvalue: "同城头条",
        bordercolor: "#f9f9f9",
        color: that.data.color,
      },
    })
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)

    this.setData({
      key,
      index,
      postList: [],
      page: 1,
      mygd: false,
      isget: false,
    })
    this.getPostlist()
  },

  // 获取信息列表信息
  getPostlist(e) {
    var that = this,
      params = {
        page: that.data.page,
        size: 10,
        sort: that.data.tabs[that.data.key].sort,
        lat: that.data.lat,
        lng: that.data.lng,
      }
    console.log(params)
    app.api.prequest({
      'url': app.url.yellowList,
      data: params,
    }).then(res=>{
      console.log('yellowlist', res)
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].logo = app.util.getImgUrl(res.data[i].logo)
        res.data[i].recordName
        //console.log(res.data[i].recordName)
      }
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          page: that.data.page + 1,
        })
      }
      var postList = that.data.postList
      postList = postList.concat(res.data)
      that.setData({
        postList: postList,
        isget: true,
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.api.yellow((res)=>{
      app.setNavigationBarTitle(res.field)
      that.setData({
        yellowConfig: res,
      })
    })
    app.setNavigationBarColor(this, () => {
      app.isLocation(function() {
        //定位后请求头才带有cityId，zoneId
        app.util.getLocation({
          type: "0",
          success: res => {
            console.log(res)
            that.setData({
              lat: res.latitude,
              lng: res.longitude,
            })
            that.getPostlist()
          }
        })
        that.getPostnav()
        that.indexAdlist()
        that.announceList()
        console.log('getlocation')
      })
    });
    // 获取用户信息
    app.getUserInfo(function(userinfo) {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
    console.log(options)
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
      this.getPostlist();
    }
  },
  onShareAppMessage: function() {

  }
})