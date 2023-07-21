// pages/personal/integral/integralmall/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // picmagic: {
    //   pictureList: [{
    //       entry: {
    //         param: '',
    //         value: '',
    //       },
    //       url: "https://app.zhycms.com/file/2/png/2019/01/25/GI6o0ctpYToXLO2B.png"
    //     },
    //     {
    //       entry: {
    //         param: '',
    //         value: '',
    //       },
    //       url: "https://app.zhycms.com/file/2/png/2019/01/25/GI6o0ctpYToXLO2B.png"
    //     },
    //     {
    //       entry: {
    //         param: '',
    //         value: '',
    //       },
    //       url: "https://app.zhycms.com/file/2/png/2019/01/25/GI6o0ctpYToXLO2B.png"
    //     }
    //   ],
    //   radius: 1,
    //   reverse: 0,
    //   topMargin: 0,
    //   upDownPadding: 10,
    // },
    mygd: false,
    isget: false,
    itemList: [],
    params: {
      page: 1,
      size: 5,
      typeId: '',
      isRecommend:'',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarColor(this, () => {
      app.isLocation(() => {
        this.setData({
          Headline: {
            notice: {
              color: '#666'
            },
            leftvalue: "兑换快报",
            bordercolor: "#f9f9f9",
            color: that.data.color,
          },
        })
      })
      app.api.prequest({
        'url': app.url.integral,
        // 'cachetime': 30,
      }).then(res => {
        // app.setNavigationBarTitle(res.data.field)
        app.setNavigationBarTitle("积分商城")
        that.setData({
          integral: res.data,
        })
        console.log(res)
      })
      that.setData({
        foot_menu: {
          menu: [{
              icon: 'icon-shouye',
              name: '首页',
              src: "/pages/index/index",
              navigateType: '3',
              isLogin: 0
            },
            {
              icon: 'icon-jilu1',
              name: '我的订单',
              src: "/pages/personal/integral/integralmall/myorder",
              navigateType: '1',
            },
          ],
          // main: {
          //   cName: '金币不足',
          //   isMain: true,
          //   isLogin: 1
          // },
          color: '#ddd',
          right: false,
        },
      })
    });
    // app.setNavigationBarTitle('积分商城')
    that.indexAdlist()
    that.getPostnav()
    that.getProlist()
  },
  //跳转我的积分
  interval(e) {
    wx.navigateTo({
      url: '/pages/personal/integral/index?current=' + e.currentTarget.dataset.type,
    })
  },
  // 获取信息首页广告位
  indexAdlist(e) {
    var that = this
    app.api.prequest({
      url: app.url.adList,
      data: {
        type: 5,
        adType: 1,
      },
    }).then(res => {
      console.log('首页轮播图为', res)
      var imgs = res.data
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
    })
  },
  // 获取导航分类
  getPostnav(e) {
    var that = this
    app.api.prequest({
      'url': app.url.integralCategory,
    }).then(res => {
      console.log(res)
      var postNav = res.data
      for (let i in postNav) {
        postNav[i].url = postNav[i].icon == "''" ? '' : (that.data.url + JSON.parse(postNav[i].icon)[0].url)
        postNav[i].label = postNav[i].name
        postNav[i].entry = {
          "value": 'typelist',
          "param": { id: postNav[i].id, title: postNav[i].label }
        }
      }
      console.log(postNav)
      that.setData({
        Typeswiper: {
          "color": "#666",
          "shape": 3,
          "buttonNumberOfCol": 5,
          "buttonNumberOfRow": 1,
          "entryButtonList": postNav,
        }
      })
    })
  },
  // 获取商品列表
  getProlist(e) {
    var that = this, params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.url.goodsList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].logo = app.util.getImgUrl(res.data[i].logo)
      }
      if (res.data.length <=0) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      var itemList = that.data.itemList
      itemList = itemList.concat(res.data)
      that.setData({
        itemList: itemList,
        isget: true,
      })
      console.log('列表信息', res)
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
    app.api.userinfo((info) => {
      console.log(info)
      this.setData({
        userinfo: info,
      })
    })
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
      this.getProlist()
      // if (this.data.key == '0') {
      //   this.getProlist()
      // }
    }
  },

})