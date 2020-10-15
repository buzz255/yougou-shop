/*
1、获取用户的收获地址
  1、绑定点击
  2、调用小程序内置 api 获取用户的收货地址 wx.chooseAddress

2、获取用户对 小程序 所授予 获取地址的权限状态 scope
  1、假设用户 点击收货地址的提示框 确定 authSetting scope.address
    scope 值为 true
  2、假设用户 点击收货地址的提示框 取消
    scope 值为 false 
  3、假设用户 从来没有点击收货提示框
    scope undefined
*/
import {
  chooseAddress,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: [],
    cart: [],
    allChecked: false,
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
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    });
    this.setCart(cart);
  },

  // 点击收获地址

  async handleChooseAddress() {

    const address = await chooseAddress();
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    wx.setStorageSync(
      "address",
      address
    )


  },
  // 商品的选中
  handleItemChange(e) {
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let {
      cart
    } = this.data;
    // 找到被修改的商品
    let index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);

  },
  // 对计算操作进行封装
  setCart(cart) {

    let allChecked = true;
    // 计算总价格 总数量
    let totalNum = 0;
    let totalPrice = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalNum += v.num;
        totalPrice += v.num * v.goods_price;
      } else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart", cart);

  },
  // 商品的全选功能
  handleItemAllCheck() {
    // 获取data中的数据
    let {
      cart,
      allChecked
    } = this.data;
    // 修改值
    allChecked = !allChecked;
    // 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 把修改后的值 填充会data和缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑功能
  async handleItemNum(e) {
    // 获取传递过来的参数
    const {
      id,
      operation
    } = e.currentTarget.dataset
    // 获取购物车数组
    let {
      cart
    } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否要删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal({
        content: "您是否要删除？"
      });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 进行修改数量
      cart[index].num += operation;
      // 将更改的数据填充回data和缓存中
      this.setCart(cart);

    }
  },
  // 点击结算
  async handlepay() {
    const {
      address,
      totalNum
    } = this.data;
    // 判断收货地址
    if (!address.userName) {
      await showToast({
        title: "您还没有添加收货地址"
      });
      return;
    }
    // 判断有无商品
    if (totalNum === 0) {
      await showToast({
        title: "您还没有选购商品"
      });
      return;
    }
    // 跳转支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
      
    })
  }
});