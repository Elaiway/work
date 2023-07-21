// pages/job-hunt/myjobhunt.js
const app = getApp();
Page({
  data: {
    zwIndex: [0, 0],
    lxarray: [{
        id: 0,
        name: '全职',
        type: 1
      },
      {
        id: 1,
        name: '兼职',
        type: 2
      },
    ],
    lxindex: 0,
    dyarray: [{
        id: 0,
        name: '面议'
      },
      {
        id: 1,
        name: '1000-2000'
      },
      {
        id: 2,
        name: '2000-4000'
      },
      {
        id: 3,
        name: '4000-6000'
      },
      {
        id: 4,
        name: '6000-10000'
      },
      {
        id: 5,
        name: '10000-15000'
      },
      {
        id: 6,
        name: '15000以上'
      }
    ],
    dyindex: 0,
    xbarray: [{
        id: 0,
        name: '性别不限',
        type: '0'
      },
      {
        id: 1,
        name: '男',
        type: '1'
      },
      {
        id: 2,
        name: '女',
        type: '2'
      },
    ],
    xbindex: 0,
    jyarray: [{
        name: "经验不限",
      },
      {
        name: "1年以内",
      },
      {
        name: "1-2年",
      },
      {
        name: "2-3年",
      },
      {
        name: "3-5年",
      },
      {
        name: "5-10年",
      },
      {
        name: "10年以上",
      },
    ],
    jyindex: 0,
    xlarray: [{
        name: "学历不限",
      },
      {
        name: "初中及以下",
      },
      {
        name: "中专/中技",
      },
      {
        name: "高中",
      },
      {
        name: "大专",
      },
      {
        name: "本科",
      },
      {
        name: "研究生",
      },
      {
        name: "硕士",
      },
      {
        name: "博士",
      },
      {
        name: "博士后",
      },
    ],
    xlindex: 0,
    region: ['北京市', '北京市', '东城区'],
    isshowpay: false,
    checkboxvalue: true,
    params: {
      title: '',
      linkman: '',
      linkTel: '',
      address: '',
      description: '',
      area:'',
    },
  },
  //职位
  // bindzwCChange: function(e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     zwIndex: e.detail.value
  //   })
  // },
  bindzwCChange: function(e) {
    this.commonChange(e, 'zwMarr', 'zwIndex', 'zwarr')
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  },
  //公用change事件
  commonChange(e, a, b, c) {
    var data = {
        [a]: this.data[a],
        [b]: this.data[b]
      },
      arr = this.data[c];
    console.log(data)
    data[b][e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        data[a][1] = arr[e.detail.value].son;
        data[b][1] = 0;
        break;
    }
    this.setData(data);
  },
  bindlxCChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      lxindex: e.detail.value
    })
  },
  binddyCChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dyindex: e.detail.value
    })
  },
  bindxbCChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      xbindex: e.detail.value
    })
  },
  bindjyCChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      jyindex: e.detail.value
    })
  },
  bindxlCChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      xlindex: e.detail.value
    })
  },
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //描述
  textareachange(e) {
    console.log(e.detail)
    this.setData({
      'params.description': e.detail
    })
  },
  //选择标签
  labelChange(e) {
    let j = {}
    e.detail.map(v => {
      j[v.id] = v.name
    })
    if (e.detail.length <= 5) {
      this.setData({
        'params.label': j
      })
    } else {
      app.util.getShowtoast('最多选择5个标签')
      return
    }
    console.log('labelChange', j, e.detail)
  },
  //上传图片
  uploadChange(e) {
    this.setData({
      [`uploadArr[0].uploadList`]: e.detail.fileList,
    })
    console.log(e, this.data.uploadArr)
  },
  //勾选协议
  clickcheckbox(e) {
    console.log(e.detail)
    this.setData({
      checkboxvalue: e.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    app.setNavigationBarTitle('发布-招聘')
    app.setNavigationBarColor(this);
    this.setData({
      categoryId: options.id,
      system: app.system,
    })
    app.api.jobhunt(res => {
      let uploadArr = [{
          tips: '最多上传9张',
          title: '上传图片',
          count: '9',
          fileList: [],
          uploadList: [],
          show: true
        }, ],
        filterArr = []
      that.setData({
        jobSet: res,
        uploadArr,
        isEdit: options.detailId > 0,
      })
    })
    console.log(options, options.id)
    //请求招聘金额
    app.api.prequest({
      'url': app.url.jobSaveRecruit,
      data: {
        categoryId: this.data.categoryId
      }
    }).then(res => {
      this.setData({
        money: res.data.money
      })
    })
    //请求求职招聘下的标签
    app.api.prequest({
      'url': app.url.jobCategoryLabel,
      'method': 'POST',
      data: {
        categoryId: this.data.categoryId
      }
    }).then(res => {
      console.log('招聘分类下的标签', res.data)
      this.setData({
        tags: res.data,
      })
    })
    //职位列表
    app.api.prequest({
      'url': app.url.jobPosition,
    }).then(res => {
      console.log(res.data)
      var zwarr = res.data;
      for (let i in zwarr) {
        if (zwarr[i].son.length == 0) {
          zwarr[i].son[0] = {
            name: '',
            id: ''
          }
        } else {
          for (let j in zwarr[i].son) {
            zwarr[i].son[j].name = zwarr[i].son[j].name
          }
        }
      }
      var MultiArray = [
        [...zwarr],
        [...zwarr[0].son]
      ];
      console.log(zwarr, MultiArray)
      this.setData({
        zwarr: zwarr,
        zwMarr: MultiArray,
      })
      //招聘详情用于渲染招聘编辑页面
      if (options.detailId) {
        console.log(options.detailId, options.categoryId)
        this.setData({
          detailId: options.detailId
        })
        app.api.prequest({
          'url': app.url.recruitInfo,
          data: {
            recruitId: this.data.detailId
          }
        }).then(res => {
          console.log(res.data, res.data.data)
          let detailInfo = res.data.data,
            detailtag = res.data.tag,
            zwpindex = 0,
            zwcindex = 0,
            lxpindex = 0,
            dypindex = 0,
            xbpindex = 0,
            jypindex = 0,
            xlpindex = 0
          //渲染基本输入框数据
          for (let k in this.data.params) {
            this.setData({
              [`params.${k}`]: detailInfo[k],
            })
          }
          //渲染图片
          let uploadArr = this.data.uploadArr
          uploadArr[0].fileList = uploadArr[0].uploadList = app.util.getTypeImgsUrl(detailInfo.media, 'empty')
          this.setData({
            uploadArr,
          })
          //职位信息
          for (let i in zwarr) {
            for (let j in zwarr[i].son) {
              if (detailInfo.positionId == zwarr[i].son[j].id) {
                zwpindex = i
                zwcindex = j
                break
              }
            }
          }
          //类型信息
          let lxarray = this.data.lxarray
          for (let i in lxarray) {
            if (detailInfo.workNature == lxarray[i].type) {
              lxpindex = i
              break
            }
          }
          //待遇
          let dyarray = this.data.dyarray
          for (let i in dyarray) {
            if (detailInfo.salary == dyarray[i].name) {
              dypindex = i
              break
            }
          }
          //性别
          let xbarray = this.data.xbarray
          for (let i in xbarray) {
            if (detailInfo.sex == xbarray[i].type) {
              xbpindex = i
              break
            }
          }
          //经验
          let jyarray = this.data.jyarray
          for (let i in jyarray) {
            if (detailInfo.experience == jyarray[i].name) {
              jypindex = i
              break
            }
          }
          //学历
          let xlarray = this.data.xlarray
          for (let i in xlarray) {
            if (detailInfo.education == xlarray[i].name) {
              xlpindex = i
              break
            }
          }
          //渲染标签
          let labelsarr = []
          for (let k in detailtag) {
            labelsarr.push(detailtag[k])
            // console.log(detailtag[k])
          }
          //公司地址
          let editarea = detailInfo.area.split(',')
          // console.log(editarea, editarea[0], editarea[1], editarea[2])
          this.setData({
            zwMarr: [
              [...zwarr],
              [...zwarr[zwpindex].son]
            ],
            zwIndex: [zwpindex, zwcindex],
            lxindex: [lxpindex],
            dyindex: [dypindex],
            xbindex: [xbpindex],
            jyindex: [jypindex],
            xlindex: [xlpindex],
            labelsDefault: labelsarr,
            region: [editarea[0], editarea[1], editarea[2]],
          })
          console.log(res.data)
        })
      }
    })
  },
  formSubmit: function(e) {
    let that = this,
      co = this.data,
      v = e.detail.value,
      params = {
        title: v.title, //招聘标题
        industryId: co.zwMarr[0][v.sszw[0]].id,
        positionId: co.zwMarr[1][v.sszw[1]] ? co.zwMarr[1][v.sszw[1]].id : '',//职位id
        workNature: co.lxarray[co.lxindex].type, //全职兼职
        salary: co.dyarray[co.dyindex].name, //薪资
        linkman: v.linkman,//联系人
        linkTel: v.linkTel,//联系电话
        area: this.data.system.mode == '1' ? v.area : co.region.toString(), //省市区地址
        address: v.address, //完善地址
        description: v.description, //职能描述
        sex: co.xbarray[co.xbindex].type, //性别
        experience: co.jyarray[co.jyindex].name, //经验要求
        education: co.xlarray[co.xlindex].name, //学历
        label: co.params.label && JSON.stringify(co.params.label), //标签
        media: co.uploadArr[0].uploadList, //公司相册
        typeId: co.categoryId, //分类ID
        recruitId: co.detailId ? co.detailId : '',
      }
    console.log('form发生了submit事件，携带数据为：', co, v, params)
    //return
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['media','recruitId'].concat(co.filterArr),
      tips: {
        title: '请填写招聘标题',
        workNature: '请选择招聘类型',
        salary: '请填写薪资待遇',
        linkman: '请填写联系人',
        linkTel: '请填写联系电话',
        area: '请输入公司地址',
        address: '请完善公司地址信息',
        description: '请填写职位描述',
        industryId: '缺少行业ID',
        positionId: '缺少职位ID',
        sex: '请填写性别要求',
        experience: '请填写经验要求',
        education: '请填写学历要求',
        label: '请至少选择一个标签',
        typeId: '缺少分类ID',
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
      flag = false;
      console.log("表单校验完成")
      //return
      app.util.getShowloading('提交中')
      that.setData({
        loading: true,
      })
      Promise.all(co.uploadArr.map(item => {
        return app.api.wxUploadImg(item.uploadList)
      })).then(res => {
        console.log(res)
        params.media = JSON.stringify(res[0])
        //return
        app.api.prequest({
          'url': app.url.jobSaveRecruit,
          'method': 'POST',
          data: params,
        }).then(res => {
          if (res.code == '1') {
            let rzId = res.data
            if (!co.isEdit && Number(this.data.money) > 0) {
              that.setData({
                rzId: rzId,
                isshowpay: true,
                payobj: {
                  params: {
                    money: this.data.money,
                    recruitId: rzId,
                  },
                  apiurl: app.url.jobRecruitPay
                }
              })
            } else {
              app.util.getShowtoast('操作成功')
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/jobhunt/myjobhunt',
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
        })
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
        url: '/pages/jobhunt/myjobhunt',
      })
    }
  },
  onShow: function() {},
  onHide: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {}
})