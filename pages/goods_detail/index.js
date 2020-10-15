import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  request
} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 表示商品是否被收藏过
    isCollect: false
  },
  GoodsIfon: {},



  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const {
      goods_id
    } = options;
    this.getGoodsdetail(goods_id);

  },
  // 获取商品的详情数据
  async getGoodsdetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: {
        goods_id
      }
    });
    this.GoodsIfon = goodsObj;

    // 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsIfon.goods_id)
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone 部分手机不识别 webp图片格式
        // 最好找后台修改
        // 临时自己改 确保后台存在 1.webp => 1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  // 点击轮播图放大预览
  handlePrevwImage(e) {
    // 构造要预览的图片数组
    const urls = this.GoodsIfon.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: urls,
      current: current
    })
  },

  // 点击加入购物车
  handleCartAdd() {
    // 获取缓存中的购物车 数组
    let cart = wx.getStorageSync("cart") || [];
    // 判断商品对象是否存在数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsIfon.goods_id);
    if (index === -1) {
      // 不存在 第一次添加
      this.GoodsIfon.num = 1;
      this.GoodsIfon.checked = true;
      cart.push(this.GoodsIfon)
    } else {
      // 已存在购物车数据 执行 num++
      cart[index].num++;
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 提示窗口
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true

    })

  },
  // 点击商品收藏图标
  handleCollect() {
    let isCollect = false
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsIfon.goods_id)
    // 当index！=-1表示 已经收藏过
    if (index !== -1) {
      // 能找到 已经收藏过了 在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      })
    } else {
      // 没有收藏过
      collect.push(this.GoodsIfon);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
    // 把数组存入缓存中
    wx.setStorageSync("collect", collect);
    // 修改data中的属性 isCollect
    this.setData({
      isCollect
    })
  }

})