// pages/job-hunt/gategorylist.js
const app = getApp();
Page({
  data: {
    trees: [
      {
        title: '全部',
        items: [],
      },
      {
        title: '全部',
        items: [],
      },
      {
        title: '默认排序',
        items: [
          { name: '默认排序', psort: '' },
          { name: '最热', psort: 'hot' },
          { name: '最新', psort: 'new' },
        ]
      }
    ],
    jobList: [],
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
      typePid: '',
      typeId: '',
      sort: '',
      zoneId: '',
      industryId: '',
      positionId: '',
    },
  },
  selectchange({ detail }) {
    if (detail.son) {
      if (this.data.type=='2'){
        this.setData({
          'params.typePid': detail.id,
          'params.typeId': '',
        })
      }
      else if (this.data.type == '1'){
        this.setData({
          'params.industryId': detail.id,
          'params.positionId': '',
        })
      }
    }
    else if (detail.pid) {
      if (this.data.type == '2'){
        this.setData({
          'params.typePid': detail.pid,
          'params.typeId': detail.id,
        })
      }
      if (this.data.type == '1') {
        this.setData({
          'params.industryId': detail.pid,
          'params.positionId': detail.id,
        })
      }
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
      jobList: [],
      'params.page': 1,
      mygd: false,
      isget: false,
    })
    this.jobList()
    console.log('detail', detail,this.data.params)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this,
    posttypeone = [{
      id: '',
      name: '全部',
      son: [],
    }]
    app.setNavigationBarColor(this, () => {
      app.api.request({
        url: app.url.getZone,
        success: res => {
          console.log(res)
          let zone = res.data.zone, zoneInfo;
          if (app.globalData.city.zoneId != '0') {
            for (let i = 0; i < zone.length; i++) {
              if (app.globalData.city.zoneId == zone[i].id) {
                zoneInfo = zone[i]
              }
            }
          }
          app.api.request({
            'url': app.url.jobPosition,
            'cachetime': '0',
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
              trees[0].items = [{ name: app.globalData.city.cityName, id: '', sort: '200' }].concat(zone)
              if (zoneInfo) {
                trees[0].title = zoneInfo.name,
                  that.setData({
                    'params.zoneId': zoneInfo.id
                  })
              }
              // console.log(options, param)
              that.setData({
                trees: trees,
              })
              that.selectchange({
                detail: {
                  id: '',
                  name: '全部',
                  pid: ''
                }
              })
            },
          })
        }
      })
      that.setData({
        type: JSON.parse(options.msg).identifying
      })
      console.log(options)
      app.setNavigationBarTitle(JSON.parse(options.msg).name)
    });
  },
  //招聘、工作列表
  jobList(e) {
    let that = this,
      params = this.data.params,
      rqquesturl;
    if (this.data.type == "2") {
      rqquesturl = app.url.jobList
    } else if (this.data.type == "1") {
      rqquesturl = app.url.jobRecruitList
    }
    app.api.prequest({
      "url": rqquesturl,
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
      let jobList = that.data.jobList
      jobList = jobList.concat(res.data)
      that.setData({
        jobList,
        isget: true,
      })
      // console.log(res.data)
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
      this.jobList()
    }
  },
  onShareAppMessage: function() {

  }
})