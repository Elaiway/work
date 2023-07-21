// dist/public/cardlist/text-and-image.js
const app = getApp()
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
  lifetimes: {
    attached: function() {
      app.api.prequest({
        'url': app.url.infomation,
        data: {
          page: 1,
          size: 3
        },
      }).then(res => {
        res.data.forEach(item => {
          item.createdAt = app.util.settime(item.createdAt)
          item.media = item.media.length > 10 && JSON.parse(item.media)
        })
        this.setData({
          infoList: res.data,
          url: app.system.url
        })
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
    goodinfo(e) {
      wx.navigateTo({
        url: '/pages/message/info/index?id=' + e.currentTarget.dataset.id,
      })
    },
  }
})