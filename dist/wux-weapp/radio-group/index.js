Component({
    externalClasses: ['wux-class'],
    behaviors: ['wx://form-field'],
    // relations: {
    //     '../radio/index': {
    //         type: 'child',
    //         linked() {
    //             this.changeValue()
    //         },
    //         linkChanged() {
    //             this.changeValue()
    //         },
    //         unlinked() {
    //             this.changeValue()
    //         },
    //     },
    // },
    properties: {
      radioColor: {
        type: String,
        value: '#FF0000',
      },
      radioarr:{
        type:Array,
        value:[],
      },
      typesetting:{
        type: String,
        value: '1',
      }
    },
    methods: {
        // changeValue(value = this.data.value) {
        //     const elements = this.getRelationNodes('../radio/index')
        //     if (elements.length > 0) {
        //         elements.forEach((element, index) => {
        //             element.changeValue(value === element.data.value, index)
        //         })
        //     }
        // },
        // emitEvent(value) {
        //     this.triggerEvent('change', value)
        // },
      radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);
        var radioarr = this.data.radioarr,xzitem;
        for (var i = 0, len = radioarr.length; i < len; ++i) {
          radioarr[i].checked = radioarr[i].value == e.detail.value;
          if (radioarr[i].checked){
            xzitem = radioarr[i]
          }
        }
        this.setData({
          radioarr: radioarr
        });
        this.triggerEvent('change', xzitem)
      },
    },
})