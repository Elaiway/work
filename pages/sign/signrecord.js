// pages/personal/integral/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mdoaltoggle: false,
  },
  // mdoalclose: function() {
  //   this.setData({
  //     mdoaltoggle: false,
  //   })
  // },
  // mdoalopen: function() {
  //   this.setData({
  //     mdoaltoggle: true,
  //   })
  // },
  // bq(e) {
  //   this.setData({
  //     mdoaltoggle: true,
  //     acindex: '1',
  //   })
  // },
  // gm(e) {
  //   this.setData({
  //     mdoaltoggle: true,
  //     acindex: '2',
  //   })
  // },
  // qrgm(e) {
  //   this.setData({
  //     mdoaltoggle: false,
  //   })
  //   setTimeout(() => {
  //     this.setData({
  //       mdoaltoggle: true,
  //       acindex: '3',
  //     })
  //   }, 1000)
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    // if (options.current!=null){
    //     this.setData({
    //         key: options.current,
    //     })
    // }
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    app.setNavigationBarTitle('签到记录')
    app.api.prequest({
      url: app.url.weekSignRecord,
    }).then(res => {
      let arecord = res.data
      for (let i = 0; i < arecord.length; i++) {
        console.log("已签", i, arecord[i])
        if (arecord[i].sign == 1) {
          arecord[i].type = 1
          // arecord[i].btnName = "已签"
        }
        // else if (arecord[i].sign == 1){
        //   arecord[i].type = 3
        // } 
        else {
          arecord[i].type = 2
          // arecord[i].btnName = "未签"
          // console.log("未签", i, arecord[i])
        }
      }
      app.api.prequest({
        url: app.url.signRecord,
      }).then(sres => {
        let signRecord = sres.data
        this.setData({
          signrecord: arecord,
          signrecord: signRecord,
        })
      })
      console.log(res.data)
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

  }
})