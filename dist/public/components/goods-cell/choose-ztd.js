// dist/public/components/goods-cell/choose-address.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    storeId: {
      type: String,
      value: {},
    },
    renderInfo: {
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    addInfo: null,
    popupshow: false,
  },
  lifetimes: {
    attached: function() {
      app.api.prequest({
        url: app.urlTwo.deliverSet,
        method: 'POST',
        data: {
          storeId: this.data.storeId
        },
      }).then(res => {
        this.setData({
          ztd: res.data || []
        })
        // let mrad = res.data.find((item) => item.isDefault == 1)
        // this.setData({
        //   addInfo: mrad || null
        // })
        // this.triggerEvent('getaddress', this.data.addInfo)
        console.log(res)
      });
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() {
      console.log('parentOnShow')
    },
    hide() {},
    resize() {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //弹窗
    togglePopup() {
      this.setData({
        popupshow: !this.data.popupshow,
      })
    },
    clickZtd(e){
      let selectedztd = this.data.ztd[e.currentTarget.dataset.idx]
      this.setData({
        selectedztd,
        popupshow: !this.data.popupshow,
      })
      this.triggerEvent('getaddress', selectedztd)
      console.log(selectedztd)
    },
  }
})