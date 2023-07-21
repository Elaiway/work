// pages/activity/category.js
const app = getApp();
Page({
  data: {
    trees: [{
        title: '全部',
        items: [],
      },
      {
        title: '全部',
        items: [],
      },
      {
        title: '报名中',
        items: [{
            name: '报名中',
            type: 1
          },
          {
            name: '活动未开始',
            type: 2
          },
          {
            name: '活动已结束',
            type: 3
          },
        ],
      },
      {
        title: '默认排序',
        items: [
          // { name: '默认排序', psort: '' },
          {
            name: '最热',
            psort: 'hot'
          },
          {
            name: '最新',
            psort: 'new'
          },
        ]
      }
    ],
    postList: [],
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
      type: 1,
      typeId: '',
      sort: 1,
      zoneId: '',
    },
  },
  //下拉框选择
  selectchange({
    detail
  }) {
    if (detail.type) {
      this.setData({
        'params.type': detail.type,
        // 'params.typeId': '',
      })
    }
    if (detail.id) {
      this.setData({
        'params.typeId': detail.id,
      })
    }
    if (detail.id=='') {
      this.setData({
        'params.typeId': '',
        'params.type': '',
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
  onLoad: function(options) {
    let that = this,
      posttypeone = [{
        id: '',
        name: '全部',
      }]
    app.setNavigationBarColor(this, () => {
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
            'url': app.url.activityCategory,
            'cachetime': '0',
            success: function(res) {
              let ptdata = res.data.data, trees = that.data.trees;
              console.log(res.data.data)
              for (let i = 0; i < ptdata.length; i++) {
                let posttypesonone = [{
                  id: '',
                  name: '全部',
                  pid: ''
                }];
                posttypesonone[0].pid = ptdata[i].id
                if (ptdata[i].id ==options.id){
                  trees[1].title = ptdata[i].name
                }      
              }
              console.log(that.data.trees)
              trees[1].items = posttypeone.concat(ptdata)
              trees[0].items = [{
                name: app.globalData.city.cityName,
                id: '',
                sort: '200'
              }].concat(zone)
              if (zoneInfo) {
                trees[0].title = zoneInfo.name,
                  that.setData({
                    'params.zoneId': zoneInfo.id
                  })
              }
              console.log(options)
              that.setData({
                trees: trees,
              })
              that.selectchange({
                detail: {
                  id: options.id,
                  name: trees[1].title,
                  pid: ''
                }
              })
            },
          })
        }
      })
      // console.log(options)
      // app.setNavigationBarTitle(JSON.parse(options.msg).name)
      app.setNavigationBarTitle('活动分类')
    });
  },
  //分类列表
  postList(e) {
    let that = this,
      params = this.data.params;
    app.api.prequest({
      "url": app.url.activityList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].startTime = app.util.ormatDate(res.data[i].startTime).substring(0, 16)
        res.data[i].createdAt = app.util.settime(res.data[i].createdAt)
        res.data[i].showImgs = app.util.getImgUrl(res.data[i].showImgs)
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
      // console.log(res.data.data)
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
      this.postList()
    }
  }
})