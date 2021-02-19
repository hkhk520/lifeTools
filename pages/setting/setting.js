// pages/setting/setting.js
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  //滑块改变事件
  changing:function(res){
    // 滑块的值
    console.log(res.detail.value/100);

    // 设置手机屏幕亮度
    wx.setScreenBrightness({
      value: res.detail.value/100,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
    // 获取当前手机屏幕的亮度
    wx.getScreenBrightness({
      success:res =>{
        console.log(res);
        that.setData({
          value:res.value * 100
        })
      }
    })
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