var app = getApp(),
  dsq;
Page({
  data: {
    popupshow: false,
    postList: [],
    layoutBody: {
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        styleName: 'margin-top: -0rpx;',
        brs: 'br-r-5',
        wid: 200,
        hei: 200,
      },
    },
    num: 1,
    params: {
      goodsId: '',  
      selfId: '',
      delivery: '',
      receivedName: '',
      receivedAddress: '',
      receivedTel: '',
      totalMoney: '',
      goodsMoney: '',
      num:'1',
      note: '',
    },
    isshowpay: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.api.rushbuy(res => {
      this.setData({
        rushbuy: res,
        ad: wx.getStorageSync('codeAd')
      })
    })
    app.setNavigationBarTitle('抢购详情')
    app.setNavigationBarColor(this, () => {
    // 获取用户信息
    app.api.userinfo((userInfo) => {
      // console.log(userInfo)
      this.setData({
        userInfo,
      })
      this.goodsInfo(options.id)
    })
    });
    console.log(options)
  },
  //底部导航栏点击
  footclick(e) {
    if (e.detail.name == '客服') {
      app.util.makePhoneCall(this.data.storeInfo.linkTel)
    } else if (e.detail.type) {
      //如果抢购数量已完或时间已过
      console.log(this.data)
      if(this.data.isOver){
        app.util.getShowtoast('此抢购已结束', 1500, 2)
      }else{
        this.xjgm()
      }
    }
    console.log(e.detail)
  },
  //获取商品信息
  goodsInfo(id) {
    // app.api.userinfo((userInfo) => {
    //   console.log(userInfo)
    //   this.setData({
    //     userInfo,
    //   })
    // })
    app.api.prequest({
      'url': app.urlTwo.rushGoodsInfo,
      data: {
        id,
      },
    }).then((res) => {
      console.log(res.data,333)
      res.data.storeLogo = app.util.getSingleImgUrl(res.data.storeLogo)
      res.data.expireTime = app.util.ormatDate(res.data.expireTime).substring(0, 16)
      res.data.startTimes = app.util.ormatDate(res.data.startTime).substring(0, 16)
      res.data.endTimes = app.util.ormatDate(res.data.endTime).substring(0, 16)
      console.log(res.data,444)
      //倒计时
      let timeStamp = parseInt(res.data.endTime || 0) - parseInt(new Date().getTime() / 1000);
      this.setData({
        endTime: app.com.countDownTime(timeStamp)
      })
      dsq = setInterval(() => {
        timeStamp -= 1
        if (timeStamp <= 0) clearInterval(dsq)
        this.setData({
          endTime: app.com.countDownTime(timeStamp)
        })
        // console.log('倒计时', this.data.endTime)
      }, 1000)
      //抢购库存为空或者倒计时秒数小于0提示抢购已结束
      if (res.data.num <= 0 || this.data.endTime[3] < 0) {
        console.log('抢购已结束')
        this.setData({
          isOver:true
        })
      }
      // console.log(app.system.openVip)
      //最大数量
      let max = parseInt(res.data.limitNum)
      console.log(parseInt(res.data.limitNum))
      this.setData({
        goodsInfo: res.data,
        system: app.system,
        'params.totalMoney': app.system.openVip && this.data.userInfo.isVip && res.data.memberPrice && res.data.memberPrice > 0 ? res.data.memberPrice : res.data.rushPrice,
        max,
        Swiper: {
          "padding": 0,
          "height": 375,
          "maxLimit": 300,
          "minLimit": 100,
          "swiper": {
            "children": app.util.getTypeImgsUrl(res.data.showImgs)
          }
        },
        foot_menu: {
          menu: [{
            icon: 'icon-shouye fon_36',
            name: '首页',
            src: "/pages/rushbuy/index",
            navigateType: '2',
            isLogin: 0
          },
          {
            icon: 'icon-shangjia fon_36',
            src: "/pages/store/storemain/storedetail?id=" + res.data.storeId,
            navigateType: '1',
            name: '店铺',
            isLogin: 0
          },
          {
            icon: 'icon-geren2 fon_36',
            name: '我的',
            src: "/pages/rushbuy/myreceive",
            navigateType: '1',
            isLogin: 0
          },
          ],
          style: 3,
          right: true,
          main: {
            name: '立即购买',
            type: 2,
            isLogin: 1,
            // bgcolor: ba-lg-ff1e
          },
          direction: 'flex-center-col',
          height: 110,
          color: this.data.color,
        },
      })
      console.log(this.data.goodsInfo,6666)
    })
  },
  //选择地址
  getaddress(e) {
    console.log('选择收货地址')
    if (e.detail) {
      this.setData({
        'params.receivedName': e.detail.linkName || '',
        'params.receivedAddress': (e.detail.address + e.detail.detailedAddress) || '',
        'params.receivedTel': e.detail.linkTel || '',
        // 'params.selfId': e.detail.id || ''
      })
    }
    console.log(e.detail, this.data.params)
  },
  //选择自提点
  getztd(e) {
    console.log('选择自提')
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
  //点击到商铺
  goStoreDetail() {
    app.util.goUrl({
      param: this.data.goodsInfo.storeId,
      value: "businessInfo"
    })
  },
  //数量事件
  onChange(e) {
    let memberPrice = (this.data.system.openVip && this.data.userInfo.isVip && +this.data.goodsInfo.memberPrice > 0 ? +this.data.goodsInfo.memberPrice || parseFloat(this.data.goodsInfo.rushPrice) : parseFloat(this.data.goodsInfo.rushPrice)).toFixed(2)
    this.setData({
      num: e.detail.value,
      "params.num": e.detail.value,
      'params.totalMoney': (e.detail.value * memberPrice).toFixed(2)
    })
    console.log(e.detail.value, memberPrice, (e.detail.value * memberPrice).toFixed(2))
  },
  //预览图片
  previewImage(e) {
    const i = e.currentTarget.dataset.i
    const urls = app.util.getImgsUrl(JSON.parse(JSON.stringify(this.data.goodsInfo.detailImgs)))
    app.com.preImg({
      url: urls[i],
      urls
    })
  },
  previewImage2(e) {
    const url = e.currentTarget.dataset.url,
      urls = e.currentTarget.dataset.urls.map(item => item.url)
    app.com.preImg({
      url,
      urls
    })
  },
  //立即购买
  xjgm() {
    this.setData({
      popupshow: true,
    })
  },
  //立即下单
  formSubmit: function (e) {
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
      'params.note': v.note,
      // 'params.num': co.num,
      'params.delivery': co.goodsInfo.delivery,
      'params.goodsId': co.goodsInfo.id,
      'params.goodsMoney': co.goodsInfo.rushPrice,
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
      console.log(this.data.userInfo.isVip)
      // 如果有vip价格的话那就拿取vip价格否则就拿取正常的价格。若开启了vip.但是vip价格不存在或者为零的话，就拿取正常价格
      console.log(this.data.system.openVip && this.data.userInfo.isVip && +this.data.goodsInfo.memberPrice > 0 ? this.data.goodsInfo.memberPrice || parseFloat(this.data.goodsInfo.rushPrice) : parseFloat(this.data.goodsInfo.rushPrice))
      let moneys = (this.data.system.openVip && this.data.userInfo.isVip && +this.data.goodsInfo.memberPrice > 0 ? +this.data.goodsInfo.memberPrice || parseFloat(this.data.goodsInfo.rushPrice) : parseFloat(this.data.goodsInfo.rushPrice)).toFixed(2)
      //return
      wx.showModal({
        title: '提示',
        content: "需要支付：" + co.params.totalMoney + "元",
        success: (res) => {
          //点击确定
          this.togglePopup()
          if (res.confirm) {
            app.util.getShowloading('提交中')
            app.api.prequest({
              'url': app.urlTwo.rushSaveOrder,
              'method': 'POST',
              data: co.params,
            }).then((res) => {
              if (res.code == '1') {
                console.log(res, res.data)
                let oid = res.data
                that.setData({
                  isshowpay: true,
                  payobj: {
                    params: {
                      money: co.params.totalMoney,
                      orderId: oid,
                    },
                    apiurl: app.url.rushPay
                  }
                })
              } else {
                app.util.getShowtoast(res.msg, 1000, 2)
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
          // url: '/pages/rushbuy/detail?id=' + this.data.id,
          url: '/pages/rushbuy/myreceive'
        })
      }, 1000)
    }
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {
    clearInterval(dsq)
  },
  onPullDownRefresh: function () {

  },
  onShareAppMessage: function () {
    return {
      title: '【' + this.data.goodsInfo.title + '】' + ' 只要' + this.data.goodsInfo.rushPrice + '元',
      imageUrl: this.data.goodsInfo.showImgs[0] && this.data.goodsInfo.showImgs[0].url,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: '【' + this.data.goodsInfo.title + '】' + ' 只要' + this.data.goodsInfo.rushPrice + '元',
      imageUrl: this.data.goodsInfo.showImgs[0] && this.data.goodsInfo.showImgs[0].url,
      path: '/pages/rushbuy/detail?id=' + this.data.goodsInfo.id,
    }
  }
})