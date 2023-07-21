// pages/activity/index.js
const app = getApp();
Page({
  data: {
    mycardList: [],
    mygd: false,
    isget: false,
    isshowpay: false,
    visible: false,
    // isios: getApp().phoneInfo.system.indexOf('iOS') > -1,
    params: {
      page: 1,
      size: 10,
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    app.setNavigationBarTitle('我的名片')
    app.setNavigationBarColor(this);
    // 获取用户信息
    app.getUserInfo((userinfo) => {
      that.setData({
        userinfo: userinfo,
      })
    })
    that.mycardList()
  },

  //我的名片列表
  mycardList(e) {
    let that = this,
      params = this.data.params;
    app.api.prequest({
      "url": app.url.businesscardMyList,
      data: params,
    }).then(res => {
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
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      let mycardList = that.data.mycardList
      mycardList = mycardList.concat(res.data)
      that.setData({
        mycardList,
        isget: true,
      })
      // console.log(res.data, that.data.mycardList)
    })
  },
  //创建名片
  oncreatcard(e) {
    wx.navigateTo({
      url: '/pages/businesscard/release',
    })
  },
  //编辑名片
  editcard(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `/pages/businesscard/release?id=${e.currentTarget.dataset.id}`,
    })
  },
  //置顶名片
  onTop(e) {
    console.log(e.currentTarget.dataset.info)
    let info = e.currentTarget.dataset.info
    this.setData({
      visible: true,
      info,
      id: info.id,
      xzname: "名片ID：" + info.id,
    })
    app.api.prequest({
      url: app.url.businesscardCardTop,
      data: {
        cardId: this.data.id
      },
    }).then(res => {
      console.log(res)
      let postTap = res.data
      for (let i in postTap) {
        postTap[i].name = postTap[i].body
      }
      console.log("获取到的置顶信息为", postTap)
      this.setData({
        postTap: res.data,
        isTop: postTap,
        actions: postTap,
      })
    })
  },
  //续期名片
  onrenewal(e) {
    let xuqi = e.currentTarget.dataset.xuqi
    this.setData({
      visible: true,
      xuqi,
      cityId: xuqi.cityId,
      id: xuqi.id,
      xzname: (this.data.cityId > 0 ? "本地" : "全国") + " - 名片ID：" + xuqi.id,
    })
    app.api.prequest({
      'url': app.url.businesscardSetmeal,
      data: {
        wholeCountry: this.data.cityId > 0 ? 1 : 2
      }
    }).then(res => {
      console.log(res.data)
      let renew = res.data
      for (let i in renew) {
        renew[i].name = renew[i].setName
      }
      console.log("获取到的置顶信息为", renew)
      this.setData({
        renew: res.data,
        isRenew: renew,
        actions: renew,
      })
    })
  },
  // 取消弹框按钮
  handleCancel() {
    this.setData({
      visible: false,
    })
  },
  // 查看用户当前点击的信息
  handleClickItem(e) {
    let item = this.data.actions[e.detail.index],
      info = this.data.info,
      that = this,
      title, url, params,
      index = e.detail.index,
      isTop = that.data.isTop,
      isRenew = that.data.isRenew;
    console.log(item)
    if (isTop) {
      this.addTop(isTop[index])
      this.handleCancel()
    }
    if (isRenew) {
      this.addRenew(isRenew[index])
      this.handleCancel()
    }
  },
  //调用置顶方法
  addTop(option) {
    console.log(option)
    // return
    let that = this
    app.util.getShowloading('提交中')
    that.setData({
      loading: true,
    })
    app.api.prequest({
      'url': app.url.businesscardCardIsTop,
      'cachetime': '0',
      'method': 'POST',
      data: {
        cardId: that.data.id,
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
              apiurl: app.url.businesscardCardTopPay
            }
          })
        } else {
          app.util.getShowtoast('操作成功')
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/businesscard/mycard',
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
  //调用续期方法
  addRenew(option) {
    console.log(option)
    // return
    let that = this
    app.util.getShowloading('提交中')
    that.setData({
      loading: true,
    })
    app.api.prequest({
      'url': app.url.businesscardStoreRenew,
      'cachetime': '0',
      'method': 'POST',
      data: {
        cardId: that.data.id,
        mealId: option.id,
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
                renewId: oid,
              },
              apiurl: app.url.renew_pay
            }
          })
        } else {
          app.util.getShowtoast('操作成功')
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/businesscard/mycard',
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
          url: '/pages/businesscard/mycard',
        })
      }, 1000)
    }
  },
  //发布动态
  onrelease(e) {
    wx.navigateTo({
      url: '/pages/publishtype/publishtype',
    })
  },
  //我的店铺
  onshop(e) {
    // console.log(this.data)
    let that = this;
    if (that.data.userinfo) {
      app.api.prequest({
        "url": app.url.userStore,
        data: {
          adminId: that.data.userinfo.id
        }
      }).then(res => {
        let userStoreId = res.data[0].id
        that.setData({
          userStoreId,
        })
        wx.navigateTo({
          url: '/pages/store/storemain/storedetail?id=' + userStoreId,
        })
      })
    }
  },
  //名片排行
  onranking(e) {
    wx.navigateTo({
      url: '/pages/businesscard/index',
    })
  },
  goDl(e){
    wx.navigateTo({
      url: '/pages/businesscard/carddetail?id='+e.currentTarget.dataset.id,
    })
  },
  onShow() {},
  onHide() {},
  onPullDownRefresh() {},
  onReachBottom() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.mycardList()
    }
  }
})