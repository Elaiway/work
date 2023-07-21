var app = getApp();
Page({
  
  data: {
    params: {
      size: 5,
      page:1
    },
    typelist:[],
    loading:false,
    noMore:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log(options)
    this.setData({
      'params.goodsId': options.id
    })
    app.setNavigationBarTitle('评论列表')
    app.setNavigationBarColor(this);
    that.getProlist()
  },
  // 获取商品列表
  getProlist() {
    this.setData({
      loading: true
    })
    let that = this,
    
      params = this.data.params
    console.log(app.url,9999)
    app.api.prequest({
      'url': app.url.moreComment,
      data: params,
    }).then(res => {
      this.setData({
        loading: false
      })
      // for (let i = 0; i < res.data.length; i++) {
      //   res.data[i].logo = app.util.getImgUrl(res.data[i].logo)
      // }
      // if (res.data.length < 10) {
      //   that.setData({
      //     // mygd: true,
      //   })
      // } 
      if(res.data==[]){
       
        return false
      }else{
       
        res.data.forEach(item => {
          item.img = app.util.getTypeImgsUrl(item.img)
          item.createdAt = app.util.settime(item.createdAt)
        })
        let typelist = res.data
        console.log(typelist,6363)
          this.setData({
            typelist: this.data.typelist.concat(typelist)
          })
      }
      
     



      
    })
  },
  previewImage2(e) {
    const url = e.currentTarget.dataset.url,
      urls = e.currentTarget.dataset.urls.map(item => item.url)
    app.com.preImg({
      url,
      urls
    })
  },
  scrollToLower (e) {
    this.data.params.page = this.data.params.page + 1
    this.getProlist();
},
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  }
})