import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  request
} from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 0,
        value: "价格",
        isActive: false
      },
    ],
    goods_list: []
  },

  // 接口所要的参数
  QueryParams: {
    query: "",
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.cid = options.query || "";
    this.getGoodsList();

  },
  // 滚动条上拉触底事件
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据了
      wx.showToast({
        title: "没有下一页数据了。"
      })
    } else {
      this.getGoodsList();
      this.QueryParams.pagenum++
    }
  },
  onPullDownRefresh() {
    // 重置数组
    this.setData({
      goods_list: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1;
    // 重新发送请求
    this.getGoodsList();
  },
  // 标题点击事件 从子组件传递过来
  handleItemTapChange(e) {
    // 获取被点击的标题索引
    const {
      index
    } = e.detail;
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
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams
    });
    // 获取总条数
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // 更新数据
    this.setData({
      // 拼接了数组
      goods_list: [...this.data.goods_list, ...res.goods],
    })
    // 关闭下拉刷新提示
    wx.stopPullDownRefresh();
  }


})