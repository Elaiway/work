// dist/public/components/goods-cell/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: Object,
      value: {}
    },
    goodsInfo: {
      type: Object,
      value: {},
      // observer(newval){
      //   console.log(newval)
      // },
    },
    pageType: {
      type: String,
      value: ''
    },
    color:{
      type:String,
      value:''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickOrder(e) {
      let i = e.currentTarget.dataset
      // a=i.info
      // this.triggerEvent('orderDeta', a)
      // console.log(currentPage == this)

      if (this.data.pageType == 'integral'){
        wx.navigateTo({
          url: '/pages/personal/integral/integralmall/orderdeta?param=' + JSON.stringify(this.data.goodsInfo),
        })
      }
     
      console.log(e)
    },
    goodBtn(e){
      let fon = e.currentTarget.dataset.text, obj = { name: fon, id: this.data.goodsInfo.orderId}
      this.triggerEvent('myevent', obj)
      console.log(fon)
    }
  }
})
