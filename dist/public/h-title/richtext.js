// dist/public/textarea.js
var app=getApp();
Component({
  externalClasses: ['extra-class'],
  options: {
  },
  properties: {
    content: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        let str = this.properties.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
        // console.log(str)
        this.setData({
          nodes: str,
        })
      }
    },
    styleName:{
      type: String,
      value: '',
    },
  },
  data: {
  },
  methods: {
  }
})
