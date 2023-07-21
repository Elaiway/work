// pages/message/reward/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ad:"",
    ac_index: 0,
    onshare: false,
    color: "#5DB271",
    commentShow: false, //默认评论框不显示
    comment_list: 5, //限制详情展示评论的数量
    reply: false, //默认不是回复
    plmodal: true,
    comment: "", //默认发布评论内容为空
    reply_userid: "", //默认回复人id为空
    commentId: '', //默认评论id为空
    reply_type: false, //默认无回复id
    receiveShow: true,
    submenu_2: {
      name: '全部评论',
      right_value: "",
      is_wei: true,
      src: '/pages/index/index',
      img: '',
    },
    dharr: [{
        icon: 'icon-shouye',
        name: '首页',
        entry: {
          value: 'singlePage',
          param: 'index'
        }
      },
      {
        icon: 'icon-ruzhu',
        name: '资讯',
        entry: {
          value: 'singlePage',
          param: 'news'
        }
      },
      {
        icon: 'icon-ruzhu',
        name: '商圈',
        entry: {
          value: 'singlePage',
          param: 'business'
        }
      },
      {
        icon: 'icon-zhanghao',
        name: '我的',
        entry: {
          value: 'singlePage',
          param: 'userCenter'
        }
      }
    ],
    position: 'bottomRight',
    buttons: [{
        label: '我的',
        icon: 'icon-zhanghao',
        entry: {
          value: 'singlePage',
          param: 'userCenter'
        }
      },
      {
        label: '商圈',
        icon: 'icon-ruzhu',
        entry: {
          value: 'singlePage',
          param: 'business'
        }
      },
      {
        label: '资讯',
        icon: 'icon-gonggao',
        entry: {
          value: 'singlePage',
          param: 'news'
        }
      },
      {
        label: '首页',
        icon: 'icon-shouye',
        entry: {
          value: 'singlePage',
          param: 'index'
        },
      }
    ],
  },
  buttonClicked(e) {
    console.log('buttonClicked', e.detail)
    const {
      index
    } = e.detail
    app.util.goUrl(this.data.buttons[index].entry)
  },
  bindchange(e) {
    console.log('bindchange', e.detail.value)
  },
  tzurl(e) {
    app.util.goUrl(this.data.dharr[e.currentTarget.id].entry)
  },
  ksdhactive(e) {
    this.setData({
      active: !this.data.active
    })
  },
  // 转发分享
  share(e) {
    this.setData({
      onshare: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(wx.getStorageSync('codeAd'))
    this.setData({
      id: options.id,
      ad:wx.getStorageSync('codeAd')
    })
    app.setNavigationBarColor(this, () => {
      // app.api.prequest({
      //   'url': app.url.yellowConfig,
      //   'cachetime': 30,
      // }).then(res => {
      //   app.setNavigationBarTitle(res.data.field)
      //   that.getInfo()
      //   that.setData({
      //     yellowConfig: res.data,
      //   })
      //   console.log(res)
      // })
      app.isLocation(function() {
        console.log('getlocation')
      })
    });
    // app.setNavigationBarTitle('资讯详情')
    app.api.infomationconfig((info) => {
      console.log('info', info)
      app.setNavigationBarTitle(info.field +'详情')
    })
    // 获取资讯详情
    this.getNewsinfo()
    // 获取用户信息
    app.getUserInfo((userinfo) => {
      this.setData({
        userinfo: userinfo,
      })
    })
  },
  // 获取资讯详情
  getNewsinfo(e) {
    var that = this
    app.api.request({
      url: app.url.infomationInfo,
      data: {
        id: that.data.id
      },
      success: res => {
        console.log("返回的资讯信息为", res)
        var newsInfo = res.data.data
        newsInfo.time = app.util.settime(newsInfo.createdAt)
        newsInfo.customPortrait = JSON.parse(newsInfo.customPortrait)
        newsInfo.media = JSON.parse(newsInfo.media)
        that.setData({
          newsInfo: res.data.data,
          postCommend: res.data.comment,
          comment_close: res.data.comment, //评论是否关闭
        })
        console.log(res.data.comment)
      }
    })
  },
  giveMoney(e) {
    app.getShowmodel("暂时无法支付哦")
  },
  reward(e) {
    // 获取打赏金额
    app.api.prequest({
      'url': app.url.zxReward,
    }).then(res => {
      console.log(res.data)
      if (res.data && app.isLogin()){
        wx.navigateTo({
          url: '/pages/message/reward/index?id=' + this.data.newsInfo.id,
        })
      }
    })
  },
  onChange(e) {
    console.log('onChange', e)
    this.setData({
      visible: e.detail.visible,
    })
  },
  incrementTotal(e) {
    wx.showModal({
      title: '',
      content: '123124',
    })
  },
  // 打开评论
  openpl(e) {
    console.log(e)
    if (e.detail.type == 2) {
      this.setData({
        commentShow: true,
        commentId: e.detail.id,
        reply_type: true,
        reply_user: '回复' + e.detail.name
      })
    } else {
      this.setData({
        reply_user: "请输入文字",
        commentShow: true
      })
    }
  },
  // 关闭评论
  handleClose1() {
    this.setData({
      commentShow: false,
    })
  },
  // 评论详情
  comment_info(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/message/allcomments/index?id=' + this.data.id + '&commentId=' + e.detail,
    })
  },
  // 获取用户输入的评论内容
  getComment(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  // 提交评论
  handleopen1(e) {
    var that = this,
      tzid = that.data.id,
      commentId = that.data.commentId,
      reply_userid = that.data.reply_userid,
      value = that.data.comment,
      reply_type = that.data.reply_type;
    if (reply_type == false) {
      var uid = wx.getStorageSync('users').id,
        replyUserId = ''
    } else {
      var uid = reply_userid,
        replyUserId = wx.getStorageSync('users').id
    }
    console.log('用户id', uid, '信息id', tzid, '评论内容', value, commentId, replyUserId)
    if (value == '') {
      app.util.getShowmodel("请输入评论内容")
    } else {
      // return
      wx.showLoading({
        title: '加载中',
        mask: 1,
      })
      app.api.request({
        'url': app.url.inforcomment,
        'cachetime': '0',
        data: {
          userId: uid,
          infoId: tzid,
          body: value,
          commentId: commentId,
          replyUserId: replyUserId
        },
        method: "POST",
        success: function (res) {
          console.log(res.data)
          wx.hideLoading()
          if (res.data.code == 1) {
            that.getNewsinfo()
            that.setData({
              plmodal: true,
              commentShow: false,
              name: '',
              commentId: '',
              reply_type: false,
              reply_userid: ''
            })
          }
        }
      })
    }

  },
  // 资讯收藏
  collection(e) {
    var that = this
    app.api.request({
      url: app.url.collection_post,
      data: {
        userId: wx.getStorageSync('users').id,
        type: 3,
        postId: that.data.id
      },
      method: 'POST',
      success: res => {
        if (res.data.code == '1') {

        }
      }
    })
  },
  // 资讯点赞
  postPraise(e) {
    var that = this
    if (app.isLogin()) {
      app.api.request({
        url: app.url.praise,
        data: {
          postId: that.data.id,
          userId: wx.getStorageSync('users').id,
          type: 2,
        },
        success: res => {
          console.log('点赞成功的返回信息为', res, that.data)
          if (that.data.newsInfo.love == true) {
            app.util.getShowtoast("取消点赞")
          } 
          else{
            app.util.getShowtoast("点赞成功")
          }
          that.getNewsinfo()
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    this.setData({
      onshare: false,
    })
    app.api.request({
      url: app.url.share,
      data: {
        postId: that.data.id,
      },
      mehod: "POST",
      success: res => {
        console.log('增加分享数量的返回信息为', res)
      }
    })
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '【' + that.data.newsInfo.name + '】' + ' ' + that.data.newsInfo.title,
      imageUrl: that.data.url + that.data.newsInfo.media[0].url || '',
      path: '/pages/message/info/index?id=' + that.data.id,
      success: res => {
        console.log("成功的回调")
      },
      fail: res => {
        console.log("取消的回调")
      },
      complete: res => {
        console.log("每一步都执行")

      }
    }
  },
  onShareTimeline(e) {
    var that = this
    // console.log("点击分享pyq", e)
    return {
      title: that.data.newsInfo.title,
      imageUrl: that.data.url + that.data.newsInfo.media[0].url || '',
      path: '/pages/message/info/index?id=' +  that.data.id,
    }
  }

})