// dist/public/textarea.js
var app = getApp()
Component({
  externalClasses: ['extra-class'],
  options: {
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    color: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    key: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    content: {
      type: Array,
      value: []
    },
    storelist: {
      type: Array,
      value: []
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    siteroot: app.setInfo.siteroot,
  },
  attached: function() {

  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    makephone(e) {
      app.util.makePhoneCall(e.currentTarget.dataset.tel)
      console.log(e)
    },
    storeInfo(e) {
      console.log(e)
      wx.navigateTo({
        url: '/pages/store/storemain/storedetail?id=' + e.currentTarget.dataset.id,
      })
      //this.triggerEvent("storeInfo", e.currentTarget.dataset.id)
    }
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
  }
})