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
        name: "砍价中",
        id: 1,
      },
      {
        name: "待处理",
        id: 2,
      },
      {
        name: "已完成",
        id: 3,
      },
    ],
    header:{},
    layoutBodyOne: {
      className: 'pad_20',
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        wid: 150,
        hei: 150,
      },
      ft: 1,
    },
    footer: {},
    postList: [],
    params: {
      size: 10,
      page: 1,
      storeId:'',
    },
  },
  onLoad: function(options) {
    var that = this;
    options.key && this.setData({
      key: options.key,
      'params.state': options.key,
    })
    app.setNavigationBarTitle('员工管理')
    app.setNavigationBarColor(this);
  },
  //tabs切换
  onTabsChange(e) {
    //console.log('onTabsChange', e)
    this.setData({
      postList: [],
      'params.page': 1,
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
      'url': app.urlTwo.clerkList,
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
        item.hideuserTel = app.com.hideTel(item.userTel)
      })
      var postList = that.data.postList
      postList = postList.concat(res.data)
      that.setData({
        postList: postList,
        isget: true,
      })
    })
  },
  add(){
    wx.navigateTo({
      url: '/pages/store/storemanage/storeup/release',
    })
  },
  clickBtn(e) {
    console.log(e.currentTarget.dataset)
    let title = '',
      url = '',
      params = {}
    switch (e.currentTarget.dataset.field) {
      case 'del':
        title = '确定要删除该员工？'
        url = 'clerkDelete'
        params = {
          id: e.currentTarget.dataset.info.id
        }
        break;
      case 'edit':
        wx.navigateTo({
          url: '/pages/store/storemanage/storeup/release?id=' + e.currentTarget.dataset.info.id + '&info=' + JSON.stringify(e.currentTarget.dataset.info),
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
      case 'qrsh':
        title = '确定已收到该商品？'
        url = 'bargainComplete'
        params = {
          id: e.currentTarget.dataset.info.id,
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
                  this.onTabsChange()
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
  goDetail(e){
    wx.navigateTo({
      url: '/pages/bargain/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  onShow: function () {
    this.setData({
      'params.storeId': app.sjdId
    })
    this.onTabsChange()
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