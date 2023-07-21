var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submenu_0: {
      name: '签到福利',
      right_value: "签到记录",
      is_wei: true,
      src: '/pages/sign/signrecord',
      img: ''
    },
    submenu_1: {
      name: '做任务赢积分',
      right_value: "立即前往",
      is_wei: true,
      // src: '/pages/personal/mypanic/mypanic?title=我的订单',
      src: '/pages/sign/task',
      img: ''
    },
    qdflarr: [{
      img: app.imgsrc + '/wechatimg/sign/sjf.png',
      name: '送积分'
    }, {
      img: app.imgsrc + '/wechatimg/sign/shb.png',
      name: '送福利'
    }, {
      img: app.imgsrc + '/wechatimg/sign/szk.png',
      name: '送折扣'
    }, {
      img: app.imgsrc + '/wechatimg/sign/syh.png',
      name: '送优惠'
    }, ],
    mdoaltoggle: false
  },

  // formSubmit: function(e) {
  //   console.log('form发生了submit事件，携带数据为：', e.detail.value)
  //   wx.navigateBack({

  //   })
  // },

  //点击到排行榜
  tzphb() {
    wx.navigateTo({
      url: 'signrank',
    })
  },
  //点击去积分
  goTasks(){
    console.log("dianji")
    wx.navigateTo({
      url: '/pages/sign/task',
    })
  },

  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('签到')
    app.setNavigationBarColor(this);
    // that.setData({
    //   Swiper: {
    //     config: {
    //       imgUrls: [{
    //         // url: app.imgsrc + '/wechatimg/sign/rwimg.png'
    //         url: "https://ddy.zhycms.cn/wechatimg/sign/rwimg.png"
    //       }],
    //       height: 200,
    //       indicatordots: false,
    //       activecolor: that.data.color,
    //       indicatorcolor: "#ccc",
    //       circular: true,
    //       autoplay: true,
    //       interval: 5000,
    //       duration: 1000
    //     }
    //   },
    // })
    that.setData({
      Swiper: {
        "padding": 0,
        "height": 120,
        "maxLimit": 300,
        "minLimit": 100,
        "swiper": {
          "children": [{
            url: "/assets/images/task/signimg.png"
          }]
        }
      }
    })

    app.api.prequest({
      url: app.url.weekSignRecord,
    }).then(res => {
      let arr = res.data,
        totalSignDay = 0,
        nowtime = app.util.formatTime(new Date()).substring(0, 10),
        index = arr.findIndex(item => item.time == nowtime)
      arr[index].istoday = true
      for (let i = 0; i < arr.length; i++) {
        if (i < index) {
          console.log("已签到", i, arr[i])
          if (arr[i].sign == 1) {
            arr[i].type = 1
            arr[i].btnName = "已签到"
          } else {
            arr[i].type = 2
            arr[i].btnName = "补签"
            console.log("补签", i, arr[i])
          }
        } else if (i == index) {
          if (arr[i].sign == 1) {
            arr[i].type = 1
            arr[i].btnName = "已签到"
          } else {
            arr[i].type = 3
            arr[i].btnName = "签到"
            console.log("签到", i, arr[i])
          }
        } else {
          arr[i].type = 4
          arr[i].btnName = "待签到"
          console.log("待签到", i, arr[i])
        }
        arr[i].name = '第' + (i + 1) + '天'
        //签到天数
        if (arr[i].sign == 1) {
          totalSignDay++
        }
        that.setData({
          totalSignDay,
        })
      }
      app.api.prequest({
        url: app.url.signRule,
        data: {},
      }).then(sres => {
        arr[0].integral = sres.data.monday
        arr[1].integral = sres.data.tuesday
        arr[2].integral = sres.data.wednesday
        arr[3].integral = sres.data.thursday
        arr[4].integral = sres.data.friday
        arr[5].integral = sres.data.saturday
        arr[6].integral = sres.data.sunday
        arr.forEach(row =>{
          if (row.time == nowtime){
            that.setData({
              monday: row.integral
            })
          }
        })
        that.setData({
          weeklist: arr,
          repairNum: sres.data.repairNum,
          // monday: sres.data.monday,
        })
        console.log(res, sres, arr, nowtime, index)

      })
    })
    //用户信息
    app.api.userinfo((info) => {
      console.log(info)
      that.setData({
        userinfo: info,
      })
    })

    var that = this,
      nowtime = app.util.formatTime(new Date())
    console.log(new Date(), new Date(1542432253), nowtime)
    var nowstmp = new Date().getTime();

    function getDates(currentTime) { //JS获取当前周从星期一到星期天的日期
      var currentDate = new Date(currentTime)
      var timesStamp = currentDate.getTime();
      var currenDay = currentDate.getDay();
      var dates = [];
      for (var i = 0; i < 7; i++) {
        dates.push(new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).toLocaleDateString().replace(/\//g, '-'));
      }
      for (let i in dates) {
        dates[i] = dates[i].split('-').map(app.util.formatNumber).join('-')
      }
      return dates
    }
    // var weekarr = getDates(1517288918000)
    var weekarr = getDates(nowstmp)
    console.log(nowstmp, weekarr)
    this.setData({
      weekarr: weekarr,
      nowtime: nowtime.substring(0, 10),
    })
    console.log(nowtime)
  },

  //完成后刷新
  completeRefresh() {
    if (getCurrentPages().length != 0) {
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
  },
  //点击签到
  onSign(e) {
    console.log(e.currentTarget)
    let that = this,
      type = e.currentTarget.dataset.type,
      userId = that.data.userinfo.id,
      day = e.currentTarget.dataset.id+1
    console.log(this.data, day)
    if (type == 3) {
      console.log(type)
      app.api.prequest({
        url: app.url.signIn,
        method: 'POST',
        data: {
          day,
          userId,
        },
      }).then(res => {
        this.setData({
          mdoaltoggle: true,
          acindex: '3',
        })
        this.completeRefresh()
      })
    } else if (type == 2) {
      console.log(type)
      app.api.prequest({
        url: app.url.repairIn,
        method: 'POST',
        data: {
          day,
          userId,
        },
      }).then(res => {
        this.setData({
          mdoaltoggle: true,
          acindex: '1',
        })
        this.completeRefresh()
      })
    } else {
      console.log(type)

    }
  },
  //提示框点击
  //确定/关闭
  mdoalclose: function() {
    this.setData({
      mdoaltoggle: false,
    })
  },
  mdoalopen: function() {
    this.setData({
      mdoaltoggle: true,
    })
  },
  bq(e) {
    this.setData({
      mdoaltoggle: true,
      acindex: '1',
    })
  },
  gm(e) {
    this.setData({
      mdoaltoggle: true,
      acindex: '2',
    })
  },
  //确认补签
  qrgm(e) {
    this.setData({
      mdoaltoggle: false,
    })
    setTimeout(() => {
      this.setData({
        mdoaltoggle: true,
        acindex: '3',
      })
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function() {
  //   app.api.prequest({
  //     'url': app.url.system,
  //     'cachetime': '0',
  //   }).then((res) => {
  //     console.log(res)
  //     return app.api.prequest({
  //       'url': app.url.store_config,
  //       'cachetime': '0',
  //       showLoading:true,
  //       data: { day: res.data.data.days}
  //     })
  //     }).then((res) => {
  //       console.log(res);
  //     }).catch((errMsg) => {
  //     console.log(errMsg);
  //   });
  // },


  /**获取当前年月日
   *        // let dates = new Date, year = dates.getFullYear(), month = dates.getMonth(), date = dates.getDate();// month=8表示9月,因为月份要加1
        // let dt = new Date(year, month, date);
        // let weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        // console.log("打印数值---", dt.getDay());
        // console.log("今天是:", weekDay[dt.getDay()])
        // console.log(that.data, date)
        // if (weekDay[dt.getDay()]){ }
   * 
   * 
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
})