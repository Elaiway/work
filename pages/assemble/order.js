// pages/mall/order.js
var app = getApp();
Page({
  data: {
    key: 0,
    tabs: [{
        name: "全部",
        id: 0,
      },
      {
        name: "拼团中",
        id: 1,
      },
      {
        name: "待收货",
        id: 2,
      },
      {
        name: "已完成",
        id: 3,
      },
      {
        name: "已取消",
        id: 4,
      },
    ],
    postList: [],
    params: {
      size: 10,
      page: 1,
      type: 0,
      word: '',
    },
    tipsMap: ["拼团中", "待收货", "已发货", "已完成", "拼团失败", "申请退款中", "退款成功", "拒绝退款", "已过期"],
    orderconfig: {
      foot: 1,
      type: 'assemble',
    },
  },
  onLoad: function(options) {
    var that = this;
    options.key && this.setData({
      key: options.key,
      'params.status': options.key,
    })
    app.setNavigationBarTitle('我的订单')
    app.setNavigationBarColor(this);
    // 获取用户信息
    app.getUserInfo((userinfo) => {
      this.getPostlist()
      console.log(userinfo)
    })
  },
  //tabs切换
  onTabsChange(e) {
    //console.log('onTabsChange', e)
    this.setData({
      postList: [],
      'params.page': 1,
      'params.type': e.detail.key,
      mygd: false,
      isget: false,
    })
    this.getPostlist()
  },
  // 获取列表信息
  getPostlist(e) {
    var that = this,
      params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.urlTwo.groupMyGroup,
      data: params,
    }).then(res => {
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      res.data.forEach(item => {
        item.tips = +item.groupId > 0 ? this.data.tipsMap[+item.state - 1] : '单独购买'
        item.createdAt = app.util.ormatDate(item.createdAt).substring(0, 16)
        item.goods = [{
          orderId: item.goodsId,
          img: app.util.getImgUrl(item.showImgs),
          name: item.title,
          money: item.goodsMoney,
          num: item.orderNum,
        }]
      })
      var postList = that.data.postList
      postList = postList.concat(res.data)
      that.setData({
        postList: postList,
        isget: true,
      })
    })
  },
  orderClick(e) {
    let title = '',
      url = '',
      params = {}
    switch (e.detail.field) {
      case 'del':
        title = '确定要删除该订单？'
        url = 'mallDelOrder'
        params = {
          orderId: e.detail.orderInfo.orderId
        }
        break;
      case 'detail':
        wx.navigateTo({
          url: '/pages/assemble/orderdetail?orderId=' + e.detail.orderInfo.orderId + '&groupId=' + e.detail.orderInfo.groupId,
        })
        return;
      case 'use': //点击使用
        break;
      case 'cancel':
        title = '确定要取消该订单？'
        url = 'mallCancelOrder'
        params = {
          orderId: e.detail.orderInfo.orderId,
          state: 8
        }
        break;
      case 'comment':
        wx.navigateTo({
          url: '/pages/mall/commentorder?orderInfo=' + JSON.stringify(e.detail.orderInfo),
        })
        return;
      case 'delivery':
        title = '确定已收到该商品？'
        url = 'groupComplete'
        params = {
          orderId: e.detail.orderInfo.orderId,
        }
        break;
      case 'refund':
        title = '确认申请退款'
        url = 'groupApplyRefund'
        params = {
          orderId: e.detail.orderInfo.orderId,
        }
        break;
    }
    if (e.detail.field != 'goPay') {
      wx.showModal({
        title: '提示',
        content: title,
        success: (res) => {
          //点击确定
          if (res.confirm) {
            app.util.getShowloading('提交中')
            app.api.prequest({
              'url': app.urlTwo[url],
              'method': 'POST',
              data: params,
            }).then((res) => {
              if (res.code == '1') {
                app.util.getShowtoast('操作成功')
                setTimeout(() => {
                  this.onTabsChange({
                    detail: {
                      key: this.data.params.type
                    }
                  })
                }, 1000)
              } else {
                app.util.getShowtoast(res.msg, 1000, 2)
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      this.setData({
        isshowpay: true,
        payobj: {
          params: params,
          apiurl: app.urlTwo[url]
        }
      })
    }
    console.log(e.detail)
  },
  //支付回调
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      this.onTabsChange({
        detail: {
          key: this.data.params.status
        }
      })
    }
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  }
})