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
      [
        [{
          name: '砍价标题',
          field: 'title',
          type: 'input',
          placeholder: '请输入砍价标题'
        }],
        [{
          name: '商品分类',
          field: 'category',
          type: 'select',
          key: 'name'
        }]
      ],
      [
        [{
            name: '砍价开始时间',
            field: 'startTime',
            type: 'date',
          },
          {
            name: '砍价结束时间',
            field: 'endTime',
            type: 'date',
          }
        ],
        [{
          name: '消费截止时间',
          field: 'useTime',
          type: 'date',
        }]
      ],
    ],
    columnsData: {
      color: [
        [{
            name: '绿色',
            color: '#01c07b'
          },
          {
            name: '香槟',
            color: '#ad5062'
          },
          {
            name: '荔枝红',
            color: '#e94158'
          },
          {
            name: '经典蓝',
            color: '#4f7bb8'
          },
          {
            name: '青涩',
            color: '#397470'
          },
          {
            name: '涩青',
            color: '#1e606c'
          },
          {
            name: '青灰',
            color: '#00c2c4'
          },
          {
            name: '古铜',
            color: '#786715'
          },
          {
            name: '红酒',
            color: '#711b1a'
          },
          {
            name: '葡萄紫',
            color: '#501e7d'
          },
        ]
      ], //房源装修
    },
    checkboxvalue: true,
    params: {
      storeId: '',
      logo: [], //图标
      title: '', //标题
      typePid: '', //商品分类一级
      startTime: '', //开始时间
      endTime: '', //结束时间
      useTime: '', //核销截止时间
      price: '', //原价
      floorPrice: '', //底价
      stock: '', //库存
      isFloor: '2', //是否底价购买 1是2否
      delivery: '1', //1快递2自提
      reduceNum: '', //可减次数
      top: '', //砍价上限
      down: '', //砍价下限
      body: '', //详情
      title: '', //标题
      media: [], //详情图片
      music: '',
      color: '',
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    app.setNavigationBarTitle('发布砍价')
    let uploadArr = [{
        tips: '上传商品主图，最多上传3张',
        title: '',
        count: '3',
        fileList: [],
        uploadList: [],
        show: true
      }, {
        tips: '',
        title: '上传商品详情图，最多上传6张',
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
      system: app.system,
    })
    console.log(options)
    //商家分类
    app.api.prequest({
      'url': app.urlTwo.bargainCategory,
    }).then(res => {
      var hyarr = res.data;
      var hyMultiArray = [
        [...hyarr],
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
            'url': app.urlTwo.bargainSaveBargain,
            method: 'POST',
            data: {
              bargainId: options.id
            },
          }).then(res => {
            let detailInfo = res.data
            detailInfo.startTime = app.util.ormatDate(detailInfo.startTime).substring(0, 16)
            detailInfo.endTime = app.util.ormatDate(detailInfo.endTime).substring(0, 16)
            detailInfo.useTime = app.util.ormatDate(detailInfo.useTime).substring(0, 16)
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
            //渲染分类
            let categoryP = hyMultiArray[0].find(item => item.id == detailInfo.typePid) || {}
            this.setData({
              uploadArr,
              labelsDefaultl: app.com.objToArr(detailInfo.label),
              'params.storeId': detailInfo.storeId,
              'params.category': `${categoryP.name || ''}`,
              lcradioarr: [{
                  name: '快递配送',
                  value: '1',
                  checked: detailInfo.delivery == 1
                },
                {
                  name: '到店自取',
                  value: '2',
                  checked: detailInfo.delivery == 2
                }
              ],
            })
            console.log(categoryP)
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
      case 'color':
        name = `${columnData[0][value[0]].color}`
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
      if (k != 'category') {
        params[k] = v[k]
      }
      if (k == 'isFloor') {
        params[k] = v[k] ? '1' : '2'
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
      filter: ['id', 'category', 'checkbox', 'media', 'music', ].concat(filterArr),
      tips: {
        storeId: '缺少商家id',
        typePid: '请选择商品分类',
        logo: '请上传商品主图',
        title: '请输入标题',
        startTime: '请选择开始时间',
        endTime: '请选择结束时间',
        useTime: '请选择核销截止时间',
        price: '请输入原价',
        floorPrice: '请输入底价',
        stock: '请输入库存',
        reduceNum: '请输入可减次数',
        top: '请输入砍价上限',
        down: '请输入砍价下限',
        body: '请输入商品详情',
        color: '请输入/选择主题颜色',
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
    } else if (params.endTime >= params.useTime) {
      warn = '消费截止时间要大于结束时间'
    } else if (+params.floorPrice < 0) {
      warn = '底价必须大于0'
    } else if (+params.down >= +params.top) {
      warn = '砍价上限不能低于砍价下限'
    } else {
      //需要改变数据格式
      params.startTime = app.util.ormatTime(params.startTime)
      params.endTime = app.util.ormatTime(params.endTime)
      params.useTime = app.util.ormatTime(params.useTime)
      //params.label = JSON.stringify(params.label)
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
          'url': app.urlTwo.bargainSaveBargain,
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