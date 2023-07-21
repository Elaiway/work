// pages/freeride/collection/.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collList:[],
    typec:2,
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
      type:5,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.setNavigationBarColor(this);
    app.setNavigationBarTitle('收藏')
    that.collection()
  },
  //收藏
  collection(e) {
    var that = this, params = this.data.params
    console.log(params)
    app.api.prequest({
      url: app.url.my_collection,
      data: params,
    }).then(res => {
      console.log(res.data)
      // for (let i = 0; i < res.data.length; i++) {
      //   if (res.data[i].type == '1') {
      //     res.data[i].rideTime = res.data[i].rideTime.substring(5, 16)
      //   }
      // }
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      let collList = that.data.collList
      collList = collList.concat(res.data)
      console.log(collList)
      that.setData({
        collList,
        isget: true,
      })
      console.log('收藏列表', res)
    })
  },
  //点击取消收藏
  onCancelColl(e){
    console.log(e.detail)
    let that=this
    wx.showModal({
      title: '取消收藏',
      content: '确认取消收藏吗',
      success(res){
        if(res.confirm){
          console.log('用户点击确定')
          app.util.getShowloading('提交中')
          app.api.prequest({
            url: app.url.collection_post,
            method: "POST",
            data:{
              postId:e.detail,
              type:5,
            }
          }).then(res =>{
            console.log("请求成功")
            if (res.code == '1') {
              that.setData({
                collList: [],
                'params.page': 1,
              })
              that.completeRefresh()
              app.util.getShowtoast("操作成功")
            }
            else {
              app.util.getShowtoast("请重试")
            }
            console.log(res)
          })
        }
        else if(res.cancel){
          console.log('用户点击取消')
        }
      }
    })
  },
  //完成后刷新
  completeRefresh() {
    if (getCurrentPages().length != 0) {
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */

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
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.collection()
    }
  },

})