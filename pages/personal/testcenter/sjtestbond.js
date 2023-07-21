// pages/personal/testcenter/testpersonal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxvalue: true,
    actions: [],
    visible: false,
    xzname:'请选择缴纳金规格',
  },
  //勾选协议
  clickcheckbox(e) {
    console.log(e.detail)
    this.setData({
      checkboxvalue: e.detail
    })
  },
  modalOpen() {
    this.setData({
      mvisible: true
    });
  },
  modalok() {
    app.util.getShowloading()
    let that=this;
    this.setData({
      mvisible: false
    });
    //refundBond
    app.api.request({
      'url': app.url.refundBond,
      'method': 'POST',
      data: {
        id: that.data.myEnsure.id,
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == '1') {
          wx.showModal({
            title: '退还申请成功',
            content: '保证金将在7个工作日内退还',
          })
          app.util.swnb()
        }
        else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
      }
    });
  },
  modalClose() {
    this.setData({
      mvisible: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    app.setNavigationBarColor(this);
    app.setNavigationBarTitle('认证中心')
    that.setData({
      Swiper: {
        "padding": 0,
        "height": 100,
        "maxLimit": 300,
        "minLimit": 100,
        "swiper": {
          "children": [{
            url: app.imgsrc + '/wechatimg/testcenter/cxbzj.png',
          }],
        },
      },
      storeid: options.storeid
    })
    //myEnsure
    app.api.request({
      'url': app.url.myEnsure,
      data: { id: options.storeid, type:2},
      success: res => {
        console.log(res)
        that.setData({
          myEnsure: res.data.data,
        })
      },
    })
    app.api.identSet((info) => {
      console.log(info)
      let arr=[];
      // if (info.bondPersonal == '1') {
      //   arr.push({ bond: '1', name: '商家信誉保证金' + info.companyMoney + '元', money: info.companyMoney,})
      // }
      
        arr.push({ bond: '1', name: '商家信誉保证金' + info.companyMoney + '元', money: info.companyMoney,})
      
      that.setData({
        identSet: info,
        actions:arr,
      })
      console.log(arr)
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var that = this, co = this.data, v = e.detail.value;
    console.log(co, v);
    var warn = "";
    var flag = true;
    if (app.util.isNull(v.checkbox)) {
      warn = "请查看保证金协议并勾选";
    } else {
      flag = false;
      this.setData({
        visible: true,
      });
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  handleCancel() {
    this.setData({
      visible: false
    });
  },
  handleClickItem({
    detail
  }) {
    app.util.getShowloading()
    const index = detail.index;
    let that = this,
      typeinfo = this.data.actions[index];
    console.log(index, this.data.actions, typeinfo)
    this.setData({
      visible: false,
    })
    //saveBond
    app.api.request({
      'url': app.url.saveBond,
      'method': 'POST',
      data: {
        userId: that.data.storeid, money: typeinfo.money, type: 2,
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == '1') {
          let oid = res.data.data
          that.setData({
            isshowpay: !that.data.isshowpay,
            payobj: { params: { money: typeinfo.money,bondId: oid }, apiurl: app.url.bondPay }
          })
        }
        else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
        }
        console.log('saveBond', res.data)
      }
    });
  },
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      wx.navigateBack({
        
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})