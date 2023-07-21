// dist/public/auxiliary/housingdeal/housingdeal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: Object,
      value: {}
    },
    pageType: {
      type: String,
      value: ''
    },
    housType: {
      type: String,
      value: '',
    },
    color: {
      type: String,
      value: ''
    },
    button: {
      type: String,
      value: ''
    }
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
    housInfo(e){
      wx.navigateTo({
        url: '/pages/housingdeal/detail?id=' + e.currentTarget.dataset.id,
      })
      console.log(e.currentTarget.dataset.id)
    },
    oncancelcoll(e) {
      this.triggerEvent("cancelcoll", e.currentTarget.dataset.cid)
      console.log(e.currentTarget.dataset.cid)
    },
    operation(e) {
      this.triggerEvent("operation", e.currentTarget.dataset.info)
    }
  }
})
