// pages/yellow-page/gategorylist.js
var app = getApp();
Page({
  data: {
    postList: [],
    trees: [
      {
        title: '默认排行',
        items: [
          { name: '默认排行', psort: '' },
          { name: '最热', psort: 'hot' },
          { name: '最新', psort: 'new' },
          { name: '最近', psort: 'nearest' },
        ]
      },
      {
        title: '全部行业',
        items: [],
      },
      {
        title: '所有区域',
        items: [],
      }
    ],
    params:{
      page:1,
      size:10,
      lat:'',
      lng: '',
      typePid: '',
      typeId: '',
      sort: '',
      zoneId:'',
    }
  },
  selectchange({ detail }){
    if(detail.son){
       this.setData({
         'params.typePid':detail.id,
         'params.typeId':'',
       })
    }
    else if (detail.pid){
      this.setData({
        'params.typePid': detail.pid,
        'params.typeId': detail.id,
      })
    }
    else if (detail.psort){
      this.setData({
        'params.sort': detail.psort,
      })
    }
    else if (detail.sort) {
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
    // console.log('detail', detail,this.data.params)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this,
      posttypeone = [{
        id: '',
        name: '全部',
        son: [],
      }],
      typeinfo, param = options.id.split(',');
    app.setNavigationBarColor(this);
    app.util.getLocation({
      type: "0",
      success: res => {
        console.log(res)
        wx.setStorageSync('location', res)
        that.setData({
          'params.lat': res.latitude,
          'params.lng': res.longitude,
        })
        app.api.request({
          url: app.url.getZone,
          success: res => {
            console.log(res)
            let zone = res.data.zone,zoneInfo;
            if (app.globalData.city.zoneId != '0') {
              for (let i = 0; i < zone.length; i++) {
                if (app.globalData.city.zoneId == zone[i].id) {
                  zoneInfo = zone[i]
                }
              }
            }
            app.api.request({
              'url': app.url.category,
              'cachetime': '0',
              data: {
                type: '8'
              },
              success: function (res) {
                let ptdata = res.data.data,
                  lindex, rindex = 0;
                if (param.length == 1) {
                  for (let i = 0; i < ptdata.length; i++) {
                    if (ptdata[i].id == param[0]) {
                      typeinfo = ptdata[i]
                      lindex = Number(i)
                      app.setNavigationBarTitle(typeinfo.name)
                    }
                    let posttypesonone = [{
                      id: '',
                      name: '全部',
                      pid: ''
                    }];
                    posttypesonone[0].pid = ptdata[i].id
                    ptdata[i].son = posttypesonone.concat(ptdata[i].son)
                  }
                } else {
                  for (let i = 0; i < ptdata.length; i++) {
                    let posttypesonone = [{
                      id: '',
                      name: '全部',
                      pid: ''
                    }];
                    posttypesonone[0].pid = ptdata[i].id
                    ptdata[i].son = posttypesonone.concat(ptdata[i].son)
                    for (let j = 0, k = ptdata[i].son.length; j < k; j++) {
                      if (ptdata[i].son[j].id == param[1]) {
                        typeinfo = ptdata[i].son[j]
                        app.setNavigationBarTitle(typeinfo.name)
                        lindex = Number(i)
                        rindex = Number(j)
                      }
                    }
                  }
                }
                let trees=that.data.trees;
                trees[1].items = posttypeone.concat(ptdata)
                trees[1].title = typeinfo.name
                trees[2].items = [{ name: app.globalData.city.cityName, id: '',sort:'200' }].concat(zone)
                if (zoneInfo){
                  trees[2].title =zoneInfo.name,
                  that.setData({
                    'params.zoneId':zoneInfo.id
                  })
                }
                // console.log(options, res, zone, posttypeone.concat(ptdata), lindex + 1, rindex, trees)
                // return
                that.setData({
                  trees: trees,
                })
                that.selectchange({detail:typeinfo})
              },
            })
          }
        })
      }
    })
  },
  // 获取信息列表信息
  getPostlist(e) {
    var that = this,params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.url.yellowList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].logo = app.util.getImgUrl(res.data[i].logo)
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
        var postList = that.data.postList
        postList = postList.concat(res.data)
        that.setData({
          postList: postList,
          isget: true,
        })
      // console.log('列表信息', res)
      })
  },
  onReachBottom: function () {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  },
})