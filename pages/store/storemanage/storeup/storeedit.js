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
    this.setData({
      storeid: options.storeid
    })
    console.log('传过来的值为', options)
    app.setNavigationBarTitle('修改资料')
    app.setNavigationBarColor(this);
    let that = this,
      currentime = app.util.formatTime(new Date).substring(11, 16)
    console.log(currentime, app.globalData)
    that.storeInfo();
    app.getUserInfo(function(userinfo) {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
  },
  storeInfo(e) {
    var that = this,
      id = that.data.storeid,
      sqpindex = 0,
      sqcindex = 0,
      hypindex, hycindex;
    app.api.request({
      url: app.url.bussinessInfo,
      data: {
        id: id,
        userId: wx.getStorageSync('users').id
      },
      success: res => {
        console.log(res)
        //return
        app.setNavigationBarTitle(res.data.data.storeName)
        var storeInfo = res.data.data
        storeInfo.storeLogo = JSON.parse(storeInfo.storeLogo)
        storeInfo.wxImg = JSON.parse(storeInfo.wxImg)
        if (storeInfo.license){
          storeInfo.license = JSON.parse(storeInfo.license)
        }
        let photoList = storeInfo.photoList,
          license = storeInfo.license,
          storeLogo = storeInfo.storeLogo,
          wxImg = storeInfo.wxImg
        for (let i in photoList) {
          photoList[i].url = that.data.url + photoList[i].url
        }
        for (let i in wxImg) {
          wxImg[i].url = that.data.url + wxImg[i].url
        }
        for (let i in storeLogo) {
          storeLogo[i].url = that.data.url + storeLogo[i].url
        }
        if (storeInfo.license){
          for (let i in license) {
            license[i].url = that.data.url + license[i].url
          }
        }
        storeInfo.storeLabel = storeInfo.storeLabel.join(" ");
        that.setData({
          storeInfo: res.data.data,
          address: storeInfo.address,
          lat: storeInfo.lat,
          lng: storeInfo.lng,
          textareavalue: storeInfo.introduce,
          starttime: storeInfo.businessStartTime,
          endtime: storeInfo.businessEndTime,
        })
        //商圈
        app.api.request({
          'url': app.url.getTrade,
          'cachetime': '0',
          data: {
            type: 10
          },
          success: function(res) {
            console.log(res, app.globalData.city.cityName)
            var qgbarr = []
            if (storeInfo.cityId == '0' && storeInfo.zoneId == '0') {
              console.log('全国版')
              qgbarr = [{
                id: '0',
                name: '全国版',
                son: []
              }]
            }
            // else if (storeInfo.cityId != '0' && storeInfo.zoneId == '0') {
            //   console.log('当前城市')
            //   qgbarr = [{ id: '0', name: app.globalData.city.cityName, son: [] }]
            // }
            else {
              console.log('区域商圈')
            }
            console.log('qgbarr', qgbarr)
            //return
            var sqarr = qgbarr.concat(res.data.data);
            for (let i in sqarr) {
              for (let j in sqarr[i].son) {
                sqarr[i].son[j].name = sqarr[i].son[j].tradeName
              }
            }
            for (let i in sqarr) {
              if (sqarr[i].son.length == 0) {
                sqarr[i].son[0] = {
                  name: '',
                  tradeId: '0'
                }
              }
            }
            for (let i in sqarr) {
              for (let j in sqarr[i].son) {
                if (storeInfo.zoneId == sqarr[i].id && storeInfo.tradeId == sqarr[i].son[j].tradeId) {
                  sqpindex = i
                  sqcindex = j
                  break
                }
              }
            }
            console.log(sqarr, sqpindex)
            // return
            var sqMultiArray = [
              [...sqarr],
              [...sqarr[sqpindex] && sqarr[sqpindex].son || []]
            ];
            console.log(sqarr, sqMultiArray, sqpindex, sqcindex)
            //商家分类
            app.api.request({
              'url': app.url.cateGory,
              'cachetime': '0',
              data: {
                type: 2
              },
              success: function(res) {
                var hyarr = res.data.data;
                for (let i in hyarr) {
                  for (let j in hyarr[i].son) {
                    if (storeInfo.typeId == hyarr[i].son[j].id) {
                      hypindex = i
                      hycindex = j
                      break
                    }
                  }
                }
                var MultiArray = [
                  [...hyarr],
                  [...hyarr[hypindex].son]
                ];
                console.log(hyarr, MultiArray, hypindex, hycindex)
                that.setData({
                  sqarr: sqarr,
                  sqobjarr: sqMultiArray,
                  multiIndex: [sqpindex, sqcindex],
                  hyarr: hyarr,
                  hyobjarr: MultiArray,
                  hymultiIndex: [hypindex, hycindex],
                })
              }
            });
          }
        });
      }
    })
  },
  formSubmit: function(e) {
    let that = this,
      co = this.data,
      v = e.detail.value,
      hyPid = co.hyobjarr[0][v.sshy[0]].id,
      hyid = co.hyobjarr[1][v.sshy[1]].id,
      sqPid = co.sqobjarr[0].length ? co.sqobjarr[0][v.sssq[0]].id : '',
      sqid = co.sqobjarr[1].length ? co.sqobjarr[1][v.sssq[1]].tradeId : '',
      logo = this.data.logo,
      wxm = this.data.wxm,
      yyzz = this.data.yyzz,
      xc = this.data.xc,
      lat = co.lat,
      lng = co.lng,
      //rztype = co.rztimearr[v.rzradio],
      label = app.util.testbq(v.label, 3).toString();
    console.log('form发生了submit事件，携带数据为：', co, v, hyPid, hyid, sqPid, sqid, logo, wxm, xc, lat, lng, label, app.util.testbq(v.label, 3))
    var uplogo = [],
      upwxm = [],
      upxc = [],
      upyyzz = [];
    if (logo == null) {
      console.log('没改变logo')
      logo = JSON.parse(JSON.stringify(co.storeInfo.storeLogo))
    } else {
      uplogo = logo
    }
    if (wxm == null) {
      console.log('没改变wxm')
      wxm = JSON.parse(JSON.stringify(co.storeInfo.wxImg))
    } else {
      upwxm = wxm
    }
    if (yyzz == null) {
      console.log('没改变yyzz')
      yyzz = JSON.parse(JSON.stringify(co.storeInfo.license))
    } else {
      upyyzz = yyzz
    }
    if (xc == null) {
      console.log('没改变xc')
      xc = JSON.parse(JSON.stringify(co.storeInfo.photoList))
    } else {
      let arr = [],
        arr1 = [];
      for (let i in xc) {
        if (xc[i].type == null) {
          arr.push(xc[i])
        } else {
          arr1.push(xc[i])
        }
      }
      xc = arr1
      upxc = arr
    }
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
      warn = "请上传商家logo";
    } else if (wxm.length == 0) {
      warn = "请上传客服微信二维码";
    } else if (app.util.isNull(v.textarea)) {
      warn = "请输入商家介绍";
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
      console.log('logo', logo, uplogo, 'wxm', wxm, upwxm, 'xc', xc, upxc, that.data.url)
      // that.setData({
      //   loading: true,
      // })
      var n = [{
        pic_list: uplogo,
        local_list: uplogo.length ? [] : logo,
        uploaded_pic_list: []
      }, {
        pic_list: upwxm,
        local_list: upwxm.length ? [] : wxm,
        uploaded_pic_list: []
      }, {
        pic_list: upxc,
        local_list: xc,
        uploaded_pic_list: []
      }, {
          pic_list: upyyzz,
          local_list: upyyzz.length ? [] : yyzz,
          uploaded_pic_list: []
        }];
      console.log(n)
      a(0)

      function a(o) {
        if (o == n.length) return e();
        if (!n[o].pic_list.length || 0 == n[o].pic_list.length) return a(o + 1);
        console.log(n[o].pic_list)
        app.api.uploadimg({
          imgarr: n[o].pic_list,
          success: res => {
            console.log(res)
            n[o].uploaded_pic_list = res
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
        let storeLogo = n[0].local_list.concat(n[0].uploaded_pic_list),
          wxImg = n[1].local_list.concat(n[1].uploaded_pic_list),
          photoList = n[2].local_list.concat(n[2].uploaded_pic_list),
          license = n[3].local_list.concat(n[3].uploaded_pic_list),
          root = that.data.url;
        for (let i in storeLogo) {
          if (storeLogo[i].url.indexOf(root) != -1) {
            storeLogo[i].url = storeLogo[i].url.substring(root.length);
          }
        }
        for (let i in wxImg) {
          if (wxImg[i].url.indexOf(root) != -1) {
            wxImg[i].url = wxImg[i].url.substring(root.length);
          }
        }
        for (let i in photoList) {
          if (photoList[i].url.indexOf(root) != -1) {
            photoList[i].url = photoList[i].url.substring(root.length);
          }
        }
        for (let i in license) {
          if (license[i].url.indexOf(root) != -1) {
            license[i].url = license[i].url.substring(root.length);
          }
        }
        console.log('请求接口', n, storeLogo, wxImg, photoList, root)
        //return
        //add
        app.api.request({
          'url': app.url.bussinessAdd,
          'cachetime': '0',
          'method': 'POST',
          data: {
            storeId: co.storeid,
            adminId: co.userinfo.id,
            storeName: v.sjmc,
            linkTel: v.tel,
            video: v.video,
            address: v.address,
            lat: lat,
            lng: lng,
            businessStartTime: v.stime,
            businessEndTime: v.etime,
            storeLabel: label,
            storeLogo: JSON.stringify(storeLogo),
            wxImg: JSON.stringify(wxImg),
            photoList: JSON.stringify(photoList),
            license: JSON.stringify(license),
            introduce: v.textarea,
            // mealId: rztype.id,
            // money: rztype.money,
            typePid: hyPid,
            typeId: hyid,
            zoneId: sqPid,
            tradeId: sqid
          },
          success: function(res) {
            if (res.data.code == '1') {
              wx.hideLoading()
              wx.showToast({
                title: '提交成功',
                mask: 1,
              })
              setTimeout(function() {
                wx.navigateBack({})
              }, 1000)
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