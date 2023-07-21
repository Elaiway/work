// pages/businesscard/index.js
const app = getApp();
Page({
  data: {
    postList: [],
    mygd: false,
    isget: false,
    trees: [{
        title: '排行榜',
        items: [{
            name: '人气榜',
            psort: 'hot'
          },
          {
            name: '最新',
            psort: 'new'
          },
          {
            name: '点赞榜',
            psort: 'love'
          },
          {
            name: '最多收藏',
            psort: 'follow'
          },
          {
            name: '附近的人',
            psort: 'nearest'
          },
        ],
      },
      {
        title: '全部行业',
        items: [],
      },
      {
        title: '所有区域',
        items: []
      }
    ],
    params: {
      page: 1,
      size: 10,
      typePid: '',
      typeId: '',
      sort: '',
      zoneId: '',
      lat: '',
      lng: '',
    },
  },
  //点击下拉框
  selectchange({
    detail
  }) {
    if (detail.son) {
      this.setData({
        'params.typePid': detail.id,
        'params.typeId': '',
      })
    } else if (detail.pid) {
      this.setData({
        'params.typePid': detail.pid,
        'params.typeId': detail.id,
      })
    }
    if (detail.psort) {
      this.setData({
        'params.sort': detail.psort,
      })
    }
    if (detail.sort) {
      this.setData({
        'params.zoneId': detail.id,
      })
    }
    this.setData({
      postList: [],
      'params.page': 1,
      mygd: false,
      isget: false,
    })
    this.postList()
    // console.log('detail', detail, this.data.params)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this,
      posttypeone = [{
        id: '',
        name: '全部',
        son: [],
      }]
    app.api.businesscard(res => {
      app.setNavigationBarTitle(res.field)
      that.setData({
        businesscard: res,
      })
      console.log(res)
    })
    app.setNavigationBarColor(this,() =>{
      // that.indexAdlist()
      // that.postList()
      // that.mycardList()
      app.isLocation(function() {
        app.util.getLocation({
          type: "0",
          success: res => {
            console.log(res)
            that.indexAdlist()
            that.announceList()
            that.postList()
            that.mycardList()
            wx.setStorageSync('location', res)
            that.setData({
              'params.lat': res.latitude,
              'params.lng': res.longitude,
            })
            app.api.request({
              url: app.url.getZone,
              success: res => {
                console.log(res)
                let zone = res.data.zone,
                  zoneInfo;
                if (app.globalData.city.zoneId != '0') {
                  for (let i = 0; i < zone.length; i++) {
                    if (app.globalData.city.zoneId == zone[i].id) {
                      zoneInfo = zone[i]
                    }
                  }
                }
                app.api.request({
                  'url': app.url.categoryFull,
                  'cachetime': '0',
                  data: {
                    term: 13,
                  },
                  success: function (res) {
                    let ptdata = res.data.data
                    console.log(res.data.data)
                    for (let i = 0; i < ptdata.length; i++) {
                      let posttypesonone = [{
                        id: '',
                        name: '全部',
                        pid: ''
                      }];
                      posttypesonone[0].pid = ptdata[i].id
                      ptdata[i].son = posttypesonone.concat(ptdata[i].son)
                    }
                    let trees = that.data.trees;
                    console.log(that.data.trees)
                    trees[1].items = posttypeone.concat(ptdata)
                    trees[2].items = [{
                      name: app.globalData.city.cityName,
                      id: '',
                      sort: '200'
                    }].concat(zone)
                    if (zoneInfo) {
                      trees[2].title = zoneInfo.name,
                        that.setData({
                          'params.zoneId': zoneInfo.id
                        })
                    }
                    // console.log(options, param)
                    that.setData({
                      trees: trees,
                    })
                    // that.selectchange({
                    //   detail: {
                    //     id: '',
                    //     name: '全部',
                    //     pid: ''
                    //   }
                    // })
                  },
                })
              }
            })
          }
        })
      })
    });
   
  },
  // 获取信息首页广告位
  indexAdlist(e) {
    let that = this
    app.api.prequest({
      url: app.url.adList,
      data: {
        type: 13,
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
    let that = this
    that.setData({
      Headline: {
        notice: {
          color: '#666'
        },
        leftvalue: "名片头条",
        bordercolor: "#f9f9f9",
        color: that.data.color,
      },
    })
  },
  //活动列表
  postList(e) {
    let that = this,
      params = this.data.params;
    app.api.prequest({
      "url": app.url.businesscardList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        // console.log(res.data[i].logo)
        res.data[i].logo = app.util.getSingleImgUrl(res.data[i].logo[0].url)
        if (res.data[i].followNum == null) {
          res.data[i].followNum = 0
        }
        if (res.data[i].viewNum == null) {
          res.data[i].viewNum = 0
        }
        if (res.data[i].shareNum == null) {
          res.data[i].shareNum = 0
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
      let postList = that.data.postList
      postList = postList.concat(res.data)
      that.setData({
        postList,
        isget: true,
      })
      console.log(res.data)
    })
  },
  //我的名片列表
  mycardList() {
    let that = this
    app.api.prequest({
      "url": app.url.businesscardMyList,
      data: {
        page: 1,
        size: 10,
      },
    }).then(res => {
      let mycardList = res.data
      that.setData({
        mycardList,
      })
      console.log(res.data)
    })
  },
  //创建名片
  oncreatcard(e) {
    wx.navigateTo({
      url: '/pages/businesscard/release',
    })
  },
  //名片详情
  cardInfo(e) {
    wx.navigateTo({
      url: '/pages/businesscard/carddetail?id=' + e.currentTarget.dataset.id,
    })
    console.log(e.currentTarget.dataset.id)
  },
  //拨打电话
  callup(e) {
    let isTel = e.currentTarget.dataset.msg.isTel,
      tel = e.currentTarget.dataset.msg.tel
    if (isTel=="2"){
      tel = app.com.hideTel(tel)
      app.util.makePhoneCall(tel)
    }
    else{
      app.util.makePhoneCall(tel)
    }
  },
  onShow() {},
  onHide() {},
  onPullDownRefresh() {},
  onReachBottom() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.postList()
    }
  },
  onShareAppMessage() {}
})