// dist/public/foot_menu/foot-dl.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: Object,
      value: {}
    },
    type: {
      type: String,
      value: "1"
    },
    width: {
      type: String,
      value: "42"
    }
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
    onTap(e){
      let item = e.currentTarget.dataset.item
      console.log('footmenu', item)
      if (item.navigateType == '4'){
        app.util.openlocation(item.location)
        return
      }
      if (item.isLogin){
        if (app.isLogin()){
          this.triggerEvent("footclick", item)
          if (item.navigateType == '3') {
            wx.reLaunch({
              url: item.src,
            })
          }
          else if (item.navigateType == '1') {
            wx.navigateTo({
              url: item.src,
            })
          }
          else if (item.navigateType == '2') {
            wx.redirectTo({
              url: item.src,
            })
          }
        }
      }
      else{
        this.triggerEvent("footclick", item)
        if (item.navigateType == '3') {
          wx.reLaunch({
            url: item.src,
          })
        }
        else if (item.navigateType == '1') {
          wx.navigateTo({
            url: item.src,
          })
        }
        else if (item.navigateType == '2') {
          wx.redirectTo({
            url: item.src,
          })
        }
      }
    },
  }
})
