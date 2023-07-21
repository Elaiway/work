// dist/public/components/common/layout-one.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    noPad: {
      type: Boolean,
      value: false,
    },
    isLast: {
      type: Boolean,
      value: false,
    },
    afterLeft: {
      type: Boolean,
      value: false,
    },
    afterRight: {
      type: Boolean,
      value: false,
    },
    className: {
      type: String,
      value: '',
    },
    background: {
      type: String,
      value: '#fff',
    },
    header: {
      type: Object,
      value: null,
    },
    body: {
      type: Object,
      value: null,
    },
    footer: {
      type: Object,
      value: null,
    },
    bodySrc: {
      type: String,
      value: '',
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

  }
})
