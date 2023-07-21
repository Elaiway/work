// dist/public/typeswiper/index.js
const app = getApp()
Component({
  externalClasses: ['extra-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    typeObj: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {
        let typeObj = this.properties.typeObj,
          colnum = Number(typeObj.buttonNumberOfCol),
          rownum = Number(typeObj.buttonNumberOfRow),
          height;
        var navs = [];
        if (typeObj.entryButtonList.length > 0) {
          for (var i = 0, len = typeObj.entryButtonList.length; i < len; i += colnum * rownum) {
            navs.push(typeObj.entryButtonList.slice(i, i + colnum * rownum));
          }
          // console.log(navs)
          // return
          if (rownum == 2 && navs[0].length > colnum) {
            height = 370;
          } else {
            height = 185;
          }
        }
        typeObj.width = 100 / colnum
        typeObj.entryButtonList = navs
        typeObj.height = height
        this.setData({
          typeObj: Object.assign(typeObj, {
            autoplay: true,
            circular: true,
            interval: '5000'
          })
        })
      }
    },
    styleName: {
      type: String,
      value: '',
    },
    color: {
      type: String,
      value: '#f44444',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function() {
      this.data.paramA // 页面参数 paramA 的值
      this.data.paramB // 页面参数 paramB 的值
    },
    jumps: function(e) {
      if (this.data.typeObj.noTab) return
      let entry = e.currentTarget.dataset.entry,
        item = e.currentTarget.dataset.item
      //console.log(entry, item)
      if (!this.data.typeObj.active) {
        app.util.goUrl(entry)
      } else {
        this.setData({
          activeIndex: item.id
        })
        this.triggerEvent('change', item)
      }
    },
    _propertyChange: function(newVal, oldVal) {
      console.log(newVal, oldVal)
    }
  },
  attached: function() {
    // let typeObj = this.properties.typeObj,
    //   colnum = Number(typeObj.buttonNumberOfCol),
    //   rownum = Number(typeObj.buttonNumberOfRow),
    //   height;
    // var navs = [];
    // if (typeObj.entryButtonList.length > 0) {
    //   for (var i = 0, len = typeObj.entryButtonList.length; i < len; i += colnum * rownum) {
    //     navs.push(typeObj.entryButtonList.slice(i, i + colnum * rownum));
    //   }
    //   console.log(navs)
    //   // return
    //   if (rownum == 2) {
    //     height = 350;
    //   } else {
    //     height = 175;
    //   }
    // }
    // typeObj.width = 100 / colnum
    // typeObj.entryButtonList = navs
    // typeObj.height = height
    // this.setData({
    //   typeObj: Object.assign(typeObj,{
    //     autoplay: true,
    //     circular: true,
    //     interval: '5000'
    //   })
    // })
    // console.log(typeObj)
  },
})