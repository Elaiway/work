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
    placeholder: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '请输入内容' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    value: {
      type: String,
      value: ''
    },
    maxlength: {
      type: Number,
      value: 100
    },
    showMax: {
      type: Boolean,
      value: true
    },
    height: {
      type: String,
      value: '7.5'
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    textlength:0,
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    bindblur:function(e){
      console.log(e.detail.value)
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    bindinput: function (e) {
      console.log(e.detail.value)
      if(e.detail.value.length>this.data.maxlength){
        console.log('超出文本')
        return
      }
      // this.setData({
      //   textlength: Number(e.detail.value.length),
      // })
      this.triggerEvent('textblur', e.detail.value);
    },
  }
})
