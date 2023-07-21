const app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    content: {
      type: Object,
      value: {},
    },
  },
  lifetimes: {
    attached: function() {
      app.api.prequest({
        'url': app.urlTwo.groupGroupList,
        data: {
          page: 1,
          size: 10,
          type: 2,
        },
      }).then(res => {
        res.data.forEach(item => {
          item.showImgs = app.util.getImgUrl(item.showImgs)
        })
        this.setData({
          goodsList: res.data,
        })
      })
    }
  },
  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {

  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    goodinfo(e) {
      wx.navigateTo({
        url: '/pages/assemble/detail?id=' + e.currentTarget.dataset.id,
      })
    },
  }
})