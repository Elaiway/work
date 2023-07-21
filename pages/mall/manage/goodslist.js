// pages/job-hunt/myjobhunt.js
const app = getApp();
Page({
  data: {
    tabs: [{
      name: "在售中",
      id: 1,
    }, {
      name: "已下架",
      id: 2,
    },],
    postList: [],
    mygd: false,
    isget: false,
    key: '1',
    params: {
      page: 1,
      size: 10,
      type: '1',
      storeId: ''
    },
    visible: false,
    layoutBodyOne: {
      hd: 1,
      bd: {
        styleName: ''
      },
      img: {
        wid: 150,
        hei: 150,
      },
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarTitle('商品管理')
    app.setNavigationBarColor(this);
  },
  // tabs切换
  onTabsChange(e) {
    const {
      key
    } = e.detail

    this.setData({
      postList: [],
      "params.type": key,
      'params.page': 1,
      mygd: false,
      isget: false,
    })
    this.postList()
  },
  //我的发布列表
  postList(e) {
    let params = this.data.params
    app.api.prequest({
      "url": app.urlTwo.shopGoodsList,
      data: params
    }).then(res => {
      if (res.data.length < 10) {
        this.setData({
          mygd: true,
        })
      } else {
        this.setData({
          'params.page': this.data.params.page + 1,
        })
      }
      let postList = this.data.postList.concat(res.data)
      console.log(res.data)
      this.setData({
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
  handleCancel() {
    this.setData({
      visible: false,
    })
  },
  operation(e) {
    let info = e.currentTarget.dataset.info,
      actions = app.com.getOperation(['share', 'top', 'refresh', 'over'])
    actions.forEach(item => {
      item.field == 'upOrDown' && (item.name = info.display == 2 ? '上架' : '下架')
    })
    this.setData({
      visible: true,
      info,
      xzname: "商品ID：" + info.id,
      actions,
    })
    console.log(info)
  },
  // 查看用户当前点击的信息
  handleClickItem(e) {
    let item = this.data.actions[e.detail.index],
      info = this.data.info,
      title, url, params;
    console.log(item)
    switch (item.field) {
      case 'delete':
        title = '确定要删除该商品？'
        url = 'shopDelGoods'
        params = {
          goodsId: info.id
        }
        break;
      case 'upOrDown':
        title = info.display == 2 ? '确定上架吗?' : '确定下架吗?'
        url = 'shopModify'
        params = {
          goodsId: info.id,
        }
        break;
      case 'edit':
        wx.navigateTo({
          url: `/pages/mall/manage/release?id=${info.id}`,
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
  onShow: function () {
    this.setData({
      'params.storeId': app.sjdId
    })
    this.onTabsChange({
      detail: {
        key: this.data.params.type
      }
    })
  },
  onHide: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.postList()
    }
  }
})