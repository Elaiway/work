// pages/login/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  chooseImg(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          tx: res.tempFilePaths
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarTitle('个人设置')
    app.setNavigationBarColor(this);
    app.api.request({
      url: app.url.userInfo,
      data: {
        id: wx.getStorageSync('users').id
      },
      success: res => {
        console.log(res)
        let userinfo = res.data.data
        if (userinfo.sex == '1') {
          this.setData({
            sex: "男",
            sex_num: 1
          })
        } else {
          this.setData({
            sex: "女",
            sex_num: 2
          })
        }
        this.setData({
          userinfo: userinfo
        })
      }
    })
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var detail = e.detail.value,
      name = detail.name,
      introduce = detail.detail,
      sex_num = this.data.sex_num
    if (name == '') {
      app.util.getShowmodel("请输入您的昵称")
    } else if (introduce == '') {
      app.util.getShowmodel("请输入您的个性签名")
    } else {
      app.util.getShowloading()
      let portrait;
      if (this.data.tx) {
        app.api.wxUploadImg([{
          url: this.data.tx[0]
        }]).then(res => {
          portrait = this.data.url + res[0].url
          e()
        })
      } else {
        portrait = this.data.userinfo.portrait
        e()
      }
      function e() {
        app.api.request({
          url: app.url.editUser,
          data: {
            userId: wx.getStorageSync('users').id,
            userName: name,
            sex: sex_num,
            sign: introduce,
            portrait,
          },
          method: "POST",
          success: res => {
            if (res.data.code == '1') {
              app.util.getShowtoast("修改成功")
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            } else {
              app.util.getShowtoast(res.data.msg)
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          }
        })
      }
    }
  },
  sex(e) {
    var that = this
    wx.showActionSheet({
      itemList: ['男', '女'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          that.setData({
            sex: "男",
            sex_num: 1
          })
        } else {
          that.setData({
            sex: "女",
            sex_num: 2
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
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

  },

})