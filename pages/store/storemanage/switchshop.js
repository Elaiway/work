// pages/personal/testcenter/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dparr: []
  },
  shopClick(e) {
    console.log(e.currentTarget.dataset.item)
    let status = e.currentTarget.dataset.item.status,
      item = e.currentTarget.dataset.item;
    if (status == 0) {
      wx.showModal({
        title: '提示',
        content: '此店铺正在审核中',
      })
    } else if (status == 1) {
      console.log(Math.round(new Date().getTime() / 1000), app.util.ormatTime(item.enterEndTime))
      if (Math.round(new Date().getTime() / 1000) >= app.util.ormatTime(item.enterEndTime)) {
        wx.navigateTo({
          url: '/pages/store/storemanage/index?storeId=' + item.id,
        })
      } else {
        wx.showModal({
          title: '设置默认店铺',
          content: '确认设置此店铺为默认店铺吗？',
          success(res) {
            if (res.confirm) {
              app.util.getShowloading('提交中')
              app.api.prequest({
                url: app.url.set_store,
                method: "POST",
                data: {
                  storeId: item.id,
                }
              }).then(res => {
                console.log("请求成功")
                if (res.code == '1') {
                  app.util.getShowtoast("操作成功")
                  setTimeout(() => {
                    wx.navigateTo({
                      url: '/pages/store/storemanage/index?setStore=' + JSON.stringify(item),
                    })
                  }, 1000)
                } else {
                  app.util.getShowtoast("请重试")
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarColor(this);
    app.setNavigationBarTitle('店铺列表')
    that.setData({
    })
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
    console.log(this.options.storeid)
    var that = this; 
    let expiretime = false
    app.api.request({
      'url': app.url.user_storelist,
      success: res => {
        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].storeLogo = app.util.getImgUrl(res.data.data[i].storeLogo)
          res.data.data[i].enterEndTime = res.data.data[i].enterEndTime.substring(0, 16)
          if (Math.round(new Date().getTime() / 1000) >= app.util.ormatTime(res.data.data[i].enterEndTime)) {
            res.data.data[i].expiretime = true
          }
        }
        let dparr = res.data.data
        console.log(dparr)
        that.setData({
          dparr: dparr,
          expiretime: expiretime,
        })
      },
    })
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