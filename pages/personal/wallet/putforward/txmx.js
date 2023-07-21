// pages/personal/wallet/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: "0",
    tabs: [{
      name: "提现",
      id: 0
    },
    {
      name: "充值",
      id: 1
    }
    ],
    postList: [],
    page: 1,
    mygd: false,
    isget: false,
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    this.setData({
      key,
      postList: [],
      page: 1,
      mygd: false,
      isget: false,
    })
    if (key == '0') {
      this.getPostlist()
    }
    else{
      this.getczPostlist()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarTitle('明细')
    app.setNavigationBarColor(this);
    var that = this;
    this.getPostlist();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //
  getPostlist(e) {
    var that = this,
      params = {
        page: that.data.page,
        size: 10,
      }
    console.log(params)
    app.api.request({
      url: app.url.cashlist,
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
          res.data.data[i].creatTime = app.util.ormatDate(res.data.data[i].creatTime)
          res.data.data[i].date = res.data.data[i].creatTime.substring(5, 10)
          res.data.data[i].time = res.data.data[i].creatTime.substring(11, 16)
        }
        postList = postList.concat(res.data.data)
        that.setData({
          postList: postList,
          isget: true,
        })
      }
    })
  },
  //
  getczPostlist(e) {
    var that = this,
      params = {
        page: that.data.page,
        size: 10,
        type:'7',
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
        }
        postList = postList.concat(res.data.data)
        that.setData({
          postList: postList,
          isget: true,
        })
      }
    })
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
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      if (this.data.key == '0') {
        this.getPostlist()
      }
      else {
        this.getczPostlist()
      }
    }
  }
})