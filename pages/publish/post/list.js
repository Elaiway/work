// pages/post/list.js
var app = getApp();
Page({
  data: {
    displaycity: 0,
    page: 1,
    postList: [],
    city: "区域",
    onetype: "",
    model: "默认排序",
    qyopen: false,
    nzopen: false,
    pxopen: false,
    isfull: false,
    cityleft: '',
    citycenter: {},
    cityright: {},
    select1: '0',
    select2: '',
    select3: '',
    pxselect1: '0',
    shownavindex: '',
    qylist: [{
      name: '全部',
      id: ''
    }],
    pxtype: [{
      name: '默认排序',
      value: ''
    }, {
      name: '距离最近',
      value: 'nearest'
    }, {
      name: '最热',
      value: 'hot'
    }, {
      name: '最新',
      value: 'new'
    }, ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this,
      posttypeone = [{
        id: '',
        name: '全部',
        son: [{
          id: ''
        }]
      }],
      typeinfo, param = options.id.split(',');
    app.setNavigationBarColor(this);
    app.util.getLocation({
      type: "0",
      success: res => {
        console.log(res)
        wx.setStorageSync('location', res)
        that.setData({
          lat: res.latitude,
          lng: res.longitude,
        })
        app.api.request({
          url: app.url.getZone,
          success: res => {
            console.log(res)
            var open = that.data.qylist.concat(res.data.zone)
            if (app.globalData.city.zoneId != '0') {
              for (let i = 0; i < open.length; i++) {
                if (app.globalData.city.zoneId == open[i].id) {
                  that.setData({
                    select1: i
                  })
                }
              }
            }
            app.api.request({
              'url': app.url.category,
              'cachetime': '0',
              data: {
                type: '1'
              },
              success: function(res) {
                let ptdata = res.data.data,
                  lindex, rindex = 0;
                if (param.length == 1) {
                  for (let i = 0; i < ptdata.length; i++) {
                    if (ptdata[i].id == param[0]) {
                      typeinfo = ptdata[i]
                      app.setNavigationBarTitle(typeinfo.name)
                      that.setData({
                        typeinfo: typeinfo,
                        onetype: typeinfo.name,
                      })
                    }
                    let posttypesonone = [{
                      id: '',
                      name: '全部',
                      pid: ''
                    }];
                    posttypesonone[0].pid = ptdata[i].id
                    ptdata[i].son = posttypesonone.concat(ptdata[i].son)
                    if (ptdata[i].id == param[0]) {
                      lindex = Number(i)
                    }
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
                        that.setData({
                          typeinfo: typeinfo,
                          onetype: typeinfo.name,
                        })
                        lindex = Number(i)
                        rindex = Number(j)
                      }
                    }
                  }
                }
                console.log(options, res, lindex, rindex)
                that.setData({
                  shownavindex:2,
                  qylist: open,
                  posttype: posttypeone.concat(ptdata),
                  posttypeson: ptdata[lindex].son,
                  typeselect1: lindex + 1,
                  typeselect2: rindex,
                })
                that.getPostlist()
                // console.log(typeinfo, that.data.posttype, that.data.posttypeson, app.globalData.city)
              },
            })
          }
        })
      }
    })
  },
  onChange(e) {
    console.log('onChange', e)
    this.setData({
      postList: [],
      page: 1,
      mygd: false,
      isget: false,
    })
    this.getPostlist()
  },
  // 获取信息列表信息
  getPostlist(e) {
    var that = this,
      co = this.data,
      sort = co.pxtype[co.pxselect1].value,
      params = {
        page: that.data.page,
        size: 10,
        sort: sort,
        lat: co.lat,
        lng: co.lng,
        zoneId: co.qylist[co.select1].id,
        typePid: co.posttype[co.typeselect1].id,
        typeId: co.posttypeson[co.typeselect2].id,
      }
    console.log(params)
    app.api.getPostlist({
      data: params,
      success: res => {
        console.log('信息列表信息', res)
        if (res.data.data.length < 10) {
          that.setData({
            mygd: true,
          })
        } else {
          that.setData({
            page: that.data.page + 1,
          })
        }
        var postList = that.data.postList
        postList = postList.concat(res.data.data)
        that.setData({
          postList: postList,
          isget: true,
        })
      }
    })
  },
  // 信息点赞后刷新贴子数据
  slide(e) {
    var that = this,
      postList = that.data.postList,
      index = e.detail,
      obj = {
        portrait: wx.getStorageSync('users').portrait,
        userName: wx.getStorageSync('users').userName,
        userId: wx.getStorageSync('users').id
      },
      user_id = wx.getStorageSync('users').id
    var dz = postList[index].dz
    console.log(dz, obj, typeof(app.util.ifArrVal(dz, user_id)))
    if (dz.length == 0) {
      dz = dz.concat(obj)
    } else {
      if (typeof(app.util.ifArrVal(dz, user_id)) == 'number') {
        app.util.getShowtoast("取消点赞")
        dz.splice(app.util.ifArrVal(dz, user_id), 1)
        console.log("删除", dz)
      } else {
        app.util.getShowtoast("点赞成功")
        console.log("执行的是添加操作")
        dz = dz.concat(obj)
      }
    }
    postList[index].dz = dz
    wx.hideLoading()
    this.setData({
      postList: postList
    })
  },
  refreshtzData() {
    this.setData({
      mygd: false,
      isget: false,
      page: 1,
      postList: [],
    })
    this.getPostlist()
  },
  //选择区域
  listqy: function(e) {
    if (this.data.qyopen) {
      this.setData({
        qyopen: false,
        nzopen: false,
        pxopen: false,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        qyopen: true,
        pxopen: false,
        nzopen: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }

  },
  //选择分类
  list: function(e) {
    if (this.data.nzopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        nzopen: true,
        pxopen: false,
        qyopen: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
  },
  //选择排序
  listpx: function(e) {
    if (this.data.pxopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        nzopen: false,
        pxopen: true,
        qyopen: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
    console.log(e.target)
  },
  selectleft: function(e) {

    this.setData({
      city: this.data.qylist[e.currentTarget.dataset.index].name,
      select1: e.currentTarget.dataset.index,
      select2: '',
      select3: '',
      qyopen: false,
      isfull: false,
    });
    this.onChange()
  },
  // selectcenter: function (e) {

  //   this.setData({
  //     cityright: this.data.citycenter[e.currentTarget.dataset.city].name,
  //     select2: e.target.dataset.city,
  //     select3: '',
  //     city: e.target.dataset.city
  //   });
  //   //地区选择完毕
  // },
  // selectcity: function (e) {
  //   console.log(e)
  //   this.setData({
  //     city: this.data.cityright[e.target.dataset.city],
  //     select3: this.data.cityright[e.target.dataset.city]
  //   });
  // },
  typesl: function(e) {
    var index = e.currentTarget.dataset.index,
      co = this.data;
    this.setData({
      posttypeson: this.data.posttype[index].son,
      typeselect1: index,
      typeselect2: index == '0' ? '0' : 'a',
    });
    if (index == '0') {
      this.setData({
        onetype: co.posttype[co.typeselect1].name,
        nzopen: false,
        isfull: false,
      })
      this.onChange()
    }
  },
  typesr: function(e) {
    var index = e.currentTarget.dataset.index,
      co = this.data;
    this.setData({
      onetype: index == '0' ? co.posttype[co.typeselect1].name : co.posttypeson[index].name,
      typeselect2: index,
      nzopen: false,
      isfull: false,
    });
    this.onChange()
  },
  pxsl: function(e) {
    this.setData({
      pxselect1: e.currentTarget.dataset.index,
      model: this.data.pxtype[e.currentTarget.dataset.index].name,
      pxopen: false,
      isfull: false,
    });
    this.onChange()
  },
  hidebg: function(e) {

    this.setData({
      qyopen: false,
      nzopen: false,
      pxopen: false,
      nzshow: true,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: 0
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.getPostlist();
    }
  },

})