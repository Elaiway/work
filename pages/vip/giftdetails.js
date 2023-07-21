// pages/vip/giftdetails.js
var app = getApp();
Page({
  data: {
    layoutBodyOne: {
      hd: 1,
      bd: {
        styleName: 'padding:0rpx 20rpx 0rpx 0'
      },
      img: {
        brs: 'br-r-10',
        wid: 160,
        hei: 160,
      },
      ft: 1,
    },
    qrcodetoggle: false,
  },
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('开卡礼包详情')
    app.setNavigationBarColor(this);
    this.setData({
      id: options.id,
      system:app.system,
    })
    this.getInfo()
    app.api.userinfo((info) => {
      this.setData({
        userinfo: info
      })
      console.log(info)
    })
    app.api.prequest({
      'url': app.urlTwo.vipGetCode,
      'method': 'POST',
      data: {
        hxId: options.id,
        pageType: 1
      }
    }).then(res => {
      this.setData({
        hxm: res.data
      })
    })
    console.log(options)
  },
  getInfo() {
    app.api.prequest({
      'url': app.urlTwo.vipPackageInfo,
      data: {
        id: this.data.id
      }
    }).then(res => {
      res.data.endTime = app.util.ormatDate(res.data.endTime)
      this.setData({
        detailInfo: res.data,
        foot_menu: {
          menu: [{
              icon: 'icon-shouye',
              name: '首页',
              src: "/pages/vip/index",
              navigateType: '3',
              isLogin: 0
            },
            {
              icon: 'icon-shangjia',
              name: '店铺',
              src: "/pages/store/storemain/storedetail?id=" + res.data.storeId,
              navigateType: '1',
              isLogin: 0
            },
            {
              icon: 'icon-zhanghao',
              name: '我的',
              src: "/pages/vip/my",
              navigateType: '1',
              isLogin: 0
            },
          ],
          main: {
            name: res.data.state == 1 ? '立即使用' : res.data.state == 2 ? '已核销' : '立即领取',
            isMain: true,
            isLogin: 1
          },
          color: this.data.color,
          right: true,
        },
      })
    })
  },
  maketTel() {
    app.util.makePhoneCall(this.data.detailInfo.linkTel)
  },
  openAddress() {
    app.util.openlocation({
      latitude: this.data.detailInfo.lat,
      longitude: this.data.detailInfo.lng,
      name: this.data.detailInfo.storeName,
      address: this.data.detailInfo.address
    })
  },
  footclick(e) {
    if (!e.detail.isMain) return
    let detailInfo = this.data.detailInfo,
      userinfo = this.data.userinfo
    if (!userinfo.isVip) {
      app.util.getShowtoast('请开通会员', 1000, 2)
    } else {
      if (detailInfo.state == 1) {
        this.setData({
          qrcodetoggle: true,
        })

      } else if (detailInfo.state == 2) {
        app.util.getShowtoast('此礼包已核销', 1000, 2)

      } else if (detailInfo.state == 3) {
        wx.showModal({
          title: '提示',
          content: '确认领取此礼包吗？',
          success: (res) => {
            if (res.confirm) {
              app.util.getShowloading('提交中')
              app.api.prequest({
                'url': app.urlTwo.vipReceivePackage,
                'method': 'POST',
                data: {
                  id: detailInfo.id
                },
              }).then(res => {
                if (res.code == '1') {
                  app.util.getShowtoast('领取成功')
                  this.getInfo()
                } else {
                  app.util.getShowtoast(res.msg, 1000, 2)
                }
              });
            }
          }
        })
      }
    }
    console.log(e.detail, detailInfo, userinfo)
  },
  qrcodeclose: function() {
    this.setData({
      qrcodetoggle: false,
    })
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {
    return {
      title: this.data.detailInfo.title,
      path: '/pages/vip/giftdetails?id=' + this.data.detailInfo.id,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: this.data.detailInfo.title,
      path: '/pages/vip/giftdetails?id=' + this.data.detailInfo.id,
    }
  }
})