Component({
    externalClasses: ['wux-class'],
    options: {
        multipleSlots: true,
    },
    // relations: {
    //     '../cell-group/index': {
    //         type: 'parent',
    //     },
    // },
    data: {
        // isLast: false,
    },
    properties: {
        hoverClass: {
            type: String,
            value: 'wux-cell--hover',
        },
        noCenter: {
            type: Boolean,
            value: false,
        },
        thumb: {
            type: String,
            value: '',
        },
        title: {
            type: String,
            value: '',
        },
        label: {
            type: String,
            value: '',
        },
        extra: {
            type: String,
            value: '',
        },
        isLink: {
            type: Boolean,
            value: false,
        },
      isLast: {
        type: Boolean,
        value: false,
      },
      isLeft: {
        type: Boolean,
        value: false,
      },
        openType: {
            type: String,
            value: 'navigateTo',
        },
        url: {
            type: String,
            value: '',
        },
        delta: {
            type: Number,
            value: 1,
        },
        background: {
          type: String,
            value: '#fff',
        },
      padding: {
        type: String,
        value: '20rpx 30rpx',
      },
      imgw: {
        type: String,
        value: '',
      },
      imgh: {
        type: String,
        value: '',
      },
      boradius: {
        type: String,
        value: '',
      },
      mode: {
        type: String,
        value: 'aspectFit',
      },
      tftsize:{
        type: String,
        value: '28',
      },
      lftsize:{
        type: String,
        value: '28',
      },
      ftcolor: {
        type: String,
        value: '',
      },
      tstyle:{
        type: String,
        value: '',
      },
      tclass:{
        type: String,
        value: '',
      },
    },
    methods: {
        onTap() {
            const { url, isLink, openType, delta } = this.data
            const navigate = [
                'navigateTo',
                'redirectTo',
                'switchTab',
                'navigateBack',
                'reLaunch',
            ]

            this.triggerEvent('click')

            if (!isLink || !url) {
                return false
            } else if (!navigate.includes(openType)) {
                return console.warn('openType 属性可选值为 navigateTo、redirectTo、switchTab、navigateBack、reLaunch', openType)
            } else if (openType === 'navigateBack') {
                return wx[openType].call(wx, { delta })
            } else {
                return wx[openType].call(wx, { url })
            }
        },
        // updateIsLastElement(isLast) {
        //     this.setData({ isLast })
        // },
    },
})