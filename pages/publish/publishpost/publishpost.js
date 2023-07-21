// pages/publish/publishpost.js
var app = getApp(),
  setinfo = require('../../../setinfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payText: '立即发布',
    paymoney: 0,
    fileList: [],
    spradiovalue: '1',
    lcradiovalue: '1',
    isshowpay: false,
    checkboxvalue: true,
    radioarr: [{
        name: '本地视频',
        value: '1',
        checked: true
      },
      {
        name: '视频链接',
        value: '2',
      }
    ],
    lcradioarr: [{
        name: '本地显示',
        value: '1',
        checked: true
      },
      {
        name: '全国显示',
        value: '2',
      }
    ],
    zdinfo: {
      days: "",
      money: ""
    }
  },
  //
  textareachange(e) {
    console.log(e.detail)
    this.setData({
      textareavalue: e.detail
    })
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
    })
  },
  //视频切换
  onChange(field, e) {
    this.setData({
      [field]: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  lcrdioonChange(e) {
    let postFee = this.data.postFee;
    console.log(e, postFee)
    this.onChange('lcradiovalue', e)
    postFee.lc = e.detail.value
    this.setData({
      postFee,
    })
    this.getTotalprice()
  },
  sprdioonChange(e) {
    console.log(e)
    this.onChange('spradiovalue', e)
  },
  videochange(e) {
    console.log('videochange', e)
    this.setData({
      videosrc: e.detail,
    })
  },
  //upload
  uploadonChange(e) {
    console.log('uploadonChange', e)
    this.setData({
      images: e.detail.fileList,
    })
  },
  onPreview(e) {
    console.log('onPreview', e)
    const {
      file,
      fileList
    } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    })
  },
  //选择位置
  chooseLocation: function() {
    var t = this;
    app.util.chooseLocation({
      success: res => {
        console.log(res)
        t.setData({
          address: res.address + res.name,
          lat: res.latitude,
          lng: res.longitude,
        })
      }
    })
  },
  //勾选协议
  clickcheckbox(e) {
    console.log(e.detail)
    this.setData({
      checkboxvalue: e.detail
    })
  },
  //切换置顶开关
  zdswitchChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      zdchecked: e.detail.value,
      visible: e.detail.value,
    })
    this.getTotalprice()
  },
  //选择置顶
  handleClickItem({
    detail
  }) {
    const index = detail.index;
    let that = this,
      zdinfo = this.data.actions[index]
    console.log(index, this.data.actions, zdinfo)
    this.setData({
      zdinfo: zdinfo,
      visible: false,
    })
    this.getTotalprice()
  },
  handleCancel() {
    this.setData({
      visible: false,
      zdchecked: false,
    });
    this.getTotalprice()
  },
  //totalprice
  getTotalprice() {
    let that = this,
      payText,
      co = this.data,
      vipPost = co.vipPost,
      system = app.system,
      lcradiovalue = co.lcradiovalue,
      postFee = co.postFee,
      paymoney = postFee.lc == '2' ? Number(postFee.countryMoney) : Number(postFee.money),
      applePay = co.applePay;
    if (applePay == 3 && getApp().phoneInfo.system.indexOf("iOS") > -1) { //苹果免费模式
      payText = '立即发布'
      paymoney = 0
    } else {
      if (system.openVip && vipPost.freeNum > 0 && (lcradiovalue == 1 && vipPost.local.isFree == 1 || lcradiovalue == 2 && vipPost.country.isFree == 1)) {
        payText = '立即发布 会员免费'
        paymoney = 0
      } else {
        payText = '立即发布' + (paymoney > 0 ? ' ￥' + paymoney : '')
      }
    }
    if (applePay == 3 && getApp().phoneInfo.system.indexOf("iOS") > -1) {
      postFee.vipFreeNum = '免费'
    } else {
      postFee.vipFreeNum = system.openVip && vipPost.freeNum > 0 && (lcradiovalue == 1 && vipPost.local.isFree == 1 || lcradiovalue == 2 && vipPost.country.isFree == 1) ? '会员免费' + vipPost.freeNum + '次' : ''
    }
    that.setData({
      payText,
      paymoney: paymoney,
      postFee,
    })
    console.log(vipPost, system, co.postFee, lcradiovalue, applePay)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this,
      dwcity = app.globalData.city;
    //console.log(app.Getroute(), options, wx.getStorageSync('Location'), dwcity)
    app.setNavigationBarTitle('发布' + options.name)
    app.setNavigationBarColor(this);
    app.getUserInfo(function(userinfo) {
      //console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })

    this.setData({
      id: options.id,
      pId: options.pId,
      dwcity: dwcity,
    })
    if (options.id == null || options.pId == null) {
      wx.showModal({
        title: '提示',
        content: '未获取到分类信息',
      })
      setTimeout(() => {
        wx.navigateBack({

        })
      }, 2000)
    }
    app.api.postconfig((info) => {
      //console.log(info)
      var tabs = [],
        obj = info.postType
      for (let i in obj) {
        //console.log(obj[i])
        if (obj[i] == '图文') {
          tabs.push({
            name: '图文',
            id: '0'
          })
        }
        if (obj[i] == '视频') {
          tabs.push({
            name: '视频',
            id: '1'
          })
        }
        if (obj[i] == '文章') {
          tabs.push({
            name: '文章',
            id: '2'
          })
        }
      }
      app.api.prequest({
        'url': app.url.postFreePost,
        method: 'POST',
        data: {
          typeId: options.id
        },
      }).then((res) => {
        let vipPost = res.data
        app.api.prequest({
          'url': app.url.postAdd,
          data: {
            cid: options.id
          },
        }).then((res) => {
          res.data.expiryDate = info.validDay
          // if (info.infoCharge == '2') {
          //   res.data.money = 0
          // }
          that.setData({
            vipPost,
            postFee: res.data,
            postconfig: info,
            tabs: tabs,
            key: tabs[0].id,
          })
          app.api.prequest({
            'url': app.url.payConfig,
          }).then((res) => {
            that.setData({
              applePay: res.data.applePay
            })
            that.getTotalprice()
          })
        });
      })
    })
    if (wx.getStorageSync('Location') != '') {}
    app.util.getLocation({
      type: '1',
      success: res => {
        //console.log(res)
        that.setData({
          lat: res.result.ad_info.location.lat,
          lng: res.result.ad_info.location.lng,
          address: res.result.address
        })
      }
    })
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems
    });
  },
  formSubmit: function(e) {
    app.api.requestSM('examine').then(res=>{
    let that = this,
      co = this.data,
      key = co.key,
      v = e.detail.value,
      images = this.data.images || [],
      videosrc = this.data.videosrc,
      lat = co.lat,
      lng = co.lng,
      zdinfo = co.zdinfo,
      contentType;
    if (key == '0') {
      contentType = '1'
    }
    if (key == '1') {
      contentType = '3'
    }
    if (key == '2') {
      contentType = '2'
    }
    console.log('form发生了submit事件，携带数据为：', co, co.userinfo, key, contentType, co.id, co.pId, v, images, videosrc, lat, lng, app.util.testbq(v.label, 3).toString(), app.util.testbq(v.label, 3), zdinfo, app.util.isTelCode(v.tel))
    //return
    //校验表单
    let warn = "",
      flag = true;
    if (app.util.isNull(v.textarea)) {
      warn = "请输入发布内容";
    }
    // else if (app.util.isNull(images)&&key=='0') {
    //   warn = "请上传图片";
    // } 
    else if ((app.util.isNull(videosrc) && key == '1' && v.spradio == '1')) {
      warn = "请上传视频";
    } else if (videosrc != '' && key == '1' && v.spradio == '1' && videosrc.duration > 60) {
      warn = "请上传60秒内的视频";
    } else if (app.util.isNull(v.txsplj) && key == '1' && v.spradio == '2') {
      warn = "请粘贴视频链接";
    } else if (app.util.isNull(v.gzhlj) && key == '2') {
      warn = "请粘贴公众号文章链接";
    } else if (v.lxr == "") {
      warn = "请输入联系人";
    } else if (!app.util.isTelCode(v.tel)) {
      warn = "请输入有效的联系电话";
    } else if (v.address == "" || lat == '' || lng == '') {
      warn = "请定位并输入地址";
    } else if (v.label != '' && !app.util.testbq(v.label, 3)) {
      warn = "最多输入3个标签";
    } else if (app.util.isNull(v.checkbox)) {
      warn = "请查看用户协议并勾选";
    } else {
      flag = false;
      that.setData({
        loading: true
      })
      wx.showLoading({
        title: "正在提交",
        mask: !0
      });
      let imgarr = [],
        video = [],
        gzhlj = '';
      if (key == '0') {
        if (images.length == 0) {
          e()
        } else {
          app.api.uploadimg({
            imgarr: images,
            success: res => {
              console.log(res)
              imgarr = res
              e()
            },
            fail: res => {
              that.setData({
                loading: false
              })
            }
          })
        }
      }
      if (key == '1') {
        if (v.spradio == '2') {
          video = [{
            "type": "qqVideo",
            "url": v.txsplj
          }]
          e()
        } else {
          app.api.uploadvideo({
            videoarr: [videosrc.tempFilePath],
            success: res => {
              console.log(res)
              video = res
              e()
            }
          })
        }
      }
      if (key == '2') {
        gzhlj = v.gzhlj
        e()
      }

      function e() {
        //console.log('请求接口', imgarr, JSON.stringify(imgarr), video, JSON.stringify(video), gzhlj)
        //return
        //add
        app.api.request({
          'url': app.url.postAdd,
          'cachetime': '0',
          'method': 'POST',
          data: {
            typePid: co.pId,
            typeId: co.id,
            contentType: contentType,
            title: '',
            body: v.textarea.replace("\n", "↵"),
            media: key == '0' ? JSON.stringify(imgarr) : JSON.stringify(video),
            wechatUrl: gzhlj,
            address: v.address,
            lng: lng,
            lat: lat,
            linkMan: v.lxr,
            linkTel: v.tel,
            postFee: co.paymoney,
            expireTime: co.postFee.expiryDate,
            tag: app.util.testbq(v.label, 3).toString(),
            userId: co.userinfo.id,
            wholeCountry: v.lcradio || '1',
            ios: co.applePay == 3 && getApp().phoneInfo.system.indexOf("iOS") > -1 ? 1 : 2,
            // cityId: co.dwcity.cityId,
            // zoneId: co.dwcity.zoneId,
            //  topEndTime: co.zdinfo.days, topFee: co.zdinfo.money, redBag: '', redBagNum: "", redBagAvg: '', command: '',
          },
          success: function(res) {
            if (res.data.code == '1') {
              let postId = res.data.data
              if (Number(co.paymoney) > 0) {
                wx.hideLoading()
                that.setData({
                  postId: postId,
                  isshowpay: !that.data.ishowpay,
                  payobj: {
                    params: {
                      money: co.paymoney,
                      postId: postId,
                      userId: co.userinfo.id
                    },
                    apiurl: app.url.pay
                  }
                })
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: '发布成功',
                  mask: 1,
                })
                setTimeout(function() {
                  wx.redirectTo({
                    url: 'postsuccess?postId=' + postId,
                  })
                }, 1000)
              }
            } else {
              that.setData({
                loading: false
              })
              wx.showToast({
                icon: "none",
                title: res.data.msg
              })
            }
            //console.log('add', res.data)
          }
        });
      }
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  })
  },
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      wx.redirectTo({
        url: 'postsuccess?postId=' + this.data.postId,
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
  // onShareAppMessage: function () {

  // }
})