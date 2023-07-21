var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    formSubmit: function(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        wx.navigateBack({

        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        console.log(options)
        app.setNavigationBarTitle(options.xyname)
        app.setNavigationBarColor(this);
        if (options.xyname == '版本区别') {
            app.api.request({
                'url': app.url.store_meal,
                'cachetime': '30',
                success: function(res) {
                    console.log(res)
                    that.setData({
                        type: 0,
                        rztimearr: res.data.data,
                    })
                },
            })
            // that.setData({
            //   nodes: info.agreement
            // })
        } else if (options.xyname == '公告详情') {
            that.setData({
                type: 1,
                title: options.title,
                info: options.info
            })
        }
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
})