// pages/freeride/index/.js
const app = getApp()
Page({
  data: {
    enrollList: [],
    mygd: false,
    isget: false,
    tabs: [{
        name: "全部",
        id: 0,
      },
      {
        name: "待付款",
        id: 1,
      },
      {
        name: "报名成功",
        id: 2,
      },
      {
        name: "待评价",
        id: 3,
      },
      {
        name: "已完成",
        id: 4,
      },
    ],
    isshowpay: false,
    params: {
      page: 1,
      size: 10,
      type: '',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('我的报名')
    // app.setNavigationBarColor(this)
    app.setNavigationBarColor(this, () => {
      app.api.prequest({
        'url': app.url.activitySet,
        'cachetime': 30,
      }).then(res => {
        // that.detailPage()
        that.setData({
          activitySet: res.data,
        })
      })
    });
    this.enrollList()
    // 获取用户信息
    app.getUserInfo((userinfo) => {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
  },
  // tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    this.setData({
      key,
      enrollList: [],
      "params.page": 1,
      // "params.type":key-1,
      mygd: false,
      isget: false,
    })
    this.enrollList()
    console.log(key)
  },
  //报名列表
  enrollList() {
    let that = this,
      params = this.data.params;
    //全部
    if (this.data.key == 0) {
      that.setData({
        "params.type": '',
      })
    }
    //待付款
    if (this.data.key == 1) {
      that.setData({
        "params.type": 0,
      })
    }
    //报名成功
    if (this.data.key == 2) {
      that.setData({
        "params.type": 1,
      })
    }
    //待评价
    if (this.data.key == 3) {
      that.setData({
        "params.type": 2,
      })
    }
    //已完成
    if (this.data.key == 4) {
      that.setData({
        "params.type": 3,
      })
    }
    app.api.prequest({
      'url': app.url.activityEnrollList,
      data: params
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].showImgs = app.util.getImgUrl(res.data[i].showImgs)
        res.data[i].startTime = app.util.ormatDate(res.data[i].startTime).substring(0, 16)
        res.data[i].endTime = app.util.ormatDate(res.data[i].endTime).substring(0, 16)
        let timestamp1 = app.util.today();
        res.data[i].nowTime = []
        res.data[i].nowTime.push(timestamp1, res.data[i].startTime * 1000)
        console.log(timestamp1)
      }
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      let enrollList = that.data.enrollList
      enrollList = enrollList.concat(res.data)
      that.setData({
        enrollList,
        isget: true,
      })
      console.log(res.data)
    })
  },
  //点击详情
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/activity/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  //取消订单
  cancellOrder(e) {
    let that = this,
      enrollId = e.currentTarget.dataset.id
    wx.showModal({
      title: '取消订单',
      content: '确认取消该订单吗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.getShowloading('提交中')
          app.api.prequest({
            url: app.url.activityCancelEnroll,
            method: "POST",
            data: {
              enrollId,
            }
          }).then(res => {
            console.log("请求成功")
            if (res.code == '1') {
              that.onTabsChange({
                detail: {
                  key: that.data.key
                }
              })
              app.util.getShowtoast("操作成功")
            } else {
              app.util.getShowtoast("请重试")
            }
            console.log(res)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //去支付
  toPay(e) {
    console.log(this.data, e.currentTarget.dataset.paymsg.activityId)
    let that = this,
      money = e.currentTarget.dataset.paymsg.money,
      enrollId = e.currentTarget.dataset.paymsg.enrollId;
    app.api.prequest({
      'url': app.url.activityInfo,
      data: {
        activityId: e.currentTarget.dataset.paymsg.activityId
      }
    }).then(res =>{
      console.log(res.data.isJoin)
      if (res.data.isJoin == false){
        if (Number(money) > 0) {
          wx.hideLoading()
          that.setData({
            isshowpay: !that.data.ishowpay,
            payobj: {
              params: {
                money,
                enrollId,
              },
              apiurl: app.url.activityEnrollPay
            }
          })
        } else {
          app.util.getShowtoast('报名成功')
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/activity/index',
            })
          }, 1000)
        }
      }
      else{
        app.util.getShowtoast("该订单已支付")
        console.log("订单已支付")
      }
    })
    //return 
    
  },
  //查看详情/去核销
  viewDetail(e){
    wx.navigateTo({
      url: '/pages/activity/enrolldetail?id=' + e.currentTarget.dataset.id,
    })
  },
  onReady: function() {},
  onHide: function() {},
  onUnload: function() {},
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.enrollList()
    }
  },
  onPullDownRefresh: function() {},
})