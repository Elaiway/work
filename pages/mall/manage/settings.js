// pages/mall/manage/sett.js
var app = getApp();
Page({
  data: {
    deliverMode: [{
        title: "快递配送",
        value: false
      },
      {
        title: "到店自提",
        value: false
      },
    ],
    layoutBodyOne: {
      bd: {
        styleName: '',
      },
      ft: 1
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.setNavigationBarTitle('商家设置')
    app.setNavigationBarColor(this);
    app.api.prequest({
      'url': app.url.bussinessInfo,
      data: {
        id: app.sjdId
      },
    }).then(res => {
      if (res.data.deliverMode == 3) {
        this.setData({
          'deliverMode[0].value': true,
          'deliverMode[1].value': true,
        })
      } else if (res.data.deliverMode == 2) {
        this.setData({
          'deliverMode[0].value': false,
          'deliverMode[1].value': true,
        })
      } else {
        this.setData({
          'deliverMode[0].value': true,
          'deliverMode[1].value': false,
        })
      }
      this.setData({
        storeInfo: res.data,
      })
    })
  },
  switchChange(e) {
    let index = e.currentTarget.dataset.idx,
      tips = this.data.deliverMode[index].value ? '关闭' : '开启',
      deliverMode,
      arr = this.data.deliverMode
    console.log(arr)
    wx.showModal({
      title: '提示',
      content: `确定${tips}${this.data.deliverMode[index].title}吗？`,
      success: (res) => {
        //点击确定
        if (res.confirm) {
          this.setData({
            [`deliverMode[${index}].value`]: !arr[index].value
          })
          console.log(arr)
          if (arr[0].value && arr[1].value) {
            deliverMode = 3
          } else if (!arr[0].value && arr[1].value) {
            deliverMode = 2
          } else {
            deliverMode = 1
          }
          app.util.getShowloading('提交中')
          app.api.prequest({
            'url': app.urlTwo.shopBusinessSet,
            'method': 'POST',
            data: {
              storeId: app.sjdId,
              deliverMode: deliverMode
            },
          }).then((res) => {
            if (res.code == '1') {
              app.util.getShowtoast('操作成功')
            } else {
              this.setData({
                [`deliverMode[${index}].value`]: !arr[index].value
              })
              app.util.getShowtoast(res.msg, 1000, 1)
            }
          });
        } else {
          this.setData({
            [`deliverMode[${index}].value`]: arr[index].value
          })
        }
      }
    })
    console.log('postSwitchChange携带值为', index, e.detail.value)
  },
  deleteInfo(e) {
    wx.showModal({
      title: '提示',
      content: `确定删除吗？`,
      success: (res) => {
        //点击确定
        if (res.confirm) {
          app.util.getShowloading('提交中')
          app.api.prequest({
            'url': app.urlTwo.shopDelAddress,
            'method': 'POST',
            data: {
              addressId: e.currentTarget.dataset.id,
            },
          }).then((res) => {
            if (res.code == '1') {
              app.util.getShowtoast('操作成功')
              this.onShow()
            } else {
              app.util.getShowtoast(res.msg, 1000, 2)
            }
          });
        }
      }
    })
    console.log(e.currentTarget.dataset.id)
  },
  release(e) {
    wx.navigateTo({
      url: 'releaseztd?id=' + (e.currentTarget.dataset.id || 0),
    })
    console.log(e.currentTarget.dataset.id)
  },
  onShow: function() {
    app.api.prequest({
      'url': app.urlTwo.shopDeliverSet,
      method: 'POST',
      data: {
        storeId: app.sjdId
      },
    }).then(res => {
      this.setData({
        dataList: res.data,
      })
    })
  }
})