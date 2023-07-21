// dist/public/components/form/dd-time-picker.js
var dateTimePicker = require('../../../../utils/dateTimePicker.js');
Component({
  behaviors: ['wx://form-field'],
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: '',
      observer(newVal, oldVal) {
        if(!newVal) return
        this.setData({
          selectTime1:newVal
        })
        console.log(newVal)
      }
    },
    arrow:{
      type: String,
      value: '',
    },
    styleName:{
      type: String,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      // 获取完整的年月日 时分秒，以及默认显示的数组
      var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
      var obj1 = dateTimePicker.dateTimePicker((new Date()).getFullYear(), this.data.endYear);
      // 精确到分的处理，将数组的秒去掉
      var lastArray = obj1.dateTimeArray.pop();
      var lastTime = obj1.dateTime.pop();

      this.setData({
        dateTime: obj.dateTime,
        dateTimeArray: obj.dateTimeArray,
        dateTimeArray1: obj1.dateTimeArray,
        dateTime1: obj1.dateTime,
        selectTime1: `${obj1.dateTimeArray[0][obj1.dateTime[0]]}-${obj1.dateTimeArray[1][obj1.dateTime[1]]}-${obj1.dateTimeArray[2][obj1.dateTime[2]]} ${obj1.dateTimeArray[3][obj1.dateTime[3]]}:${obj1.dateTimeArray[4][obj1.dateTime[4]]}`
      });
      this.triggerEvent('change', this.data.selectTime1)
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    changeDateTime(e) {
      this.setData({
        dateTime: e.detail.value
      });
    },
    changeDateTime1(e) {
      let dateTimeArray1 = this.data.dateTimeArray1,
        dateTime1 = e.detail.value
      this.setData({
        dateTime1: e.detail.value,
        selectTime1: `${dateTimeArray1[0][dateTime1[0]] }-${ dateTimeArray1[1][dateTime1[1]] }-${ dateTimeArray1[2][dateTime1[2]] } ${ dateTimeArray1[3][dateTime1[3]] }:${ dateTimeArray1[4][dateTime1[4]] }`
      });
      this.triggerEvent('change', this.data.selectTime1)
      console.log(e.detail.value, this.data.selectTime1)
    },
    changeDateTimeColumn(e) {
      var arr = this.data.dateTime,
        dateArr = this.data.dateTimeArray;

      arr[e.detail.column] = e.detail.value;
      dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

      this.setData({
        dateTimeArray: dateArr,
        dateTime: arr
      });
    },
    changeDateTimeColumn1(e) {
      var arr = this.data.dateTime1,
        dateArr = this.data.dateTimeArray1;

      arr[e.detail.column] = e.detail.value;
      dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

      this.setData({
        dateTimeArray1: dateArr,
        dateTime1: arr
      });
    }
  }
})