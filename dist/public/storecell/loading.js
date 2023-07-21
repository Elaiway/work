// dist/public/textarea.js
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
      value: '标题'
    },
    tsinfo:{
      type: Object,
      value: {}
    },
    mygd: {
      type: Boolean,
      value: false
    },
    nodata: {
      type: Boolean,
      value: false
    },
    bgColor:{
      type: String,
      value: ''
    }
  },
  data: {
  },
  methods: {
  }
})
