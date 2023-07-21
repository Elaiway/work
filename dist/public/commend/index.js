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
        comment_list: {
            type: Number,
            value: 500000000000
        },
        comment_close: {
            type: String,
            value: ""
        },
        commentList: {
            type: String,
            value: "1"
        },
        color: { // 数组
            type: String,
            value: ""
        },
    },

    /**
     * 私有数据,组件的初始数据
     * 可用于模版渲染
     */
    data: {
        publish_commend: true,
        publish_text: "",
        allcomments: true
    },

    /**
     * 组件的方法列表
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
    methods: {
        publish(e) {
            let type = 2,
                name = e.currentTarget.dataset.name,
                id = e.currentTarget.dataset.id,
                user_id = e.currentTarget.dataset.userid,
                reply = {
                    type,
                    id: id,
                    name,
                    user_id
                }
            this.triggerEvent("openpl", reply)
        },
        // 输入评论的文字
        // publish_text(e){
        //   console.log(e)
        //   this.setData({
        //     publish_text:e.detail.value
        //   })
        // },
        // 打开全部回复
        open_reply(e) {
            console.log(e)
            this.triggerEvent("comment", e.currentTarget.dataset.id)
        },
        // 点击空白区域隐藏弹框
        // publish(e){
        //   // this.triggerEvent('increment') 
        //   this.setData({
        //     publish_commend: !this.data.publish_commend
        //   })
        // },
        // 弹框取消
        // cancel(e){
        //   this.setData({
        //     publish_commend: !this.data.publish_commend
        //   })
        // },
        // 弹框确定
        // confim(e) {
        //   let publish_text = this.data.publish_text
        //   console.log(publish_text)
        //   if (publish_text==''){
        //     app.getShowmodel("您还没有输入内容哦")
        //   } else {
        //     this.setData({
        //       publish_commend: !this.data.publish_commend
        //     })
        //   }
        // },
        card_info(e) {
            let src = e.currentTarget.dataset.src
            this.triggerEvent("comment_info", src)
            // wx.navigateTo({
            //   url: src,
            // })

        },
    }
})