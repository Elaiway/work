var app = getApp();
Page({
  data: {
    key: '0',
    tabs: [{
      name: "全部",
      id: 0,
      typePid: ''
    }],
    mallConfig: {},
    popupshow: false,
    postList: [],
    params: {
      page: 1,
      size: 10,
      typePid: '',
    },
    header: {
      hd: {
        link: '/pages/mall/index'
      },
      bd: ['商品', '详情', '评论', '推荐'],
      ft: 1
    },
    layoutBody: {
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        styleName: 'margin-top: -100rpx;',
        brs: 'br-r-5',
        wid: 200,
        hei: 200,
      },
    },
    groupInfo: {}, //选中的规格组信息
    num: 1,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.api.mall(res => {
      this.setData({
        mallConfig: res,
        ad: wx.getStorageSync('codeAd')
      })
    })
    app.setNavigationBarTitle('商品详情')
    app.setNavigationBarColor(this, () => {
      this.goodsInfo(options.id)
    });
    // 获取用户信息
    app.api.userinfo((userinfo) => {
      console.log(userinfo)
      this.setData({
        userinfo: userinfo,
      })
    })
    console.log(options)
  },
  //底部导航栏点击
  footclick(e) {
    if (e.detail.name == '客服') {
      app.util.makePhoneCall(this.data.storeInfo.linkTel)
    } else if (e.detail.type) {
      wx.navigateTo({
        url: 'orderpay?type=' + e.detail.type+'&goodsId=' + this.data.goodsInfo.id,
      })
    }
    console.log(e.detail)
  },
  //获取商品信息
  goodsInfo(id) {
    app.api.prequest({
      'url': app.urlTwo.groupGoodsInfo,
      data: {
        goodsId: id
      },
    }).then((res) => {
      res.data.storeLogo = app.util.getImgUrl(res.data.storeLogo)
      this.setData({
        goodsInfo: res.data,
        system: app.system,
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
              src: "/pages/assemble/index",
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
              src: "/pages/assemble/order",
              navigateType: '1',
              isLogin: 0
            },
          ],
          style: 2,
          mainTwo: {
            name: '单独购买',
            type: 1,
            isLogin: 1
          },
          right: true,
          main: {
            name: '发起拼团',
            type: 2,
            isLogin: 1
          },
          direction: 'flex-center-col',
          height: 110,
          color: this.data.color,
        },
      })
      app.api.prequest({
        'url': app.url.bussinessInfo,
        data: {
          id: res.data.storeId
        }
      }).then(res => {
        this.setData({
          storeInfo: res.data,
        })
      })
    })
    //获取服务范围
    app.api.prequest({
      'url': app.urlTwo.groupGoodsLabel,
      data: {
        goodsId: id
      }
    }).then(res => {
      this.setData({
        goodsService: res.data,
      })
    })
  },
  showTypeOne() {
    this.setData({
      popupshow: !this.data.popupshow,
      showType: 1,
    })
  },
  showTypeTwo() {
    this.setData({
      popupshow: !this.data.popupshow,
      showType: 2,
    })
  },
  //关闭弹窗
  togglePopup() {
    this.setData({
      popupshow: !this.data.popupshow,
    })
  },
  //确认按钮
  confirm() {
    this.setData({
      popupshow: !this.data.popupshow,
    })
    if (this.data.showType == 3) {
      app.util.getShowloading()
      this.getspecItem()
      let canVip = app.system.openVip && this.data.userinfo.isVip,
        money;
      if (canVip) {
        money = this.data.goodsInfo.isSpec == '1' ? +this.data.groupInfo.memberPrice || this.data.groupInfo.money : this.data.goodsInfo.vipMoney || this.data.goodsInfo.currentPrice
      } else {
        money = this.data.goodsInfo.isSpec == '1' ? this.data.groupInfo.money : this.data.goodsInfo.currentPrice
      }
      if (this.data.buyType == 2) {
        //加入购物车
        app.api.prequest({
          'url': app.urlTwo.mallSaveCar,
          method: 'POST',
          data: {
            goodsId: this.data.goodsInfo.id,
            storeId: this.data.goodsInfo.storeId,
            groupId: this.data.groupInfo.id || "",
            data: this.data.groupInfo.data || "",
            money,
            num: this.data.num
          }
        }).then(res => {
          res.code && app.util.getShowtoast("添加成功")
          res.code || app.util.getShowtoast(res.msg, 1000, 1)
          console.log(res)
        })
        console.log('加入购物车')
      } else {
        if (+this.data.num > +this.data.groupInfo.num) return app.util.getShowtoast('库存不足', 1000, 1)
        let goodsInfo = [{
          storeId: this.data.goodsInfo.storeId, //  商家id
          storeName: this.data.goodsInfo.storeName, // 商家名称
          storeLogo: this.data.goodsInfo.storeLogo, // 商家logo
          goods: [ // 商品集合
            {
              goodsId: this.data.goodsInfo.id, //商品id
              groupId: this.data.groupInfo.id || '', //商品规格组id
              money, //单价
              num: this.data.num, //数量
              data: this.data.groupInfo.data || "", //规格组
              url: this.data.goodsInfo.showImgs[0].url, //图片
              ...this.data.goodsInfo
            }
          ]
        }]
        wx.setStorageSync('goodsArr', goodsInfo)
        wx.hideLoading()
        wx.navigateTo({
          url: '/pages/mall/orderpay',
        })
        console.log('立即购买', wx.getStorageSync('goodsArr'))
      }
      console.log(canVip)
    }
  },
  goStoreMall() {
    wx.navigateTo({
      url: '/pages/mall/storemall?id=' + this.data.storeInfo.id,
    })
  },
  goStoreDetail() {
    app.util.goUrl({
      param: this.data.storeInfo.id,
      value: "businessInfo"
    })
  },
  //数量事件
  onChange(e) {
    this.setData({
      num: e.detail.value
    })
    console.log(e.detail)
  },
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
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onShareAppMessage: function() {
    return {
      title: '【' + this.data.goodsInfo.title + '】' + ' 只要' + this.data.goodsInfo.groupPrice + '元',
      imageUrl: this.data.goodsInfo.showImgs[0] && this.data.goodsInfo.showImgs[0].url,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: '【' + this.data.goodsInfo.title + '】' + ' 只要' + this.data.goodsInfo.groupPrice + '元',
      imageUrl: this.data.goodsInfo.showImgs[0] && this.data.goodsInfo.showImgs[0].url,
    }
  } 
})