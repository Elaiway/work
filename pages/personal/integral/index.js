// pages/personal/integral/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: "0",
    tabs: [{
        name: "积分明细",
        id: 0
      },
      {
        name: "兑换记录",
        id: 1
      }
    ],
    page: 1,
    postList: [],
    mygd: false,
    isget: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.current != null) {
      this.setData({
        key: options.current,
      })
    }
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    app.setNavigationBarTitle('我的积分')
    var that = this;
    //userinfo
    app.api.userinfo((info) => {
      console.log(info)
      that.setData({
        userinfo: info,
      })
    })
    this.onTabsChange(
      {
        detail:{
          key:this.data.key
        }
      }
    )
    // this.getPostlist();
    // this.getRecordlist();
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
    if (key == '1') {
      this.getRecordlist()
    }
  },
  //获取
  getPostlist(e) {
    var that = this,
      params = {
        page: that.data.page,
        size: 10,
      }
    console.log(params)
    app.api.request({
      url: app.url.integralList,
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
          res.data.data[i].date = res.data.data[i].createdAt.substring(0, 10)
          // let note;
          // switch (res.data.data[i].source) {
          //   case '1':
          //     note='充值'
          //     break;
          //   case '5':
          //     note = '任务得分'
          //     break;
          //   case '6':
          //     note = '积分兑换'
          //     break;
          //   case '7':
          //     note = '后台充值'
          //     break;
          //   default:
          //     //默认代码块
          // }
          res.data.data[i].note = res.data.data[i].note
        }
        postList = postList.concat(res.data.data)
        that.setData({
          postList: postList,
          isget: true,
        })
      }
    })
  },
  getRecordlist(e){
    var that = this,
      params = {
        page: that.data.page,
        size: 10,
        status: 3,
      }
    console.log(params)
    app.api.prequest({
      url: app.url.myRecord,
      data: params,
      method: 'POST',
      // data:{
      //   status:3
      // }
    }).then(res => {
      console.log("兑换记录列表",res)
      for (let i in res.data.data) {
        res.data.data[i].createdAt = res.data.data[i].createdAt.substring(0, 10)
      }
      if (res.data.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          // 'params.page': that.data.params.page + 1,
          page: that.data.page + 1,
        })
        // console.log(that.data.params.page)
      }
      // var postList = that.data.postList
      console.log(that.data)
      let postList = that.data.postList
      postList = postList.concat(res.data.data)
      // postList = postList.concat(res.data.data)
      that.setData({
        postList,
        isget: true,
      })
      console.log(postList)
    })
  },
  //跳转积分商城
  goIntegral(e){
    wx.navigateTo({
      url: '/pages/personal/integral/integralmall/index',
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
      if (this.data.key == '0') {
        this.getPostlist()
      }
      else if(this.data.key == '1'){
        this.getRecordlist()
      }
    }
  }
})