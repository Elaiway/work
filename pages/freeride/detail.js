// pages/freeride/index/.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailPage: [],
    isshowpay: false,
    payTel: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('详情页')
    app.setNavigationBarColor(this, () => {
      app.api.prequest({
        'url': app.url.freeCarSet,
        'cachetime': 30,
      }).then(res => {
        that.detailPage()
        that.setData({
          freeCarSet: res.data,
          ad: wx.getStorageSync('codeAd')
        })
        console.log(res)
      })
    });
    this.setData({
      id: options.tid
    })
    console.log(options.tid)
    // this.detailPage()
    // 获取用户信息
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
  },
  detailPage() {
    var that = this
    app.api.prequest({
      'url': app.url.freeCarInfo,
      data: {
        id: this.data.id
      }
    }).then(res => {
      res.data.createdAt = app.util.ormatDate(res.data.createdAt)
      res.data.createdAt = res.data.createdAt.substring(0, 16)
      res.data.startTime = app.util.ormatDate(res.data.startTime)
      res.data.startTime = res.data.startTime.substring(0, 16)
      res.data.endTime = app.util.ormatDate(res.data.endTime)
      res.data.endTime = res.data.endTime.substring(0, 16)
      if (res.data.shareNum == null){
        res.data.shareNum=0
      }
      if (res.data.followNum == null) {
        res.data.followNum = 0
      }
      let detailPage = res.data
      that.setData({
        detailPage,
      })
      this.getCollection()
      this.getCategory()
      console.log('详情信息', res.data, this.data.id)
    })

  },
  // 查看用户是否已经收藏该信息
  getCollection(e) {
    var that = this, tel = this.data.detailPage.linkTel;
    if (!this.getIsTel()) {
      tel = app.com.hideTel(tel)
    }
    this.setData({
      tel,
    })
    console.log("tel", tel)
    console.log(that.data)
    app.api.request({
      url: app.url.collection,
      data: {
        postId: this.data.id,
        userId: wx.getStorageSync('users').id
      },
      success: res => {
        console.log("用户的收藏结果为", res)
        if (res.data.code == '1') {
          that.setData({
            foot_menu: {
              menu: [{
                icon: 'icon-shouye',
                name: '首页',
                src: "/pages/freeride/index",
                navigateType: '3',
                isLogin: 0
              },
              {
                icon: 'icon-fabudianjizhuangtai-',
                name: '发布',
                // src: "/pages/yellow/inde",
                // navigateType: '1',
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
                name: tel,
                cName: '拨打电话',
                isMain: true,
                isLogin: 1
              },
              color: that.data.color,
              right: true,
            },
          })
        }
      }
    })
  },
  //底部点击导航
  footclick(e) {
    let that = this;
    if (e.detail.name.indexOf('收藏') > -1) {
      this.collection()
    }
    else if (e.detail.isMain) {
      if (!this.getIsTel()) {
        wx.showModal({
          title: '提示',
          content: `查看电话需${that.data.detailPage.moneyData.seeMoney}元`,
          success(res) {
            if (res.confirm) {
              that.setData({
                isshowpay: !that.data.ishowpay,
                payobj: { params: { type: 3, carId: that.data.id, money: that.data.detailPage.moneyData.seeMoney, }, apiurl: app.url.lookPay }
              })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      else {
        app.util.makePhoneCall(this.data.detailPage.linkTel)
      }
    }
    else if (e.detail.name.indexOf('发布') > -1){
      console.log('发布')
      this.setData({
        visible: true,
      })
    }
    console.log(e.detail)
  },
  //点击取消弹窗
  handleCancel() {
    this.setData({
      visible: false
    });
  },
  //点击选择弹窗列表
  handleClickItem(e) {
    const index = e.detail.index;
    console.log(this.data.actions[index])
    wx.navigateTo({
      url: '/pages/freeride/release?id=' + this.data.actions[index].id + '&name=' + this.data.actions[index].name,
    })
    this.setData({
      visible: false
    })
  },
  // 获取顺风车分类
  getCategory(e) {
    app.api.prequest({
      'url': app.url.freeCategory,
    }).then(res => {
      console.log(res)
      let actions = res.data
      this.setData({
        actions,
      })
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
        type: 5,
      }
    }).then(res => {
      console.log(res.data, that.data.detailPage.id)
      if (res.data.status == '1') {
        app.util.getShowtoast('收藏成功')
      } else {
        app.util.getShowtoast('取消成功')
      }
      that.detailPage()
      wx.hideLoading()
    })
  },
  getIsTel() {
    console.log(this.data.detailPage, this.data.freeCarSet)
    let info = this.data.detailPage, config = this.data.freeCarSet
    if (info.moneyData.seeMoney && +info.moneyData.seeMoney > 0) {
      if (config.see == '2') {//多次收费
        if (this.data.payTel) {
          return true
        }
        else {
          return false
        }
      }
      else {//单次收费
        if (info.isLook) {//付过费
          return true
        }
        else {//没付过费
          return false
        }
      }
    }
    else {//没设置联系电话费用
      console.log("没设置联系电话费用")
      return true
    }
  },
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      this.setData({
        payTel: true,
      })
      this.detailPage()
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
   * 页面相关事件处理函数--点击分享
   */
  onShareAppMessage: function () {
    return {
      title: '【' + this.data.detailPage.linkMan + '】' + ' ' + this.data.detailPage.name,
      path: '/pages/freeride/detail?tid=' + this.data.detailPage.id,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: '【' + this.data.detailPage.linkMan + '】' + ' ' + this.data.detailPage.name,
      path: '/pages/freeride/detail?tid=' + this.data.detailPage.id,
    }
  }
})