// pages/extra/verification.js
var app = getApp();
Page({
  data: {
    layoutBodyOne: {
      className: 'pad_20',
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        wid: 170,
        hei: 170,
      },
      ft: 1,
    },
    footer: {},
    goodscardconfig: {//商城商品
      nopadb: 1,
      num: 1,
      className: 'br-r-0'
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('核销')
    let scene = decodeURIComponent(options.scene).split(',')
    //第一个参数是页面类型 1,核销砍价
    this.setData({
      pageType: scene[0],//1砍价订单核销，2商城订单核销
      scene,
    })
    app.api.userinfo((info) => {
      this.setData({
        userinfo: info
      })
      console.log(info)
    })
    app.setNavigationBarColor(this, () => {
      let url = '',
        params = {},
        method = (res) => {}
      switch (parseInt(scene[0])) {
        case 1:
          url = app.urlTwo.bargainInfo;
          params = {
            orderId: scene[1]
          };
          method = (res) => {
            res.data.endTime = app.util.ormatDate(res.data.endTime).substring(0, 16)
            res.data.orderInfo.createdAt = app.util.ormatDate(res.data.orderInfo.createdAt).substring(0, 16)
            res.data.logo = app.util.getImgUrl(res.data.logo)
            return res.data
          }
          break;
        case 2:
          url = app.urlTwo.mallOrderInfo;
          params = {
            orderId: scene[1]
          };
          method = (res) => {
            res.data.goods.forEach(item => {
              item.url = item.img
              item.title = item.name
            })
            return res.data
          }
          break;
      }
      app.api.prequest({
        'url': url,
        data: params,
      }).then(res => {
        this.setData({
          detailInfo: method(res),
        })
      })
      console.log(options, scene, url, params)
    });
  },
  qdhx() {
    let url = '',
      params = {}
    if (this.data.pageType == 1) {
      url = app.urlTwo['useBargain'];
      params = {
        id: this.data.detailInfo.orderInfo.id
      }
    } else if (this.data.pageType == 2) {
      url = app.urlTwo['validateOrder'];
      params = {
        orderId: this.data.detailInfo.id
      }
    }
    app.util.getShowloading('提交中')
    this.setData({
      loading: true,
    })
    app.api.prequest({
      'url': url,
      'method': 'POST',
      data: params,
    }).then(res => {
      if (res.code == '1') {
        app.util.getShowtoast('操作成功')
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/index/index',
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