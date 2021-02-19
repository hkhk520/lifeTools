// pages/map/map.js
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  click:function(){
    let plugin = requirePlugin('routePlan');
    let key = '7DMBZ-377KD-IA74S-PZSIP-B2OMK-74BWI';  //使用在腾讯位置服务申请的key
    let referer = '天气';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
      'name': ' ',
      'latitude': that.data.location.latitude,
      'longitude': that.data.location.longitude
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + '&navigation=1'
    });
  },

  // 自定义一个获取自身位置的方法
  getMyLocation:function(){
    // 获取经纬度的api
    wx.getLocation({
      success:res=>{
        console.log("成功获取到经纬度=>",res);
        // 把经纬度存到data里面
        that.setData({
          location:res
        })
        // 验证数据是否存到data里面了
        console.log(that.data.location)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

    // 调用获取自身的位置的方法
    that.getMyLocation();
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