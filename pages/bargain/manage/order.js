// pages/mall/order.js
var app = getApp();
Page({
  data: {
    key: 0,
    tabs: [{
        name: "全部",
        id: 0,
        state: 0,
      },
      {
        name: "进行中",
        id: 1,
        state: 2,
      },
      {
        name: "已结束",
        id: 2,
        state: 4,
      },
      {
        name: "待审核",
        id: 3,
        state: 1,
      },
    ],
    postList: [],
    params: {
      size: 10,
      page: 1,
      state: 0,
      word: '',
      storeId: '',
    },
    statusArray: ['全部', '待审核', '进行中', '已下架', '已结束'],
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
  onLoad: function(options) {
    var that = this;
    options.key && this.setData({
      key: options.key,
      'params.type': options.key,
    })
    app.setNavigationBarTitle('砍价管理')
    app.setNavigationBarColor(this);
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    this.setData({
      key: e.detail.key,
      postList: [],
      'params.page': 1,
      'params.state': this.data.tabs[e.detail.key].state,
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
      'url': app.urlTwo.bargainMyBargain,
      data: params,
    }).then(res => {
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      res.data.forEach(item => {
        item.img = app.util.getSingleImgUrl(item.logo)
        item.tips = this.data.statusArray[item.state];
        item.createdAt = app.util.ormatDate(item.createdAt).substring(0, 16)
        item.endTime = app.util.ormatDate(item.endTime).substring(0, 16)
      })
      var postList = that.data.postList
      postList = postList.concat(res.data)
      that.setData({
        postList: postList,
        isget: true,
      })
    })
  },
  handleCancel() {
    this.setData({
      visible: false,
    })
  },
  clickBtn(e) {
    if (e.currentTarget.dataset.field == 'detail') {
      return wx.navigateTo({
        url: '/pages/bargain/manage/orderdetail?id=' + e.currentTarget.dataset.id,
      })
    }
    let goodsId = e.currentTarget.dataset.id,
      actions = app.com.getOperation(['delete', 'share', 'top', 'refresh', 'over', 'upOrDown'])
    // actions.forEach(item => {
    //   item.field == 'upOrDown' && (item.name = info.display == 2 ? '上架' : '下架')
    // })
    this.setData({
      visible: true,
      goodsId,
      xzname: "拼团商品ID：" + goodsId,
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
        url = 'groupDelGoods'
        params = {
          goodsId,
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
          url: `/pages/bargain/manage/release?id=${goodsId}`,
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
                      key: this.data.params.type
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
          key: this.data.params.status
        }
      })
    }
  },
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/bargain/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  onShow: function() {
    this.setData({
      'params.storeId': app.sjdId
    })
    this.onTabsChange({
      detail: {
        key: this.data.key
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