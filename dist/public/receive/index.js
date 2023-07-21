Component({
    options: {
        addGlobalClass: true
    },
    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    properties: {
        // 弹窗标题
        content: { // 属性名
            type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: {} // 属性初始值（可选），如果未指定则会根据类型选择一个
        },
        receiveShow:{
            type: Boolean,
            value:true
        },
        imgsrc:{
            type: String,
            value: ''
        }
    },

    /**
     * 私有数据,组件的初始数据
     * 可用于模版渲染
     */
    data: {
        
    },
    attached: function () {

    },
    /**
     * 组件的方法列表
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
    methods: {
        closeReceive(e){
            this.triggerEvent("click")
        },
        lookMore(e){
            this.triggerEvent("lookMore")
        },
        receiveEnvelopes(e){
            this.triggerEvent("receive")
        }
    }
})