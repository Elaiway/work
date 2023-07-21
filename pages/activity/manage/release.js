// pages/activity/release.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshowpay: false,
    checkboxvalue: true,
    visible: false,
    lcradioarr: [{
        name: '免费',
        value: '1',
        checked: true
      },
      {
        name: '收费',
        value: '2',
      }
    ],
    lcradiovalue: 1,
    params: {
      showImgs: [], //活动海报
      name: '', //活动主题
      type: '', //活动类型
      endTime: '', //活动开始时间
      startTime: '', //活动结束时间
      enrollStartTime: '', //报名开始时间
      enrollEndTime: '', //报名结束时间
      address: '', //地址
      lat: '',
      lng: '',
      detail: '', //详情
      detailImgs: [], //详情图片
      notice: '', //活动须知
      num: '', //活动数量
      limitNum: '', //限制票数
      originalPrice: '', //原价
      currentPrice: '', //当前价
      info: '', //报名信息
      linkTel: '', //联系电话
      storeId: '', //商家ID
      // typeId: '',
      music: '', //音频链接地址
      video: '', //视频链接地址
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    app.api.activity((res) => {
      app.setNavigationBarTitle('发布-' + res.field)
      this.setData({
        activity: res,
      })
    })
    // app.setNavigationBarTitle('发布活动')
    let uploadArr = [{
          tips: '上传活动海报，最多可上传3张',
          title: '',
          count: '3',
          fileList: [],
          uploadList: [],
          show: true
        },
        {
          tips: '',
          title: '最多上传6张图片',
          count: '6',
          fileList: [],
          uploadList: [],
          show: true
        },
      ],
      filterArr = []
    Object.assign(filterArr, ['originalPrice', 'currentPrice'])
    this.setData({
      uploadArr,
      isEdit: options.activityId > 0,
      'params.id': options.activityId || '',
      'params.storeId': app.sjdId,
      // 'params.typeId': options.typeId,
      // type: options.type,
      activityId: options.activityId,
      filterArr,
    })
    console.log(options.activityId)
    //请求报名表单信息
    app.api.prequest({
      'url': app.url.activityEnrollInfo,
    }).then(res => {
      console.log('报名表单', res.data)
      let label = []
      res.data.map((item, index) => {
        let obj = {}
        obj.name = item
        label.push(obj)
        console.log(obj, label)
      })
      this.setData({
        labels: label,
      })
      console.log('报名表单2', JSON.stringify(res.data), JSON.parse(JSON.stringify(res.data)))
      //请求活动分类列表
      app.api.prequest({
        'url': app.url.activityCategory
      }).then(res => {
        console.log('分类列表', res.data)
        //picker数据
        this.setData({
          columnsData: {
            type: [res.data]
          }
        })
      })
      //用于渲染编辑
      if (options.activityId) {
        app.api.prequest({
          'url': app.urlTwo.activitySaveActivity,
          'method': 'POST',
          data: {
            activityId: options.activityId
          },
        }).then(res => {
          let detailInfo = res.data
          //渲染基本输入框数据
          for (let k in this.data.params) {
            this.setData({
              [`params.${k}`]: detailInfo[k],
            })
          }
          //渲染图片
          let uploadArr = this.data.uploadArr
          uploadArr[0].fileList = uploadArr[0].uploadList = app.util.getTypeImgsUrl(detailInfo.showImgs, 'empty')
          uploadArr[1].fileList = uploadArr[1].uploadList = app.util.getTypeImgsUrl(detailInfo.detailImgs, 'empty')
          //渲染分类
          let categoryP = this.data.columnsData.type[0].find(item => item.id == detailInfo.typeId) || {}
          this.setData({
            uploadArr,
            labelsDefaultl: app.com.objToArr(detailInfo.info),
            'params.storeId': detailInfo.storeId,
            'params.type': `${categoryP.name || ''}`,
            'params.startTime': app.util.ormatDate(detailInfo.startTime).substring(0, 16),
            'params.endTime': app.util.ormatDate(detailInfo.endTime).substring(0, 16),
            'params.enrollStartTime': app.util.ormatDate(detailInfo.enrollStartTime).substring(0, 16),
            'params.enrollEndTime': app.util.ormatDate(detailInfo.enrollEndTime).substring(0, 16),
            lcradiovalue: +detailInfo.currentPrice >0  ? '2' : '1',
            lcradioarr: [{
                name: '免费',
                value: '1',
                checked: detailInfo.currentPrice <= 0 ? true : false,
              },
              {
                name: '收费',
                value: '2',
                checked: detailInfo.currentPrice > 0 ? true : false,
              }
            ],
          })
          // console.log(categoryP)
          console.log(detailInfo.currentPrice)
        })
      }
    })
    console.log(options)
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
    //       // columnData[1] = columnData[0][e.detail.value].son;
    //       columnData[1] = columnData[0][e.detail.value];
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
      case 'type':
        name = `${columnData[0][value[0]].name}`
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
    console.log('picker发送选择改变，携带值为', e.detail)
    this.setData({
      [`params.${e.currentTarget.dataset.field}`]: e.detail
    })
  },
  //发布类型
  lcrdioonChange(e) {
    this.setData({
      lcradiovalue: e.detail.value,
    })
    let filterArr = []
    if (this.data.lcradiovalue == 1) {
      Object.assign(filterArr, ['originalPrice', 'currentPrice'])
    }
    if (this.data.lcradiovalue == 2) {
      Object.assign(filterArr, [])
    }
    this.setData({
      filterArr,
    })
    console.log(e.detail.value, this.data.lcradiovalue)
  },
  //活动详情
  textareachangexq(e) {
    console.log(e.detail)
    this.setData({
      'params.detail': e.detail
    })
  },
  //活动须知
  textareachange(e) {
    console.log(e.detail)
    this.setData({
      'params.notice': e.detail
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
          'params.poiaddress': app.com.getArea(res.address).City + '-' + res.name,
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
    let j = []
    e.detail.map(v => {
      j.push(v.name)
    })
    this.setData({
      // [`params.${e.currentTarget.dataset.name}`]: j
      'params.info': j
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
    params.showImgs = co.uploadArr[0].uploadList
    params.detailImgs = co.uploadArr[1].uploadList
    params.name = v.name
    params.num = v.num
    params.limitNum = v.limitNum
    params.originalPrice = co.lcradiovalue == 2 ? v.originalPrice : ''
    params.currentPrice = co.lcradiovalue == 2 ? v.currentPrice : ''
    params.music = v.music
    params.video = v.video
    params.linkTel = v.linkTel
    // params.storeId = co.storeId
    //获取分类id
    if (params.type) {
      let categoryP = co.columnsData.type[0].find(item => item.name == params.type.split(',')[0]) || {}
      params.typeId = categoryP.id
      console.log(categoryP)
    }
    console.log('form发生了submit事件，携带数据为：', co, v, params)
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['detailImgs', 'detail', 'music', 'video', 'id'].concat(co.filterArr),
      tips: {
        // typeId: '缺少发布类型id',
        showImgs: '请上传活动海报',
        name: '请输入活动主题',
        type: '请选择活动类型',
        startTime: '请选择活动开始时间',
        endTime: '请选择活动结束时间',
        enrollStartTime: '请选择报名开始时间',
        enrollEndTime: '请选择活动结束时间',
        notice: '请填写活动须知',
        address: '请选择活动地址',
        num: '请输入总人数',
        limitNum: '请输入限购数量',
        originalPrice: '请输入报名原价',
        currentPrice: '请输入报名费用',
        info: '请选择表单信息',
        linkTel: '请填写主办方联系方式',
      }
    })
    console.log(judgeData)
    const st = new Date(v.startTime).getTime(),
      et = new Date(v.endTime).getTime(),
      est = new Date(v.enrollStartTime).getTime(),
      eet = new Date(v.enrollEndTime).getTime();
    //校验表单
    let warn = "",
      flag = true;
    if (!judgeData) {
      return
    } else if (!app.util.isTelCode(v.linkTel)) {
      warn = "请输入合理的联系电话";
    } else if (app.util.isNull(v.checkbox)) {
      warn = "请查看用户协议并勾选";
    } else if (st >= et) {
      warn = "活动开始时间不能大于或等于活动结束时间";
    } else if (est >= eet) {
      warn = "报名开始时间不能大于或等于报名结束时间";
    } else if (eet >= st) {
      warn = "报名截止时间不能大于或等于活动开始时间";
    } else {
      //需要改变数据格式
      // params.label = JSON.stringify(params.label)
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
        params.showImgs = JSON.stringify(res[0])
        params.detailImgs = JSON.stringify(res[1])
        params.info = JSON.stringify(params.info)
        //add
        //return
        app.api.prequest({
          'url': app.urlTwo.activitySaveActivity,
          'method': 'POST',
          data: params,
        }).then(res => {
          if (res.code == '1') {
            app.util.getShowtoast('操作成功')
            app.util.swnb()
          } else {
            app.util.getShowtoast(res.msg, 1000, 2)
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