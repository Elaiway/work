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
    pickerDataArr: {
      lease: [{
          name: '类型',
          field: 'rentType',
          formtype: 'picker',
        },
        {
          name: '户型',
          field: 'apartment',
          formtype: 'picker',
        },
        {
          name: '押金',
          field: 'deposit',
          formtype: 'picker',
        }
      ],
      rentSeeking: [{
          name: '类型',
          field: 'rentType',
          formtype: 'picker',
        },
        {
          name: '押金',
          field: 'deposit',
          formtype: 'picker',
        },
        {
          name: '地区',
          field: 'area',
          mode: 'region',
          formtype: 'picker',
          placename: '请选择地区',
        }
      ],
    },
    params: {
      // hyMarr: '请选择',
      id: '',
      typeId: '',
      imgs: [],
      title: '',
      rent: '',
      rentType: '',
      apartment: '',
      deposit: '',
      communityName: '',
      area: '',
      address: '',
      lat: '',
      lng: '',
      renovation: '',
      measure: '',
      floor: '',
      orientation: '',
      data: {},
      label: {},
      linkMan: '',
      linkTel: '',
      body: '',
      wholeCountry: '1',
      ismy: false,
    },
    formatparams: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    app.api.housingdeal((res) => {
      this.setData({
        housConfig: res,
      })
      if (app.system.mode == 1) {
        this.setData({
          'pickerDataArr.rentSeeking[2]': {
            name: '地区',
            field: 'srarea',
            formtype: 'input',
            placename: '请输入地区',
          }
        })
      }
    })
    app.setNavigationBarTitle('发布-' + options.name)
    let uploadArr = [{
        tips: '上传房屋照片，最多上传9张',
        title: '',
        count: '9',
        fileList: [],
        uploadList: [],
        show: true
      }, ],
      filterArr = []
    if (options.type == '4') {
      Object.assign(filterArr, ['imgs', 'apartment', 'communityName', 'address', 'lat', 'lng', 'measure', 'floor', 'renovation', 'orientation'])
    }
    this.setData({
      uploadArr,
      isEdit: options.id > 0,
      'params.id': options.id || '',
      'params.typeId': options.typeId,
      type: options.type,
      filterArr,
      system: app.system,
    })
    //请求分类下的标签
    app.api.prequest({
      'url': app.url.housCategoryInfo,
      data: {
        typeId: options.typeId
      }
    }).then(res => {
      console.log('分类下的标签', res.data)
      this.setData({
        categoryInfo: res.data
      })
      this.setMeal()
      //用于渲染编辑
      if (options.id) {
        app.api.prequest({
          'url': app.url.housSaveRenting,
          method: 'POST',
          data: {
            rentingId: options.id
          },
        }).then(res => {
          let detailInfo = res.data
          //渲染基本输入框数据
          for (let k in this.data.params) {
            this.setData({
              [`params.${k}`]: detailInfo[k],
            })
            if(this.data.system.mode=='1'){
              this.setData({
                'params.srarea': detailInfo.area,
              })
            }
            if (k == 'ismy') {
              this.setData({
                [`params.${k}`]: detailInfo['rent'] == 0,
              })
            }
            if (k == 'apartment') {
              let str = detailInfo[k].split('-')
              this.setData({
                [`params.${k}`]: `${str[0]}室${str[1]}厅${str[2]}卫`,
              })
            }
          }
          //渲染图片
          let uploadArr = this.data.uploadArr
          uploadArr[0].fileList = uploadArr[0].uploadList = app.util.getTypeImgsUrl(detailInfo.imgs, 'empty')
          this.setData({
            uploadArr,
            labelsDefaultd: app.com.objToArr(detailInfo.data),
            labelsDefaultl: app.com.objToArr(detailInfo.label),
            'params.wholeCountry': +detailInfo.cityId ? '1' : '2',
            lcradioarr: [{
                name: '本地显示',
                value: '1',
                disabled: true,
                checked: +detailInfo.cityId > 0
              },
              {
                name: '全国显示',
                value: '2',
                disabled: true,
                checked: detailInfo.cityId == 0
              }
            ],
          })
          console.log(res)
        })
      }
    })
    console.log(options)
    //商家分类
    // app.api.prequest({
    //   'url': app.url.category,
    //   data: {
    //     type: 8
    //   },
    // }).then(res => {
    //   var hyarr = res.data;
    //   var hyMultiArray = [
    //     [...hyarr],
    //     [...hyarr[0].son]
    //   ];
    //   console.log(hyarr, hyMultiArray)
    //   this.setData({
    //     'columnsData.hyMarr': hyMultiArray
    //   })
    // })
    // options.id || app.util.getLocation({
    //   type: '1',
    //   success: res => {
    //     console.log(res)
    //     this.setData({
    //       'params.lat': res.result.ad_info.location.lat,
    //       'params.lng': res.result.ad_info.location.lng,
    //       'params.address': res.result.address
    //     })
    //   }
    // })
    //picker数据
    this.setData({
      columnsData: {
        rentType: [
          ['整租', '次卧', '主卧', '单间']
        ], //类型
        apartment: [this.createColumnsData(9), this.createColumnsData(9, {
          start: 0
        }), this.createColumnsData(9, {
          start: 0
        })], //户型
        deposit: [this.createColumnsData(5), this.createColumnsData(5)], //押金
        renovation: [
          ['毛坯', '简单装修', '中等装修', '精装修', '豪华装修']
        ], //房源装修
        floor: [this.createColumnsData(99), this.createColumnsData(99)], //房源楼层
        orientation: [
          ['东', '南', '西', '北', '南北', '东西', '东南', '西南', '东北', '西北']
        ], //房源朝向
      }
    })
    console.log(this.data)
  },
  changerent() {
    this.setData({
      'params.ismy': !this.data.params.ismy,
    })
  },
  //创造数据
  createColumnsData(length = 9, {
    before,
    after,
    start = 1
  } = {}) {
    let values = [];
    for (let i = start; i < length + 1; i++) values.push((before || '') + i + (after || ''))
    return values
  },
  //公用change事件
  columnchange(e) {
    let name = '',
      field = e.currentTarget.dataset.name,
      column = e.detail.column,
      value = e.detail.value,
      columnData = this.data.columnsData[field];
    if (field == 'hyMarr') {
      switch (e.detail.column) {
        case 0:
          columnData[1] = columnData[0][e.detail.value].son;
          break;
      }
      this.setData({
        'columnsData.hyMarr': columnData
      })
    }
    console.log('picker列改变，携带值为', field, e, column, value, columnData)
  },
  //公用确认事件
  pickerchange(e) {
    let name = '',
      field = e.currentTarget.dataset.name,
      value = e.detail.value,
      columnData = this.data.columnsData[field];
    switch (field) {
      case 'rentType':
        name = columnData[0][value[0]]
        break;
      case 'apartment':
        name = `${columnData[0][value[0]]}室${columnData[1][value[1]]}厅${columnData[2][value[2]]}卫`
        this.setData({
          'formatparams.apartment': `${columnData[0][value[0]]}-${columnData[1][value[1]]}-${columnData[2][value[2]]}`
        })
        break;
      case 'deposit':
        name = `押${columnData[0][value[0]]}付${columnData[1][value[1]]}`
        break;
      case 'renovation':
        name = `${columnData[0][value[0]]}`
        break;
      case 'floor':
        name = `${columnData[0][value[0]]}-${columnData[1][value[1]]}`
        break;
      case 'orientation':
        name = `${columnData[0][value[0]]}`
        break;
      case 'area':
        name = `${value[1]}-${value[2]}`
        break;
      case 'hyMarr':
        name = `${columnData[0][value[0]].name},${columnData[1][value[1]].name}`
        break;
    }
    this.setData({
      [`params.${field}`]: name
    })
    console.log('picker确定，携带值为', field, e, value, columnData)
  },
  //单选
  rzradioonChange(e) {
    this.setData({
      rzradiovalue: e.detail.value
    })
  },
  //发布类型
  lcrdioonChange(e) {
    this.setData({
      lcradiovalue: e.detail.value,
      'params.wholeCountry': e.detail.value,
    })
    this.setMeal()
  },
  setMeal() {
    let categoryInfo = this.data.categoryInfo,
      lcradiovalue = this.data.lcradiovalue,
      releasePrice = lcradiovalue == 1 ? categoryInfo.local.release || 0 : categoryInfo.country.release || 0;
    this.setData({
      releasePrice,
      releaseName: releasePrice && !this.data.params.id ? '需要支付￥' + (+releasePrice).toFixed(2) + "元" : '立即发布',
    })
    console.log(lcradiovalue, categoryInfo)
  },
  //
  textareachange(e) {
    console.log(e.detail)
    this.setData({
      'params.body': e.detail
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
        t.setData({
          'params.area': app.com.getArea(res.address).City + '-' + app.com.getArea(res.address).Country,
          'params.address': res.address + res.name,
          'params.lat': res.latitude,
          'params.lng': res.longitude,
        })
        console.log(res, app.com.getArea(res.address))
      }
    })
  },
  //选择标签
  labelChange(e) {
    let j = {}
    e.detail.map(v => {
      j[v.id] = v.name
    })
    this.setData({
      [`params.${e.currentTarget.dataset.name}`]: j
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
      params = co.params;
    params.imgs = co.uploadArr[0].uploadList
    params.title = v.title
    params.rent = params.ismy ? 0 : v.rent || 0
    params.communityName = v.communityName
    params.measure = v.measure
    params.linkMan = v.linkMan
    params.linkTel = v.linkTel
    if (this.data.system.mode == '1' && this.data.type == '4') {
      params.area = v.srarea
    }
    console.log('form发生了submit事件，携带数据为：', co, v, params)
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['id', 'rent', 'data', 'label', 'ismy'].concat(co.filterArr),
      tips: {
        typeId: '缺少发布类型id',
        imgs: '请上传房屋图片',
        title: '请输入标题',
        rent: '请输入租金',
        rentType: '请选择租房类型',
        apartment: '请选择户型',
        deposit: '请选择押金',
        communityName: '请输入小区名称',
        area: '请选择地区',
        address: '请输入详细地址',
        lat: '请选择地区',
        renovation: '请选择房源装修',
        measure: '请输入房源面积',
        floor: '请选择房源楼层(房屋所在楼层 - 总楼层数）',
        orientation: '请选择房源朝向',
        linkMan: '请输入联系人',
        linkTel: '请输入联系电话',
        body: '请输入描述或补充',
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
    } else if (app.util.isNull(v.checkbox)) {
      warn = "请查看用户协议并勾选";
    } else {
      //需要改变数据格式
      params.apartment = (params.apartment.replace(/[^\d]/g, '')).split('').join('-')
      params.data = JSON.stringify(params.data)
      params.label = JSON.stringify(params.label)
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
        params.imgs = JSON.stringify(res[0])
        //add
        app.api.prequest({
          'url': app.url.housSaveRenting,
          'method': 'POST',
          data: params,
        }).then(res => {
          if (res.code == '1') {
            let rzId = res.data
            if (!co.isEdit && Number(co.releasePrice) > 0) {
              that.setData({
                rzId: rzId,
                isshowpay: true,
                payobj: {
                  params: {
                    money: co.releasePrice,
                    rentingId: rzId,
                  },
                  apiurl: app.url.housRentingPay
                }
              })
            } else {
              app.util.getShowtoast('操作成功')
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/housingdeal/myrelease',
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
        url: '/pages/housingdeal/myrelease',
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