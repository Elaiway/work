// dist/public/auxiliary/mall/good-card.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: Object,
      value: {}
    },
    color: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: '1'
    },
    config:{
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    layoutBodyOne: {
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        wid: 200,
        hei: 200,
      },
    },
  },
  lifetimes: {
    attached() {
      this.setData({
        color: app.globalData.color
      })
      // 在组件实例进入页面节点树时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goodinfo(e) {
      console.log(e)
      app.util.goUrl({
        param: e.currentTarget.dataset.id,
        value: "mallDetail"
      })
    },
    storeInfo(){
      wx.navigateTo({
        url: '/pages/mall/storemall?id=' + this.data.content.storeId,
      })
    },
    deleteCart(e) {
      this.triggerEvent('deletecart', e.currentTarget.dataset.id)
    },
    // 数量事件
    onChange(e) {
      // this.setData({
      //   [`content.goods${[e.currentTarget.dataset.idx]}.num`]: e.detail
      // })
      this.triggerEvent('numchange', { num: e.detail.value, childrenId: e.currentTarget.dataset.cid})
      //console.log(e,e.detail,this.data.content)
    },
    total(){
      wx.setStorageSync('goodsArr', [this.data.content])
      wx.navigateTo({
        url: '/pages/mall/orderpay',
      })
      console.log('购物车结算', wx.getStorageSync('goodsArr'))
    },
  }
})