// dist/public/textarea.js
var app=getApp();
Component({
  externalClasses: ['extra-class'],
  options: {
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
  },
  data: {
  },
  methods: {
    formSubmit: function (e) {
      console.log('form发生了submit事件，携带数据为：', e.detail.formId)
      // app.util.getShowtoast('取到formId')
      app.api.formId(e.detail.formId)
    },
  }
})
