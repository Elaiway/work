// pages/personal/testcenter/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },
    tzxq(e) {
        let index = e.currentTarget.dataset.index
        console.log(index)
        if (index == 0) {
            wx.navigateTo({
                url: 'testpersonal',
            })
        }
        if (index == 1) {
            wx.navigateTo({
                url: 'testcompany',
            })
        }
        if (index == 2) {
            wx.navigateTo({
                url: 'testbond',
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        app.setNavigationBarColor(this);
        app.pageOnLoad(this);
        app.setNavigationBarTitle('redpaper详情')
        console.log(options)
        that.setData({
            id:options.id,
            portrait: options.portrait,
            userName: options.userName,
            Swiper: {
                config: {
                    imgUrls: [{
                        url: app.imgsrc + '/wechatimg/receive/auntbg.png'
                    }],
                    height: 350,
                    indicatordots: false,
                    activecolor: that.data.color,
                    indicatorcolor: "#ccc",
                    circular: true,
                    autoplay: true,
                    interval: 5000,
                    duration: 1000
                }
            },
        })
        that.getRedList()
    },

    // 获取redpaper领取列表
    getRedList(e) {
        app.api.request({
            url: app.url.redList,
            data: {
                postId: this.data.id,
            },
            success: res => {
                console.log(res)
                var receiveList = res.data.data
                for (let i in receiveList){
                    receiveList[i].creatTime = app.util.settime(receiveList[i].creatTime)
                }
                this.setData({
                    receiveList: receiveList,
                    content:res.data
                })
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

    },
})