// pages/coupon/myreceive.js
const app = getApp();
Page({
  data: {
    key: 0,
    tabs: [{
      name: "全部",
      id: 0,
      type: 0,
    }, {
      name: "进行中",
      id: 1,
      type: 1,
    }, {
      name: "已结束",
      id: 2,
      type: 2,
    }, {
      name: "待审核",
      id: 3,
      type: 3,
    }, ],
    current: '0',
    postList: [],
    mygd: false,
    isget: false,
    params: {
      page: 1,
      size: 10,
      storeId: '',
      type: 0
    },
    statusArray: ['全部', '进行中', '已结束', '待审核'],
    //layouot
    header: {},
    layoutBodyOne: {
      className: 'pad_20',
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        wid: 150,
        hei: 150,
      },
      ft: 1,
    },
    footer: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    options.key && this.setData({
      key: options.key,
      'params.type': options.key,
    })
    app.setNavigationBarColor(this)
    app.setNavigationBarTitle('抢购管理')
  },
  //tabs切换
  onTabsChange(e) {
    // const {
    //   key
    // } = e.detail
    // let types = this.data.tabs.find(item => item.type == key)
    // console.log(this.data.tabs[key].type)
    this.setData({
      postList: [],
      'params.page': 1,
      'params.type': e.detail.key,
      mygd: false,
      isget: false,
    })
    this.getPostlist()
  },
  // 获取列表信息
  getPostlist(e) {
    var that = this,
      params = this.data.params
    console.log(params)
    app.api.prequest({
      'url': app.urlTwo.rushMyList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].showImgs = app.util.getImgUrl(res.data[i].showImgs)
        res.data[i].createdAt = app.util.ormatDate(res.data[i].createdAt).substring(0, 16)
        res.data[i].endTime = app.util.ormatDate(res.data[i].endTime).substring(0, 16)
        res.data[i].tips = this.data.statusArray[res.data[i].state]
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
      var postList = that.data.postList
      postList = postList.concat(res.data)
      that.setData({
        postList: postList,
        isget: true,
      })
    })
  },
  //点击去详情页面
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/rushbuy/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  //关闭弹窗
  handleCancel() {
    this.setData({
      visible: false,
    })
  },
  //领取详情-操作编辑
  clickBtn(e) {
    if (e.currentTarget.dataset.field == 'detail') {
      return wx.navigateTo({
        url: '/pages/rushbuy/manage/receivedetail?id=' + e.currentTarget.dataset.id,
      })
    }
    console.log(this.data.params.type)
    let goodsId = e.currentTarget.dataset.id,
      actions = this.data.params.type == '2' ?
      app.com.getOperation(['share', 'top', 'refresh', 'over', 'upOrDown']) : app.com.getOperation(['share', 'top', 'refresh', 'over', 'upOrDown', 'delete']);
    // actions.forEach(item => {
    //   item.field == 'upOrDown' && (item.name = info.display == 2 ? '上架' : '下架')
    // })
    this.setData({
      visible: true,
      goodsId,
      xzname: "抢购商品ID：" + goodsId,
      actions,
    })
  },
  // 查看用户当前点击的信息
  handleClickItem(e) {
    let item = this.data.actions[e.detail.index],
      goodsId = this.data.goodsId,
      title, url, params;
    console.log(item)
    switch (item.field) {
      case 'delete':
        title = '确定要删除该商品？'
        url = 'rushRushDelGoods'
        params = {
          goodsId: goodsId,
        }
        break;
      case 'upOrDown':
        title = info.display == 2 ? '确定上架吗?' : '确定下架吗?'
        url = 'shopModify'
        params = {
          goodsId,
        }
        break;
      case 'edit':
        wx.navigateTo({
          url: `/pages/rushbuy/manage/release?id=${goodsId}`,
        })
        this.handleCancel()
        return;
    }
    this.setData({
      visible: false,
    })
    if (e.detail.field != 'goPay') {
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
              } else {
                app.util.getShowtoast(res.msg, 1000, 2)
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
    console.log(this.data.key, this.data.params.type)
    this.setData({
      'params.storeId': app.sjdId
    })
    this.onTabsChange({
      detail: {
        key: this.data.params.type
      }
    })
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
      this.getPostlist();
    }
  }
})