// pages/coupon/release.js
const app = getApp();
Page({
  data: {
    rztimearr: [],
    isshowpay: false,
    checkboxvalue: true,
    params: {
      id: '',
      logo: '', //优惠券背景图
      title: '', //标题
      endTime: '', //结束时间
      type: '', //优惠券类型
      money: '', //购买价格
      vipMoney: '', //会员价格
      reduce: '', //减
      condition: '', //条件
      discount: '', //折扣
      stock: '', //库存
      max: '', //每人限领
      isStoreShow: '', //显示隐藏
      body: '', //描述
      media: '', //详情图片
      service: {}, //服务范围
      storeId: '', // 商家Id
      video: '', // 视频
      music: '' // 音乐
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    app.api.coupon(res => {
      app.setNavigationBarTitle('发布-' + res.field)
      this.setData({
        coupon: res,
      })
      console.log(res)
    })
    let uploadArr = [{
          tips: '上传优惠券背景图，最多可上传1张',
          title: '',
          count: '1',
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
    // Object.assign(filterArr, ['originalPrice', 'currentPrice'])
    this.setData({
      uploadArr,
      isEdit: options.id > 0,
      'params.id': options.id || '',
      'params.storeId': app.sjdId,
      columnsData: {},
      filterArr,
    })
    console.log(options)
    //请求服务范围下的标签
    app.api.prequest({
      'url': app.url.couponService,
    }).then(res => {
      this.setData({
        categoryInfo: res.data
      })
      console.log('服务范围下的标签', res.data)
      //用于渲染编辑
      if (options.id) {
        app.api.prequest({
          'url': app.urlTwo.couponSaveCoupons,
          method: 'POST',
          data: {
            couponId: options.id
          },
        }).then(res => {
          let detailInfo = res.data
          console.log(res.data)
          //渲染基本输入框数据
          for (let k in this.data.params) {
            this.setData({
              [`params.${k}`]: detailInfo[k],
            })
            //渲染核销截止时间
            if (k == 'endTime') {
              this.setData({
                [`params.${k}`]: app.util.ormatDate(detailInfo['endTime']).substring(0, 16)
              })
            }
            if (k == 'type') {
              console.log('123')
              let types
              if (detailInfo.type == '1') {
                types = '代金券'
              } else if (detailInfo.type == '2') {
                types = '折扣券'
              } else if (detailInfo.type == '3') {
                types = '优惠券'
              }
              this.setData({
                [`params.type`]: types
              })
            }
          }
          //渲染图片
          let uploadArr = this.data.uploadArr
          uploadArr[0].fileList = uploadArr[0].uploadList = app.util.getTypeImgsUrl(detailInfo.logo, 'empty')
          uploadArr[1].fileList = uploadArr[1].uploadList = app.util.getTypeImgsUrl(detailInfo.media, 'empty')
          this.setData({
            uploadArr,
            labelsDefaultl: app.com.objToArr(detailInfo.service),
          })
          console.log(res)
        })
      }
    })
    console.log(options)
    //picker数据
    this.setData({
      columnsData: {
        type: [
          ['优惠券', '折扣券', '代金券']
        ],
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
      case 'type':
        name = `${columnData[0][value[0]]}`
        break;
    }
    this.setData({
      [`params.${field}`]: name
    })
    let filterArr = []
    if (this.data.params.type == '折扣券') {
      Object.assign(filterArr, ['reduce'])
    } else if (this.data.params.type == '代金券' || this.data.params.type == '优惠券') {
      Object.assign(filterArr, ['discount'])
    }
    this.setData({
      filterArr,
    })
    console.log('picker确定，携带值为', field, e, value, this.data.params.type)
  },
  //日期选择
  timePickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail)
    this.setData({
      [`params.${e.currentTarget.dataset.field}`]: e.detail
    })
  },
  //文本需求描述
  textareachange(e) {
    console.log(e.detail)
    this.setData({
      'params.body': e.detail
    })
  },
  //开启关闭在店铺显示开关
  isTelSwitchChange(e) {
    this.setData({
      'params.isStoreShow': e.detail.value ? 1 : 2
    })
    console.log('istelSwitchChange携带值为', e.detail.value)
  },
  //uploadChange上传图片
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
    console.log(co.params.type)
    //将form表单值赋值给params
    for (let k in v) {
      if (k != 'category' && k != 'checkbox') {
        params[k] = v[k]
      }
      if (k == 'isStoreShow') {
        params[k] = v[k] ? '1' : '2'
      }
      if (k == 'type') {
        if (co.params.type == '优惠券') {
          params[k] = '3'
        } else if (co.params.type == '折扣券') {
          params[k] = '2'
        } else if (co.params.type == '代金券') {
          params[k] = '1'
        }
      }
    }
    console.log('form发生了submit事件，携带数据为：', co, v, params)
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['id', 'isStoreShow', 'media', 'service', 'music', 'video', 'money', 'vipMoney'].concat(co.filterArr),
      tips: {
        logo: '请上传优惠券背景图',
        title: '请输入优惠券标题',
        endTime: '请选择结束时间',
        type: '请选择优惠券类型',
        condition: '请输入优惠条件',
        stock: '请输入库存数量',
        body: '请输入优惠描述',
        reduce: '请输入优惠金额',
        discount: '请输入折扣比例',
      }
    })
    console.log(judgeData)
    //校验表单
    let warn = "",
      flag = true;
    if (!judgeData) {
      return
    } else if (app.util.isNull(v.checkbox)) {
      warn = "请查看用户协议并勾选";
    } else if (co.params.type == '折扣券' && (+params.discount >= 10 || +params.discount <= 0)) {
      warn = "折扣比列应小于10大于0";
    }
    // else if (co.params.type == '代金券' && (+params.condition >= +params.reduce)){
    //   warn = "优惠金额应小于使用门槛";
    // }
    else {
      //需要改变数据格式
      params.service = JSON.stringify(params.service)
      params.endTime = Math.round(new Date(params.endTime).getTime() / 1000).toString()
      console.log(this.data.params.service, this.data.params.endTime)
      flag = false;
      //return
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
        //return
        app.api.prequest({
          'url': app.urlTwo.couponSaveCoupons,
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
        url: '/pages/coupon/manage/myrelease',
      })
    }
  },
  onShow() {},
  onHide() {},
  onPullDownRefresh() {}
})