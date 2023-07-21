// pages/personal/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submenu_0: {
      name: '我的订单',
      right_value: "查看全部订单",
      is_wei: true,
      src: '/pages/mall/order',
      img: ''
    },
    submenu_1: {
      name: '我的服务',
      right_value: "",
      is_wei: true,
      src: '/pages/personal/noresult',
      img: ''
    },
    submenu_2: {
      name: '我的工具',
      right_value: "",
      is_wei: true,
      src: '/pages/personal/noresult',
      img: ''
    },
    submenu_3: {
      name: '商家管理中心',
      right_value: " ",
      is_wei: false,
      src: '/pages/store/storemanage/index',
      img: '/assets/images/personal/store.png'
    },
    submenu_32: {
      name: '商家管理中心',
      right_value: " ",
      is_wei: false,
      src: '/pages/store/storemanage/switchshop',
      img: '/assets/images/personal/store.png'
    },
    submenu_4: {
      name: '帮助中心',
      right_value: " ",
      is_wei: false,
      src: '/pages/personal/help/index',
      img: '/assets/images/personal/help.png'
    },
    submenu_5: {
      name: '联系客服',
      right_value: "有问题请找我",
      is_wei: false,
      src: '/pages/personal/service',
      // wechat_kefu: '微信客服',
      img: '/assets/images/personal/kefu.png'
    },
    my_info: [{
        name: '我的关注',
        img: '/assets/images/personal/fh.png',
        src: '/pages/personal/collection/index',
        num: 0,
        isShow: true
      },
      {
        name: '我的余额',
        img: '/assets/images/personal/fh.png',
        src: '/pages/personal/wallet/index',
        num: 0,
        isShow: true
      },
      {
        name: '我的积分',
        img: '/assets/images/personal/fh.png',
        src: '/pages/personal/integral/index',
        num: 0,
        isShow: true
      },
      {
        name: '我的发布',
        img: '/assets/images/personal/fh.png',
        src: '/pages/publish/mypublish/mypublish',
        num: 0,
        isShow: true
      },

    ],
    store_order: [{
        name: '待付款',
        img: '/assets/images/personal/dfk.png',
        src: '/pages/mall/order?key=2',
        isShow: true
      },
      {
        name: '待收货',
        img: '/assets/images/personal/dfh.png',
        src: '/pages/mall/order?key=3',
        isShow: true
      },
      {
        name: '待评价',
        img: '/assets/images/personal/dpj.png',
        src: '/pages/mall/order?key=4',
        isShow: true
      },
      {
        name: '已完成',
        img: '/assets/images/personal/dsh.png',
        src: '/pages/mall/order?key=5',
        isShow: true
      },
      {
        name: '退款/售后',
        img: '/assets/images/personal/tksh.png',
        src: '/pages/mall/order?key=6',
        isShow: true
      },
    ],
    menu_1: [{
        name: '我的发布',
        img: '/assets/images/personal/fb.png',
        src: '/pages/publish/mypublish/mypublish',
        isShow: true
      },
      // {
      //   name: '活动记录',
      //   img: '/assets/images/personal/fb.png',
      //   src: '/pages/zan/record/index',
      //   isShow: true
      // },
      // {
      //   name: '充值中心',
      //   img: '/assets/images/personal/cz.png',
      //   src: '/pages/personal/wallet/recharge/index',
      //   isShow: true
      // },
      {
        name: '个人主页',
        img: '/assets/images/personal/gr.png',
        src: '/pages/personal/homepage/index',
        isShow: true
      },
      // {
      //   name: '积分商城',
      //   img: '/assets/images/personal/jfsc.png',
      //   src: '/pages/personal/integral/integralmall/index',
      //   isShow: true
      // },
      {
        name: '我的钱包',
        img: '/assets/images/personal/qb.png',
        src: '/pages/personal/wallet/index',
        isShow: true
      },

    ],
    menu_2: [{
        name: '我的地址',
        img: '/assets/images/personal/dz.png',
        src: '/pages/personal/address/dzlb',
        // src: '/pages/personal/noresult',
        isShow: true
      },
      {
        name: '认证中心',
        img: '/assets/images/personal/rz.png',
        src: '/pages/personal/testcenter/index',
        // src: '/pages/personal/noresult',
        isShow: true
      },
      // {
      //   name: '我的评论',
      //   img: '/assets/images/personal/pl.png',
      //   src: '/pages/personal/noresult',
      //   isShow: true
      // },
      {
        name: '我的关注',
        img: '/assets/images/personal/gz.png',
        src: '/pages/personal/collection/index',
        isShow: true
      },
    ],
    userStore: []
  },
  tzdl(e) {
    wx.navigateTo({
      url: '/pages/login/logincode/index',
    })
  },
  noresult(e) {
    console.log(e)
    if (app.isLogin()) {
      wx.navigateTo({
        url: '/pages/personal/noresult',
      })
    }
  },
  personal_jump(e) {
    // console.log(app.isLogin())
    if (app.isLogin()) {
      wx.navigateTo({
        url: e.currentTarget.dataset.src + '?user_id=' + wx.getStorageSync('users').id + '&title=' + e.currentTarget.dataset.name,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.setNavigationBarColor(this, () => {
      app.isLocation(() => {
        app.pageOnLoad(this);
      })
      this.setData({
        system: app.system
      })
      console.log(this.data.system)
    });
    app.setNavigationBarTitle('个人中心')
    app.api.prequest({
      url: app.url.signRule,
    }).then(res => {
      that.setData({
        signconfig: res.data
      })
    })
    // 请求查看是否开启余额支付来显示充值中心按钮
    app.api.prequest({
      'url': app.url.payConfig,
    }).then((res) => {
      if (res.data.balanceRecharge != 'yes') {
        console.log('关闭了')
      }
      else{
        console.log('开启了')
        let newmenu = [
          {
            name: '充值中心',
            img: '/assets/images/personal/cz.png',
            src: '/pages/personal/wallet/recharge/index',
            isShow: true
          },
        ]
        this.setData({
          menu_1: this.data.menu_1.concat(newmenu)
        })
      }
      // this.setData({
      //   payConfig: res.data,
      // })
    })
    // 请求查看是否开启积分商城来显示积分商城按钮
    app.api.prequest({
      'url': app.url.integral,
    }).then((res) => {
      if (res.data.open){
      if (res.data.open == 2) {
        // console.log('关闭了积分商城')
      }
      else {
        // console.log('开启了积分商城')
        let newmenu = [
          {
            name: '积分商城',
            img: '/assets/images/personal/jfsc.png',
            src: '/pages/personal/integral/integralmall/index',
            isShow: true
          },
        ]
        this.setData({
          menu_1: this.data.menu_1.concat(newmenu)
        })
      }
      }
    })
    app.api.yellow()
    app.api.freeCar()
    app.api.jobhunt()
    app.api.housingdeal()
    app.api.activity()
    app.api.businesscard()
    app.api.mall()
    app.api.vip()
    app.api.group()
    app.api.coupon()
    app.api.bargain()
    app.api.rushbuy()
    //获取我的服务
    app.api.powerList(res => {
      console.log(res,66666)
      res.forEach(item => {
        switch (item.type) {
          case 'partner':
            item.img = '/assets/images/personal/hhr.png'
            item.src = '/pages/freeride/myrelease'
            item.isShow = false
            break
          case 'car':
            item.img = '/assets/images/personal/sfc.png'
            item.src = '/pages/freeride/myrelease'
            item.isShow = true
            break
          case 'job':
            item.img = '/assets/images/personal/qzzp.png'
            item.src = '/pages/jobhunt/myjobhunt'
            item.isShow = true
            break
          case 'renting':
            item.img = '/assets/images/personal/fwzs.png'
            item.src = '/pages/housingdeal/myrelease'
            item.isShow = true
            break
          case 'yellow':
            item.img = '/assets/images/personal/hy.png'
            item.src = '/pages/yellow/myrecord'
            item.isShow = true
            break
          case 'superCard':
            item.img = '/assets/images/personal/friend.png'
            item.src = '/pages/businesscard/mycard'
            item.isShow = true
            break
          case 'activity':
            item.img = '/assets/images/personal/wdhd.png'
            item.src = '/pages/activity/order'
            item.isShow = true
            break
          case 'coupon':
            item.img = '/assets/images/personal/yhq.png'
            item.src = '/pages/coupon/myreceive'
            item.isShow = true
            break
          case 'vip':
            item.img = '/assets/images/personal/hyk.png'
            item.src = '/pages/vip/my'
            item.isShow = true
            break
          case 'group':
            item.img = '/assets/images/personal/wdpt.png'
            item.src = '/pages/assemble/order'
            item.isShow = true
            break
          case 'rush':
            item.img = '/assets/images/personal/xsqg.png'
            item.src = '/pages/rushbuy/myreceive'
            item.isShow = true
            break
          case 'bargain':
            item.img = '/assets/images/personal/bargain.png'
            item.src = '/pages/bargain/order'
            item.isShow = true
            break
            
          case 'shop':
            this.setData({
              isShop: '1'
            })
            break
        }
      })
      this.setData({
        menu_1: this.data.menu_1.concat(res)
      })
      console.log(this.data.menu_1)
      console.log(res, app.powerList)
    })
    app.api.storeconfig((info) => {
      this.setData({
        'submenu_3.name':`${info.field}管理中心`
      })
    })
  },
  // 获取用户信息
  getUserinfo(e) {
    // app.api.request({
    //   url: app.url.userInfo,
    //   data: {
    //     id: wx.getStorageSync('users').id
    //   },
    //   success: res => {
    //     console.log(res)
    //     let userinfo = res.data.data
    //     app.globalData.userInfo.userName = userinfo.userName
    //     this.setData({
    //       userinfo: userinfo
    //     })
    //   }
    // })
    var that = this
    app.api.userinfo((info) => {
      console.log(info)
      that.setData({
        userinfo: info,
      })
      that.postStore()
    })
  },
  // 获取用户的店铺信息
  postStore() {
    var that = this
    app.api.getUserstore({
      data: {
        adminId: that.data.userinfos.id,
      },
      success: res => {
        console.log("该用户的店铺信息为", res)
        wx.setStorageSync('stores', res.data)
        if (res.data.code == '1' && res.data.data.length != 0) {
          let isstore = false,isstoretwo = false;
          // if (res.data.data[0].status == '1') {
          if (app.com.getType(this.data.userinfo.storeInfo) != 'array') {
            isstore = true
          }else{
            //如果有店铺没有设置默认店铺则跳转到切换店铺列表
            isstoretwo = true
          }
          that.setData({
            userStore: res.data.data,
            isstore: isstore,
            isstoretwo: isstoretwo,
          })
        }
      }
    })
  },
  // 获取用户的店铺信息
  mystatistics() {
    var that = this
    app.api.request({
      url: app.url.mystatistics,
      success: res => {
        console.log("mystatistics", res)
        let my_info = that.data.my_info
        my_info[0].num = res.data.data.collection
        my_info[1].num = res.data.data.balance
        my_info[2].num = res.data.data.integral
        my_info[3].num = res.data.data.post
        that.setData({
          // mystatistics: res.data.data,
          my_info: my_info,
        })
      }
    })
  },
  sign(e) {
    // return
    if (app.isLogin()) {
      wx.navigateTo({
        url: '/pages/sign/index',
      })
    }
  },
  modify(e) {
    if (app.isLogin()) {
      wx.navigateTo({
        url: '/pages/personal/setup/index',
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    this.setData({
      isLogin: app.globalData.isLogin
    })
    // 用户登录
    app.getUserInfo((userinfo) => {
      console.log(userinfo)
      let userinfos = JSON.parse(JSON.stringify(userinfo))
      if (userinfo.userTel) {
        userinfos.userTel = userinfos.userTel.substring(0, 3) + '****' + userinfos.userTel.substring(userinfos.userTel.length - 4)
        this.getUserinfo()
        this.setData({
          isLogin: app.globalData.isLogin
        })
      }
      that.setData({
        userinfos: userinfos,
      })
      that.mystatistics()
    })
    if (app.globalData.isLogin == 1) {
      this.getUserinfo()
    }
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