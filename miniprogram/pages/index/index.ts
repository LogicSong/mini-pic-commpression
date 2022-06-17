/*
 * @Author: songyipeng
 * @Date: 2022-01-20 18:54:45
 */
// index.ts
// 获取应用实例
const app = getApp<IAppOption>();

Page({
  data: {
    imgUrl: null, //上传的图片地址
    uploadWays: [
      {
        name: "拍照",
      },
      { name: "从手机相册选择" },
    ],
    showUploadWays: false,
    motto: "Hello World",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    canIUseGetUserProfile: false,
    canIUseOpenData:
      wx.canIUse("open-data.type.userAvatarUrl") &&
      wx.canIUse("open-data.type.userNickName"), // 如需尝试获取用户信息可改为false
  },
  // 选择上传图片的方式
  chooseUploadWay() {
    this.setData({
      showUploadWays: true,
    });
  },

  hideUploadWays() {
    this.setData({
      showUploadWays: false,
    });
  },

  onSelect(e) {
    const that = this;
    if (e.detail.name === "从手机相册选择") {
      wx.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: ["album"],
        sizeType: ["original"],
        success(res) {
          console.log(res);
          that.setData({
            imgUrl: res.tempFiles[0].tempFilePath,
          });
        },
        fail() {
          wx.showToast({
            title: "图片读取失败",
          });
        },
      });
    } else {
      // 打开相机
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
    }
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
