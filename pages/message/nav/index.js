// pages/message/nav/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        mygd: false,
        isget: false,
        Postlist: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            id: options.id
        })
        app.setNavigationBarColor(this);
        app.pageOnLoad(this);
        app.api.infomationconfig((info) => {
          app.setNavigationBarTitle(info.field)
        })
        this.getPostnav()
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
                console.log(res)
                var postNav = res.data.data
                for (let i in postNav) {
                    if (postNav[i].id == that.data.id) {
                        that.setData({
                            current: postNav[i].id
                        })
                    }
                }
                that.setData({
                    postNav: res.data.data,
                })
                this.getPostlist()
            }
        })
    },
    // 获取资讯列表
    getPostlist(e) {
        var that = this,
            Postlist = that.data.Postlist,
            page = that.data.page,
            current = that.data.current
        app.api.request({
            url: app.url.infomation,
            data: {
                page: page,
                size: 10,
                typeId: current,
                zoneId: app.globalData.city.defaultId
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

    onChange(e) {
        this.setData({
            current: e.detail.key,
            page: 1,
            Postlist: []
        })
        this.getPostlist()
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
            this.getPostlist()
        }
    },

})