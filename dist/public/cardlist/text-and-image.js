// dist/public/cardlist/text-and-image.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: { 
      type: Object,
      value: {}
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
    jumps: function (e) {
      let entry = e.currentTarget.dataset.entry
      console.log(entry)
      app.util.goUrl(entry)
    },
  }
})
