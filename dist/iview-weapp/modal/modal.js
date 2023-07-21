// dist/iview-weapp/modal/modal.js
Component({
  externalClasses: ['extra-class'],
  options: {
    // multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    mdoaltoggle:{
      type: Boolean,
      value: false
    },
    mdoalclose: {
      type: String,
      value: ''
    },
    width: {
      type: String,
      value: '70%'
    },
    ismr: {
      type: Boolean,
      value: false
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
    mdoalclose() {
      this.setData({
        mdoaltoggle:false,
      })
      this.triggerEvent('hide');
    },
  }
})
