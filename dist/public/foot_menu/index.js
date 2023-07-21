const app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    content: { // 数组
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {} // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    comment_close: {
      type: String,
      value: ""
    },
    width: {
      type: String,
      value: "40"
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {

  },
  attached: function() {
    var content = this.properties.content
    for (let i in content._left) {
      if (content._left[i].type == 1) {
        if (content._left[i].isCollection == 1) {
          content._left[i].img = content._left[i].sele_img
          content._left[i].name = '已收藏'
        } else {
          content._left[i].img = content._left[i].not_img
          content._left[i].name = '收藏'
        }
      }
    }
    this.setData({
      content: content
    })
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    onTap(e) {
      console.log('点击评论')
      if (app.isLogin()) {
        if (e.currentTarget.dataset.type == '0') {
          let type = 1
          this.triggerEvent("openpl", type)
        } else if (e.currentTarget.dataset.type == '1') {
          app.util.makePhoneCall(e.currentTarget.dataset.tel)
        }
      }
    },
    menu_route(e) {
      if (e.currentTarget.dataset.index == 0) {
        a.bind(this)()
      } else {
        if (app.isLogin()) {
          a.bind(this)()
        }
      }
      function a() {
        var content = this.properties.content,
          dataset = e.currentTarget.dataset,
          src = dataset.src,
          type = dataset.type,
          item = dataset.item,
          index = dataset.index
        console.log('点击', content._left[index].isCollection)
        if (type == 1) {
          if (content._left[index].isCollection == 2) {
            this.collection({
              postId: content.postId,
              success: res => {
                console.log(res)
                if (res.data.code == '1') {
                  console.log("点击收藏")
                  content._left[index].isCollection = 1
                  content._left[index].name = '已收藏'
                  content._left[index].img = content._left[index].sele_img
                  console.log("改变的值为", content)
                  this.setData({
                    content: content
                  })
                }
              }
            })
          } else {
            this.collection({
              postId: content.postId,
              success: res => {
                console.log(res)
                if (res.data.code == '1') {
                  console.log("取消收藏")
                  content._left[index].isCollection = 2
                  content._left[index].name = '收藏'
                  content._left[index].img = content._left[index].not_img
                  console.log("改变的值为", content)
                  this.setData({
                    content: content
                  })

                }
              }
            })
          }
        } else if (type == 0) {
          if (item.navigateType == '3') {
            wx.reLaunch({
              url: src,
            })
          } else {
            wx.navigateTo({
              url: src,
            })
          }
        }
      }

    },
    collection(option) {
      if (app.isLogin()) {
        var that = this
        app.api.request({
          url: app.url.collection_post,
          data: {
            userId: wx.getStorageSync('users').id,
            type: 1,
            postId: option.postId
          },
          method: "POST",
          success: res => {
            if (res.data.code == '1') {
              option.success(res)
            }
          }
        })
      }
    }
  }
})