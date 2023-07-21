// pages/mall/commentorder.js
var app = getApp();
Page({
  data: {
    loading:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('评价订单')
    app.setNavigationBarColor(this);
    let orderInfo = JSON.parse(options.orderInfo)
    orderInfo.goods.forEach(item => {
      item.star = 0
      item.note = ''
      item.images = []
    })
    this.setData({
      goods: orderInfo.goods,
      orderInfo,
    })
    console.log(options, orderInfo)
  },
  onChange(e) {
    this.setData({
      [`goods[${e.currentTarget.dataset.idx}].star`]: e.detail.value,
    })
    console.log(e)
  },
  textareachange(e) {
    this.setData({
      [`goods[${e.currentTarget.dataset.idx}].note`]: e.detail,
    })
    console.log(e)
  },
  //upload
  uploadonChange(e) {
    console.log('uploadonChange', e)
    this.setData({
      [`goods[${e.currentTarget.dataset.idx}].images`]: e.detail.fileList,
    })
  },
  confirm() {
    let goods = this.data.goods
    console.log(goods)
    let rank = false;
    goods.forEach(comment => {
      if (comment.star <= 0) {
        rank = true;
      }
    })
    if (rank) return app.util.getShowtoast('打个分吧', 1000, 1)
    this.setData({
      loading:true,
    })
    app.util.getShowloading('提交中')
    //图片并发上传
    Promise.all(goods.map(item => {
      return app.api.wxUploadImg(item.images)
    })).then(res => {
      let params = []
      goods.forEach((item, index) => {
        params.push({
          orderId: item.orderId,
          goodsId: item.goodsId,
          body: item.note,
          star: item.star,
          img: JSON.stringify(res[index]),
          storeId: this.data.orderInfo.storeId,
        })
      })
      function e(num){
        if(num==params.length){
          app.util.getShowtoast('评价成功')
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/mall/order?key=5',
            })
          }, 1000)
        }
        else{
          app.util.getShowloading('提交中')
          app.api.prequest({
            'url': app.urlTwo.mallSaveComment,
            'method': 'POST',
            data: params[num],
          }).then((res) => {
            num++
            e(num)
          });
        }
      }
      e(0)
      console.log(res, params)
    })
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  }
})