const app = getApp()
Component({
  externalClasses: ['extra-class'],
  options: {},
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    datatype: { //数据类型
      type: String,
      value: ''
    },
    pagetype: {
      type: String,
      value: ''
    },
    content: { // 左边内容
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {}, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal) {
        var that = this,
          content = this.properties.content,
          datatype = this.properties.datatype.split(',');
        //console.log(content,datatype)
        if (this.properties.datatype) {
          app.api.request({
            url: app.url.announceList,
            data: {
              type: datatype[0],
              adType: datatype[1],
            },
            success: res => {
              console.log('首页公告为', res)
              var announceList = res.data.data
              content.announceList = announceList
              that.setData({
                content: content,
              })
              //console.log(content)
            }
          })
          // } else if (this.data.pagetype) {
          //   app.api.request({
          //     url: app.url[this.data.pagetype],
          //     data: {},
          //     success: res => {
          //       console.log('首页公告为', res)
          //       var announceList = res.data.data
          //       content.announceList = announceList
          //       that.setData({
          //         content: content,
          //       })
          //       //console.log(content)
          //     }
          //   })
        }
      }
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {

  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    button_jump({
      currentTarget
    }) {
      if (app.isLogin()) {
        console.log(currentTarget)
        let src = currentTarget.dataset.src
        wx.navigateTo({
          url: src,
        })
      }
    },
    postInfo(e) {
      let data = e.currentTarget.dataset
      if (data.id) {
        let url = ''
        switch (this.data.pagetype) {
          case 'post':
            url = '/pages/publish/post/infomation/index?id=' + data.id
            break;
          case 'business':
            url = '/pages/store/storemain/storedetail?id=' + data.id
            break;
          case 'yellow':
            url = '/pages/yellow/detail?id=' + data.id
            break;
          case 'news':
            url = '/pages/message/info/index?id=' + data.id
            break;
          case 'shop':
            url = '/pages/mall/detail?id=' + data.id
            break;
          case 'job':
            url = '/pages/jobhunt/detailhunt?rid=' + data.id
            break;
          case 'renting':
            url = '/pages/housingdeal/detail?id=' + data.id
            break;
          case 'car':
            url = '/pages/freeride/detail?tid=' + data.id
            break;
          case 'activity':
            url = '/pages/activity/detail?id=' + data.id
            break;
          case 'superCard':
            url = '/pages/businesscard/carddetail?id=' + data.id
            break;
        }
        wx.navigateTo({
          url,
        })
        console.log(this.data.pagetype)
      } else {
        wx.navigateTo({
          url: '/pages/extra/know?title=' + data.title + '&xyname=' + '公告详情' + '&info=' + data.info,
        })
      }
      console.log('头条跳转', e)
    },
  }
})