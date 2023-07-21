// pages/yellow/sett.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshowpay: false,
    checkboxItems: [{
        name: 'standard is dealt for u.',
        value: '0',
        checked: true
      },
      {
        name: 'standard is dealicient for u.',
        value: '1'
      }
    ],
    checkboxvalue: true,
    params: {
      storeId: '',
      userId: '',
      userTel: '',
      remarks: '',
      power: []
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.setNavigationBarColor(this);
    app.setNavigationBarTitle('员工设置')
    this.setData({
      isEdit: options.id > 0,
      'params.id': options.id || '',
      'params.storeId': app.sjdId,
      system: app.system,
    })
    console.log(options)
    //核销权限
    app.api.prequest({
      'url': app.urlTwo.clerkPower,
    }).then(res => {
      let arr = []
      for (let i in res.data) {
        arr.push({
          name: res.data[i],
          value: i,
          checked: true,
        })
      }
      this.setData({
        checkboxItems: arr
      })
      console.log('核销权限', res.data, arr)
      //用于渲染编辑
      if (options.id) {
        app.api.prequest({
          'url': app.urlTwo.clerkSave,
          data: {
            id: options.id
          },
        }).then(res => {
          let resData = res.data,
            detailInfo = JSON.parse(options.info),
            powerArr = []
          //detailInfo.userTel = app.com.hideTel(detailInfo.userTel)
          //渲染基本输入框数据
          for (let k in this.data.params) {
            this.setData({
              [`params.${k}`]: detailInfo[k],
            })
          }
          for (let j in resData.power) {
            powerArr.push(j)
          }
          for (let i in arr) {
            arr[i].checked = powerArr.indexOf(arr[i].value) > -1
          }
          this.setData({
            checkboxItems: arr,
            'params.storeId': resData.storeId,
          })
          console.log(resData, detailInfo)
        })
      }
    })
  },
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.checkboxItems,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      checkboxItems: checkboxItems
    });
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
      params[k] = v[k]
    }
    //根据开关添加过滤字段
    // if (!co.system.openVip) {
    //   filterArr.push('memberPrice')
    // }
    console.log('form发生了submit事件，携带数据为：', co, v, params, filterArr)
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['id', 'userId', 'userTel', 'remarks', ].concat(filterArr),
      tips: {
        storeId: '缺少商家id',
        userId: '请输入用户ID',
        userTel: '请输入员工手机号',
        remarks: '请输入备注名',
        power: '请至少选择一个权限',
      }
    })
    console.log(judgeData)
    //校验表单
    let warn = "",
      flag = true;
    if (!judgeData) {
      return
    } else if (!params.userId.trim() && !params.userTel.trim() && !params.remarks.trim()) {
      warn = '三个信息任写一组即可'
    } else {
      //需要改变数据格式
      params.power = JSON.stringify(params.power)
      //return
      flag = false;
      app.util.getShowloading('提交中')
      that.setData({
        loading: true,
      })
      //add
      app.api.prequest({
        'url': app.urlTwo.clerkSave,
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
      });
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
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