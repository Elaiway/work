// pages/personal/collection/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: "0",
    key: "0",
    page: 1,
    size: 10,
    postList: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      user_id: options.user_id
    })
    that.choice_type(that.data.key)
    app.setNavigationBarColor(this);
    app.pageOnLoad(this);
    app.setNavigationBarTitle('我的关注')
    that.setData({
      tabs: [{
          name: wx.getStorageSync('storeinfo').field,
          id: '0',
        },
        {
          name: wx.getStorageSync('postinfo').field,
          id: '1',
        },
      ],
    })
  },
  //tabs切换
  onTabsChange(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    const index = this.data.tabs.map((n) => n.key).indexOf(key)

    this.setData({
      key,
      index,
      postList: [],
      mygd: false,
      isget: false,
      page: 1,
      size: 10
    })
    this.choice_type(key)
  },
  choice_type(key){
    if (key == '0') {
      this.getStorelist()
    } else {
      this.getPostlist()
    }
  },
  // 获取信息列表信息
  getPostlist(e) {
    var that = this
    app.api.request({
      url: app.url.my_collection,
      data: {
        type: 1,
        userId: that.data.user_id,
        page: that.data.page,
        size: that.data.size
      },
      success: res => {
        if (res.data.data.length < that.data.size) {
          that.setData({
            mygd: true,
          })
        } else {
          that.setData({
            page: that.data.page + 1,
          })
        }
        var postList = that.data.postList
        for (let i in res.data.data) {
          res.data.data[i].creatTime = app.util.settime(res.data.data[i].creatTime)
          if (res.data.data[i].tag != '') {
            res.data.data[i].tag = res.data.data[i].tag.split(",")
            res.data.data[i].tag.forEach((item, index, input) => {
              input[index] = {
                name: item,
                color: app.util.bg1(index)
              }
            })
          }
          res.data.data[i].media = JSON.parse(res.data.data[i].media)
          res.data.data[i].body = res.data.data[i].body.replace("↵", "\n");
          for (let j in res.data.data[i].media) {
            res.data.data[i].media[j].url = that.data.url + res.data.data[i].media[j].url
          }
        }
        postList = postList.concat(res.data.data)
        that.setData({
          postList: postList,
          isget: true,
          color: that.data.color,
        })
      }
    })
  },
  // 获取商家列表信息
  getStorelist(e) {
    var that = this
    app.api.request({
      url: app.url.my_collection,
      data: {
        type: 2,
        userId: that.data.user_id,
        page: that.data.page,
        size: that.data.size
      },
      success: res => {
        if (res.data.data.length < that.data.size) {
          that.setData({
            mygd: true,
          })
        } else {
          that.setData({
            page: that.data.page + 1,
          })
        }
        var postList = that.data.postList
        for (let i in res.data.data) {
          res.data.data[i].storeLogo = JSON.parse(res.data.data[i].storeLogo)
        }
        postList = postList.concat(res.data.data)
        that.setData({
          postList: postList,
          isget: true,
          color: that.data.color,
        })
      }
    })
  },
  storeinfo(e) {
    wx.navigateTo({
      url: '/pages/store/storemain/storedetail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 取消商家收藏
  cacelCollection(e) {
    let data = e.currentTarget.dataset
    this.cancel(data.id, data.index, 2)
  },
  // 取消信息收藏
  cancel_collection(e) {
    console.log("取消信息收藏", e)
    this.cancel(e.detail.id, e.detail.index, 1)
  },
  cancel(id, index, type) {
    var that = this,
      postList = that.data.postList
    wx.showModal({
      title: '温馨提示',
      content: '是否要取消本条收藏',
      success: res => {
        if (res.confirm) {
          app.api.request({
            url: app.url.collection_post,
            data: {
              postId: id,
              userId: that.data.user_id,
              type: type,
            },
            method: "POST",
            success: res => {
              console.log(res)
              if (res.data.code == '1') {
                postList.splice(index, 1)
                console.log(postList)
                that.setData({
                  postList: postList
                })
              } else {
                app.util.getShowtoast("系统错误")
              }
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.mygd && this.data.isget) {
      this.setData({
        isget: false
      })
      if (this.data.key == '0') {
        this.getStorelist()
      } else {
        this.getPostlist()
      }
    }
  }
})