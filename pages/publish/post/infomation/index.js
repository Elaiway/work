// pages/location/index.js
const app = getApp()
// var WxParse = require('../../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '分类二',
    onshare: false, //默认分享组件不显示
    commentShow: false, //默认评论框不显示
    isshowpay: false,
    userStore: [],
    comment_list: 3, //限制详情展示评论的数量
    color: "#5DB271",
    infomationVisible: false,
    siteroot: app.setInfo.siteroot,
    actions1: [
      // {
      //   name: "redpaper扩散"
      // },
      {
        name: "分享扩散"
      },
      {
        name: "置顶信息"
      },
      {
        name: "刷新信息"
      },
      {
        name: "结束信息"
      },
      {
        name: "编辑"
      },
      {
        name: "删除"
      }
    ],
    reply: false, //默认不是回复
    plmodal: true,
    comment: "", //默认发布评论内容为空
    reply_userid: "", //默认回复人id为空
    commentId: '', //默认评论id为空
    reply_type: false, //默认无回复id
    receiveShow: true,
  },
  /**
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 》》》》》》》》》》》》》》》》》》》》评论模块《《《《《《《《《《《《《《《《《《《《《《《《《《
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   */
  // 评论列表
  getCommentlist(postId) {
    var that = this
    app.api.request({
      url: app.url.commentList,
      data: {
        postId: postId
      },
      success: res => {
        console.log("本条信息的评论列表为", res)
        if (res.data.code == '1') {
          for (let i in res.data.data) {
            res.data.data[i].creatTime = app.util.settime(res.data.data[i].creatTime)
          }
          that.setData({
            postCommend: res.data.data
          })
        }
      }
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
        'url': app.url.comment,
        'cachetime': '0',
        data: {
          userId: uid,
          postId: tzid,
          body: value,
          commentId: commentId,
          replyUserId: replyUserId
        },
        method: "POST",
        success: function(res) {
          console.log(res.data)
          wx.hideLoading()
          if (res.data.code == 1) {
            that.postInfo()
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
  /**
   * 
   * 
   * 
   * 
   * 
   * 
   * 》》》》》》》》》》》》》》》》》》》》redpaper模块《《《《《《《《《《《《《《《《《《《《《《《《《《
   * 
   * 
   *
   *
   *
   *
   */
  // redpaper逻辑(1、用户未领取redpaper  直接展示领取redpaper界面 点击立即领取之后展示领取成功/失败界面 领取状态存储到receiveState里,未刷新页面时根据receiveState状态调用对应的领取成功/失败界面)
  // redpaper逻辑(2、用户已经领取redpaper后再次进入页面,把已领取的redpaper金额存储到receiveState里,点击页面的领取redpaper时根据receiveState的状态调用领取成功的界面)
  // 展示领取redpaper界面
  redEnvelopes(e) {
    this.setData({
      receiveShow: false, //redpaper领取显示与隐藏
    })
  },
  // 获取redpaper领取列表
  getRedList(e) {
    app.api.request({
      url: app.url.redList,
      data: {
        postId: this.data.id,
      },
      success: res => {
        console.log(res)
        this.setData({
          receiveList: {
            url: '/pages/aunt/index?id=' + this.data.id + '&portrait=' + this.data.postInfo.portrait + '&userName=' + this.data.postInfo.userName,
            money: res.data.redMoney,
            redNum: res.data.allcount,
            num: res.data.getcount,
            list: res.data.data
          }
        })
      }
    })
  },
  // 领取redpaper 
  redPacket(e) {
    wx.showLoading({
      title: '领取中...',
      mask: 1,
    })
    app.api.request({
      url: app.url.receiveRed,
      data: {
        postId: this.data.id,
        user_id: wx.getStorageSync('users').id
      },
      method: "POST",
      success: res => {
        console.log(res)
        // 用户领取redpaper成功
        if (res.data.code == 1) {
          this.setData({
            receiveShow: false, //redpaper领取显示与隐藏
            receive: {
              receive: "1", //0代表可以领取,1代表领取成功,2代表redpaper已经抢完
              hbMoney: res.data.money, //redpaper金额
              hbUser: '', //redpaper发布人
              syMoney: "0", //当前redpaper剩余金额
              name: ''
            },
            receiveState: {
              isReveice: "1", //0代表未领取1代表已领取2代表领取失败
              money: '', //领取redpaper的金额
            }
          })
          wx.hideLoading()
          this.getRedList()
        } else {
          this.setData({
            receiveShow: false, //redpaper领取显示与隐藏
            receive: {
              receive: "2", //0代表可以领取,1代表领取成功,2代表redpaper已经抢完
              hbMoney: '', //redpaper金额
              hbUser: '', //redpaper发布人
              syMoney: "0", //当前redpaper剩余金额
              name: ''
            },
          })
          wx.hideLoading()
        }
      }
    })
  },
  // 关闭redpaper
  closeReceive(e) {
    console.log("开启/关闭领取redpaper")
    this.setData({
      receiveShow: !this.data.receiveShow
    })
  },
  lookMore(e) {
    this.setData({
      receiveShow: !this.data.receiveShow
    })
    wx.navigateTo({
      url: '/pages/aunt/index?id=' + this.data.id + '&portrait=' + this.data.postInfo.portrait + '&userName=' + this.data.postInfo.userName,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      id: options.id,
      xzname: "信息ID：" + options.id,
      ad:wx.getStorageSync('codeAd')
    })
    // 判断用户是通过什么渠道进来的
    if (options.receive == null) {
      that.setData({
        receiveShow: true, //redpaper领取显示与隐藏
        // receive: {
        //     receive: "1", //0代表可以领取,1代表领取成功,2代表redpaper已经抢完
        //     hbMoney: "10.00",//redpaper金额
        //     hbUser: "当当",//redpaper发布人
        //     syMoney: "0",//当前redpaper剩余金额
        // },
      })
    }
    // 获取用户信息
    app.getUserInfo(function(userinfo) {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
    app.setNavigationBarColor(that, () => {
      // console.log(getApp().system)
      this.setData({
        system: getApp().system
      })
      // 获取信息设置
      this.getPostconfig()
      app.isLocation(function() {
        console.log('getlocation')
      })
    });
    app.pageOnLoad(that);
    app.setNavigationBarTitle('详情页')
    that.setData({
      classification: [{
          name: '分类1',
          color: "red"
        },
        {
          name: '分类1',
          color: "orange"
        },
        {
          name: '分类1',
          color: "green"
        }
      ]
    })
    // 获取信息置顶信息
    that.getPosttop()
    // 查看用户是否已经收藏信息
    that.getCollection()
  },
  /**
   * 
   * 
   * 
   * 
   * 
   * 
   * 》》》》》》》》》》》》》》》》》》》》详情信息模块《《《《《《《《《《《《《《《《《《《《《《《《《《
   * 
   * 
   *
   *
   *
   *
   */
  // 获取信息设置
  getPostconfig(e) {
    var that = this
    app.api.postconfig((info) => {
      console.log(info)
      // if (info.contactCharge == 'open') {
      //   var alreadyCharge = false
      // } else {
      //   var alreadyCharge = true
      // }
      that.setData({
        comment_close: info.comment, //评论是否关闭
        tel_close: info.phoneShowed, //信息电话是否显示
        // tel_charge: info.contactCharge, //信息电话是否收费
        // alreadyCharge: false, //用户是否付费
        // charge: info.charge, //收费金额
        share_title: info.title, //分享标题
        share_img: info.shareImg, //分享图标
        share_detail: info.shareDescription, //分享描述
        postConfig: info,
      })
      if (info.top == 'close') {
        this.data.actions1.splice(1, 1)
      }
      // 获取信息详细信息
      that.postInfo()
    })
  },
  // 查看用户是否已经收藏该信息
  getCollection(e) {
    console.log("点击了")
    var that = this
    app.api.request({
      url: app.url.collection,
      data: {
        postId: that.data.id,
        userId: wx.getStorageSync('users').id
      },
      success: res => {
        console.log("用户的收藏结果为", res)
        if (res.data.code == '1') {
          that.setData({
            foot_menu: {
              _left: [{
                  img: '/assets/images/img/index.png',
                  name: '首页',
                  src: "/pages/index/index",
                  navigateType: '3',
                  type: 0
                },
                {
                  img: '/assets/images/img/fabu.png',
                  name: '发布',
                  src: "/pages/publishtype/publishtype",
                  navigateType: '3',
                  type: 0
                },
                {
                  img: '/assets/images/img/collection.png',
                  not_img: '/assets/images/img/collection.png',
                  sele_img: '/assets/images/img/iscollection.png',
                  name: '收藏',
                  isCollection: res.data.data,
                  src: "/pages/index/index",
                  type: 1
                },
                // {
                //     img: '/assets/images/img/sixin.png',
                //     name: '私信',
                //     src: "/pages/message/index/index",
                //     type: 0
                // }
              ],
              postId: that.data.id,
              _right: "评论",
              right_type: '0',
              right_tel: '',
              _rightsrc: '/pages/message/index/index',
              color: this.data.color
            },
          })
        }
      }
    })
  },
  // 获取信息详细信息
  postInfo(e) {
    var that = this
    app.api.request({
      url: app.url.postIndex,
      data: {
        postId: that.data.id
      },
      success: res => {
        console.log(res.data.data)
        var postInfo = res.data.data[0]
        // json字符串转json格式
        try {
          postInfo.media && (postInfo.media = JSON.parse(postInfo.media))
        } catch (e) {
          postInfo.media.length == 900 && (postInfo.media = JSON.parse(postInfo.media + '"}]'))
        }
        postInfo.customPortrait && (postInfo.customPortrait = JSON.parse(postInfo.customPortrait))
        postInfo.creatTime = app.util.settime(postInfo.creatTime)
        // 判断body是否是公众号文本
        if (postInfo.contentType == '2') {
          // WxParse.wxParse('article', 'html', postInfo.wechatContent, that, 5);
        }
        // 判断body是否是富文本
        if (app.util.checkHtml(postInfo.body) == true) {
          postInfo.checkHtml = true
          // WxParse.wxParse('article', 'html', postInfo.body, that, 5);
        } else {
          postInfo.checkHtml = false
          postInfo.body = postInfo.body.replace("↵", "\n");
        }
        // 加密发布人手机号
        postInfo.userTel = postInfo.linkTel;
        postInfo.linkTel = postInfo.linkTel.substr(0, 3) + '****' + postInfo.linkTel.substr(7);
        if (postInfo.tag != '') {
          postInfo.tag = postInfo.tag.split(",")
          postInfo.label = []
          postInfo.tag.map((item, index) => {
            var obj = {}
            obj.name = item
            obj.color = app.util.bg1(index)
            postInfo.label.push(obj)
          })
        }
        if (postInfo.isRedBag == '1') {
          // 是redpaper帖子
          if (postInfo.getRedmoney > '0') {
            // 用户已经领取了redpaper了
            that.setData({
              receive: {
                receive: "1", //0代表可以领取,1代表领取成功,2代表redpaper已经抢完
                hbMoney: postInfo.getRedmoney, //redpaper金额
                hbUser: postInfo.userName, //redpaper发布人
                syMoney: "0", //当前redpaper剩余金额
                name: that.data.system.name
              },
              receiveState: {
                isReveice: "1", //0代表未领取1代表已领取2代表领取失败
                money: postInfo.getRedmoney, //领取redpaper的金额
              }
            })
          } else {
            // 用户已经还没有领取redpaper
            that.setData({
              receive: {
                receive: "0", //0代表可以领取,1代表领取成功,2代表redpaper已经抢完
                hbMoney: postInfo.redmoney, //redpaper金额
                hbUser: postInfo.userName, //redpaper发布人
                syMoney: "0", //当前redpaper剩余金额
                name: that.data.system.name
              },
              receiveState: {
                isReveice: "0", //0代表未领取1代表已领取2代表领取失败
                money: '', //领取redpaper的金额
              }
            })
          }
          that.data.actions1.splice(0, 1)
        }
        // 获取该用户的店铺信息
        that.postStore(postInfo.ReleaseId)
        // 获取当前信息的评论列表
        that.getCommentlist(postInfo.postId)
        that.setData({
          submenu_2: {
            name: '全部评论',
            right_value: "更多",
            is_wei: true,
            src: '/pages/publish/post/commentlist/index?id=' + postInfo.postId,
            img: ''
          },
          postInfo: postInfo, //信息详情
          dz: res.data.dz, //点赞数量
          count: res.data.count, //发布数量
          love: res.data.love,
          submenu_1: {
            name: postInfo.userName + '的店铺',
            right_value: "更多",
            is_wei: false,
            src: '/pages/personal/homepage/index?user_id=' + postInfo.ReleaseId,
            img: ''
          },
        })
        that.getRedList()
        app.api.request({
          'url': app.url.postAdd,
          data: {
            cid: postInfo.typeId
          },
          success: function(res) {
            console.log(res.data, Number(res.data.data.contactCharge))
            let tel_charge = '',
              alreadyCharge;
            if ((postInfo.cityId != '0' && Number(res.data.data.contactCharge) > 0) || (postInfo.cityId == '0' && Number(res.data.data.countryContactCharge)) > 0) {
              tel_charge = 'open'
              alreadyCharge = false;
            } else {
              alreadyCharge = true;
            }
            that.setData({
              tel_charge: tel_charge,
              alreadyCharge: alreadyCharge,
              postFee: res.data.data,
              lookmoney: postInfo.cityId == '0' ? res.data.data.countryContactCharge : res.data.data.contactCharge
            })
          }
        });
      }
    })
  },
  /**
   * 
   * 
   * 
   * 
   * 
   * 
   * 》》》》》》》》》》》》》》》》》》》》帖子发布人店铺《《《《《《《《《《《《《《《《《《《《《《《《《《
   * 
   * 
   *
   *
   *
   *
   */
  // 获取用户的店铺信息
  postStore(userId) {
    var that = this,
      userStore = that.data.userStore
    app.api.getUserstore({
      data: {
        adminId: userId
      },
      success: res => {
        that.setData({
          load: true,
          userStore: res.data.data,
        })
      }
    })
  },
  // 获取信息置顶信息
  getPosttop(e) {
    var that = this
    app.api.request({
      url: app.url.top,
      data: {
        postId: that.data.id,
      },
      success: res => {
        console.log(res)
        var postTap = res.data.data
        for (let i in postTap) {
          postTap[i].name = postTap[i].body
        }
        console.log("获取到的置顶信息为", postTap)
        that.setData({
          postTap: res.data.data,
          isTop: postTap
        })
      }
    })
  },
  // 信息点赞
  postPraise(e) {
    var that = this
    if (app.isLogin()) {
      app.api.request({
        url: app.url.praise,
        data: {
          postId: that.data.id,
          userId: wx.getStorageSync('users').id,
          type: 1,
        },
        success: res => {
          console.log('点赞成功的返回信息为', res)
          if (that.data.love == '2') {
            app.util.getShowtoast("点赞成功")
          } else {
            app.util.getShowtoast("取消点赞")
          }
          that.postInfo()
        }
      })

    }
  },
  // 拨打电话
  makephone1(e) {
    let that = this
    console.log(that.data)
    switch (that.data.alreadyCharge) {
      case true:
        app.util.makePhoneCall(that.data.postInfo.userTel)
        break;
      case false:
        if (that.data.tel_charge == 'open') {
          if (app.isLogin()) {
            //会员套餐免费查看电话
            app.api.request({
              'url': app.url.postFreeLook,
              data: {
                postId: that.data.postInfo.postId,
              },
              'method': 'POST',
              success: res => {
                let postFreeLook = res.data.data
                if (postFreeLook.isFree == 1) {
                  wx.showModal({
                    title: '提示',
                    content: `您可免费查看电话${postFreeLook.freeNum}次`,
                    success(res) {
                      if (res.confirm) {
                        app.util.getShowtoast()
                        // 查看帖子去付费
                        app.api.request({
                          url: app.url.lookPay,
                          data: {
                            postId: that.data.id,
                            money: that.data.lookmoney,
                          },
                          method: "POST",
                          success: res => {
                            that.setData({
                              alreadyCharge: true
                            })
                            app.util.makePhoneCall(that.data.postInfo.userTel)
                          }
                        })
                        console.log('用户点击确定')
                      }
                    }
                  })
                } else {
                  wx.showModal({
                    title: '温馨提示',
                    content: '查看此信息电话需要收取' + that.data.lookmoney + '元哦',
                    success: res => {
                      if (res.confirm) {
                        app.util.getShowtoast()
                        that.setData({
                          isshowpay: true,
                          telPay: true,
                          payobj: {
                            params: {
                              money: that.data.lookmoney,
                              postId: that.data.id,
                            },
                            apiurl: app.url.lookPay
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        } else {
          app.util.makePhoneCall(this.data.postInfo.userTel)
        }
        break;
    }
  },
  // 
  onChange(e) {
    this.setData({
      current: e.detail.key,
    })
  },
  // 转发分享
  share(e) {
    this.setData({
      onshare: true
    })
  },
  // 帖子海报
  poster(e) {
    this.setData({
      onshare: true
    })
    return
    wx.navigateTo({
      url: '/pages/publish/post/infomation/canvasapi?id=' + this.data.id,
    })
  },
  // 查看地理位置
  getLocation(e) {
    app.util.openlocation({
      latitude: this.data.postInfo.lat,
      longitude: this.data.postInfo.lng,
      name: this.data.postInfo.userName,
      address: this.data.postInfo.address
    })
  },
  // 扩散信息
  spread_info(e) {
    var res = wx.getSystemInfoSync()
    console.log(res,this.data.actions1)
     
      //  this.data.actions1.forEach(item=>{
      //   if(res.platform == 'IOS'){
      //     if(item.name=='置顶信息' || item.name=='刷新信息'){
      //       item.status=false
      //     }
      //     else{
      //       item.status=true
      //     }
      //   }else{
      //     item.status=true
      //   }

      //  })

    console.log(res,this.data.actions1)
    this.setData({
      infomationVisible: true,
      actions: this.data.actions1
    })
  },
  // 查看图片
  previewImage(e) {
    const index = e.currentTarget.dataset.index
    const media = this.data.postInfo.media
    var urls = []
    media.map((item) => {
      var obj = {}
      obj = this.data.url + item.url
      urls.push(obj)
    })
    wx.previewImage({
      current: urls[index],
      urls: urls
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
  // 开启/关闭分享
  closepop(e) {
    this.setData({
      infomationVisible: false,
      selectTop: false
    })
  },
  /*
      ================================  扩散信息  ================================
   */
  addTop(option) {
    // console.log(option)
    // return
    var that = this,
      userinfo = that.data.userinfo
    wx.showLoading({
      title: "正在提交",
      mask: !0
    });
    this.setData({
      selectTop: false
    })
    app.api.request({
      'url': app.url.postTopAdd,
      'cachetime': '0',
      'method': 'POST',
      data: {
        postId: that.data.id,
        topMoney: option.money,
        topDays: option.days,
        isTop: 1,
        topId: option.id
      },
      success: function(res) {
        if (res.data.code == '1') {
          let oid = res.data.data
          if (Number(option.money) > 0) {
            wx.hideLoading()
            that.setData({
              oid: oid,
              isshowpay: !that.data.ishowpay,
              payobj: {
                params: {
                  money: option.money,
                  orderId: oid,
                  userId: userinfo.id
                },
                apiurl: app.url.topPay
              }
            })
          } else {
            wx.showToast({
              title: '操作成功',
              mask: 1,
            })
          }
        } else {
          wx.showToast({
            title: '请重试',
            duration: 1000,
          })
        }
      }
    });
  },
  // 查看用户当前点击的信息
  handleClickItem1(e) {
    let that = this,
      index = e.detail.index,
      postId = that.data.id, //信息id
      isTop = that.data.isTop,
      selectTop = that.data.selectTop, //用户是否选择置顶
      userinfo = that.data.userinfo,
      moreoption = that.data.actions1,
      morename = moreoption[index].name,
      postinfo = that.data.postInfo;
    console.log('用户当前点击的是', postId, morename, userinfo)
    this.setData({
      infomationVisible: false,
    })
    if (selectTop == true) {
      console.log('用户选择了置顶某条信息', isTop[index])
      that.addTop(isTop[index])
    } else {
      if (morename == '置顶信息') {
        app.api.requestSM('top').then(res=>{
        that.setData({
          actions: that.data.isTop,
          infomationVisible: true,
          selectTop: true,
        })
      })
      } else if (morename == '刷新信息') {
        app.api.request({
          'url': app.url.postAdd,
          data: {
            cid: postinfo.typeId
          },
          success: function(res) {
            let typeInfo = res.data.data
            //查会员套餐免费刷新
            app.api.request({
              'url': app.url.postFreeRefresh,
              data: {
                postId: postinfo.postId,
              },
              'method': 'POST',
              success: res => {
                let postFreeRefresh = res.data.data
                if (postFreeRefresh.isFree == 1) {
                  wx.showModal({
                    title: '提示',
                    content: `您可免费刷新${postFreeRefresh.freeNum}次`,
                    success(res) {
                      if (res.confirm) {
                        //刷新下单
                        app.api.request({
                          'url': app.url.postRefresh,
                          data: {
                            postId: postinfo.postId,
                          },
                          'method': 'POST',
                          success: fres => {
                            console.log(fres.data)
                            if (fres.data.data.money != null && fres.data.data.money == 0) {
                              app.util.getShowtoast('刷新成功', 1000)
                              that.triggerEvent("newData")
                            }
                          },
                        })
                        console.log('用户点击确定')
                      }
                    }
                  })
                } else {
                  //刷新下单
                  app.api.request({
                    'url': app.url.postRefresh,
                    data: {
                      postId: postinfo.postId,
                    },
                    'method': 'POST',
                    success: fres => {
                      console.log(fres.data)
                      if (fres.data.data.money != null && fres.data.data.money == 0) {
                        app.util.getShowtoast('刷新成功', 1000)
                        that.triggerEvent("newData")
                      } else {
                        let sxmoney = postinfo.cityId == '0' ? typeInfo.countryRefreshMoney : typeInfo.refreshMoney
                        wx.showModal({
                          title: '刷新信息',
                          content: '刷新信息需要支付' + sxmoney + '元,您确认要刷新选定的信息吗？',
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
                                    postId: postinfo.postId,
                                  },
                                  apiurl: app.url.postRefresh
                                }
                              })
                            } else if (res.cancel) {
                              console.log('用户点击取消')
                            }
                          }
                        })
                      }
                    },
                  })
                }
              }
            })
          }
        });
      } else if (morename == '结束信息') {
        wx.showModal({
          title: '温馨提示',
          content: '确定结束此条信息吗？结束后将隐藏您的联系方式',
          success(res) {
            if (res.confirm) {
              wx.showLoading({
                title: '加载中',
                mask: 1
              })
              app.api.request({
                'url': app.url.postEnd,
                'cachetime': '0',
                data: {
                  postId: postId
                },
                method: "POST",
                success: function(res) {
                  console.log(res)
                  wx.hideLoading()
                  wx.redirectTo({
                    url: '/pages/publish/postindex/infomation/index?id=' + that.data.id,
                  })
                },
              })
            }
          }
        })
      } else if (morename == '编辑') {
        wx.navigateTo({
          url: '/pages/publish/publishpost/editpost?id=' + that.data.id,
        })
      } else if (morename == 'redpaper扩散') {
        wx.navigateTo({
          url: '/pages/publish/publishpost/postsuccess?postId=' + that.data.id + '&ispublish=2'
        })
      } else if (morename == '删除') {
        wx.showModal({
          title: '温馨提示',
          content: '确定删除此条信息吗？删除后平台将不会展示本条信息',
          success(res) {
            if (res.confirm) {
              wx.showLoading({
                title: '正在删除',
                mask: 1
              })
              app.api.request({
                'url': app.url.destroy,
                'cachetime': '0',
                data: {
                  postId: postId
                },
                method: "POST",
                success: function(res) {
                  console.log(res)
                  if (res.data.code == 1) {
                    wx.reLaunch({
                      url: '/pages/index/index',
                    })
                  } else {
                    app.util.getShowtoast("删除失败")
                  }
                  wx.hideLoading()
                },
              })
            }
          }
        })
      } else if (morename == '分享扩散') {
        that.setData({
          onshare: true
        })
      }
    }

  },
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      //查看电话支付回调
      if (this.data.telPay) {
        this.setData({
          alreadyCharge: true
        })
      } else {
        this.postInfo()
      }
      // this.setData({
      //   isshowpay: false,
      // })
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
    var that = this,
      shareImg = this.data.share_img
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
        console.log('增加分享数量的返回信息为', res, shareImg)
      }
    })
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '【' + that.data.postInfo.typeName + '】' + ' ' + that.data.postInfo.body.substr(0, 30).replace(/<\/?.+?>/g, ""),
      // imageUrl: shareImg==''?'':shareImg,
      path: '/pages/publish/post/infomation/index?id=' + that.data.id + '&receive=' + '1',
    }
  },
  onShareTimeline(e) {
    // console.log("点击分享pyq", e)
    return {
      title: this.data.postInfo.body,
      imageUrl:app.util.getTypeImgsUrl(this.data.postInfo.media)[0].url,
      path: '/pages/publish/post/infomation/index?id=' + this.data.id + '&receive=' + '1',
    }
   }
})