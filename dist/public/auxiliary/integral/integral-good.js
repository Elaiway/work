// dist/public/auxiliary/integral/integral-good.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: Array,
      value: [],
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
    clickDetail(e) {
      let L = e.currentTarget.dataset.idd
      this.triggerEvent('zizujian',L)
      wx.navigateTo({
        url: '/pages/personal/integral/integralmall/detail?id=' + L,
      })
      console.log(e)
    }
  }
})
