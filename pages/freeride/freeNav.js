// pages/freeride/collection/.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mygd: false,
    isget: false,
    freeList: [],
    params: {
      page: 1,
      size: 10,
      typeId: '',
      startPlace: '',
      endPlace: '',
    },
    typec:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.setNavigationBarColor(this);
    this.setData({
      'params.typeId': JSON.parse(options.msg).id
    })
    console.log(options)
    app.setNavigationBarTitle(JSON.parse(options.msg).name)
    that.freeList()
  },

  //顺风车列表
  freeList(e) {
    var that = this, params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.url.freeCarList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].createdAt = app.util.ormatDate(res.data[i].createdAt)
        res.data[i].createdAt = res.data[i].createdAt.substring(5, 16)
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
      let freeList = that.data.freeList
      freeList = freeList.concat(res.data)
      console.log(freeList)
      that.setData({
        freeList,
        isget: true,
      })
      console.log('列表信息', res)
    })
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
      this.freeList()
    }
  },

})