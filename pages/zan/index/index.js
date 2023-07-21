// pages/message/reward/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
    showModalStatus: false,
    billStatus: false,

    imgHead:"",
    imgProduct:"",
    imgCode:"",
    name:"",
    intro:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   contact:app.system.contactCode
    // })
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      var arrPara = scene.split("&");
      var arr = [];
      for (var i in arrPara) {
        arr = arrPara[i].split("=");
        wx.setStorageSync(arr[0],arr[1]);
      }
      this.setData({
        postId:arr[1]
      })
      this.setData({
        shareId: arr[2]
      })
      this.setData({
        isShare:arr[3]
      })
    } else {
      this.setData({
        isShare: options.isShare
      })
      this.setData({
        postId: options.postId
      })
      this.setData({
        shareId:  options.shareId
      })
    }
    app.setNavigationBarColor(this, () => {
      this.getDetail()
    });
    


  },
  onReady: function () {

  },
  // 绘制海报
  drawBill() {
    const ctx = wx.createCanvasContext('myCanvas')
    // 背景
    ctx.fillStyle = '#FFf';
    ctx.fillRect(0, 0, 320, 660);
    //产品图
    ctx.drawImage(this.data.imgProduct, 20, 200, 280, 220)
    //二维码
    ctx.drawImage(this.data.codeImage, 220, 40, 80, 80);
    // 店名
    ctx.font = "16px bold 黑体";
    ctx.fillStyle = "#333";
    ctx.fillText(this.data.details.storeName, 65, 50);
    // 我是门店介绍信息
    ctx.font = "12px bold 黑体";
    ctx.fillStyle = "#666";
    // ctx.fillText("我是门店结束信息",18, 90);
    var drawcontent = this.data.details.describe
    this.drawText(ctx, drawcontent, 18, 90, 100, 150);
    // 头像
    let avatarurl_width = 40,
      avatarurl_heigth = 40,
      avatarurl_x = 18,
      avatarurl_y = 26;
    ctx.beginPath();
    ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.drawImage(this.data.imgHead, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
    ctx.draw()

    //打开海报canvas
    this.setData({
      showModalStatus: false,
    })
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: res=> {
        this.setData({
          canvasToTempFilePath: res.tempFilePath, // 返回的图片地址保存到一个全局变量里
          billStatus: true
        })
        wx.showToast({
          title: '绘制成功',
        })
      },
    })



  },
  closeBill() {
    this.setData({
      billStatus: false,
    })
  },
  openBill() {
    this.drawBill()
  },
  drawCode() {
    var that = this
    if (that.data.isShare == undefined) {
      var params = {
        scene: that.data.postId,
        pages: "pages/zan/index/index",
        type: 2
      }
    } else {
      var params = {
        scene:that.data.postId +','+ that.data.shareId+','+1,
        pages: "pages/zan/index/index",
        type: 2

      }
    }
    app.api.prequest({
      'url': app.url.commongetCodeImg,
      data: params,
      'method': 'get',
    }).then(res => {
      if (res.code == 1) {
        wx.getImageInfo({
          // src:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1600428283057&di=818bb3b864471a618d8253dcaaeb3061&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F36%2F48%2F19300001357258133412489354717.jpg",
          src:res.data,
          success: res => {
            console.log(res.path)
            that.setData({
              codeImage: res.path
            })
           
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          duration: 2000
        })
      }

    })



  },
  //限制canvas文字换行
  drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引 
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分                
        initHeight += 25; //16为字体的高度                
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分                
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    } // 标题border-bottom 线距顶部距离        
    titleHeight = titleHeight + 10;
    return titleHeight
  },
  //生成海报
  submit() {
    var that = this
    // 获取用户是否开启用户授权相册
    var openStatus = true
    that.getShera()
    if (!openStatus) {
      wx.openSetting({
        success: (result) => {
          if (result) {
            if (result.authSetting["scope.writePhotosAlbum"] === true) {
              openStatus = true;
              wx.saveImageToPhotosAlbum({
                filePath: that.data.canvasToTempFilePath,
                success() {
                  that.setData({
                    showShareImg: false
                  })
                  wx.showToast({
                    title: '图片保存成功，快去分享到朋友圈吧~',
                    icon: 'none',
                    duration: 2000
                  })
                },
                fail() {
                  wx.showToast({
                    title: '保存失败1',
                    icon: 'none'
                  })
                }
              })
            }
          }
        },
        fail: () => {},
        complete: () => {}
      });
    } else {
      wx.getSetting({
        success(res) {
          // 如果没有则获取授权
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                openStatus = true
                wx.saveImageToPhotosAlbum({
                  filePath: that.data.canvasToTempFilePath,
                  success() {
                    that.setData({
                      showShareImg: false
                    })
                    wx.showToast({
                      title: '图片保存成功，快去分享到朋友圈吧~',
                      icon: 'none',
                      duration: 2000
                    })
                  },
                  fail() {
                    wx.showToast({
                      title: '保存失败2',
                      icon: 'none'
                    })
                  }
                })
              },
              fail() {
                // 如果用户拒绝过或没有授权，则再次打开授权窗口
                openStatus = false
                console.log('请设置允许访问相册')
                wx.showToast({
                  title: '请设置允许访问相册',
                  icon: 'none'
                })
              }
            })
          } else {
            // 有则直接保存
            openStatus = true
            wx.saveImageToPhotosAlbum({
              filePath: that.data.canvasToTempFilePath,
              success() {
                that.setData({
                  showShareImg: false
                })
                wx.showToast({
                  title: '图片保存成功，快去分享到朋友圈吧~',
                  icon: 'none',
                  duration: 2000
                })
              },
              fail() {
                wx.showToast({
                  title: '保存失败3',
                  icon: 'none'
                })
              }
            })
          }
        },
        fail(err) {
          console.log(err)
        }
      })
    }
  },
  //前往集赞榜
  toBillboard(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/zan/billboard/index?postId=' + this.data.postId,
    })
  },
  toPublish(){
    wx.navigateTo({
      url: '/pages/zan/publish/index'
    })
  },
  //前往客服
  tokefu(){
    wx.navigateTo({
      url: '/pages/personal/service',
    })
  },
  //前往兑换页面
  toAward(e) {
    if(this.data.details.receive ==1){
      wx.showToast({
        title: '已完成核销',
        duration: 2000
      })
      return false
    }

    // -------------------------------------
    var params = {
      postId: this.data.details.id
    }
    app.api.prequest({
      'url': app.urlTwo.duihuan,
      data: params,
      'method': 'post',
    }).then(res => {
      if (res.code == 1) {
        wx.navigateTo({
          url: '/pages/zan/award/index?id=' + res.data,
        })
      } else {
        wx.showToast({
          title: res.msg,
          duration: 2000
        })
      }
    })













   
  },
  //
  toMarket(){
    wx.navigateTo({
      url: '/pages/store/storemain/storedetail?id=' + this.data.details.storeId
    })
  },
  toNewMarket(e){
    wx.navigateTo({
      url: '/pages/mall/storemall?id=' + e.currentTarget.dataset.id
    })
  },
  //
  toProduct(){
    wx.navigateTo({
      url: '/pages/mall/storemall?id=' + this.data.details.storeId,
    })
  },
  //抽屉
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    console.log(e.currentTarget)
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭抽屉
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
  //转发
  onShareAppMessage: function (res) {
    this.getShera()
    if (res.from === 'button') {}
    return {
      title: '转发',
      path: '/pages/zan/index/index?postId=' + this.data.postId + '&shareId=' + wx.getStorageSync('users').id + "&isShare=1",
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
  //点赞
  zan() {
    if (this.data.isShare == undefined) {
      var params = {
        postId: this.data.postId,
      }
    } else {
      var params = {
        postId: this.data.postId,
        shareId: this.data.shareId
      }
    }
    app.api.prequest({
      'url': app.urlTwo.dianzan,
      data: params,
      'method': 'post',
    }).then(res => {
      if (res.code == 1) {
        wx.showToast({
          title: res.msg,
          duration: 2000
        })
        this.getDetail()
      } else {
        wx.showToast({
          title: res.msg,
          duration: 2000
        })
      }

    })
  },
  //获取详情
  getDetail() {
    this.setData({
      loadingHidden:false
    })
    var params = {
      id: this.data.postId
    }
    app.api.prequest({
      'url': app.urlTwo.zandetail,
      data: params,
      'method': 'get',
    }).then(res => {
      if (res.code == 1) {
        res.data.media = app.util.getTypeImgsUrl(res.data.media)
        res.data.storeLogo = app.util.getImgUrl(res.data.storeLogo)
        // res.data.adStoreLogo = app.util.getImgUrl(res.data.adStoreLogo)

        res.data.startTime = app.util.ormatDate(res.data.startTime).substring(0, 16)
        for(var i=0 ;i<res.data.storeGoods.length;i++){
          res.data.storeGoods[i].showImgs = app.util.getTypeImgsUrl(res.data.storeGoods[i].showImgs)
        }
        for(var i=0 ;i<res.data.adData.length;i++){
          res.data.adData[i].icon = app.util.getTypeImgsUrl(res.data.adData[i].icon)
        }
        // for(var i=0 ;i<res.data.adStoreGoods.length;i++){
        //   res.data.adStoreGoods[i].showImgs = app.util.getTypeImgsUrl(res.data.adStoreGoods[i].showImgs)
        // }
        console.log(res.data)
        wx.getImageInfo({
          src:res.data.storeLogo,
          success: res => {
            console.log(res.path)
            this.setData({
              imgHead: res.path
            })
          }
        })
        wx.getImageInfo({
          src:res.data.media[0].url,
          success: res => {
            console.log(res.path)
            this.setData({
              imgProduct: res.path
            })
          }
        })
        this.drawCode()
        this.setData({
          details: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          duration: 2000
        })
      }
      this.setData({
        loadingHidden:true
      })
    
    })
  },
  //用户收藏操作 
  collection_store(e) {
    console.log(e)
    var that = this
    if(e.target.dataset.type==1){
   
    }
    wx.showLoading({
      title: "",
      mask: !0
    })
    app.api.request({
      url: app.url.collection_post,
      method: "POST",
      data: {
        postId:e.target.dataset.type==1?that.data.details.storeId:that.data.details.adStoreId,
        userId: wx.getStorageSync('users').id,
        type: 2,
      },
      success: res => {
        if (res.data.data.status == '1') {
          app.util.getShowtoast('关注成功')
          
        } else {
          app.util.getShowtoast('取消关注')
        }
        that.getDetail()
      }
    })
  },
  //分享
  getShera(){
    console.log(this.data.details.id)
    app.api.prequest({
      url: app.urlTwo.zanshera,
      method: "get",
      data: {
        postId:this.data.details.id
      },
      success: res => {
      }
    })
  }

})