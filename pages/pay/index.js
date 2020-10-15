import {
  chooseAddress,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  request
} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: [],
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow() {
    // 获取缓存中的收货地址信息
    let address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked)
    this.setData({
      address
    });
    // 计算总价格 总数量
    let totalNum = 0;
    let totalPrice = 0;
    cart.forEach(v => {

      totalNum += v.num;
      totalPrice += v.num * v.goods_price;

    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
  // 点击 支付
  async handleOrderPar() {
    try { // 判断缓存中有没有token
      const token = wx.getStorageSync("token");
      // 判断
      if (!token) {
        wx.navigateTo({
          url: "/pages/auth/index"
        })
        return;
      }

      // 请求头参数
      // const header = {
      //   Authorization: token
      // }
      // 请求体参数
      const consignee_addr = this.data.address.all;
      const order_price = this.data.totalPrice
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = {
        consignee_addr,
        order_price,
        cart,
        goods
      }
      // 发送请求 创建订单 获取订单编号
      const {
        order_number
      } = await request({
        url: "/my/orders/create",
        method: "post",
        data: orderParams,

      });
      // 预支付
      const {
        pay
      } = await request({
        url: '/my/orders/req_unifiedorder',
        method: 'POST',
        data: {
          order_number
        },
      })

      // 发起微信支付
      await requestPayment(pay);
      // 查询后台
      const res = await request({
        url: '/my/orders/chkOrder',
        method: 'POST',
        data: {
          order_number
        },
      })
      await showToast({
        title: '支付成功'
      })
      // 手动删除缓存中已经支付的商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter((v) => !v.checked)
      wx.getStorageSync('cart', cart)
      wx.navigateTo({
        url: '/pages/order/index',
      })
    } catch (error) {
      await showToast({
        title: '支付失败'
      })
    }
  }



});