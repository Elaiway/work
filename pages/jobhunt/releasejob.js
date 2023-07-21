// pages/job-hunt/myjobhunt.js
const app = getApp();
Page({
  data: {
    sextype: [{
        name: "男"
      },
      {
        name: "女"
      }
    ],
    xlarray: [{
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
    sjarray: [{
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
    sjindex: 0,
    zwIndex: [0, 0],
    xzarray: [{
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
    xzindex: 0,
    xzzarray: [{
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
    xzzindex: 0,
    region: ['北京市', '北京市', '东城区'],
    isshowpay: false,
    checkboxvalue: true,
    // current:0,
    params: {
      name: '',
      tel: '',
      sex: '',
      age: '',
      jobStatus: '',
      introduce: '',
      area: '',
    },
  },
  //选择性别
  onsextype(e) {
    this.setData({
      current: e.currentTarget.dataset.index,
      'params.sex': e.currentTarget.dataset.index + 1
    })
    // console.log(this.data.params.type, e.currentTarget.dataset.index)
  },
  //选择职位
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
  bindxzCChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      xzindex: e.detail.value
    })
  },
  bindxzzCChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      xzzindex: e.detail.value
    })
  },
  //学历
  bindxlCChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      xlindex: e.detail.value
    })
  },
  //工作时间
  bindsjCChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sjindex: e.detail.value
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
      'params.introduce': e.detail
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
      // [`uploadArr[0].uploadList`]: e.detail.fileList,
      [`uploadArr[${e.currentTarget.dataset.idx}].uploadList`]: e.detail.fileList,
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
    app.setNavigationBarTitle('发布-求职')
    app.setNavigationBarColor(this);
    this.setData({
      categoryId: options.id,
      system: app.system,
    })
    // 获取用户信息
    if (!options.detailId) {
      app.getUserInfo((userinfo) => {
        console.log(userinfo)
        that.setData({
          userinfo: userinfo,
          'params.name': userinfo.userName,
          'params.tel': userinfo.userTel,
          current: userinfo.sex - 1,
          'params.sex': userinfo.sex,
        })
      })
    }
    app.api.jobhunt(res => {
      let uploadArr = [{
          tips: '上传图像，一个好的工作的开始',
          title: '上传图片',
          count: '1',
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
      // console.log('招聘分类下的标签', res.data)
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
      //求职详情用于渲染招聘编辑页面
      if (options.detailId) {
        console.log(options.detailId, options.categoryId)
        this.setData({
          detailId: options.detailId
        })
        app.api.prequest({
          'url': app.url.jobInfo,
          data: {
            jobId: this.data.detailId
          }
        }).then(res => {
          console.log(res.data, res.data.data)
          let detailInfo = res.data.data,
            detailtag = res.data.tag,
            zwpindex = 0,
            zwcindex = 0,
            xzpindex = 0,
            xzzpindex = 0,
            xlpindex = 0,
            sjpindex = 0
          //渲染基本输入框数据
          for (let k in this.data.params) {
            this.setData({
              [`params.${k}`]: detailInfo[k],
            })
          }
          //渲染图片
          let uploadArr = this.data.uploadArr
          uploadArr[0].fileList = uploadArr[0].uploadList = app.util.getTypeImgsUrl([{type:'img',url:detailInfo.logo}], 'empty')
          this.setData({
            uploadArr,
          })
          console.log(this.data.uploadArr, uploadArr)
          console.log(uploadArr[0].fileList, uploadArr[0].uploadList, app.util.getSingleImgUrl(detailInfo.logo))
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
          //薪资信息
          let xzarray = this.data.xzarray
          for (let i in xzarray) {
            if (detailInfo.salary == xzarray[i].name) {
              xzpindex = i
              break
            }
          }
          //工作性质
          let xzzarray = this.data.xzzarray
          for (let i in xzzarray) {
            if (detailInfo.workNature == xzzarray[i].type) {
              xzzpindex = i
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
          //工作时间
          let sjarray = this.data.sjarray
          for (let i in sjarray) {
            if (detailInfo.experience == sjarray[i].name) {
              sjpindex = i
              break
            }
          }
          //求职区域
          let editarea = detailInfo.area.split(',')
          // console.log(editarea, editarea[0], editarea[1], editarea[2])
          //渲染标签
          let labelsarr = []
          for (let k in detailtag) {
            labelsarr.push(detailtag[k])
            // console.log(detailtag[k])
          }
          this.setData({
            zwMarr: [
              [...zwarr],
              [...zwarr[zwpindex].son]
            ],
            zwIndex: [zwpindex, zwcindex],
            xzindex: [xzpindex],
            xzzindex: [xzzpindex],
            xlindex: [xlpindex],
            sjindex: [sjpindex],
            labelsDefault: labelsarr,
            region: [editarea[0], editarea[1], editarea[2]],
            current: detailInfo.sex - 1,
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
        logo: co.uploadArr[0].uploadList[0].url, //图像
        name: v.name, //姓名
        sex: co.params.sex, //性别
        tel: v.tel, //手机号
        age: v.age, //年龄
        industryId: co.zwMarr[0][v.qwzw[0]].id, //行业id
        positionId: co.zwMarr[1][v.qwzw[1]] ? co.zwMarr[1][v.qwzw[1]].id : '', //职位id
        salary: co.xzarray[co.xzindex].name, //薪资
        introduce: v.introduce, //自我介绍
        experience: co.sjarray[co.sjindex].name, //工作时间
        education: co.xlarray[co.xlindex].name, //学历
        workNature: co.xzzarray[co.xzzindex].type, //全职兼职
        jobStatus: v.jobStatus, //求职状态
        label: co.params.label && JSON.stringify(co.params.label), //标签
        typeId: co.categoryId, //分类ID
        area: this.data.system.mode == '1' ? v.area : co.region.toString(), //省市区地址
        jobId: co.detailId ? co.detailId : '',
      }
    console.log('form发生了submit事件，携带数据为：', co, v, params)
    //return
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['jobId'].concat(co.filterArr),
      tips: {
        name: '请填写真实姓名',
        sex: '请选择性别',
        tel: '请输入手机号码',
        age: '请填写年龄',
        education: '请选择最高学历',
        experience: '请选择工作时间',
        industryId: '缺少行业ID',
        positionId: '缺少职位ID',
        salary: '请选择期望薪资',
        area: '请输入求职区域',
        workNature: '请选择工作性质',
        jobStatus: '请输入求职状态',
        label: '请至少选择一个标签',
        introduce: '请填写自我描述',
        typeId: '缺少分类ID',
        logo: '请上传图像',
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
        console.log(res, res[0][0].url)
        // params.logo = JSON.stringify(res[0][0].url)
        params.logo = res[0][0].url
        //return
        app.api.prequest({
          'url': app.url.jobSaveJob,
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
                    jobId: rzId,
                  },
                  apiurl: app.url.jobJobPay
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
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/jobhunt/myjobhunt',
              })
            }, 1000)
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