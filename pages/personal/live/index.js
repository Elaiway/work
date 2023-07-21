// pages/index/help/liveList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mygd: false,
    isget: false,
    itemList: [],
    params: {
      page: 0,
      size: 10,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    app.setNavigationBarTitle('直播列表')
    that.getLivelist()
  },
  // 获取直播列表
  getLivelist(e) {
    var that = this, 
    params = that.data.params
    console.log(params)
    app.api.prequest({
      'url': app.urlTwo.liveList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        let t = ''
        switch (res.data[i].live_status) {
          case 101:
            t = '直播中'
            break;
          case 102:
            t = '未开始'
            break;
          case 103:
            t = '已结束'
            break;
          case 104:
            t = '禁播'
            break;
          case 105:
            t = '暂停中'
            break;
          case 106:
            t = '异常'
            break;
          case 107:
            t = '已过期'
            break;
        }
        res.data[i].live_statust = t
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
      console.log('列表信息', res.data)
      let itemList = that.data.itemList
      itemList = itemList.concat(res.data)
      that.setData({
        itemList,
        isget: true,
      })

    })
  },
  goDl(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${id}`
    })
    console.log('e',e,id)
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
  onReachBottom() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getLivelist()
    }
  },

})