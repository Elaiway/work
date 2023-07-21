// pages/personal/testcenter/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rzarr: []
  },
  tzxq(e) {
    let index = e.currentTarget.dataset.index,
      rzarr = this.data.rzarr;
    console.log(index, rzarr)
    //return
    if (index == 0) {
      if (rzarr[index].typename == '未认证') {
        wx.navigateTo({
          url: 'testpersonal',
        })
      } else if (rzarr[index].typename == '待审核') {
        wx.showModal({
          title: '提示',
          content: '您已提交信息，请耐心等待审核',
        })
      }
    }
    if (index == 1) {
      wx.navigateTo({
        url: 'testbond',
      })
      return
      if (rzarr[index].typename == '未缴纳') {
        wx.navigateTo({
          url: 'testbond',
        })
      } else {}
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarColor(this);
    //app.pageOnLoad(this);
    app.setNavigationBarTitle('个人认证中心')
    that.setData({
      Swiper: {
        "padding": 0,
        "height": app.system.slideNum,
        "maxLimit": 300,
        "minLimit": 100,
        "swiper": {
          "children": [{
            url: app.imgsrc + '/wechatimg/testcenter/testlb.png',
          }],
        }
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
    var that = this,
      rzarr = [{
          src: app.imgsrc + '/wechatimg/testcenter/testgr.png',
          name: '个人认证',
          type: '2',
          typename: '未认证',
          show: false,
        },
        //  {
        //   src: app.imgsrc + '/wechatimg/testcenter/testqy.png',
        //   name: '企业认证',
        //   type: '2',
        //   typename: '未认证',
        //   show: false,
        // },
        {
          src: app.imgsrc + '/wechatimg/testcenter/testmx.png',
          name: '诚信保证金',
          type: '2',
          typename: '未缴纳',
          show: false,
        }
      ];
    app.api.identSet((info) => {
      info.identType.forEach(function(item, index) {
        if (info.identOpen == '1' && item == 1) {
          rzarr[0].show = true
        }
      })
      if (info.bondOpen == '1' && info.bondPersonal == '1') {
        rzarr[1].show = true
      }
      console.log(info, rzarr)
      //myAuth
      app.api.request({
        'url': app.url.myAuth,
        data: {
          id: wx.getStorageSync('users').id,
          type: 1
        },
        success: function(res) {
          let myAuth = res.data.data
          console.log(myAuth)
          if (myAuth && myAuth.status == '1') {
            rzarr[0].type = '1'
            rzarr[0].typename = '已认证'
          } else if (myAuth && myAuth.status == '0') {
            rzarr[0].typename = '待审核'
          }
          //myEnsure
          app.api.request({
            'url': app.url.myEnsure,
            data: {
              id: wx.getStorageSync('users').id,
              type: 1
            },
            success: res => {
              let myEnsure = res.data.data
              console.log(myEnsure)
              if (myEnsure) {
                rzarr[1].type = '1'
                rzarr[1].typename = '已缴纳'
              }
              that.setData({
                identSet: info,
                rzarr: rzarr,
              })
            },
          })
        },
      })
    })
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