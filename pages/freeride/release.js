// pages/freeride/index/.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: '0',
    wholeCountry: '1',
    isshowpay: false,
    checkboxvalue: true,
    cartype: [{
        name: "单次拼车"
      },
      {
        name: "长期拼车"
      }
    ],
    lcradioarr: [{
        name: '本地',
        value: '1',
        checked: true
      },
      {
        name: '全国',
        value: '2',
      }
    ],
    params: {
      startPlace: '',
      endPlace: '',
      wayAddress: '',
      rideTime: '',
      weight: '',
      num: '',
      startTime: '',
      endTime: '',
      linkMan: '',
      linkTel: '',
      type: '1',
      data: {},
      other: '',
      typeId: '',
      lcradiovalue: '1',
    },
    fieldArr: [{
        className: 'bgSku',
        hdt: '起',
        hdn: '出发地',
        placeholder: '请输入出发地址',
        value: 'startPlace',
        name: 'startPlace',
        type: 'input',
        hidden: false,
      },
      {
        className: 'bgRed',
        hdt: '终',
        hdn: '目的地',
        placeholder: '请输入到达地址',
        value: 'endPlace',
        name: 'endPlace',
        type: 'input',
        hidden: false,
      },
      {
        className: 'bgYellow',
        hdt: '经',
        hdn: '途径地',
        placeholder: '请输入中途经过地址，可不填',
        value: 'wayAddress',
        name: 'wayAddress',
        type: 'input',
        hidden: false,
      },
      {
        className: 'icon-yingyeshijian',
        hdn: '开始时间',
        placeholder: '请输入开始时间',
        value: 'startTime',
        name: 'startTime',
        type: 'date',
        hidden: true,
      },
      {
        className: 'icon-yingyeshijian',
        hdn: '结束时间',
        placeholder: '请输入结束时间',
        value: 'endTime',
        name: 'endTime',
        type: 'date',
        hidden: true,
      },
      {
        className: 'icon-yingyeshijian',
        hdn: '出发时间',
        placeholder: '请输入出发时间',
        value: 'rideTime',
        name: 'rideTime',
        type: 'date',
        hidden: false,
        categoryKey: '',
      },
      {
        className: 'icon-geren2',
        hdn: '剩余座位',
        placeholder: '请输入剩余座位数量(位）',
        value: 'num',
        name: 'num',
        type: 'input',
        hidden: false,
      },
      {
        className: 'icon-geren2',
        hdn: '车辆信息',
        placeholder: '请输入车辆信息(辆)',
        value: 'weight',
        name: 'weight',
        type: 'input',
        hidden: false,
      },
      {
        className: 'icon-zhanghao',
        hdn: '联系人',
        placeholder: '请输入联系人',
        value: 'linkMan',
        name: 'linkMan',
        type: 'input',
        hidden: false,
      },
      {
        className: 'icon-dianhua1',
        hdn: '联系电话',
        placeholder: '请输入联系电话',
        value: 'linkTel',
        name: 'linkTel',
        type: 'input',
        hidden: false,
      },
      {
        className: 'icon-icon-',
        hdn: '选择区域',
        value: 'lcradiovalue',
        name: 'lcradiovalue',
        type: 'radio',
        hidden: false,
      },
      {
        className: 'icon-bianjianxia',
        hdn: '备注信息',
        placeholder: '简要补充其他说明：如上车时间，上车地点等等，为了保护隐私，请不要填写手机号和QQ',
        value: 'other',
        name: 'other',
        type: 'textarea',
        hidden: false,
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      typeId: options.id,
      name: options.name
    })
    if (options.name == '货找车') {
      //显示货物信息
      this.setData({
        'fieldArr[2].hidden': true,
        'fieldArr[6].hidden': true,
        'fieldArr[7].hdn': '货物信息',
        'fieldArr[7].placeholder': '请输入货物信息（吨）',
      })
    } else if (options.name == '车找货') {
      //显示车辆信息&&显示途径地
      this.setData({
        'fieldArr[6].hidden': true,
      })
    } else if (options.name == '车找人') {
      //显示剩余座位&&显示途径地
      this.setData({
        'fieldArr[7].hidden': true,
      })
    } else if (options.name == '人找车') {
      //显示乘车人数
      this.setData({
        'fieldArr[2].hidden': true,
        'fieldArr[7].hidden': true,
        'fieldArr[6].hdn': '乘车人数',
        'fieldArr[6].placeholder': '请输入乘车人数(位)',
      })
    }
    console.log(that.data.typeId, that.data.name, this.data.fieldArr)
    app.api.freeCar((res) => {
      app.setNavigationBarTitle('发布' + that.data.name + '-' + res.field)
      let filterArr = []
      if (this.data.params.type == '1') filterArr.push('startTime', 'endTime')
      if (options.name == '货找车') filterArr.push('num', 'wayAddress')
      if (options.name == '车找货') filterArr.push('num')
      if (options.name == '车找人') filterArr.push('weight')
      if (options.name == '人找车') filterArr.push('weight', 'wayAddress')
      if (options.id && options.name) filterArr.push('id')
      if (res.openCountry == 'close') filterArr.push('wholeCountry')
      console.log(this.data.params.type)
      that.setData({
        freeCarSet: res,
        filterArr,
        isEdit: options.detailId > 0,
      })
      console.log(res.openCountry, this.data.fieldArr)
      if (res.openCountry == 'open') {
        this.setData({
          'fieldArr[10].hidden': false,
        })
      } else {
        this.setData({
          'fieldArr[10].hidden': true,
        })
      }
    })
    app.setNavigationBarColor(this, () => {
      app.isLocation(function() {
        app.util.getLocation({
          type: "0",
          success: res => {
            console.log(res)
          }
        })
        console.log('getlocation')
      })
    });
    //请求顺风车分类列表
    app.api.prequest({
      'url': app.url.freeCategoryInfo,
      data: {
        typeId: this.data.typeId
      }
    }).then(res => {
      console.log('顺风车分类详情', res.data)
      //本地价格和全国价格
      this.setData({
        moneyObj: res.data,
        releaset: res.data.local.release
      })
    })
    //请求顺风车分类下的标签
    app.api.prequest({
      'url': app.url.freeCategoryLab,
      data: {
        categoryId: this.data.typeId
      }
    }).then(res => {
      console.log('顺风车分类下的标签', res.data)
      this.setData({
        tags: res.data,
        // labelsDefault: ['挖掘机车', '摩托车'],
      })

    //顺风车详情用于渲染编辑
    if (options.detailId) {
      console.log('编辑', options.detailId, options.id)
      this.setData({
        detailId: options.detailId
      })
      app.api.prequest({
        'url': app.url.freeSaveCar,
        'method': 'POST',
        data: {
          carId: options.detailId
        },
      }).then(res => {
        let detailInfo = res.data
        console.log(res.data)
        //渲染基本输入框数据
        for (let k in this.data.params) {
          this.setData({
            [`params.${k}`]: detailInfo[k],
          })
        }
        //渲染选择长期短期拼车
        if (detailInfo.type == '2') {
          this.oncartype({
            currentTarget: {
              dataset: {
                index: 1
              }
            }
          })
        }
        console.log(detailInfo.data)
        let labelsarr = []
        for (let k in detailInfo.data) {
          labelsarr.push(detailInfo.data[k])
          // console.log(detailInfo.data[k])
        }
        //渲染时间日期
        this.setData({
          "params.startTime": app.util.ormatDate(detailInfo.startTime).substring(0, 16),
          "params.endTime": app.util.ormatDate(detailInfo.endTime).substring(0, 16),
          "params.rideTime": detailInfo.rideTime,
          labelsDefault: labelsarr,
          "params.lcradiovalue": '1',
          lcradioarr: [{
              name: '本地',
              value: '1',
              disabled: true,
              checked: true
            },
            {
              name: '全国',
              disabled: true,
              value: '2',
            }
          ]
        })
        console.log(this.data.labelsDefault, detailInfo.data)
      })
    }
  })
  },
  //拼车分类
  oncartype(e) {
    let longCar = this.data.cartype.longCar
    this.setData({
      current: e.currentTarget.dataset.index,
      'params.type': e.currentTarget.dataset.index + 1
    })
    if (e.currentTarget.dataset.index == 1) {
      console.log('长期拼车')
      this.setData({
        'fieldArr[3].hidden': false,
        'fieldArr[4].hidden': false,
        'fieldArr[5].type': 'time',
        'params.rideTime': '08:00'
      })
    } else {
      this.setData({
        'fieldArr[3].hidden': true,
        'fieldArr[4].hidden': true,
        'fieldArr[5].type': 'date',
      })
      console.log('单次')
    }
    console.log(this.data.params.type, e.currentTarget.dataset.index)
  },
  //备注说明
  textareachange(e) {
    console.log(e.detail)
    this.setData({
      'params.other': e.detail
    })
  },
  //日期选择
  timePickerChange(e) {
    console.log(e)
    this.setData({
      [`params.${e.currentTarget.dataset.field}`]: e.detail
    })
  },
  //时间选择
  bindTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      'params.rideTime': e.detail.value
    })
  },
  //选择本地或全国
  lcrdioonChange(e) {
    this.setData({
      'params.lcradiovalue': e.detail.value
    })
    let releaset
    if (e.detail.value == '2') {
      console.log('全国')
      releaset = this.data.moneyObj.country.release
    } else {
      console.log('本地')
      releaset = this.data.moneyObj.local.release
    }
    this.setData({
      releaset,
    })
    console.log(e, this.data.params.lcradiovalue)
  },
  labelChange(e) {
    let j = {}
    e.detail.map(v => {
      j[v.id] = v.name
    })
    this.setData({
      'params.data': j
    })
    console.log('labelChange', j)
  },
  //勾选协议
  clickcheckbox(e) {
    console.log(e.detail)
    this.setData({
      checkboxvalue: e.detail
    })
  },
  formSubmit: function(e) {
    let that = this,
      co = this.data,
      v = e.detail.value,
      params = {
        typeId: co.typeId,
        startPlace: v.startPlace,
        wayAddress: v.wayAddress,
        endPlace: v.endPlace,
        rideTime: v.rideTime,
        num: v.num,
        weight: v.weight,
        other: v.other || '',
        startTime: co.params.type == 2 ? v.startTime : '',
        endTime: co.params.type == 2 ? v.endTime : '',
        type: co.params.type,
        data: co.params.data && JSON.stringify(co.params.data),
        wholeCountry: co.freeCarSet.openCountry == 'open' ? co.params.lcradiovalue : '',
        linkMan: v.linkMan,
        linkTel: v.linkTel,
        id: co.detailId > 0 ? co.detailId : '',
      }
    console.log('form发生了submit事件，携带数据为：', co, v, params)
    //return
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['other', 'data','wayAddress'].concat(co.filterArr),
      tips: {
        typeId: '缺少typeId',
        startPlace: '请输入出发地址',
        endPlace: '请输入到达地址',
        startTime: '请选择开始时间',
        endTime: '请选择结束时间',
        rideTime: '请选择出发时间',
        num: '请输入剩余座位数量（位）',
        weight: '请输入车辆信息（辆）',
        linkMan: '请输入联系人名称',
        linkTel: '请输入联系电话',
      }
    })
    console.log(judgeData)
    //校验表单
    let warn = "",
      flag = true;
    if (!judgeData) {
      return
    } else if (!app.util.isTelCode(v.linkTel)) {
      warn = "请输入合理的联系电话";
    } else if (co.params.type =='2' && co.params.startTime >= co.params.endTime) {
      warn = "请选择合理的开始时间";
    } else if (app.util.isNull(v.checkbox)) {
      warn = "请查看用户协议并勾选";
      //如果开始时间大于结束时间
    } else {
      flag = false;
      console.log("表单校验完成")
      //return
      app.util.getShowloading('提交中')
      that.setData({
        loading: true,
      })
      app.api.prequest({
        'url': app.url.freeSaveCar,
        'method': 'POST',
        data: params,
      }).then(res => {
        if (res.code == '1') {
          let rzId = res.data
          if (!co.isEdit && Number(this.data.releaset) > 0) {
            that.setData({
              rzId: rzId,
              isshowpay: true,
              payobj: {
                params: {
                  money: this.data.releaset,
                  carId: rzId,
                },
                apiurl: app.url.freeCarPay
              }
            })
          } else {
            app.util.getShowtoast('操作成功')
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/freeride/myrelease',
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
        url: '/pages/freeride/myrelease',
      })
    }
  },
  onReady: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
})