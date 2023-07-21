// pages/location/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotcity: [
      "外衣",
      "外衣男-秋冬",
      "外衣女",
      "外衣女-冬",
      "外衣加绒",
      "外衣女春秋2018新款加绒",
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      options:options
    })
    if (options.type == 1) {
      this.setData({
        info_search: wx.getStorageSync("index_search")
      })
    } else if (options.type == 2) {
      this.setData({
        info_search: wx.getStorageSync("info_search")
      })
    } else if (options.type == 3) {
      this.setData({
        info_search: wx.getStorageSync("store_search")
      })
    }
    // 黄页搜索
    else if (options.type == 4) {
      this.setData({
        info_search: wx.getStorageSync("yellow_search")
      })
    }
    // 求职招聘
    else if (options.type == 5) {
      this.setData({
        info_search: wx.getStorageSync("job_search")
      })
    }
    // 限时抢购
    else if (options.type == 6) {
      this.setData({
        info_search: wx.getStorageSync("rush_buy")
      })
    }
    // 多商户商城
    else if (options.type == 7) {
      this.setData({
        info_search: wx.getStorageSync("mall_search")
      })
    }
    // 多商户商城
    else if (options.type == 8) {
      this.setData({
        info_search: wx.getStorageSync("assemble_search")
      })
    }
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    app.setNavigationBarTitle('搜索')
    this.setData({
      type: options.type,
      color: this.data.color,
    })
    // this.disTinguish()
  },
  disTinguish: function(e) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.searchBar = this.selectComponent("#searchBar");
  },
  // 搜索
  onChange(e) {
    console.log('拿到的输入框数据为', e.detail)
    var value = e.detail
    this.setData({
      value: value
    })
    if (this.data.type == 1) {
      var index_search = wx.getStorageSync("index_search") || []
      index_search.push(value)
      wx.setStorageSync('index_search', index_search)
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.detail,
      })
    } else if (this.data.type == 2) {
      // this.infomationSearch()
      var info_search = wx.getStorageSync("info_search") || []
      info_search.push(value)
      wx.setStorageSync('info_search', info_search)
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.detail,
      })
    } else if (this.data.type == 4) {
      var info_search = wx.getStorageSync("yellow_search") || []
      info_search.push(value)
      wx.setStorageSync('yellow_search', info_search)
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.detail,
      })
    } else if (this.data.type == 5) {
      var info_search = wx.getStorageSync("job_search") || []
      info_search.push(value)
      wx.setStorageSync('job_search', info_search)
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.detail,
      })
    } else if (this.data.type == 6) {
      var info_search = wx.getStorageSync("rush_buy") || []
      info_search.push(value)
      wx.setStorageSync('rush_buy', info_search)
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.detail,
      })
    } else if (this.data.type == 7) {
      var info_search = wx.getStorageSync("mall_search") || []
      info_search.push(value)
      wx.setStorageSync('mall_search', info_search)
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.detail,
      })
    }
     else {
      // this.storeSearch()
      var store_search = wx.getStorageSync("store_search") || []
      store_search.push(value)
      wx.setStorageSync('store_search', store_search)
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.detail,
      })
    }
  },
  search(e) {
    if (this.data.type == 1) {
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.currentTarget.dataset.text,
      })
    } else if (this.data.type == 2) {
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.currentTarget.dataset.text,
      })
    } else if (this.data.type == 4) {
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.currentTarget.dataset.text,
      })
    } else if (this.data.type == 5) {
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.currentTarget.dataset.text,
      })
    } else if (this.data.type == 6) {
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.currentTarget.dataset.text,
      })
    } else if (this.data.type == 7) {
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.currentTarget.dataset.text,
      })
    } else if (this.data.type == 8) {
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.currentTarget.dataset.text,
      })
    } 
    else {
      wx.navigateTo({
        url: '/pages/search_result/index?type=' + this.data.type + '&value=' + e.currentTarget.dataset.text,
      })
    }
  },
  // 删除本地缓存
  cancel(e) {

    if (this.data.type == 1) {
      wx.removeStorage({
        key: 'info_search',
        success: function (res) { },
      })
      this.setData({
        info_search: wx.getStorageSync("info_search") || []
      })
    } else if (this.data.type == 2) {
      wx.removeStorage({
        key: 'info_search',
        success: function(res) {},
      })
      this.setData({
        info_search: wx.getStorageSync("info_search") || []
      })
    } else if (this.data.type == 4) {
      wx.removeStorage({
        key: 'info_search',
        success: function (res) { },
      })
      this.setData({
        info_search: wx.getStorageSync("info_search") || []
      })
    } else if (this.data.type == 5) {
      wx.removeStorage({
        key: 'info_search',
        success: function (res) { },
      })
      this.setData({
        info_search: wx.getStorageSync("info_search") || []
      })
    } else if (this.data.type == 6) {
      wx.removeStorage({
        key: 'info_search',
        success: function (res) { },
      })
      this.setData({
        info_search: wx.getStorageSync("info_search") || []
      })
    } else if (this.data.type == 7) {
      wx.removeStorage({
        key: 'info_search',
        success: function (res) { },
      })
      this.setData({
        info_search: wx.getStorageSync("info_search") || []
      })
    } else if (this.data.type == 8) {
      wx.removeStorage({
        key: 'info_search',
        success: function (res) { },
      })
      this.setData({
        info_search: wx.getStorageSync("info_search") || []
      })
    }
    else{
      wx.removeStorage({
        key: 'store_search',
        success: function (res) { },
      })
      this.setData({
        info_search: wx.getStorageSync("store_search") || []
      })
    }
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
  onReachBottom: function() {

  },

})