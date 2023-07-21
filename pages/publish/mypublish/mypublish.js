// pages/store/storemain/storedetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '0',

    postList_page: 1,
    postList: [],
    tabs: [{
        name: '全部',
        id: '0',
      },
      {
        name: '显示中',
        id: '1',
      },
      {
        name: '待审核',
        id: '2',
      },
      {
        name: '已过期',
        id: '3',
      }
    ],
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)
    console.log(index)
    this.setData({
      key,
      index,
      mygd: false,
      isget: false,
      postList_page: 1,
      postList: [],
    })
    this.lookKey(key)
  },
  refreshtzData() {
    console.log(this.data.key)
    this.setData({
      mygd: false,
      isget: false,
      postList_page: 1,
      postList: [],
    })
    this.lookKey(this.data.key)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  
    this.setData({
      user_id: wx.getStorageSync('users').id
    })
    app.setNavigationBarTitle('我的发布')
    app.setNavigationBarColor(this);
    app.api.postconfig((info) => {
      this.setData({
        postConfig:info
      })
    })
    this.lookKey(this.data.key)
  },
  lookKey(key) {
    if (key == '0') {
      this.getPostlist('userId')
    } else if (key == '1') {
      this.getPostlist('display')
    } else if (key == '2') {
      this.getPostlist('waitAudit')
    } else {
      this.getPostlist('overdue')
    }
  },
  // 获取信息列表信息
  getPostlist(status) {
    var _f = this.data,that = this;
    app.api.userPost({
      data: {
        page: _f.postList_page,
        size: 10,
        status: status,
        userId: _f.user_id
      },
      success: res => {
        console.log('信息列表信息', res)
        if (res.data.data.length < 10) {
          that.setData({
            mygd: true,
          })
        }
        else {
          that.setData({
            postList_page: _f.postList_page + 1,
          })
        }
        var postList = _f.postList
        postList = postList.concat(res.data.data)
        console.log(postList)
        that.setData({
          postList: postList,
          isget: true,
        })
        console.log(_f.postList_page)
      }
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
    console.log(this)
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
      this.lookKey(this.data.key)
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})