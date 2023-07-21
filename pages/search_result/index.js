// pages/search_result/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options
    })
    console.log(options.type)
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    app.setNavigationBarTitle('搜索结果')
    this.onChange()
    this.setData({
      type: options.type,
      color: this.data.color,
    })
  },
  // 搜索
  onChange(e) {
    var list = this.data.options
    var value = list.value
    this.setData({
      value: value,
      type: list.type
    })
    if (list.type == 1) {
      this.indexSearch()
    } else if (list.type == 2) {
      this.infomationSearch()
    } else if (list.type == 4) {
      this.getPostlist()
    } else if (list.type == 5) {
      this.getPostlist2()
    } else if (list.type == 6) {
      this.getPostlist3()
    } else if (list.type == 7) {
      this.getPostlist4()
    } else if (list.type == 8) {
      this.getPostlist5()
    }
     else {
      this.storeSearch()
    }
  },
  // 信息搜索
  indexSearch(e) {
    var that = this,
      list = that.data.list,
      page = that.data.page
    app.api.getPostlist({
      data: {
        word: that.data.value,
        page: page,
        size: 10
      },
      success: res => {
        console.log('首页搜索返回的数据为', res)
        if (res.data.data.length < 10) {
          that.setData({
            mygd: true,
          })
        } else {
          that.setData({
            page: page + 1,
          })
        }
        list = list.concat(res.data.data)
        that.setData({
          list: list,
          isget: true,
        })
      }
    })
  },
  // 资讯搜索
  infomationSearch(e) {
    var that = this,
      list = that.data.list,
      page = that.data.page
    app.api.request({
      url: app.url.infomation,
      data: {
        keyword: that.data.value,
        page: page,
      },
      success: res => {
        console.log('资讯搜索返回的数据为', res)
        if (res.data.data.length < 10) {
          that.setData({
            mygd: true,
          })
        } else {
          that.setData({
            page: page + 1,
          })
        }
        for (let i in res.data.data) {
          res.data.data[i].createdAt = app.util.settime(res.data.data[i].createdAt)
          res.data.data[i].media = JSON.parse(res.data.data[i].media)
          for (let j in res.data.data[i].media) {
            res.data.data[i].media[j].url = that.data.url + res.data.data[i].media[j].url
          }
        }
        list = list.concat(res.data.data)
        that.setData({
          list: list,
          isget: true,
        })
      }
    })
  },
  // 商家搜索
  storeSearch(e) {
    var that = this,
      options = wx.getStorageSync("Location"),
      list = that.data.list,
      page = that.data.page
    app.api.request({
      url: app.url.bussiness,
      data: {
        word: that.data.value,
        page: page,
        size: 10,
        lat: options.latitude,
        lnt: options.longitude,
        sort: 'new',
      },
      success: res => {
        console.log('商圈搜索返回的数据为', res)
        if (res.data.data.length < 10) {
          that.setData({
            mygd: true,
          })
        } else {
          that.setData({
            page: page + 1,
          })
        }
        for (let i in res.data.data) {
          res.data.data[i].isTop = app.util.Timesize(res.data.data[i].topEndTime)
          res.data.data[i].rztime = app.util.settime(res.data.data[i].enterTime)
          res.data.data[i].storeLogo = JSON.parse(res.data.data[i].storeLogo)
          res.data.data[i].storeLogo[0].url = that.data.url + res.data.data[i].storeLogo[0].url
        }
        list = list.concat(res.data.data)
        that.setData({
          list: list,
          isget: true,
        })
      }
    })
  },
  // 黄页搜索
  getPostlist(e) {
    console.log('进入黄页搜索')
    var that = this,
      list = that.data.list,
      params = {
        page: that.data.page,
        size: 10,
        //lat: that.data.lat,
        //lng: that.data.lng,
        word: that.data.value,
      }
    console.log(params)
    app.api.prequest({
      'url': app.url.yellowList,
      data: params,
    }).then(res => {
      console.log('yellowlist', res)
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].logo = app.util.getImgUrl(res.data[i].logo)
        res.data[i].recordName
        //console.log(res.data[i].recordName)
      }
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          page: that.data.page + 1,
        })
      }
      list = list.concat(res.data)
      that.setData({
        list: list,
        isget: true,
      })
    })
  },
  // 求职招聘搜索
  getPostlist2(e) {
    console.log('进入求职招聘搜索')
    let that = this,
      list = that.data.list,
      params = {
        page: that.data.page,
        size: 10,
        //lat: that.data.lat,
        //lng: that.data.lng,
        word: that.data.value,
      }
      //activevalue = this.data.tabs[this.data.key].value;
    //console.log(activevalue)
    app.api.prequest({
      //"url": activevalue == 'newRecruit' ? app.url.jobRecruitList : app.url.jobList,
      "url":app.url.jobRecruitList,
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
      list = list.concat(res.data)
      that.setData({
        list: list,
        isget: true,
      })
      //console.log(res.data, list)
    })
  },
  // 限时抢购搜索
  getPostlist3(e) {
    console.log('进入限时抢购搜索')
    let that = this,
      list = that.data.list,
      params = {
        page: that.data.page,
        size: 10,
        //lat: that.data.lat,
        //lng: that.data.lng,
        word: that.data.value,
      }
    app.api.prequest({
      "url": app.urlTwo.rushGoodsList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
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
      list = list.concat(res.data)
      that.setData({
        list,
        isget: true,
      })
     // console.log(res.data)
    })
  },
  // 多商户商城搜索
  getPostlist4(e) {
    console.log('进入多商户商城搜索')
    var that = this,
      list = that.data.list,
      params = {
        page: that.data.page,
        size: 10,
        //lat: that.data.lat,
        //lng: that.data.lng,
        word: that.data.value,
      }
    console.log(params)
    app.api.prequest({
      'url': app.urlTwo.mallGoodsList,
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
      })
      list = list.concat(res.data)
      that.setData({
        list,
        isget: true,
      })
    })
  },
  // 拼团搜索
  getPostlist5(e) {
    console.log('进入拼团搜索')
    var that = this,
      list = that.data.list,
      params = {
        page: that.data.page,
        size: 10,
        //lat: that.data.lat,
        //lng: that.data.lng,
        word: that.data.value,
      }
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
      // res.data.forEach(item => {
      //   item.showImgs = app.util.getImgUrl(item.showImgs)
      // })
      res.data.forEach(item => {
        item.showImgs = app.util.getImgUrl(item.showImgs)
        item.label = app.com.objToArr(item.label)
      })
      list = list.concat(res.data)
      that.setData({
        list,
        isget: true,
      })
    })
  },
  // 跳转商家详情
  getStoreinfo(e) {
    console.log('传过来了', e)
    wx.navigateTo({
      url: '/pages/store/storemain/storedetail?id=' + e.detail,
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
      this.onChange()
    }
  },

})