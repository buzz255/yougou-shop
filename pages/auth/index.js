import regeneratorRuntime, {
  async
} from '../../lib/runtime/runtime';
import {
  request
} from "../../request/index.js";
import {
  login
} from "../../utils/asyncWx.js"
Page({
  data: {
    defaultToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo',
  },

  // 获取用户信息
  async handleGetUserInfo(e) {
    try { // 获取用户信息
      const {
        rawData,
        signature,
        encryptedData,
        iv
      } = e.detail;
      // 获取小程序登陆成功后的code
      const {
        code
      } = await login();
      const loginParam = {
        rawData,
        signature,
        encryptedData,
        iv,
        code
      }
      // 发送请求 获取用户的token （貌似接口用不了，获取不到token）
      const {
        token
      } = (await request({
        url: "/users/wxlogin",
        data: loginParam,
        method: "post"
      })) || [];
      // 默认token
      wx.setStorageSync("token", this.data.defaultToken);
      // 跳回支付页面
      wx.navigateBack({
        delta: 1
      })
    } catch (err) {
      console.log(err)
    }
  }

})