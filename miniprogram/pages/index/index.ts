/*
 * @Author: songyipeng
 * @Date: 2022-01-20 18:54:45
 */
// index.ts
// 获取应用实例
const app = getApp<IAppOption>();

Page({
  data: {
    orignImgInfo: null, // 原始图片信息
    compressedImgInfo: null, // 压缩图片信息
    canvasSize: {
      width: "200px",
      height: "200px",
    },
    compressRatio: 30,
    originSize: null,
    compressedSize: null,
  },
  // 选择上传图片的方式
  chooseUploadWay() {
    const that = this;
    wx.showActionSheet({
      itemList: ["拍照", "从手机相册选择"],
      success(res) {
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
              // 获取图片信息
              wx.getImageInfo({
                src: res.tempFiles[0].tempFilePath,
                success(res2) {
                  const imgInfo = {
                    src: res.tempFiles[0].tempFilePath,
                    width: res2.width,
                    height: res2.height,
                    type: res2.type,
                  };
                  wx.getFileInfo({
                    filePath: res.tempFiles[0].tempFilePath,
                    success(res3) {
                      imgInfo.size = res3.size;
                      const originSize =
                        res3.size > 1024 * 1024
                          ? (res3.size / (1024 * 1024)).toFixed(2) + "MB"
                          : res3.size > 1024
                          ? (res3.size / 1024).toFixed(2) + "KB"
                          : res3.size + "Byte";
                      that.setData({ orignImgInfo: imgInfo, originSize });
                      // 绘制图片
                      setTimeout(function () {
                        that.drawCanvas(imgInfo);
                      }, 10);
                    },
                  });
                },
                fail(e) {
                  // wx.showToast({
                  //   title: "wx.getImageInfo失败:" + e.errMsg,
                  // });
                },
              });
            },
            fail(e) {
              // wx.showToast({
              //   title: "chooseMedia失败:" + e.errMsg,
              // });
            },
          });
        }
      },
      fail(res) {
        console.log(res.errMsg);
      },
    });
  },

  // 绘制图片
  drawCanvas(imgInfo) {
    const that = this;
    const query = wx.createSelectorQuery();
    query
      .select("#compressCanvasId")
      .fields({ node: true, size: true })
      .exec((res) => {
        // canvas实例
        const canvas = res[0].node;
        // canvas上下文
        const ctx = canvas.getContext("2d");
        //关键代码
        if (imgInfo.width <= 4000) {
          canvas.width = imgInfo.width;
          canvas.height = imgInfo.height;
        } else {
          // width/height值太大时会导致canvas不显示
          const { width, height } = imgInfo;
          const ratio = width / height;
          if (width > height) {
            canvas.width = 4000;
            canvas.height = 4000 / ratio;
          } else {
            canvas.height = 4000;
            canvas.width = 4000 * ratio;
          }
          ctx.scale(canvas.width / width, canvas.height / height);
        }
        that.setData({
          canvasSize: {
            width: canvas.width / app.glabalData.pixelRatio,
            height: canvas.height / app.glabalData.pixelRatio,
          },
        });

        // 创建图片
        let img = canvas.createImage();
        img.src = imgInfo.src;
        /*
        img.onload = (e) => {
          let cW = imgInfo.width;
          let cH = imgInfo.height;
          let sx = 0;
          let sy = 0;
          const ratio = cW / cH;
          // 当宽高大于画布宽高时，设置为画布宽高
          if (cW > canvas.width) {
            cW = canvas.width;
            cH = cW / ratio;
          }
          if (cH > canvas.height) {
            cH = canvas.height;
            cW = cH * ratio;
          }
          // 居中
          if (cW < canvas.width) {
            sx = (canvas.width - cW) / 2;
          }
          if (cH < canvas.height) {
            sy = (canvas.height - cH) / 2;
          }

          ctx.drawImage(img, 0, 0, imgInfo.width, imgInfo.height);

          // 添加文字
          ctx.fillStyle = "#aaa";
          ctx.font = "16px serif";
          ctx.textAlign = "center";
          ctx.fillText("点击更换图片", canvas.width / 2, canvas.height / 2);
        };
        */
        img.onload = function (e) {
          ctx.drawImage(img, 0, 0, imgInfo.width, imgInfo.height);

          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
            destWidth: canvas.width,
            destHeight: canvas.height,
            fileType: "jpg",
            quality: 1 - that.data.compressRatio / 100,
            canvasId: "compressCanvasId",
            canvas: canvas,
            fail: (e) => {
              wx.showToast({
                title: e.errMsg,
              });
            },
            success: function success(res) {
              wx.getImageInfo({
                src: res.tempFilePath,
                success(res2) {
                  const compressedImgInfo = {
                    src: res.tempFilePath,
                    width: res2.width,
                    height: res2.height,
                    type: res2.type,
                  };
                  wx.getFileInfo({
                    filePath: res.tempFilePath,
                    success(res3) {
                      compressedImgInfo.size = res3.size;
                      const compressedSize =
                        res3.size > 1024 * 1024
                          ? (res3.size / (1024 * 1024)).toFixed(2) + "MB"
                          : res3.size > 1024
                          ? (res3.size / 1024).toFixed(2) + "KB"
                          : res3.size + "Byte";
                      that.setData({ compressedImgInfo, compressedSize });
                    },
                  });
                },
              });
              // that.setData()
            },
          });
        };
      });
  },
  // 调整压缩强度
  changeCompressRatio(value) {
    this.setData(
      {
        compressRatio: value.detail.value,
      },
      () => {
        if (this.data.orignImgInfo) {
          this.drawCanvas(this.data.orignImgInfo);
        }
      }
    );
  },
  // 保存图片至相册
  handleSave() {
    if (!this.data.compressedImgInfo) {
      wx.showModal({
        title: "提示",
        content: "请先上传一张图片",
        showCancel: false,
      });
    }
    wx.saveImageToPhotosAlbum({
      filePath: this.data.compressedImgInfo.src,
      success(res) {
        wx.showToast({
          title: "保存成功",
          icon: "success",
        });
      },
      fail(res) {
        wx.showToast({
          title: "保存失败",
          icon: "error",
        });
      },
    });
  },
  onLoad() {
    // @ts-ignore
    // if (wx.getUserProfile) {
    //   this.setData({
    //     canIUseGetUserProfile: true,
    //   });
    // }
  },
});
