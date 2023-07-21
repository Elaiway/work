// pages/mall/refundorder.js
var app = getApp();
Page({
  data: {
    key: 0,
    tabs: [{
      name: "全部",
      id: 0,
    },
    {
      name: "未使用",
      id: 1,
    },
    {
      name: "已使用",
      id: 2,
    },
    {
      name: "已过期",
      id: 3,
    },
    ],
    postList: [],
    params: {
      size: 10,
      page: 1,
      type: 0,
      goodsId: '',
    },
    statusArray: ["拼团中", "待收货", "已发货", "已完成", "拼团失败", "申请退款中", "退款成功", "拒绝退款", "已过期"],
    layoutBodyOne: {
      className: 'pad_20',
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        wid: 80,
        hei: 80,
        brs:'br-r-c o-h'
      },
      ft: 1,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('领取详情')
    app.setNavigationBarColor(this);
    this.setData({
      'params.goodsId': options.id
    })
    this.onTabsChange({
      detail: {
        key: this.data.params.type
      }
    })
    console.log(options)
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
      'url': app.urlTwo.groupGroupOrder,
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
        item.tips = +item.delivery == 1 ? this.data.statusArray[+item.state - 1] : +item.state - 1 == 1 ? '待核销' : this.data.statusArray[+item.state - 1];
        item.createdAt = app.util.ormatDate(item.createdAt).substring(0, 16)
      })
      var postList = that.data.postList.concat(res.data)
      that.setData({
        postList: postList,
        isget: true,
      })
    })
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
        'url': app.urlTwo.groupDelivery,
        'method': 'POST',
        data: {
          orderId: this.data.orderId,
          logisticsName: v.logisticsName,
          logisticsCode: v.logisticsCode,
        },
      }).then(res => {
        if (res.code) {
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
        that.setData({
          mdoaltoggle:false,
          loading: false
        })
      });
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  clickBtn(e) {
    let title = '',
      url = '',
      params = {}
    switch (e.currentTarget.dataset.field) {
      case 'txdh':
        this.setData({
          orderId: e.currentTarget.dataset.id,
          mdoaltoggle: true,
        })
        return;
      case 'jjtk':
        title = '确定拒绝退款？'
        url = 'groupRefund'
        params = {
          orderId: e.currentTarget.dataset.id,
          state: 7,
        }
        break;
      case 'qrtk':
        title = '确定同意退款？'
        url = 'groupRefund'
        params = {
          orderId: e.currentTarget.dataset.id,
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
  makeTel(e){
    app.util.makePhoneCall(e.currentTarget.dataset.tel)
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

  },
  onReachBottom: function () {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  }
})