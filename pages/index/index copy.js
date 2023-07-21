//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    second: '',
    city: "", //默认城市
    postList: [], //默认信息列表
    page: 1, //默认信息列表当前页为1
    size: 10, //默认一次加载10条数据
    tabs: [],
    submenu_new: {
      name: '最新入驻',
      right_value: "更多",
      is_wei: false,
      src: '/pages/store/storemain/storemain',
      img: ''
    },
    submenu_rec: {
      name: '推荐商家',
      right_value: "更多",
      is_wei: false,
      src: '/pages/store/storemain/storemain',
      img: ''
    },
  },
  onLoad: function(options) {
    var that = this
    app.api.system((info) => {
      that.setData({
        system: info,
        isKping: info.isOpenImg == '1' && !app.haveKp,
        second: info.countDown,
        kpgg: info.openImg.split(','),
      })
      if (info.isOpenImg == 1) {
        this.dsq = setInterval(() => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              isKping: false
            })
            app.haveKp = true
            clearInterval(this.dsq)
          }
        }, 1000)
      }
      if (!app.globalData.orientate) {
        // console.time('test')
        app.getLocation(function(location) {
          if (location == true) {
            // console.timeEnd('test')
            that.seleCity(true)
          }
        })
        //console.log("用户还没定位")
      } else {
        that.seleCity(true)
        //console.log("用户已经定位过了")
      }
      app.setNavigationBarColor(that);
      app.setNavigationBarTitle(info.name)
    })
    app.getUserInfo((userinfo) => {
      //console.log(userinfo)
      that.setData({
        isdl: true,
      })
    })
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
     })
  },
  tg() {
    this.setData({
      isKping: false
    })
    clearInterval(this.dsq)
    app.haveKp = true
  },
  // 
  seleCity(renew) {
    let that = this;
    // console.log(getApp().layout, renew, getApp().layout && renew)
    new Promise((resolve, reject) => {
      if (getApp().layout && renew) {
        resolve(getApp().layout)
      } else {
        app.api.layout((info) => {
          if (info) {
            resolve(info)
          } else {
            reject(info)
          }
        })
      }
    }).then(res => {
      that.setData({
        layout: res.page,
        isloading: true,
      })
      app.pageOnLoad(that);
      // console.log('layouts',res)
      let tabs = res.page.find(item => item.cmpName == 'tabGroup') ? res.page.find(item => item.cmpName == 'tabGroup').config.tabList : []
      //console.log(tabs)
      app.util.getLocation({
        type: "0",
        success: dwres => {
          //console.log(dwres)
          that.setData({
            city: app.globalData.city.defaultCity,
            tabs: tabs,
            current: 0,
            selecttype: tabs[0] && tabs[0].type,
            lat: dwres.latitude,
            lng: dwres.longitude,
            postList: [],
            page: 1,
            mygd: false,
            isget: false,
          })
          if (tabs.length) {
            that.getDataList(tabs[0].type)
          }
        },
      })
    }).catch(res => {
      app.pageOnLoad(that);
      console.log('layoutf', res)
      that.setData({
        layout: [{
          cmpName: "searchBox",
          "config": {
            "position": 0,
            "shape": 3,
            "height": 55,
            "borderStyle": 0,
            "fontStyle": "left",
            "recommendSearch": 1,
            "searchBoxList": [{
              style: 0,
              typesetting: 0
            }],
            "keyWords": ""
          }
        }],
        city: app.globalData.city.defaultCity,
        selecttype: 'a',
        isloading: true,
      })
      wx.showModal({
        title: '提示',
        content: '此城市没有获取到拖拽布局数据',
      })
    })
  },
  refreshtzData() {
    this.setData({
      mygd: false,
      isget: false,
      page: 1,
      postList: [],
    })
    this.getDataList(0)
  },
  //公用tab切换获取数据
  getDataList(type) {
    let params = {},
      url = '',
      method = (res) => {}
    switch (+type) {
      // 获取信息列表信息
      case 0:
        params = {
          page: this.data.page,
          size: 10,
          sort: 'new',
          lat: this.data.lat,
          lng: this.data.lng
        };
        url = app.url.post_list;
        method = (res) => {
          for (let i = 0, len = res.data.length; i < len; i++) {
            res.data[i].postId = Number(res.data[i].postId)
            res.data[i].creatTime = app.util.settime(res.data[i].creatTime)
            if (res.data[i].tag) {
              res.data[i].tag = res.data[i].tag.indexOf(',') > -1 ? res.data[i].tag.split(",") : [res.data[i].tag]
              res.data[i].tag.forEach((item, index, input) => {
                input[index] = {
                  name: item,
                  color: app.util.bg1(index)
                }
              })
            }
            if (res.data[i].media && res.data[i].media.length > 10) {
              res.data[i].media = JSON.parse(res.data[i].media)
            } else {
              res.data[i].media = []
            }
            res.data[i].body = res.data[i].body.replace("↵", "\n");
            for (let j = 0, len = res.data[i].media.length; j < len; j++) {
              res.data[i].media[j].url = app.system.url + res.data[i].media[j].url
              res.data[i].media[j].preview && (res.data[i].media[j].preview = app.system.url + res.data[i].media[j].preview)
            }
          }
          return res.data
        }
        break;
        //获取最新enter
      case 1:
        params = {
          page: this.data.page,
          size: 10,
          sort: "new",
          lat: this.data.lat,
          lng: this.data.lng,
        };
        url = app.url.store_list;
        method = (res) => {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].isTop = app.util.Timesize(res.data[i].topEndTime)
            res.data[i].rztime = app.util.settime(res.data[i].enterTime)
            res.data[i].storeLogo = app.util.getTypeImgsUrl(res.data[i].storeLogo)
          }
          return res.data
        }
        break;
        // 获取资讯列表
      case 2:
        params = {
          page: this.data.page,
          size: 10,
          zoneId: app.globalData.city.defaultId
        };
        url = app.url.infomation;
        method = (res) => {
          for (let i in res.data) {
            res.data[i].createdAt = app.util.settime(res.data[i].createdAt)
            res.data[i].media = app.util.getTypeImgsUrl(res.data[i].media)
          }
          return res.data
        }
        break;
        // 获取黄页列表
      case 3:
        params = {
          page: this.data.page,
          size: 10,
          sort: '',
          lat: this.data.lat,
          lng: this.data.lng,
        };
        url = app.url.yellowList;
        method = (res) => {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].logo = app.util.getImgUrl(res.data[i].logo)
          }
          return res.data
        }
        break;
        //顺风车列表
      case 5:
        params = {
          page: this.data.page,
          size: 10,
        };
        url = app.url.freeCarList;
        method = (res) => {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].createdAt = app.util.settime(res.data[i].createdAt)
            if (res.data[i].type == '1') {
              res.data[i].rideTime = res.data[i].rideTime.substring(5, 16)
            }
          }
          return res.data
        }
        break;
        //求职招聘列表（2020-7-25分开求职和招聘模板jobRecruitList招聘信息jobList是求职信息）
      case 6:case 18:
        params = {
          page: this.data.page,
          size: 10,
        };
        url = type==6 ? app.url.jobList : app.url.jobRecruitList;
        method = (res) => {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].createdAt = app.util.ormatDate(res.data[i].createdAt).substring(5, 10)
            res.data[i].logo = app.util.getSingleImgUrl(res.data[i].logo)
            res.data[i].label = JSON.parse(res.data[i].label)
            res.data[i].labelarr = []
            for (let j in res.data[i].label) {
              res.data[i].labelarr.push(res.data[i].label[j])
            }
          }
          return res.data
        }
        break;
        //房屋租售列表（2020-7-25分开 传3是租房6是售房）
      case 7: case 19:
        params = {
          page: this.data.page,
          size: 10,
          order: '1',
          type: type==7?'3':'6',
        };
        url = app.url.housRentingList;
        method = (res) => {
          for (let i = 0; i < res.data.length; i++) {
            // res.data[i].createdAt = app.util.ormatDate(res.data[i].createdAt).substring(5, 10)
            res.data[i].createdAt = app.util.settime(res.data[i].createdAt)
            res.data[i].imgs = app.util.getSingleImgUrl(res.data[i].imgs)
            if (res.data[i].apartment != null) {
              res.data[i].apartment = res.data[i].apartment.substring(0, 2).replace(/\-/g, '室') + res.data[i].apartment.substring(2).replace(/\-/g, '厅')
            }
            let str = res.data[i].rent.split(','),
              a = /[0-9]/,
              b = /['万']/,
              c = /['元/平']/,
              d = /['元/月']/;
            //二手房出售
            if (res.data[i].identifying == '6') {
              if (a.test(str)) {
                if (!b.test(str)) {
                  str.push('万')
                  res.data[i].rent = str
                  res.data[i].rent = res.data[i].rent.join('')
                }
                console.log('包含此字符串', str)
              }
            }
            //新房出售
            else if (res.data[i].identifying == '5') {
              if (a.test(str)) {
                if (!c.test(str)) {
                  str.push('元/平')
                  res.data[i].rent = str
                  res.data[i].rent = res.data[i].rent.join('')
                }
              }
            }
            //房屋出租
            else if (res.data[i].identifying == '3') {
              if (a.test(str)) {
                if (!d.test(str)) {
                  str.push('元/月')
                  res.data[i].rent = str
                  res.data[i].rent = res.data[i].rent.join('')
                }
              }
            }
          }
          return res.data
        }
        break;
        //获取商城列表
      case 8:
        params = {
          page: this.data.page,
          size: 10,
        };
        url = app.urlTwo.mallGoodsList;
        method = (res) => {
          res.data.forEach(item => {
            item.showImgs = app.util.getImgUrl(item.showImgs)
          })
          return res.data
        }
        break;
        //获取活动列表
      case 9:
        params = {
          page: this.data.page,
          size: 10,
          type: '1',
        };
        url = app.url.activityList;
        method = (res) => {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].startTime = app.util.ormatDate(res.data[i].startTime).substring(0, 16)
            res.data[i].createdAt = app.util.settime(res.data[i].createdAt)
            res.data[i].showImgs = app.util.getImgUrl(res.data[i].showImgs)
          }
          return res.data
        }
        break;
        //获取名片列表
      case 10:
        params = {
          page: this.data.page,
          size: 10,
          sort: 'new',
        };
        url = app.url.businesscardList;
        method = (res) => {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].logo = app.util.getImgUrl(res.data[i].logo)
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
          return res.data
        }
        break;
        //获取拼团列表
      case 11:
        params = {
          page: this.data.page,
          size: 10,
        };
        url = app.urlTwo.groupGroupList;
        method = (res) => {
          res.data.forEach(item => {
            item.showImgs = app.util.getImgUrl(item.showImgs)
            item.label = app.com.objToArr(item.label)
          })
          return res.data
        }
        break;
        //抢购列表
      case 12:
        params = {
          page: this.data.page,
          size: 10,
        };
        url = app.urlTwo.rushGoodsList;
        method = (res) => {
          res.data.forEach(item => {
            item.showImgs = app.util.getImgUrl(item.showImgs)
          })
          return res.data
        }
        break;
        //获取优惠券列表
      case 13:
        params = {
          page: this.data.page,
          size: 10,
          type: 0,
        };
        url = app.url.couponList;
        method = (res) => {
          res.data.forEach(item => {
            item.logo = app.util.getSingleImgUrl(item.logo)
            item.vipMoney = app.system.openVip && item.vipMoney ? item.vipMoney : ''
          })
          return res.data
        }
        break;
        //获取会员卡列表
      case 14:
        params = {
          page: this.data.page,
          size: 10,
        };
        url = app.urlTwo.vipPrivilegeList;
        method = (res) => {
          res.data.forEach(item => {
            item.logo = app.util.getSingleImgUrl(item.logo)
          })
          return res.data
        }
        break;
        //砍价列表
      case 15:
        params = {
          page: this.data.page,
          size: 10,
        };
        url = app.urlTwo.bargainList;
        method = (res) => {
          res.data.forEach(item => {
            item.logo = app.util.getSingleImgUrl(item.logo)
          })
          return res.data
        }
        break;
    }
    app.api.prequest({
      'url': url,
      data: params,
    }).then(res => {
      let postList = this.data.postList.concat(method(res))
      if (res.data.length < 10) {
        this.setData({
          mygd: true,
        })
      } else {
        this.setData({
          page: this.data.page + 1,
        })
      }
      this.setData({
        postList: postList,
        isget: true,
      })
      console.log(params, url)
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
  onReady: function() {
    //获得组件
    this.Search = this.selectComponent("#Search");
    this.Swiper = this.selectComponent("#Swiper");
    this.Notice = this.selectComponent("#Notice");
    this.Headline = this.selectComponent("#Headline");
    this.Hotstore = this.selectComponent("#Hotstore");
    this.Cardlist = this.selectComponent("#Cardlist");
    this.Picmagic = this.selectComponent("#Picmagic");
    this.Postinfo = this.selectComponent("#Postinfo");
  },
  onChange(e) {
    var selecttype = this.data.tabs[e.detail.key].type;
    console.log(selecttype)
    this.setData({
      current: e.detail.key,
      postList: [],
      page: 1,
      mygd: false,
      isget: false,
      selecttype: selecttype,
    })
    this.getDataList(Number(selecttype))
  },
  onPageScroll: function(e) {
    if (e.scrollTop > 9) {
      this.setData({
        scrollBack: true
      })
    } else {
      this.setData({
        scrollBack: false
      })
    }
  },
  onSwiperChange(e) {
    const {
      current: index,
      source
    } = e.detail
    const {
      key
    } = this.data.tabs[index]

    if (!!source) {
      this.setData({
        key,
        index,
      })
    }
  },

})