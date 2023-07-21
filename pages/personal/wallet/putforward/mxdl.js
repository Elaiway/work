// pages/personal/wallet/putforward/mxdl.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setNavigationBarTitle('明细详情')
    app.setNavigationBarColor(this);
    app.api.userinfo((info) => {
      console.log(info)
      that.setData({
        userinfo: info,
      })
    })
    var that = this;
    app.api.request({
      'url': app.url.cashinfo,
      data:{id:options.id},
      success: res => {
        console.log(res)
        let mxdl = res.data.data
        // switch (mxdl.mode) {
        //   case '1': mxdl.mode= "微信提现";
        //     break;
        //   case '2': mxdl.mode = "支付宝提现";
        //     break;
        //   case '3': mxdl.mode = "银行卡提现";
        //     break;
        // }
        mxdl.mode == '1' ? mxdl.mode = "微信提现" : mxdl.mode == '2' ? mxdl.mode = "支付宝提现" : mxdl.mode = "银行卡提现";
        switch (mxdl.status) {
          case '1': mxdl.status = "待审核";
            break;
          case '2': mxdl.status = "已通过";
            break;
          case '3': mxdl.status = "已拒绝";
            break;
        }
        mxdl.creatTime = app.util.ormatDate(mxdl.creatTime)
        mxdl.completeTime = app.util.ormatDate(mxdl.completeTime)
        that.setData({
          mxdl: res.data.data,
        })
      },
    })
  },
})