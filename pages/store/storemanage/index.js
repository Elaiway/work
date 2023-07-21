// pages/login/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    xzname: '选择续费套餐',
    notice: [{
        text: '123465478578898974684864687486'
      },
      {
        text: '123465478578898974684864687486'
      },
      {
        text: '123465478578898974684864687486'
      },
      {
        text: '123465478578898974684864687486'
      },
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('店铺信息', options)
    if (options.storeId){
      this.setData({
        setStoreId: options.storeId
      })
    }
    var that = this;
    app.setNavigationBarTitle('商家管理')
    app.setNavigationBarColor(this);
    // app.getUserInfo((userinfo) => {
    //   console.log(userinfo)
    //   that.setData({
    //     userinfo: userinfo,
    //   })
    //   that.postStore()
    // })
    app.api.prequest({
      'url': app.url.userInfo,
      data: {
        id: wx.getStorageSync('users').id
      },
    }).then((res) => {
      this.setData({
        userinfo: res.data,
      })
      console.log('userinfo', res)
      that.postStore()
    })
    app.api.request({
      'url': app.url.store_meal,
      'cachetime': '30',
      success: function(res) {
        console.log(res)
        let meal = res.data.data
        for (let i in meal) {
          meal[i].name = meal[i].setName
        }
        that.setData({
          actions: meal,
        })
      },
    })
    //this.announceList()
  },
  sjsjclick(e) {
    // console.log('123',app.util.ormatTime(e.currentTarget.dataset.items),e.currentTarget.dataset.items)
    if (Math.round(new Date().getTime() / 1000) >= app.util.ormatTime(e.currentTarget.dataset.items)) {
      return app.util.getShowtoast('您的店铺已到期,续费后使用此功能', 1500, 2)
    }
    let item = e.currentTarget.dataset.item
    switch (item.title) {
      case '今日订单':
        break;
      case '今日收益':
        break;
      case '商家余额':
        wx.navigateTo({
          url: item.page,
        })
        break;
    }
    console.log(item)
  },
  sjglclick(e) {
    let item = e.currentTarget.dataset.item
    if (Math.round(new Date().getTime() / 1000) >= app.util.ormatTime(e.currentTarget.dataset.items) && item.title != '我要续费') {
      return app.util.getShowtoast('您的店铺已到期,续费后使用此功能', 1500, 2)
    }
    switch (item.title) {
      case '认证中心':
      case '修改资料':
      case '员工管理':
      case '订单管理':
      case '商品管理':
      case '店铺优惠':
      case '商家设置':
      case '发布活动':
      case '我的活动':
      case '发布特权':
      case '管理特权':
      case '发布拼团':
      case '管理拼团':
      case '发布优惠劵':
      case '管理优惠券':
      case '发布砍价':
      case '管理砍价':
      case '发布抢购':
      case '管理抢购':
      case '发布集赞':
        wx.navigateTo({
          url: item.page,
        })
        break;
        app.util.getShowtoast('此功能加紧更新迭代中！敬请期待！', 2000, 2)
        return;
      case '我要续费':
        this.setData({
          visible: true,
        })
        break;
      case '扫码核销':
        wx.scanCode({
          success(res) {
            console.log(res)
          }
        })
        break;
    }
    console.log(item)
  },
  // 获取用户的店铺信息
  postStore() {
        //获取我的服务
        var power=[]
        app.api.powerList(res => {
          res.forEach(item => {
            console.log(item.type)
            power.push(item.type)
          })
          this.setData({
            power,
          })
          // console.log('powerList',res, app.powerList,power)
        })
    var that = this
          console.log('请求的默认ID',this.data.userinfo.storeInfo.storeId)
          var storeInfoId = this.data.userinfo.storeInfo.storeId
        console.log('店铺列表到期时间返回的ID', this.data.setStoreId  )  
        app.sjdId = this.data.setStoreId || storeInfoId
          //获取商家数据
          app.api.prequest({
            'url': app.urlTwo.storeData,
            data: {
              storeId: app.sjdId
            },
          }).then(res => {
            let data = res.data
            that.setData({
              sjsjData: [{
                  title: "今日订单",
                  text: data.shop.orderNum || 0.00,
                  color: '#15C42D',
                  show: true,
                },
                {
                  title: "今日收益",
                  text: data.shop.todayBalance || 0.00,
                  color: '#2D95FF',
                  show: true,
                },
                {
                  title: "商家余额",
                  text: data.shop.totalBalance || 0.00,
                  color: '#FF0000',
                  show: true,
                  page: '/pages/store/storemanage/storebalance/index',
                },
              ],
            })
          })
          //获取此商家详细信息
          app.api.prequest({
            'url': app.url.bussinessInfo,
            data: {
              id: app.sjdId
            }
          }).then(res => {
            let shopDetail = res.data
            console.log(shopDetail)
            shopDetail.enterEndTime = app.util.ormatDate(res.data.enterEndTime).substring(0, 16)
            console.log( res.data.storeLogo)
            shopDetail.storeLogo = app.util.getImgUrl(res.data.storeLogo)
            console.log(shopDetail.storeLogo)
            this.setData({
              shopDetail,
              storeManagement: [{
                  show: true,
                  text: '管理工具',
                  arr: [{
                      title: '认证中心',
                      icon: 'icon-renzhengzhongxin-xuanzhong',
                      color: '#FF9901',
                      page: "/pages/personal/testcenter/sjrzindex?storeid=" + shopDetail.id,
                    },
                    {
                      title: '修改资料',
                      icon: 'icon-xiugaiziliao',
                      color: '#19BEC4',
                      page: '/pages/store/storemanage/storeup/storeedit?storeid=' + shopDetail.id,
                    },
                    {
                      title: '我要续费',
                      icon: 'icon-xuqi',
                      color: '#299DFF',
                    },
                    // {
                    //   title: '扫码核销',
                    //   icon: 'icon-saoma',
                    //   color: '#666',
                    // },
                    {
                      title: '员工管理',
                      icon: 'icon-yuangonghuangye',
                      color: '#FFB131',
                      page: '/pages/store/storemanage/storeup/stafflist',
                    },
                  ],
                },
                {
                  show: shopDetail.meal && shopDetail.meal.indexOf('shop') > -1,
                  text: '商城管理',
                  arr: [{
                      title: '订单管理',
                      icon: 'icon-dingdanguanli',
                      color: '#3889FF',
                      page: '/pages/mall/manage/order',
                    },
                    {
                      title: '商品管理',
                      icon: 'icon-gouwu',
                      color: '#6C95EA',
                      page: '/pages/mall/manage/goodslist',
                    },
                    {
                      title: '店铺优惠',
                      icon: 'icon-youhuiquan2',
                      color: '#FF0000',
                      page: '/pages/mall/manage/couponlist',
                    },
                    {
                      title: '商家设置',
                      icon: 'icon-shangjia1',
                      color: '#B19EFF',
                      page: '/pages/mall/manage/settings',
                    },
                  ],
                },
                {
                  show: shopDetail.meal && shopDetail.meal.indexOf('activity') > -1,
                  text: '活动管理',
                  arr: [{
                    title: '发布活动',
                    icon: 'icon-fabu',
                    color: '#FF9901',
                    page: '/pages/activity/manage/release',
                  }, {
                    title: '我的活动',
                    icon: 'icon-huodong1',
                    color: '#FF9901',
                    page: '/pages/activity/manage/myactivity',
                  }, ],
                },
                {
                  show: shopDetail.meal && shopDetail.meal.indexOf('coupon') > -1,
                  // show: false,
                  text: '优惠劵管理',
                  arr: [{
                      title: '发布优惠劵',
                      icon: 'icon-llingquxianjinquan',
                      color: '#FF0000',
                      page: '/pages/coupon/manage/release',
                    },
                    {
                      title: '管理优惠券',
                      icon: 'icon-youhuiquanxianxing',
                      color: '#FF0000',
                      page: '/pages/coupon/manage/myrelease',
                    },
                  ],
                }, {
                  show: power.indexOf('vip') > -1,
                  text: '会员特权管理',
                  arr: [{
                      title: '发布特权',
                      icon: 'icon-qunfengfabushangxian',
                      color: '#FDAF04',
                      page: '/pages/vip/manage/release',
                    },
                    {
                      title: '管理特权',
                      icon: 'icon-tianchongxing-',
                      color: '#FF9901',
                      page: '/pages/vip/manage/privilegelist',
                    },
                  ],
                }, {
                  show: shopDetail.meal && shopDetail.meal.indexOf('group') > -1,
                  // show: false,
                  text: '拼团管理',
                  arr: [{
                      title: '发布拼团',
                      icon: 'icon-pintuandingdan',
                      color: '#3889FF',
                      page: '/pages/assemble/manage/release',
                    },
                    {
                      title: '管理拼团',
                      icon: 'icon-pintuangou',
                      color: '#3889FF',
                      page: '/pages/assemble/manage/order',
                    },
                  ],
                }, {
                  show: shopDetail.meal && shopDetail.meal.indexOf('rush') > -1,
                  // show: false,
                  text: '限时抢购管理',
                  arr: [{
                      title: '发布抢购',
                      icon: 'icon-qiang',
                      color: '#FF0000',
                      page: '/pages/rushbuy/manage/release',
                    },
                    {
                      title: '管理抢购',
                      icon: 'icon-daojishi',
                      color: '#FF0000',
                      page: '/pages/rushbuy/manage/myrelease',
                    },
                  ],
                },
                {
                  show: shopDetail.meal && shopDetail.meal.indexOf('collectLike') > -1,
                  text: '集赞管理',
                  arr: [
                  {
                    title: '发布集赞',
                    icon: 'icon-huodong1',
                    color: '#FF9901',
                    page: '/pages/zan/publishDetail/index',
                  }
                  ],
                },
                 {
                  show: shopDetail.meal && shopDetail.meal.indexOf('bargain') > -1,
                  //show: false,
                  text: '砍价商品管理',
                  arr: [{
                      title: '发布砍价',
                      icon: 'icon-kanjia',
                      color: '#FF0000',
                      page: '/pages/bargain/manage/release',
                    },
                    {
                      title: '管理砍价',
                      icon: 'icon-lianmengguanli',
                      color: '#FF0000',
                      page: '/pages/bargain/manage/order',
                    },
                  ],
                },
              ]
            })
          })
  },
  storeInfo(e) {
    wx.navigateTo({
      url: '/pages/store/storemain/storedetail?id=' + app.sjdId,
    })
  },
  switchshop(e) {
    wx.navigateTo({
      url: '/pages/store/storemanage/switchshop',
    })
  },
  // 获取首页公告
  announceList(e) {
    var that = this
    app.api.request({
      url: app.url.announceList,
      data: {
        type: 3,
        adType: 2,
      },
      success: res => {
        console.log('首页公告为', res)
        var announceList = res.data.data
        if (announceList.length > 0) {
          that.setData({
            announceList: announceList
          })
        }

      },
    })
  },
  // 查看用户当前点击的信息
  handleClickItem(e) {
    let that = this,
      index = e.detail.index,
      storeId = app.sjdId,
      userinfo = this.data.userinfo;
    console.log('用户当前点击的是', e, storeId, index, userinfo)
    this.setData({
      visible: false,
    })
    var xfinfo = this.data.actions[index];
    console.log('选择续费', xfinfo)
    //return
    app.util.getShowloading('正在提交')
    //store_renew
    app.api.prequest({
      'url': app.url.store_renew,
      'cachetime': '0',
      'method': 'POST',
      data: {
        storeId: storeId,
        mealId: xfinfo.id,
      },
    }).then(res => {
      if (res.code == '1') {
        let oid = res.data
        if (Number(xfinfo.money) > 0) {
          that.setData({
            oid: oid,
            isshowpay: true,
            payobj: {
              params: {
                money: xfinfo.money,
                renewId: oid,
              },
              apiurl: app.url.renew_pay
            }
          })
        } else {
          app.util.getShowtoast('操作成功')
          that.postStore()
        }
      } else {
        app.util.getShowtoast(res.msg, 1000, 1)
      }
      console.log('add', res.data)
    });
  },
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      this.postStore()
    }
  },
  // 取消弹框按钮
  handleCancel(e) {
    this.setData({
      visible: false,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})