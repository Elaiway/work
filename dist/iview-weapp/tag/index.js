Component({
  externalClasses: ['i-class'],
  properties: {
    //slot name
    name: {
      type: String,
      value: ''
    },
    //can click or not click
    checkable: {
      type: Boolean,
      value: false
    },
    //is current choose
    checked: {
      type: Boolean,
      value: true
    },
    //background and color setting
    color: {
      type: String,
      value: '#999'
    },
    //control fill or not
    borderColor: {
      type: String,
      value: '#999'
    },
    bgColor: {
      type: String,
      value: '#fff'
    },
    tagname: {
      type: String,
      value: ''
    },
    fontSize: {
      type: String,
      value: ''
    },
  },
  methods: {
    tapTag() {
      const data = this.data;
      if (data.checkable) {
        const checked = data.checked ? false : true;
        this.triggerEvent('change', {
          name: data.name || '',
          checked: checked
        });
      }
    }
  }
})