// 发送请求的次数
let ajxitem = 0;
export const request = (params) => {
  let header = {
    ...params.header
  };
  if (params.url.includes("/my/")) {
    header["Authorization"] = wx.getStorageSync("token");
  }

  ajxitem++;
  // 显示加载效果
  wx.showLoading({
    title: '加载中',
    mask: true
  });

  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resoLve, reject) => {
    wx.request({
      ...params,
      header,
      url: baseUrl + params.url,
      success: (result) => {
        resoLve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      },

      complete: () => {
        ajxitem--;
        if (ajxitem === 0) {
          // 关闭加载图标
          wx.hideLoading();
        }
      }
    })
  })
}