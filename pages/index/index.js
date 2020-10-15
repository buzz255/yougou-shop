// 引入用来发送请求的方法 一定要把路径补全
import {
  request
} from "../../request/index.js";
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    catesList: [],
    floorList: []
  },
  // 页面开始加载的时候就会触发的事件
  onLoad: function () {
    // 1、发送异步请求获取轮播图数据 优化的手段可以通过es6的promise来解决这个问题
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success:(result)=>{
    //     //   console.log(result)
    //     this.setData({
    //         swiperList:result.data.message
    //     })
    //   }
    // })
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    request({
        url: "/home/swiperdata"
      })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },
  // 获取导航栏数据
  getCatesList() {
    request({
        url: "/home/catitems"
      })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },
  // 获取楼层数据
  getFloorList() {
    request({
        url: "/home/floordata"
      })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  }
})