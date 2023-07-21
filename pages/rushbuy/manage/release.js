// pages/coupon/release.js
const app = getApp();
Page({
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
          name: '抢购标题',
          field: 'title',
          type: 'input',
          placeholder: '请输入抢购标题'
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
            name: '抢购开始时间',
            field: 'startTime',
            type: 'date',
          },
          {
            name: '抢购结束时间',
            field: 'endTime',
            type: 'date',
          }
        ],
        [{
          name: '消费截止时间',
          field: 'expireTime',
          type: 'date',
        }]
      ],
    ],
    checkboxvalue: true,
    params: {
      id: '',
      showImgs: '', //主图
      title: '', //标题
      startTime: '', //开始时间
      endTime: '', //结束时间
      expireTime: '', //核销截止时间
      typeId: '', //商品分类
      originalPrice: '', //商品原价
      rushPrice: '', //抢购价
      memberPrice: '', //会员抢购价
      num: '', //库存
      limitNum: '', //购买限制数量
      label: {}, //服务范围标签
      detailImgs: [], //详情图片
      details: '', //详情
      delivery: '1',//1快递2自提
      music: '',   //音乐链接
      video: '',   //视频链接
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    app.api.rushbuy(res => {
      app.setNavigationBarTitle('发布-' + res.field)
      this.setData({
        rushbuy: res,
      })
      console.log(res)
    })
    let uploadArr = [{
          tips: '上传商品主图，最多可上传3张，建议尺寸:750*750px',
          title: '',
          count: '3',
          fileList: [],
          uploadList: [],
          show: true
        },
        {
          tips: '',
          title: '上传商品详情图，最多上传3张',
          count: '3',
          fileList: [],
          uploadList: [],
          show: true
        },
      ],
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
    //商品分类
    app.api.prequest({
      'url': app.urlTwo.category,
      data: {
        term: 16
      }
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
            'url': app.urlTwo.rushSaveGoods,
            method: 'POST',
            data: {
              goodsId: options.id
            },
          }).then(res => {
            let detailInfo = res.data
            detailInfo.startTime = app.util.ormatDate(detailInfo.startTime).substring(0, 16)
            detailInfo.endTime = app.util.ormatDate(detailInfo.endTime).substring(0, 16)
            detailInfo.expireTime = app.util.ormatDate(detailInfo.expireTime).substring(0, 16)
            //渲染基本输入框数据
            for (let k in this.data.params) {
              this.setData({
                [`params.${k}`]: detailInfo[k],
              })
            }
            console.log(res.data)
            //渲染图片
            let uploadArr = this.data.uploadArr
            uploadArr[0].fileList = uploadArr[0].uploadList = app.util.getTypeImgsUrl(detailInfo.showImgs, 'empty')
            uploadArr[1].fileList = uploadArr[1].uploadList = app.util.getTypeImgsUrl(detailInfo.detailImgs, 'empty')
            //渲染分类
            let categoryP = hyMultiArray[0].find(item => item.id == detailInfo.typeId) || {}
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
  //文本需求描述
  textareachange(e) {
    console.log(e.detail)
    this.setData({
      'params.details': e.detail
    })
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
    params.showImgs = co.uploadArr[0].uploadList
    params.detailImgs = co.uploadArr[1].uploadList
    // console.log(co.params.type)
    //将form表单值赋值给params
    for (let k in v) {
      if (k != 'category') {
        params[k] = v[k]
      }
      //根据开关添加过滤字段
      // if (!co.system.openVip) {
      //   filterArr.push('memberPrice')
      // }
    }
    //获取分类id
    if (params.category) {
      let categoryP = co.columnsData.category[0].find(item => item.name == params.category.split(',')[0]) || {}
      params.typeId = categoryP.id
      console.log(categoryP)
    }
    console.log('form发生了submit事件，携带数据为：', co, v, params)
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['id', 'category', 'detailImgs', 'memberPrice','label','checkbox', 'music', 'video'].concat(co.filterArr),
      tips: {
        storeId: '缺少商家id',
        typeId: '请选择商品分类',
        showImgs: '请上传商品主图',
        title: '请输入标题',
        startTime: '请选择开始时间',
        endTime: '请选择结束时间',
        expireTime: '请选择核销截止时间',
        originalPrice: '请输入原价',
        rushPrice: '请输入抢购价',
        num: '请输入库存',
        limitNum: '请输入每人限购数量',
        details:'请输入商品详情',
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
    } else if (params.startTime >= params.endTime) {
      warn = '结束时间要大于开始时间'
    } else if (params.endTime >= params.expireTime) {
      warn = '消费截止时间要大于结束时间'
    }
    else {
      //需要改变数据格式
      params.startTime = app.util.ormatTime(params.startTime)
      params.endTime = app.util.ormatTime(params.endTime)
      params.expireTime = app.util.ormatTime(params.expireTime)
      params.label = JSON.stringify(params.label)
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
        params.showImgs = JSON.stringify(res[0])
        params.detailImgs = JSON.stringify(res[1])
        //add
        //return
        app.api.prequest({
          'url': app.urlTwo.rushSaveGoods,
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
  onShow() {},
  onHide() {},
  onPullDownRefresh() {}
})