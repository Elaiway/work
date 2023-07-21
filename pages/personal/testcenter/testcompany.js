// pages/personal/testcenter/testpersonal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxvalue: true,
    countries: ["个体工商户", "企业", "社会团体","事业单位","其他机构"],
    countryIndex: 0,
  },
  bindCountryChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryIndex: e.detail.value
    })
  },
  //勾选协议
  clickcheckbox(e) {
    console.log(e.detail)
    this.setData({
      checkboxvalue: e.detail
    })
  },
  //upload
  zmsfzonChange(e) {
    console.log('zmsfzonChange', e)
    this.setData({
      zmsfz: e.detail.fileList,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    app.setNavigationBarTitle('企业认证')
    that.setData({
      Swiper: {
        "padding": 0,
        "height": 100,
        "maxLimit": 300,
        "minLimit": 100,
        "swiper": {
          "children": [{
            url: app.imgsrc + '/wechatimg/testcenter/qyrz.png',
          }],
        }
      },
      storeid: options.storeid
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var that = this, co = this.data, v = e.detail.value, linkName = v.name, linkTel = v.tel, code = v.code, zmsfz = co.zmsfz || [],
      themeType = co.countries[v.themeType];
    console.log(co, v, linkName, themeType, code,linkTel, zmsfz);
    var warn = "";
    var flag = true;
    if (linkName == "") {
      warn = "请输入主体名称！";
    } else if (code==''||code.length<10) {
      warn = "请输入有效的执照注册号！";
    } else if (!app.util.isTelCode(linkTel)) {
      warn = "请输入有效的联系电话！";
    } else if (zmsfz.length == 0) {
      warn = "请上传营业执照图片";
    } else {
      flag = false;
      //return
      that.setData({
        loading: true
      })
      app.util.getShowloading('保存中')
      var n = [{
        pic_list: zmsfz,
        uploaded_pic_list: []
      }];
      console.log(n)
      a(0)

      function a(o) {
        if (o == n.length) return e();
        if (!n[o].pic_list.length || 0 == n[o].pic_list.length) return a(o + 1);
        app.api.uploadimg({
          imgarr: n[o].pic_list,
          success: res => {
            console.log(res)
            n[o].uploaded_pic_list = JSON.stringify(res)
            return a(o + 1)
          }
        })
      }
      function e() {
        console.log('请求接口', )
        //return
        app.api.request({
          'url': app.url.identAdd,
          'method': 'POST',
          data: {
            name: linkName, themeType: themeType, linkTel: linkTel, code: code, PositiveImg: n[0].uploaded_pic_list, type: 2,
            userId: co.storeid
          },
          success: function (res) {
            console.log(res.data)
            wx.hideLoading()
            if (res.data.code == '1') {
              wx.showToast({
                title: '保存成功',
                duration: 1000
              })
              app.util.swnb()
            } else {
              that.setData({
                loading: false
              })
              wx.showModal({
                title: '提示',
                content: res.data.msg,
              })
            }
          }
        })
      }
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
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