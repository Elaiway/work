const app = getApp()
import {
  $wuxGallery
} from '../../wux-weapp/index'
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    content: { // 数组
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: [] // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    max_length: {
      type: String,
      value: "1000"
    },
    control: {
      type: String,
      value: ""
    },
    show_distance: {
      type: String,
      value: ""
    }, //是否显示距离
    show_states: {
      type: String,
      value: "0"
    }, //是否审核状态
    show_commend: {
      type: String,
      value: ""
    }, //是否显示评论
    show_operation: {
      type: String,
      value: ""
    }, //是否显示左边操作栏
    show_zan: {
      type: String,
      value: ""
    }, //是否显示点赞操作
    show_collection: {
      type: String,
      value: ""
    }, //是否显示收藏
    sele_id: {
      type: String,
      value: ""
    },
    color: {
      type: String,
      value: ""
    },
    istop: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    xzname: "请选择置顶信息",
    visible1: false,
    siteroot: app.setInfo.siteroot,
    moreoption: [
      // {
      //   name: "redpaper扩散"
      // },
      {
        name: "分享扩散"
      },
      // {
      //   name: "置顶扩散"
      // },
      // {
      //   name: "刷新信息"
      // },
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
  },
  attached: function() {

    wx.getSystemInfo({
      success: (res)=> {
        console.log(res.platform);     //平台信息
        if (res.platform == 'android'){
          this.setData({
            phoneStatus:true, 
          })
        }
        else if (res.platform == "ios") {   
          this.setData({
            phoneStatus: false,
          })
        }
      }
    })

















    var that = this
    that.setData({
      isLogin: app.globalData.isLogin,
      black: app.globalData.black,
      imgsrc: app.setInfo.siteroot,
      userinfo: wx.getStorageSync('users'),
      imgurl: app.system.url,
      // isios:getApp().phoneInfo.system.indexOf('iOS') > -1,
    })
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    slide(e) {
      var that = this,
        content = that.properties.content,
        id = e.currentTarget.dataset.id,
        index = e.currentTarget.dataset.index
      if (this.data.sele_id == '') {
        that.setData({
          sele_id: id
        })
      } else if (this.data.sele_id != id) {
        that.setData({
          sele_id: id
        })
      } else if (this.data.sele_id == id) {
        that.setData({
          sele_id: ''
        })
      }
    },
    zan(e) {
      if (app.isLogin()) {
        wx.showLoading({
          title: "",
          mask: !0
        })
        app.api.request({
          url: app.url.praise,
          data: {
            postId: e.currentTarget.dataset.id,
            userId: wx.getStorageSync('users').id,
            type: 1,
          },
          success: res => {
            console.log('点赞成功的返回信息为', res)
            if (res.data.code == '1') {
              // app.util.getShowtoast("操作成功")
              this.setData({
                sele_id: ''
              })
              this.triggerEvent("slide", e.currentTarget.dataset.index)
            }
          }
        })

      }
    },
    cancel_collection(e) {
      this.triggerEvent("cancel_collection", e.currentTarget.dataset)
    },
    comment(e) {
      wx.navigateTo({
        url: '/pages/publish/post/infomation/index?id=' + e.currentTarget.dataset.id,
      })
    },
    infomation(e) {
      this.setData({
        sele_id: ''
      })
      wx.navigateTo({
        url: '/pages/publish/post/infomation/index?id=' + e.currentTarget.dataset.id,
      })
    },
    // 置顶
    isTop(e) {
      let that = this;
      console.log('用户选择置顶', e.currentTarget.dataset.id)
      // 查询置顶信息
      app.api.requestSM('top').then(res=>{
      app.api.request({
        url: app.url.top,
        data: {
          postId: e.currentTarget.dataset.id,
        },
        success: res => {
          // console.log(res)
          var postTap = res.data.data
          postTap.forEach(function(item, index) {
            item.name = item.body;
          })
          // console.log("获取到的置顶信息为", postTap)
          that.setData({
            isTop: postTap,
            sele_id: '',
            postId: e.currentTarget.dataset.id,
            operation: 1,
            visible1: true,
            xzname: "请选择置顶类型",
            actions1: postTap
          })
        }
      })
    })
    },
    // 刷新
    refresh(e) {
      app.util.getShowloading()
      var that = this,
        postinfo = e.currentTarget.dataset.id,
        userinfo = that.data.userinfo;
      console.log('用户选择刷新信息', postinfo)
      this.setData({
        sele_id: '',
        postinfo: postinfo,
      })
      //查分类money
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
              wx.hideLoading()
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
    },
    // 更多
    moreoption(e) {
      console.log('用户选择更多', e.currentTarget.dataset)
      var moreoption = this.data.moreoption
      // if (e.currentTarget.dataset.item.isRedBag=='1'){
      //   moreoption=moreoption.slice(1)
      // }
      //console.log(moreoption)
      this.setData({
        postId: e.currentTarget.dataset.id,
        postInfo: e.currentTarget.dataset.item,
        operation: 2,
        visible1: true,
        sele_id: '',
        xzname: "信息ID：" + e.currentTarget.dataset.id,
        actions1: moreoption
      })
    },
    // 查看用户当前点击的信息
    handleClickItem1(e) {
      let that = this,
        index = e.detail.index,
        operation = this.data.operation,
        postId = this.data.postId,
        userinfo = this.data.userinfo,
        moreoption = this.data.actions1,
        morename = moreoption[index].name;
      console.log('用户当前点击的是', operation, postId, morename, userinfo)
      this.setData({
        visible1: false,
        sele_id: ''
      })
      if (operation == 1) {
        var zdinfo = this.data.isTop[index];
        console.log('选择置顶', zdinfo)
        //return
        wx.showLoading({
          title: "正在提交",
          mask: !0
        });
        //maketop
        app.api.request({
          'url': app.url.postTopAdd,
          'cachetime': '0',
          'method': 'POST',
          data: {
            postId: postId,
            topMoney: zdinfo.money,
            topDays: zdinfo.days,
            isTop: 1,
            topId: zdinfo.id,
          },
          success: function(res) {
            if (res.data.code == '1') {
              let oid = res.data.data
              if (Number(zdinfo.money) > 0) {
                wx.hideLoading()
                that.setData({
                  oid: oid,
                  isshowpay: true,
                  payobj: {
                    params: {
                      money: zdinfo.money,
                      orderId: oid,
                      userId: userinfo.id
                    },
                    apiurl: app.url.topPay
                  }
                })
              } else {
                wx.hideLoading()
                that.triggerEvent("newData")
                wx.showToast({
                  title: '操作成功',
                  mask: 1,
                })
              }
            } else {
              wx.hideLoading()
              wx.showToast({
                title: '请重试',
                duration: 1000,
              })
            }
            console.log('add', res.data)
          }
        });
      }
      if (operation == 2) {
        console.log('选择更多')
        if (morename == '分享扩散') {
          wx.navigateTo({
            url: '/pages/publish/post/infomation/index?id=' + postId,
          })
        }
        if (morename == 'redpaper扩散') {
          wx.navigateTo({
            url: '/pages/publish/publishpost/postsuccess?postId=' + postId + '&ispublish=2'
          })
        }
        if (morename == '结束信息') {
          wx.showModal({
            title: '温馨提示',
            content: '确定结束此信息吗？',
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
                    that.triggerEvent("newData")
                  },
                })
              }
            }
          })
        }
        if (morename == '编辑') {
          wx.navigateTo({
            url: '/pages/publish/publishpost/editpost?id=' + postId,
          })
        }
        if (morename == '删除') {
          wx.showModal({
            title: '温馨提示',
            content: '确定删除此信息吗？',
            success(res) {
              if (res.confirm) {
                wx.showLoading({
                  title: '加载中',
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
                    wx.hideLoading()
                    that.triggerEvent("newData")
                  },
                })
              }
            }
          })
        }
      }
    },
    payreturn(e) {
      console.log(e.detail)
      if (e.detail == '1') {
        this.triggerEvent("newData")
        // this.setData({
        //   isshowpay: false,
        // })
      }
    },
    // 取消弹框按钮
    handleCancel(e) {
      this.setData({
        visible1: false,
      })
    },
    // 拨打电话
    phonecall(e) {
      this.setData({
        sele_id: ''
      })
      //触发取消回调
      let tel = e.currentTarget.dataset.tel
      app.util.makePhoneCall(tel)
    },
    // 查看图片
    previewImage(e) {
      let postId = e.currentTarget.dataset.postid,
        media = this.properties.content.find((item) => item.postId == postId).media
      const url = e.currentTarget.dataset.url
      var urls = media.map((item) => {
        return item.url
      });
      // console.log(url,media,urls)
      wx.previewImage({
        current: url,
        urls: urls
      })
    },
    // 拨打电话
    fulltext(e) {
      let index = e.currentTarget.dataset.index,
        content = this.properties.content
      // console.log(index, content)
      content[index].showft = index
      this.setData({
        content: content,
      })
    },
  }
})