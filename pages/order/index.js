import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  request
} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [{
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      }, {
        id: 3,
        value: "退款/退货",
        isActive: false
      },
    ],
  },

  onShow(options) {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: "/pages/auth/index"
      });
      return
    }
    // 获取当前的小程序的页面栈-数组 长度最大是10页
    let pages = getCurrentPages();
    // 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 获取url上的type参数
    const {
      type
    } = currentPage.options;
    this.getOrders(type);
    // 激活选中页面标题 当type=1 index=0
    this.changeTitleByIndex(type - 1)
  },
  // 获取商品列表的方法
  async getOrders(type) {
    const res = await request({
      url: "/my/orders/all",
      data: {
        type
      }
    });
    this.setData({
      orders: res.orders.map(v => ({
        ...v,
        create_time_cn: (new Date(v.create_time * 1000).toLocaleString())
      }))
    })
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    // 修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // 赋值到data中
    this.setData({
      tabs
    })
  },
  handleItemTapChange(e) {
    // 获取被点击的标题索引
    const {
      index
    } = e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求 type=1 index=0
    this.getOrders(index + 1);
  },


})