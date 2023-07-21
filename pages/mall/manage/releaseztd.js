// pages/mall/manage/releaseztd.js
var app = getApp();
Page({
  data: {
    params: {
      storeId: '',
      linkName: '',
      linkTel: '',
      address: '',
      detailedAddress: '',
      lat: '',
      lng: '',
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('自提点')
    app.setNavigationBarColor(this);
    this.setData({
      isEdit: options.id > 0,
      'params.id': options.id || '',
      'params.storeId': app.sjdId,
    })
    if(options.id>0){
      app.api.prequest({
        'url': app.urlTwo.shopAddressInfo,
        data: { addressId:options.id}
      }).then(res => {
        let detailInfo = res.data
        //渲染基本输入框数据
        for (let k in this.data.params) {
          this.setData({
            [`params.${k}`]: detailInfo[k],
          })
        }
      })
    }
    console.log(options)
  },
  //选择位置
  chooseLocation: function() {
    var t = this;
    app.util.chooseLocation({
      success: res => {
        t.setData({
          'params.address': res.address,
          'params.detailedAddress': res.name,
          'params.lat': res.latitude,
          'params.lng': res.longitude,
        })
        console.log(res, app.com.getArea(res.address))
      }
    })
  },
  formSubmit: function(e) {
    let that = this,
      co = this.data,
      v = e.detail.value,
      params = co.params;
    //将form表单值赋值给params
    for (let k in v) {
      params[k] = v[k]
    }
    console.log('form发生了submit事件，携带数据为：', co, v, params)
    let judgeData = app.com.isFailParams({
      field: params,
      filter: ['id', 'lat', 'lng'].concat(co.filterArr),
      tips: {
        storeId: '缺少商家id',
        linkName: '请输入联系人',
        linkTel: '请输入电话号码',
        address: '请选择地址',
        detailedAddress: '请输入详细地址',
      }
    })
    console.log(judgeData)
    //校验表单
    let warn = "",
      flag = true;
    if (!judgeData) {
      return
    } else {
      //需要改变数据格式
      //return
      flag = false;
      app.util.getShowloading('提交中')
      that.setData({
        loading: true,
      })
      //add
      app.api.prequest({
        'url': app.urlTwo.shopSaveAddress,
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
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  onShow: function() {

  }
})