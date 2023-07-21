var app = getApp();
Page({
  data: {
    point:"0",
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
    app.setNavigationBarTitle('详情页')
    app.setNavigationBarColor(this, () => {
      this.goodsInfo(options.id)
      app.isLocation(() => {
        this.getPostlist()
      })
    });
    // 获取用户信息
    app.api.userinfo((userinfo) => {
      console.log(userinfo)
      this.setData({
        userinfo: userinfo,
      })
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowWidth: res.windowWidth,
        })
      }
    })
    this.mallFullCategory()
    console.log(options)
  },
  //底部导航栏点击
  footclick(e) {
    if (e.detail.name == '客服') {
      app.util.makePhoneCall(this.data.storeInfo.linkTel)
    } else if (e.detail.type) {
      this.setData({
        popupshow: !this.data.popupshow,
        showType: 3,
        buyType: e.detail.type
      })
    }
    console.log(e.detail)
  },
  //获取商品信息
  goodsInfo(id) {
    app.api.prequest({
      'url': app.urlTwo.mallGoodsInfo,
      data: {
        goodsId: id
      },
    }).then((res) => {
      console.log(res.data,663636363)
     
      res.data.storeLogo = app.util.getImgUrl(res.data.storeLogo)
      res.data.comment.forEach(item => {
        console.log(this.data.point)
        // this.data.point = item.star+this.data.point
        this.setData({
          point:Number(item.star)+Number(this.data.point)
        })
        item.img = app.util.getTypeImgsUrl(item.img)
        item.createdAt = app.util.settime(item.createdAt)
      })
      this.setData({
        point:(this.data.point/15*100).toFixed(0)+"%"
      })
      res.data.coupon.forEach(item => {
        item.startTime = app.util.ormatDate(item.startTime).substring(0,10)
        item.endTime = app.util.ormatDate(item.endTime).substring(0, 10)
      })
      this.setData({
        goodsInfo: res.data,
        system: app.system,
        Swiper: {
          "padding": 0,
          "height": this.data.windowWidth,
          "maxLimit": 300,
          "minLimit": 100,
          "swiper": {
            "children": app.util.getTypeImgsUrl(res.data.showImgs)
          }
        },
        foot_menu: {
          menu: [{
              icon: 'icon-shouye fon_36',
              name: '店铺',
              src: "/pages/mall/storemall?id=" + res.data.storeId,
              navigateType: '1',
              isLogin: 0
            },
            {
              icon: 'icon-kefu fon_36',
              name: '客服',
              isLogin: 0
            },
            {
              icon: 'icon-gouwuche fon_36',
              name: '购物车',
              src: "/pages/mall/cart",
              navigateType: '1',
              isLogin: 0
            },
          ],
          mainTwo: {
            width: '30',
            name: '加入购物车',
            type: 2,
            opacity: 0.5,
            isLogin: 1
          },
          right: true,
          main: {
            name: '立即购买',
            type: 1,
            isLogin: 1
          },
          direction: 'flex-center-col',
          height: 100,
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
      let spec = res.data.spec || []
      for (let i = 0; i < spec.length; i++) {
        spec[i].acidx = 0
      }
      this.setData({
        spec,
      })
      this.getspecItem()
    })
    //获取服务范围
    app.api.prequest({
      'url': app.urlTwo.mallGoodsService,
      data: {
        goodsId: id
      }
    }).then(res => {
      this.setData({
        goodsService: res.data,
      })
    })
  },
  //头部点击跳转滚动
  bdclick(e) {
    if (this.data.heightarr) {
      wx.pageScrollTo({
        scrollTop: this.data.heightarr[e.detail] - this.data.heightarr[0],
      })
    } else {
      this.getContext(e.detail)
    }
    console.log(e.detail)
  },
  //获取节点top值用于滚动
  getContext(index) {
    let query = wx.createSelectorQuery()
    query.selectAll('#gooddl').boundingClientRect()
    query.exec((res) => {
      this.setData({
        heightarr: res[0].map(item => (item.top))
      })
      this.bdclick({
        detail: index
      })
      console.log(res)
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
  //规格点击事件
  specClick(e) {
    let idex = e.currentTarget.dataset.idx,
      pidex = e.currentTarget.dataset.pidx,
      spec = this.data.spec
    this.setData({
      [`spec[${[pidex]}].acidx`]: idex,
    })
    this.getspecItem()
    console.log(e, spec, this.data.goodsInfo)
  },
  //根据选中规格查找
  getspecItem() {
    if (this.data.goodsInfo.isSpec != 1) return
    let str = [],
      spec = this.data.spec
    for (let i = 0; i < spec.length; i++) {
      str.push(spec[i].data[spec[i].acidx])
    }
    str = str.toString()
    let groupInfo = this.data.goodsInfo.specGroup && this.data.goodsInfo.specGroup.find((item) => item.data == str)
    this.setData({
      groupInfo,
    })
    console.log(str, groupInfo)
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
  //获取推荐分类
  mallFullCategory() {
    app.api.prequest({
      'url': app.urlTwo.mallFullCategory,
    }).then((res) => {
      let arr = res.data.map((item, index) => {
        return {
          name: item.name,
          id: index + 1,
          typePid: item.id
        }
      })
      this.setData({
        tabs: this.data.tabs.concat(arr)
      })
    })
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    this.setData({
      postList: [],
      'params.page': 1,
      'params.typePid': this.data.tabs[e.detail.key].typePid,
      mygd: false,
      isget: false,
    })
    this.getPostlist()
  },
  //获取列表数据
  getPostlist(e) {
    var that = this,
      params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.urlTwo.mallGoodsList,
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
        item.showImgs = app.util.getImgUrl(item.showImgs)
      })
      var postList = that.data.postList
      postList = postList.concat(res.data)
      that.setData({
        postList: postList,
        isget: true,
      })
    })
  },
  //领取优惠券
  ljlq(e) {
    let info = e.currentTarget.dataset.info
    app.util.getShowloading('提交中')
    app.api.prequest({
      'url': app.urlTwo['mallReceiveCoupon'],
      'method': 'POST',
      data: {
        couponId: info.id
      },
    }).then((res) => {
      if (res.code == '1') {
        app.util.getShowloading('操作成功')
        setTimeout(() => {
          this.goodsInfo(this.data.goodsInfo.id)
        }, 1000)
      } else {
        app.util.getShowtoast(res.msg, 1000, 2)
      }
    });
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
  },
  onShareAppMessage: function() {
    return {
      title: '【' + this.data.goodsInfo.title + '】' + ' 只要' + this.data.goodsInfo.currentPrice + '元',
      imageUrl: this.data.goodsInfo.showImgs[0] && this.data.goodsInfo.showImgs[0].url,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: '【' + this.data.goodsInfo.title + '】' + ' 只要' + this.data.goodsInfo.currentPrice + '元',
      imageUrl: this.data.goodsInfo.showImgs[0] && this.data.goodsInfo.showImgs[0].url,
    
    }
  }
})