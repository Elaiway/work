// pages/businesscard/release.js
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
    visible: false,
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
      logo: [], //图片
      name: '', //姓名
      tel: '', //电话
      wechat: '', //微信号
      company: '', //公司
      department: '', //部门
      position: '', //职位
      body: '', //描述
      lat: '', //经纬度
      lng: '', //经纬度
      address: '', //地址
      isWechat: '', //公开微信
      isTel: '', //公开手机号
      isAddress: '', //公开地址
      wholeCountry: '1', //本地全国
      mealId: '', //套餐ID
      typeId: '', //一级分类ID
      typePid: '', //二级分类ID
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    app.api.businesscard(res => {
      app.setNavigationBarTitle('发布-' + res.field)
      this.setData({
        businesscard: res,
      })
      console.log(res)
    })
    let uploadArr = [{
        tips: '完善个人名片的用户，更容易收获商业人脉，并获得平台名片榜单推荐',
        title: '',
        count: '1',
        fileList: [],
        uploadList: [],
        show: true
      }],
      filterArr = []
    if (options.id) {
      Object.assign(filterArr, ['wholeCountry'])
    }
    this.setData({
      uploadArr,
      isEdit: options.id > 0,
      'params.id': options.id || '',
      columnsData: {},
      filterArr,
    })
    // })
    //请求行业分类信息
    app.api.prequest({
      'url': app.url.categoryFull,
      data: {
        term: 13
      }
    }).then(res => {
      console.log('行业分类信息', res.data)
      var hyarr = res.data;
      var hyMultiArray = [
        [...hyarr],
        [...hyarr[0].son]
      ];
      console.log(hyarr, hyMultiArray)
      this.setData({
        'columnsData.category': hyMultiArray
      })
      //用于渲染编辑
      if (options.id) {
        app.api.prequest({
          'url': app.url.businesscardSaveCard,
          'method': 'POST',
          data: {
            cardId: options.id
          },
        }).then(res => {
          console.log(res.data)
          let detailInfo = res.data
          //渲染基本输入框数据
          for (let k in this.data.params) {
            this.setData({
              [`params.${k}`]: detailInfo[k],
            })
          }
          //渲染图片
          let uploadArr = this.data.uploadArr
          uploadArr[0].fileList = uploadArr[0].uploadList = app.util.getTypeImgsUrl(detailInfo.logo, 'empty')
          //渲染分类
          let categoryP = hyMultiArray[0].find(item => item.id == detailInfo.typePid) || {},
            categoryS = categoryP.son && categoryP.son.find(item => item.id == detailInfo.typeId) || {}
          this.setData({
            uploadArr,
            category: `${categoryP.name || ''},${categoryS.name || ''}`,
            // 'params.wholeCountry': +detailInfo.cityId ? '1' : '2',
            // lcradioarr: [{
            //   name: '本地显示',
            //   value: '1',
            //   disabled: true,
            //   checked: +detailInfo.cityId > 0
            // },
            // {
            //   name: '全国显示',
            //   value: '2',
            //   disabled: true,
            //   checked: detailInfo.cityId == 0
            // }
            // ],
          })
          console.log(categoryP, categoryS)
        })
      }
    })
    //入驻套餐
    this.setMeal()
    console.log(options)
  },
  //公用change事件
  columnchange(e) {
    let name = '',
      field = e.currentTarget.dataset.name,
      column = e.detail.column,
      value = e.detail.value,
      columnData = this.data.columnsData[field];
    if (field == 'category') {
      switch (e.detail.column) {
        case 0:
          columnData[1] = columnData[0][e.detail.value].son;
          break;
      }
      this.setData({
        'columnsData.category': columnData
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
      case 'category':
        name = `${columnData[0][value[0]].name},${columnData[1][value[1]].name}`
        break;
    }
    this.setData({
      [`${field}`]: name
    })
    console.log('picker确定，携带值为', field, e, value, columnData)
  },
  //单选套餐
  rzradioonChange(e) {
    console.log(e)
    this.setData({
      rzradiovalue: e.detail.value
    })
    this.getTotal()
  },
  //单选全国本地
  lcrdioonChange(e) {
    console.log(e)
    this.setData({
      rzradiovalue: '0',
      lcradiovalue: e.detail.value,
      'params.wholeCountry': e.detail.value,
    })
    this.setMeal()
  },
  //套餐方法
  setMeal() {
    app.api.prequest({
      'url': app.url.businesscardSetmeal,
      data: {
        wholeCountry: this.data.lcradiovalue == 1 ? 1 : 2,
      }
    }).then(res => {
      res.data.forEach(function(item, index) {
        item.name = item.setName;
        item.value = index;
        item.checked = index == 0;
      })
      this.setData({
        rztimearr: res.data,
      })
      this.getTotal()
      console.log(res.data)
      // let categoryInfo = this.data.categoryInfo,
      // lcradiovalue = this.data.lcradiovalue,
      // releasePrice = lcradiovalue == 1 ? categoryInfo.local.release || 0 : categoryInfo.country.release || 0;
    })
  },
  getTotal() {
    let rzradiovalue = this.data.rzradiovalue,
      rztimearr = this.data.rztimearr,
      releasePrice = rztimearr[rzradiovalue].money
    if (getApp().phoneInfo.system.indexOf("iOS") > -1){
      this.setData({
        releaseName:'立即发布',
      })
    }else{
      this.setData({
        releasePrice,
        releaseName: releasePrice && !this.data.params.id ? '需要支付￥' + (+releasePrice).toFixed(2) + "元" : '立即发布',
      })
    }
    //console.log(rzradiovalue, rztimearr)
  },
  //名片介绍
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
  //开启关闭手机号
  isTelSwitchChange(e) {
    this.setData({
      'params.isTel': e.detail.value ? 1 : 2
    })
    console.log('istelSwitchChange携带值为', e.detail.value)
  },
  //开启关闭微信号
  isWechatSwitchChange(e) {
    this.setData({
      'params.isTel': e.detail.value ? 1 : 2
    })
    console.log('isWechatSwitchChange携带值为', e.detail.value)
  },
  //开启关闭地址信息
  isAddressSwitchChange(e) {
    this.setData({
      'params.isTel': e.detail.value ? 1 : 2
    })
    console.log('isAddressSwitchChange携带值为', e.detail.value)
  },
  //选择位置
  chooseLocation: function() {
    var t = this;
    app.util.chooseLocation({
      success: res => {
        t.setData({
          'params.address': res.address + '+' + res.name,
          'params.lat': res.latitude,
          'params.lng': res.longitude,
        })
        console.log(res, app.com.getArea(res.address))
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
  formSubmit: function(e) {
    let that = this,
      co = this.data,
      v = e.detail.value,
      rztype = co.rztimearr[v.rzradio],
      params = Object.assign({}, co.params),
      filterArr = [];
    params.logo = co.uploadArr[0].uploadList
    params.mealId = co.isEdit ? co.params.mealId : rztype && rztype.id
    params.ios = app.phoneInfo.system.indexOf('iOS') > -1 ? 1 : 2
    //将form表单值赋值给params
    for (let k in v) {
      if (k != 'category' && k != 'rzradio') {
        params[k] = v[k]
      }
      if (k == 'isTel' || k == 'isWechat' || k == 'isAddress') {
        params[k] = v[k] ? '1' : '2'
      }
    }
    //获取分类id
    if (co.category) {
      let categoryP = co.columnsData.category[0].find(item => item.name == co.category.split(',')[0]) || {},
        categoryS = categoryP.son && categoryP.son.find(item => item.name == co.category.split(',')[1]) || {}
      params.typePid = categoryP.id
      params.typeId = categoryS.id
      console.log(categoryP, categoryS)
    }
    console.log('form发生了submit事件，携带数据为：', co, v, rztype, params)
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['id', 'lat', 'lng'].concat(co.filterArr),
      tips: {
        logo: '请上传名片头像',
        name: '请输入真实姓名',
        tel: '请输入手机号',
        wechat: '请输入您的微信',
        company: '请输入您的公司',
        department: '请输入您的部门',
        position: '请输入您的职位',
        body: '介绍一下您负责的业务',
        address: '请定位您的地址',
        mealId: '请选择入驻套餐',
        typePid: '请选择所属行业',
        typeId: '请选择所属行业二级分类',
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
      //需要改变数据格式
      // params.label = JSON.stringify(params.label)
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
        //add
        //return
        app.api.prequest({
          'url': app.url.businesscardSaveCard,
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
                    cardId: rzId,
                  },
                  apiurl: app.url.businesscardCardPay
                }
              })
            } else {
              app.util.getShowtoast('操作成功')
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/businesscard/mycard',
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
        url: '/pages/businesscard/mycard',
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