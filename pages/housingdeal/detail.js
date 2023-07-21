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
        'url': app.url.housRenting,
        'cachetime': 30,
      }).then(res => {
        that.detailPage()
        that.setData({
          housRenting: res.data,
          ad: wx.getStorageSync('codeAd')
        })
        app.isLocation(function () {
          console.log('getlocation')
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
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
  },
  detailPage() {
    var that = this
    app.api.prequest({
      'url': app.url.housRentingInfo,
      data: {
        id: this.data.id
      }
    }).then(res => {
      res.data.createdAt = app.util.settime(res.data.createdAt)
      res.data.imgs = app.util.getTypeImgsUrl(res.data.imgs)
      res.data.openTime = app.util.ormatDate(res.data.openTime).substring(0, 11)
      if (res.data.apartment != null) {
        res.data.apartment = res.data.apartment.substring(0, 2).replace(/\-/g, '室') + res.data.apartment.substring(2).replace(/\-/g, '厅')
      }
      // let theObj = res.data.rent
      // function checkNumber(theObj) {
      //   let reg = /^[0-9]+.?[0-9]*$/;
      //   if (reg.test(theObj)) {
      //     return true;
      //   }
      //   return false;
      // }
      let detailPage = res.data
      that.setData({
        detailPage,
        Swiper: {
          "padding": 0,
          "height": 230,
          "maxLimit": 300,
          "minLimit": 100,
          "swiper": {
            "children": res.data.imgs
          }
        }
      })
      this.getCollection()
      console.log(res.data, this.data.id)
    })
  },
  // 查看用户是否已经收藏该信息
  getCollection(e) {
    let that = this,
      tel = this.data.detailPage.linkTel;
    if (!this.getIsTel()) {
      tel = app.com.hideTel(tel)
    }
    this.setData({
      tel,
    })
    console.log("tel", tel)
    console.log(that.data)
    app.api.prequest({
      url: app.url.collection,
      data: {
        postId: this.data.id,
        userId: wx.getStorageSync('users').id
      },
    }).then(res => {
      console.log("用户的收藏结果为", res)
      if (res.code == '1') {
        that.setData({
          foot_menu: {
            menu: [{
                icon: 'icon-shouye',
                name: '首页',
                src: "/pages/housingdeal/index",
                navigateType: '3',
                isLogin: 0
              },
              {
                icon: 'icon-fabudianjizhuangtai-',
                name: '发布',
                src: that.data.detailPage.identifying <= 4 ? `/pages/housingdeal/release?typeId=${that.data.detailPage.typeId}&name=${that.data.detailPage.name}&type=${that.data.detailPage.identifying}` : `/pages/housingdeal/releasesale?typeId=${that.data.detailPage.typeId}&name=${that.data.detailPage.name}&type=${that.data.detailPage.identifying}`,   
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
              name: tel,
              cName: that.data.detailPage.linkMan,
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
                payobj: { params: { type: 4, rentingId: that.data.id, money: that.data.detailPage.moneyData.seeMoney, }, apiurl: app.url.lookPay }
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
    console.log(e.detail)
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
        type: 9,
      }
    }).then(res => {
      if (res.data.status == '1') {
        app.util.getShowtoast('收藏成功')
      } else {
        app.util.getShowtoast('取消成功')
      }
      that.detailPage()
      wx.hideLoading()
      console.log(res.data, that.data.detailPage.id)
    })
  },
  getIsTel() {
    console.log(this.data.detailPage, this.data.housRenting)
    let info = this.data.detailPage, config = this.data.housRenting
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
  opaddress(){
    var storeInfo = this.data.detailPage,
      addressobj = {
        latitude: storeInfo.lat,
        longitude: storeInfo.lng,
        name: storeInfo.communityName,
        address: storeInfo.address,
      }
    app.util.openlocation(addressobj)
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
      // title: '【' + this.data.detailPage.linkMan + '】' + ' ' + this.data.detailPage.name,
      title: this.data.detailPage.title,
      path: '/pages/housingdeal/detail?id=' + this.data.detailPage.id,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: this.data.detailPage.title,
      path: '/pages/housingdeal/detail?id=' + this.data.detailPage.id,
    }
  }
})