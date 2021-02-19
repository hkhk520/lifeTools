// pages/mine/mine.js
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    system:""
  },

  // 自定义的点击事件
  nextpage:function(){
    wx.navigateTo({
      url: '../setting/setting',
    })
  },

  // 获取系统信息
  getSystem:function(){
    wx.getSystemInfo({
      // 成功获取手机系统信息
      success: function(res) {
        console.log(res.model);

        // 以特定的连接符，裁切字符串，并且存成数组
        var str = res.model.split("<");
        console.log(str[0]);

        // 将系统的res存在data里面
        that.setData({
          system:res,
          model: str[0]
        })
        console.log(that.data)
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

    // 调用获取系统信息的方法
    that.getSystem()
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