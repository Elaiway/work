Component({
  externalClasses: ['wux-class'],
  options: {
    multipleSlots: true,
  },
  // relations: {
  //   '../grids/index': {
  //     type: 'parent',
  //   },
  // },
  properties: {
    thumb: {
      type: String,
      value: '',
    },
    label: {
      type: String,
      value: '',
    },
    gridId: {
      type: String,
      value: '',
    },
    index: {
      type: String,
      value: '',
    },
    width: {
      type: String,
      value: '25%',
    },
  },
  data: {
    bordered: true,
    square: true,
  },
  methods: {
    // changeCurrent(width, bordered, square, index) {
    //   this.setData({
    //     width,
    //     bordered,
    //     square,
    //     index,
    //   })
    // },
    onTap(e) {
      console.log(e)
      this.triggerEvent('click', this.data)
    },
  },
})