// pages/login/index/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        key: '0',
        list: true,
        tabs: [{
                name: '发布',
                id: '0',
            },
            {
                name: '店铺',
                id: '1',
            },
            {
                name: '访客',
                id: '2',
            }
        ],
        page: 1,
        postList: [],
        UserVisitor: [],
        userStore: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        this.setData({
            user_id: options.user_id
        })
        this.getUserhead()
        // this.getUserVisitor()
        app.setNavigationBarTitle('个人主页')
        app.setNavigationBarColor(this);
        this.lookKey(this.data.key)
    },
    lookKey(key) {
        if (key == '0') {
            this.getPostlist()
        } else if (key == '1') {
            this.postStore()
        } else {
            this.getUserVisitor()
        }
    },
    // 用户头部信息
    getUserhead(e) {
        var _f = this.data,
            that = this
        app.api.request({
            url: app.url.own_info,
            data: {
                id: _f.user_id,
                ownId: wx.getStorageSync('users').id
            },
            success: res => {
                console.log('用户头部信息为', res)
                res.data.data.registerTime = app.util.ormatDate(res.data.data.registerTime)
                that.setData({
                    Userhead: res.data.data,
                })
            }
        })
    },
    // 访客信息
    getUserVisitor(e) {
        var _f = this.data,
            that = this,
            postList = _f.postList
        app.api.request({
            url: app.url.visitorList,
            data: {
                id: _f.user_id,
                size: 10,
                page: _f.page,
            },
            success: res => {
                console.log('用户访客信息为', res)
                if (res.data.data.length < 10) {
                    that.setData({
                        mygd: true,
                    })
                } else {
                    that.setData({
                        page: that.data.page + 1,
                    })
                }
                //that.getUserhead()
                for (let i in res.data.data) {
                    res.data.data[i].createAT = app.util.settime(res.data.data[i].createAT)
                }
                postList = postList.concat(res.data.data)
                that.setData({
                    postList: postList,
                    isget: true,
                })
            }
        })
    },
    // 获取用户的店铺信息
    postStore() {
        var _f = this.data,
            that = this
      app.api.getUserstore({
            data: {
                adminId: _f.user_id,
            },
            success: res => {
                console.log("该用户的店铺信息为", res)
              that.setData({
                mygd: true,
              })
              var postList = _f.postList
              postList = postList.concat(res.data.data)

              that.setData({
                postList: postList,
                isget: true,
              })

            }
        })
    },
    // 获取信息列表信息
    getPostlist(e) {
        var _f = this.data,
            that = this
      app.api.userPost({
            data: {
                page: _f.page,
                size: 10,
                status: 'display',
                userId: _f.user_id
            },
            success: res => {
                console.log('信息列表信息', res)
                if (res.data.data.length < 10) {
                    that.setData({
                        mygd: true,
                    })
                } else {
                    that.setData({
                        page: that.data.page + 1,
                    })
                }
                var postList = _f.postList
                postList = postList.concat(res.data.data)
                that.setData({
                    postList: postList,
                    isget: true,
                })
                console.log(_f.page)
            }
        })
    },
    //tabs切换
    onTabsChange(e) {
        console.log('onTabsChange', e)
        const {
            key
        } = e.detail
        const index = this.data.tabs.map((n) => n.key).indexOf(key)
        console.log(index)
        this.setData({
            key,
            index,
            postList: [],
            page: 1,
            mygd: false,
            isget: false,
        })
        this.lookKey(key)
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
            this.lookKey(this.data.key)
        }
    },

})