// pages/mall/order.js
var app = getApp();
Page({
  data: {
    postList: [],
    params: {
      page: 1,
      size: 10,
      typePid: '',
      typeId: '',
      word: '',
    },
    nav: [{
      name: '人气',
      icon: ''
    }, {
      name: '销量',
      icon: ''
    }, {
      name: '价格',
      img: '/assets/images/img/sort.png',
      sort: 1
    }, ],
  },
  onLoad: function(options) {
    var that = this;
    console.log(JSON.parse(options.param))
    app.setNavigationBarTitle(JSON.parse(options.param).name)
    app.setNavigationBarColor(this);
    this.setData({
      'params.typePid': JSON.parse(options.param).pid,
      'params.typeId': JSON.parse(options.param).id,
    })
    app.api.prequest({
      'url': app.url.yellowConfig,
    }).then(res => {
      that.setData({
        yellowConfig: res.data,
      })
    })
    this.getPostlist()
  },
  selectchange(e){
    let type;
    switch (e.detail.name) {
      case '人气':
        type = "hot";
        break;
      case "销量":
        type = "salesNum";
        break;
      case "价格":
        type = "price";
        break;
    } 
    this.setData({
      'params.type': type,
    })
    this.setData({
      postList: [],
      'params.page': 1,
    })
    this.getPostlist()
    console.log(e.detail)
  },
  // 获取信息列表信息
  getPostlist(e) {
    var that = this,
      params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.urlTwo.groupGroupList,
      data: params,
    }).then(res => {
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      res.data.forEach(item => {
        item.showImgs = app.util.getImgUrl(item.showImgs)
        item.label = app.com.objToArr(item.label)
      })
      var postList = that.data.postList
      postList = postList.concat(res.data)
      that.setData({
        postList: postList,
        isget: true,
      })
    })
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  },
  onShareAppMessage: function() {

  }
})