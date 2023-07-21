// pages/mall/refundorder.js
var app = getApp(),
  dsq;
Page({
  data: {
    loading: false,
    addressInfo: {
      linkName: ' ',
      linkTel: ' ',
      address: ' ',
      detailedAddress: ' ',
    },
    selfTaking: {},
    layoutBodyOne: {
      className: 'base-pad2',
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        wid: 200,
        hei: 200,
      },
    },
    params: {
      orderId: '',
      state: 5,
      reason: ''
    },
    showFaceLen: 10,
    goodsInfo: {
      isJoin: true, //是否参团
      stateTips: {}, //不同状态提示
      cover: {}, //商品
      faceMap: [], //团人员列表
    },
    tipsMap: ["拼团中", "待收货", "已发货", "已完成", "拼团失败", "申请退款中", "退款成功", "拒绝退款", "已过期"],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this,
      scene = decodeURIComponent(options.scene),
      query = {};
    console.log(scene, options)
    //分享拼团只有groupId，核销orderId，groupId，iswriteOff，拼团详情orderId，groupId都是进入此页面，所以由此变量判断进入来源
    query.orderId = options.orderId
    query.groupId = options.groupId
    query.isShare = options.isShare
    query.iswriteOff = options.iswriteOff
    if (options.scene) {
      query.orderId = scene
      query.iswriteOff = true
    }
    //登录
    app.getUserInfo()
    //隐藏右上角转发避免未绑定手机号用户分享
    wx.hideShareMenu({

    })
    app.setNavigationBarTitle('订单详情')
    app.setNavigationBarColor(this);
    app.util.getShowloading()
    app.api.prequest({
      'url': query.orderId ? app.urlTwo.groupOrderInfo : app.urlTwo.groupGroupInfo, //没有orderId说明是分享拼团进入的
      data: query,
    }).then((res) => {
      let result = res.data
      console.log("getGroupAssembleInfo", result);
      //自提订单请求自提点信息
      if (+result.delivery == 2 && result.selfId) {
        app.api.prequest({
          'url': app.urlTwo.shopAddressInfo,
          data: {
            addressId: result.selfId
          }
        }).then(res => {
          this.setData({
            selfTaking: res.data,
          })
        })
      }
      let goodsInfo = {
        music: result.music,
        video: result.video,
        id: result.goodsId,
        groupId: result.groupId,
        cover: {
          src: app.util.getImgUrl(result.showImgs),
        },
        money: result.groupPrice || result.goodsMoney, //分享进入查看团信息价格，否则查看商品价格
        oldPrice: result.originalPrice,
        storeId: result.storeId,
        storeName: result.storeName,
        isJoin: result.isJoin,
        name: result.title,
        quantity: result.orderNum,
        freight: +result.freight,
        num: result.groupNum - result.buyNum,
        faceMap: result.groupList ? result.groupList.map(item => item.portrait) : [],
        labels: (() => {
          let arr = []
          for (let key in result.label) arr.push(result.label[key]);
          return arr
        })(),
        buyNum: result.buyNum,
        expireTime: parseInt(result.expireTime),
        endTime: app.util.ormatDate(result.endTime).substring(0, 16),
        delivery: +result.delivery,
        logisticsName: result.logisticsName,
        logisticsCode: result.logisticsCode,
        totalMoney: Number((result.groupPrice && result.groupPrice * result.orderNum) || result.totalMoney || "0.00").toFixed(2),
        stateTips: {
          tips: +result.state == 1 ? '拼团还未成功' : [2, 3, 4].indexOf(+result.state) >= 0 ? '拼团成功' : '',
          tips2: +result.state == 1 ? '邀请小伙伴来拼团吧' : [2, 3, 4].indexOf(+result.state) >= 0 ? '核销码：' + result.code : '',
          success: [2, 3, 4, 6].indexOf(+result.state) >= 0,
          code: +result.state
        },
        details: result.details,
        userName: result.userName,
        userTel: result.userTel,
        outTradeNo: result.outTradeNo,
        createdAt: app.util.ormatDate(result.createdAt),
        note: result.note,
      };
      this.setData({
        query,
        addressInfo: {
          linkName: result.receivedName,
          linkTel: result.receivedTel,
          address: ' ',
          detailedAddress: result.receivedAddress,
        },
        goodsInfo,
      })
      //获取核销码
      if (goodsInfo.delivery == 2 && goodsInfo.stateTips.code == 2) {
        app.api.prequest({
          'url': app.urlTwo.groupGetCode,
          data: {
            orderId: query.orderId,
          }
        }).then(res => {
          this.setData({
            hxm: res.data
          })
        })
      }
      console.log(options, query, goodsInfo)
      //倒计时
      let timeStamp = parseInt(res.data.expireTime || 0) - parseInt(new Date().getTime() / 1000);
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
  joinGroup(e) {
    console.log('开始参加拼团');
    //判断有没有绑定手机号
    if (app.isLogin()) {
      //如果已经入团则显示分享组件,否则跳转下单页参与拼团
      if (this.data.goodsInfo.isJoin) {
        this.setData({
          onshare: true
        })
      } else {
        //传商品id和团id
        wx.navigateTo({
          url: '/pages/assemble/orderpay?type=2&goodsId=' + this.data.goodsInfo.id + "&groupId=" + this.data.goodsInfo.groupId,
        })
      }
    }
  },
  operation() {
    //如果自提并且订单状态成功则展示核销码
    if (this.data.goodsInfo.delivery == 2 && this.data.goodsInfo.stateTips.code == 2) {
      this.setData({
        qrcodetoggle: true,
      })
    } else {
      this.joinGroup();
    }
  },
  qrcodeclose: function() {
    this.setData({
      qrcodetoggle: false,
    })
  },
  qdhx() {
    wx.showModal({
      title: '提示',
      content: '确定核销此订单吗？',
      success: () => {
        app.util.getShowloading('提交中')
        this.setData({
          loading: true,
        })
        app.api.prequest({
          'url': app.urlTwo.groupVerify,
          'method': 'POST',
          data: {
            orderId: this.data.query.orderId
          },
        }).then(res => {
          if (res.code == '1') {
            app.util.getShowtoast('操作成功')
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/assemble/index',
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
      }
    })
  },
  onShow: function() {

  },
  onUnload: function() {
    clearInterval(dsq)
  },
  onPullDownRefresh: function() {

  },
  onShareAppMessage: function(res) {
    this.setData({
      onshare: false,
    })
    return {
      title: app.globalData.userInfo.userName + "邀请你【拼团】" + this.data.goodsInfo.name,
      imageUrl: this.data.goodsInfo.cover.src,
      path: 'pages/assemble/orderdetail?groupId=' + this.data.goodsInfo.groupId + '&isShare=' + 1,
    }
  }
})