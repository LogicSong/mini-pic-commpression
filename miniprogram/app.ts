/*
 * @Author: songyipeng
 * @Date: 2022-01-20 18:54:45
 */
// app.ts
App<IAppOption>({
  globalData: {},
  onLaunch(options) {
    // 展示本地存储能力
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);

    // 登录
    wx.login({
      success: (res) => {
        // console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    });
  },
  onShow(options) {
    // console.log(options);
  },
  onHide() {
    // console.log('hide');
  },
});
