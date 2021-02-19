// pages/face/face.js

var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:false,
  },

  // 获取token，base64不能带前缀
  get_token:function(base64){
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token',
      method:"get",
      data:{
        grant_type: "client_credentials",
        client_id: "lxkmz4k3EwweWyRYwUpgpu4v",  //百度人脸识别的API Key
        client_secret: "wRQezmv4esilvLO7izjBxnsrEwDZ3dDw"  //百度人脸识别的Secret Key
      },
      dataType:JSON,
      success:res =>{
        // json反序列化
        console.log("token的有效期 =>", JSON.parse(res.data).expires_in);
        console.log("token =>",JSON.parse(res.data).access_token);
        
        // token获取成功，调用人脸识别的方法
        that.faceId(JSON.parse(res.data).access_token,base64);
      }
    })
  },
  
  // 人脸识别的方法，base64不能带前缀
  faceId:function(token,base64){
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=' + token,
      method:"POST",
      // 请求头
      Header:{
        "Content-Type":"application/json"
      },
      data:{
        image:base64,
        image_type:"BASE64",
        face_field: "age,beauty,expression,face_shape,gender,glasses,landmark,landmark150,race,quality,eye_status,emotion,face_type,mask,spoofing"
      },
      success:res =>{
        // 关闭loading框
        wx.hideLoading();

        // 错误码为0 =>没有报错
        if(!res.data.error_code){
          wx.showToast({
            title: '人脸识别成功',
          })
          console.log(res);  //data里面的error_code: 0，则调用人脸识别方法成功
          console.log("人脸识别成功的数据 =>",res.data.result)

          that.setData({
            face_list:res.data.result.face_list[0],
            flag:true,
          })
        }
        // 222202为图片不包含人脸的错误码
        else if (res.data.error_code == 222202) {
          wx.showToast({
            title: '图片中不包含人脸',
            icon: 'none'   // 把打钩的图案去掉
          })
        }
        else {
          wx.showToast({
            title: '人脸识别失败，错误码：' + res.data.error_code,
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.log("人脸识别失败的数据 =>", err)
      }
    })
  },

  // 绑定点击事件
  click:function(){
    // 从本地相册选择图片或使用相机拍照
    wx.chooseImage({
      // 最多可以选择的图片张数为1张
      count:1,
      // 所选的图片的大小为压缩
      sizeType:['compressed'],
      success:res =>{
        wx.showLoading({
          // 选择照片时，开始执行loading
          title: '人脸识别中......',
        })
        console.log("临时图片路径 =>",res.tempFilePaths[0])

        // 查看图片的原始宽高
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: res => {
            // console.log(res.width);
            // console.log(res.height);
            // 比例  小人脸框 = （小图片 / 原图片）* 大人脸框
            var number = 300 / res.width;
            // console.log(number);
            that.setData({
              n: number,
            })
          }
        })

        // 获取全局文件管理器
        var manager = wx.getFileSystemManager();
        // 读取文件的内容
        manager.readFile({
          filePath:res.tempFilePaths[0],
          // 以base64位读取文件内容 不是二进制读取
          encoding: "base64",
          success:res =>{
            // 返回指定的文件编码
            // console.log("成功读取图片的base64编码 =>",res.data)

            // 成功拿到图片的base64后，调用token方法并传参数，进而调用人脸识别方法，但人脸识别方法的图片base64位不能带前缀
            that.get_token(res.data);

            // 给文件编码加个前缀，并赋给src
            var src = "data:image/ipg;base64," + res.data;
            // 把src存到data里
            that.setData({
              url:src,
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

    // that.get_token();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 下拉把屏幕的图片以及识别结果清除
    that.setData({
      flag:false,
    })
    // 关闭下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})