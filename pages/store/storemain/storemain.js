// pages/store/storemain/storemain.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Search: {
      "position": 0,
      "shape": 3,
      "height": 55,
      "borderStyle": 0,
      "fontStyle": "center",
      "recommendSearch": 1,
      "searchBoxList": [],
      "keyWords": "请输入您想要搜索的内容"
    },
    Notice: {
      "infoList": ["浏览", "入驻", "分享"],
    },
    postList: [],
    siteroot: app.setInfo.siteroot,
    page: 1,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log(app.util.Timesize())
    app.pageOnLoad(this);
    app.setNavigationBarColor(this);
    app.util.getLocation({
      type: "0",
      success: res => {
        console.log(res)
        app.api.storeconfig((info) => {
          let tabs = info.sort
          for (let i in tabs) {
            tabs[i].id = tabs[i].value
          }
          console.log(info, tabs)
          that.setData({
            lat: res.latitude,
            lng: res.longitude,
            storeconfig: info,
            key: tabs[0].id,
            tabs: tabs,
          })
          that.getPostlist()
          that.announceList()
          app.setNavigationBarTitle(info.field)
        })
      }
    })
    this.getPostnav()
    this.indexAdlist()
    this.statistic()
    this.advertAdlist()
  },
  // 获取统计数据
  statistic(e) {},
  // 获取信息中间广告位
  advertAdlist(e) {
    var that = this
    app.api.request({
      url: app.url.adList,
      data: {
        type: 2,
        adType: 2,
      },
      success: res => {
        var imgs = res.data.data
        if (imgs.length > 0) {
          for (let i in imgs) {
            imgs[i].type = 0
            imgs[i].url = that.data.url + imgs[i].url
            // imgs[i].route = "/pages/message/info/index"
          }
          that.setData({
            advert: {
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
  // 获取首页公告
  announceList(e) {
    var that = this
    that.setData({
      Headline: {
        notice: {
          color: '#666'
        },
        isButton: that.data.storeconfig.enter==1, //右边的button按钮是否显示
        right_button: "我要入驻", //button按钮的文字
        right_src: '/pages/store/storeentry/storeentry', //button按钮对应的路径
        leftvalue: "商圈快报",
        bordercolor: "#f9f9f9",
        color: that.data.color,
      },
    })
  },
  // 获取商家首页广告位
  indexAdlist(e) {
    var that = this
    app.api.request({
      url: app.url.adList,
      data: {
        type: 2,
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
  // 获取商家分类
  getPostnav(e) {
    var that = this
    app.api.request({
      url: app.url.category,
      data: {
        type: 2
      },
      success: res => {
        var postNav = res.data.data
        for (let i in postNav) {
          postNav[i].url = postNav[i].icon == "''" ? '' : (that.data.url + JSON.parse(postNav[i].icon)[0].url)
          postNav[i].label = postNav[i].name
          postNav[i].entry = {
            "value": 'businessCategory',
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
      }
    })
  },
  // 获取商家信息
  getPostlist(e) {
    var that = this,
      params = {
        page: that.data.page,
        size: 10,
        sort: that.data.key,
        lat: that.data.lat,
        lng: that.data.lng,
      }
    console.log(params)
    app.api.getStorelist({
      data: params,
      success: res => {
        // console.log('列表信息', res)
        if (res.data.data.length < 10) {
          that.setData({
            mygd: true,
          })
        } else {
          that.setData({
            page: that.data.page + 1,
          })
        }
        var postList = that.data.postList
        postList = postList.concat(res.data.data)
        that.setData({
          postList: postList,
          isget: true,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   if(this.data.storeconfig.title){
  //     return {
  //       title: '【' + this.data.storeconfig.title + '】',
  //       imageUrl: this.data.storeconfig.shareImg==''?'':this.data.storeconfig.shareImg,
  //     }
  //   }
  // }
})