// dist/public/components/form/dd-radio.js
const app=getApp()
Component({
  behaviors: ['wx://form-field'],
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:''
    },
    popupshow: {
      type: Boolean,
      value: false
    },
    checkboxarr:{
      type:Array,
      value: [],
      observer(newVal, oldVal) {
        console.log(newVal)
      },
    },
    defaultarr:{
      type: String,
      value:'',
      observer(newVal, oldVal) {
        let checkboxarr = this.data.checkboxarr
        for (let i in checkboxarr) {
          if (newVal.indexOf(checkboxarr[i].id) > -1) {
            checkboxarr[i].checked=true
          }
        }
        this.setData({
          checkboxarr,
        })
        console.log(newVal)
      },
    },
    color: {
      type: String,
      value: ''
    },
  },
  lifetimes: {
    attached: function () {
      this.setData({
        color: app.globalData.color
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkboxChange: function (e) {
      console.log('checkbox发生change事件，携带value值为：', e.detail.value);

      var checkboxarr = this.data.checkboxarr, values = e.detail.value;
      for (var i = 0, lenI = checkboxarr.length; i < lenI; ++i) {
        checkboxarr[i].checked = false;

        for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (checkboxarr[i].id == values[j]) {
            checkboxarr[i].checked = true;
            break;
          }
        }
      }

      this.setData({
        checkboxarr: checkboxarr
      });
    },
    confirm(){
      let checkboxarr = this.data.checkboxarr,arr=[];
      checkboxarr.forEach(item=>{
        if(item.checked){
          arr.push(item)
        }
      })
      console.log(arr)
      this.triggerEvent('change', arr);
      this.setData({
        popupshow: !this.data.popupshow,
      })
    },
    //关闭弹窗
    togglePopup() {
      this.setData({
        popupshow: !this.data.popupshow,
      })
    },
  }
})
