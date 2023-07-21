// pages/releasesale/sett.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rzradiovalue: '0',
    lcradiovalue: '1',
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
      second: [{
          name: '价格（万元起）',
          field: 'rent',
          formtype: 'input',
          placename: '请输入价格',
        },
        {
          name: '户型',
          field: 'apartment',
          formtype: 'picker',
        },
        {
          name: '面积（m²）',
          field: 'measure',
          formtype: 'input',
          placename: '请输入面积',
        }
      ],
      newhouse: [{
          name: '价格',
          field: 'rent',
          formtype: 'picker',
        },
        {
          name: '开盘时间',
          field: 'openTime',
          mode: 'date',
          formtype: 'picker',
        },
        {
          name: '状态',
          field: 'rentType',
          formtype: 'picker',
        }
      ],
    },
    params: {
      // id: '',
      typeId: '',
      imgs: [],
      title: '',
      rent: '',
      rentType: '',
      apartment: '',
      openTime:'',
      communityName: '',
      area: '',
      address: '',
      lat: '',
      lng: '',
      renovation: '',
      measure: '',
      developer:'',
      orientation: '',
      // data: {},
      label: {},
      linkMan: '',
      linkTel: '',
      body: '',
      wholeCountry: '1',
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
    if (options.type == '6') {
      Object.assign(filterArr, ['openTime', 'rentType', 'developer'])
    }
    if (options.type == '5') {
      Object.assign(filterArr, ['apartment', 'measure', 'orientation'])
    }
    this.setData({
      uploadArr,
      isEdit: options.id > 0,
      'params.id': options.id || '',
      'params.typeId': options.typeId,
      type: options.type,
      filterArr,
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
          console.log(res.data)
          //渲染基本输入框数据
          for (let k in this.data.params) {
            this.setData({
              [`params.${k}`]: detailInfo[k],
            })
            //渲染发布新房开盘时间
            if (this.data.type != '6' && k == 'openTime') {
              this.setData({
                [`params.${k}`]: app.util.ormatDate(detailInfo['openTime']).substring(0, 10)
              })
            }
            //渲染发布二手房户型
            if (this.data.type != '5' && k == 'apartment') {
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
    //picker数据
    this.setData({
      columnsData: {
        rent: [
          ['价格待定', '一房一价']
        ], //价格
        apartment: [this.createColumnsData(9), this.createColumnsData(9, {
          start: 0
        }), this.createColumnsData(9, {
          start: 0
        })], //户型
        rentType: [
          ['待售', '在售', '停售']
        ], //状态
        renovation: [
          ['毛坯', '简单装修', '中等装修', '精装修', '豪华装修']
        ], //房源装修
        orientation: [
          ['东', '南', '西', '北', '南北', '东西', '东南', '西南', '东北', '西北']
        ], //房源朝向
      }
    })
    console.log(this.data)
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
      case 'rent':
        name = columnData[0][value[0]]
        break;
      case 'apartment':
        name = `${columnData[0][value[0]]}室${columnData[1][value[1]]}厅${columnData[2][value[2]]}卫`
        this.setData({
          'formatparams.apartment': `${columnData[0][value[0]]}-${columnData[1][value[1]]}-${columnData[2][value[2]]}`
        })
        break;
      case 'rentType':
        name = columnData[0][value[0]]
        break;
      case 'openTime':
        name = value
        break;
      case 'renovation':
        name = `${columnData[0][value[0]]}`
        break;
      case 'orientation':
        name = `${columnData[0][value[0]]}`
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
  //文本需求描述
  textareachange(e) {
    console.log(e.detail)
    this.setData({
      'params.body': e.detail
    })
  },
  //uploadChange上传图片
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
          'params.communityName': res.name,
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
    if (co.type == 6) {
      params.rent = v.rent
      params.measure = v.measure
    }
    params.communityName = v.communityName
    params.developer = v.developer
    params.linkMan = v.linkMan
    params.linkTel = v.linkTel
    console.log('form发生了submit事件，携带数据为：', co, v, params)
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['id', 'data'].concat(co.filterArr),
      tips: {
        typeId: '缺少发布类型id',
        imgs: '请上传房屋图片',
        title: '请输入标题',
        rent: '请输入价格',
        rentType: '请选择售房状态',
        apartment: '请选择户型',
        openTime: '请选择开盘时间',
        communityName: '请输入小区名称',
        developer: '请输入开发商名称',
        area: '请选择地区',
        address: '请输入详细地址',
        lat: '请选择地区',
        renovation: '请选择房源装修',
        measure: '请输入房源面积',
        orientation: '请选择房源朝向',
        linkMan: '请输入联系人',
        linkTel: '请输入联系电话',
        body: '请输入描述或补充',
        label: '请选择标签',
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
      if (this.data.type != '5'){
        params.apartment = (params.apartment.replace(/[^\d]/g, '')).split('').join('-')
      }
      // params.data = JSON.stringify(params.data)
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
        //return
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