var app = getApp();
Component({
  options: {
    // addGlobalClass: true
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    content: { // 属性名
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {}, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal) {
        var content = this.data.content
        console.log(content)
        if (content.searchBoxList&&content.searchBoxList.length){
        let leftIcon = app.util.where(content.searchBoxList, {
            typesetting: 0
          }),
          rightIcon = app.util.where(content.searchBoxList, {
            typesetting: 1
          });
        this.setData({
          leftIcon: leftIcon,
          rightIcon: rightIcon,
        })
        app.util.getmyAmapFun({
            success: res => {
              console.log(res)
                let weather = res.liveData.weather,
                    temperature = res.liveData.temperature
                //     city = res.liveData.city,
                //     windpower = res.windpower.data,
                //     winddirection = res.winddirection.data
                this.setData({
                        name: temperature + '°C',
                        // city: city,
                        // color: this.data.color,
                        week: app.util.getWeek(),
                        // time: app.util.today(),
                        // windpower: windpower,
                        // winddirection: winddirection,
                        type: weather, // 晴  小雨  大雨  中雨  阵雨  暴雨  雷阵雨  少云  雾  霾  多云 阴
                })
            }
        })
        console.log(leftIcon, rightIcon);
        }
      },
    },
    scrollBack: {
      type: Boolean,
      value: true
    },
    color: {
      type: String,
      value: ''
    },
    searchtype: {
      type: String,
      value: ''
    },
    text: {
      type: String,
      value: ''
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow: false
  },
  attached: function() {},
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */

    location(e) {
      app.util.goUrl({
        value: 'location',
        param: this.properties.text
      })
    },
    link(e) {
      console.log(e.currentTarget.dataset.link)
      app.util.goUrl(e.currentTarget.dataset.link)
    },
    search(e) {
      console.log('点击跳转搜索', this.properties.searchtype)
      wx.navigateTo({
        url: '/pages/search/index?type=' + this.properties.searchtype,
      })
    },
    showmore(){
      this.setData({
        show:!this.data.show
      })
    },
  }
})