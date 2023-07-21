// dist/public/auxiliary/jobhunt/job-hunt.js
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
    pageType: {
      type: String,
      value: ''
    },
    jobType: {
      type: String,
      value: '',
    },
    color: {
      type: String,
      value: ''
    },
    button:{
      type: String,
      value: ''
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
    recruitInfo(e){
      wx.navigateTo({
        url: '/pages/jobhunt/detailhunt?rid='+e.currentTarget.dataset.rid,
      })
      console.log(e.currentTarget.dataset.rid)
    },
    jobInfo(e){
      wx.navigateTo({
        url: '/pages/jobhunt/detailjob?jid='+e.currentTarget.dataset.jid,
      })
      console.log(e.currentTarget.dataset.jid)
    },
    //点击取消收藏
    jobcancelColl(e){
      this.triggerEvent("cancelcoll", e.currentTarget.dataset.cid)
      console.log(e.currentTarget.dataset.cid)
    },
    //点击收到的简历
    getresume(e) {
      this.triggerEvent("getresume", e.currentTarget.dataset.eid)
      console.log(e.currentTarget.dataset.eid)
    },
    //点击操作编辑
    operation(e){
      this.triggerEvent("operation", { info: e.currentTarget.dataset.info, type: this.data.jobType})
      console.log(e.currentTarget.dataset.info)
    },
  }
})
