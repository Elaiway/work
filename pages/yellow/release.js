// pages/yellow/sett.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rzradiovalue: '0',
    lcradiovalue: '1',
    rztimearr: [],
    starttime: '00:00',
    endtime: '12:00',
    sqIndex: [0, 0],
    hyIndex: [0, 0],
    isshowpay: false,
    checkboxvalue: true,
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
    params: {
      name: '',
      tel: '',
      address: '',
      lat: '',
      lng: '',
      introduce: '',
      mealId: '',
    }
  },
  // //qy
  // bindsqPChange: function(e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     sqIndex: e.detail.value
  //   })
  // },
  // //hy
  // bindhyPChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     hyIndex: e.detail.value
  //   })
  // },
  bindsqCChange: function(e) {
    this.commonChange(e, 'sqMarr', 'sqIndex', 'sqarr')
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },
  bindhyCChange: function(e) {
    this.commonChange(e, 'hyMarr', 'hyIndex', 'hyarr')
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },
  //公用change事件
  commonChange(e, a, b, c) {
    var data = {
        [a]: this.data[a],
        [b]: this.data[b]
      },
      arr = this.data[c];
    console.log(data)
    data[b][e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        data[a][1] = arr[e.detail.value].son;
        data[b][1] = 0;
        break;
    }
    this.setData(data);
  },
  //单选
  rzradioonChange(e) {
    console.log(e)
    this.setData({
      rzradiovalue: e.detail.value
    })
  },
  lcrdioonChange(e) {
    console.log(e)
    this.setData({
      lcradiovalue: e.detail.value
    })
    this.setMeal()
  },
  setMeal() {
    app.api.prequest({
      'url': app.url.yellowMeal,
      data: {
        cityId: this.data.lcradiovalue == 1 ? app.globalData.city.cityId : 0
      }
    }).then(res => {
      console.log(res)
      res.data.forEach(function(item, index) {
        item.name = item.setName;
        item.value = index;
        item.checked = index == 0;
      })
      this.setData({
        rztimearr: res.data,
      })
    })
  },
  //
  textareachange(e) {
    console.log(e.detail)
    this.setData({
      'params.introduce': e.detail
    })
  },
  //uploadChange
  uploadChange(e) {
    this.setData({
      [`uploadArr[${e.currentTarget.dataset.idx}].uploadList`]: e.detail.fileList,
    })
    console.log(e, this.data.uploadArr)
  },
  //选择位置
  chooseLocation: function() {
    var t = this;
    app.util.chooseLocation({
      success: res => {
        console.log(res)
        t.setData({
          'params.address': res.address + res.name,
          'params.lat': res.latitude,
          'params.lng': res.longitude,
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
    app.setNavigationBarColor(this);
    let currentime = app.util.formatTime(new Date).substring(11, 16)
    console.log(currentime, app.globalData)
    app.api.yellow((res) => {
      app.setNavigationBarTitle('入驻' + res.field)
      let uploadArr = [{
            tips: '请上传商家logo或门头图',
            title: '商家logo',
            count: '1',
            fileList: [],
            uploadList: [],
            show: true
          },
          {
            tips: '请上传客服微信二维码',
            title: '客服微信二维码',
            count: '1',
            fileList: [],
            uploadList: [],
            show: res.code == 'open'
          },
          {
            tips: '最多可上传6张照片',
            title: '商家相册',
            count: '6',
            fileList: [],
            uploadList: [],
            show: res.photoList == 'open'
          },
        ],
        filterArr = []
      if (res.code != 'open') filterArr.push('qrcode')
      if (res.photoList != 'open') filterArr.push('photoList')
      if (res.introduce != 'open') filterArr.push('introduce')
      this.setData({
        yellowConfig: res,
        uploadArr,
        isEdit: options.id > 0,
        id: options.id,
        filterArr,
      })
    })
    console.log(options)
    //商圈
    app.api.prequest({
      'url': app.url.getTrade,
    }).then(res => {
      console.log(res)
      //return
      if (res.data.length>0){
        this.setData({
          isShowQuyu:'1'
        })
        var sqarr = res.data;
        for (let i in sqarr) {
          if (sqarr[i].son.length == 0) {
            sqarr[i].son[0] = {
              name: '',
              tradeId: ''
            }
          } else {
            for (let j in sqarr[i].son) {
              sqarr[i].son[j].name = sqarr[i].son[j].tradeName
            }
          }
        }
        var MultiArray = [
          [...sqarr],
          [...sqarr[0].son]
        ];
      }
      //console.log(sqarr, MultiArray)
      //商家分类
      app.api.prequest({
        'url': app.url.category,
        data: {
          type: 8
        },
      }).then(res => {
        var hyarr = res.data;
        var hyMultiArray = [
          [...hyarr],
          [...hyarr[0].son]
        ];
        console.log(hyarr, hyMultiArray)
        this.setData({
          sqarr: sqarr,
          sqMarr: MultiArray,
          hyarr: hyarr,
          hyMarr: hyMultiArray
        })
        //黄页详情用于渲染编辑
        if (options.id) {
          app.api.prequest({
            'url': app.url.yellowAdd,
            'method': 'POST',
            data: {
              id: options.id
            },
          }).then(res => {
            let detailInfo = res.data,
              sqpindex = 0,
              sqcindex = 0,
              hypindex = 0,
              hycindex = 0;
            //渲染基本输入框数据
            for (let k in this.data.params) {
              this.setData({
                [`params.${k}`]: detailInfo[k],
              })
            }
            //渲染图片
            let uploadArr = this.data.uploadArr
            uploadArr[0].fileList = uploadArr[0].uploadList = app.util.getTypeImgsUrl(detailInfo.logo, 'empty')
            uploadArr[1].fileList = uploadArr[1].uploadList = app.util.getTypeImgsUrl(detailInfo.qrcode, 'empty')
            uploadArr[2].fileList = uploadArr[2].uploadList = app.util.getTypeImgsUrl(detailInfo.photoList, 'empty')
            this.setData({
              uploadArr,
            })
            for (let i in sqarr) {
              for (let j in sqarr[i].son) {
                if (detailInfo.zoneId == sqarr[i].id) {
                  sqpindex = i
                  break
                }
              }
            }
            for (let i in hyarr) {
              for (let j in hyarr[i].son) {
                if (detailInfo.typeId == hyarr[i].son[j].id) {
                  hypindex = i
                  hycindex = j
                  break
                }
              }
            }
            if (this.data.sqMarr){
              this.setData({
                sqMarr: [
                  [...sqarr],
                  [...sqarr[sqpindex].son]
                ],
                sqIndex: [sqpindex, sqcindex],
              })
            }
            this.setData({
              hyMarr: [
                [...hyarr],
                [...hyarr[hypindex].son]
              ],
              hyIndex: [hypindex, hycindex],
            })
            console.log(res.data)
          });
        }
      });
    });
    options.id || app.util.getLocation({
      type: '1',
      success: res => {
        console.log(res)
        this.setData({
          'params.lat': res.result.ad_info.location.lat,
          'params.lng': res.result.ad_info.location.lng,
          'params.address': res.result.address
        })
      }
    })
    //入驻套餐
    this.setMeal()
    app.getUserInfo(userinfo => {
      console.log(userinfo)
      this.setData({
        'params.tel': userinfo.userTel,
        userinfo: userinfo,
      })
    })
  },
  formSubmit: function(e) {
    console.log(this.data.sqMarr)
    let that = this,
      co = this.data,
      v = e.detail.value,
      rztype = co.rztimearr[v.rzradio],
      params = {
        storeId: co.id || '',
        mealId: co.isEdit ? co.params.mealId : rztype && rztype.id,
        typePid: co.hyMarr[0][v.sshy[0]].id,
        typeId: co.hyMarr[1][v.sshy[1]] ? co.hyMarr[1][v.sshy[1]].id : '',
        zoneId: co.sqMarr && co.sqMarr[0][v.sssq[0]].id || '',
        userId: co.userinfo.id,
        name: v.name,
        tel: v.tel,
        address: v.address,
        lat: co.params.lat,
        lng: co.params.lng,
        logo: co.uploadArr[0].uploadList,
        qrcode: co.uploadArr[1].uploadList,
        photoList: co.uploadArr[2].uploadList,
        introduce: v.introduce || '',
      }
    console.log('form发生了submit事件，携带数据为：', co, v, rztype, params)
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['storeId','zoneId'].concat(co.filterArr),
      tips: {
        mealId: '请选择入驻套餐',
        typePid: '请选择所属行业',
        typeId: '请选择所属行业二级分类',
        // zoneId: '请选择所属区域',
        userId: '缺少用户id',
        name: '请输入商家名称',
        tel: '请输入联系电话',
        address: '请选择地址',
        logo: '请上传商家logo',
        qrcode: '请上传客服微信',
        photoList: '请上传商家相册',
        introduce: '请输入商家简介',
      }
    })
    console.log(judgeData)
    //校验表单
    let warn = "",
      flag = true;
    if (!judgeData) {
      return
    } else if (!app.util.isTelCode(v.tel)) {
      warn = "请输入合理的联系电话";
    } else if (app.util.isNull(v.checkbox)) {
      warn = "请查看用户协议并勾选";
    } else {
      //return
      flag = false;
      app.util.getShowloading('提交中')
      that.setData({
        loading: true,
      })
      Promise.all(co.uploadArr.map(item => {
        return app.api.wxUploadImg(item.uploadList)
      })).then(res => {
        console.log(res)
        params.logo = JSON.stringify(res[0])
        params.qrcode = JSON.stringify(res[1])
        params.photoList = JSON.stringify(res[2])
        //add
        app.api.prequest({
          'url': app.url.yellowAdd,
          'method': 'POST',
          data: params,
        }).then(res => {
          if (res.code == '1') {
            let rzId = res.data
            if (!co.isEdit && Number(rztype.money) > 0) {
              that.setData({
                rzId: rzId,
                isshowpay: true,
                payobj: {
                  params: {
                    money: rztype.money,
                    yellowId: rzId,
                  },
                  apiurl: app.url.yellowPay
                }
              })
            } else {
              app.util.getShowtoast('操作成功')
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/yellow/myrecord',
                })
              }, 1000)
            }
          } else {
            app.util.getShowtoast(res.msg, 1000, 1)
            that.setData({
              loading: false
            })
          }
          console.log('add', res.data)
        });
      })
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
        url: '/pages/yellow/myrecord',
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  onHide: function() {

  }
})