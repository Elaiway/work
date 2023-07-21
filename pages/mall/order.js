// pages/mall/order.js
var app = getApp();
Page({
  data: {
    key: 1,
    tabs: [{
        name: "全部",
        id: 1,
        status: 1,
      },
      {
        name: "待付款",
        id: 2,
        status: 2,
      },
      {
        name: "待收货",
        id: 3,
        status: 3,
      },
      {
        name: "待评价",
        id: 4,
        status: 4,
      },
      {
        name: "已完成",
        id: 5,
        status: 5,
      },
      {
        name: "退款/售后",
        id: 6,
        status: 6,
      },
    ],
    postList: [],
    params: {
      size: 10,
      page: 1,
      status: 1,
      word: '',
    },
    statusArray: ['未付款', '已付款', '已发货', '已评价', '已完成', '申请退款中', '已退款', '已拒绝退款', '已取消', '待评价'],
    orderconfig: {
      foot: 1,
      type: 'mall',
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
      'params.status': e.detail.key,
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
      'url': app.urlTwo.mallOrderList,
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
        item.tips = this.data.statusArray[item.status];
      })
      var postList = that.data.postList
      
      postList = postList.concat(res.data)
      console.log(postList,66666)
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
      case 'goPay':
        title = '确定支付吗？'
        url = 'mallGoodsPay'
        params = {
          orderId: e.detail.orderInfo.orderId,
          money: e.detail.orderInfo.totalMoney
        }
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
      case 'comfrim':
        title = '确定已收到该商品？'
        url = 'mallCancelOrder'
        params = {
          orderId: e.detail.orderInfo.orderId,
          state: 9
        }
        break;
      case 'refund':
        wx.navigateTo({
          url: '/pages/mall/refundorder?id=' + e.detail.orderInfo.orderId,
        })
        return;
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
                      key: this.data.params.status
                    }
                  })
                }, 1000)
              } else {
                app.util.getShowtoast(res.msg, 1000, 1)
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