/*
 * @Author: songyipeng
 * @Date: 2022-01-20 18:54:45
 */
// app.ts
App<IAppOption>({
  // 定义一个变量存储屏幕属性
  glabalData: {
    pixelRatio: 1,
  },
  // 生命周期回调——监听小程序初始化
  onLaunch() {
    const info = wx.getSystemInfoSync();
    this.glabalData.pixelRatio = info.pixelRatio;
  },
});
