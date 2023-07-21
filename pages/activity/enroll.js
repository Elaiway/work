// pages/freeride/index/.js
const app = getApp()
Page({
  data: {
    detailPage: [],
    isshowpay: false,
    num: 1,
    checkboxvalue: true,
    params: {
      num:'',
      money:'',
      info:[],
    },
  },
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('活动报名')
    app.setNavigationBarColor(this)
    this.setData({
      id: options.id,
      system:getApp().system
    })
    console.log(options.id)
    this.detailPage()
    // 获取用户信息
    app.getUserInfo((userinfo) => {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
  },
  detailPage() {
    var that = this
    app.api.prequest({
      'url': app.url.activityInfo,
      data: {
        activityId: this.data.id
      }
    }).then(res => {
      res.data.detailImgs = app.util.getImgUrl(res.data.detailImgs)
      res.data.startTime = app.util.ormatDate(res.data.startTime)
      res.data.endTime = app.util.ormatDate(res.data.endTime)
      // res.data.currentPrice = res.data.currentPrice
      res.data.info = res.data.info.map(item=>{
        return {
          name: item,
          value: '',
          field: item
        }
      })
      let detailPage = res.data, max = parseInt(res.data.limitNum)
      that.setData({
        detailPage,
        max,
        "params.money": res.data.currentPrice
      })
      that.isJoin()
       console.log(res.data, this.data.id, parseInt(res.data.limitNum))
    })
  },
  //查看报名成功
  isJoin(e){
    if (this.data.detailPage.isJoin == true){
      wx.showModal({
        title: '提示',
        content: '已报名',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/activity/collection',
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            wx.navigateTo({
              url: '/pages/activity/collection',
            })
            console.log('用户点击取消')
          }
          app.util.getShowloading()
        }
      })
    }
  },
  //数量事件
  onChange(e) {
    let currentPrice = +this.data.detailPage.currentPrice
    this.setData({
      num: e.detail.value,
      "params.num": e.detail.value,
      "params.money": (e.detail.value * currentPrice).toFixed(2)
    })
    console.log(e.detail, currentPrice)
  },
  //文本输入
  getInput: function (e) {
    this.setData({
      fname: e.detail.value
    })
  },
  //勾选协议
  clickcheckbox(e) {
    console.log(e.detail)
    this.setData({
      checkboxvalue: e.detail
    })
  },
  //立即支付
  formSubmit: function (e) {
    let that = this,
      co = this.data,
      v = e.detail.value,
      infos =[];
    console.log('form发生了submit事件，携带数据为：', co, co.params, v,)
     //校验表单
    let warn = "", flag = true;
    for(let i in co.detailPage.info){
      if (v[co.detailPage.info[i].name]==''){
        wx.showModal({
          title: '提示',
          content: '请输入' + co.detailPage.info[i].name
        })
        return
      }
      infos.push({
        name: co.detailPage.info[i].name,
        value: v[co.detailPage.info[i].name]
      })
      // console.log({ name: co.detailPage.info[i].name, value: v[co.detailPage.info[i].name] },infos)
    } 
    if (app.util.isNull(v.checkbox)) {
      warn = "请查看用户协议并勾选";
    }
    else {
      flag = false;
      // app.util.getShowloading('提交中')
      // console.log('请求接口', '活动ID--18:',this.data.id ,'报名ID:',co.id)
      that.setData({
        params: {
          activityId: this.data.id,
          num: this.data.num,
          money: this.data.params.money,
          info: JSON.stringify(infos)
        },
      })
      // return
      //add
      console.log(this.data.params,this.data)
      app.api.request({
        'url': app.url.activitySaveEnroll,
        'method': 'POST',
        data: co.params,
        success: function (res) {
          console.log(res)
          //return
          if (res.data.code == '1') {
            // let oid = res.data.data
            console.log(co.params.money)
            if (Number(co.params.money) > 0) {
              wx.hideLoading()
              that.setData({
                isshowpay: !that.data.ishowpay,
                payobj: {
                  params: {
                    money: co.params.money,
                    enrollId: res.data.data
                  },
                  apiurl: app.url.activityEnrollPay
                }
              })
              console.log(co.params.money)
            } else {
              app.util.getShowtoast('报名成功')
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/activity/index',
                })
              }, 1000)
            }
          } else {
            app.util.getShowtoast('活动未开始', 1000, 1)
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
  //支付
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      wx.redirectTo({
        url: '/pages/activity/order',
      })
    }
  },
  onReady: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
})