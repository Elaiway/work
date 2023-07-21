// pages/job-hunt/index.js
const app = getApp();
Page({
  data: {
    notice: {
      "infoList": ["浏览", "发布", "分享"],
    },
    tabs: [{
      name: "最新",
      id: 0,
    }, {
      name: "最热",
      id: 1,
    }, ],
    postList: [],
    mygd: false,
    isget: false,
    key: '0',
    current:'0',
    types:1,
    params: {
      page: 1,
      size: 10,
      // keywords: '',
      // typeId: '',
      order:1,
      type: '',
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.api.housingdeal(res => {
      app.setNavigationBarTitle(res.field)
      that.setData({
        housRenting: res,
      })
    })
    app.setNavigationBarColor(this, () => {
      app.isLocation(function() {
        app.util.getLocation({
          type: "0",
          success: res => {
            console.log(res)
          }
        })
        that.indexAdlist()
        that.getPostnav()
        that.announceList()
        // that.postList()
        // that.hotimg()
      })
    });
  },
  // hotimg(e){
  //   let that = this
  //   app.api.prequest({
  //     url: app.url.housHot,
  //   }).then(res =>{
  //     console.log(res.data)
  //     let hotimg = res.data
  //     that.setData({
  //       hotimg,
  //     })
  //   })
  // },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail

    this.setData({
      key,
      postList: [],
      "params.order":key+1,
      "params.page": 1,
      mygd: false,
      isget: false,
    })
    this.postList()
    console.log(key)
  },
  // 获取信息首页广告位
  indexAdlist(e) {
    let that = this
    app.api.prequest({
      url: app.url.adList,
      data: {
        type: 10,
        adType: 1,
      },
    }).then(res => {
      //console.log('首页轮播图为', res)
      let imgs = res.data
      if (imgs.length > 0) {
        imgs.forEach(item => {
          item.type = 0
          item.url = that.data.url + item.url
        })
        that.setData({
          Swiper: {
            "padding": 0,
            "height": app.system.slideNum,
            "maxLimit": 300,
            "minLimit": 100,
            "swiper": {
              "children": imgs
            }
          }
        })
      }
    })
    app.api.prequest({
      url: app.url.adList,
      data: {
        type: 10,
        adType: 2,
      },
    }).then(res => {
      //console.log('中部轮播图为', res)
      let imgs = res.data
      if (imgs.length > 0) {
        imgs.forEach(item => {
          item.type = 0
          item.url = that.data.url + item.url
        })
        that.setData({
          Swiper2: {
            "padding": 0,
            "height": 140,
            "maxLimit": 300,
            "minLimit": 100,
            "swiper": {
              "children": imgs
            }
          }
        })
      }
    })
  },
  //获取分类信息
  getPostnav(e) {
    let that = this;
    app.api.prequest({
      "url": app.url.housCategory
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].icon = app.util.getImgUrl(res.data[i].icon)
      }
      let housCategory = res.data
      let type =''
      if (res.data[0]) {
        if (res.data[0].identifying == '6') {
          type = '6'
        } else if (res.data[0].identifying == '5') {
          type = '5'
        } else if (res.data[0].identifying == '4') {
          type = '4'
        } else if (res.data[0].identifying == '3') {
          type = '3'
        }
      }
      that.setData({
        housCategory,
       'params.type':type,
      })
      that.postList()
      console.log(res.data)
    })
  },
  //点击分类列表
  clicklist(e){
    let that=this,
    identifying = e.currentTarget.dataset.identifying,
    index = e.currentTarget.dataset.index
    if (identifying=='6'){
      that.setData({
        types:1,
        "params.type": 6,
      })
    }
    if (identifying == '5'){
      that.setData({
        types: 1,
        "params.type": 5,
      })
    }
    if (identifying == '4') {
      that.setData({
        types: 2,
        "params.type": 4,
      })
    }
    if (identifying == '3') {
      that.setData({
        types: 1,
        "params.type": 3,
      })
    }
    that.setData({
      postList: [],
      'params.page': 1,
      mygd: false,
      isget: false,
      current:index,
    })
    that.postList()
    console.log(e.currentTarget, e.detail,index)
  },
  // 获取首页公告
  announceList(e) {
    let that = this
    that.setData({
      Headline: {
        notice: {
          color: '#666'
        },
        leftvalue: "租售头条",
        bordercolor: "#f9f9f9",
        color: that.data.color,
      },
    })
  },
  postList(e){
    let that = this, params = this.data.params;
    app.api.prequest({
      "url": app.url.housRentingList,
      data: params,
    }).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        // res.data[i].createdAt = app.util.ormatDate(res.data[i].createdAt).substring(5, 10)
        res.data[i].createdAt = app.util.settime(res.data[i].createdAt)
        res.data[i].imgs = app.util.getSingleImgUrl(res.data[i].imgs)
        if (res.data[i].apartment != null) {
          res.data[i].apartment = res.data[i].apartment.substring(0, 2).replace(/\-/g, '室') + res.data[i].apartment.substring(2).replace(/\-/g, '厅')
        }
        let str = res.data[i].rent.split(','),a = /[0-9]/, b = /['万']/,c=/['元/平']/,d=/['元/月']/;
        //二手房出售
        if (res.data[i].identifying=='6'){
          if (a.test(str)) {
            if (!b.test(str)) {
              str.push('万')
              res.data[i].rent = str
              if(res.data[i].rent[0]=='0'){
                res.data[i].rent = '面议'
              }else{
                res.data[i].rent = res.data[i].rent.join('')
              }
            }
            console.log('包含此字符串', str)
          }
        }
        //新房出售
        else if (res.data[i].identifying == '5'){
          if (a.test(str)) {
            if (!c.test(str)) {
              str.push('元/平')
              res.data[i].rent = str
              if(res.data[i].rent[0]=='0'){
                res.data[i].rent = '面议'
              }else{
                res.data[i].rent = res.data[i].rent.join('')
              }
            }
          }
        }
        //房屋出租
        else if (res.data[i].identifying == '3') {
          if (a.test(str)) {
            if (!d.test(str)) {
              str.push('元/月')
              res.data[i].rent = str
              res.data[i].rent = res.data[i].rent.join('')
            }
          }
        }
      }
      if (res.data.length < 10) {
        that.setData({
          mygd: true,
        })
      } else {
        that.setData({
          'params.page': that.data.params.page + 1,
        })
      }
      let postList = that.data.postList
      postList = postList.concat(res.data)
      console.log(postList,333)
      for(var i=0;i<postList.length;i++){
        if(postList[i].area.length>7){
          postList[i].area =postList[i].area.substring(0,7) + "..."
        }
        
      }
      that.setData({
        postList,
        isget: true,
      })
      console.log(res.data)
    })
  },
  onShow: function() {

  },
  onHide: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function () {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      this.postList()
    }
  },
  onShareAppMessage: function() {

  }
})