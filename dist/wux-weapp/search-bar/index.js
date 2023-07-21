Component({
  externalClasses: ['wux-class'],
  properties: {
    defaultValue: {
      type: String,
      value: '',
    },
    value: {
      type: String,
      value: '',
      observer(newVal) {
        if (!this.data.auto) {
          this.updated(newVal)
        }
      },
    },
    placeholder: {
      type: String,
      value: '搜索',
    },
    className: {
      type: String,
      value: '',
    },
    styleName: {
      type: String,
      value: '',
    },
    maxlength: {
      type: Number,
      value: 140,
    },
    color: {
      type: String,
      value: '',
    },
    focus: {
      type: Boolean,
      value: false,
      observer(newVal) {
        this.setData({
          inputFocus: newVal,
        })
      },
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    cancelText: {
      type: String,
      value: '取消',
    },
    showCancel: {
      type: Boolean,
      value: false,
    },
    auto: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    inputValue: '',
    text: '',
    inputFocus: false,
  },
  methods: {
    updated(inputValue) {
      if (this.data.inputValue !== inputValue) {
        this.setData({
          inputValue,
        })
      }
    },
    onChange(e) {
      console.log(this.data.inputFocus)
      if (this.data.auto) {
        this.updated(e.detail.value)
      }

      if (!this.data.inputFocus) {
        this.setData({
          inputFocus: true,
        })
      }

      // this.triggerEvent('change', e.detail)
    },
    onSure(e) {
      this.triggerEvent('change', this.data.inputValue)
    },
    onFocus(e) {
      this.setData({
        inputFocus: true,
      })

      this.triggerEvent('focus', e.detail)
    },
    onBlur(e) {
      console.log(e)
      this.setData({
        inputFocus: false,
        text: e.detail.value
      })

      this.triggerEvent('blur', e.detail)
    },
    onConfirm(e) {
      this.triggerEvent('change', this.data.inputValue)
    },
    onClear() {
      const {
        auto,
        inputValue
      } = this.data

      this.setData({
        inputValue: !auto ? inputValue : '',
        inputFocus: true,
      })

      this.triggerEvent('clear', {
        value: ''
      })
    },
    onCancel() {
      this.triggerEvent('cancel', {
        value: this.data.inputValue
      })
    },
    onClick() {
      this.setData({
        inputFocus: true,
      })
    },
  },
  attached() {
    const {
      defaultValue,
      value,
      auto
    } = this.data
    const inputValue = !auto ? value : defaultValue

    this.updated(inputValue)
  },
})