// dist/public/components/top-select/nav-select.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content:{
      type:Array,
      value:[]
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
    popupshow:false,
    imgtoggle:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    select(e){
      let index = e.currentTarget.dataset.index, item = this.data.content[index]
      this.setData({
        active: index,
        imgtoggle: item.sort ? !this.data.imgtoggle : false,
      })
      if (item.modal){
        this.setData({
          popupshow: !this.data.popupshow,
        })
      }
      this.triggerEvent('selectchange', item)
      console.log(item)
    },
    togglePopup(){
      this.setData({
        popupshow: !this.data.popupshow,
      })
    },
  }
})
