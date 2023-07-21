// pages/detail/detail.js
var app = getApp();
Page({
  data: {
    key: '0',
    tabs: [{
        name: '商家简介',
        id: '0',
      },
      {
        name: '商家相册',
        id: '1',
      },
    ],
    mdoaltoggle: false,
    btnArr: [
      { name: '纠错', type: 1 },
      { name: '认领', type: 3 },
      { name: '举报', type: 2 },],
    isshowpay: false,
    payTel:false,
    position: 'bottomRight',
    buttons: [
      // {
      //   label: '微信',
      //   icon: 'icon-erweima',
      //   type:'1'
      // },
      // {
      //   label: '进店',
      //   icon: 'icon-ruzhu',
      //   type: '2'
      // }
    ],
    qrcodetoggle: false,
  },
  buttonClicked(e) {
    console.log('buttonClicked', e.detail)
    const { index } = e.detail
    e.detail.buttons[index].type == '1' && this.setData({ qrcodetoggle:true})
    e.detail.buttons[index].type == '2' && wx.navigateTo({
      url: '/pages/store/storemain/storedetail?id=' + this.data.yellowInfo.isStore,
    })
  },
  bindchange(e) {
    console.log('bindchange', e.detail.value)
  },
  qrcodeclose: function () {
    this.setData({
      qrcodetoggle: false,
    })
  },
  mdoalopen: function (e) {
    this.setData({
      type: this.data.btnArr[e.currentTarget.id].type,
      mdoaltoggle: true,
      title: `我要${this.data.btnArr[e.currentTarget.id].name}`
    })
    console.log(e.currentTarget.id)
  },
  formSubmit: function (e) {
    let that = this, co = this.data, v = e.detail.value, type = this.data.type,claimMoney=+that.data.yellowInfo.data.claimMoney;
    console.log('form发生了submit事件，携带数据为：', v, co.userinfo, that.data.yellowInfo)
    //校验表单
    let warn = "", flag = true;
    if (!v.name) {
      warn = "请输入联系人";
    } else if (!app.util.isTelCode(v.tel)) {
      warn = "请输入正确联系电话";
    } else if (!v.details) {
      warn = "请输入详细说明";
    } else {
      flag = false;
      that.setData({ loading: true })
      app.util.getShowloading('提交中')

      //maketop
      app.api.prequest({
        'url': app.url.yellowPre,
        'method': 'POST',
        data: {storeId:that.data.yellowInfo.id, type, ...v,}
        }).then(res=>{
          console.log(res)
          let oid = res.data.id
          if (claimMoney>0 && type==3){
            wx.showModal({
              title: '提示',
              content: `认领需${claimMoney}元`,
              success(res) {
                if (res.confirm) {
                  that.setData({
                    payType: 2,
                    isshowpay: !that.data.ishowpay,
                    payobj: { params: { id: oid, money:claimMoney }, apiurl: app.url.yellowPrePay }
                  })
                }
              }
            })
          }
          else{
            if (res.code == '1') {
              app.util.getShowtoast("操作成功")
            }
            else {
              app.util.getShowtoast("请重试")
            }
            console.log('add', res)
          }
          that.setData({
            loading: false,
            mdoaltoggle: false,
          })
          
        })
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)

    this.setData({
      key,
      index,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options)
    app.setNavigationBarColor(this, () => {
      app.api.prequest({
        'url': app.url.yellowConfig,
        'cachetime': 30,
      }).then(res => {
        app.setNavigationBarTitle(res.data.field)
        that.getInfo()
        that.setData({
          yellowConfig: res.data,
          ad: wx.getStorageSync('codeAd')
        })
        console.log(res)
      })
      // app.isLocation(function () {
      //   //定位后请求头才带有cityId，zoneId
      //   console.log('getlocation')
      // })
    });
    this.setData({
      id:options.id
    })
    // 获取用户信息
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
  },
  getInfo(){
    app.api.prequest({
      'url': app.url.yellowInfo,
      data: { id:this.data.id },
    }).then(res => {
      res.data.logo = app.util.getImgUrl(res.data.logo)
      res.data.photoList = app.util.getImgsUrl(res.data.photoList)
      this.setData({
        yellowInfo: res.data,
      })
      let buttons=[]
      if (res.data.qrcode && res.data.qrcode.length){
        buttons.push({
        label: '微信',
        icon: 'icon-erweima',
        type:'1'
      },)
      }
      if (+res.data.isStore>0) {
        buttons.push({
          label: '进店',
          icon: 'icon-ruzhu',
          type: '2'
        })
      }
      this.setData({
        buttons,
      })
      this.getCollection();
      console.log(res)
    })
  },
  // 查看用户是否已经收藏该信息
  getCollection(e) {
    var that = this, tel = that.data.yellowInfo.tel;
    if (!this.getIsTel()) {
      tel = app.com.hideTel(tel)
    }
    this.setData({
      tel,
    })
    console.log("tel", tel)
    app.api.request({
      url: app.url.collection,
      data: {
        postId: that.data.id,
        userId: wx.getStorageSync('users').id
      },
      success: res => {
        console.log("用户的收藏结果为", res)
        if (res.data.code == '1') {
          that.setData({
            foot_menu: {
              menu: [{
                icon: 'icon-shouye',
                name: '首页',
                src: "/pages/yellow/index",
                navigateType: '3',
                isLogin: 0
              },
              // {
              //   icon: 'icon-shouye',
              //   name: '发布',
              //   src: "/pages/publishtype/publishtype",
              //   navigateType: '1',
              //   isLogin: 1
              // },
              {
                icon: 'icon-icon-',
                name: '导航',
                navigateType: '4',
                location: { latitude: that.data.yellowInfo.lat, longitude: that.data.yellowInfo.lng, name: that.data.yellowInfo.name, address: that.data.yellowInfo.address,}
              },
              {
                icon: 'icon-shoucang1',
                active:that.data.yellowInfo.follow,
                name: that.data.yellowInfo.follow ? '已收藏' :'收藏',
                isLogin: 1
              },
              ],
              main:{
                name: tel,
                cName:'拨打电话',
                isMain:true,
                isLogin:1
              },
              color:that.data.color,
              right:true,
            },
          })
        }
      }
    })
  },
  footclick(e){
    let that=this;
    if (e.detail.name.indexOf('收藏')>-1){
     this.collection()
   }
    else if (e.detail.isMain){
      if (!this.getIsTel()) {
        wx.showModal({
          title: '提示',
          content: `查看电话需${that.data.yellowInfo.data.contactCharge}元`,
          success(res) {
            if (res.confirm) {
              // wx.showLoading({
              //   title: "正在提交",
              //   mask: !0
              // });
              that.setData({
                payType:1,
                isshowpay: !that.data.ishowpay,
                payobj: { params: { type: 2, yellowId: that.data.id, money: that.data.yellowInfo.data.contactCharge, }, apiurl: app.url.lookPay }
              })
              //maketop
              // app.api.prequest({
              //   'url': app.url.lookPay,
              //   'method': 'POST',
              //   data: { type: 2, yellowId:that.data.id},
              //   }).then(res=>{
              //     console.log(res)
              //     if (res.data.code == '1') {
              //       let oid = res.data;
              //       that.setData({
              //         oid: oid,
              //         isshowpay: !that.data.ishowpay,
              //         payobj: { params: { money: paymoney, orderId: oid, redId: redId, userId: co.userinfo.id }, apiurl: app.url.topPay }
              //       })
              //       // else {
              //       //   wx.hideLoading()
              //       //   wx.showToast({
              //       //     title: '操作成功',
              //       //     mask: 1,
              //       //   })
              //       //   setTimeout(function () {
              //       //     wx.reLaunch({
              //       //       url: '/pages/index/index',
              //       //     })
              //       //   }, 1000)
              //       // }
              //     }
              //     else {
              //       app.util.getShowtoast(res.msg)
              //     }
              //   })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      else{
        app.util.makePhoneCall(this.data.yellowInfo.tel)
      }
    }
    console.log(e.detail)
  },
  //收藏
  collection(e) {
    var that = this
    app.util.getShowloading()
    app.api.prequest({
      url: app.url.collection_post,
      method: "POST",
      data: {
        postId: that.data.yellowInfo.id,
        type: 6,
      }
      }).then(res=>{
        if (res.data.status == '1') {
          app.util.getShowtoast('收藏成功')
        } else {
          app.util.getShowtoast('取消成功')
        }
        that.getInfo()
        wx.hideLoading()
      })
  },
  previewImage(e) {
    const i = e.currentTarget.dataset.i
    const urls = this.data.yellowInfo.photoList
    app.com.preImg({ url:urls[i],urls})
  },
  preqrcode(){
    let url = this.data.url + this.data.yellowInfo.qrcode[0].url
    app.com.preImg({ url: url, urls:[url] })
  },
  getIsTel(){
    let info=this.data.yellowInfo,config=this.data.yellowConfig
    if (info.data.contactCharge && +info.data.contactCharge>0){
      if (config.see == '2') {//多次收费
        if (this.data.payTel){
          return true
        }
        else{
          return false
        }
      }
      else {//单次收费
        if (info.look) {//付过费
          return true
        }
        else {//没付过费
          return false
        }
      }
    }
    else{//没设置联系电话费用
       return true
    }
  },
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1'&&this.data.payType=="1") {
      this.setData({
        payTel:true,
      })
      this.getInfo()
    }
    // else if (this.data.payType == "2"){
    //   if (e.detail == '1'){
    //     wx.showModal({
    //       title: '提示',
    //       content: '谢谢认领',
    //     })
    //   }
    //   else{
    //     wx.showModal({
    //       title: '提示',
    //       content: '竟然不付钱',
    //     })
    //   }
    // }
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {
    return {
      title: '【' + this.data.yellowInfo.nTypeName + '】' + ' ' + this.data.yellowInfo.name,
      // imageUrl: shareImg==''?'':shareImg,
      path: '/pages/yellow/detail?id=' + this.data.yellowInfo.id,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: '【' + this.data.yellowInfo.nTypeName + '】' + ' ' + this.data.yellowInfo.name,
      path: '/pages/yellow/detail?id=' + this.data.yellowInfo.id,
    }
  }
})