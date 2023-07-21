// pages/index/commentlist/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

        reply: false, //默认不是回复
        plmodal: true,
        commentShow: false,//默认评论框不显示
        comment:"",//默认发布评论内容为空
        reply_userid: "", //默认回复人id为空
        commentId: '', //默认评论id为空
        reply_type: false, //默认无回复id
        comment_list: 3, //限制详情展示评论的数量
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        app.setNavigationBarColor(that);
        app.pageOnLoad(that);
        app.setNavigationBarTitle('评论列表')
        that.setData({
            id: options.id
        })
        app.api.postconfig((info) => {
            console.log(info)
            that.setData({
                comment_close: info.comment, //评论是否关闭
            })
        })
        this.getCommentlist()
    },

    getCommentlist(e) {
        var that = this
        app.api.request({
            url: app.url.commentList,
            data: {
                postId: that.data.id,
                page:1,
                size:200,
            },
            success: res => {
                console.log("本条信息的评论列表为", res)
                if (res.data.code == '1') {
                    for (let i in res.data.data) {
                        res.data.data[i].creatTime = app.util.settime(res.data.data[i].creatTime)
                    }
                    that.setData({
                        postCommend: res.data.data
                    })
                }
            }
        })
    },
    // 打开评论
    openpl(e) {
        console.log(e)
        if (e.detail.type == 2) {
            this.setData({
                commentShow: true,
                // name: e.detail.name,
                commentId: e.detail.id,
                reply_type: true,
                // reply_userid: e.detail.user_id,
                reply_user: '回复' + e.detail.name
            })
        } else {
            this.setData({
                reply_user: "请输入文字",
                commentShow: true
            })
        }
        // this.setData({
        //     plmodal: false,
        // })
    },
    // 关闭评论
    handleClose1() {
        this.setData({
            commentShow: false,
        })
    },
    // 评论详情
    comment_info(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/message/allcomments/index?id=' + this.data.id + '&commentId=' + e.detail,
        })
    },

    // 获取用户输入的评论内容
    getComment(e) {
        this.setData({
            comment: e.detail.value
        })
    },
    // 提交评论
    handleopen1(e) {
        var that = this,
            tzid = that.data.id,
            commentId = that.data.commentId,
            reply_userid = that.data.reply_userid,
            value = that.data.comment,
            reply_type = that.data.reply_type;
        if (reply_type == false) {
            var uid = wx.getStorageSync('users').id,
                replyUserId = ''
        } else {
            var uid = reply_userid,
                replyUserId = wx.getStorageSync('users').id
        }
        console.log('用户id', uid, '信息id', tzid, '评论内容', value, commentId, replyUserId)
        if (value == '') {
            app.util.getShowmodel("请输入评论内容")
        } else {
            // return
            wx.showLoading({
                title: '加载中',
                mask: 1,
            })
            app.api.request({
                'url': app.url.comment,
                'cachetime': '0',
                data: {
                    userId: uid,
                    postId: tzid,
                    body: value,
                    commentId: commentId,
                    replyUserId: replyUserId
                },
                method: "POST",
                success: function (res) {
                    console.log(res.data)
                    wx.hideLoading()
                    if (res.data.code == 1) {
                      that.getCommentlist()
                        that.setData({
                            plmodal: true,
                            commentShow: false,
                            name: '',
                            commentId: '',
                            reply_type: false,
                            reply_userid: ''
                        })
                    }
                }
            })
        }

    },
    // // 评论详情
    // comment_info(e) {
    //   console.log(e)
    //   wx.navigateTo({
    //     url: '/pages/message/allcomments/index?id=' + this.data.id + '&commentId=' + e.detail,
    //   })
    // },
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