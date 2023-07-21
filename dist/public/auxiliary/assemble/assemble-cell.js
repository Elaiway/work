// dist/public/auxiliary/privilege/privilege-cell.js
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
      bd: {
        styleName: 'padding:0rpx 20rpx 10rpx 0'
      },
      img: {
        brs: 'br-r-10',
        wid: 170,
        hei: 170,
      },
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goodinfo(){
      wx.navigateTo({
        url: '/pages/assemble/detail?id='+this.data.content.id,
      })
    },
  }
})
