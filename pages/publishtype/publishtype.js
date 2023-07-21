// pages/publishtype/publishtype.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        posttype: [],
        moretype:[],
        actions: [],
        actions2: [],
        visible: false,
        visible2: false,
        moretypes:'',
    },
    rzsj(e) {
        console.log(e)
        if (app.isLogin()) {
            wx.navigateTo({
                url: '/pages/store/storeentry/storeentry',
            })
        }
    },
    rzmp(e) {
      console.log(e)
      if (app.isLogin()) {
        wx.navigateTo({
          url: '/pages/publish/publishpost/postsuccess?postId=70',
        })
      }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(app.Getroute())
        app.setNavigationBarColor(this);
        app.pageOnLoad(this);
        var that = this;
      that.posttype()
      if (app.isLogin()){
        app.api.prequest({
          'url': app.url.userInfo,
          data: {
            id: wx.getStorageSync('users').id
          },
        }).then((res) => {
          this.setData({
            userinfo: res.data,
          })
          console.log('userinfo', res, this.data.userinfo.storeInfo.storeId)
          app.sjdId = this.data.userinfo.storeInfo.storeId
          that.moretype()
        })
      }
    },
    posttype(e) {
        var that = this
        app.api.request({
            'url': app.url.category,
            'cachetime': '0',
            data: {
                type: '1'
            },
            success: function(res) {
                console.log(res)
                var posttype = res.data.data
                for (let i in posttype) {
                    posttype[i].icon = posttype[i].icon == "''" ? '' : JSON.parse(posttype[i].icon)[0].url
                }
                that.setData({
                    posttype: posttype,
                })
            },
        })
    },
    //更多分类
    moretype(e) {
      var that = this
      app.api.request({
        'url': app.url.release_page,
        'cachetime': '0',
        success: function (res) {
          console.log(res)
          var moretype = res.data.data
          // for (let i in moretype) {
          //   moretype[i].icon = moretype[i].icon == "''" ? '' : JSON.parse(moretype[i].icon)[0].url
          // }
          that.setData({
            moretype: moretype,
          })
        },
      })
    },
    handlegridclick(e) {
        if (app.isLogin()) {
            let gridId = e.detail.gridId;
            console.log(e, gridId)
            this.setData({
                visible: true,
                xzname: this.data.posttype[e.detail.index].name,
                actions: this.data.posttype[e.detail.index].son
            });
        }
    },
    //点击更多栏目
    handlegridclick2(e) {
      console.log('handlegridclick2', e, e.detail.gridId)
      if (app.isLogin()) {
        var moretype = e.detail.gridId;
        if (moretype == "car" || moretype == "job" || moretype == "renting"){
          if (moretype == "car") {
            app.api.prequest({
              'url': app.url.freeCategory,
            }).then(res => {
              this.setData({
                actions2: res.data,
              })
            })
          } else if (moretype == "job"){
            app.api.prequest({
              "url": app.url.jobCategory
            }).then(res => {
              this.setData({
                actions2: res.data,
              })
            })
          } else if (moretype == "renting") {
            app.api.prequest({
              "url": app.url.housCategory
            }).then(res => {
              this.setData({
                actions2: res.data,
              })
            })
          }
          this.setData({
            visible2: true,
            xzname2: this.data.moretype[e.detail.index].name,
            moretypes: e.detail.gridId,
          })
        }else{
          if (moretype == "yellow"){
            console.log(moretype)
            wx.navigateTo({
              url: '/pages/yellow/release',
            })
          } else if (moretype == "activity"){
            wx.navigateTo({
              url: '/pages/activity/manage/release',
            })
          } else if (moretype == "coupon") {
            wx.navigateTo({
              url: '/pages/coupon/manage/release',
            })
          } else if (moretype == "vip") {
            wx.navigateTo({
              url: '/pages/vip/manage/release',
            })
          } else if (moretype == "rush") {
            wx.navigateTo({
              url: '/pages/rushbuy/manage/release',
            })
          } else if (moretype == "group") {
            wx.navigateTo({
              url: '/pages/assemble/manage/release',
            })
          } else if (moretype == "bargain") {
            wx.navigateTo({
              url: '/pages/bargain/manage/release',
            })
          }
        }
      }
    },
    handleClickItem({
        detail
    }) {
        const index = detail.index;
        let that = this,
            typeinfo = this.data.actions[index],
            postcig = this.data.postconfig,
            uid = wx.getStorageSync('users').id;
        console.log(index, this.data.actions, typeinfo, postcig, uid)
        app.api.request({
            'url': app.url.postTodayNum,
            'cachetime': '0',
            data: {
                userId: uid
            },
            success: function(res) {
                console.log(res)
                if (Number(postcig.postNum) > res.data.data || postcig.limit == 'close') {
                    wx.navigateTo({
                        url: '/pages/publish/publishpost/publishpost?pId=' + typeinfo.pid + '&id=' + typeinfo.id + '&name=' + typeinfo.name,
                        success: function(e) {
                            console.log(e)
                            if (e.errMsg == "navigateTo:ok") {
                                that.setData({
                                    visible: false
                                });
                            }
                        }
                    })
                } else {
                    that.setData({
                        visible: false
                    });
                    app.util.getShowmodel('十分抱歉！您今日发布量已至上限')
                }
            },
        })
    },
    handleCancel() {
        this.setData({
            visible: false
        });
    },
  handleClickItem2({
    detail
  }) {
    const index = detail.index;
    let that = this,
      typeinfo = this.data.actions2[index];
    console.log(index, this.data.actions2, typeinfo, this.data.moretypes)
    if (this.data.moretypes=="car"){
      wx.navigateTo({
        url: '/pages/freeride/release?id=' + typeinfo.id + '&name=' + typeinfo.name,
      })
    }else if (this.data.moretypes == "job"){
      if (typeinfo.identifying == '2') {
        wx.navigateTo({
          url: '/pages/jobhunt/releaserecruit?id=' + typeinfo.id + '&name=' + typeinfo.name,
        })
      } else{
        wx.navigateTo({
          url: '/pages/jobhunt/releasejob?id=' + typeinfo.id + '&name=' + typeinfo.name,
        })
      }
    } else if (this.data.moretypes == "renting") {
      if (typeinfo.identifying == '3' || typeinfo.identifying == '4') {
        wx.navigateTo({
          url: '/pages/housingdeal/release?typeId=' + typeinfo.id + '&name=' + typeinfo.name + '&type=' + typeinfo.identifying,
        })
      } else if (typeinfo.identifying == '5' || typeinfo.identifying == '6') {
        wx.navigateTo({
          url: '/pages/housingdeal/releasesale?typeId=' + typeinfo.id + '&name=' + typeinfo.name + '&type=' + typeinfo.identifying,
        })
      }
    }
    that.setData({
      visible2: false
    });
  },
  handleCancel2() {
    this.setData({
      visible2: false
    });
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
        var that = this;
        app.api.postconfig((info) => {
            app.setNavigationBarTitle('发布' + info.field)
            console.log(info)
            that.setData({
                postconfig: info,
            })
        })
        app.api.storeconfig((info) => {
            console.log(info)
            that.setData({
                storeconfig: info,
            })
        })
        app.api.system((info) => {
            console.log(info)
            that.setData({
                system: info,
            })
        })
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

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // }
})