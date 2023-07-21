// pages/store/storemain/storedetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onshare: false,
    isget: true,
    key: '0',
    siteroot: app.setInfo.siteroot,
    tabs: [{
        name: '详情',
        id: '0',
      },
      {
        name: '商家动态',
        id: '1',
      },
      // {
      //     name: '粉丝',
      //     id: '2',
      // }
    ],
  },
  morePost(e) {
    wx.navigateTo({
      url: '/pages/personal/homepage/index?user_id=' + this.data.storeInfo.adminId,
    })
  },
  // 转发分享
  share(e) {
    this.setData({
      onshare: true
    })
  },
  //sjvr
  sjvr() {
    wx.setStorageSync('vr', this.data.storeInfo.vr)
    wx.navigateTo({
      url: '/pages/extra/link',
    })
  },
  //
  ylphotoList() {
    wx.navigateTo({
      url: '/pages/extra/photolist?arr=' + JSON.stringify(this.data.storeInfo.photoList),
    })
    // var that = this,
    //     urls = that.data.storeInfo.photoList.map((item) => {
    //         return item.url
    //     });
    // console.log(urls)
    // wx.previewImage({
    //     urls: urls,
    // })
  },
  //
  ylwx() {
    var that = this,
      urls = that.data.storeInfo.wxImg.map((item) => {
        return item.url
      });
    console.log(urls)
    wx.previewImage({
      urls: urls,
    })
  },
  //营业执照
  yyzz() {
    let that = this,
      urls = that.data.storeInfo.license.map((item) => {
        return item.url
      });
    console.log(urls)
    wx.previewImage({
      urls: urls,
    })
  },
  opaddress() {
    var storeInfo = this.data.storeInfo,
      addressobj = {
        latitude: storeInfo.lat,
        longitude: storeInfo.lng,
        name: storeInfo.storeName,
        address: storeInfo.address,
      }
    app.util.openlocation(addressobj)
  },
  maketel() {
    var storeInfo = this.data.storeInfo;
    app.util.makePhoneCall(storeInfo.linkTel)
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
      mygd: true,
    })
    if (key == '1') {
      this.store_post()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this,
      scene = decodeURIComponent(options.scene).split(',')
    this.setData({
      id: options.id || (options.scene && scene[0]) || 1,
       ad: wx.getStorageSync('codeAd')
    })
    app.setNavigationBarColor(this, () => {
      app.api.storeconfig((info) => {
        that.setData({
          storeconfig: info,
          'tabs[1].name': info.field+'动态'
        })
        that.storeInfo()
      })
      app.isLocation(function() {
        console.log('getlocation')
      })
    });
    // 获取用户信息
    app.getUserInfo((userinfo)=> {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
      app.api.storeconfig((info) => {
        this.isLogin(info)
      })
    });
  },
  storeInfo(e) {
    var that = this,
      id = that.data.id
    app.api.request({
      url: app.url.bussinessInfo,
      data: {
        id: id,
        userId: wx.getStorageSync('users').id
      },
      success: res => {
        //console.log(res)
        app.setNavigationBarTitle(res.data.data.storeName)
        var storeInfo = res.data.data
        // that.getLocation(storeInfo)
        storeInfo.storeLogo = JSON.parse(storeInfo.storeLogo)
        storeInfo.photoList = app.util.getTypeImgsUrl(storeInfo.photoList)
        storeInfo.wxImg = app.util.getTypeImgsUrl(storeInfo.wxImg)
        if (storeInfo.license){
          storeInfo.license = app.util.getTypeImgsUrl(storeInfo.license)
        }
        storeInfo.meal || (storeInfo.meal = [])
        //插件数据图片等构造为组件需要显示的字段
        storeInfo.goods.forEach(item => {
          item.showImgs = app.util.getImgUrl(item.showImgs)
        })
        storeInfo.group.forEach(item => {
          item.showImgs = app.util.getImgUrl(item.showImgs)
          item.label = app.com.objToArr(item.label)
        })
        storeInfo.bargain.forEach(item => {
          item.logo = app.util.getSingleImgUrl(item.logo)
        })
        storeInfo.activity.forEach(item => {
          item.startTime = app.util.ormatDate(item.startTime).substring(0, 16)
          item.createdAt = app.util.settime(item.createdAt)
          item.showImgs = app.util.getImgUrl(item.showImgs)
        })
        storeInfo.rush.forEach(item => {
          item.showImgs = app.util.getImgUrl(item.showImgs)
          item.vipMoney = app.system.openVip ? item.vipMoney : ''
        })
        //插件是否显示
        storeInfo.auxiliary = {
          activity: storeInfo.meal.indexOf('activity') > -1,
          shop: storeInfo.meal.indexOf('shop') > -1,
          coupon: storeInfo.meal.indexOf('coupon') > -1,
          vip: storeInfo.meal.indexOf('vip') > -1,
          group: storeInfo.meal.indexOf('group') > -1,
          rush: storeInfo.meal.indexOf('rush') > -1,
          bargain: storeInfo.meal.indexOf('bargain') > -1,
        }
        var footleft = [{
            img: '/assets/images/img/index.png',
            name: '首页',
            src: "/pages/index/index",
            navigateType: '3',
            type: 0, //0  跳转  1  收藏
          },
          {
            img: '/assets/images/img/fabu.png',
            name: '我要入驻',
            src: "/pages/store/storeentry/storeentry",
            type: 0
          },
          // {
          //   img: '/assets/images/img/sixin.png',
          //   name: '私信',
          //   src: "/pages/message/index/index",
          //   type: 0
          // }
        ]
        if (that.data.storeconfig.enter != '1') {
          footleft[1].hide = true
        }
        // storeInfo.storeLabel = storeInfo.storeLabel.split(",")
        that.setData({
          storeInfo: res.data.data,
          store_userid: res.data.adminId,
          //底部
          foot_menu: {
            _left: footleft,
            _right: "联系" + that.data.storeconfig.field,
            right_type: '1',
            right_tel: res.data.data.linkTel,
            width: "40",
            _rightsrc: '/pages/message/index/index',
            color: that.data.color
          },
          Swiper: {
            "padding": 0,
            "height": app.system.slideNum,
            "mode": 'aspectFill',
            "maxLimit": 300,
            "minLimit": 100,
            "swiper": {
              "children": storeInfo.photoList
            }
          },
        })
        app.api.prequest({
          'url': app.url.commongetCodeImg,
          data: {
            scene: `${id}`,
            pages: 'pages/store/storemain/storedetail',
            type: 1,
          }
        }).then(res => {
          that.setData({
            tym: res.data
          })
          that.getXcxm()
        })
      }
    })
  },
  getXcxm() {
    let logo = this.data.url + this.data.storeInfo.storeLogo[0].url,
      tym = this.data.tym
    const wxGetImageInfo = app.com.promisify(wx.getImageInfo)
    Promise.all([
      wxGetImageInfo({
        src: logo
      }),
      wxGetImageInfo({
        src: tym
      })
    ]).then(res => {
      let ctx = wx.createCanvasContext('ctx')
      ctx.drawImage(res[1].path, 0, 0, 150, 150)
      ctx.save()
      ctx.beginPath()
      ctx.arc(75, 75, 35, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(res[0].path, 35, 35, 75, 75)
      ctx.restore()
      ctx.draw()
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 150,
          height: 150,
          canvasId: 'ctx',
          success: (res) => {
            console.log(res.tempFilePath)
            this.setData({
              xcxm: res.tempFilePath
            })
          }
        })
      }, 500)
      //console.log('wxGetImageInfo', res)
    })
    //console.log(logo, tym)
  },
  // 获取当前开车距离
  getLocation(storeInfo) {

    wx.showLoading({
      title: "正在计算距离",
      mask: !0
    })
    var that = this
    app.util.getLocation({
      latitude: storeInfo.lat,
      longitude: storeInfo.lng,
      // latitude:"31.1281992991",
      // longitude:"100.9863281250",
      type: "2",
      success: res => {
        console.log(res)
        var result = res.result.elements[0]
        that.setData({
          distance: (result.distance / 1000).toFixed(2),
          seconds: app.util.formatSeconds(result.duration)
        })
        wx.hideLoading()
      },
      fail: res => {
        console.log("失败信息", res)
      }
    })
  },
  store_post(e) {
    var that = this
    wx.showLoading({
      title: "正在加载",
      mask: !0
    })
    app.api.userPost({
      data: {
        page: 1,
        size: 3,
        status: "display",
        userId: that.data.storeInfo.adminId, //that.data.store_userid
      },
      success: res => {
        console.log(res)
        that.setData({
          postList: res.data.data
        })
        wx.hideLoading()
      }
    })
  },
  // 信息点赞后刷新贴子数据
  slide(e) {
    var that = this,
      postList = that.data.postList,
      index = e.detail,
      obj = {
        portrait: wx.getStorageSync('users').portrait,
        userName: wx.getStorageSync('users').userName,
        userId: wx.getStorageSync('users').id
      },
      user_id = wx.getStorageSync('users').id
    var dz = postList[index].dz
    console.log(dz, obj, typeof(app.util.ifArrVal(dz, user_id)))
    if (dz.length == 0) {
      dz = dz.concat(obj)
    } else {
      if (typeof(app.util.ifArrVal(dz, user_id)) == 'number') {
        app.util.getShowtoast("取消点赞")
        dz.splice(app.util.ifArrVal(dz, user_id), 1)
        console.log("删除", dz)
      } else {
        app.util.getShowtoast("点赞成功")
        console.log("执行的是添加操作")
        dz = dz.concat(obj)
      }
    }
    postList[index].dz = dz
    wx.hideLoading()
    this.setData({
      postList: postList
    })
  },
  //用户收藏操作 
  collection_store(e) {
    var that = this
    wx.showLoading({
      title: "",
      mask: !0
    })
    app.api.request({
      url: app.url.collection_post,
      method: "POST",
      data: {
        postId: that.data.storeInfo.id,
        userId: wx.getStorageSync('users').id,
        type: 2,
      },
      success: res => {
        if (res.data.data.status == '1') {
          app.util.getShowtoast('关注成功')
        } else {
          app.util.getShowtoast('取消关注')
        }
        that.storeInfo()
        wx.hideLoading()
      }
    })
  },
  isLogin(info){
    if (app.globalData.isLogin == 0 && info.isLogin=='1') {
      wx.showModal({
        title: '温馨提示',
        content: '您还未登录，您需要登录才可以进行操作哦',
        success(res) {
          if (res.confirm){
            wx.redirectTo({
              url: '/pages/login/logincode/index',
            })
          }else{
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    this.setData({
      onshare: false,
    })
    var that = this,
      storeconfig = that.data.storeconfig,
      shareImg = storeconfig.shareImg,
      id = that.data.id;
    // console.log(storeconfig, id)
    app.api.request({
      url: app.url.storeShare,
      data: {
        storeId: id,
      },
      method: "POST",
      success: res => {
        console.log('success', res)
      }
    })
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      // title: storeconfig.title + storeconfig.shareDescription,
      // imageUrl: shareImg == '' ? '' : shareImg,
      // title: '【' + that.data.storeInfo.typeName + '】' + '【' + that.data.storeInfo.nTypeName + '】' + that.data.storeInfo.storeName,
      title: that.data.storeInfo.storeName,
      path: '/pages/store/storemain/storedetail?id=' + that.data.id,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: that.data.storeInfo.storeName,
      imageUrl: that.data.storeconfig.shareImg ? that.data.storeconfig.shareImg : '',
      path: '/pages/store/storemain/storedetail?id=' + that.data.id,
    }
  }
})