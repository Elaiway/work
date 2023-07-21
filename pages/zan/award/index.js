// pages/message/reward/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      var arrPara = scene.split("&");
      var arr = [];
      for (var i in arrPara) {
        arr = arrPara[i].split("=");
        wx.setStorageSync(arr[0],arr[1]);
        
      }
      console.log(arr,666)
      this.setData({
        id:arr[1],
        codeStatus:false
      })
    } else {
      this.setData({
        id:options.id,
        codeStatus:true
      })
      this.getCode()
    }
    this.getDetail()
   
  },

  //获取信息
  getDetail(id) {
    var params = {
      receiveId: this.data.id
    }
    app.api.prequest({
      'url': app.urlTwo.zanHdetail,
      data: params,
      'method': 'get',
    }).then(res => {
      if (res.code == 1) {
        for(var i=0;i<res.data.goods.length;i++){
          res.data.goods[i].showImgs = app.util.getTypeImgsUrl(res.data.goods[i].showImgs)
        }
        this.setData({
          product:res.data
        })

      } else {
        wx.showToast({
          title: res.msg,
          duration: 2000
        })
      }

    })
  },
  // 获取code
  getCode(){
    var that = this
    var params = {
      scene:that.data.id,
      pages: "pages/zan/award/index",
      type: 2

    }
    app.api.prequest({
      'url': app.url.commongetCodeImg,
      data: params,
      'method': 'get',
    }).then(res => {
      if (res.code == 1) {
        wx.getImageInfo({
          src:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600428283057&di=818bb3b864471a618d8253dcaaeb3061&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F36%2F48%2F19300001357258133412489354717.jpg",
          // src:res.data,
          success: res => {
            console.log(res.path)
            that.setData({
              codeImage: res.path
            })
           
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          duration: 2000
        })
      }

    })
  },
  //确认核销
  cancel(){
    var params = {
      receiveId:this.data.id
    }
    app.api.prequest({
      'url': app.urlTwo.zancancel,
      data: params,
      'method': 'post',
    }).then(res => {
      if (res.code == 1) {
        wx.showToast({
          title: res.msg,
          duration: 2000
        })
      } else {
        wx.showToast({
          title: res.msg,
          duration: 2000
        })
      }

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
  onShow: function () {

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

  },
  /**
   * 用户点击右上角分享
   */


})