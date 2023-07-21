// pages/integralmall-myorder/index.js
var app = getApp();
Page({
  data: {
    // Search: {
    //   "position": 0,
    //   "shape": 3,
    //   "height": 55,
    //   "borderStyle": 0,
    //   "fontStyle": "center",
    //   "recommendSearch": 1,
    //   "searchBoxList": [],
    //   "keyWords": "搜索订单"
    // },
    myRecord:[],
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
    },
    key: '0',
    tabs: [{
        name: '全部',
        id: '0',
      },
      {
        name: '未兑换',
        id: '1',
      },
      {
        name: '待收货',
        id: '2',
      },
      {
        name: '已兑换',
        id: '3',
      },
    ],
    content:{
      jycg: 0,
      background: '#fff',
      number: 1,
      instruction: 1,
      footer: 1,
      numberl: 1,
      body: {
        right: 1,
        width: 130,
        height: 130,
      },
    },
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options)
    app.setNavigationBarTitle("我的订单")
    app.setNavigationBarColor(this);
    that.getOrder()
  },
  getOrder(e){
    let that = this, params = that.data.params
    app.api.prequest({
      url: app.url.myRecord,
      method: "POST",
      data: params,
    }).then(res => {
      console.log(res.data)
      if (res.data.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
          // page: that.data.page + 1,
        })
        console.log(that.data.params.page)
      }
      let myRecord = this.data.myRecord
      myRecord = myRecord.concat(res.data.data)
      that.setData({
        myRecord,
        isget: true,
      })
      console.log(myRecord)
    })
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
      myRecord: [],
      'params.page': 1,
      'params.status': key,
      mygd: false,
      isget: false, 
    })
    this.getOrder()
  },
  orderDetail(e) {
    // wx.navigateTo({
    //   url: '/pages/personal/integral/integralmall/orderdeta',
    // })
    console.log(e)
    console.log(e.detail)
    if (e.detail.name == "继续兑换") {
      wx.navigateTo({
        url: '/pages/personal/integral/integralmall/index',
      })
    }
    else if (e.detail.name == "确认收货") {
      let orderId = e.detail.id, that = this;
      console.log("ID",orderId)
      wx.showModal({
        title: '确认收货',
        content: '确认确认收货吗',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定',e.detail.id)
            app.util.getShowloading('提交中')
            //maketop
            app.api.prequest({
              url: app.url.query,
              method: "POST",
              data: {
                orderId: orderId,
              }
            }).then(res => {
              console.log(res)
              if (res.code == '1') {
                that.onTabsChange({ detail: { key: 1 } })
                app.util.getShowtoast("操作成功")
              }
              else {
                app.util.getShowtoast(res.msg)
              }
              console.log('add', res)
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function () {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getOrder()
    }
  },
  onShareAppMessage: function() {

  }
})