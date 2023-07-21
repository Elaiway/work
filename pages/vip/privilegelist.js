// pages/yellow-page/gategorylist.js
var app = getApp();
Page({
  data: {
    postList: [],
    trees: [{
        title: '所有区域',
        items: [],
      },
      {
        title: '全部行业',
        items: [],
      },
      {
        title: '默认排行',
        items: [{
            name: '默认排序',
            psort: ''
          },
          {
            name: '距离最近',
            psort: 'nearest'
          },
          {
            name: '最热',
            psort: 'hot'
          },
          {
            name: '最新',
            psort: 'new'
          },
        ]
      },
    ],
    params: {
      page: 1,
      size: 10,
      lat: '',
      lng: '',
      typePid: '',
      typeId: '',
      sort: '',
      zoneId: '',
    }
  },
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
    if (detail.hasOwnProperty('psort')) {
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
    this.getPostlist()
    console.log('detail', detail, this.data.params)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this,
      posttypeone = [{
        id: '',
        name: '全部',
        son: [],
      }],
      typeinfo;
    app.setNavigationBarColor(this);
    app.setNavigationBarTitle('全部特权')
    app.util.getLocation({
      type: "0",
      success: res => {
        console.log(res)
        wx.setStorageSync('location', res)
        that.setData({
          'params.lat': res.latitude,
          'params.lng': res.longitude,
        })
        app.api.prequest({
          url: app.url.getZone,
        }).then(res => {
          console.log(res)
          let zone = res.zone,
            zoneInfo;
          if (app.globalData.city.zoneId != '0') {
            for (let i = 0; i < zone.length; i++) {
              if (app.globalData.city.zoneId == zone[i].id) {
                zoneInfo = zone[i]
              }
            }
          }
          app.api.prequest({
            'url': app.url.category,
            'cachetime': '0',
            data: {
              type: '2'
            },
          }).then((res) => {
            let ptdata = res.data;
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
            trees[1].items = posttypeone.concat(ptdata)
            if (typeinfo) {
              trees[1].title = typeinfo.name
            }
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
            // console.log(options, res, zone, posttypeone.concat(ptdata), trees)
            that.setData({
              trees: trees,
            })
            that.getPostlist()
            // that.selectchange({
            //   detail: typeinfo
            // })
          })
        })
      }
    })
  },
  // 获取信息列表信息
  getPostlist(e) {
    var that = this,
      params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.urlTwo.vipPrivilegeList,
      data: params,
    }).then(res => {
      res.data.forEach(item => {
        item.logo = app.util.getSingleImgUrl(item.logo)
      })
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      var postList = that.data.postList.concat(res.data)
      that.setData({
        postList: postList,
        isget: true,
      })
      // console.log('列表信息', res)
    })
  },
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  },
})