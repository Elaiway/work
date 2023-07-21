// pages/personal/storebalance/index.js
const app = getApp()
Page({
  data: {
    projectArr: [{
        show: false,
        title: "商城",
        icon: "icon-gouwu",
        color: "#4BA4FF",
        money: '0',
        item: '1',
      },
      {
        show: false,
        title: "活动",
        icon: "icon-kaishibaoming",
        color: "#4BA4FF",
        money: '0',
        item: '2',
      }, {
        show: false,
        title: "优惠券",
        icon: "icon-kaishibaoming",
        color: "#4BA4FF",
        money: '0',
        item: '3',
      }, {
        show: false,
        title: "拼团",
        icon: "icon-kaishibaoming",
        color: "#4BA4FF",
        money: '0',
        item: '4',
      },
      {
        show: false,
        title: "抢购",
        icon: "icon-kaishibaoming",
        color: "#4BA4FF",
        money: '0',
        item: '5',
      },
      {
        show: false,
        title: "砍价",
        icon: "icon-kaishibaoming",
        color: "#4BA4FF",
        money: '0',
        item: '6',
      }
    ],
  },
  onLoad: function(options) {
    app.setNavigationBarTitle('商家余额')
    app.setNavigationBarColor(this);
    this.setData({
      storeId: app.sjdId,
      // storeId: options.storeId //调试
    })
    this.getPostlist()
  },
  // 获取商家信息
  getPostlist(e) {
    let that = this
    app.api.prequest({
      url: app.urlTwo.storeBalance,
      data: {
        storeId: this.data.storeId
      }
    }).then(res => {
      let projectArr = this.data.projectArr
      res.data.item.forEach((item, index) => {
        projectArr.forEach((arr, key) => {
          if (item.name == arr.title) {
            projectArr[key].money = item.value
            this.setData({
              [`projectArr[${key}].money`]: item.value,
              [`projectArr[${key}].show`]: true
            })
          }
        })
      })
      this.setData({
        balance: res.data.item,
        balancemony: res.data.money,
      })
    })
  },
  //点击收入记录
  proRecord(e) {
    console.log(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: `/pages/store/storemanage/storebalance/storebalancelist?item=${e.currentTarget.dataset.item}&storeId=${this.data.storeId}`,
    })
  },
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
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  }
})