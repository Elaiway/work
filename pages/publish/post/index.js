// pages/store/storemain/storemain.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      Search: {
        "position": 0,
        "shape": 3,
        "height": 55,
        "borderStyle": 0,
        "fontStyle": "center",
        "recommendSearch": 1,
        "searchBoxList": [],
        "keyWords": ""
      },
      Notice: {
        "infoList": ["浏览", "发布", "分享"],
      },
        postList: [],
        siteroot: app.setInfo.siteroot,
        page: 1,
        key: '0',
        tabs: []
    },
    // onPageScroll: function (e) {
    //   if (e.scrollTop > 9) {
    //     this.setData({
    //       scrollBack: true
    //     })
    //   } else {
    //     this.setData({
    //       scrollBack: false
    //     })
    //   }
    // },

    // 获取信息首页广告位
    indexAdlist(e) {
        var that = this
        app.api.request({
            url: app.url.adList,
            data: {
                type: 3,
                adType: 1,
            },
            success: res => {
                console.log('首页轮播图为', res)
                var imgs = res.data.data
                if (imgs.length > 0) {
                    for (let i in imgs) {
                        imgs[i].type = 0
                        imgs[i].url = that.data.url + imgs[i].url
                    }
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

            }
        })
    },
    // 获取信息中间广告位
    advertAdlist(e) {
        var that = this
        app.api.request({
            url: app.url.adList,
            data: {
                type: 3,
                adType: 2,
            },
            success: res => {
                var imgs = res.data.data
                if (imgs.length > 0) {
                    for (let i in imgs) {
                        imgs[i].type = 0
                        imgs[i].url = that.data.url + imgs[i].url
                        // imgs[i].route = "/pages/message/info/index"
                    }
                    that.setData({
                        advert: imgs
                    })
                }
            }
        })
    },
    // 获取首页分类
    getPostnav(e) {
        var that = this
        app.api.request({
            'url': app.url.category,
            data: {
                type: '1'
            },
            success: function(res) {
                console.log(res)
                var postNav = res.data.data
                for (let i in postNav) {
                  postNav[i].url = postNav[i].icon == "''" ? '' : (that.data.url + JSON.parse(postNav[i].icon)[0].url)
                    postNav[i].label = postNav[i].name
                  postNav[i].entry = { "value": 'postCategory', "param": postNav[i].id}
                  }
                console.log(postNav)
                that.setData({
                    Typeswiper: {
                      "color": "#666",
                      "shape": 3,
                      "buttonNumberOfCol": 5,
                      "buttonNumberOfRow": 2,
                      "entryButtonList": postNav,
                    }
                })
            },
        })
    },
    //tabs切换
    onTabsChange(e) {
        console.log('onTabsChange', e)
        const {
            key
        } = e.detail
        const index = this.data.tabs.map((n) => n.key).indexOf(key)

        this.setData({
            key,
            index,
            postList: [],
            page: 1,
            mygd: false,
            isget: false,
        })
        this.getPostlist()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        console.log(app.util.Timesize())
        app.pageOnLoad(this);
        app.setNavigationBarColor(this);
        app.util.getLocation({
            type: "0",
            success: res => {
                console.log(res)
                app.api.postconfig((info) => {
                    app.setNavigationBarTitle(info.field + '首页')
                    let tabs = info.sort
                    for (let i in tabs) {
                        tabs[i].id = i
                        tabs[i].sort = tabs[i].name
                        tabs[i].name = tabs[i].value
                    }
                    console.log(info, tabs)
                    that.setData({
                      lat: res.latitude,
                      lng: res.longitude,
                        postconfig: info,
                        tabs: tabs,
                    })
                    that.getPostlist()
                })
            }
        })
        that.getPostnav()
        that.indexAdlist()
        that.announceList()
        that.statistic()
        that.advertAdlist()
    },
    // 获取统计数据
    statistic(e) {
    },

    // 获取首页公告
    announceList(e) {
        var that = this
      that.setData({
        Headline: {
          notice:{color:'#666'},
          isButton: true, //右边的button按钮是否显示
          right_button: "立即发布", //button按钮的文字
          right_src: '/pages/publishtype/publishtype', //button按钮对应的路径
          leftvalue: "信息头条",
          bordercolor: "#f9f9f9",
          color: that.data.color,
        },
      })
    },
    // 获取信息列表信息
    getPostlist(e) {
        var that = this,
            params = {
                page: that.data.page,
                size: 10,
                sort: that.data.tabs[that.data.key].sort,
                lat: that.data.lat,
                lng: that.data.lng,
            }
        console.log(params)
      app.api.getPostlist({
        data: params,
        success: res => {
          // console.log('信息列表信息', res)
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

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {
    //   if(this.data.postconfig.title){
    //     return {
    //       title: '【' + this.data.postconfig.title + '】',
    //       imageUrl: this.data.postconfig.shareImg==''?'':this.data.postconfig.shareImg,
    //     }
    //   }
    // }
})