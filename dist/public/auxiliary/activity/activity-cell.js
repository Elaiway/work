// dist/public/auxiliary/activity/activity-cell.js
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
    activityInfo(e) {
      wx.navigateTo({
        url: '/pages/activity/detail?id=' + e.currentTarget.dataset.id,
      })
      //console.log(e.currentTarget.dataset.id)
    },
  }
})
