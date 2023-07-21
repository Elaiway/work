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
    checkboxvalue: true,
    params: {
      storeId: '',
      showImgs: [],
      title: '',
      typePid: '',
      typeId: '',
      originalPrice: '',
      alonePrice: '',
      groupPrice: '',
      memberPrice: '',
      delivery: '1', //配送方式1快递，2到店
      isPost: '2', //包邮 1是,2否
      satisfy: '',
      freight: '',
      endTime: '',
      groupNum: '',
      hour: '',
      limitNum: '',
      num: '',
      details: '',
      detailImgs: [],
      label: {},
      music: '',
      video: '',
    },
    parentSpec: [],
    parentGroup: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    app.setNavigationBarTitle('发布拼团')
    let uploadArr = [{
        tips: '上传商品主图，最多上传3张',
        title: '',
        count: '3',
        fileList: [],
        uploadList: [],
        show: true
      }, {
        tips: '',
        title: '上传商品主图，最多上传6张',
        count: '6',
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
    //商家分类
    app.api.prequest({
      'url': app.urlTwo.category,
      data: {
        term: 15
      },
    }).then(res => {
      var hyarr = res.data;
      var hyMultiArray = [
        [...hyarr],
        [...hyarr[0].son]
      ];
      console.log(hyarr, hyMultiArray)
      this.setData({
        'columnsData.category': hyMultiArray
      })
      //请求分类下的标签
      app.api.prequest({
        'url': app.urlTwo.groupGoodsLabel,
      }).then(res => {
        console.log('分类下的标签', res.data)
        this.setData({
          labels: res.data
        })
        //用于渲染编辑
        if (options.id) {
          app.api.prequest({
            'url': app.urlTwo.groupSaveGoods,
            method: 'POST',
            data: {
              goodsId: options.id
            },
          }).then(res => {
            let detailInfo = res.data
            //渲染基本输入框数据
            for (let k in this.data.params) {
              if (k == 'endTime') {
                detailInfo[k] = app.util.ormatDate(detailInfo[k]).substring(0,16)
              }
              this.setData({
                [`params.${k}`]: detailInfo[k],
              })
            }
            //渲染图片
            let uploadArr = this.data.uploadArr
            uploadArr[0].fileList = uploadArr[0].uploadList = app.util.getTypeImgsUrl(detailInfo.showImgs, 'empty')
            uploadArr[1].fileList = uploadArr[1].uploadList = app.util.getTypeImgsUrl(detailInfo.detailImgs, 'empty')
            //渲染分类
            let categoryP = hyMultiArray[0].find(item => item.id == detailInfo.typePid) || {},
              categoryS = categoryP.son && categoryP.son.find(item => item.id == detailInfo.typeId) || {}
            this.setData({
              uploadArr,
              labelsDefaultl: app.com.objToArr(detailInfo.label),
              'params.storeId': detailInfo.storeId,
              'params.category': `${categoryP.name || ''},${categoryS.name || ''}`,
              lcradioarr: [{
                  name: '快递配送',
                  value: '1',
                  disabled: true,
                  checked: detailInfo.delivery == 1
                },
                {
                  name: '到店自取',
                  value: '2',
                  disabled: true,
                  checked: detailInfo.delivery == 2
                }
              ],
            })
            console.log(categoryP, categoryS)
          })
        }
      })
    })
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
  postSwitchChange(e) {
    this.setData({
      'params.isPost': e.detail.value ? 1 : 2
    })
    console.log('postSwitchChange携带值为', e.detail.value)
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
    params.showImgs = co.uploadArr[0].uploadList
    params.detailImgs = co.uploadArr[1].uploadList
    //将form表单值赋值给params
    for (let k in v) {
      if (k != 'category') {
        params[k] = v[k]
      }
      if (k == 'isPost') {
        params[k] = v[k] ? '1' : '2'
      }
    }
    //根据开关添加过滤字段
    if (v.isPost) {
      filterArr.push('freight')
      filterArr.push('satisfy')
    }
    // if (!co.system.openVip) {
    //   filterArr.push('memberPrice')
    // }
    //获取分类id
    if (params.category) {
      let categoryP = co.columnsData.category[0].find(item => item.name == params.category.split(',')[0]) || {},
        categoryS = categoryP.son && categoryP.son.find(item => item.name == params.category.split(',')[1]) || {}
      params.typePid = categoryP.id
      params.typeId = categoryS.id
      console.log(categoryP, categoryS)
    }
    console.log('form发生了submit事件，携带数据为：', co, v, params, filterArr)
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['id', 'category', 'checkbox', 'memberPrice', 'detailImgs', 'label', 'music', 'video'].concat(filterArr),
      tips: {
        storeId: '缺少商家id',
        typePid: '请选择商品分类',
        typeId: '请选择商品二级分类',
        showImgs: '请上传商品主图',
        title: '请输入标题',
        alonePrice: '请输入单独够价格',
        originalPrice: '请输入商品原价',
        groupPrice: '请输入团购价格',
        groupNum: '请输入拼团人数',
        hour: '请输入拼团时限',
        limitNum: '请输入每人限购',
        num: '请输入商品库存',
        freight: '请输入运费金额',
        satisfy: '请输入包邮条件',
        details: '请输入商品详情',
        label: '请选择服务标签',
      }
    })
    console.log(judgeData)
    //校验表单
    let warn = "",
      flag = true;
    if (!judgeData) {
      return
    } else if (params.groupNum < 2) {
      warn = '拼团人数应大于1'
    } else {
      //需要改变数据格式
      params.endTime = app.util.ormatTime(params.endTime)
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
        params.showImgs = JSON.stringify(res[0])
        params.detailImgs = JSON.stringify(res[1])
        //add
        app.api.prequest({
          'url': app.urlTwo.groupSaveGoods,
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