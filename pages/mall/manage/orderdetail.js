// pages/mall/refundorder.js
var app = getApp();
Page({
  data: {
    goodscardconfig: {
      num: 1,
      pageType: 'mallmanagedetail',
    },
    loading: false,
    params: {
      orderId: '',
      state: 5,
      reason: ''
    },
    concat: [{
      icon: 'icon-xiaoxi',
      name: '联系客服'
    }, {
      icon: 'icon-dianhua',
      name: '拨打电话'
    }],
    statusArray: ['未付款', '已付款', '已发货', '已评价', '已完成', '申请退款中', '已退款', '已拒绝退款', '已取消', '待评价'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('订单详情')
    app.setNavigationBarColor(this);
    app.util.getShowloading()
    app.api.prequest({
      'url': app.urlTwo.mallOrderInfo,
      data: {
        orderId: options.id
      },
    }).then((res) => {
      res.data.createdAt = app.util.ormatDate(res.data.createdAt)
      res.data.wxImg = app.util.getImgUrl(res.data.wxImg)
      res.data.tips = this.data.statusArray[res.data.state];
      res.data.goods.forEach(item => {
        item.url = item.img
        item.title = item.name
      })
      this.setData({
        orderInfo: res.data,
        'params.orderId': options.id,
      })
      if ((res.data.state == 3 || res.data.state == 4 || res.data.state == 9) && res.data.delivery == 2) {
        this.setData({
          code: res.data.code
        })
      }
      app.api.prequest({
        'url': app.urlTwo.addressInfo,
        data: {
          addressId: res.data.selfId
        },
      }).then((res) => {
        this.setData({
          addressInfo: res.data,
        })
      })
    });
    console.log(options)
  },
  formSubmit: function(e) {
    let that = this,
      co = this.data,
      v = e.detail.value
    console.log('form发生了submit事件，携带数据为：', co, v, )
    //校验表单
    let warn = "",
      flag = true;
    if (app.util.isNull(v.logisticsName)) {
      warn = "请输入快递公司";
    } else if (app.util.isNull(v.logisticsCode)) {
      warn = "请输入快递单号";
    } else {
      //return
      flag = false;
      app.util.getShowloading('提交中')
      that.setData({
        loading: true,
      })
      //add
      app.api.prequest({
        'url': app.urlTwo.shopOrderDelivery,
        'method': 'POST',
        data: {
          orderId: this.data.orderInfo.id,
          logisticsName: v.logisticsName,
          logisticsCode: v.logisticsCode,
        },
      }).then(res => {
        if (res.code) {
          app.util.getShowtoast('操作成功')
          app.util.swnb()
        } else {
          app.util.getShowtoast(res.msg, 1000, 1)
          that.setData({
            loading: false
          })
        }
        console.log('add', res.data)
      });
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  orderClick(e) {
    let title = '',
      url = '',
      params = {}
    switch (e.currentTarget.dataset.field) {
      case 'jjtk':
        title = '确定拒绝退款？'
        url = 'shopCancelOrder'
        params = {
          orderId: this.data.orderInfo.id,
          state: 7,
        }
        break;
      case 'tytk':
        title = '确定同意退款？'
        url = 'shopOrderRefund'
        params = {
          orderId: this.data.orderInfo.id,
        }
        break;
    }
    if (e.currentTarget.dataset.field != 'goPay') {
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
                app.util.swnb()
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
  concatClick(e) {
    if (e.currentTarget.dataset.idx == 0) {
      app.com.preImg({
        url: this.data.orderInfo.wxImg,
        urls: [this.data.orderInfo.wxImg]
      })
    } else {
      app.util.makePhoneCall(this.data.orderInfo.receivedTel)
    }
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  }
})