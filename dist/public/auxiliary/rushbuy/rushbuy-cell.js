// dist/public/auxiliary/rushbuy/rushbuy-cell.js
var app = getApp(),
  dsq;
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
    time: {
      type: Array,
      value: []
    },
  },
  /**
   * 组件的初始数据
   */
  data: {},
  attached() {
    // 在组件实例进入页面节点树时执行
    let timeStamp = parseInt(this.data.content.endTime || 0) - parseInt(new Date().getTime() / 1000);
    this.setData({
      endTime: app.com.countDownTime(timeStamp)
    })
    dsq = setInterval(() => {
      timeStamp -= 1
      if (timeStamp <= 0) clearInterval(dsq)
      this.setData({
        endTime: app.com.countDownTime(timeStamp)
      })
      // console.log('倒计时', this.data.endTime)
    }, 1000)
    //已抢百分比
    let robbed = parseInt(this.data.content.salesNum / (parseInt(this.data.content.num) + parseInt(this.data.content.salesNum)) * 100)
    this.setData({
      robbed,
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goodinfo() {
      wx.navigateTo({
        url: '/pages/rushbuy/detail?id=' + this.data.content.id,
      })
    },
  }
})