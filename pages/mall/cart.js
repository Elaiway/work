// pages/mall/cart.js
var app = getApp();
Page({
  data: {
    totalNum: 0,
    goodscardconfig:{
      del:1,
      input:1,
      total:1,
    },
  },
  onLoad: function(options) {
    app.setNavigationBarTitle('购物车')
    app.setNavigationBarColor(this);
  },
  getCarList() {
    app.api.prequest({
      'url': app.urlTwo.mallCarList,
      method: 'POST',
    }).then(res => {
      res.data.forEach(item => {
        item.goods.forEach(item => {
          item.url = item.showImgs[0] && app.util.getSingleImgUrl(item.showImgs[0].url)
        })
      })
      this.setData({
        carList: res.data,
      })
      this.getTotal()
    })
  },
  getTotal() {
    let carList = this.data.carList,
      totalNum = 0
    carList.forEach(store => {
      store.totalNum = 0;
      store.totalMoney = 0;
      store.goods.forEach(goods => {
        store.totalNum += +goods.num;
        store.totalMoney += +goods.num * +goods.money;
        totalNum += +goods.num
      })
      store.totalMoney = store.totalMoney.toFixed(2)
    })
    this.setData({
      carList,
      totalNum,
    })
    console.log(this.data.carList)
  },
  clearAll() {
    wx.showModal({
      title: '温馨提示',
      content: '确定清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          app.util.getShowloading()
          app.api.prequest({
            'url': app.urlTwo.mallClearCar,
            method: 'POST',
          }).then(res => {
            res.code && app.util.getShowtoast("操作成功")
            res.code && this.getCarList()
          })
        }
      }
    })
  },
  deletecart(e) {
    wx.showModal({
      title: '温馨提示',
      content: '确定删除此商品吗？',
      success: (res) => {
        if (res.confirm) {
          app.util.getShowloading()
          app.api.prequest({
            'url': app.urlTwo.mallDelCar,
            method: 'POST',
            data: {
              childrenId: e.detail
            },
          }).then(res => {
            res.code && app.util.getShowtoast("操作成功")
            res.code && this.getCarList()
            res.code || app.util.getShowtoast(res.msg, 1000, 1)
          })
        }
      }
    })
    console.log(e.detail)
  },
  numchange(e) {
    let carList = this.data.carList
    for (let i = 0; i < carList.length; i++) {
      for (let j = 0; j < carList[i].goods.length; j++) {
        if (carList[i].goods[j].childrenId == e.detail.childrenId) {
          carList[i].goods[j].num = e.detail.num
          break
        }
      }
    }
    this.getTotal()
    console.log(e.detail, this.data.carList)
  },
  onShow: function() {
    this.setData({
      carList:[]
    })
    // 获取用户信息
    app.getUserInfo((userinfo) => {
      this.getCarList()
      console.log(userinfo)
    })
  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
})