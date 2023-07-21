Component({
  options: {
    addGlobalClass: true
  },
  externalClasses: ['wux-class'],
  properties: {
    current: {
      type: String,
      value: '0',
      observer: function (newVal, oldVal) {
        this.setData({
          toType: 'type' + (+newVal - 2),
        })
      }
    },
    scroll: {
      type: Boolean,
      value: false,
    },
    color: {
      type: String,
      value: '#FF0000',
    },
    tabs: {
      type: Array,
      value: [],
    },
    type: {
      type: String,
      value: '',
    },
  },
  data: {},
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    onTap(e) {
      console.log(e)
      const key = e.currentTarget.dataset.id, index = e.currentTarget.dataset.index
      this.setData({
        current: key,
        toType: 'type' + (index - 2),
      })
      this.triggerEvent('change', {
        key,
        keys: this.data.tabs,
      })
    }
  },
})