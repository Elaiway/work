var app = getApp()
Component({
  externalClasses: ['extra-class'],
  options: {
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    datatype: { //数据类型
      type: String, 
      value: '1'
    },
    content: { // 数组
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {}, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) {
        var that = this, content = this.properties.content, datatype = this.properties.datatype;
        console.log(datatype)
        if (datatype=='1'){
        app.api.request({
          url: app.url.statistic,
          success: res => {
            console.log(res)
            var data = res.data.data
            var browse = data.browse,
              post = data.post,
              enter = data.enter
            if (browse > 10000) {
              browse = (browse / 10000).toFixed(2) + '万'
            }
            if (post > 10000) {
              post = (post / 10000).toFixed(2) + '万'
            }
            if (enter > 10000) {
              enter = (enter / 10000).toFixed(2) + '万'
            }
            console.log(browse, post, enter, content)
            content.infoList.forEach((item, index, input) => {
              if (item == '浏览') {
                input[index] = { name: item, value: browse || 0 }
              }
              if (item == '发布') {
                input[index] = { name: item, value: post || 0 }
              }
              if (item == '商家') {
                input[index] = { name: item, value: enter || 0 }
              }
            })
            that.setData({
              content: content,
            })
          }
        })
        }
        if (datatype == '2') {
          app.api.request({
            url: app.url.postStatistic,
            success: res => {
              console.log(res)
              var data = res.data.data
              var browse = data.browse,
                post = data.post,
                share = data.share,
                enter = data.enter
              if (browse > 10000) {
                browse = (browse / 10000).toFixed(2) + '万'
              }
              if (post > 10000) {
                post = (post / 10000).toFixed(2) + '万'
              }
              if (share > 10000) {
                share = (share / 10000).toFixed(2) + '万'
              }
              if (enter > 10000) {
                enter = (enter / 10000).toFixed(2) + '万'
              }
              console.log(browse, post, share, enter, content)
              content.infoList.forEach((item, index, input) => {
                if (item == '浏览') {
                  input[index] = { name: item, value: browse || 0 }
                }
                if (item == '商家') {
                  input[index] = { name: item, value: enter || 0 }
                }
                if (item == '发布') {
                  input[index] = { name: item, value: post || 0 }
                }
                if (item == '分享') {
                  input[index] = { name: item, value: share || 0 }
                }
              })
              that.setData({
                content: content,
              })
            }
          })
        }
        if (datatype == '3') {
          app.api.request({
            url: app.url.storeStatistic,
            success: res => {
              console.log(res)
              var data = res.data.data
              var browse = data.browse,
                store = data.store,
                share = data.share
              if (browse > 10000) {
                browse = (browse / 10000).toFixed(2) + '万'
              }
              if (store > 10000) {
                store = (store / 10000).toFixed(2) + '万'
              }
              if (share > 10000) {
                share = (share / 10000).toFixed(2) + '万'
              }
              console.log(browse, store, share, content)
              content.infoList.forEach((item, index, input) => {
                if (item == '浏览') {
                  input[index] = { name: item, value: browse || 0 }
                }
                if (item == '入驻') {
                  input[index] = { name: item, value: store || 0 }
                }
                if (item == '分享') {
                  input[index] = { name: item, value: share || 0 }
                }
              })
              that.setData({
                content: content,
              })
            }
          })
        }
        if (datatype == '4') {
          app.api.request({
            url: app.url.yellowStic,
            success: res => {
              console.log(res)
              var data = res.data.data
              var browse = data.viewNum,
                store = data.joinNum,
                share = data.shareNum
              if (browse > 10000) {
                browse = (browse / 10000).toFixed(2) + '万'
              }
              if (store > 10000) {
                store = (store / 10000).toFixed(2) + '万'
              }
              if (share > 10000) {
                share = (share / 10000).toFixed(2) + '万'
              }
              console.log(browse, store, share, content)
              content.infoList.forEach((item, index, input) => {
                if (item == '浏览') {
                  input[index] = { name: item, value: browse || 0 }
                }
                if (item == '入驻') {
                  input[index] = { name: item, value: store || 0 }
                }
                if (item == '分享') {
                  input[index] = { name: item, value: share || 0 }
                }
              })
              that.setData({
                content: content,
              })
            }
          })
        }
        if (datatype == '5') {
          app.api.request({
            url: app.url.freeStatistics,
            success: res => {
              console.log(res)
              var data = res.data.data
              var browse = data.viewNum,
                post = data.joinNum,
                share = data.shareNum
              if (browse > 10000) {
                browse = (browse / 10000).toFixed(2) + '万'
              }
              if (post > 10000) {
                post = (post / 10000).toFixed(2) + '万'
              }
              if (share > 10000) {
                share = (share / 10000).toFixed(2) + '万'
              }
              console.log(browse, post, share, content)
              content.infoList.forEach((item, index, input) => {
                if (item == '浏览') {
                  input[index] = { name: item, value: browse || 0 }
                }
                if (item == '发布') {
                  input[index] = { name: item, value: post || 0 }
                }
                if (item == '分享') {
                  input[index] = { name: item, value: share || 0 }
                }
              })
              that.setData({
                content: content,
              })
            }
          })
        }
        if (datatype == '6') {
          app.api.request({
            url: app.url.jobStatistic,
            success: res => {
              console.log(res)
              var data = res.data.data
              var browse = data.browse,
                post = data.post
                // share = data.shareNum
              if (browse > 10000) {
                browse = (browse / 10000).toFixed(2) + '万'
              }
              if (post > 10000) {
                post = (post / 10000).toFixed(2) + '万'
              }
              // if (share > 10000) {
              //   share = (share / 10000).toFixed(2) + '万'
              // }
              console.log(browse, post, content, res.data.data)
              content.infoList.forEach((item, index, input) => {
                if (item == '浏览') {
                  input[index] = { name: item, value: browse || 0 }
                }
                if (item == '发布') {
                  input[index] = { name: item, value: post || 0 }
                }
                // if (item == '分享') {
                //   input[index] = { name: item, value: share || 0 }
                // }
              })
              that.setData({
                content: content,
              })
            }
          })
        }
        if (datatype == '7') {
          app.api.request({
            url: app.url.housStatistics,
            success: res => {
              console.log(res)
              var data = res.data.data
              var browse = data.viewNum,
                post = data.joinNum,
                share = data.shareNum
              if (browse > 10000) {
                browse = (browse / 10000).toFixed(2) + '万'
              }
              if (post > 10000) {
                post = (post / 10000).toFixed(2) + '万'
              }
              if (share > 10000) {
                share = (share / 10000).toFixed(2) + '万'
              }
              console.log(browse, post, share, content)
              content.infoList.forEach((item, index, input) => {
                if (item == '浏览') {
                  input[index] = { name: item, value: browse || 0 }
                }
                if (item == '发布') {
                  input[index] = { name: item, value: post || 0 }
                }
                if (item == '分享') {
                  input[index] = { name: item, value: share || 0 }
                }
              })
              that.setData({
                content: content,
              })
            }
          })
        }
      },
    },
    color: { // 颜色
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setData({
        imgsrc: app.setInfo.siteroot,
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    help(e) {
      //触发取消回调
      app.util.goUrl({ value: 'help', param: '' })
    },
    // jump(e) {
    //   let link = this.data.content.link
    //   console.log(link)
    //   app.util.goUrl(link)
    // }
  }
})