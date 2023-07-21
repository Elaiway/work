// dist/public/auxiliary/foot-nav.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageType: {
      type: String,
      value: '',
      observer(newVal, oldVal, changedPath) {},
    },
    color: {
      type: String,
      value: '',
      observer(newVal, oldVal, changedPath) {
        this.setData({
          '_navbar.color': newVal
        })
      },
    },
    actions: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    _navbar: {
      border_color: "rgba(0,0,0,.1)",
      bottomTabStyle: '',
      color: '',
      colorOff: '#888',
      navs: []
    },
    visible: false,
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      let nav = [],
        route = app.Getroute()
      switch (this.properties.pageType) {
        case 'yellow':
          nav = [{
            icon: 'icon-shouye',
            legend: '首页',
            link: "/pages/index/index"
          }, {
            icon: 'icon-mingpian',
            legend: app.yellow.field,
            link: "/pages/yellow/index"
          }, {
            icon: 'icon-ruzhu',
            legend: '分类',
            link: "/pages/yellow/classify"
          }, {
            icon: 'icon-jilu1',
            legend: '我的记录',
            link: "/pages/yellow/myrecord"
          }, {
            icon: 'icon-zhanghao',
            legend: '个人中心',
            link: "/pages/personal/index"
          }]
          break;
        case 'freeride':
          nav = [{
              icon: 'icon-shouye',
              legend: '首页',
              link: "/pages/index/index"
            }, {
              icon: 'icon-car',
              legend: app.freeCar.field,
              link: "/pages/freeride/index"
            },
            {
              icon: 'icon-jia',
              legend: '发布',
              item: 2,
              link: "/pages/freeride/release"
            },
            {
              icon: 'icon-jilu1',
              legend: '收藏',
              link: "/pages/freeride/collection"
            }, {
              icon: 'icon-xiaolian',
              legend: '我的发布',
              link: "/pages/freeride/myrelease"
            }
          ]
          this.getCategory()
          break;
        case 'mall':
          nav = [{
            icon: 'icon-shouye',
            legend: '首页',
            link: "/pages/index/index"
          }, {
            icon: 'icon-shangdian',
            legend: app.mall.field,
            link: "/pages/mall/index"
          }, {
            icon: 'icon-fenleiweixuan',
            legend: '分类',
            link: "/pages/mall/category"
          }, {
            icon: 'icon-gouwuche',
            legend: '购物车',
            link: "/pages/mall/cart"
          }, {
            icon: 'icon-zhanghao',
            legend: '我的订单',
            link: "/pages/mall/order"
          }]
          break;
        case 'jobhunt':
          nav = [{
              icon: 'icon-shouye',
              legend: '首页',
              link: "/pages/index/index"
            }, {
              icon: 'icon-zhaopinguanli1',
              legend: app.jobhunt.field,
              link: "/pages/jobhunt/index"
            },
            {
              icon: 'icon-jia',
              legend: '发布',
              item: 2,
              link: "/pages/freeride/releasejob"
            },
            {
              icon: 'icon-jilu1',
              legend: '收藏',
              link: "/pages/jobhunt/collection"
            }, {
              icon: 'icon-xiaolian',
              legend: '我的发布',
              link: "/pages/jobhunt/myjobhunt"
            }
          ]
          this.getPostnav()
          break;
        case 'housingdeal':
          nav = [{
              icon: 'icon-shouye',
              legend: '首页',
              link: "/pages/index/index"
            }, {
              icon: 'icon-zufang',
              legend: app.housingdeal.field,
              link: "/pages/housingdeal/index"
            },
            {
              icon: 'icon-jia',
              legend: '发布',
              item: 2,
              link: "/pages/housingdeal/release"
            },
            {
              icon: 'icon-jilu1',
              legend: '收藏',
              link: "/pages/housingdeal/collection"
            }, {
              icon: 'icon-xiaolian',
              legend: '我的发布',
              link: "/pages/housingdeal/myrelease"
            }
          ]
          this.getHousing()
          break;
        case 'activity':
          nav = [{
            icon: 'icon-shouye',
            legend: '首页',
            link: "/pages/index/index"
          }, {
            icon: 'icon-huodong1',
            legend: app.activity.field,
            link: "/pages/activity/index"
          }, {
            icon: 'icon-jilu1',
            legend: '我的收藏',
            link: "/pages/activity/collection"
          }, {
            icon: 'icon-ren3',
            legend: '我的',
            link: "/pages/activity/order"
          }]
          break;
        case 'businesscard':
          nav = [{
            icon: 'icon-shouye',
            legend: '首页',
            link: "/pages/index/index"
          }, {
            icon: 'icon-iconset0327',
            legend: app.businesscard.field,
            link: "/pages/businesscard/index"
          }, {
            icon: 'icon-gerenzhongxin',
            legend: '我的名片',
            link: "/pages/businesscard/mycard"
          }, {
            icon: 'icon-card1',
            legend: '名片夹',
            link: "/pages/businesscard/cardholder"
          }, {
            icon: 'icon-xiaolian',
            legend: '个人中心',
            link: "/pages/personal/index"
          }]
          break;
        case 'vip':
          nav = [{
              icon: 'icon-shouye',
              legend: '首页',
              link: "/pages/index/index"
            }, {
              icon: 'icon-credentials_icon',
              legend: app.vip.field,
              link: "/pages/vip/index"
            }, {
              icon: 'icon-jia',
              legend: '加入',
              link: "/pages/vip/entervip"
            },
            {
              icon: 'icon-xinfeng8',
              legend: '使用',
              link: "/pages/vip/my"
            },
            {
              icon: 'icon-xiaolian',
              legend: '我的',
              link: "/pages/personal/index"
            }
          ]
          break;
        case 'assemble':
          nav = [{
              icon: 'icon-shouye',
              legend: '首页',
              link: "/pages/index/index"
            }, {
              icon: 'icon-pintuandingdan',
              legend: app.group.field,
              link: "/pages/assemble/index"
            }, {
              icon: 'icon-fenleiweixuan',
              legend: '分类',
              link: "/pages/assemble/category"
            }, {
              icon: 'icon-yufukuanyufukuanjil',
              legend: '我的订单',
              link: "/pages/assemble/order"
            },
            {
              icon: 'icon-xiaolian',
              legend: '个人中心',
              link: "/pages/personal/index"
            }
          ]
          break;
        case 'managemall':
          nav = [{
              icon: 'icon-shangpin',
              legend: '管理订单',
              link: "/pages/mall/manage/order"
            },
            {
              icon: 'icon-gouwu',
              legend: '管理商品',
              link: "/pages/mall/manage/goodslist"
            },
            {
              icon: 'icon-jia',
              legend: '发布商品',
              item: 2,
              link: "/pages/mall/manage/release"
            },
            {
              icon: 'icon-shangjia1',
              legend: '配送设置',
              link: "/pages/mall/manage/settings"
            }
          ]
          break;
        case 'managemallcoupon':
          nav = [{
              icon: 'icon-youhuiquan2',
              legend: '管理券',
              link: "/pages/mall/manage/couponlist"
            },
            {
              icon: 'icon-jia',
              legend: '发布券',
              item: 2,
              link: "/pages/mall/manage/releasecoupon"
            }
          ]
          break;
        case 'manageassemble':
          nav = [{
              icon: 'icon-pintuangou',
              legend: '管理拼团',
              link: "/pages/assemble/manage/order"
            },
            {
              icon: 'icon-pintuandingdan',
              legend: '发布拼团',
              item: 2,
              link: "/pages/assemble/manage/release"
            },
          ]
          break;
        case 'coupon':
          nav = [{
            icon: 'icon-shouye',
            legend: '首页',
            link: "/pages/index/index"
          }, {
            icon: 'icon-youhuiquanxianxing',
            legend: app.coupon.field,
            link: "/pages/coupon/index"
          }, {
            icon: 'icon-jilu1',
            legend: '我的领取',
            link: "/pages/coupon/myreceive"
          }, {
            icon: 'icon-xiaolian',
            legend: '个人中心',
            link: "/pages/personal/index"
          }]
          break;
        case 'rushbuy':
          nav = [{
            icon: 'icon-shouye',
            legend: '首页',
            link: "/pages/index/index"
          }, {
            icon: 'icon-shalou',
            legend: app.rushbuy.field,
            link: "/pages/rushbuy/index"
          }, {
            icon: 'icon-jilu1',
            legend: '我的领取',
            link: "/pages/rushbuy/myreceive"
          }, {
            icon: 'icon-xiaolian',
            legend: '个人中心',
            link: "/pages/personal/index"
          }]
          break;
        case 'managerushbuy':
          nav = [{
              icon: 'icon-qiang',
              legend: '管理抢购',
              link: "/pages/rushbuy/manage/myrelease"
            },
            {
              icon: 'icon-daojishi',
              legend: '发布抢购',
              item: 2,
              link: "/pages/rushbuy/manage/release"
            },
          ]
          break;
        case 'bargain':
          nav = [{
            icon: 'icon-shouye',
            legend: '首页',
            link: "/pages/index/index"
          }, {
            icon: 'icon-kanjia',
            legend: app.bargain.field,
            link: "/pages/bargain/index"
          }, {
            icon: 'icon-geren2',
            legend: '我参加的',
            link: "/pages/bargain/order"
          }, {
            icon: 'icon-xiaolian',
            legend: '个人中心',
            link: "/pages/personal/index"
          }]
          break;
        case 'managebargain':
          nav = [{
              icon: 'icon-lianmengguanli',
              legend: '管理砍价',
              link: "/pages/bargain/manage/order"
            },
            {
              icon: 'icon-kanjia',
              legend: '发布砍价',
              item: 2,
              link: "/pages/bargain/manage/release"
            },
          ]
          break;
      }
      const index = nav.findIndex(item => item.link == '/' + route);
      index > -1 && (nav[index].active = true)
      this.setData({
        '_navbar.navs': nav
      })
      console.log('pageType', this.properties.pageType, route, index)
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取顺风车分类
    getCategory(e) {
      app.api.prequest({
        'url': app.url.freeCategory,
      }).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].icon = app.util.getImgUrl(res.data[i].icon)
        }
        console.log(res)
        let actions = res.data
        this.setData({
          actions,
        })
      })
    },
    //获取求职招聘分类信息
    getPostnav(e) {
      let that = this;
      app.api.prequest({
        "url": app.url.jobCategory
      }).then(res => {
        let actions = res.data
        that.setData({
          actions,
        })
      })
    },
    //获取房屋租售分类信息
    getHousing(e) {
      let that = this;
      app.api.prequest({
        "url": app.url.housCategory
      }).then(res => {
        let actions = res.data
        that.setData({
          actions,
        })
      })
    },
    clickNav(e) {
      if (this.properties.pageType == 'freeride' && e.currentTarget.dataset.idx == '2') {
        this.setData({
          visible: true,
        })
      } else if (this.properties.pageType == 'jobhunt' && e.currentTarget.dataset.idx == '2') {
        this.setData({
          visible: true,
        })
      } else if (this.properties.pageType == 'housingdeal' && e.currentTarget.dataset.idx == '2') {
        this.setData({
          visible: true,
        })
      } else if (this.properties.pageType == 'managemall' && e.currentTarget.dataset.idx == '2') {
        wx.navigateTo({
          url: '/pages/mall/manage/release'
        })
      } else if (this.properties.pageType == 'manageassemble' && e.currentTarget.dataset.idx == '1') {
        wx.navigateTo({
          url: '/pages/assemble/manage/release'
        })
      } else if (this.properties.pageType == 'managerushbuy' && e.currentTarget.dataset.idx == '1') {
        wx.navigateTo({
          url: '/pages/rushbuy/manage/release'
        })
      } else if (this.properties.pageType == 'managebargain' && e.currentTarget.dataset.idx == '1') {
        wx.navigateTo({
          url: '/pages/bargain/manage/release'
        })
      } else if (this.properties.pageType == 'managemallcoupon' && e.currentTarget.dataset.idx == '1') {
        wx.navigateTo({
          url: '/pages/mall/manage/releasecoupon'
        })
      }
      console.log(e.currentTarget.dataset.idx)
    },
    handleCancel() {
      this.setData({
        visible: false
      });
    },
    handleClickItem({
      detail
    }) {
      const index = detail.index;
      console.log(this.data.actions[index])
      if (this.properties.pageType == 'freeride') {
        wx.navigateTo({
          url: '/pages/freeride/release?id=' + this.data.actions[index].id + '&name=' + this.data.actions[index].name,
        })
      } else if (this.properties.pageType == 'jobhunt') {
        if (this.data.actions[index].identifying == '2') {
          wx.navigateTo({
            url: '/pages/jobhunt/releaserecruit?id=' + this.data.actions[index].id + '&name=' + this.data.actions[index].name,
          })
        } else if (this.data.actions[index].identifying == '1') {
          wx.navigateTo({
            url: '/pages/jobhunt/releasejob?id=' + this.data.actions[index].id + '&name=' + this.data.actions[index].name,
          })
        }

      } else if (this.properties.pageType == 'housingdeal') {
        if (this.data.actions[index].identifying == '3' || this.data.actions[index].identifying == '4') {
          wx.navigateTo({
            url: '/pages/housingdeal/release?typeId=' + this.data.actions[index].id + '&name=' + this.data.actions[index].name + '&type=' + this.data.actions[index].identifying,
          })
        } else if (this.data.actions[index].identifying == '5' || this.data.actions[index].identifying == '6') {
          wx.navigateTo({
            url: '/pages/housingdeal/releasesale?typeId=' + this.data.actions[index].id + '&name=' + this.data.actions[index].name + '&type=' + this.data.actions[index].identifying,
          })
        }
      }
      this.setData({
        visible: false
      })
    }
  }
})