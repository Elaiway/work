// pages/personal/address/bjdz.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    label: [{ name: '家', id: '1' }, { name: '公司', id: '2' }, { name: '学校', id: '3' }],
    label1: [{ name: '先生', id: '1' }, { name: '女士', id: '2' }],
    acindex:0,
    acindex1: 0,
    region: ['北京市', '北京市', '东城区'],
  },
  labeltab(e){
    console.log(e)
    this.setData({
      acindex: e.currentTarget.dataset.index
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarColor(this);
    console.log(options)
    var that = this;
    if (options.bjid) {
      app.setNavigationBarTitle('编辑地址')
      console.log('edit')
      //取帮助信息
      app.api.request({
        'url': app.url.addressInfo,
        'cachetime': '0',
        data: { id: options.bjid },
        success: function (res) {
          console.log(res.data)
          res.data.data.address = res.data.data.address.split(',');
          for (let i in that.data.label){
            if (res.data.data.label == that.data.label[i].id){
              that.setData({
                acindex: i,
              })
            }
          } 
          that.setData({
            bjid: options.bjid,
            dzinfo: res.data.data,
            region: res.data.data.address,
          })
        }
      });
    }
    else {
      app.setNavigationBarTitle('新增地址')
      console.log('new')
      that.setData({
        isDefault:true
      })
    }
    // app.util.getLocation({
    //   type: "1",
    //   success: res => {
    //     console.log(res)
    //     // that.setData({
    //     //   lat: res.result.ad_info.location.lat,
    //     //   lng: res.result.ad_info.location.lng,
    //     //   address: res.result.address
    //     // })
    //     that.setData({
    //       detail: res.result.formatted_addresses.recommend,
    //       region: [res.result.address_component.province, res.result.address_component.city, res.result.address_component.district]
    //     })
    //   }
    // })
  },
  //选择位置
  chooseLocation: function () {
    var t = this;
    app.util.chooseLocation({
      success: res => {
        console.log(res)
        t.setData({
          address: res.address,
          mph: res.name,
          lat: res.latitude,
          lng: res.longitude,
        })
      }
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var that=this,co=this.data, v = e.detail.value, linkName = v.lxr, linkTel = v.tel, address = v.address.toString(), detailedAddress = v.detailedAddress, isDefault = v.isDefault, label = co.label[co.acindex].id, bjid = this.data.bjid||'';
    console.log(co, v, linkName, linkTel, address, detailedAddress, isDefault,label,bjid);
    var warn = "";
    var flag = true;
    if (linkName == "") {
      warn = "请填写联系人！";
    } else if (!app.util.isTelCode(linkTel)) {
      warn = "请输入有效的联系电话";
    } else if (detailedAddress == '') {
      warn = "请填写详细地址！";
    } else {
      flag = false;
      that.setData({
        loading: true
      })
      wx.showLoading({
        title: '保存中...',
        mask: true
      })
        app.api.request({
          'url': app.url.saveAddress,
          'method': 'POST',
          data: {
            linkName: linkName, linkTel: linkTel, address: address, detailedAddress: detailedAddress, isDefault: isDefault?'1':'2', label: label, id: bjid,
          },
          success: function (res) {
            console.log(res.data)
            wx.hideLoading()
            if (res.data.code == '1') {
              wx.showToast({
                title: '保存成功',
                duration: 1000
              })
              var pages = getCurrentPages();
              console.log(pages)
              // if (pages.length > 1 && pages[pages.length - 3].route == 'zh_cjdianc/pages/takeout/takeoutform') {

              //   var prePage = pages[pages.length - 3];

              //   prePage.countpsf()
              // }
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
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

  }
})