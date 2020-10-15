import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  request
} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消 按钮 是否显示
    isFocus: false,
    // 输入框的值
    inpValue: ""
  },
  TimeId: -1,
  // 输入框的值改变 就会触发的事件
  handleInput(e) {
    // 获取输入框的值
    const {
      value
    } = e.detail;
    // 检测合法性
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      })
      // 值不合法
      return
    }
    // 准备发送请求获取数据
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    }, 1000)

  },
  // 准备请求获取搜索建议 数据
  async qsearch(query) {
    const res = await request({
      url: "/goods/qsearch",
      data: {
        query
      }
    })
    console.log(res)
    this.setData({
      goods: res
    })
  },
  // 点击取消 按钮
  handleCancel() {
    this.setData({
      inpValue: "",
      isFocus: false,
      goods: []
    })
  }


})