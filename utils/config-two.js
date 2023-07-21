var config = {
  powerList: '/city/api/user/power_list', //个人中心权限
  mallConfig: '/city/api/config/shop', //商城配置
  mallNav: '/city/api/shop/nav', //导航
  mallStoreList: '/city/api/shop/store_list', //商家列表
  mallGoodsList: '/city/api/shop/goods_list', //商品列表
  mallGoodsInfo: '/city/api/shop/goods_info', //商品详情
  mallStoreGoodsList: '/city/api/shop/store_goods_list', //商家商品列表
  mallFullCategory: '/city/api/shop/full_category', //商城分类
  mallSaveOrder: '/city/api/shop/save_order', //下单
  mallGoodsGroup: '/city/api/shop/group', //获取规格组合
  mallSaveComment: '/city/api/shop/save_comment', //保存评论
  mallOrderList: '/city/api/shop/order_list', //订单列表
  mallOrderInfo: '/city/api/shop/order_info', //订单详情
  mallGoodsPay: '/city/api/common/goods_pay', //支付
  mallCancelOrder: '/city/api/shop/cancel_order', //取消订单/确认收货/申请退款/拒绝退款
  mallDelOrder: '/city/api/shop/del_order', //删除订单
  mallSaveCar: '/city/api/shop/save_car', //添加购物车
  mallCarList: '/city/api/shop/car_list', //我的购物车
  mallModifyNum: '/city/api/shop/modify_num', //修改购物车商品数量
  mallDelCar: '/city/api/shop/del_car', //删除购物车
  mallClearCar: '/city/api/shop/clear_car', //清空购物车
  mallSettlementCar: '/city/api/shop/settlement_car', //购物车结算
  mallGoodsService: '/city/api/shop/goods_service', //获取商品的服务范围
  mallHxztdd: '/city/api/shop/validate_order', //核销码核销自提订单
  mallReceiveCoupon: '/city/api/shop/receive_coupon', //领取商家优惠券
  mallMyCoupon: '/city/api/shop/my_coupon', //我的优惠券
  deliverSet: '/city/api/business/deliver_set', //商家自提点
  addressInfo: '/city/api/business/address_info', //自提点详情
  validateOrder: '/city/api/shop/validate_order', //商城订单核销
  mallSaveCoupon: '/city/api/shop_coupon/save_coupon', //保存优惠券
  mallCouponList: '/city/api/shop_coupon/coupon_list', //优惠券列表
  mallCouponInfo: '/city/api/shop_coupon/coupon_info', //编辑详情
  mallModify: '/city/api/shop_coupon/modify', //优惠券上下架
  mallDelCoupon: '/city/api/shop_coupon/del_coupon', //删除优惠券
  mallComment: '/city/api/shop/more_comment', //商品评价
  vipConfig: '/city/api/config/vip', //**************************会员卡配置
  vipSetmeal: '/city/api/vip/setmeal', //开通套餐
  vipAddvip: '/city/api/vip/add_vip', //购买/续费会员
  vipActivation: '/city/api/vip/activation', //激活会员
  vipOpenList: '/city/api/vip/open_list', //开通列表
  vipPackageList: '/city/api/vip/package_list', //开卡礼包
  vipPackageInfo: '/city/api/vip/package_info', //礼包详情
  vipReceivePackage: '/city/api/vip/receive_package', //领取礼包
  vipPackageWriteOff: '/city/api/vip/write_off', //核销礼包
  vipMyPackage: '/city/api/vip/my_package', //我的开卡礼包
  vipPackageReceive: '/city/api/vip/package_receive', //礼包领取列表
  vipPrivilegeDay: '/city/api/vip/privilege_day', //特权日期列表
  vipPrivilegeList: '/city/api/vip/privilege_list', //特权列表
  vipPrivilegeReceive: '/city/api/vip/privilege_receive', //特权领取列表
  vipPrivilegeInfo: '/city/api/vip/privilege_info', //特权详情
  vipReceivePrivilege: '/city/api/vip/receive_privilege', //领取特权
  vipUsePrivilege: '/city/api/vip/use_privilege', //核销特权
  vipMyPrivilege: '/city/api/vip/my_receive_privilege', //我领取的特权
  vipGetCode: '/city/api/vip/get_code', //获取小程序码
  addPrivilege: '/city/api/vip/add_privilege', //保存特权
  vipLabel: '/city/api/vip/vip_label', //服务范围
  myPrivilege: '/city/api/vip/my_privilege', //我发布特权列表
  privilegeDisplay: '/city/api/vip/privilege_display', //特权上下架
  privileReceive: '/city/api/vip/privilege_receive',//特权领取列表
  groupConfig: '/city/api/config/group', //**************************拼团设置
  groupGoodsLabel: '/city/api/group/goods_label', //获取商品服务范围与标签
  category: '/city/api/category/category', //获取分类
  groupGroupList: '/city/api/group/group_list', //拼团商品列表
  groupGroupOrder: '/city/api/group/group_order', //拼团详情订单
  groupGoodsList: '/city/api/group/goods_list', //商家我的商品发布列表
  groupGoing: '/city/api/group/going', //正在拼团
  groupSaveOrder: '/city/api/group/save_order', //下单
  groupMyGroup: '/city/api/group/my_group', //我的拼团
  groupOrderInfo: '/city/api/group/order_info', //订单详情
  groupGroupInfo: '/city/api/group/group_info', //团购详情
  groupVerify: '/city/api/group/verify', //核销
  groupApplyRefund: '/city/api/group/apply_refund', //用户申请退款
  groupRefund: '/city/api/group/refund', //商家退款
  groupSaveGoods: '/city/api/group/save_goods', //发布拼团商品
  groupGoodsInfo: '/city/api/group/goods_info', //商品详情
  groupDelGoods: '/city/api/group/del_goods', //删除商品
  groupComplete: '/city/api/group/complete', //快递配送 - 确认收货
  groupDelivery: '/city/api/group/delivery', //商家发货
  groupGetCode: '/city/api/group/group_get_code', //拼团详情核销码
  activityMy: '/city/api/business/my_activity', //**************************商家管理中心接口 ****我的活动
  activitySaveActivity: '/city/api/activity/save_activity',//发布活动
  activityChange: '/city/api/business/activity_change', //活动上下架
  activityEnrollList: '/city/api/business/enroll_list', //活动报名详情列表
  storeData: '/city/api/business/store_data', //**************************商家管理中心接口 ****商家数据
  shopOrderList: '/city/api/shop_order/order_list', //商家订单列表
  shopCancelOrder: '/city/api/shop/cancel_order', // 取消订单/拒绝退款
  shopOrderDelivery: '/city/api/shop_order/delivery', //发货
  shopOrderRefund: '/city/api/shop_order/refund', //退款
  shopGoodsList: '/city/api/shop_goods/goods_list', //商品列表
  shopCategoryList: '/city/api/shop_goods/category_list', //商品分类列表
  shopSaveGoods: '/city/api/shop_goods/save_goods', //商品保存
  shopGoodsLabel: '/city/api/shop_goods/goods_label', //商品标签
  shopModify: '/city/api/shop_goods/modify', //商品上下架
  shopDelGoods: '/city/api/shop_goods/del_goods', //删除商品
  shopGoodsInfo: '/city/api/shop_goods/goods_info', //编辑商品详情
  shopModifySpec: '/city/api/shop_goods/modify_spec', //编辑商品规格
  shopBusinessSet: '/city/api/business/set', //配送设置
  shopDeliverSet: '/city/api/business/deliver_set', //地址列表
  shopSaveAddress: '/city/api/business/save_address', //保存地址
  shopAddressInfo: '/city/api/business/address_info', //地址详情
  shopDelAddress: '/city/api/business/del_address', //删除地址
  couponSaveCoupons: '/city/api/coupons/save_coupons',//发布优惠券
  couponMyCoupons: '/city/api/coupons/my_coupons',//我发布的优惠券
  couponDelCoupon: '/city/api/coupons/del_coupon',//优惠券删除
  couponReceiveCouponList: '/city/api/coupons/receive_coupon_list',//优惠券领取列表
  bargainConfig: '/city/api/config/bargain', //**************************砍价配置
  bargainSaveBargain: '/city/api/bargain/save_bargain', //发布砍价
  bargainMyBargain: '/city/api/bargain/my_bargain', //我发布的砍价
  bargainList: '/city/api/bargain/bargain_list', //砍价商品列表
  bargainInfo: '/city/api/bargain/bargain_info', //商品详情
  bargainCategory: '/city/api/bargain/category', //获取商品分类
  bargainStartBargain: '/city/api/bargain/start_bargain', //发起砍价
  bargainIng: '/city/api/bargain/bargain_ing', //砍价
  bargainOrderPay: '/city/api/bargain/order_pay', //下单购买
  myBargainOrder: '/city/api/bargain/my_bargain_order', //获取我的订单列表
  goodOrderList: '/city/api/bargain/good_order_list', //商品订单列表
  bargainDelivery: '/city/api/bargain/delivery', //delivery
  payOrderList: '/city/api/bargain/pay_order_list', //砍价公告
  bargainShare: '/city/api/bargain/share', //砍价分享
  useBargain: '/city/api/bargain/use_bargain', //核销砍价
  bargainComplete: '/city/api/bargain/complete', //确认收货
  rushConfig: '/city/api/config/rush', //**************************抢购设置
  rushGoodsList: '/city/api/rush/goods_list',//商品列表
  rushGoodsInfo: '/city/api/rush/goods_info',//抢购详情
  rushMoreReceive: '/city/api/rush/more_receive',//抢购详情领取列表
  rushSaveOrder: '/city/api/rush/save_order',//抢购下单
  rushOrderList: '/city/api/rush/order_list',//我的抢购列表
  rushOrderInfo: '/city/api/rush/order_info',//抢购列表详情
  rushVerify: '/city/api/rush/verify',//核销抢购
  rushMyList: '/city/api/rush/my_list',//我发布的商品
  rushRushInfo: '/city/api/rush/rush_info',//抢购领取详情
  rushRushDelivery: '/city/api/rush/delivery',//商户发货
  rushRushComplete: '/city/api/rush/complete',//确认收货
  rushRushDelGoods: '/city/api/rush/delGoods',//删除抢购商品
  rushGoodsLabel: '/city/api/rush/goods_label',//服务范围
  rushSaveGoods: '/city/api/rush/save_goods',//发布抢购
  clerkList: '/city/api/clerk/index', //**************************员工管理列表
  clerkSave: '/city/api/clerk/save', //添加员工post请求/查看编辑信息get请求
  clerkDelete: '/city/api/clerk/delete', //删除员工
  clerkChange: '/city/api/clerk/change', //启用禁用
  clerkPower: '/city/api/clerk/power', //核销权限
  storeBalance: '/city/api/business/store_balance', //**************************商家余额
  balanceList: '/city/api/business/balance_list', //余额明细
  applyCash: '/city/api/business/apply_cash', //商户提现
  cashList: '/city/api/business/cash_list', //提现列表
  formId: '/city/api/user/save_form_id', //**************************formId
  liveList: '/city/api/common/live_index', //**************************小程序直播

  zanSubmit:"/city/api/collect_like/save_post",//集赞发布
  zanMyList:"/city/api/collect_like/my_list",//我的发布
  zanJiLu:"/city/api/collect_like/exchange_list",//兑换记录
  dianzan:"/city/api/collect_like/like",//点赞
  zandetail:"/city/api/collect_like/post_info",//信息详情
  duihuan:"/city/api/collect_like/exchange",//兑换
  zanpaihang:"/city/api/collect_like/rank",//集赞排行
  liebia:"/city/api/collect_like/post_list",//信息列表
  zanshera:"/city/api/collect_like/share",//分享
  zanHdetail:"/city/api/collect_like/exchange_info",//兑换详情
  zancancel:"/city/api/collect_like/write_off",//确定核销
  myShera:"/city/api/collect_like/my_share",//我的分享
};
//对外把对象config返回
module.exports = config