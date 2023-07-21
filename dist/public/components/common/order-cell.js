// dist/public/components/common/order-cell.js
let app = getApp()
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
    config: {
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    layoutBodyOne: {
      className:'ba_f5 pad_20',
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        wid: 150,
        hei: 150,
      },
      ft:1,
    },
  },
  lifetimes: {
    attached() {
      this.setData({
        url: app.globalData.imgurl
      })
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
    storeInfo() {
      wx.navigateTo({
        url: '/pages/mall/storemall?id=' + this.data.content.storeId,
      })
    },
    goDetail(e){
      if (this.data.config.type == 'mall'){
        wx.navigateTo({
          url: '/pages/mall/orderdetail?id=' + e.currentTarget.dataset.id,
        })
      }
      else if (this.data.config.type == 'mallmanage') {
        wx.navigateTo({
          url: '/pages/mall/manage/orderdetail?id=' + e.currentTarget.dataset.id,
        })
      }
      else if (this.data.config.type == 'assemble') {
        wx.navigateTo({
          url: '/pages/assemble/detail?id=' + e.currentTarget.dataset.id,
        })
      }
    },
    clickBtn(e){
      this.triggerEvent('click', { field: e.currentTarget.dataset.field, orderInfo: this.data.content})
      //console.log(this.data.content, e.currentTarget.dataset.field)
    },
  }
})
