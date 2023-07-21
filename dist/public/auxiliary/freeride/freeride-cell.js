// dist/public/auxiliary/freeride/freeride-good.js
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
    color: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: '',
    },
    pageType: {
      type: String,
      value: ''
    },
    // key: {
    //   type: String,
    //   value: '',
    //   observer(newVal, oldVal, changedPath) {
    //     console.log('key', newVal)
    //   }
    // },
  },
  // lifetimes: {
  //   attached: function () {
  //     this.setData({
  //       color: app.globalData.color
  //     })
  //   }
  // },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // goDetail(e) {
    //   this.triggerEvent("detailPage", e.currentTarget.dataset.tid)
    //   console.log(e.currentTarget.dataset)
    // },
    goDetail(e) {
      if (this.data.pageType != 'myrelease'){
        wx.navigateTo({
          url: '/pages/freeride/detail?tid=' + e.currentTarget.dataset.tid,
        })
      }
      console.log(e.currentTarget.dataset.tid)
    },
    goEdit(e) {
      this.triggerEvent("editRele", e.currentTarget.dataset.msg)
      console.log(e.currentTarget.dataset.msg)
    },
    onCancelColl(e) {
      this.triggerEvent("cancelColl", e.currentTarget.dataset.cid)
      console.log(e.currentTarget.dataset.cid)
    }
  }
})