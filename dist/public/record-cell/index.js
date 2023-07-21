// dist/public/recordcell/index.js
// let app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    color: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    key: {
      type: String, 
      value: '',
      observer(newVal, oldVal, changedPath) {
        console.log('key',newVal)
      }
    },
    content: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changedPath) {
        let tel = getApp().com.hideTel(newVal.tel)
        this.setData({
          tel,
        })
        // console.log('content', newVal)
      }
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    tel:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    Info(e) {
      wx.navigateTo({
        url: '/pages/yellow/detail?id=' + this.data.content.id,
      })
      console.log(e)
    },
    cancelColl(){
      this.triggerEvent("cancelEvent",this.data.content.id)
    },
    operation(e) {
      this.triggerEvent("operation", { content: this.data.content, field:e.currentTarget.dataset.name})
    },
  }
})
