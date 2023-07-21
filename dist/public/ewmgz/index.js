// dist/public/textarea.js
var app=getApp();
Component({
  externalClasses: ['extra-class'],
  options: {
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' 
    },
    imgw:{
      type: String,
      value: '220'
    },
    imgh: {
      type: String, 
      value: '220'
    },
    code:{
      type: String,
      value: ''
    }
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
    onTap(e){
      console.log(e, this.data.code)
      wx.previewImage({
        current: this.data.code, 
        urls: [this.data.code],
      })
      this.triggerEvent('imgtab',this.data.code)
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
  }
})
