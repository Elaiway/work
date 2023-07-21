// dist/public/components/common/header-dl.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: {
      type: Object,
      value: {hd:1,ft:1}
    },
    color: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    acindex:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back(){
      if (getCurrentPages().length>1){
        wx.navigateBack({
          
        })
      }
      else{
        wx.redirectTo({
          url: this.data.content.hd.link,
        })
      }
    },
    bdClick(e){
      this.setData({
        acindex: e.currentTarget.dataset.index,
      })
      this.triggerEvent('bdclick', e.currentTarget.dataset.index)
    },
  }
})
