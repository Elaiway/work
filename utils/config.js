var config = {
  layout: '/city/api/drag/layout', //layout
  defaultZone: '/city/api/post/default_zone', //
  system: '/city/api/config/system', //system
  post_list: '/city/api/post/post_list', //post_list
  store_list: '/city/api/business/index', //strore_list
  user_storelist: '/city/api/user/store_list', //我的商家列表
  set_store: '/city/api/user/set_store', //设置默认店铺
  post_config: '/city/api/config/post', //post_config
  store_config: '/city/api/config/store', //store_config
  store_meal: '/city/api/business/setmeal', //store_meal
  bind: "/city/api/login/bind", //绑定手机号
  send: "/city/api/user/send_msg", //发送短信
  my_collection: "/city/api/user/my_collection", //我的收藏
  collection_post: "/city/api/post/collection_post", //所有的收藏接口
  visitorList: "/city/api/own/visitorList", //个人主页访客接口
  own_info: "/city/api/own/info", //个人主页 个人信息接口
  userStore: "/city/api/drag/store", //用户的店铺
  user_post: "/city/api/user/post", //我的发布
  announceList: "/city/api/Information/announceList", //公告
  statistic: "/city/api/statistic/index", //统计数据
  postStatistic: "/city/api/statistic/post", //信息统计
  storeStatistic: "/city/api/statistic/store", //商家统计
  adList: "/city/api/Information/adList", //轮播图
  footNav: "/city/api/drag/nav", //底部导航
  bussiness: "/city/api/business/index", //商家列表
  top: "/city/api/post/top", //置顶列表
  comment: "/city/api/post/comment", //提交评论
  inforcomment: "/city/api/information/comment", //资讯评论
  collection: "/city/api/post/collection", //查看用户是否收藏信息
  postIndex: "/city/api/post/index", //信息详情
  commentList: "/city/api/post/post_comment_list", //全部评论
  praise: "/city/api/post/praise", //信息点赞
  pay: '/city/api/common/pay', //帖子支付
  postFreePost: '/city/api/post/free_post ', //会员免费发帖查询
  postFreeRefresh: '/city/api/post/free_refresh', //查看会员免费刷新次数
  postFreeLook: '/city/api/post/free_look', //**************/查看帖子免费查看电话收费
  help: "/city/api/config/help", //帮助中心
  share: "/city/api/post/share", //分享
  topPay: '/city/api/common/post_top_pay', //置顶支付
  postRefresh: '/city/api/common/post_refresh_pay', //刷新
  open: "/city/api/post/open", //已开通城市
  getZone: "/city/api/user/get_zone", //分类区域
  commentDetails: "/city/api/post/common_details", //评论详情
  category: "/city/api/post/category", //资讯分类
  infomation: "/city/api/information/index", //资讯首页
  infomationInfo: "/city/api/information/info", //资讯详情
  zxReward: '/city/api/information/reward', //打赏金额
  infomation_config: "/city/api/Config/information", //资讯设置
  rewardPay: '/city/api/common/info_reward_pay', //资讯支付
  store_renew: '/city/api/business/store_renew', //店铺续费
  renew_pay: '/city/api/common/renew_pay', //续费支付
  businessRank: "/city/api/business/store_rank", //口碑商家
  configRank: "/city/api/config/store_rank", //口碑商家排行配置
  bussinessInfo: "/city/api/business/info", //商家详情
  getTrade: '/city/api/business/get_trade', //商圈
  cateGory: '/city/api/post/category', //商家分类
  release_page: '/city/api/post/release_page', //发布集合
  bussinessAdd: '/city/api/business/add', //商家编辑
  postTopAdd: '/city/api/post/post_top_add', //直接置顶
  postAdd: "/city/api/post/add", //信息发布与配置
  postTodayNum: "/city/api/post/today_post_count", //今日发布信息数量
  businessIndex: "/city/api/Business/search", //商家搜索
  setmeal: "/city/api/business/setmeal", //入驻套餐
  storePay: '/city/api/common/store_pay', //商家入驻支付
  postEnd: "/city/api/post/end", //结束信息
  destroy: "/city/api/post/destroy", //删除信息
  payConfig: "/city/api/Config/pay", //支付设置
  storeShare: "/city/api/business/share", //商家分享
  userInfo: "/city/api/user/info", //用户信息
  editUser: "/city/api/user/edit_user", //修改个人信息
  mystatistics: '/city/api/user/my_statistics', //数据统计
  redList: "/city/api/post/red_list", //redpaper明细
  receiveRed: "/city/api/post/bonus", //领取redpaper 
  lookPay: "/city/api/common/look_pay", //付费查看帖子
  saveAddress: '/city/api/user/save_address', //保存地址
  delAddress: '/city/api/user/del_address', //删除地址
  setDefault: '/city/api/user/set_default', //默认地址
  myAddress: '/city/api/user/my_address', //地址列表
  addressInfo: '/city/api/user/address_info', //地址详情
  identAdd: '/city/api/ident/add', //认证
  identSet: '/city/api/ident/attestation', //认证设置
  isAstation: '/city/api/ident/is_attestation', //校验认证
  myAuth: '/city/api/user/my_auth', //查看用户/商家认证信息
  myEnsure: '/city/api/user/my_ensure', //查看用户/商家保证金信息
  saveBond: '/city/api/bill/save_bond', //保证金提交
  bondPay: '/city/api/common/bond_pay', //保证金支付
  refundBond: '/city/api/bill/refund_bond', //保证金退换
  billSite: '/city/api/bill/site', //充值配置
  balancePay: '/city/api/common/balance_pay', //
  balanceList: '/city/api/bill/balance_list', //明细列表
  integralList: '/city/api/bill/integral_list', //明细列表
  increvisit: '/city/api/statistic/increase_visit', //
  applycash: '/city/api/bill/apply_cash',
  cashlist: '/city/api/bill/cash_list',
  cashinfo: '/city/api/bill/cash_info',
  yellowConfig: '/city/api/config/yellow_page',
  yellowStic: '/city/api/yellow_page/statistics',
  yellowList: '/city/api/yellow_page/list',
  yellowCall: '/city/api/yellow_page/call',
  yellowCollect: '/city/api/user/my_collection',
  yellowIssue: '/city/api/yellow_page/my_list',
  yellowInfo: '/city/api/yellow_page/info',
  yellowPre: '/city/api/yellow_page/presentation',
  yellowPrePay: '/city/api/common/yellow_presentation_pay',//黄页认领
  yellowMeal: '/city/api/yellow_page/setmeal',
  yellowAdd: '/city/api/yellow_page/add',
  yellowPay: '/city/api/common/yellow_pay',//黄页入驻支付
  yellowShow: '/city/api/yellow_page/show',
  task: '/city/api/integral/task', //任务中心
  myToady: '/city/api/integral/my_toady', //今日积分
  integralCategory: '/city/api/integral/category', //积分分类
  goodsList: '/city/api/integral/goods_list', //商品列表  
  moreComment:'/city/api/shop/more_comment',//更多评论
  goodsinfo: '/city/api/integral/goods_info', //商品详情 
  integral: '/city/api/config/integral', //积分商城设置
  integralPay: '/city/api/common/integral_pay', //积分兑换支付
  saveOrder: '/city/api/integral/save_order', //下单
  myRecord: '/city/api/integral/my_record', //我的兑换订单
  orderInfo: '/city/api/integral/order_info', //订单详情
  orderCon: '/city/api/integral/order_confirm', //核销订单
  query: '/city/api/integral/query', //确认收货
  integralRecord: '/city/api/integral/integral_record', //积分明细
  signRule: '/city/api/integral/sign_rule', //签到规则
  isRepair: '/city/api/integral/is_repair', //查看是否需要补签
  weekSignRecord: '/city/api/integral/week_sign_record', //查看本周签到记录
  signIn: '/city/api/integral/sign', //签到
  repairIn: '/city/api/integral/repair', //补签
  signRecord: '/city/api/integral/sign_record', //签到记录
  signRank: '/city/api/integral/sign_rank', //签到榜单
  freeCategory: '/city/api/car/category', //顺风车分类
  freeCategoryLab: '/city/api/car/category_label', //分类下的标签
  freeCategoryInfo: '/city/api/car/categoryInfo', //分类详情
  freeTime: '/city/api/car/time_set', //时间段
  freeCarList: '/city/api/car/car_list', //顺风车列表
  freeCarInfo: '/city/api/car/car_info', //顺风车详情
  freeCarTop: '/city/api/car/top', //顺风车置顶信息
  freeCarSet: '/city/api/config/car', //顺风车设置
  freeCarPay: '/city/api/common/car_pay', //顺风车支付
  freeShare: '/city/api/car/share', //分享
  freeMyList: '/city/api/car/my_list', //我的顺风车
  freeStatistics: '/city/api/car/statistics', //顺风车统计
  freeSaveCar: '/city/api/car/save_car', //发布顺风车
  freeCarCarTop: '/city/api/car/car_top', //顺风车置顶
  freeComCarTop: '/city/api/common/car_top', //顺风车置顶支付
  freeCarRefresh: '/city/api/common/car_refresh_pay', //顺风车刷新
  freeDisplay: '/city/api/car/display', //顺风车上架下架
  freeCarDel: '/city/api/car/del', //顺风车删除
  jobSet: '/city/api/config/job',//求职招聘配置
  jobStatistic: '/city/api/job/job_statistic',//求职招聘首页统计
  jobCategory: '/city/api/job/category',//分类
  jobCategoryLabel: '/city/api/job/category_label',//分类下的标签
  jobPosition: '/city/api/job/position',//职位列表
  jobList: '/city/api/job/job_list',//求职列表
  jobRecruitList: '/city/api/job/recruit_list',//招聘列表
  recruitInfo: '/city/api/job/recruit_info',//招聘详情
  jobInfo: '/city/api/job/job_info',//求职详情
  jobCollection: '/city/api/job/my_collection',//求职我的收藏
  jobmyResume: '/city/api/job/my_resume',//我的求职简历
  jobmyRecruit: '/city/api/job/my_recruit',//我的招聘
  jobrecruitResume: '/city/api/job/recruit_resume',//招聘收到的简历
  jobDeliver: '/city/api/job/deliver',//投递简历
  jobSaveRecruit: '/city/api/job/save_recruit',//发布招聘
  jobRecruitPay: '/city/api/common/recruit_pay',//发布招聘支付
  jobSaveJob: '/city/api/job/save_job',//发布求职
  jobJobPay: '/city/api/common/job_pay',//发布求职支付
  jobTop: '/city/api/job/top',//置顶套餐
  jobTopPay: '/city/api/common/job_top_pay',//置顶套餐支付
  jobRefreshPay: '/city/api/common/job_refresh_pay',//求职刷新支付
  jobDelete: '/city/api/job/delete',//求职招聘删除
  jobSaveExperience: '/city/api/job/save_experience',//求职招聘保存工作/学习经历
  housStatistics: '/city/api/renting/statistics',//**************租房统计
  housRenting: '/city/api/config/renting',//租房设置
  housCategory: '/city/api/renting/category',//租房分类
  housHot: '/city/api/renting/hot',//热门楼盘
  housRentingList: '/city/api/renting/renting_list',//租房列表
  housRentingInfo: '/city/api/renting/renting_info',//租房列表详情
  housMyList: '/city/api/renting/my_list',//我的发布
  housNewList: '/city/api/renting/new',//最新发布
  housSaveRenting: '/city/api/renting/save_renting',//发布租房
  housRentingPay: '/city/api/common/renting_pay',//租房支付
  housCategoryInfo: '/city/api/renting/category_info',//分类详情
  housSaveSell: '/city/api/sell/save_sell',//发布售房
  housRentingTop: '/city/api/renting/top',//置顶信息
  housRentingrentintTop: '/city/api/renting/renting_top',//租房置顶
  houscommonRentintTop: '/city/api/common/renting_top',//置顶支付
  housRefreshPay: '/city/api/common/renting_refresh_pay',//租房刷新支付
  housDisplay: '/city/api/renting/display',//租房上下架
  housRentingDel: '/city/api/renting/del',//租房删除
  activitySet: '/city/api/config/activity',//**************活动设置
  activityCategory: '/city/api/activity/category',//活动分类
  activityList: '/city/api/activity/activity_list',//活动列表
  activityInfo: '/city/api/activity/activity_info',//活动详情
  activityEnrollInfo: '/city/api/activity/info',//报名表单
  activitySaveEnroll: '/city/api/activity/save_enroll',//活动报名
  activityEnrollPay: '/city/api/common/enroll_pay',//活动报名支付
  activityEnrollList: '/city/api/activity/enroll_list',//报名列表
  activityCancelEnroll: '/city/api/activity/cancel_enroll',//取消报名
  activityEnrollDetail: '/city/api/activity/enroll_info',//取消报名
  activityGetCode: '/city/api/activity/get_code',//显示二维码
  activityVerification: '/city/api/activity/verification',//扫码核销
  businesscardSet: '/city/api/config/super_card',//名片设置
  businesscardList: '/city/api/super_card/card_list',//名片列表
  businesscardInfo: '/city/api/super_card/card_info',//名片详情
  businesscardMyList: '/city/api/super_card/my_list',//我的名片
  categoryFull: '/city/api/category/full',//获取全量数据
  businesscardSetmeal: '/city/api/super_card/setmeal',//名片套餐
  businesscardSaveCard: '/city/api/super_card/save_card',//发布名片
  businesscardCardPay: '/city/api/common/super_card_pay',//名片支付
  businesscardCardTop: '/city/api/super_card/top',//名片置顶信息
  businesscardCardIsTop: '/city/api/super_card/card_top',//名片置顶
  businesscardCardTopPay: '/city/api/common/card_top_pay',//名片置顶支付
  businesscardStoreRenew: '/city/api/super_card/store_renew',//名片续费
  couponSet: '/city/api/config/coupon',//优惠券设置
  couponList: '/city/api/coupons/coupon_list',//优惠券列表
  couponInfo: '/city/api/coupons/coupon_info',//优惠券详情
  couponReceive: '/city/api/coupons/receive_coupon',//领取优惠券
  couponPay: '/city/api/common/coupon_pay',//优惠券支付
  couponMyCoupon: '/city/api/coupons/my_coupon',//我领取的优惠券
  couponCouponOrder: '/city/api/coupons/coupon_order',//优惠券订单详情
  couponUseCoupon: '/city/api/coupons/use_coupon',//优惠券订单核销
  commongetCode: '/city/api/common/get_code',//公用小程序码base64格式
  commongetCodeImg: '/city/api/common/get_code_img',//公用小程序码图片格式
  couponService: '/city/api/coupons/coupon_service',//服务范围
  mallGoodsPay: '/city/api/common/goods_pay', //商城支付*****************************
  vipPay: '/city/api/common/vip_pay', //购买会员支付
  groupPay: '/city/api/common/group_pay', //拼团支付
  bargainPay: '/city/api/common/bargain_pay', //砍价支付
  rushPay: '/city/api/common/rush_pay', //抢购支付
  templateList: '/city/api/User/TemplateList', //查看订阅消息列表
};
config.balance = {
  pay: '/city/api/balance/post', //帖子支付
  topPay: '/city/api/balance/post_top', //置顶支付
  postRefresh: '/city/api/balance/post_refresh', //刷新
  rewardPay: '/city/api/balance/reward', //资讯打赏
  renew_pay: '/city/api/balance/renew', //续费支付
  storePay: '/city/api/balance/store', //商家入驻支付
  lookPay: "/city/api/balance/look", //付费查看帖子
  bondPay: '/city/api/balance/bond', //保证金支付
  yellowPrePay: '/city/api/balance/yellow_presentation',//黄页认领
  yellowPay: '/city/api/balance/yellow',//黄页入驻支付
  integralPay: '/city/api/balance/integral', //积分兑换支付
  freeCarPay: '/city/api/balance/car', //顺风车支付
  activityEnrollPay: '/city/api/balance/enroll',//活动报名支付
  mallGoodsPay: '/city/api/balance/goods',//商城支付
  vipPay: '/city/api/balance/vip', //购买会员支付
  freeComCarTop: '/city/api/balance/car_top', //顺风车置顶支付
  freeCarRefresh: '/city/api/balance/car_refresh', //顺风车刷新
  jobRecruitPay: '/city/api/balance/recruit',//发布招聘支付
  jobTopPay: '/city/api/balance/job_top',//求职置顶余额支付
  jobRefreshPay: '/city/api/balance/job_refresh',//求职刷新余额支付
  jobJobPay: '/city/api/balance/job',//发布求职余额支付
  housRentingPay: '/city/api/balance/renting',//租房支付
  bondPay: '/city/api/balance/bond', //保证金支付
  houscommonRentintTop: '/city/api/balance/renting_top',//租房置顶余额支付
  housRefreshPay: '/city/api/balance/renting_refresh',//租房刷新余额支付
  businesscardCardPay: '/city/api/balance/super_card',//名片余额支付
  groupPay: '/city/api/balance/group', //拼团余额支付
  businesscardCardTopPay: '/city/api/balance/card_top',//名片置顶余额支付
  couponPay: '/city/api/balance/coupon',//优惠券余额支付
  bargainPay: '/city/api/balance/bargain', //砍价余额支付
  rushPay: '/city/api/balance/rush', //抢购余额支付
}
//对外把对象config返回
module.exports = config