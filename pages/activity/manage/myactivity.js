// pages/activity/myactivity/.js
const app = getApp()
Page({
  data: {
    enrollList: [],
    mygd: false,
    isget: false,
    tabs: [{
        name: "全部",
        id: 0,
      },
      {
        name: "报名中",
        id: 1,
      },
      {
        name: "未开始",
        id: 2,
      },
      {
        name: "已结束",
        id: 3,
      },
      // {
      //   name: "已完成",
      //   id: 4,
      // },
    ],
    key: 0,
    isshowpay: false,
    params: {
      page: 1,
      size: 10,
      type: '',
      storeId: '',
    },
    visible: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('我发布的活动')
    // app.setNavigationBarColor(this)
    app.setNavigationBarColor(this, () => {
      // app.api.prequest({
      //   'url': app.url.activitySet,
      //   'cachetime': 30,
      // }).then(res => {
      //   that.setData({
      //     activitySet: res.data,
      //   })
      // })
      //请求storeId信息
      app.api.prequest({
        'url': app.url.userInfo,
        data: {
          adminId: wx.getStorageSync('users').id,
        },
      }).then(res => {
        // console.log('店铺信息', res.data[0], res.data[0].id)
        this.setData({
          'params.storeId': res.data.storeInfo.storeId
        })
        this.enrollList()
      })
    });
    // 获取用户信息
    // app.getUserInfo((userinfo) => {
    //   console.log(userinfo)
    //   that.setData({
    //     userinfo: userinfo,
    //   })
    // })
  },
  // tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    this.setData({
      key,
      enrollList: [],
      "params.page": 1,
      mygd: false,
      isget: false,
    })
    let info = this.data.tabs.find(item => item.id == key)
    this.setData({
      "params.type": key,
    })
    this.enrollList()
    console.log(key)
  },
  //报名列表
  enrollList() {
    let that = this,
      now = new Date().getTime(),
      params = this.data.params;
    app.api.prequest({
      'url': app.urlTwo.activityMy,
      data: params
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].tips = +this.data.key ? this.data.tabs[+this.data.key].name : res.data[i].enrollEndTime > now && res.data[i].enrollStartTime < now ? '报名中' :
          res.data[i].startTime * 1000 > now ? '未开始' : res.data[i].endTime * 1000 < now ? '已结束' : '';
        res.data[i].showImgs = app.util.getImgUrl(res.data[i].showImgs)
        res.data[i].startTime = app.util.ormatDate(res.data[i].startTime).substring(0, 16)
        res.data[i].endTime = app.util.ormatDate(res.data[i].endTime).substring(0, 16)
        res.data[i].enrollEndTime = app.util.ormatDate(res.data[i].enrollEndTime).substring(0, 16)
        res.data[i].enrollStartTime = app.util.ormatDate(res.data[i].enrollStartTime).substring(0, 16)
        res.data[i].createdAt = app.util.ormatDate(res.data[i].createdAt).substring(0, 16)
        // console.log(timestamp1)
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
      let enrollList = that.data.enrollList
      enrollList = enrollList.concat(res.data)
      that.setData({
        enrollList,
        isget: true,
      })
      console.log(res.data)
    })
  },
  //点击详情
  goDetail(e) {
    console.log(e.currentTarget.dataset.infos)
    if (e.currentTarget.dataset.infos.display == '2') {
      app.util.getShowtoast('活动已下架', 2000, 2)
    } else {
      wx.navigateTo({
        url: '/pages/activity/detail?id=' + e.currentTarget.dataset.infos.id,
      })
    }
  },
  //报名详情
  enrollDetail(e) {
    wx.navigateTo({
      url: '/pages/activity/manage/enrolldetail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 取消弹框按钮
  handleCancel() {
    this.setData({
      visible: false,
    })
  },
  //操作编辑
  operation(e) {
    console.log(e.currentTarget.dataset.info)
    let info = e.currentTarget.dataset.info,
      // display = info.display
      actions = info.display == '1' ?
      app.com.getOperation(['over', 'share', 'top', 'refresh', 'edit', 'delete']) : app.com.getOperation(['over', 'share', 'top', 'refresh', 'delete']);
    actions.forEach(item => {
      item.field == 'upOrDown' && (item.name = info.display == 2 ? '上架' : '下架')
    })
    this.setData({
      visible: true,
      info,
      id: info.id,
      display: info.display,
      xzname: "信息ID：" + info.id,
      actions,
    })
  },
  // 查看用户当前点击的信息
  handleClickItem(e) {
    let item = this.data.actions[e.detail.index],
      info = this.data.info,
      that = this,
      title, url, params,
      index = e.detail.index;
    // isTop = that.data.isTop;
    console.log(item)
    switch (item.field) {
      case 'upOrDown':
        title = info.display == 2 ? '确定上架吗?' : '确定下架吗?'
        this.handleCancel()
        url = 'activityChange'
        params = {
          activityId: this.data.id,
          display: that.data.display == '1' ? 2 : 1,
        }
        break;
      case 'edit':
        wx.navigateTo({
          url: `/pages/activity/manage/release?activityId=${info.id}`,
        })
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
              'url': app.urlTwo[url],
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
          apiurl: app.urlTwo[url]
        }
      })
    }
  },
  onReady: function() {},
  onHide: function() {},
  onUnload: function() {},
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.enrollList()
    }
  },
  onPullDownRefresh: function() {},
})