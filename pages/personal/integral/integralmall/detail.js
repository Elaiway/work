// pages/personal/integral/integralmall/detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // onshare: false,
    // key: '0',
    // tabs: [{
    //     name: '商品详情',
    //     id: '0',
    //   },
    //   {
    //     name: '购买评价',
    //     id: '1',
    //   }
    // ],
    mygd: false,
    isget: false,
    params: {
      size: 10,
      isRecommend: '1',
    },
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)

    this.setData({
      key,
      index,
    })
  },
  // 转发分享
  // share(e) {
  //   this.setData({
  //     onshare: true
  //   })
  // },
  //返回首页
  goIndex(e){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    app.setNavigationBarColor(this,()=>{
    });
    app.setNavigationBarTitle('商品详情')
    app.api.prequest({
      url: app.url.goodsinfo,
      data:{
        id:options.id
      }
    }).then(res =>{
      console.log(res)
      res.data.logo = app.util.getTypeImgsUrl(res.data.logo)
      let goodInfo = res.data
      console.log(goodInfo)
      that.setData({
        goodInfo: goodInfo,
    
        Swiper: {
            "padding": 0,
            "height": 375,
            "maxLimit": 300,
            "minLimit": 100,
            "swiper": {
              "children": goodInfo.logo
            }
        }
      })
      app.api.prequest({
        url: app.url.userInfo
      }).then(ures => {
        // console.log(ures,res)
        // console.log(ures.data.integral)
        let int = ures.data.integral,color
        console.log(goodInfo.score)
        if (+int >= +goodInfo.score ){
           color=that.data.color
        }
        else{
          color='#ddd'
        }
        that.setData({
          foot_menu: {
            menu: [{
              icon: 'icon-shouye',
              name: '首页',
              src: "/pages/personal/integral/integralmall/index",
              navigateType: '3',
              isLogin: 0
            },
            {
              icon: 'icon-xiaoxi',
              name: '客服',
              // src: "/pages/yellow/index",
              navigateType: '1',
            },
            ],
            main: {
              cName: color == '#ddd' ? '积分不足' :'去兑换',
              isMain: true,
              isLogin: 1,
              isdh: color =='#ddd'
            },
            color: color,
            right: true,
          },
        })
      })
    })
    that.getProlist()
  },
  // 获取商品列表
  getProlist(e) {
    let that = this, params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.url.goodsList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].logo = app.util.getImgUrl(res.data[i].logo)
      }
      if (res.data.length <= 10) {
        that.setData({
          mygd: true,
        })
      } 
      let recommend = res.data
      console.log(res.data)
      that.setData({
        recommend: recommend,
        // isget: true,
      })
    })
  },
  //点击支付
  footclick(e){
    console.log(e.detail)
    let id = this.data.goodInfo.id
    if (!e.detail.navigateType){
      if (e.detail.isdh == false) {
        wx.navigateTo({
          url: 'payment?id=' + id,
        })
      }
      else {
        wx.showModal({
          title: '',
          content: '您的积分不足兑换当前商品',
        })
      }
    }
    if(e.detail.navigateType == '1'){
      wx.navigateTo({
        url: '/pages/personal/service',
      })
      // wx.showLoading({
      //   title: '客服',
      // })
      // setTimeout(e => {
      //   wx.hideLoading()
      // },1000)
    }

    console.log(e.detail,this.data)
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})