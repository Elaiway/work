// pages/personal/wallet/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarTitle('余额')
    app.setNavigationBarColor(this);
    app.api.prequest({
      'url': app.url.payConfig,
    }).then(res => {
      console.log(res)
      this.setData({
        payConfig: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 获取商家信息
  getPostlist(e) {
    var that = this,
      params = {
        page: that.data.page,
        size: 10,
      }
    console.log(params)
    app.api.request({
      url: app.url.balanceList,
      data: params,
      success: res => {
        console.log('列表信息', res)
        if (res.data.data.length < 10) {
          that.setData({
            mygd: true,
          })
        } else {
          that.setData({
            page: that.data.page + 1,
          })
        }
        var postList = that.data.postList
        for (let i in res.data.data) {
          res.data.data[i].createdAt = app.util.ormatDate(res.data.data[i].createdAt)
          res.data.data[i].date = res.data.data[i].createdAt.substring(5, 10)
          res.data.data[i].time = res.data.data[i].createdAt.substring(11, 16)
          res.data.data[i].tips = that.getLabelByType(res.data.data[i].type)
        }
        postList = postList.concat(res.data.data)
        that.setData({
          postList: postList,
          isget: true,
        })
      }
    })
  },
  getLabelByType(type) {
    switch (+type) {
      case 1:
        return "置顶";
      case 2:
        return "刷新";
      case 3:
        return "发帖";
      case 4:
        return "红包";
      case 5:
        return "商家入驻";
      case 6:
        return "商家续费";
      case 7:
        return "充值";
      case 8:
        return "资讯打赏";
      case 9:
        return "保证金";
      case 10:
        return "电话付费"
      case 11:
        return "提现";
      case 12:
        return "保证金退还"
      case 13:
        return "积分兑换"
      case 14:
        return "黄页发布"
      case 15:
        return "加入合伙人"
      case 17:
        return "顺风车发布"
      case 18:
        return "顺风车置顶"
      case 19:
        return "顺风车刷新"
      case 20:
        return "求职招聘发布"
      case 21:
        return "求职招聘置顶"
      case 22:
        return "求职招聘刷新"
      case 23:
        return "房屋发布"
      case 24:
        return "房屋置顶"
      case 25:
        return "房屋刷新"
      case 26:
        return "商城订单"
      case 27:
        return "名片发布"
      case 28:
        return "名片置顶"
      case 29:
        return "后台充值";
      case 30:
        return "活动报名"
      case 31:
        return "名片续费"
      case 32:
        return "黄页续费"
      case 33:
        return "VIP"
      case 34:
        return "拼团支付"
      case 35:
        return "优惠卷领取"
      case 36:
        return '抢购支付'
      case 37:
        return "砍价支付"
      case 38:
        return "余额退还"
      default:
        return "账单提现"
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    this.setData({
      postList: [],
      page: 1,
      mygd: false,
      isget: false,
    })
    this.getPostlist();
    //userinfo
    app.api.userinfo((info) => {
      console.log(info)
      that.setData({
        userinfo: info,
      })
    })
    // app.api.request({
    //   'url': app.url.balanceList,
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       balanceList: res.data.data,
    //     })
    //   },
    // })
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
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  }
})