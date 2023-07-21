// dist/public/components/goods-cell/choose-address.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     renderInfo:{
       type:Object,
       value:null
     }
  },

  /**
   * 组件的初始数据
   */
  data: {
     addInfo:null,
  },
  lifetimes: {
    attached: function () {
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {
      app.api.prequest({
        'url': app.url.myAddress,
        'method': 'POST',
      }).then(res => {
        let mrad = res.data.find((item) => item.isDefault == 1)
        this.setData({
          addInfo: mrad||null
        })
        this.triggerEvent('getaddress', this.data.addInfo)
        //console.log(res, mrad)
      });
      console.log('parentOnShow')
    },
    hide() { },
    resize() { },
  },
  /**
   * 组件的方法列表
   */
  methods: {
         tzdzlb(){
           wx.navigateTo({
             url: '/pages/personal/address/dzlb',
           })
         },
  }
})
