// pages/job-hunt/index.js
const app = getApp();
Page({
  data: {
    Search: {
      "position": 0,
      "shape": 3,
      "height": 55,
      "borderStyle": 0,
      "fontStyle": "center",
      "recommendSearch": 1,
      "searchBoxList": [],
      "keyWords": "搜索"
    },
    notice: {
      "infoList": ["浏览", "发布"],
    },
    tabs: [],
    jobList: [],
    mygd: false,
    isget: false,
    key: '0',
    params: {
      page: 1,
      size: 10,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.api.jobhunt(res => {
      app.setNavigationBarTitle(res.field)
      res.sort.forEach((item, index) => {
        item.id = index
      })
      that.setData({
        jobSet: res,
        tabs: res.sort && res.sort.length > 0 ? res.sort : [{
          name: '最新招聘',
          id: 0,
          value: 'newRecruit'
        }, {
          name: '最新求职',
          id: 1,
          value: 'newJob'
        }],
      })
      that.onTabsChange({
        detail: {
          key: 0
        }
      })
    })
    app.setNavigationBarColor(this, () => {
      app.isLocation(() => {
        app.util.getLocation({
          type: "0",
          success: res => {
            console.log(res)
          }
        })
        this.indexAdlist()
        this.announceList()
        this.getPostnav()
        console.log("getlocation")
      })
    });
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail

    this.setData({
      key,
      jobList: [],
      'params.page': 1,
      mygd: false,
      isget: false,
      jobtype: this.data.tabs[key].value == 'newRecruit' ? 1 : 2
    })
    this.jobList()
    console.log(key)
  },
  // 获取信息首页广告位
  indexAdlist(e) {
    let that = this
    app.api.prequest({
      url: app.url.adList,
      data: {
        type: 9,
        adType: 1,
      },
    }).then(res => {
      console.log('首页轮播图为', res)
      let imgs = res.data
      if (imgs.length > 0) {
        imgs.forEach(item => {
          item.type = 0
          item.url = that.data.url + item.url
        })
        that.setData({
          Swiper: {
            "padding": 0,
            "height": app.system.slideNum,
            "maxLimit": 300,
            "minLimit": 100,
            "swiper": {
              "children": imgs
            }
          }
        })
      }
    })
  },
  // 获取首页公告
  announceList(e) {
    var that = this
    that.setData({
      Headline: {
        notice: {
          color: '#666'
        },
        isButton: false,
        leftvalue: "招聘头条",
        brs: 0,
        bordercolor: "#f9f9f9",
        color: that.data.color,
      },
    })
  },
  //获取分类信息
  getPostnav(e) {
    let that = this;
    app.api.prequest({
      "url": app.url.jobCategory
    }).then(res => {
      let jobCategory = res.data
      that.setData({
        jobCategory,
      })
      console.log(res.data)
    })
  },
  //招聘、工作列表
  jobList(e) {
    let that = this,
      params = this.data.params,
      activevalue = this.data.tabs[this.data.key].value;
    console.log(activevalue)
    app.api.prequest({
      "url": activevalue == 'newRecruit' ? app.url.jobRecruitList : app.url.jobList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].createdAt = app.util.ormatDate(res.data[i].createdAt).substring(5, 10)
        res.data[i].logo = app.util.getSingleImgUrl(res.data[i].logo)
        res.data[i].label = JSON.parse(res.data[i].label)
        res.data[i].labelarr = []
        for (let j in res.data[i].label) {
          res.data[i].labelarr.push(res.data[i].label[j])
        }
      }
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      // let jobList = res.data
      let jobList = that.data.jobList
      jobList = jobList.concat(res.data)
      that.setData({
        jobList,
        isget: true,
      })
      // console.log(res.data)
    })
  },
  //分类详情
  gategorylist(e) {
    wx.navigateTo({
      url: '/pages/jobhunt/gategorylist?msg=' + JSON.stringify(e.currentTarget.dataset.msg)
    })
    console.log(e.currentTarget.dataset.msg)
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
      this.jobList()
    }
  },
  onShareAppMessage: function() {

  }
})