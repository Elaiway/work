var app = getApp()
Component({
  options: {
    addGlobalClass:true
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    content: {
      type: Object,
      value: {},
      observer(newVal, oldVal) {
        let that = this, content = this.properties.content;
        console.log(content)
          app.api.getStorelist({
            data: {
              page: 1 ,
              size: 10,
              isRecommend: 1,
              sort: content.businessType==0?"new":"",
            },
            success: res => {
              console.log('列表信息', res)
              that.setData({
                storelist:res.data.data
              })
            }
          })
      }
      
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
      storeinfo(e){
        // console.log(e.currentTarget.dataset.id)
        app.util.goUrl({ param: e.currentTarget.dataset.id, value:"businessInfo"})
      }
  }
})