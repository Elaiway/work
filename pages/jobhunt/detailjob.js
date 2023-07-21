// pages/job-hunt/detail.js
const app = getApp();
Page({
  data: {
    jobInfo: [],
    isshowpay: false,
    payTel: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options)
    // app.setNavigationBarTitle(options.xyname)
    app.setNavigationBarTitle('求职详情页')
    app.setNavigationBarColor(this, () => {
      app.isLocation(function() {
        app.util.getLocation({
          type: "0",
          success: res => {
            console.log(res)
          }
        })
        console.log("getlocation")
      })
    });
    that.setData({
      id: that.options.jid
    })
    console.log(that.options.jid)
    that.jobInfo()
    app.getUserInfo((userinfo) => {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
  },
  //求职详情
  jobInfo(e) {
    let that = this
    app.api.prequest({
      'url': app.url.jobInfo,
      data: {
        jobId: that.data.id
      }
    }).then(res => {
      res.data.data.logo = app.util.getSingleImgUrl(res.data.data.logo)
      // res.data.data.logo = app.util.getImgUrl(res.data.data.logo)
      res.data.data.createdAt = app.util.ormatDate(res.data.data.createdAt).substring(5, 16)
      res.data.data.changedAt = app.util.settime(res.data.data.changedAt)
      res.data.data.label = JSON.parse(res.data.data.label)
      res.data.data.labelarr = []
      for (let j in res.data.data.label) {
        res.data.data.labelarr.push(res.data.data.label[j])
      }
      for (let i = 0; i < res.data.study.length; i++) {
        res.data.study[i].startTime = app.util.ormatDate(res.data.study[i].startTime).substring(0, 7)
        res.data.study[i].endTime = app.util.ormatDate(res.data.study[i].endTime).substring(0, 7)
      }
      for (let i = 0; i < res.data.work.length; i++) {
        res.data.work[i].startTime = app.util.ormatDate(res.data.work[i].startTime).substring(0, 7)
        res.data.work[i].endTime = app.util.ormatDate(res.data.work[i].endTime).substring(0, 7)
      }
      let jobInfo = res.data.data,
        study = res.data.study,
        work = res.data.work
      that.setData({
        jobInfo,
        study,
        work,
      })
      this.categoryinfo()
      console.log(res.data.data, res.data.study, res.data.work)
    })
  },
  //请求分类id接口获取电话收费信息
  categoryinfo(e){
    let that = this
    app.api.prequest({
      'url': app.url.jobSaveJob,
      data: {
        categoryId: that.data.jobInfo.typeId
      }
    }).then(res =>{
      console.log(res.data.contactCharge)
      this.setData({
        money: res.data.contactCharge
      })
      this.getCollection()
    })
  },
  //查看用户是否收藏
  getCollection(e) {
    let that = this,
      tel = that.data.jobInfo.tel;
    if (!this.getIsTel()) {
      tel = app.com.hideTel(tel)
    }
    this.setData({
      tel,
    })
    console.log("tel", tel)
    app.api.prequest({
      url: app.url.collection,
      data: {
        postId: that.data.id,
        userId: wx.getStorageSync('users').id
      }
    }).then(res => {
      console.log("用户的收藏结果为", res, that.data.jobInfo.userId, wx.getStorageSync('users').id)
      if (res.code == '1') {
        that.setData({
          foot_menu: {
            menu: [{
                icon: 'icon-shouye',
                name: '首页',
                src: "/pages/jobhunt/index",
                navigateType: '3',
                isLogin: 0
              },
              {
                icon: 'icon-shoucang1',
                active: that.data.jobInfo.follow,
                name: that.data.jobInfo.follow ? '已收藏' : '收藏',
                isLogin: 1
              },
            ],
            main: {
              name: tel,
              cName: '一键拨号',
              isMain: true,
              isLogin: 1
            },
            color: that.data.color,
            right: true,
          },
        })
      }
    })
  },
  //点击底部按钮
  footclick(e) {
    let that = this
    if (e.detail.name.indexOf('收藏') > -1) {
      that.collection()
    } else if (e.detail.isMain) {
      if (!this.getIsTel()) {
        wx.showModal({
          title: '提示',
          content: `查看电话需${that.data.money}元`,
          success(res) {
            if (res.confirm) {
              that.setData({
                isshowpay: !that.data.ishowpay,
                payobj: {
                  params: {
                    type: 5,
                    jobId: that.data.id,
                    money: that.data.money,
                  },
                  apiurl: app.url.lookPay
                }
              })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        app.util.makePhoneCall(this.data.jobInfo.tel)
      }
    }
    console.log(e.detail, that.data.id)
  },
  //点击收藏
  collection(e) {
    let that = this
    app.util.getShowloading()
    app.api.prequest({
      url: app.url.collection_post,
      method: "POST",
      data: {
        postId: that.data.jobInfo.id,
        type: 7,
      }
    }).then(res => {
      if (res.data.status == '1') {
        app.util.getShowtoast('收藏成功')
      } else {
        app.util.getShowtoast('取消成功')
      }
      that.jobInfo()
      wx.hideLoading()
      console.log(res.data, that.data.jobInfo.id)
    })
  },
  getIsTel() {
    console.log(this.data.money)
    let info = this.data.money
    if (info > 0) {
      if (this.data.jobInfo.isLook) { //付过费
        return true
      } else { //没付过费
        return false
      }
    } else { //没设置联系电话费用
      console.log("没设置联系电话费用")
      return true
    }
  },
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      this.setData({
        payTel: true,
      })
      this.jobInfo()
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/jobhunt/detailjob?jid=' + this.data.jobInfo.id,
        })
      }, 1000)
    }
  },

  //操作编辑
  operation(e) {
    let info = e.currentTarget.dataset.info,
      actions = info.status == '2' ?
      app.com.getOperation(['over', 'share', 'top', 'refresh', 'upOrDown']) : app.com.getOperation(['over', 'upOrDown', 'share']);
    this.setData({
      infomationVisible: true,
      id: info.id,
      xzname: "信息ID：" + info.id,
      // type: e.detail.type,
      // actions: this.data.actions1,
      actions,
    })
    console.log(e.currentTarget.dataset)
    this.getTop()
    this.getCategory()
  },
  // 获取信息置顶信息
  getTop(e) {
    let that = this
    app.api.prequest({
      url: app.url.jobTop,
      data: {
        type: '1',
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
      // let categoryId = this.data.type == '1' ? res.data[0].id : res.data[1].id
      let categoryId = res.data[1].id
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
          // type: that.data.type == '1' ? 2 : 1,
          type: '1',
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
        wx.navigateTo({
          url: '/pages/jobhunt/releasejob?detailId=' + this.data.id + '&id=' + this.data.categoryId,
        })
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
                  wx.navigateTo({
                    url: '/pages/jobhunt/index',
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
      'url': app.url.jobSaveJob,
      // 'url': this.data.type == '1' ? app.url.jobSaveRecruit : app.url.jobSaveJob,
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
                    type: '1',
                    // type: that.data.type == '1' ? 2 : 1,
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
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/jobhunt/detailjob?jid=' + this.data.jobInfo.id,
          })
        }, 1000)
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
        type: '1',
        // type: this.data.type == '1' ? 2 : 1,

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
                type: '1',
                // type: this.data.type == '1' ? 2 : 1,
              },
              apiurl: app.url.jobTopPay
            }
          })
        } else {
          app.util.getShowtoast('操作成功')
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/jobhunt/detailjob',
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
  // payreturn(e) {
  //   console.log(e.detail)
  //   if (e.detail == '1') {
  //     // this.onTabsChange({
  //     //   detail: {
  //     //     key: this.data.key
  //     //   }
  //     // })
  //     wx.navigateTo({
  //       url: '/pages/jobhunt/detailhunt',
  //     })
  //   }
  // },


  //添加教育经历
  addjy(e) {
    wx.navigateTo({
      url: '/pages/jobhunt/addexperience?id=' + this.data.jobInfo.id + '&type=' + 1,
    })
  },
  //添加工作经历
  addgz(e){
    wx.navigateTo({
      url: '/pages/jobhunt/addexperience?id=' + this.data.jobInfo.id + '&type=' + 2,
    })
  },
  //修改教育工作经历
  modifyjy(e) {
    console.log(e, e.currentTarget.dataset.info, e.currentTarget.dataset.info.id, e.currentTarget.dataset.info.type)
    let studyId = e.currentTarget.dataset.info.id,
      info = e.currentTarget.dataset.info
      this.setData({
        studyId,
        info,
      })
    console.log(this.data.studyId, this.data.info)
    //return
    wx.navigateTo({
      url: '/pages/jobhunt/addexperience?id=' + this.data.jobInfo.id + '&studyId=' + this.data.studyId + '&info=' + JSON.stringify(this.data.info),
    })
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {
    return {
      title: '【' + this.data.jobInfo.positionName + '】' + ' ' + this.data.jobInfo.name,
      path: '/pages/jobhunt/detailjob?jid=' + this.data.jobInfo.id,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: '【' + this.data.jobInfo.positionName + '】' + ' ' + this.data.jobInfo.name,
      path: '/pages/jobhunt/detailjob?jid=' + this.data.jobInfo.id,
    }
  }
})