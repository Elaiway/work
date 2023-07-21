// dist/public/textarea.js
var app=getApp();
Component({
  externalClasses: ['extra-class'],
  options: {
  },
  properties: {
    content: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        // console.log(getApp().system)
        // this.setData({
        //   nodes: str,
        // })
      }
    },
    bottom:{
      type:String,
      value:'',
    }
  },
  data: {
  },
  attached: function () {
    // console.log(getApp().system)
    this.setData({
      system: getApp().system
    })
  },
  methods: {
  }
})
