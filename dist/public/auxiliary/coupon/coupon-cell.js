// dist/public/auxiliary/coupon/coupon-cell.js
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
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goodinfo() {
      wx.navigateTo({
        url: '/pages/coupon/detail?id=' + this.data.content.id,
      })
    },
  }
})
