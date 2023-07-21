// pages/freeride/collection/.js
const app = getApp()
Page({
  data: {
    typec: 2,
    myrelease:"myrelease",
    myResList: [],
    mygd: false,
    isget: false,
    isshowpay: false,
    actions1: [{
        name: "分享扩散"
      },
      {
        name: "置顶信息"
      },
      {
        name: "刷新信息"
      },
      {
        name: "下架"
      },
      {
        name: "编辑"
      },
      {
        name: "删除"
      }
    ],
    params: {
      page: 1,
      size: 10,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarColor(this);
    app.setNavigationBarTitle('我的发布')
    that.myResList()
    // 获取用户信息
    app.getUserInfo((userinfo) => {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
  },
  //我的发布
  myResList(e) {
    let that = this,
      params = this.data.params
    app.api.prequest({
      url: app.url.freeMyList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].type == '1') {
          res.data[i].rideTime = res.data[i].rideTime.substring(5, 16)
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
      let myResList = that.data.myResList
      myResList = myResList.concat(res.data)
      that.setData({
        myResList,
        isget: true,
      })
      console.log('发布列表', res)
    })
  },
  //点击操作编辑
  goEdit(e) {
    //显示上架下架
    if (e.detail.display == '1') {
      this.setData({
        "actions1[3].name": '下架'
      })
    } else {
      this.setData({
        "actions1[3].name": '上架'
      })
    }
    this.setData({
      infomationVisible: true,
      actions: this.data.actions1,
      id: e.detail.id,
      typeId: e.detail.typeId,
      xzname: "信息ID：" + e.detail.id,
      display: e.detail.display,
      name: e.detail.name,
      cityId: e.detail.cityId,
    })
    let actions = this.data.actions1.concat([])
    if (e.detail.status == '2') {
      //已拒绝--只显示编辑和删除
      actions.splice(0, 4)
      this.setData({
        actions,
      })
    } else if (e.detail.status == '0') {
      //待审核--不可编辑和操作
      this.setData({
        infomationVisible: false,
      })
    } else if (e.detail.status == '1') {
      //正常操作--不显示编辑
      actions.splice(4, 1)
      this.setData({
        actions,
      })
    }
    console.log(e.detail, this.data.id, this.data.typeId)
    // 获取信息置顶信息
    this.getPosttop()
  },
  // 获取信息置顶信息
  getPosttop(e) {
    var that = this
    app.api.prequest({
      url: app.url.freeCarTop,
      data: {
        carId: that.data.id
      },
    }).then(res => {
      console.log(res)
      var postTap = res.data
      for (let i in postTap) {
        postTap[i].name = postTap[i].body
      }
      console.log("获取到的置顶信息为", postTap)
      that.setData({
        postTap: res.data,
        isTop: postTap
      })
    })
  },
  // 取消弹框按钮
  handleCancel(e) {
    console.log("取消了")
    this.setData({
      infomationVisible: false,
      selectTop: false
    })
  },
  /*
      ================================  弹窗信息  ================================
   */
  addTop(option) {
    console.log(option)
    // return
    var that = this
    app.util.getShowloading('提交中')
    that.setData({
      loading: true,
      selectTop: false
    })
    app.api.prequest({
      'url': app.url.freeCarCarTop,
      'cachetime': '0',
      'method': 'POST',
      data: {
        carId: that.data.id,
        topId: option.id
      },
    }).then(res => {
      if (res.code == '1') {
        let oid = res.data
        if (Number(option.money) > 0) {
          that.setData({
            oid: oid,
            isshowpay: true,
            payobj: {
              params: {
                money: option.money,
                topId: oid,
                carId: that.data.id,
              },
              apiurl: app.url.freeComCarTop
            }
          })
        } else {
          app.util.getShowtoast('操作成功')
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/freeride/myrelease',
            })
          }, 1000)
        }
      } else {
        app.util.getShowtoast(res.msg, 1000, 1)
        that.setData({
          loading: false
        })
      }
      console.log('add', res.data)
    })
  },
  // 查看用户当前点击的信息
  handleClickItem1(e) {
    let that = this,
      index = e.detail.index,
      isTop = that.data.isTop,
      selectTop = that.data.selectTop,
      // userinfo = that.data.userinfo,
      moreoption = that.data.actions,
      morename = moreoption[index].name
    console.log('用户当前点击的是', morename)
    this.setData({
      infomationVisible: false,
    })
    console.log(selectTop, that.data)
    if (selectTop == true) {
      console.log('用户选择了置顶某条信息', isTop[index])
      that.addTop(isTop[index])
    } else {
      if (morename == '分享扩散') {
        wx.navigateTo({
          url: '/pages/freeride/detail?tid=' + this.data.id,
        })
      } else if (morename == '置顶信息') {
        that.setData({
          actions: that.data.isTop,
          infomationVisible: true,
          selectTop: true,
          xzname: "置顶类型",
        })
      } else if (morename == '刷新信息') {
        console.log(this.data.typeId)
        app.util.getShowloading()
        that.setData({
          loading: true,
        })
        app.api.prequest({
          'url': app.url.freeCategoryInfo,
          data: {
            typeId: this.data.typeId
          }
        }).then(res => {
          // console.log(res.data, '发布列表：', that.data.myResList)
          that.setData({
            loading: true,
          })
          //return
          let sxmoney = this.data.cityId > 0 ? res.data.local && res.data.local.refresh || 0 : res.data.country && res.data.country.refresh || 0;
          if (sxmoney > 0) {
            wx.showModal({
              title: '提示',
              content: '刷新信息需要支付' + sxmoney + '元',
              success(res) {
                if (res.confirm) {
                  if (!sxmoney) {
                    return
                  }
                  that.setData({
                    isshowpay: true,
                    payobj: {
                      params: {
                        money: sxmoney,
                        carId: that.data.id,
                      },
                      apiurl: app.url.freeCarRefresh
                    }
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  that.setData({
                    loading: false
                  })
                }
              }
            })
          } else {
            console.log('免费刷新')
            app.util.getShowtoast('刷新成功', 1000)
            that.setData({
              myResList: [],
              'params.page': 1,
            })
            that.completeRefresh()
          }
        })
      } else if (morename == '下架' || morename == '上架') {
        wx.showModal({
          title: '提示',
          content: `确定要${this.data.display == '1' ? '下': '上'}架该信息吗？`,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定', res)
              wx.showLoading({
                title: '加载中',
                mask: 1
              })
              //return
              app.api.prequest({
                'url': app.url.freeDisplay,
                'cachetime': '0',
                data: {
                  display: that.data.display == '1' ? 2 : 1,
                  carId: that.data.id,
                },
                method: "POST",
              }).then(res => {
                console.log(res)
                if (res.code == '1') {
                  if (that.data.display == '1') {
                    app.util.getShowtoast("下架成功")
                  } else {
                    app.util.getShowtoast("上架成功")
                  }
                  that.setData({
                    myResList: [],
                    'params.page': 1,
                    // 'params.size': that.data.myResList.length,
                  })
                  that.completeRefresh()
                } else {
                  app.util.getShowtoast("请重试")
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else if (morename == '编辑') {
        wx.navigateTo({
          url: '/pages/freeride/release?detailId=' + this.data.id + '&name=' + this.data.name + '&id=' + this.data.typeId,
        })
      } else if (morename == '删除') {
        wx.showModal({
          title: '温馨提示',
          content: '确定要删除此条信息吗？',
          success(res) {
            if (res.confirm) {
              wx.showLoading({
                title: '正在删除',
                mask: 1
              })
              app.api.prequest({
                'url': app.url.freeCarDel,
                'cachetime': '0',
                data: {
                  carId: that.data.id,
                },
                method: "POST",
              }).then(res => {
                console.log(res)
                if (res.code == '1') {
                  that.myResList()
                  app.util.getShowtoast("删除成功")
                } else {
                  app.util.getShowtoast("删除失败")
                }
              })
            }
          }
        })
      }
    }
  },
  //支付回调
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      wx.redirectTo({
        url: '/pages/freeride/myrelease',
      })
    }
  },
  //完成后刷新
  completeRefresh() {
    if (getCurrentPages().length != 0) {
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
  },
  onReady: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.myResList()
    }
  },

})