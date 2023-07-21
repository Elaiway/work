// pages/publish/publishpost.js
var app = getApp(), setinfo = require('../../../setinfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paymoney:0,
    flje:0,
    fwrate:0,
    fwf:0,
    rzradiovalue: '0',
    rztimearr: [
      { date: '半年（￥99/6月' },
      { date: '一年（￥180/12月' },
      { date: '两年（￥299/24月' }
    ],
    isshowpay:false,
    checkboxvalue:true,
    zdinfo:{days: "", money: ""},
    // isios: getApp().phoneInfo.system.indexOf('iOS') > -1,
  },
  gxll(e){
    wx.redirectTo({
      url: '/pages/publish/mypublish/mypublish',
    })
  },
  toback(e) {
    wx.navigateBack({
      
    })
  },
  toindex(e) {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  //
  onChange(field, e) {
    this.setData({
      [field]: e.detail.value,
      zdinfo: this.data.rztimearr[e.detail.value]
    })
    this.getTotalprice()
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  rzradioonChange(e) {
    console.log(e)
    this.onChange('rzradiovalue', e)
  },
  //切换置顶开关
  zdswitchChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      zdchecked: e.detail.value,
      zdvisible: e.detail.value,
    })
    this.getTotalprice()
  },
  sflswitchChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      sflchecked: e.detail.value,
      flje:0,
      sflvisible: e.detail.value,
    })
    this.getTotalprice()
  },
  fljeinput(e) {
    console.log(e.detail.value)
    this.setData({
      flje: e.detail.value,
    })
    this.getTotalprice()
  },
  //选择置顶
  // handleClickItem({ detail }) {
  //   const index = detail.index;
  //   let that = this, zdinfo = this.data.actions[index]
  //   console.log(index, this.data.actions, zdinfo)
  //   this.setData({
  //     zdinfo: zdinfo,
  //     visible: false,
  //   })
  //   this.getTotalprice()
  // },
  // handleCancel() {
  //   this.setData({
  //     visible: false,
  //     zdchecked: false,
  //   });
  //   this.getTotalprice()
  // },
  //totalprice
  getTotalprice(){
    let that = this, co = this.data, paymoney = 0, zdchecked = co.zdchecked, sflchecked = co.sflchecked, flje = co.flje, fwrate = Number(co.fwrate);
    console.log(co, zdchecked, sflchecked, flje, fwrate)
    if(zdchecked){
      console.log('zd开启')
      paymoney += Number(co.zdinfo.money)
    }
    if (sflchecked) {
      console.log('sfl开启', Number(flje))
      paymoney += Number(flje)
    }
    that.setData({
      paymoney: Number((paymoney * (1+fwrate / 100)).toFixed(2)),
      fwf: Number((paymoney * (fwrate / 100)).toFixed(2)),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res)=> {
        console.log(res.platform);     //平台信息
        if (res.platform == 'android'){
          this.setData({
            phoneStatus:true, 
          })
        }
        else if (res.platform == "ios") {   
          this.setData({
            phoneStatus: false,
          })
        }
      }
    })

























    var that = this;
    console.log(app.Getroute(), options,)
    if (options.ispublish=='2'){
      app.setNavigationBarTitle('redpaper扩散')
      that.setData({
        sflvisible:true,
        sflchecked:true,
      })
    }
    else{
      app.setNavigationBarTitle('发布成功')
    }
    app.setNavigationBarColor(this);
    app.getUserInfo(function (userinfo) {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
    this.setData({
      postId: options.postId,
      ispublish: options.ispublish,
    })
    app.api.postconfig((info) => {
      console.log(info)
      that.setData({
        postconfig: info,
        // fwrate: info.charge,
      })
    })
    //settop
    app.api.request({
      'url':app.url.top,
      data: { postId:options.postId,},
      success: function (res) {
        console.log(res)
        res.data.data.forEach(function (item, index) {
          item.name = item.body;
          item.value = index;
          item.checked = index == 0;
        })
        that.setData({
          rztimearr: res.data.data,
          zdinfo: res.data.data[0]
        })
        that.getTotalprice()
      },
    })
  },
  formSubmit: function (e) {
    let that = this, co = this.data, v = e.detail.value, zdinfo = co.zdinfo, paymoney = co.paymoney, mfje = Number(v.flje) / Number(v.flfs), isTop = v.zdkg ? '1' : '', isRed = v.sflkg ? '1' : ''; 
    console.log('form发生了submit事件，携带数据为：', co, co.userinfo, co.postId, v, zdinfo, paymoney, mfje, isTop,isRed)
    //校验表单
    let warn = "",flag = true;
    if (v.zdkg&&zdinfo.days=='') {
      warn = "请选择置顶类型";
    } else if (v.sflkg && v.flje == '') {
      warn = "请输入金额";
    } else if (v.sflkg && v.flfs == '') {
      warn = "请输入份数";
    } else if (v.sflkg && mfje<0.01) {
      warn = "请输入合理的份数";
    } else {
      flag = false;
      // return
      // that.setData({ loading: true })
      wx.showLoading({
        title: "正在提交",
        mask: !0
      });
      //maketop
      app.api.request({
          'url': app.url.postTopAdd,
        'cachetime': '0',
        'method': 'POST',
        data: {
          postId: co.postId, topMoney: zdinfo.money, redMoney: v.flje || '', redBagNum: v.flfs || '', topDays: zdinfo.days, isTop: isTop, isRed: isRed , topId:zdinfo.id},
        success: function (res) {
          console.log(res)
          if (res.data.code == '1') {
            let oid = res.data.data, redId = res.data.red;
            if (Number(paymoney) > 0) {
              wx.hideLoading()
              that.setData({
                oid: oid,
                isshowpay: !that.data.ishowpay,
                payobj: { params: { money: paymoney, orderId: oid, redId: redId, userId: co.userinfo.id }, apiurl: app.url.topPay }
              })
            }
            else {
              wx.hideLoading()
              wx.showToast({
                title: '操作成功',
                mask: 1,
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }, 1000)
            }
          }
          else {
            wx.hideLoading()
            that.setData({ loading: false })
            wx.showToast({
              title: '请重试',
              duration: 1000,
            })
          }
          console.log('add', res.data)
        }
      });
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})