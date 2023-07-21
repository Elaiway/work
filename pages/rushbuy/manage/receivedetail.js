// pages/coupon/myreceive.js
const app = getApp();
Page({
  data: {
    key: 0,
    tabs: [{
      name: "全部",
      id: 0,
    }, {
      name: "未使用",
      id: 1,
    }, {
      name: "已使用",
      id: 2,
    }, {
      name: "已过期",
      id: 3,
    }, ],
    current: '0',
    postList: [],
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
      type: 0,
      goodsId: '',
    },
    statusArray: ["未付款", "已付款", "已发货", "已完成", "已过期", '已取消'],
    //0未付款  //1已付款  //2已发货  // 3已核销（完成） // 4已过期 //5已取消
    layoutBodyOne: {
      className: 'pad_20',
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        wid: 80,
        hei: 80,
        brs: 'br-r-c o-h'
      },
      ft: 1,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    app.setNavigationBarTitle('领取详情')
    this.setData({
      'params.goodsId': options.id
    })
    app.setNavigationBarColor(this)
    this.onTabsChange({
      detail: {
        key: this.data.params.type
      }
    })
    console.log(options)
  },
  //tabs切换
  onTabsChange(e) {
    const {
      key
    } = e.detail
    this.setData({
      key,
      postList: [],
      'params.type': e.detail.key,
      "params.page": 1,
      mygd: false,
      isget: false,
    })
    this.getPostlist()
  },
  // 获取列表信息
  getPostlist(e) {
    let that = this,
      params = this.data.params;
    app.api.prequest({
      "url": app.urlTwo.rushRushInfo,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].tips = this.data.statusArray[res.data[i].state]
        // res.data[i].tips = +res.data[i].delivery == 1 ? this.data.statusArray[+res.data[i].state - 1] : +res.data[i].state - 1 == 1 ? '待核销' : this.data.statusArray[+res.data[i].state - 1];
        res.data[i].createdAt = app.util.ormatDate(res.data[i].createdAt).substring(0, 16)
      }
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      // let postList = that.data.postList
      // postList = postList.concat(res.data)
      var postList = that.data.postList.concat(res.data)
      that.setData({
        postList,
        isget: true,
      })
      console.log(res.data)
    })
  },
  formSubmit: function (e) {
    let that = this,
      co = this.data,
      v = e.detail.value
    console.log('form发生了submit事件，携带数据为：', co, v)
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
        'url': app.urlTwo.rushRushDelivery,
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
          mdoaltoggle: false,
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
        console.log(e.currentTarget.dataset.id)
        return;
      // case 'jjtk':
      //   title = '确定拒绝退款？'
      //   url = 'groupRefund'
      //   params = {
      //     orderId: e.currentTarget.dataset.id,
      //     state: 7,
      //   }
      //   break;
      // case 'qrtk':
      //   title = '确定同意退款？'
      //   url = 'groupRefund'
      //   params = {
      //     orderId: e.currentTarget.dataset.id,
      //   }
      //   break;
      case 'qrsh':
        title = '确认收货吗？'
        url = 'rushRushComplete'
        params = {
          id: e.currentTarget.dataset.id,
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
  // concatClick(e) {
  //   if (e.currentTarget.dataset.idx == 0) {
  //     app.com.preImg({
  //       url: this.data.orderInfo.wxImg,
  //       urls: [this.data.orderInfo.wxImg]
  //     })
  //   } else {
  //     app.util.makePhoneCall(this.data.orderInfo.receivedTel)
  //   }
  // },
  //拨打电话
  onlinkTel(e) {
    app.util.makePhoneCall(e.currentTarget.dataset.tel)
  },
  onShow() {},
  onHide() {},
  onPullDownRefresh() {},
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  }
})