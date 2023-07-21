// pages/message/reward/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "",
    date: '2016-09-01',
    describe: "",
    num: "",
    startTime: "",
    endTime: "",
    postId: "",
    storeId: "",
    media: [],
    prizeMedia: [],
    license:[],
    wxCode:[],
    tel:"",
    loadingHidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      postId: options.postId
    })
    if (options.postId != undefined) {
      this.getMessage();
    }
    console.log(options, options.length)
    try {
      console.log(wx.getStorageSync('stores'), 6666)
    } catch (e) {
      // Do something when catch error
    }

  },
  conChange1(e) {
    this.setData({
      media: e.detail.fileList,
    })
  },
  conChange2(e) {
    this.setData({
      prizeMedia: e.detail.fileList,
    })
  },
  conChange3(e) {
    this.setData({
      license: e.detail.fileList,
    })
  },
  conChange4(e) {
    this.setData({
      wxCode: e.detail.fileList,
    })
  },
  updateValue(e) {
    console.log(e)
    let val = e.detail.value;
    if (e.target.dataset.i == 'describe') {
      this.setData({
        describe: val
      })
    } else if (e.target.dataset.i == 'num') {
      this.setData({
        num: val
      })
    } else if (e.target.dataset.i == 'startTime') {
      this.setData({
        startTime: val
      })
    } else if (e.target.dataset.i == 'endTime') {
      this.setData({
        endTime: val
      })
    }else if (e.target.dataset.i == 'tel') {
      this.setData({
        tel: val
      })
    }


  },
  //获取信息
  getMessage() {
    var params = {
      postId: this.data.postId
    }
    app.api.prequest({
      'url': app.urlTwo.zanSubmit,
      data: params,
      'method': 'get',
    }).then(res => {
      if (res.code == 1) {
        if(res.data.media != null){
          res.data.media = app.util.getTypeImgsUrl(res.data.media)  
        }
        if(res.data.prizeMedia != null){
          res.data.prizeMedia = app.util.getTypeImgsUrl(res.data.prizeMedia)  
        }
        this.setData({
          describe: res.data.describe,
          media: res.data.media,
          prizeMedia: res.data.prizeMedia,
          license: res.data.license,
          wxCode: res.data.wxCode,
          tel: res.data.tel,
          num: res.data.num,
          startTime: app.util.ormatDate(res.data.startTime).substring(0, 16),
          endTime: app.util.ormatDate(res.data.endTime).substring(0, 16),
        })
      } else {
        wx.showToast({
          title: res.msg,
          duration: 2000
        })
      }

    })
  },
  submit() {
    this.setData({
      loadingHidden:false
    })
    var params = {
      describe: this.data.describe,
      storeId: wx.getStorageSync('stores').data[0].id,
      media: [],
      prizeMedia: [],
      license:[],
      wxCode:[],
      tel:this.data.tel,
      num: this.data.num,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      postId: this.data.postId==undefined?'':this.data.postId
    }
    for (var i = 0; i < this.data.media.length; i++) {
      var arr = []
      arr.push(this.data.media[i])
      app.api.uploadimg({
        imgarr: arr,
        success: res => {
          params.media.push(res[0])
        }
      })
    }
    for (var i = 0; i < this.data.prizeMedia.length; i++) {
      var arr = []
      arr.push(this.data.prizeMedia[i])
      app.api.uploadimg({
        imgarr: arr,
        success: res => {
          params.prizeMedia.push(res[0])
        }
      })
    }
    for (var i = 0; i < this.data.license.length; i++) {
      var arr = []
      arr.push(this.data.license[i])
      app.api.uploadimg({
        imgarr: arr,
        success: res => {
          params.license.push(res[0])
        }
      })
    }
    for (var i = 0; i < this.data.wxCode.length; i++) {
      var arr = []
      arr.push(this.data.wxCode[i])
      app.api.uploadimg({
        imgarr: arr,
        success: res => {
          params.wxCode.push(res[0])
        }
      })
    }
    setTimeout(() => {
      
      params.media = JSON.stringify(params.media)
      params.prizeMedia = JSON.stringify(params.prizeMedia)
      params.license = JSON.stringify(params.license)
      params.wxCode = JSON.stringify(params.wxCode)
      console.log(params)
      app.api.prequest({
        'url': app.urlTwo.zanSubmit,
        data: params,
        'method': 'POST',
      }).then(res => {
        this.setData({
          loadingHidden:true
        })
        if (res.code == 1) {
          wx.showToast({
            title: '成功',
            duration: 2000
          })
          wx.navigateBack({ //返回
          })
        } else {
          wx.showToast({
            title: res.msg,
            duration: 2000
          })
        }
        console.log(res.data)
      })
    }, 1500)
  },
  upImage() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        this.setData({
          img: tempFilePaths
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