// dist/public/components/form/dd-radio.js
const app=getApp()
Component({
  behaviors: ['wx://form-field'],
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:''
    },
    radioarr:{
      type:Array,
      value:[]
    },
  },
  lifetimes: {
    attached: function () {
      this.setData({
        color: app.globalData.color
      })
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
    radiochange(e){
      this.triggerEvent('change', e.detail)
      console.log('radio发生change事件，携带value值为：', e.detail)
    },
  }
})
