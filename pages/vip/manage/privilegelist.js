// pages/job-hunt/myjobhunt.js
const app = getApp();
Page({
  data: {
    tabs: [{
      name: "进行中",
      id: 1,
    }, {
      name: "待审核",
      id: 2,
    }, {
      name: "已拒绝",
      id: 3,
    }, {
      name: "已下架",
      id: 4,
    }, ],
    postList: [],
    mygd: false,
    isget: false,
    key: '1',
    params: {
      page: 1,
      size: 10,
      state: '1',
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
  onLoad: function(options) {
    app.setNavigationBarTitle('特权管理')
    app.setNavigationBarColor(this);
  },
  // tabs切换
  onTabsChange(e) {
    const {
      key
    } = e.detail

    this.setData({
      postList: [],
      "params.state": key,
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
      "url": app.urlTwo.myPrivilege,
      data: params
    }).then(res => {
      res.data.forEach(item => {
        item.logo = app.util.getSingleImgUrl(item.logo)
        item.week && (item.week = item.week.split(',').map(item => {
          return {
            name: app.com.changeWeek(item),
            id: item
          }
        }).map(item => item.name).toString())
      })
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
  goodinfo(e) {
    wx.navigateTo({
      url: '/pages/vip/privilegedetails?id=' + e.currentTarget.dataset.id,
    })
  },
  // 查看用户当前点击的信息
  operation(e) {
    let info = e.currentTarget.dataset.info,
      field = e.currentTarget.dataset.name,
      title, url, params;
    console.log(info, field)
    switch (field) {
      case 'delete':
        title = '确定要删除该商品？'
        url = 'shopDelGoods'
        params = {
          goodsId: info.id
        }
        break;
      case 'upOrDown':
        title = info.display == 2 ? '确定上架吗?' : '确定下架吗?'
        url = 'privilegeDisplay'
        params = {
          id: info.id,
          display: info.display == 2 ? 1 : 2
        }
        break;
      case 'edit':
        wx.navigateTo({
          url: `/pages/vip/manage/release?id=${info.id}`,
        })
        return;
      case 'receiveList':
        wx.navigateTo({
          url: `/pages/extra/commonlist?params=${JSON.stringify({ name:'特权领取列表',id:info.id})}`,
        })
        return;
    }
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
                      key: this.data.params.state
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
  onShow: function() {
    this.setData({
      'params.storeId': app.sjdId
    })
    this.onTabsChange({
      detail: {
        key: this.data.params.state
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
      this.postList()
    }
  }
})