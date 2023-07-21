// pages/coupon/detail.js
const app = getApp();
let dsq;
Page({
  data: {
    orderDetail:[],
    layoutBodyOne: {
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        brs: 'br-r-20',
        wid: 180,
        hei: 180,
      },
    },
    layoutBody: {
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        styleName: 'margin-top: -0rpx;',
        brs: 'br-r-20',
        wid: 200,
        hei: 200,
      },
    },
    params: {
      orderId: '',
      selfId: '',
      delivery: '',
      receivedName: '',
      receivedAddress: '',
      receivedTel: '',
      note: '',
    },
    isshowpay: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {


    let that = this,
      scene = decodeURIComponent(options.scene),
      query = {};
    //分享出去携带orderId，核销orderId，groupId，iswriteOff，砍价详情id,都是进入此页面
    query.orderId = options.orderId || ''
    query.id = options.id || ''
    query.isShare = options.isShare
    query.iswriteOff = options.iswriteOff
    if (options.scene) {
      query.orderId = scene
      query.iswriteOff = true
    }
    this.setData({
      query,
    })
    //
    app.api.bargain(res => {
      this.setData({
        bargainConfig: res,
      })
    })
    app.setNavigationBarTitle("砍价详情")
    app.setNavigationBarColor(this, () => {});
    // 获取用户信息
    app.api.userinfo((userInfo) => {
      console.log(userInfo)
      this.setData({
        userInfo,
      })
      if (query.orderId) {
        this.getInfo({
          orderId: query.orderId
        })
      } else {
        this.getInfo({
          id: query.id
        })
      }
    })
    console.log(scene, options, query)
  },
  getInfo(params) {
    app.util.getShowloading()
    app.api.prequest({
      'url': app.urlTwo.bargainInfo,
      data: params,
    }).then((result) => {
      let res = result.data
      res.orderList.forEach(item => {
        item.createdAt = app.util.ormatDate(item.createdAt).substring(0, 16)
      })
      res.bargainList = (res.bargainInfo || []).map(item => {
        item.createdAt = app.util.ormatDate(item.createdAt).substring(0, 16)
        return item
      })
      res.orderInfo && (res.orderInfo.createdAt = app.util.ormatDate(res.orderInfo.createdAt))
      this.setData({
        orderDetail:res
      })
    //   this.back = wx.getBackgroundAudioManager() 
    //   this.back.src = this.data.orderDetail.music
    //   // this.back.src = "http://downsc.chinaz.net/Files/DownLoad/sound1/202005/12885.wav"
    // this.back.title = 'Tassel'   // 标题为必选项
    // this.back.play()












      console.log(this.data.orderDetail,66666)
      console.log("bargainInfo", res);
     
      let bargainInfo = {
          title: res.title,
          body: res.body,
          floorPrice: (+res.floorPrice || 0).toFixed(2),
          price: (+res.price || 0).toFixed(2),
          viewNum: res.viewNum || 0,
          joinNum: res.receiveNum || 0,
          bargainMoney: res.bargainMoney || 0, //已砍
          userName: res.user.userName || this.data.userInfo.userName,
          portrait: res.user.portrait || this.data.userInfo.portrait,
          bg: res.color || '#fff',
          state: res.state == 4 && res.orderInfo.userId != this.data.userInfo.id ? 1 : +res.state, //1.发起砍价2砍价中3.点击购买4完成
          stock: res.stock || 0,
          useTime: app.util.ormatDate(res.useTime).substring(0, 16),
          id: res.id,
          shareNum: res.shareNum || 0,
          music: res.music,
          isFloor: +res.isFloor == 1, //1为允许未到底价购买
          progress: ((res.bargainMoney && res.bargainMoney > 0 ? (res.bargainMoney / (res.price - res.floorPrice)) : 0) * 100).toFixed(2),
          imgs: res.media,
          delivery: +res.delivery,
          endTime: app.util.ormatDate(res.endTime),
          storeId: res.storeId
        },
        orderInfo = res.orderInfo || {};
        console.log("orderInfo", orderInfo);
      this.setData({
        bargainInfo,
        orderInfo,
        detailInfo: res,
        syMoney: (Math.abs(bargainInfo.price - bargainInfo.bargainMoney - bargainInfo.floorPrice)).toFixed(2), //还剩
        'params.delivery': orderInfo.delivery,
        'params.orderId': orderInfo.id,
        'query.id': res.id, //bargainId商品ID用于发起我的砍价
      })
      console.log(bargainInfo)
      //获取核销码
      if (orderInfo.delivery == 2 && bargainInfo.state == 4) {
        app.api.prequest({
          'url': app.url.commongetCode,
          data: {
            scene: `1,${orderInfo.id}`,
            pages: 'pages/bargain/writeoff'
          }
        }).then(res => {
          this.setData({
            hxm: res.data
          })
        })
      }
      //获取自提点
      if (bargainInfo.state == 4) {
        app.api.prequest({
          'url': app.urlTwo.addressInfo,
          data: {
            addressId: orderInfo.selfId
          },
        }).then((res) => {
          this.setData({
            addressInfo: res.data,
          })
          console.log(this.data.addressInfo,33333)
        })
      }
      //已完成不倒计时
      if (bargainInfo.state == 1 || bargainInfo.state == 4) return
      //倒计时
      let timeStamp = parseInt(res.endTime || 0) - parseInt(new Date().getTime() / 1000);
      this.setData({
        expireTime: app.com.countDownTime(timeStamp)
      })
      dsq = setInterval(() => {
        timeStamp -= 1
        if (timeStamp <= 0) clearInterval(dsq)
        this.setData({
          expireTime: app.com.countDownTime(timeStamp)
        })
        console.log('倒计时', this.data.expireTime)
      }, 1000)
    });
  },
  getaddress(e) {
    if (e.detail) {
      this.setData({
        'params.receivedName': e.detail.linkName || '',
        'params.receivedAddress': (e.detail.address + e.detail.detailedAddress) || '',
        'params.receivedTel': e.detail.linkTel || '',
      })
    }
    console.log(e.detail, this.data.params)
  },
  getztd(e) {
    if (e.detail) {
      this.setData({
        'params.selfId': e.detail.id
      })
    }
    console.log(e.detail, this.data.params)
  },
  //关闭弹窗
  togglePopup() {
    this.setData({
      popupshow: !this.data.popupshow,
    })
  },
  //现价购买
  xjgm() {
    this.setData({
      popupshow: true,
    })
  },
  //立即下单
  formSubmit: function(e) {
    let that = this,
      co = this.data,
      v = e.detail.value;
    //自取时收货人联系方式从用户信息里给  
    if (co.params.delivery == '2') {
      this.setData({
        'params.receivedName': co.userInfo.userName,
        'params.receivedTel': co.userInfo.userTel,
      })
    }
    this.setData({
      'params.note': v.note
    })
    console.log('form发生了submit事件，携带数据为：', co, co.params, v)
    //校验表单
    let warn = "",
      flag = true;
    if (co.params.delivery == '1' && !co.params.receivedAddress) {
      warn = "请选择收货地址";
    } else if (co.params.delivery == '2' && !co.params.selfId) {
      warn = "请选择自提点";
    } else {
      flag = false;
      //return
      wx.showModal({
        title: '提示',
        content: "需要支付：" + co.orderInfo.money + "元",
        success: (res) => {
          //点击确定
          this.togglePopup()
          if (res.confirm) {
            app.util.getShowloading('提交中')
            app.api.prequest({
              'url': app.urlTwo.bargainOrderPay,
              'method': 'POST',
              data: co.params,
            }).then((res) => {
              if (res.code == '1') {
                let oid = res.data
                that.setData({
                  isshowpay: true,
                  payobj: {
                    params: {
                      money: co.orderInfo.money,
                      orderId: oid
                    },
                    apiurl: app.url.bargainPay
                  }
                })
                // if (Number(co.params.money) > 0) {
                //   wx.hideLoading()
                //   that.setData({
                //     isshowpay: !that.data.isshowpay,
                //     payobj: {
                //       params: {
                //         money: co.params.totalMoney,
                //         orderId: oid
                //       },
                //       apiurl: app.urlTwo.mallGoodsPay
                //     }
                //   })
                // } else {
                //   app.util.getShowtoast('兑换成功')
                //   setTimeout(()=> {
                //     wx.redirectTo({
                //       url: '/pages/personal/integral/integralmall/myorder',
                //     })
                //   }, 1000)
                // }
              } else {
                app.util.getShowtoast(res.msg, 1000, 1)
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  //支付回调
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/bargain/order',
        })
      }, 1000)
    }
  },
  //开始发起砍价
  startBargain() {
    if (app.isLogin()) {
      this.setData({
        loading: true,
      })
      app.util.getShowloading('正在发起中...')
      app.api.prequest({
        'url': app.urlTwo.bargainStartBargain,
        'method': 'POST',
        data: {
          bargainId: this.data.query.id
        },
      }).then((res) => {
        if (res.code == '1') {
          this.atNowBargain(res.data);
        } else {
          this.setData({
            loading: false,
          })
          app.util.getShowtoast(res.msg, 1000, 2)
        }
      });
    }
  },
  //砍一刀价
  atNowBargain(orderId) {
    if (app.isLogin()) {
      this.setData({
        loading: true,
      })
      app.util.getShowloading('疯狂砍价中...')
      app.api.prequest({
        'url': app.urlTwo.bargainIng,
        'method': 'POST',
        data: {
          orderId,
        },
      }).then((res) => {
        if (res.code == '1') {
          app.util.getShowtoast('成功砍掉' + res.data + '元', 1000, 2)
          setTimeout(() => {
            this.getInfo({
              orderId
            })
            this.setData({
              loading: false,
            })
          }, 1000)
        } else {
          this.setData({
            loading: false,
          })
          app.util.getShowtoast(res.msg, 1000, 2)
        }
      });
    }
  },
  //帮好友砍一刀
  bhykyd() {
    this.atNowBargain(this.data.orderInfo.id)
  },
  //点击商家店铺
  goStoreDetail() {
    app.util.goUrl({
      param: this.data.bargainInfo.storeId,
      value: "businessInfo"
    })
  },
  //预览图片
  previewImage(e) {
    const i = e.currentTarget.dataset.i
    const urls = app.util.getImgsUrl(JSON.parse(JSON.stringify(this.data.bargainInfo.imgs)))
    app.com.preImg({
      url: urls[i],
      urls
    })
  },
  onShow() {},
  onUnload: function() {
    clearInterval(dsq)
  },
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {
    console.log(this.data.orderInfo, this.data.query)
    return {
      title: `【${this.data.bargainInfo.title}】底价${this.data.bargainInfo.floorPrice}`,
      imageUrl: this.data.url + this.data.detailInfo.logo[0].url,
      path: this.data.orderInfo.id ? '/pages/bargain/detail?orderId=' + this.data.orderInfo.id : '/pages/bargain/detail?id=' + this.data.query.id
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: `【${this.data.bargainInfo.title}】底价${this.data.bargainInfo.floorPrice}`,
      imageUrl: this.data.url + this.data.detailInfo.logo[0].url,
      path: this.data.orderInfo.id ? '/pages/bargain/detail?orderId=' + this.data.orderInfo.id : '/pages/bargain/detail?id=' + this.data.query.id
    }
  } 
})