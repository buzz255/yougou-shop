// pages/category/index.js
import {
  request
} from "../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧菜单数据
    rightMenuList: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0,
    // 接口的返回数据
    Cates: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    1、先判断一下本地存储中有没有旧的数据
      {item:Data.now(),data:[...]}
    2、有没有旧数据 直接发送新请求
    3、有旧的数据 同时旧数据没有过期 就使用本地存储中的旧数据
    */

    // 先获取本地存储中的数据
    const Cates = wx.getStorageSync({
      key: "cates",
      success(res) {
        console.log(res.data)
      }
    });
    // 判断
    if (!Cates) {
      this.getCategoryList();
    } else {
      // 有旧数据 定义过期时间 10s 改成 5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCategoryList();

      } else {
        // 可以使用旧数据
        console.log('可以使用旧数据');
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(a => a.cat_name);
        // 构造右侧的商品数据
        let rightMenuList = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightMenuList
        })
      }
    }
  },
  // 获取分类数据
  getCategoryList() {
    request({
        url: "/categories"

      })
      .then(result => {
        // 把接口的数据存到本地
        wx.setStorageSync('cates', {
          item: Date.now(),
          data: this.Cates
        })
        this.Cates = result;

        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(a => a.cat_name);
        // 构造右侧的商品数据
        let rightMenuList = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightMenuList
        })
      })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    /*
    1、获取被点击的标题身上的索引
    2、给data中的crrentIndex赋值
    3、根据不同的索引来渲染右侧的商品内容
    */

    const {
      index
    } = e.currentTarget.dataset;

    let rightMenuList = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightMenuList,
      // 重新设置 右侧内容的scroll-view标签距离顶部的距离
      scrollTop: 0
    })
  }


})