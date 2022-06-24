/*
 * @Author: songyipeng
 * @Date: 2022-01-20 18:54:45
 */
// index.ts
// 获取应用实例
const app = getApp<IAppOption>();

Page({
  data: {
    // canvasWidth: app.globalData.screenWidth,

    imgUrl: null, //上传的图片地址
    ctx: null,
    motto: "Hello World",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    canIUseGetUserProfile: false,
    canIUseOpenData:
      wx.canIUse("open-data.type.userAvatarUrl") &&
      wx.canIUse("open-data.type.userNickName"), // 如需尝试获取用户信息可改为false
  },
  onReady() {
    const query = wx.createSelectorQuery();
    query
      .select("#compressCanvasId")
      .fields({ node: true, size: true })
      .exec((res) => {
        console.log(res);
        const canvas = res[0].node;
        canvas.width = 200;
        canvas.height = 200;
        // const ctx = canvas.getContext('2d');

        // const dpr = wx.getSystemInfoSync().pixelRatio
        // canvas.width = res[0].width * dpr
        // canvas.height = res[0].height * dpr
        // ctx.scale(dpr, dpr)

        // ctx.fillRect(0, 0, 100, 100)
      });
  },
  // 选择上传图片的方式
  chooseUploadWay() {
    const that = this;
    wx.showActionSheet({
      itemList: ["拍照", "从手机相册选择"],
      success(res) {
        console.log(res.tapIndex);
        if (res.tapIndex === 0) {
          wx.chooseMedia({
            count: 1,
            mediaType: ["image"],
            sourceType: ["camera"],
            sizeType: ["original"],
            camera: "back",
            success(res) {
              console.log(res.tempFiles.tempFilePath);
              console.log(res.tempFiles.size);
            },
          });
        } else {
          wx.chooseMedia({
            count: 1,
            mediaType: ["image"],
            sourceType: ["album"],
            sizeType: ["original"],
            success(res) {
              const query = wx.createSelectorQuery();
              query
                .select("#compressCanvasId")
                .fields({ node: true, size: true })
                .exec((res2) => {
                  // canvas实例
                  const canvas = res2[0].node;
                  console.log(canvas);
                  // canvas上下文
                  const ctx = canvas.getContext("2d");
                  // 创建图片
                  let img = canvas.createImage();
                  img.src = res.tempFiles[0].tempFilePath;
                  img.onload = (e) => {
                    // 计算图片加到canvas时的长宽
                    // canvas宽200高225
                    // 图片198|240
                    // if()
                    // console.log(img.height, img.width);
                    // img.height = 225;
                    // img.width = 200;
                    const height = ctx.drawImage(img, 0, 0, 200, 200);
                  };
                });
            },
            fail() {
              wx.showToast({
                title: "图片读取失败",
              });
            },
          });
        }
      },
      fail(res) {
        console.log(res.errMsg);
      },
    });
  },

  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: "../logs/logs",
    });
  },
  onLoad() {
    // @ts-ignore
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      });
    }
  },
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: "展示用户信息", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      },
    });
  },
  getUserInfo(e: any) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },
});
