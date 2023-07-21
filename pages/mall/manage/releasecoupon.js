// pages/yellow/sett.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshowpay: false,
    lcradioarr: [{
        name: '快递配送',
        value: '1',
        checked: true
      },
      {
        name: '到店自取',
        value: '2',
      }
    ],
    pickerDataArr: [
      // [
      //   [{
      //     name: '砍价标题',
      //     field: 'title',
      //     type: 'input',
      //     placeholder: '请输入砍价标题'
      //   }],
      //   [{
      //     name: '商品分类',
      //     field: 'category',
      //     type: 'select',
      //     key: 'name'
      //   }]
      // ],
      [
        [{
          name: '优惠券名称',
          field: 'name',
          type: 'input',
          placeholder: '请输入优惠券名称'
        }],
        [{
            name: '开始时间',
            field: 'startTime',
            type: 'select',
            mode: 'date'
          },
          {
            name: '结束时间',
            field: 'endTime',
            type: 'select',
            mode: 'date'
          }
        ],
      ],
    ],
    columnsData: {
      type: [
        [{
            name: '满减券',
          },
          {
            name: '折扣券',
          }
        ]
      ], //房源装修
    },
    checkboxvalue: true,
    params: {
      storeId: '',
      name: '', //标题
      startTime: '', //开始时间
      endTime: '', //结束时间
      type: '', //1满减券2折扣券
      discount: '',
      reach: '',
      num: '',
      introduce: '',
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    app.setNavigationBarTitle('发布优惠券')
    this.setData({
      isEdit: options.id > 0,
      'params.id': options.id || '',
      'params.storeId': app.sjdId,
      system: app.system,
    })
    console.log(options)
    //用于渲染编辑
    if (options.id) {
      app.api.prequest({
        'url': app.urlTwo.mallCouponInfo,
        data: {
          couponId: options.id
        },
      }).then(res => {
        let detailInfo = res.data
        detailInfo.startTime = app.util.ormatDate(detailInfo.startTime).substring(0, 10)
        detailInfo.endTime = app.util.ormatDate(detailInfo.endTime).substring(0, 10)
        detailInfo.type = detailInfo.type == '1' ?'满减券':'折扣券'
        //渲染基本输入框数据
        for (let k in this.data.params) {
          this.setData({
            [`params.${k}`]: detailInfo[k],
          })
        }
        this.setData({
          'params.storeId': detailInfo.storeId,
        })
      })
    }
  },
  //配送类型
  lcrdioonChange(e) {
    this.setData({
      'params.delivery': e.detail.value,
    })
  },
  //公用change事件
  columnchange(e) {
    let name = '',
      field = e.currentTarget.dataset.name,
      column = e.detail.column,
      value = e.detail.value,
      columnData = this.data.columnsData[field];
    // if (field == 'category') {
    //   switch (e.detail.column) {
    //     case 0:
    //       columnData[1] = columnData[0][e.detail.value].son;
    //       break;
    //   }
    //   this.setData({
    //     'columnsData.category': columnData
    //   })
    // }
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
        name = `${columnData[0][value[0]].name}`
        break;
      case 'type':
        name = `${columnData[0][value[0]].name}`
        break;
      case 'startTime':
      case 'endTime':
        name = value
        break;
    }
    this.setData({
      [`params.${field}`]: name
    })
    console.log('picker确定，携带值为', field, e, value, columnData)
  },
  //日期选择
  timePickerChange(e) {
    console.log(e)
    this.setData({
      [`params.${e.currentTarget.dataset.name}`]: e.detail
    })
  },
  postSwitchChange(e) {
    this.setData({
      'params.isFloor': e.detail.value ? 1 : 2
    })
    console.log('postSwitchChange携带值为', e.detail.value)
  },
  //
  textareachange(e) {
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
      params = Object.assign({}, co.params),
      filterArr = [];
    //将form表单值赋值给params
    for (let k in v) {
      if (k != 'type' && k != 'startTime' && k != 'endTime') {
        params[k] = v[k]
      }
    }
    //根据开关添加过滤字段
    // if (!co.system.openVip) {
    //   filterArr.push('memberPrice')
    // }
    //获取分类id
    if (params.category) {
      let categoryP = co.columnsData.category[0].find(item => item.name == params.category.split(',')[0]) || {}
      params.typePid = categoryP.id
      console.log(categoryP)
    }
    console.log('form发生了submit事件，携带数据为：', co, v, params, filterArr)
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['id', 'checkbox', ].concat(filterArr),
      tips: {
        storeId: '缺少商家id',
        name: '请输入优惠券名称',
        type: '请选择优惠类型',
        startTime: '请选择开始时间',
        endTime: '请选择结束时间',
        discount: '请输入优惠金额或折扣比列',
        reach: '请输入使用门槛',
        num: '请输入优惠券数量',
        introduce: '请输入使用说明',
      }
    })
    console.log(judgeData)
    //校验表单
    let warn = "",
      flag = true;
    if (!judgeData) {
      return
    } else if (params.startTime >= params.endTime) {
      warn = '结束时间要大于开始时间'
    } else {
      //需要改变数据格式
      // params.startTime = params.startTime.substring(0,10)
      // params.endTime = params.endTime.substring(0, 10)
      params.type = params.type == '满减券' ? '1' : '2'
      //params.label = JSON.stringify(params.label)
      //return
      flag = false;
      app.util.getShowloading('提交中')
      that.setData({
        loading: true,
      })
      //add
      app.api.prequest({
        'url': app.urlTwo.mallSaveCoupon,
        'method': 'POST',
        data: params,
      }).then(res => {
        if (res.code == '1') {
          app.util.getShowtoast('操作成功')
          app.util.swnb()
        } else {
          app.util.getShowtoast(res.msg, 1000, 1)
          that.setData({
            loading: false
          })
        }
      });
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