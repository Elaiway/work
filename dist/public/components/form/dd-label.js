// dist/public/components/form/dd-label.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    labels: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        this.setData({
          labelArr: JSON.parse(JSON.stringify(newVal))
        })
        console.log(newVal)
      }
    },
    labelsDefault: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        for (let i in this.data.labelArr) {
          if (newVal.indexOf(this.data.labelArr[i].name) > -1) {
            this.click({
              currentTarget: {
                dataset: {
                  idx: i
                }
              }
            })
          }
        }
        console.log(newVal)
      },
    },
    color: {
      type: String,
      value: '',
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    labelArr: [] //组件渲染标签数组
  },

  /**
   * 组件的方法列表
   */
  methods: {
    click(e) {
      let labelArr = this.data.labelArr,
        idx = e.currentTarget.dataset.idx,
        arr = []
      this.setData({
        [`labelArr[${idx}].active`]: !labelArr[idx].active
      })
      for (let i in labelArr) {
        if (labelArr[i].active) {
          arr.push(labelArr[i])
        }
      }
      this.triggerEvent('change', arr);
      console.log(labelArr, idx, arr)
    },
  }
})