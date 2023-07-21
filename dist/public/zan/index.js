
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
  watch:{
    content(){
      console.log(this.content,2222)
    }
    
  },
  
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
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: [] // 属性初始值（可选），如果未指定则会根据类型选择一个
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
    src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg'
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
    message_info(e){
      console.log(e)
      wx.navigateTo({
        url: '/pages/zan/index/index?postId='+e.currentTarget.dataset.postid,
      })
    },
    toBillboard(e){
      wx.navigateTo({
        url: '/pages/zan/billboard/index?postId='+e.currentTarget.dataset.postid,
      })
    },
    //
  toMarket(e){
    wx.navigateTo({
      url: '/pages/store/storemain/storedetail?id=' + e.currentTarget.dataset.storeId
    })
  },
    
  }
})