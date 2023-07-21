var app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    content: { // 是否采用衔接滑动
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {}, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    color: {
      type: String,
      value: '#f44444'
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
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    jump(e) {
      let idx = e.currentTarget.dataset.idx,
        item = this.data.content.swiper.children[idx]
      //console.log(idx, item)
      if (item.entry) {
        app.util.goUrl(item.entry)
      } else if (item.mini) {
        switch (item.mini.type) {
          case 'webUrl':
            wx.setStorageSync('vr', item.mini.url)
            wx.navigateTo({
              url: '/pages/extra/link',
            })
            break;
          case 'miniUrl':
            wx.navigateTo({
              url: item.mini.url,
            })
            break;
        }
      }
    }
  }
})