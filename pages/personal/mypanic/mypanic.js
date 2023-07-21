// pages/store/storemain/storedetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '0',
    page: 1,
    postList: [],
    tabs: [{
        name: '全部',
        id: '0',
      },
      {
        name: '待付款',
        id: '1',
      },
      {
        name: '待发货',
        id: '2',
      },
      {
        name: '待收货',
        id: '3',
      },
      {
        name: '已完成',
        id: '4',
      },
      {
        name: '售后/退款',
        id: '5',
      }
    ],
  },
  //tabs切换
  onTabsChange(e) {
    var that = this;
    console.log('onTabsChange', e)
    this.setData({
      key: e.detail.key,
      postList: [],
      dataList: [],
      page: 1,
      mygd: false,
      isget: false,
    })
    setTimeout(() => {
      that.setData({
        postList: [],
        isget: true,
      })
    }, 500)
    //this.lookKey(key)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      user_id: wx.getStorageSync('users').id
    })
    app.setNavigationBarTitle(options.title)
    if (options.title == '我的拼团') {
      this.setData({
        tabs: [{
            name: '全部',
            id: '0',
          },
          {
            name: '拼团中',
            id: '1',
          },
          {
            name: '待使用',
            id: '2',
          },
          {
            name: '已完成',
            id: '3',
          },
        ],
      })
    }
    if (options.title == '我的秒杀') {
      this.setData({
        tabs: [{
            name: '全部',
            id: '0',
          },
          {
            name: '待使用',
            id: '1',
          },
          {
            name: '已完成',
            id: '2',
          },
        ],
      })
    }
    if (options.title == '我的报名') {
      this.setData({
        tabs: [{
          name: '全部',
          id: '0',
        },{
            name: '报名中',
            id: '1',
          },
          {
            name: '待核销',
            id: '2',
          },
          {
            name: '已完成',
            id: '3',
          },
          {
            name: '已过期',
            id: '4',
          },
        ],
      })
    }
    if (options.title == '我的卡券') {
      this.setData({
        tabs: [{
          name: '全部',
          id: '0',
        },{
            name: '未使用',
            id: '1',
          },
          {
            name: '已使用',
            id: '2',
          },
          {
            name: '已过期',
            id: '3',
          },
        ],
      })
    }
    if (options.title == '我的砍价') {
      this.setData({
        tabs: [{
            name: '全部',
            id: '0',
          },
          {
            name: '砍价中',
            id: '1',
          },
          {
            name: '待使用',
            id: '2',
          },
          {
            name: '已完成',
            id: '3',
          },
          {
            name: '售后/退款',
            id: '4',
          },
        ],
      })
    }
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
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
    var _f = this.data,
      that = this;
    app.api.request({
      url: app.url.user_post,
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
        } else {
          that.setData({
            postList_page: _f.postList_page + 1,
          })
        }
        var postList = _f.postList
        for (let i in res.data.data) {
          res.data.data[i].postId = Number(res.data.data[i].postId)
          res.data.data[i].creatTime = app.util.settime(res.data.data[i].creatTime)
          res.data.data[i].media = JSON.parse(res.data.data[i].media)
          res.data.data[i].body = res.data.data[i].body.replace("↵", "\n");
          for (let j in res.data.data[i].media) {
            res.data.data[i].media[j].url = that.data.url + res.data.data[i].media[j].url
          }
        }
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