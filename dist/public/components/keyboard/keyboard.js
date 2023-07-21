// dist/public/components/keyboard/keyboard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    code: { 
      type: Number,
      value: 0,
      observer(newval){
        console.log(newval, newval.toString())
        let codearr = newval.toString().split('')
        console.log(codearr)
        let arr = []
        for (let i = 0; i < codearr.length; i++) {
        let e = {}
          e.num = codearr[i]
          arr.push(e)
      }
        this.setData({
          numarr: arr,
          inp:false,
        })
        
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    inp:true,
    password: '',
    isFocus: false,
    inputPwd: true,
    inputNum: 0,
    passwordFirst: '',
    passwordTwo: '',
    numarr: [{ num: '' }, { num: '' }, { num: '' }, { num: '' }, { num: '' }, { num: '' }, { num: '' }, { num: '' }],
    acitveIndex:-1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    pwd(e) {
      console.log(e.detail.value, e.detail.value.split(''))
      let reg = /[^\d]/g, mobile = e.detail.value.replace(reg, ''), val = e.detail.value.split(''), myEventDetail = { val: val }, index = e.detail.value.length-1;
      if (index < 7  && this.data.numarr[index+1].num){
        this.setData({
          [`numarr[${index+1}].num`]:'',
          acitveIndex: index,
        })
      }
      this.setData({
        password: mobile,
        [`numarr[${index}].num`]: val[index],
        acitveIndex: index,
      })
      if (e.detail.value.length>=8){
        this.triggerEvent('myevent', myEventDetail)
      }
      
      return mobile
    },
    getFocus(e) {
      console.log(this.data.code)
      this.setData({
        isFocus: true
      })
    },

  }
})
