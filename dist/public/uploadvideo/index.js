// dist/public/textarea.js
Component({
  externalClasses: ['extra-class'],
  options: {
    // addGlobalClass: true
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    time: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 10 // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    tipstext: {
      type: String,
      value: '视频时长不超过60秒',
    },
    src: {
      type: String,
      value: '',
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
    chooseImage: function (e) {
      var that = this;
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: that.data.time,
        camera: 'back',
        success(res) {
          console.log(res,res.tempFilePath)
          that.setData({
            src: res.tempFilePath,
          })
          that.triggerEvent('change', res)
        }
      })
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
  }
})
