// pages/store/storeentry/storeentry.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rzradiovalue: '0',
    rztimearr: [],
    starttime: '00:00',
    endtime: '12:00',
    multiIndex: [0, 0],
    hymultiIndex: [0, 0],
    isshowpay: false,
    checkboxvalue: true,
  },
  //sq
  bindsqPChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindsqCChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
        sqobjarr: this.data.sqobjarr,
        multiIndex: this.data.multiIndex
      },
      sqarr = this.data.sqarr;
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        data.sqobjarr[1] = sqarr[e.detail.value].son;
        //data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  //hy
  bindhyPChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      hymultiIndex: e.detail.value
    })
  },
  bindhyCChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
        hyobjarr: this.data.hyobjarr,
        hymultiIndex: this.data.hymultiIndex
      },
      hyarr = this.data.hyarr;
    data.hymultiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        data.hyobjarr[1] = hyarr[e.detail.value].son;
        //data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  bindTimesChange: function(e) {
    this.setData({
      starttime: e.detail.value
    })
  },
  bindTimeeChange: function(e) {
    this.setData({
      endtime: e.detail.value
    })
  },
  onChange(field, e) {
    this.setData({
      [field]: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  rzradioonChange(e) {
    console.log(e)
    this.onChange('rzradiovalue', e)
  },
  //
  textareachange(e) {
    console.log(e.detail)
    this.setData({
      textareavalue: e.detail
    })
  },
  //upload
  logoonChange(e) {
    console.log('logoonChange', e)
    this.setData({
      logo: e.detail.fileList,
    })
  },
  //upload
  wxmonChange(e) {
    console.log('wxmonChange', e)
    this.setData({
      wxm: e.detail.fileList,
    })
  },
  //upload
  xconChange(e) {
    console.log('xconChange', e)
    this.setData({
      xc: e.detail.fileList,
    })
  },
  //营业执照
  yyzzonChange(e) {
    console.log('yyzzonChange', e)
    this.setData({
      yyzz: e.detail.fileList,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.Getroute())
    app.setNavigationBarColor(this);
    let that = this,
      currentime = app.util.formatTime(new Date).substring(11, 16)
    console.log(currentime, app.globalData)
    app.api.storeconfig((info) => {
      console.log(info)
      app.setNavigationBarTitle(info.field + '入驻')
      that.setData({
        storeconfig: info,
      })
    })
    app.api.prequest({
      'url': app.url.payConfig,
    }).then((res) => {
      that.setData({
        applePay: res.data.applePay
      })
    })
    app.isLocation(function() {
      var city = app.globalData.city
      console.log('...', city)
      app.api.request({
        url: app.url.adList,
        data: {
          type: 2,
          adType: 1,
          zoneId: city.cityId
        },
        success: res => {
          console.log('播图为', res)
          var imgs = res.data.data
          if (imgs.length != 0) {
            for (let i in imgs) {
              imgs[i].type = 0
              imgs[i].url = that.data.url + imgs[i].url
            }
            that.setData({
              Swiper: {
                "padding": 0,
                "height": app.system.slideNum,
                "maxLimit": 300,
                "minLimit": 100,
                "swiper": {
                  "children": imgs
                }
              }
            })
          }
        }
      })
    })
    app.api.getUserstore({
      data: {
        adminId: wx.getStorageSync('users').id
      },
      success: function(res) {
        console.log(res)
        // if (res.data.data.length != 0) {
        if (res.data.data[0].status == '0') {
          wx.showModal({
            title: '提示',
            // content: '您已提交入驻信息',
            content: '您的门店待审核中',
          })
          setTimeout(function() {
            wx.navigateBack({

            })
          }, 2000)
        }
      },
    })
    //商圈
    app.api.request({
      'url': app.url.getTrade,
      'cachetime': '0',
      data: {
        type: 10
      },
      success: function(res) {
        console.log(res)
        //return
        var sqarr = res.data.data;
        for (let i in sqarr) {
          for (let j in sqarr[i].son) {
            sqarr[i].son[j].name = sqarr[i].son[j].tradeName
          }
        }
        for (let i in sqarr) {
          if (sqarr[i].son.length == 0) {
            sqarr[i].son[0] = {
              name: '',
              tradeId: ''
            }
          }
        }
        var MultiArray = [
          [...sqarr],
          [...sqarr[0] && sqarr[0].son || []]
        ];
        console.log(sqarr, MultiArray)
        that.setData({
          sqarr: sqarr,
          sqobjarr: MultiArray
        })
      }
    });
    //商家分类
    app.api.request({
      'url': app.url.category,
      'cachetime': '0',
      data: {
        type: 2
      },
      success: function(res) {
        var sqarr = res.data.data;
        var MultiArray = [
          [...sqarr],
          [...sqarr[0].son]
        ];
        console.log(sqarr, MultiArray)
        that.setData({
          hyarr: sqarr,
          hyobjarr: MultiArray
        })
      }
    });
    if (wx.getStorageSync('Location') != '') {}
    app.util.getLocation({
      type: '1',
      success: res => {
        console.log(res)
        that.setData({
          lat: res.result.ad_info.location.lat,
          lng: res.result.ad_info.location.lng,
          address: res.result.address
        })
      }
    })
    //入驻套餐
    app.api.request({
      'url': app.url.setmeal,
      'cachetime': '30',
      success: function(res) {
        console.log(res)
        res.data.data.forEach(function(item, index) {
          item.name = item.setName;
          item.value = index;
          item.checked = index == 0;
        })
        that.setData({
          rztimearr: res.data.data,
        })
      },
    })
    app.getUserInfo(function(userinfo) {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
  },
  requestSM(){
    app.api.requestSM('examine').then(res=>{ })
  },
  formSubmit: function(e) {
    app.api.requestSM('examine').then(res=>{
    let that = this,
      co = this.data,
      v = e.detail.value,
      hyPid = co.hyobjarr[0][v.sshy[0]].id,
      hyid = co.hyobjarr[1][v.sshy[1]] ? co.hyobjarr[1][v.sshy[1]].id : '',
      sqPid = co.sqobjarr[0].length ? co.sqobjarr[0][v.sssq[0]].id : '',
      sqid = co.sqobjarr[1].length ? co.sqobjarr[1][v.sssq[1]].tradeId : '',
      logo = this.data.logo || [],
      wxm = this.data.wxm || [],
      xc = this.data.xc || [],
      yyzz = this.data.yyzz || [],
      lat = co.lat,
      lng = co.lng,
      rztype = co.rztimearr[v.rzradio],
      label = app.util.testbq(v.label, 3).toString();
    console.log('form发生了submit事件，携带数据为：', co, v, hyPid, hyid, sqPid, sqid, logo, wxm, xc, lat, lng, label, app.util.testbq(v.label, 3), rztype)
    //校验表单
    let warn = "",
      flag = true;
    if (v.sjmc == '') {
      warn = "请输入商家名称";
    } else if (!app.util.isTelCode(v.tel)) {
      warn = "请输入联系电话";
    } else if (v.address == "" || lat == '' || lng == '') {
      warn = "请定位并输入地址";
    } else if (v.label != '' && !app.util.testbq(v.label, 3)) {
      warn = "最多输入3个标签";
    } else if (logo.length == 0) {
      warn = "请上传logo";
    } else if (wxm.length == 0) {
      warn = "请上传客服微信二维码";
    } else if (app.util.isNull(v.textarea)) {
      warn = "请输入商家介绍";
    } else if (app.util.isNull(v.checkbox)) {
      warn = "请查看用户协议并勾选";
    } else if (hyid == '') {
      warn = "请选择所属行业二级分类";
    } else {
      flag = false;
      wx.showLoading({
        title: "正在提交",
        mask: !0
      });
      that.setData({
        loading: true,
      })
      var n = [{
        pic_list: logo,
        uploaded_pic_list: []
      }, {
        pic_list: wxm,
        uploaded_pic_list: []
      }, {
        pic_list: xc,
        uploaded_pic_list: []
      }, {
          pic_list: yyzz,
          uploaded_pic_list: []
        }];
      console.log(n)
      a(0)

      function a(o) {
        if (o == n.length) return e();
        if (!n[o].pic_list.length || 0 == n[o].pic_list.length) return a(o + 1);
        app.api.uploadimg({
          imgarr: n[o].pic_list,
          success: res => {
            console.log(res)
            n[o].uploaded_pic_list = JSON.stringify(res)
            return a(o + 1)
          }
        })
      }
      // app.api.uploadvideo({
      //   videoarr: [videosrc],
      //   success: res => {
      //     console.log(res)
      //     video = res
      //     e()
      //   }
      // })
      function e() {
        console.log('请求接口', )
        //add
        app.api.request({
          'url': app.url.bussinessAdd,
          'cachetime': '0',
          'method': 'POST',
          data: {
            adminId: co.userinfo.id,
            storeName: v.sjmc,
            linkTel: v.tel,
            address: v.address,
            lat: lat,
            lng: lng,
            businessStartTime: v.stime,
            businessEndTime: v.etime,
            storeLabel: label,
            video: v.video,
            storeLogo: n[0].uploaded_pic_list,
            wxImg: n[1].uploaded_pic_list,
            photoList: n[2].uploaded_pic_list,
            license: n[3].uploaded_pic_list,
            introduce: v.textarea,
            mealId: rztype.id,
            money: rztype.money,
            typePid: hyPid,
            typeId: hyid,
            zoneId: sqPid,
            tradeId: sqid,
            ios: co.applePay == 3 && getApp().phoneInfo.system.indexOf("iOS") > -1 ? 1 : 2,
          },
          success: function(res) {
            if (res.data.code == '1') {
              let rzId = res.data.data
              if (co.applePay == 3 && getApp().phoneInfo.system.indexOf('iOS') > -1){
                wx.hideLoading()
                wx.showToast({
                  title: '入驻成功',
                  mask: 1,
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/store/storemain/storemain',
                  })
                }, 1000)
              }else{
                if (Number(rztype.money) > 0) {
                  wx.hideLoading()
                  that.setData({
                    rzId: rzId,
                    isshowpay: !that.data.ishowpay,
                    payobj: {
                      params: {
                        money: rztype.money,
                        postId: rzId,
                        userId: co.userinfo.id
                      },
                      apiurl: app.url.storePay
                    }
                  })
                } else {
                  wx.hideLoading()
                  wx.showToast({
                    title: '入驻成功',
                    mask: 1,
                  })
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '/pages/store/storemain/storemain',
                    })
                  }, 1000)
                }
              }
            } else {
              wx.hideLoading()
              that.setData({
                loading: false
              })
              wx.showToast({
                title: '请重试',
                duration: 1000,
              })
            }
            console.log('add', res.data)
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
        url: '/pages/store/storemain/storemain',
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