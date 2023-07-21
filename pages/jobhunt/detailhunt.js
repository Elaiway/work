// pages/job-hunt/detail.js
const app = getApp();
Page({
  data: {
    mdoaltoggle: false,
    isshowpay: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options)
    // app.setNavigationBarTitle(options.xyname)
    app.setNavigationBarTitle('招聘详情页')
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
      id: options.rid,
      system: app.system,
      ad: wx.getStorageSync('codeAd')  
    })
    console.log(options.rid, that.data.id)
    that.recruitInfo()
    that.jobmyResume()
    app.getUserInfo((userinfo) => {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
  },
  //招聘详情
  recruitInfo(e) {
    let that = this
    app.api.prequest({
      'url': app.url.recruitInfo,
      data: {
        recruitId: that.data.id
      }
    }).then(res => {
      console.log(res.data.data.media)
      res.data.data.createdAt = app.util.ormatDate(res.data.data.createdAt).substring(5, 16)
      // res.data.data.media = app.util.getImgsUrl(res.data.data.media)
      res.data.data.media = app.util.getTypeImgsUrl(res.data.data.media)
      res.data.data.label = JSON.parse(res.data.data.label)
      res.data.data.labelarr = []
      for (let j in res.data.data.label) {
        res.data.data.labelarr.push(res.data.data.label[j])
      }
      let recruitInfo = res.data.data
      that.setData({
        recruitInfo,
      })
      this.getCollection()
      console.log(res.data.data, res.data.data.media)
    })
  },
  //查看用户是否收藏
  getCollection(e) {
    let that = this
    app.api.prequest({
      url: app.url.collection,
      data: {
        postId: that.data.id,
        userId: wx.getStorageSync('users').id
      }
    }).then(res => {
      console.log("用户的收藏结果为", res, that.data.recruitInfo.userId, wx.getStorageSync('users').id)
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
                active: that.data.recruitInfo.follow,
                name: that.data.recruitInfo.follow ? '已收藏' : '收藏',
                isLogin: 1
              },
            ],
            main: {
              // name: tel,
              name: '投递简历',
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
    console.log(e.detail)
    let that = this
    if (e.detail.name.indexOf('收藏') > -1) {
      that.collection()
    } else if (e.detail.isMain) {
      // console.log('投递简历', this.data.jobmyResume.length)
      if (this.data.jobmyResume.length<=0){
        wx.showModal({
          title: '提示',
          content: '请创建简历',
          success(res) {
            if (res.confirm) {
              app.api.prequest({
                "url": app.url.jobCategory
              }).then(res => {
                 for(let i=0;i<res.data.length;i++){
                   if(res.data[i].identifying=='1'){
                      var jobid = res.data[i].id
                      wx.navigateTo({
                        url: '/pages/jobhunt/releasejob?id=' + jobid,
                      })
                   }
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
      }
      else(
        this.setData({
          mdoaltoggle: true
        })
      )

    }
    console.log(e.detail)
  },
  //点击收藏
  collection(e) {
    let that = this
    app.util.getShowloading()
    app.api.prequest({
      url: app.url.collection_post,
      method: "POST",
      data: {
        postId: that.data.recruitInfo.id,
        type: 8,
      }
    }).then(res => {
      if (res.data.status == '1') {
        app.util.getShowtoast('收藏成功')
      } else {
        app.util.getShowtoast('取消成功')
      }
      that.recruitInfo()
      wx.hideLoading()
      console.log(res.data, that.data.recruitInfo.id)
    })
  },
  //拨打电话
  callPhone(e) {
    let phone = this.data.recruitInfo.linkTel
    app.util.makePhoneCall(phone)
  },
  //我的简历
  jobmyResume(e) {
    app.api.prequest({
      "url": app.url.jobmyResume,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].logo = app.util.getSingleImgUrl(res.data[i].logo)
      }
      if (res.data.length){
        res.data[0].checked = true
        this.setData({
          jobId: res.data[0].id
        })
      }
      this.setData({
        jobmyResume: res.data,
      })
      console.log(res.data)
    })
  },
  //单选按钮
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      jobId: e.detail.value
    })
  },
  //选择简历确定
  chooseResume(e) {
    let that = this,jobId = this.data.jobId
    console.log(jobId)
    app.api.prequest({
      "url": app.url.jobDeliver,
      method: "POST",
      data: {
        jobId,
        recruitId: that.data.id,
      }
    }).then(res => {
      if (res.code == '1') {
        app.util.getShowtoast("投递成功")
        this.setData({
          mdoaltoggle: false,
        })
      }
      else{
        app.util.getShowtoast("请选择简历")
      }
    })
  },
  //选择简历取消
  closeResume(e) {
    this.setData({
      mdoaltoggle: false,
    })
  },
  //点击到店铺
  clickedShop(e) {
    let storeId = this.data.recruitInfo.storeId
    if (storeId!==null){
      wx.navigateTo({
        url: '/pages/store/storemain/storedetail?id=' + storeId,
      })
    }
  },
  //详情图片点击预览编辑
  previewImage(e) {
    const url = this.data.recruitInfo.media[e.currentTarget.dataset.i].url,
      urls = this.data.recruitInfo.media.map(item => item.url)
    app.com.preImg({
      url,
      urls
    })
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
        type:'2',
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
      let categoryId =  res.data[0].id
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
          type: '2',
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
          url: '/pages/jobhunt/releaserecruit?detailId=' + this.data.id + '&id=' + this.data.categoryId,
        })
        // if (this.data.type == '2') {
        //   wx.navigateTo({
        //     url: '/pages/jobhunt/releasejob?detailId=' + this.data.id + '&id=' + this.data.categoryId,
        //   })
        // } else {
        //   wx.navigateTo({
        //     url: '/pages/jobhunt/releaserecruit?detailId=' + this.data.id + '&id=' + this.data.categoryId,
        //   })
        // }
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
                  // this.onTabsChange({
                  //   detail: {
                  //     key: that.data.key
                  //   }
                  // })
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
      'url': app.url.jobSaveRecruit,
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
                    type: '2',
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
        // that.setData({
        //   jobCollection: []
        // })
        // that.onTabsChange({
        //   detail: {
        //     key: that.data.key
        //   }
        // })
        // wx.navigateTo({
        //   url: '/pages/jobhunt/detailhunt',
        // })
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
        type: '2',
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
                type: '2',
                // type: this.data.type == '1' ? 2 : 1,
              },
              apiurl: app.url.jobTopPay
            }
          })
        } else {
          app.util.getShowtoast('操作成功')
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/jobhunt/detailhunt',
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
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/jobhunt/detailhunt?rid=' + this.data.recruitInfo.id,
        })
      }, 1000)
    }
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function () {
    return {
      title: '【' + this.data.recruitInfo.title + '】' + ' ' + this.data.recruitInfo.linkman,
      path: '/pages/jobhunt/detailhunt?rid=' + this.data.recruitInfo.id,
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: '【' + this.data.recruitInfo.title + '】' + ' ' + this.data.recruitInfo.linkman,
      path: '/pages/jobhunt/detailhunt?rid=' + this.data.recruitInfo.id,
    }
  }
})