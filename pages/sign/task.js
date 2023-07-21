// pages/sign/task.js
var app = getApp();
Page({
  data: {
    typeArr: [{
        title: "今日任务",
        arr: [],
      },
      {
        title: "必备任务",
        arr: [],
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('onLoad')
    app.setNavigationBarColor(this);
    app.setNavigationBarTitle("任务中心")
  },
  //任务进度点击按钮
  btnGo(e) {
    if (e.currentTarget.dataset.item.complete == 1) {
      wx.showToast({
        title: '任务已完成',
      })
      return
    }
    console.log(e.currentTarget.dataset.item)
    let type = e.currentTarget.dataset.item.id,
      url;
    switch (type) {
      case "browser":
      case "love":
      case "comment":
        url = '/pages/publish/post/index';
        break;
      case "collection":
        url = '/pages/store/storemain/storemain';
        break;
      case "posting":
        url = '/pages/publishtype/publishtype';
        break;
      case "userAuthentication":
      case "userBond":
        url = '/pages/personal/testcenter/index';
        break;
      case "businessBond":
      case "authentication":
        url = '/pages/personal/index';
        break;
      case "businessJoin":
        url = '/pages/store/storeentry/storeentry';
        break;
    }
    wx.navigateTo({
      url,
    })
  },
  //去签到
  goSignin(e) {
    wx.navigateTo({
      url: '/pages/personal/index'
    })
  },
  onShow: function() {
    let that = this,
      totalScore = 0;
    app.api.prequest({
      'url': app.url.task,
      data: {}
    }).then(res => {
      console.log(res)
      var taskList = res.data.data,
        typeArr = this.data.typeArr;
      let day = [],
        one = [];
      taskList.forEach(item => {
        // if(item.complete==1){
        //   totalScore += +item.score
        // }
        if (item.type == 'day') {
          day.push(item)
        } else {
          one.push(item)
        }
      })
      typeArr[0].arr = day
      typeArr[1].arr = one
      that.setData({
        typeArr: typeArr,
        // totalScore,
      })
      console.log(taskList, day, one)
    })
    this.getmyToady()
    console.log('onShow')
  },
  //今日已得积分
  getmyToady(e) {
    let that = this,
      totalScore = 0;
    app.api.prequest({
      'url': app.url.myToady
    }).then(res => {
      that.setData({
        totalScore: res.data || 0,
      })
    })
  },
  //跳转积分记录
  changeintegral(e) {
    wx.navigateTo({
      url: '/pages/personal/integral/index',
    })
  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  }
})