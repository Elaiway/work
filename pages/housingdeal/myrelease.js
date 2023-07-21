// pages/job-hunt/myjobhunt.js
const app = getApp();
Page({
  data: {
    // tabs: [{
    //     name: "二手房出售",
    //     id: 0,
    //   }, {
    //     name: "新房出售",
    //     id: 1,
    //   },
    //   {
    //     name: "房屋求租",
    //     id: 2,
    //   },
    //   {
    //     name: "房屋出租",
    //     id: 3,
    //   },
    // ],
    postList: [],
    mygd: false,
    isget: false,
    isshowpay: false,
    key: '0',
    params: {
      page: 1,
      size: 10,
      typeId: ''
    },
    visible: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options)
    app.setNavigationBarTitle('我的发布')
    // app.setNavigationBarColor(this, () => {
    //   that.getPostnav()
    // });
    app.setNavigationBarColor(this, () => {
      app.isLocation(function () {
        app.util.getLocation({
          type: "0",
          success: res => {
            console.log(res)
          }
        })
        that.getPostnav()
      })
    });
  },
  //获取分类信息
  getPostnav(e) {
    app.api.prequest({
      "url": app.url.housCategory
    }).then(res => {
      let housCategory = res.data
      if (res.data.length > 0) {
        this.setData({
          housCategory,
          tabs: housCategory,
          key: housCategory[0].id
        })
        this.onTabsChange({
          detail: {
            key: housCategory[0].id
          }
        })
      }
      console.log(housCategory)
    })
  },
  // tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail

    this.setData({
      key,
      postList: [],
      'params.page': 1,
      mygd: false,
      isget: false,
    })
    let info = this.data.tabs.find(item => item.id == key),
      types = 1;
    if (info.identifying != 4) {
      types = 1
    } else {
      types = 2
    }
    this.setData({
      "params.typeId": key,
      types,
    })
    this.postList()
    //console.log(key, info)
  },
  //我的发布列表
  postList(e) {
    console.log(this.data.housCategory)
    let that = this,
      params = that.data.params
    app.api.prequest({
      "url": app.url.housMyList,
      data: params
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].createdAt = app.util.settime(res.data[i].createdAt)
        res.data[i].imgs = app.util.getSingleImgUrl(res.data[i].imgs)
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
              if(res.data[i].rent[0]=='0'){
                res.data[i].rent = '面议'
              }else{
                res.data[i].rent = res.data[i].rent.join('')
              }
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
              if(res.data[i].rent[0]=='0'){
                res.data[i].rent = '面议'
              }else{
                res.data[i].rent = res.data[i].rent.join('')
              }
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
      console.log(res.data)
      that.setData({
        postList,
        isget: true,
      })
    })
  },
  // getresume(e) {
  //   console.log(e.detail)
  //   wx.navigateTo({
  //     url: '/pages/jobhunt/mygetjob?id=' + e.detail,
  //   })
  // },
  // 取消弹框按钮
  handleCancel() {
    this.setData({
      visible: false,
    })
  },
  //操作编辑
  operation(e) {
    let info = e.detail,
      actions = info.status == '2' ?
      app.com.getOperation(['over', 'share', 'top', 'refresh', 'upOrDown']) : app.com.getOperation(['over', 'edit']);
    actions.forEach(item => {
      item.field == 'upOrDown' && (item.name = info.display == 2 ? '上架' : '下架')
    })
    this.setData({
      visible: true,
      info,
      id: info.id,
      typeId: info.typeId,
      cityId: info.cityId,
      display: info.display,
      identifying: info.identifying,
      xzname: "信息ID：" + info.id,
      actions,
    })
    // if (e.detail.status == '0') {
    //   //待审核--不可编辑和操作
    //   this.setData({
    //     visible: false,
    //   })
    // }
    console.log(info, this.data.cityId, this.data.typeId)
    this.getTop()
  },
  // 获取信息置顶信息
  getTop(e) {
    app.api.prequest({
      url: app.url.housRentingTop,
      data: {
        rentingId: this.data.id
      },
    }).then(res => {
      console.log(res)
      var postTap = res.data
      for (let i in postTap) {
        postTap[i].name = postTap[i].body
      }
      console.log("获取到的置顶信息为", postTap)
      this.setData({
        postTap: res.data,
        isTop: postTap
      })
    })
  },
  // 查看用户当前点击的信息
  handleClickItem(e) {
    let item = this.data.actions[e.detail.index],
      info = this.data.info,
      that = this,
      title, url, params,
      index = e.detail.index,
      isTop = that.data.isTop;
    console.log(item)
    switch (item.field) {
      case 'delete':
        title = '确定要删除该订单？'
        this.handleCancel()
        url = 'housRentingDel'
        params = {
          rentingId: this.data.id
        }
        break;
      case 'top':
        this.setData({
          actions: that.data.isTop,
          xzname: "置顶类型",
        })
        return;
      case 'upOrDown':
        title = info.display == 2 ? '确定上架吗?' : '确定下架吗?'
        this.handleCancel()
        url = 'housDisplay'
        params = {
          rentingId: this.data.id,
          display: that.data.display == '1' ? 2 : 1,
        }
        break;
      case 'edit':
        if (that.data.identifying == '4' || that.data.identifying == '3'){
          wx.navigateTo({
            url: `/pages/housingdeal/release?id=${info.id}&typeId=${info.typeId}&name=${info.name}&type=${info.identifying}`,
          })
        } else if (that.data.identifying == '6' || that.data.identifying == '5'){
          wx.navigateTo({
            url: `/pages/housingdeal/releasesale?id=${info.id}&typeId=${info.typeId}&name=${info.name}&type=${info.identifying}`,
          })
        }
        this.handleCancel()
        return;
      case 'refresh':
        this.refresh()
        this.handleCancel()
        return;
      case 'share':
        wx.navigateTo({
          url: '/pages/housingdeal/detail?id=' + info.id,
        })
        this.handleCancel()
        return;
        //都不满足  
      default:
        console.log('用户选择了置顶某条信息', isTop[index])
        this.addTop(isTop[index])
        this.handleCancel()
        return;
    }
    if (e.detail.field != 'refresh') {
      wx.showModal({
        title: '提示',
        content: title,
        success: (res) => {
          //点击确定
          if (res.confirm) {
            app.util.getShowloading('提交中')
            app.api.prequest({
              'url': app.url[url],
              'method': 'POST',
              data: params,
            }).then((res) => {
              if (res.code == '1') {
                app.util.getShowtoast('操作成功')
                setTimeout(() => {
                  this.onTabsChange({
                    detail: {
                      key: this.data.key
                    }
                  })
                }, 1000)
                this.handleCancel()
              } else {
                app.util.getShowtoast(res.msg, 1000, 1)
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      this.setData({
        isshowpay: true,
        payobj: {
          params: params,
          apiurl: app.url[url]
        }
      })
    }
  },
  //调用刷新方法
  refresh() {
    console.log('调用刷新方法')
    let that = this;
    app.util.getShowloading()
    that.setData({
      loading: true,
    })
    app.api.prequest({
      'url': app.url.housCategoryInfo,
      data: {
        typeId: this.data.typeId
      }
    }).then(res => {
      console.log(res.data)
      that.setData({
        loading: true,
      })
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
                    rentingId: that.data.id,
                  },
                  apiurl: app.url.housRefreshPay
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
        that.onTabsChange({
          detail: {
            key: that.data.key
          }
        })
      }
    })
  },
  //调用置顶方法
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
      'url': app.url.housRentingrentintTop,
      'cachetime': '0',
      'method': 'POST',
      data: {
        rentingId: that.data.id,
        topId: option.id,
      },
    }).then(res => {
      if (res.code == '1') {
        let oid = res.data
        console.log(res.data, option.id)
        if (Number(option.money) > 0) {
          that.setData({
            oid: oid,
            isshowpay: true,
            payobj: {
              params: {
                money: option.money,
                topId: oid,
              },
              apiurl: app.url.houscommonRentintTop
            }
          })
        } else {
          app.util.getShowtoast('操作成功')
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/housingdeal/myrelease',
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
  //支付回调
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      this.onTabsChange({
        detail: {
          key: this.data.key
        }
      })
    }
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