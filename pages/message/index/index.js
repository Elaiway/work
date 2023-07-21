//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
      Search: {
        "position": 0,
        "shape": 3,
        "height": 55,
        "borderStyle": 0,
        "fontStyle": "center",
        "recommendSearch": 1,
        "searchBoxList": [],
        "keyWords": "请输入您想要搜索的内容"
      },
        page: 1,
        mygd: false,
        isget: false,
        Swiper: false,
        Typeswiper: false,
        Postlist: [],
        scrollBack: false,
    },
    onLoad: function(options) {
        app.setNavigationBarColor(this);
        app.pageOnLoad(this);
        //app.setNavigationBarTitle('同城资讯')
        app.api.infomationconfig((info) => {
          console.log('info',info)
          app.setNavigationBarTitle(info.field)
        })
        // this.getPostnav()
        app.util.getmyAmapFun({
            key: "b6839a2765b006854ce143c4a96df671",
            success: res => {
                let weather = res.liveData.weather,
                    temperature = res.liveData.temperature,
                    city = res.liveData.city,
                    windpower = res.windpower.data,
                    winddirection = res.winddirection.data
                this.setData({
                    weather: {
                        name: temperature + '°C',
                        city: city,
                        color: this.data.color,
                        week: app.util.getWeek(),
                        time: app.util.today(),
                        windpower: windpower,
                        winddirection: winddirection,
                        type: weather, // 晴  小雨  大雨  中雨  阵雨  暴雨  雷阵雨  少云  雾  霾  多云 阴
                    }
                })
            }
        })
        this.getPostnav()
        this.getPostlist()
        this.indexAdlist()
        this.announceList()
        this.advertAdlist()
    },
    // 获取信息中间广告位
    advertAdlist(e) {
        var that = this
        app.api.request({
            url: app.url.adList,
            data: {
                type: 4,
                adType: 2,
            },
            success: res => {
                var imgs = res.data.data
                if (imgs.length > 0) {
                    for (let i in imgs) {
                        imgs[i].type = 0
                        imgs[i].url = that.data.url + imgs[i].url
                        // imgs[i].route = "/pages/message/info/index"
                    }
                    that.setData({
                        advert: imgs
                    })
                }
            }
        })
    },

    // 获取首页公告
    announceList(e) {
        var that = this
      that.setData({
        Headline: {
          notice: { color: '#666' },
          isButton: false, //右边的button按钮是否显示
          right_button: "我要入驻", //button按钮的文字
          right_src: '/pages/store/storeentry/storeentry', //button按钮对应的路径
          leftvalue: "资讯快报",
          bordercolor: "#f9f9f9",
          color: that.data.color,
        },
      })
    },
    // 获取资讯首页广告位
    indexAdlist(e) {
        var that = this
        app.api.request({
            url: app.url.adList,
            data: {
                type: 4,
                adType: 1
            },
            success: res => {
                console.log('首页轮播图为', res)
                var imgs = res.data.data
                if (imgs.length > 0) {
                    for (let i in imgs) {
                        imgs[i].type = 0
                        imgs[i].url =that.data.url + imgs[i].url
                        imgs[i].route = "/pages/message/info/index"
                    }
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
                } else {
                    that.setData({
                        Swiper: false
                    })
                }

            }
        })
    },
    // 获取资讯分类
    getPostnav(e) {
        var that = this
        app.api.request({
            url: app.url.category,
            data: {
                type: 3
            },
            success: res => {
              var postNav = res.data.data
              for (let i in postNav) {
                postNav[i].url = that.data.url + postNav[i].icon
                postNav[i].label = postNav[i].name
                postNav[i].entry = { "value": 'newsCategory', "param": postNav[i].id }
              }
              console.log(postNav)
              that.setData({
                Typeswiper: {
                  "color": "#666",
                  "shape": 3,
                  "buttonNumberOfCol": 5,
                  "buttonNumberOfRow": 2,
                  "entryButtonList": postNav,
                }
              })
            }
        })
    },
    // 获取资讯列表
    getPostlist(e) {
        var that = this,
            Postlist = that.data.Postlist,
            page = that.data.page
        app.api.request({
            url: app.url.infomation,
            data: {
                page: page,
                size: 10
            },
            success: res => {
                console.log(res.data)
                if (res.data.data.length < 10) {
                    that.setData({
                        mygd: true,
                    })
                } else {
                    that.setData({
                        page: page + 1,
                    })
                }
                for (let i in res.data.data) {
                    res.data.data[i].createdAt = app.util.settime(res.data.data[i].createdAt)
                    res.data.data[i].media = JSON.parse(res.data.data[i].media)
                    for (let j in res.data.data[i].media) {
                        res.data.data[i].media[j].url = that.data.url + res.data.data[i].media[j].url
                    }
                }
                Postlist = Postlist.concat(res.data.data)
                that.setData({
                    Postlist: Postlist,
                    isget: true,
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        //获得组件
        this.Search = this.selectComponent("#Search");
        this.Swiper = this.selectComponent("#Swiper");
        this.Notice = this.selectComponent("#Notice");
        this.Headline = this.selectComponent("#Headline");
        this.Hotstore = this.selectComponent("#Hotstore");
        this.Cardlist = this.selectComponent("#Cardlist");
        this.Picmagic = this.selectComponent("#Picmagic");
        this.Postinfo = this.selectComponent("#Postinfo");
    },
    onChange(e) {
        console.log('onChange', e)
        this.setData({
            current: e.detail.key,
        })
    },
    onTabsChange(e) {
        console.log('onTabsChange', e)
        const {
            key
        } = e.detail
        const index = this.data.tabs.map((n) => n.key).indexOf(key)

        this.setData({
            key,
            index,
        })
    },
    onSwiperChange(e) {
        console.log('onSwiperChange', e)
        const {
            current: index,
            source
        } = e.detail
        const {
            key
        } = this.data.tabs[index]

        if (!!source) {
            this.setData({
                key,
                index,
            })
        }
    },
    // 首页跳转
    jump(e) {
        console.log('点击了')
        this.Swiper.jump();
    },

    // 公告帮助跳转
    help(e) {
        console.log('点击了')
        this.Notice.help();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (!this.data.mygd && this.data.isget) {
            this.setData({
                isget: false
            })
            this.getPostlist()
        }
    },
})