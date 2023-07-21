// pages/job-hunt/collction.js
const app = getApp();
Page({
  data: {
    params: {
      name: '',
      jobName: '',
    },
  },
  //开始时间
  bindsDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let yearmoth = e.detail.value
    yearmoth = yearmoth.substring(0, 7)
    this.setData({
      'params.startTime': yearmoth,
      // 'params.startTimes': e.detail.value
    })
  },
  //结束时间
  bindeDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let yearmoth = e.detail.value
    yearmoth = yearmoth.substring(0, 7)
    this.setData({
      'params.endTime': yearmoth,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    app.setNavigationBarTitle('经历')
    app.setNavigationBarColor(this);
    console.log(options.id, options.type)
    this.setData({
      jobId: options.id,
      type: options.type,
      // type: JSON.parse(options.info).type
    })
    //求职详情用于渲染招聘编辑页面
    if (options.studyId) {
      console.log(options.studyId, options.info)
      this.setData({
        studyId: options.studyId,
        detailInfo: JSON.parse(options.info),
        type: JSON.parse(options.info).type
      })
      console.log(this.data.type)
      let detailInfo = this.data.detailInfo;
      //渲染基本输入框数据
      for (let k in detailInfo) {
        // console.log(detailInfo[k])
          this.setData({
            [`params.${k}`]: detailInfo[k],
          })
        }
    }
  },
  //校验表单
  formSubmit: function (e) {
    let that = this,
      co = this.data,
      v = e.detail.value,
      params = {
        jobId: co.jobId,
        name: v.name, //学校名称
        jobName: v.jobName, //专业名称
        startTime: Math.round(new Date(co.params.startTime).getTime() / 1000).toString(),
        endTime: Math.round(new Date(co.params.endTime).getTime() / 1000).toString(),
        type:co.type=='1'?'1':'2',
        id: co.studyId ? co.studyId : '',
      }
    console.log('form发生了submit事件，携带数据为：', co, v, params)
    //return
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['id'].concat(co.filterArr),
      tips: {
        name: '请输入学校名称',
        jobName: '请输入专业名称',
        startTime: '请选择开始时间',
        endTime: '请选择结束时间',
      }
    })
    console.log(judgeData)
    //校验表单
    let warn = "",
      flag = true;
    if (!judgeData) {
      return
    } else if (co.params.endTime <= co.params.startTime) {
      warn = "结束时间不能小于等于开始时间";
    } else {
      flag = false;
      console.log("表单校验完成")
      //return
      app.util.getShowloading('提交中')
      that.setData({
        loading: true,
      })
      //return
      app.api.prequest({
        'url': app.url.jobSaveExperience,
        'method': 'POST',
        data: params,
      }).then(res => {
        if (res.code == '1') {
          app.util.getShowtoast('操作成功')
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/jobhunt/detailjob?jid=' + this.data.jobId,
            })
          }, 1000)
        } else {
          app.util.getShowtoast(res.msg, 1000, 1)
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/jobhunt/detailjob?jid=' + this.data.jobId,
            })
          }, 1000)
          that.setData({
            loading: false
          })
        }
        console.log('add', res.data)
      })
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onPullDownRefresh: function () {

  },
  onShareAppMessage: function () {

  }
})