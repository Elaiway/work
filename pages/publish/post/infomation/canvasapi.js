function findBreakPoint(text, width, context) {
    var min = 0;
    var max = text.length - 1;
    while (min <= max) {
        var middle = Math.floor((min + max) / 2);
        var middleWidth = context.measureText(text.substr(0, middle)).width;
        var oneCharWiderThanMiddleWidth = context.measureText(text.substr(0, middle + 1)).width;
        if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
            return middle;
        }
        if (middleWidth < width) {
            min = middle + 1;
        } else {
            max = middle - 1;
        }
    }

    return -1;
}
// 文字自动换行（包括换行符）
function breakLinesForCanvas(context, text, width, font) {
    var result = [];
    if (font) {
        context.font = font;
    }
    var textArray = text.split('\n');
    for (let i = 0; i < textArray.length; i++) {
        let item = textArray[i];
        var breakPoint = 0;
        while ((breakPoint = findBreakPoint(item, width, context)) !== -1) {
            result.push(item.substr(0, breakPoint));
            item = item.substr(breakPoint);
        }
        if (item) {
            result.push(item);
        }
    }
    return result;
}
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        info: {},
        imgs: [
            {
            url:"http://a.vpimg3.com/upload/merchandise/pdcvis/105073/2018/0309/17/5133961e-0764-4c91-809c-fc73791e4fc6.jpg"
            },
            {
                url: "http:////a.vpimg3.com/upload/merchandise/pdcvis/105073/2018/0309/26/0db768b6-9259-4f5d-989b-5b8b54320419.jpg"
            },
            {
                url: "http:////a.vpimg3.com/upload/merchandise/pdcvis/105073/2018/0309/13/7a0e3357-ccbd-4923-94f7-518985ead4d0.jpg"
            },
            {
                url: "http://a.vpimg3.com/upload/merchandise/pdcvis/105073/2018/0309/43/2b2585fc-8e9c-498d-9890-b12b2ecbfcf9.jpg"
            },
            {
                url: "http:////a.vpimg3.com/upload/merchandise/pdcvis/105073/2018/0309/91/67434757-ffd6-4fde-bdd6-76fdf5ce751d.jpg"
            },
            {
                url:"http:////a.vpimg3.com/upload/merchandise/pdcvis/105073/2018/0309/171/0248df27-b0d2-4647-8419-752ec0e3259e.jpg"
            },
            {
                url: "http:////a.vpimg3.com/upload/merchandise/pdcvis/105073/2018/0309/145/47af8295-6630-415c-bc67-0c5d51caf541.jpg"
            },
            {
                url: "http:////a.vpimg3.com/upload/merchandise/pdcvis/105073/2018/0309/6/bc2edb40-2976-407d-9a9a-3e387b8b988f.jpg"
            },
            {
                url: "http:////a.vpimg3.com/upload/merchandise/pdcvis/105073/2018/0309/40/19bf7573-db9b-46b1-aaf0-9320fcb39037.jpg"
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        app.setNavigationBarColor(that);
        app.pageOnLoad(that);
        app.setNavigationBarTitle('海报')
        let id = options.id;
        console.log("当前帖子的id",id)
        let info = {
            "title": "asdasd啊啊啊asdasd啊啊啊asdasd啊啊啊asdasd啊啊啊asdasd啊啊啊",
            "intro": "双十一如同一场狂欢节，狂欢节过后的街道，通常是一片狼藉。\n而这场电商的狂欢风光无限的背后，无数快递包裹造成的上万吨的垃圾也让人不禁要问：\n真的所有购物都非要网购解决吗？\n还记得2009年的第一届“双11”吗？那一年电商还没有现在这么火爆，天猫的交易额仅5000万。\n今年是阿里巴巴推出“双11”的第10年，2018年天猫双十一物流订单于23点18分09秒突破10亿。\n10亿的物流量相当于中国2006年全年的快递业务量，也相当于美国20天的包裹量、英国4个月的包裹量。\n11月11日，早已不再是所谓的“光棍节”，它变成了一场全民的购物狂欢，我们讨论着今年的优惠力度怎么样，抢到了什么超级优惠的宝贝。\n这种氛围下，不买点什么都感觉对不起自己辛辛苦苦赚的工资。\n但是，在我们疯狂剁手坐等收快递时，一个大麻烦也正在降临。\n可以想像这样一幕：终于等来了双11剁手买的宝贝。\n你欢欢喜喜拆开层层包裹的快递，不由得感叹卖家的贴心，于是在x宝点了五星好评，评价栏里写着“商家包装很用心！胶带缠了好多层！宝贝完好无损，看着就很高大上！”\n然后把一堆缠满了胶带的纸盒以及包装塑料袋一起塞进楼下垃圾桶，细心的人可能会给垃圾分个类。\n这一系列操作行云流水，我们没觉得有什么问题。\n其实，这里面问题大了。\n国家邮政局统计数据显示：2016年中国快递业务量首次突破312亿件，相当于年人均快递使用量近23件。\n2015年中国消耗了99.22亿个包装箱、169.85亿米胶带以及82.68亿个塑料袋。其中胶带的长度可绕地球赤道425圈。\n如果按照每个包装箱0.2公斤估算，这些快递就会产生包装垃圾400多万吨。"
        };
        that.setData({
            info
        });
        // 获取当前设备的可用宽高
        wx.getSystemInfo({
            success: res => {
                var Rpx = (res.windowWidth / 375).toFixed(2)
                var width = res.windowWidth
                var imgs = that.data.imgs
                wx.showLoading({
                    title: '正在生成图片',
                    mark:!0
                })
                that.getImgsHeight({
                    imgs: imgs,
                    width: width
                })
                that.setData({
                    width: width,
                    Rpx: Rpx
                })
            }
        })
    },
    canvasIdErrorCallback: function(e) {
        console.error(e.detail.errMsg)
    },
    // 根据当前设备的宽高比计算图片数组中每张图片的宽高
    getImgsHeight: function(data) {
        var that = this,
            i = data.i ? data.i : 0,
            success = data.success ? data.success : 0,
            fail = data.fail ? data.fail : 0;
        wx.downloadFile({
            url: data.imgs[i].url,
            success(res) {
                if (res.statusCode === 200) {
                    console.log(data.imgs[i].url)
                    data.imgs[i].url = res.tempFilePath
                    wx.getImageInfo({
                        src: data.imgs[i].url,
                        success: (res) => {
                            // 计算图片的宽高比方便计算宽高
                            var Proportion = (res.height / res.width).toFixed(2)
                            // 计算图片的宽度
                            data.imgs[i].width = Number((data.width - 40).toFixed(0))
                            // 计算图片的高度
                            data.imgs[i].height = Number(((data.width - 40) * Proportion).toFixed(0))
                        },
                        fail: (res) => {
                            fail++;
                        },
                        complete: () => {
                            i++;
                            if (i == data.imgs.length) {
                                console.log("图片宽高已经计算完成可以进行下一步去生成图片", data.imgs)
                                that.setData({
                                    imgs: data.imgs
                                })
                                // 计算正文与标题的高度输入canvas的动态高度
                                that.changeCanvasBackground(data.imgs)
                            } else {
                                data.i = i;
                                data.success = success;
                                data.fail = fail;
                                that.getImgsHeight(data);
                            }

                        }
                    });
                }
            }
        })
    },
    // 计算总行高
    changeCanvasBackground(imgs) {
        var imgHeight = 0
        // 计算图片所占的总高度
        for (let i in imgs) {
            imgHeight += (imgs[i].height)
        }
        var res = wx.getSystemInfoSync();
        var canvasWidth = res.windowWidth;
        // 获取canvas的的宽  自适应宽（设备宽/750) px
        var Rpx = (canvasWidth / 375).toFixed(2);
        //画布高度 -底部按钮高度
        var canvasHeight = this.data.height;
        // 使用 wx.createContext 获取绘图上下文 context
        var context = wx.createCanvasContext('secondCanvas')
        //设置行高
        var lineHeight = Rpx * 30;
        //左边距
        var paddingLeft = Rpx * 20;
        //右边距
        var paddingRight = Rpx * 20;
        //当前行高
        var currentLineHeight = Rpx * 20;
        // 获取标题高度
        var resultTitle = breakLinesForCanvas(context, this.data.info.title, canvasWidth - paddingLeft - paddingRight, `${(Rpx * 20).toFixed(0)}px PingFangSC-Regular`);
        resultTitle.forEach(function (line, index) {
            currentLineHeight += Rpx * 30;
            context.fillText(line, paddingLeft, currentLineHeight);
        });
        let height_0 = currentLineHeight
        console.log('标题高度', currentLineHeight)
        // 获取正文文字高度
        var result = breakLinesForCanvas(context, this.data.info.intro || '无内容', canvasWidth - paddingLeft - paddingRight, `${(Rpx * 16).toFixed(0)}px PingFangSC-Regular`);
        result.forEach(function (line, index) {
            currentLineHeight += Rpx * 30;
            context.fillText(line, paddingLeft, currentLineHeight)
        })
        console.log('正文文字高度', currentLineHeight)
        var height = currentLineHeight + height_0 + imgHeight
        this.setData({
            height: height
        })
        // 总高度计算出来后开始绘制canvas
        this.drawInit(this.data.info, height);
    },
    /**
     * 绘制图片
     */
    drawInit: function(info, height) {
        var contentTitle = info.title;
        var contentStr = info.intro;
        var that = this
        var res = wx.getSystemInfoSync();
        var canvasWidth = res.windowWidth;
        var Rpx = that.data.Rpx
        // 当前的
        var imgs = that.data.imgs
        //画布高度 -底部按钮高度
        var canvasHeight = height;
        // 使用 wx.createContext 获取绘图上下文 context
        var context = wx.createCanvasContext('secondCanvas')
        //设置行高
        var lineHeight = Rpx * 30;
        //左边距
        var paddingLeft = Rpx * 20;
        //右边距
        var paddingRight = Rpx * 20;
        //当前行高
        var currentLineHeight = Rpx * 20;
        //背景颜色默认填充
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvasWidth + Rpx * 2, canvasHeight);
        //标题内容颜色默认
        context.fillStyle = "#fff";
        //高度减去 图片高度
        context.fillRect(Rpx * 15, Rpx * 15, canvasWidth - Rpx * 30, canvasHeight);
        //设置标题
        var resultTitle = breakLinesForCanvas(context, contentTitle, canvasWidth - paddingLeft - paddingRight, `${(Rpx * 20).toFixed(0)}px PingFangSC-Regular`);
        //字体颜色
        context.fillStyle = '#000000';
        resultTitle.forEach(function(line, index) {
            currentLineHeight += Rpx * 30;
            context.fillText(line, paddingLeft, currentLineHeight);
        });
        //画分割线
        currentLineHeight += Rpx * 15;
        context.setLineDash([Rpx * 6, Rpx * 3.75]);
        context.moveTo(paddingLeft, currentLineHeight);
        context.lineTo(canvasWidth - paddingRight, currentLineHeight);
        context.strokeStyle = '#cccccc';
        context.stroke();
        //设置内容
        var result = breakLinesForCanvas(context, contentStr || '无内容', canvasWidth - paddingLeft - paddingRight, `${(Rpx * 16).toFixed(0)}px PingFangSC-Regular`);
        //字体颜色
        context.fillStyle = '#666666'
        result.forEach(function(line, index) {
            currentLineHeight += Rpx * 30;
            context.fillText(line, paddingLeft, currentLineHeight)
        })
        currentLineHeight = currentLineHeight+20
        for (let i in imgs) {
            if(i>0){
                currentLineHeight += (Number(imgs[i-1].height))
            }
            context.drawImage(imgs[i].url, 20, currentLineHeight, imgs[i].width, imgs[i].height)
        }
        context.draw()
        // canvas渲染成功之后立即执行保存图片到本地的步骤会保存失败 中间必须有个缓冲的时间  目前设定为0.2秒
        setTimeout(function () {
            that.savePoster()
        },200)
    },
    // 为避免真机canvas已经渲染出来但是页面空白问题 采用渲染成功再保存图片到本地并展示到页面
    savePoster(e){
        var that = this;
        wx.canvasToTempFilePath({
            canvasId: 'secondCanvas',
            fileType: 'jpg',
            success: function (res) {
                wx.hideLoading()
                that.setData({
                    poster: res.tempFilePath
                })
            }
        })
    },
    // 保存图片
    saveImg: function() {
        var that = this;
        wx.saveImageToPhotosAlbum({
            filePath: that.data.poster,
            success: function (res) {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: function (res) {
                wx.hideLoading()
                console.log(res)
            }
        })
    }

})