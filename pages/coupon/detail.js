// pages/coupon/detail.js
const app = getApp();
Page({
  data: {
    params: {
      page: 1,
      size: 10,
      type: 10,
    },
    isshowpay: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    app.api.coupon(res => {
      that.setData({
        coupon: res,
        ad: wx.getStorageSync('codeAd')
      })
      console.log(res)
    })
    app.setNavigationBarTitle("优惠券详情")
    app.setNavigationBarColor(this, () => {
      this.goodsInfo(options.id)
    });
    this.setData({
      id: options.id
    })
    // 获取用户信息
    app.api.userinfo((userinfo) => {
      console.log(userinfo)
      this.setData({
        userinfo: userinfo,
      })
    })
    console.log(options)
  },
  //yuuy
  goodsInfo(id) {
    let that = this
    app.api.prequest({
      "url": app.url.couponInfo,
      data: {
        id: id
      },
    }).then(res => {
      res.data.logo = app.util.getSingleImgUrl(res.data.logo)
      res.data.storeLogo = app.util.getSingleImgUrl(res.data.storeLogo)
      res.data.endTime = app.util.ormatDate(res.data.endTime).substring(0, 16)
      console.log(res.data,33333)
      let arr = [],
        obj = res.data.service
      for (let i in obj) {
        arr.push(obj[i])
      }
      this.setData({
        goodsInfo: res.data,
        system: app.system,
        'goodsInfo.service': arr
      })
      if (this.data.goodsInfo.storeName) {
        app.api.prequest({
          "url": app.url.userStore,
          data: {
            adminId: this.data.goodsInfo.userId
          }
        }).then(res => {
          res.data.forEach(item => {
            if (item.storeName == this.data.goodsInfo.storeName){
              this.setData({
                userStoreId: item
              })
            }
          })
        })
      }
      // console.log(res.data)
    })
  },
  //领取优惠券
  getcoupons(e) {
    console.log(e.currentTarget.dataset.info)
    let that = this;
    this.setData({
      couponId: e.currentTarget.dataset.info.id
    })
    if (+this.data.goodsInfo.stock <= 0) {
      wx.showModal({
        title: '提示',
        content: '已被抢空',
      })
    } else {
      app.util.getShowloading()
      that.setData({
        loading: true,
      })
      app.api.prequest({
        'url': app.url.couponReceive,
        'method': 'POST',
        data: {
          couponId: this.data.couponId,
        }
      }).then(res => {
        console.log(res)
        that.setData({
          loading: true,
          orderId: res.data,
        })
        // 如果有vip价格的话那就拿取vip价格否则就拿取正常的价格。若开启了vip.但是vip价格不存在或者为零的话，就拿取正常价格
        console.log(this.data.system.openVip && this.data.userinfo.isVip && +this.data.goodsInfo.vipMoney > 0 ? this.data.goodsInfo.vipMoney || parseFloat(this.data.goodsInfo.money) : parseFloat(this.data.goodsInfo.money))
        let money = (this.data.system.openVip && this.data.userinfo.isVip && +this.data.goodsInfo.vipMoney > 0 ? +this.data.goodsInfo.vipMoney || parseFloat(this.data.goodsInfo.money) : parseFloat(this.data.goodsInfo.money)).toFixed(2)
        const needPay = !isNaN(money) && money > 0
        if (needPay) {
          wx.showModal({
            title: '提示',
            content: '需要支付' + money + '元',
            success(res) {
              console.log(that.data.orderId)
              if (res.confirm) {
                that.setData({
                  isshowpay: true,
                  payobj: {
                    params: {
                      money: money,
                      orderId: that.data.orderId,
                    },
                    apiurl: app.url.couponPay
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                that.setData({
                  loading: false
                })
              }
            }
          })
        } else {
          console.log('免费领取')
          app.util.getShowtoast('领取成功', 1000)
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/coupon/detail?id=' + this.data.id,
            })
          }, 1000)
        }
      })

    }
  },
  //支付回调
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/coupon/detail?id=' + this.data.id,
        })
      }, 1000)
    }
  },
  //点击商家店铺
  goStoreDetail() {
    app.util.goUrl({
      param: this.data.goodsInfo.storeId,
      value: "businessInfo"
    })
  },
  //预览图片
  previewImage(e) {
    const i = e.currentTarget.dataset.i
    const urls = app.util.getImgsUrl(JSON.parse(JSON.stringify(this.data.goodsInfo.detailImgs)))
    app.com.preImg({
      url: urls[i],
      urls
    })
  },
  onShow() {},
  onHide() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {
    return {
      title: `【${this.data.goodsInfo.title}】只要${this.data.goodsInfo.money}元`,
      imageUrl: this.data.goodsInfo.logo[0] && this.data.goodsInfo.logo[0].url,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: `【${this.data.goodsInfo.title}】只要${this.data.goodsInfo.money}元`,
      imageUrl: this.data.goodsInfo.logo[0] && this.data.goodsInfo.logo[0].url,
      path: '/pages/coupon/detail?id=' + this.data.id,
    }
  }
})