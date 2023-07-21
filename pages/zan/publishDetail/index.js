// pages/message/reward/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
    key: '0',
    color: "#E64340",
    isget: false,
    tabs: [{
        name: '待审核',
        id: '0',
      },
      {
        name: '已通过',
        id: '1',
      },
      {
        name: '已拒绝',
        id: '2',
      },
      {
        name: '兑换记录',
        id: '3',
      }
    ],
    page1: 1,
    page2: 1,
    list: [],
    recordList:[],
    imgHead:"",
    name:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({ 
      imgHead:wx.getStorageSync('stores').data[0].storeLogo[0].url
    })
    this.setData({ 
      name:wx.getStorageSync('stores').data[0].storeName
    })
  },
  //前往集赞榜
  toBillboard(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/zan/billboard/index?postId=' + e.target.dataset.id,
    })
  },
  //兑换记录
  getJiLu() {
    this.setData({
      isget: false,
    })
    var params = {
      storeId: wx.getStorageSync('stores').data[0].id,
      size: 10,
      // postId:1,
      page: this.data.page2
    }
    app.api.prequest({
      'url': app.urlTwo.zanJiLu,
      data: params,
      'method': 'get',
    }).then(res => {
      this.setData({
        isget: true,
      })
      if (res.code == 1) {
        for(var i=0;i<res.data.length;i++){
          if(res.data[i].hxTime==null) continue
          res.data[i].hxTime = app.util.ormatDate(res.data[i].hxTime).substring(0, 16)
        }
        var arr = this.data.recordList.concat(res.data)
      
        this.setData({
          recordList:arr
        })
      } else {
        wx.showToast({
          title: res.msg,
          duration: 2000
        })
      }
    })
  },
  //获取我的发布
  getMyPulish() {
    this.setData({
      isget: false,
    })
    var params = {
      storeId: wx.getStorageSync('stores').data[0].id,
      size: 10,
      page: this.data.page1
    }
    app.api.prequest({
      'url': app.urlTwo.zanMyList,
      data: params,
      'method': 'get',
    }).then(res => {
      if (res.code == 1) {
        this.setData({
          isget: true,
        })
        if (res.data.length == 0) {
          return false
        }
        var arr = this.data.list.concat(res.data)
        arr.forEach((item) => {
          item.startTime = app.util.ormatDate(item.startTime).substring(0, 16)
          if(item.media != null){
            item.media = app.util.getTypeImgsUrl(item.media)  
          }
        })
        this.setData({
          list: arr,
        })
      } else {
        wx.showToast({
          title: res.msg,
          duration: 2000
        })
      }
    })
  },
  onTabsChange(e) {
    console.log('onTabsChange', e)
    this.setData({
      key: e.detail.key
    })
    if (this.data.key == 3) {
      this.getJiLu()
    }
  },
  toDetal(e){
    console.log(e)
    wx.navigateTo({
      url: '../index/index?postId='+ e.currentTarget.dataset.postid,
    })
  },
  toPublish() {
    wx.navigateTo({
      url: '../publish/index',
    })
  },
  toChange(e) {
    wx.navigateTo({
      url: '../publish/index?postId='+ e.currentTarget.dataset.postid,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getMyPulish()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      list:[],
      key:"0"
    }),

    setTimeout(()=>{
      this.getMyPulish()
    },500)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.key != 3) {
      this.setData({
        page1: this.data.page1 + 1,
      })
      this.getMyPulish()
    } else {
      this.setData({
        page2: this.data.page2 + 1
      })
      this.getJiLu()
    }

  },
  /**
   * 用户点击右上角分享
   */


})