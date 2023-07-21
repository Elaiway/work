// pages/job-hunt/myjobhunt.js
const app = getApp();
Page({
  data: {
    tabs: [{
      name: "我的求职",
      id: 0,
    }, {
      name: "我的招聘",
      id: 1,
    }, ],
    jobmyHunting: [],
    mygd: false,
    isget: false,
    isshowpay: false,
    key: '0',
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
    console.log(options)
    app.setNavigationBarTitle('我的求职招聘')
    // that.jobmyHunting()
    that.onTabsChange({
      detail: {
        key: 0
      }
    })
    app.setNavigationBarColor(this, () => {
      // this.getCategory()
    });
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail

    this.setData({
      key,
      jobmyHunting: [],
      'params.page': 1,
      mygd: false,
      isget: false,
    })
    this.jobmyHunting()
    console.log(key)
  },
  //求职招聘列表
  jobmyHunting(e) {
    let that = this,
      params = that.data.params,
      rqquesturl
    if (this.data.key == 0) {
      that.setData({
        types: 2
      })
      rqquesturl = app.url.jobmyResume
    } else if (this.data.key == 1) {
      that.setData({
        types: 1
      })
      rqquesturl = app.url.jobmyRecruit
    }
    app.api.prequest({
      // "url": app.url.jobmyResume,
      "url": rqquesturl,
      data: params
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].createdAt = app.util.ormatDate(res.data[i].createdAt)
        res.data[i].createdAt = res.data[i].createdAt.substring(0, 10)
        console.log(res.data[i].logo)
        res.data[i].logo = app.util.getSingleImgUrl(res.data[i].logo)
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
      let jobmyHunting = that.data.jobmyHunting
      jobmyHunting = jobmyHunting.concat(res.data)
      console.log(res.data)
      that.setData({
        jobmyHunting,
        isget: true,
      })
    })
  },
  //收到的简历
  getresume(e) {
    console.log(e.detail)
    // let eid = e.detail
    wx.navigateTo({
      url: '/pages/jobhunt/mygetjob?id=' + e.detail,
    })
  },
  //操作编辑
  operation(e) {
    let info = e.detail.info,
      actions = info.status == '2' ?
      app.com.getOperation(['over', 'share', 'top', 'refresh', 'upOrDown']) : app.com.getOperation(['over', 'upOrDown', 'share']);
    this.setData({
      infomationVisible: true,
      id: e.detail.info.id,
      xzname: "信息ID：" + e.detail.info.id,
      type: e.detail.type,
      // actions: this.data.actions1,
      actions,
    })
    console.log(e.detail, this.data.type)
    this.getTop()
    this.getCategory()
  },
  // 获取信息置顶信息
  getTop(e) {
    let that = this
    app.api.prequest({
      url: app.url.jobTop,
      data: {
        // type:'2',
        type: this.data.type == '1' ? 2 : 1,
        jobId: that.data.id
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
  //获取分类ID
  getCategory(e) {
    let that = this;
    app.api.prequest({
      "url": app.url.jobCategory
    }).then(res => {
      console.log(res.data)
      let categoryId = this.data.type == '1' ? res.data[0].id : res.data[1].id
      that.setData({
        categoryId,
      })
      console.log(res.data, categoryId)
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
        url = 'jobDelete'
        params = {
          type: that.data.type == '1' ? 2 : 1,
          jobId: that.data.id,
        }
        this.handleCancel()
        break;
      case 'top':
        this.setData({
          actions: that.data.isTop,
          xzname: "置顶类型",
        })
        return;
      case 'edit':
        if (this.data.type == '2') {
          wx.navigateTo({
            url: '/pages/jobhunt/releasejob?detailId=' + this.data.id + '&id=' + this.data.categoryId,
          })
        } else {
          wx.navigateTo({
            url: '/pages/jobhunt/releaserecruit?detailId=' + this.data.id + '&id=' + this.data.categoryId,
          })
        }
        this.handleCancel()
        return;
      case 'refresh':
        this.refresh()
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
      let that = this;
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
                      key: that.data.key
                    }
                  })
                }, 1000)
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
      // 'url': app.url.jobSaveRecruit,
      'url': this.data.type == '1' ? app.url.jobSaveRecruit : app.url.jobSaveJob,
      data: {
        categoryId: this.data.categoryId
      }
    }).then(res => {
      console.log(res.data)
      that.setData({
        loading: true,
      })
      let sxmoney = res.data.refreshMoney;
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
                    jobId: that.data.id,
                    type: that.data.type == '1' ? 2 : 1,
                  },
                  apiurl: app.url.jobRefreshPay
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
          jobCollection: []
        })
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
      'url': app.url.jobTop,
      'cachetime': '0',
      data: {
        jobId: that.data.id,
        type: this.data.type == '1' ? 2 : 1,
      },
    }).then(res => {
      if (res.code == '1') {
        let oid = res.data[0].id
        console.log(res.data[0].id, option.id)
        if (Number(option.money) > 0) {
          that.setData({
            oid: oid,
            isshowpay: true,
            payobj: {
              params: {
                money: option.money,
                topId: oid,
                jobId: that.data.id,
                type: this.data.type == '1' ? 2 : 1,
              },
              apiurl: app.url.jobTopPay
            }
          })
        } else {
          app.util.getShowtoast('操作成功')
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/jobhunt/myjobhunt',
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
      this.jobmyHunting()
    }
  },
  onShareAppMessage: function() {

  }
})