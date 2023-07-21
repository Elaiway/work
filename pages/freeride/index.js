// pages/freeride/index/.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice: {
      "infoList": ["浏览", "发布", "分享"],
    },
    tabs: [{
      name: "最新发布",
      id: 0,
    }, 
    // {
    //   name: "货找车",
    //   id: 1,
    // }, {
    //   name: "车找货",
    //   id: 2,
    // }, {
    //   name: "车找人",
    //   id: 3,
    // }, {
    //   name: "人找车",
    //   id: 4,
    // }
    ],
    typec: 1,
    mygd: false,
    isget: false,
    freeList: [],
    key: '0',
    params: {
      page: 1,
      size: 10,
      typeId: '',
      startPlace: '',
      endPlace: '',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    app.api.freeCar((res) => {
      app.setNavigationBarTitle(res.field)
      that.setData({
        freeCarSet: res,
      })
    })
    app.setNavigationBarColor(this, () => {
      // app.api.prequest({
      //   'url': app.url.freeCarSet,
      //   'cachetime': 30,
      // }).then(res=>{
      //   app.setNavigationBarTitle(res.data.field)
      //   that.setData({
      //     freeCarSet: res.data,
      //   })
      //   console.log(res)
      // })
      app.isLocation(function() {
        //定位后请求头才带有cityId，zoneId
        app.util.getLocation({
          type: "0",
          success: res => {
            console.log(res)
          }
        })
        that.indexAdlist()
        that.announceList()
        that.getPostnav()
        console.log('getlocation')
      })
    });
    this.freeList()
  },
  // 获取信息首页广告位
  indexAdlist(e) {
    let that = this
    app.api.prequest({
      url: app.url.adList,
      data: {
        type: 6,
        adType: 1,
      },
    }).then(res => {
      console.log('首页轮播图为', res)
      let imgs = res.data
      if (imgs.length > 0) {
        // for(let i=0;i<imgs.length;i++){
        //   imgs[i].type = 0
        //   imgs[i].url = that.data.url + imgs[i].url
        // }
        imgs.forEach(item => {
          item.type = 0
          item.url = that.data.url + item.url
        })
        // for (let i in imgs) {
        //   imgs[i].type = 0
        //   imgs[i].url = that.data.url + imgs[i].url
        // }
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
  // 获取首页公告
  announceList(e) {
    let that = this
    that.setData({
      Headline: {
        notice: {
          color: '#666'
        },
        leftvalue: "拼车公告",
        bordercolor: "#f9f9f9",
        color: that.data.color,
      },
    })
  },
  // 获取信息分类
  getPostnav(e) {
    let that = this;
    app.api.prequest({
      'url': app.url.freeCategory,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].icon = app.util.getImgUrl(res.data[i].icon)
      }
      console.log(res)
      let freeNav = res.data
      console.log("分类信息", freeNav)
      that.setData({
        freeNav,
        // tabs: freeNav,
        'tabs[0].name':'最新发布',
        'tabs[1]': freeNav[0],
        'tabs[2]': freeNav[1],
        'tabs[3]': freeNav[2],
        'tabs[4]':freeNav[3],
      })
      // this.onTabsChange({
      //   detail: {
      //     key: freeNav[0].id
      //   }
      // })
    })
  },
  //顺风车列表
  freeList(e) {
    var that = this,
      params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.url.freeCarList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        // res.data[i].createdAt = app.util.ormatDate(res.data[i].createdAt)
        // res.data[i].createdAt = res.data[i].createdAt.substring(5, 16)
        res.data[i].createdAt = app.util.settime(res.data[i].createdAt)
        if (res.data[i].type == '1') {
          res.data[i].rideTime = res.data[i].rideTime.substring(5, 16)
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
      let freeList = that.data.freeList
      freeList = freeList.concat(res.data)
      console.log(freeList)
      that.setData({
        freeList,
        isget: true,
      })
      console.log('列表信息', res)
    })
  },
  //分类详情
  freeNav(e) {
    wx.navigateTo({
      url: '/pages/freeride/freeNav?msg=' + JSON.stringify(e.currentTarget.dataset.msg),
    })
    console.log(e.currentTarget.dataset.msg)
  },
  //详情页面
  // goDetail(e) {
  //   wx.navigateTo({
  //     url: '/pages/freeride/detail?id=' + e.detail,
  //   })
  //   console.log(e.detail)
  // },

  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    this.setData({
      key,
      freeList: [],
      'params.page': 1,
      // "params.typeId": '',
      mygd: false,
      isget: false,
    })
    let info = this.data.tabs.find(item => item.id == key)
    this.setData({
      "params.typeId": key,
    })
    // if (key == 1) {
    //   this.setData({
    //     "params.typeId": this.data.freeNav[0].id,
    //   })
    // } else if (key == 2) {
    //   this.setData({
    //     "params.typeId": this.data.freeNav[1].id,
    //   })
    // } else if (key == 3) {
    //   this.setData({
    //     "params.typeId": this.data.freeNav[2].id,
    //   })
    // } else if (key == 4) {
    //   this.setData({
    //     "params.typeId": this.data.freeNav[3].id,
    //   })
    // }
    this.freeList()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */

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
      this.freeList()
    }
  },
  onShareAppMessage: function() {

  }
})