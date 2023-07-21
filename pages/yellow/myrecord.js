// pages/yellow-page/myrecord.js
var app = getApp();
Page({
  data: {
    key: "0",
    tabs: [{
        name: "拨打记录",
        id: 0
      },
      {
        name: "我的收藏",
        id: 1
      },
      {
        name: "我的发布",
        id: 2
      }
    ],
    page: 1,
    postList: [],
    mygd: false,
    isget: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarColor(this);
    app.api.prequest({
      'url': app.url.yellowConfig,
      'cachetime': 30,
    }).then(res => {
      app.setNavigationBarTitle('我的记录—' + res.data.field)
      that.setData({
        yellowConfig: res.data,
      })
      console.log(res)
    })
    console.log(options)
    that.getPostlist()
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)

    this.setData({
      key,
      index,
      postList: [],
      page: 1,
      mygd: false,
      isget: false,
    })
    this.getPostlist()
  },

  // 获取信息列表信息
  getPostlist(e) {
    var that = this,
      params = {
        page: that.data.page,
        size: this.data.key != 2 ? 10 : '',
        //sort: that.data.tabs[that.data.key].sort,
      },
      rqquesturl;
    if (this.data.key == 0) {
      rqquesturl = app.url.yellowCall
    } else if (this.data.key == 1) {
      rqquesturl = app.url.yellowCollect
      params = {
        type: 6
      }
    } else if (this.data.key == 2) {
      rqquesturl = app.url.yellowIssue
    }
    console.log(params)
    app.api.prequest({
      'url': rqquesturl,
      data: params,
    }).then(res => {
      // console.log('yellowIssue', res)
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].logo = app.util.getImgUrl(res.data[i].logo)
      }
      if (res.data.length < 10 || this.data.key == 2) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          page: that.data.page + 1,
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
  //点击取消收藏
  cancelColl: function(e) {
    let postId = e.detail,
      that = this;

    console.log("ID", postId)

    wx.showModal({
      title: '取消收藏',
      content: '确认取消收藏吗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.getShowloading('提交中')
          //maketop
          app.api.prequest({
            url: app.url.collection_post,
            method: "POST",
            data: {
              postId: postId,
              type: 6,
            }
          }).then(res => {
            console.log(res)
            if (res.code == '1') {
              that.onTabsChange({
                detail: {
                  key: 1
                }
              })
              app.util.getShowtoast("操作成功")
            } else {
              app.util.getShowtoast("请重试")
            }
            console.log('add', res)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  operation(e) {
    let title = '',
      url = '',
      params = {}
    switch (e.detail.field) {
      case 'down':
        title = `确定要${e.detail.content.show == '1' ? '下' : '上'}架该信息吗？`
        url = 'yellowShow'
        params = {
          id: e.detail.content.id,
          show: e.detail.content.show == '1' ? 2 : 1
        }
        break;
      case 'edit':
        wx.navigateTo({
          url: '/pages/yellow/release?id=' + e.detail.content.id,
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
              } else {
                app.util.getShowtoast(res.msg, 1000, 1)
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    console.log(e.detail)
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
      this.getPostlist();
    }
  }
})