// dist/public/textarea.js
Component({
  externalClasses: ['extra-class'],
  behaviors: ['wx://form-field'],
  options: {
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '相关条款' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    iconColor: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '#1AAD19' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    bgcolor: { 
      type: String, 
      value: ''
    },
    isAgree: {
      type: Boolean,
      value: false
    },
    tkname: {
      type: String,
      value: ''
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    bindAgreeChange: function (e) {
      this.setData({
        isAgree: !!e.detail.value.length
      });
      this.triggerEvent('click',this.data.isAgree)
    }
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
  }
})
