// pages/publish/publishpost.js
var app = getApp(),
  setinfo = require('../../../setinfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paymoney: 0,
    key: '0',
    tabs: [{
        name: '图文',
        id: '0',
      },
      {
        name: '视频',
        id: '1',
      },
      {
        name: '文章',
        id: '2',
      }
    ],
    tabspane: [1, 2, 3],
    fileList: [],
    spradiovalue: '1',
    isshowpay: false,
    checkboxvalue: true,
  },
  //
  textareachange(e) {
    console.log(e.detail)
    this.setData({
      textareavalue: e.detail
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
    })
  },
  //视频切换
  onChange(field, e) {
    this.setData({
      [field]: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  sprdioonChange(e) {
    console.log(e)
    this.onChange('spradiovalue', e)
  },
  videochange(e) {
    console.log('videochange', e)
    this.setData({
      videosrc: e.detail,
    })
  },
  //upload
  uploadonChange(e) {
    console.log('uploadonChange', e)
    this.setData({
      images: e.detail.fileList,
    })
  },
  onPreview(e) {
    console.log('onPreview', e)
    const {
      file,
      fileList
    } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    })
  },
  //选择位置
  chooseLocation: function() {
    var t = this;
    app.util.chooseLocation({
      success: res => {
        console.log(res)
        t.setData({
          address: res.address + res.name,
          lat: res.latitude,
          lng: res.longitude,
        })
      }
    })
  },
  //勾选协议
  clickcheckbox(e) {
    console.log(e.detail)
    this.setData({
      checkboxvalue: e.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this,
      dwcity = app.globalData.city;
    console.log(app.Getroute(), options, wx.getStorageSync('Location'), dwcity)
    app.setNavigationBarColor(this);
    app.getUserInfo(function(userinfo) {
      console.log(userinfo)
      that.setData({
        userinfo: userinfo,
      })
    })
    this.setData({
      id: options.id,
      dwcity: dwcity,
    })
    app.api.postconfig((info) => {
      console.log(info)
      that.setData({
        postconfig: info,
      })
      app.api.request({
        url: app.url.postIndex,
        'cachetime': '0',
        data: {
          postId: options.id,
          isEdit: 1,
        },
        success: function(res) {
          console.log(res.data)
          var postInfo = res.data.data[0],
            spradiovalue, radioarr;
          app.setNavigationBarTitle('编辑' + info.field + 'ID:' + postInfo.postId)
          postInfo.body = postInfo.body.replace("↵", "\n")
          postInfo.media = JSON.parse(postInfo.media)
          postInfo.tag = postInfo.tag.split(',').join(" ")
          let photoList = postInfo.media;
          if (postInfo.contentType == '1') {
            for (let i in photoList) {
              photoList[i].url = that.data.url + photoList[i].url
            }
          }
          if (postInfo.contentType == '3') {
            if (postInfo.media[0].type == 'video') {
              spradiovalue = '1';
              radioarr = [{
                name: '本地视频',
                value: '1',
                checked:true,
              },]
              for (let i in photoList) {
                photoList[i].url = that.data.url + photoList[i].url
              }
            }
            if (postInfo.media[0].type == 'qqVideo') {
              spradiovalue = '2'
              radioarr = [{
                name: '腾讯视频',
                value: '2',
                checked: true,
              },]
            }
          }
          console.log(spradiovalue)
          that.setData({
            postInfo: postInfo,
            textareavalue: postInfo.body,
            spradiovalue: spradiovalue,
            radioarr: radioarr,
            lat: postInfo.lat,
            lng: postInfo.lng,
          })
        }
      });
    })
    // app.util.getLocation({
    //   type: "1",
    //   key: "WHOBZ-QV4RQ-GT25S-G5UHI-KXFHJ-YCBGZ",
    //   type: '1',
    //   success: res => {
    //     console.log(res)
    //     that.setData({
    //       lat: res.result.ad_info.location.lat,
    //       lng: res.result.ad_info.location.lng,
    //       address: res.result.address
    //     })
    //   }
    // })
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems
    });
  },
  formSubmit: function(e) {
    let that = this,
      co = this.data,
      v = e.detail.value,
      images = this.data.images,
      videosrc = this.data.videosrc,
      lat = co.lat,
      lng = co.lng,
      contentType = co.postInfo.contentType;
    console.log('form发生了submit事件，携带数据为：', co, co.userinfo, v, images, videosrc, lat, lng, contentType, app.util.testbq(v.label, 3).toString(), app.util.testbq(v.label, 3), app.util.isTelCode(v.tel))
    var upimages = [],
      upvideo = [];
    if (images == null) {
      console.log('没改变images')
      images = JSON.parse(JSON.stringify(co.postInfo.media))
    } else {
      let arr = [],
        arr1 = [];
      for (let i in images) {
        if (images[i].type == null) {
          arr.push(images[i])
        } else {
          arr1.push(images[i])
        }
      }
      images = arr1
      upimages = arr
    }
    if (videosrc == null) {
      console.log('没改变videosrc')
      videosrc = JSON.parse(JSON.stringify(co.postInfo.media))
    } else {
      upvideo = videosrc
    }
    //return
    //校验表单
    let warn = "",
      flag = true;
    if (app.util.isNull(v.textarea)) {
      warn = "请输入发布内容";
    }
    // else if (app.util.isNull(images)&&key=='0') {
    //   warn = "请上传图片";
    // } 
    else if ((app.util.isNull(videosrc) && contentType == '3' && v.spradio == '1')) {
      warn = "请上传视频";
    } else if (videosrc != '' && contentType == '3' && v.spradio == '1' && videosrc.duration > 10) {
      warn = "请上传10秒内的视频";
    } else if (app.util.isNull(v.txsplj) && contentType == '3' && v.spradio == '2') {
      warn = "请粘贴视频链接";
    } else if (app.util.isNull(v.gzhlj) && contentType == '2') {
      warn = "请粘贴公众号文章链接";
    } else if (v.lxr == "") {
      warn = "请输入联系人";
    } else if (!app.util.isTelCode(v.tel)) {
      warn = "请输入有效的联系电话";
    } else if (v.address == "" || lat == '' || lng == '') {
      warn = "请定位并输入地址";
    } else if (v.label != '' && !app.util.testbq(v.label, 3)) {
      warn = "最多输入3个标签";
    } else if (app.util.isNull(v.checkbox)) {
      warn = "请查看用户协议并勾选";
    } else {
      flag = false;
      console.log('images', images, upimages, videosrc, upvideo, that.data.url)
      // return
      // that.setData({
      //   loading: true,
      // })
      // return
      that.setData({
        loading: true
      })
      wx.showLoading({
        title: "正在提交",
        mask: !0
      });
      let imgarr = [],
        video = [],
        gzhlj = '';
      if (contentType == '1') {
        var n = [{
          pic_list: upimages,
          local_list: images,
          uploaded_pic_list: []
        }];
        console.log(n)
        a(0)

        function a(o) {
          if (o == n.length) return e();
          if (!n[o].pic_list.length || 0 == n[o].pic_list.length) return a(o + 1);
          app.api.uploadimg({
            imgarr: n[o].pic_list,
            success: res => {
              console.log(res)
              n[o].uploaded_pic_list = res
              return a(o + 1)
            }
          })
        }
      }
      if (contentType == '3') {
        if (v.spradio == '2') {
          video = [{
            "type": "qqVideo",
            "url": v.txsplj
          }]
          e()
        } else {
          if (upvideo.length == 0) {
            video = videosrc
            e()
          }
          else {
            app.api.uploadvideo({
              videoarr: [videosrc.tempFilePath],
              success: res => {
                console.log(res)
                video = res
                e()
              }
            })
          }
        }
      }
      if (contentType == '2') {
        gzhlj = v.gzhlj
        e()
      }

      function e() {
        console.log('请求接口',imgarr, video, JSON.stringify(video), gzhlj)
        let root = that.data.url;
        if (contentType == '1') {
          imgarr = n[0].local_list.concat(n[0].uploaded_pic_list);
          for (let i in imgarr) {
            if (imgarr[i].url.indexOf(root) != -1) {
              imgarr[i].url = imgarr[i].url.substring(root.length);
            }
          }
          console.log('请求接口', n, imgarr, root)
        }
        if (contentType == '3') {
          for (let i in video) {
            if (video[i].url.indexOf(root) != -1) {
              video[i].url = video[i].url.substring(root.length);
            }
          }
          console.log('请求接口', video, root, contentType == '1' ? JSON.stringify(imgarr) : JSON.stringify(video))
        }
        console.log('media', contentType == '1' ? JSON.stringify(imgarr) : JSON.stringify(video))
        //return
        //add
        app.api.request({
          'url': app.url.postAdd,
          'cachetime': '0',
          'method': 'POST',
          data: {
            contentType: contentType,
            postId: co.postInfo.postId,
            body: v.textarea.replace("\n", "↵"),
            media: contentType == '1' ? JSON.stringify(imgarr) : JSON.stringify(video),
            wechatUrl: gzhlj,
            linkMan: v.lxr,
            linkTel: v.tel,
            tag: app.util.testbq(v.label, 3).toString(),
            userId: co.userinfo.id,
          },
          success: function(res) {
            if (res.data.code == '1') {
              wx.hideLoading()
              wx.showToast({
                title: '发布成功',
                mask: 1,
              })
              setTimeout(function() {
                wx.reLaunch({
                  url: '/pages/personal/index',
                })
              }, 1000)
            } else {
              wx.hideLoading()
              that.setData({
                loading: false
              })
              wx.showToast({
                title: '请重试',
                duration: 1000,
              })
            }
            console.log('add', res.data)
          }
        });
      }
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  payreturn(e) {
    console.log(e.detail)
    if (e.detail == '1') {
      wx.redirectTo({
        url: 'postsuccess?postId=' + this.data.postId,
      })
    }
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})