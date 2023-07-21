// dist/public/auxiliary/mall/mall-cell.js
let app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: Object,
      value: {}
    },
    color: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: '1'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    layoutBodyOne: {
      hd: 1,
      bd: { styleName: 'padding:10rpx 20rpx 10rpx 0'},
      img: {
        brs:'br-r-0',
        wid: 220,
        hei: 220,
      },
    },
    layoutBodyOne2: {
      hd: 1,
      bd: { styleName: '' },
      img: {
        brs: 'br-r-5',
        wid: 200,
        hei: 200,
      },
    },
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goodinfo(e){
      app.util.goUrl({
        param: this.data.content.id,
        value: "mallDetail"
      })
    },
  }
})
