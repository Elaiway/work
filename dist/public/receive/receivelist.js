// dist/public/receive/receivelist.js
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
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
      },
      imgsrc: {
          type: String,
          value: ''
      },
    content:{
        type:Object,
        value:{}
    },
    receivelist: {
      type: Object,
      value: {
        arr: [{
          name: '小朱',
          money: '0.80',
          url: 'http://img2.imgtn.bdimg.com/it/u=1742857994,844187268&fm=26&gp=0.jpg'
        }, {
            name: '小朱小朱小朱小朱小朱小朱小朱小朱小朱小朱小朱小朱小朱小朱',
          money: '0.80',
          url: 'http://img1.imgtn.bdimg.com/it/u=1880698741,2631508258&fm=26&gp=0.jpg'
        }, {
          name: '小明',
          money: '0.80',
          url: 'http://img2.imgtn.bdimg.com/it/u=2574644286,549256874&fm=26&gp=0.jpg'
        }, {
          name: '小红',
          money: '0.80',
          url: 'http://img3.imgtn.bdimg.com/it/u=2927631389,3255505316&fm=26&gp=0.jpg'
        }]
      }
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {},
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
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
  }
})