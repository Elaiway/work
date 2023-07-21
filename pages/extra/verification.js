// pages/extra/verification.js
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('核销')
    let scene = decodeURIComponent(options.scene).split(',')
    this.setData({
      hxId: scene[0],
      pageType: scene[1]
    })
    app.api.userinfo((info) => {
      this.setData({
        userinfo: info
      })
      console.log(info)
    })
    app.setNavigationBarColor(this, () => {
      app.api.prequest({
        'url': scene[1] == 1 ? app.urlTwo.vipPackageInfo : app.urlTwo.vipPrivilegeInfo,
        data: {
          id: scene[0]
        }
      }).then(res => {
        if (this.data.pageType == 2) {
          res.data.logo = app.util.getImgUrl(res.data.logo)
        }
        that.setData({
          detailInfo: res.data,
        })
      })
    });
    console.log(options, scene)
  },
  qdhx() {
    let url = '',
      params = {}
    if (this.data.pageType == 1) {
      url = 'vipPackageWriteOff';
      params = {
        id: this.data.hxId
      }
    } else if (this.data.pageType == 2) {
      url = 'vipUsePrivilege';
      params = {
        id: this.data.hxId
      }
    }
    app.util.getShowloading('提交中')
    this.setData({
      loading: true,
    })
    app.api.prequest({
      'url': app.urlTwo[url],
      'method': 'POST',
      data: params,
    }).then(res => {
      if (res.code == '1') {
        app.util.getShowtoast('操作成功')
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/vip/index',
          })
        }, 1000)
      } else {
        app.util.getShowtoast(res.msg, 1000, 2)
        this.setData({
          loading: false
        })
      }
      console.log('add', res.data)
    });
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  }
})