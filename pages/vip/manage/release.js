// pages/yellow/sett.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshowpay: false,
    checkboxvalue: true,
    pickerDataArr: {
      date: [{
          name: '每月开始时间',
          field: 'startTime',
          type: 'date'
        },
        {
          name: '每月结束时间',
          field: 'endTime',
          type: 'date'
        },
      ],
    },
    checkboxPicker: [{
        title: '会在选中的周几显示此活动',
        field: 'week',
        show: false,
        checkboxarr: [{
          name: '周一',
          id: '1'
        }, {
          name: '周二',
          id: '2'
        }, {
          name: '周三',
          id: '3'
        }, {
          name: '周四',
          id: '4'
        }, {
          name: '周五',
          id: '5'
        }, {
          name: '周六',
          id: '6'
        }, {
          name: '周日',
          id: '7'
        }],
        defaultarr: ''
      },
      {
        title: '会在选中的日期显示此活动',
        field: 'month',
        show: false,
        checkboxarr: [{
            name: '每月01日',
            id: '01'
          }, {
            name: '每月02日',
            id: '02'
          }, {
            name: '每月03日',
            id: '03'
          }, {
            name: '每月04日',
            id: '04'
          }, {
            name: '每月05日',
            id: '05'
          }, {
            name: '每月06日',
            id: '06'
          }, {
            name: '每月07日',
            id: '07'
          },
          {
            name: '每月08日',
            id: '08'
          }, {
            name: '每月09日',
            id: '09'
          }, {
            name: '每月10日',
            id: '10'
          }, {
            name: '每月11日',
            id: '11'
          }, {
            name: '每月12日',
            id: '12'
          }, {
            name: '每月13日',
            id: '13'
          }, {
            name: '每月14日',
            id: '14'
          },
          {
            name: '每月15日',
            id: '15'
          }, {
            name: '每月16日',
            id: '16'
          }, {
            name: '每月17日',
            id: '17'
          }, {
            name: '每月18日',
            id: '18'
          }, {
            name: '每月19日',
            id: '19'
          }, {
            name: '每月20日',
            id: '20'
          }, {
            name: '每月21日',
            id: '21'
          },
          {
            name: '每月22日',
            id: '22'
          }, {
            name: '每月23日',
            id: '23'
          }, {
            name: '每月24日',
            id: '24'
          }, {
            name: '每月25日',
            id: '25'
          }, {
            name: '每月26日',
            id: '26'
          }, {
            name: '每月27日',
            id: '27'
          }, {
            name: '每月28日',
            id: '28'
          },
          {
            name: '每月29日',
            id: '29'
          }, {
            name: '每月30日',
            id: '30'
          }, {
            name: '每月31日',
            id: '31'
          }
        ],
        defaultarr: ''
      }
    ],
    params: {
      storeId: '',
      id: '',
      title: '',
      subheading: '', //副标题
      logo: '',
      media: '',
      startTime: '',
      endTime: '',
      discount: '',
      week: '',
      month: '',
      max: '', //限领
      condition: '', //使用条件
      stock: '', //库存
      explain: '', //说明
      details: '',
      label: {},
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    app.setNavigationBarTitle('发布特权')
    let uploadArr = [{
        tips: '上传特权轮播图，最多可上传3张',
        title: '',
        count: '3',
        fileList: [],
        uploadList: [],
        show: true
      }, {
        tips: '',
        title: '最多上传3张图片',
        count: '3',
        fileList: [],
        uploadList: [],
        show: true
      }, ],
      filterArr = []
    this.setData({
      uploadArr,
      isEdit: options.id > 0,
      'params.id': options.id || '',
      'params.storeId': app.sjdId,
      filterArr,
      columnsData: {},
      system: app.system,
    })
    console.log(options)
    //请求分类下的标签
    app.api.prequest({
      'url': app.urlTwo.vipLabel,
    }).then(res => {
      console.log('分类下的标签', res.data)
      this.setData({
        labels: res.data
      })
      //用于渲染编辑
      if (options.id) {
        app.api.prequest({
          'url': app.urlTwo.addPrivilege,
          method: 'POST',
          data: {
            privilegeId: options.id
          },
        }).then(res => {
          this.setData({
            [`checkboxPicker[0].defaultarr`]: res.data.week,
            [`checkboxPicker[1].defaultarr`]: res.data.month,
          })
          let detailInfo = res.data
          detailInfo.startTime = app.util.ormatDate(detailInfo.startTime).substring(0, 16)
          detailInfo.endTime = app.util.ormatDate(detailInfo.endTime).substring(0, 16)
          //修改星期显示
          if (detailInfo.week) {
            let arr = detailInfo.week.split(',').map(item => {
              return {
                name: app.com.changeWeek(item),
                id: item
              }
            })
            detailInfo.week = arr.map(item => item.name).toString()
            this.setData({
              week: arr,
            })
          }
          //渲染基本输入框数据
          for (let k in this.data.params) {
            this.setData({
              [`params.${k}`]: detailInfo[k],
            })
          }
          //渲染图片
          let uploadArr = this.data.uploadArr
          uploadArr[0].fileList = uploadArr[0].uploadList = app.util.getTypeImgsUrl(detailInfo.logo, 'empty')
          uploadArr[1].fileList = uploadArr[1].uploadList = app.util.getTypeImgsUrl(detailInfo.media, 'empty')
          this.setData({
            uploadArr,
            labelsDefaultl: app.com.objToArr(detailInfo.label),
            'params.storeId': detailInfo.storeId,
          })
          console.log(detailInfo)
        })
      }
    })
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
  //
  showCheckboxPicker(e) {
    let field = e.currentTarget.dataset.name,
      index;
    switch (field) {
      case 'week':
        index = 0
        break;
      case 'month':
        index = 1
        break;
    }
    this.setData({
      [`checkboxPicker[${index}].show`]: true,
    })
  },
  //
  checkboxPickerChange(e) {
    let field = e.currentTarget.dataset.name
    this.setData({
      [`params.${field}`]: field == 'month' ? e.detail.map(item => item.id).toString() || '' : e.detail.map(item => item.name).toString() || '',
      [field]: e.detail
    })
    console.log(e)
  },
  //
  textareachange(e) {
    this.setData({
      'params.details': e.detail
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
    params.logo = co.uploadArr[0].uploadList
    params.media = co.uploadArr[1].uploadList
    //将form表单值赋值给params
    for (let k in v) {
      params[k] = v[k]
    }
    params.startTime = app.util.ormatTime(params.startTime)
    params.endTime = app.util.ormatTime(params.endTime)
    console.log('form发生了submit事件，携带数据为：', co, v, params, filterArr)
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['id', 'checkbox', 'week', 'month', 'media'].concat(filterArr),
      tips: {
        storeId: '缺少商家id',
        title: '请输入标题',
        subheading: '请输入副标题',
        logo: '请上传特权轮播图',
        startTime: '请选择开始时间',
        endTime: '请选择结束时间',
        discount: '请输入折扣',
        max: '请输入限领次数',
        condition: '请输入使用条件',
        stock: '请输入库存数量',
        explain: '请输入使用说明',
        details: '请输入特权详情',
        label: '请选择服务标签',
      }
    })
    console.log(judgeData)
    //校验表单
    let warn = "",
      flag = true;
    if (!judgeData) {
      return
    } else if (!params.week && !params.month) {
      warn = '星期和日期设置至少选择一个'
    } else if (params.startTime >= params.endTime) {
      warn = '结束要大于开始时间'
    } else {
      //需要改变数据格式
      params.week = co.week.map(item => item.id).toString() || ''
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
        params.logo = JSON.stringify(res[0])
        params.media = JSON.stringify(res[1])
        //add
        app.api.prequest({
          'url': app.urlTwo.addPrivilege,
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