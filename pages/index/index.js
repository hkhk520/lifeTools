// pages/index/index.js
var that;

// 引入腾讯位置服务的SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
// 实例化核心类
var qqmapsdk = new QQMapWX({
  key: '7DMBZ-377KD-IA74S-PZSIP-B2OMK-74BWI' // 必填
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ipt_value:"",

    //控制是否将数据存到缓存中
    flag: false
  },

  // 用户输入完成事件
  finish:function(res){
    console.log(res.detail.value); // 打印输入的值到控制台

    if(res.detail.value.indexOf("市") != -1 || res.detail.value.indexOf("区") != -1){
      wx.showToast({
        title: '查询的城市名称不要带市或区',
      })
    }else{
      that.getOneWeather(res.detail.value);
      that.getAllWeather(res.detail.value);
    }

    // 清空输入框中的内容
    that.setData({
      ipt_value: "",
      flag: false
    })
  },

  // 逆地址解析，获取自身位置的天气
  get_city:function(){
    // 腾讯位置服务的逆地址解析，默认获取当前位置
    qqmapsdk.reverseGeocoder({
      // 需要权限控制
      success:res =>{
        that.setData({
          flag:true
        })
        // indexOf("区") 查找字符的小标
        // substring(开始裁切的下标,结束的小标-1)
        // console.log("逆地址解析成功 =>", res.result.address_component.district.indexOf("区"))

        // 查询的天气信息，不能带市和区 “天河区”.slice(0,-1)
        // slice(0, -1)：从索引0开始，到索引最后一个结束，不包括最后索引项
      var city = res.result.address_component.district.slice(0,-1);

      that.getOneWeather(city);
      that.getAllWeather(city);
      },
      fail:err =>{
        // console.log(err)
        wx.showModal({
          title: '小程序需要定位权限',
          content: '你的位置信息将用于获取当前城市的天气',
          cancelText: '不需要',
          confirmText: '去授权',
          success:function(res){
            console.log(res);
            // 用户不给授权
            if (res.cancel) {
              that.get_city();
            }else{
              // 打开授权窗口
              wx.openSetting({
                complete:() =>{
                  that.get_city();
                }
              })
            }
          }
        })
      }
    })
  },

  // 实况天气
  getOneWeather:function(c){
    wx.request({
      url: "https://tianqiapi.com/api",
      method: "GET",
      data: {
        appid:29956519,
        appsecret:"2CfRZy0b",
        version:"v6",
        city:c
      },
      dataType: "json",
      success: res =>{
        console.error("请求实况天气!!")
        // console.log(+new Date());
        // console.log(new Date().getTime());

        console.log(Date.parse(new Date()));
        console.log("实况天气=>",res.data);

        if(that.data.flag){  // flag为true 存缓存
          // 缓存的过期时间
          wx.setStorage({
            key: 'out_time',
            data: Date.parse(new Date())+1800000
          })

          // 设置实况天气的缓存
          wx.setStorage({
            key: 'oneweather',
            data: res.data,
          })
        }else{
          that.setData({
            one:res.data
          })
        }
      },
      complete:() =>{
        // 从缓存中拿数据
        if(that.data.flag){
          that.getOneStorage();
        }
      }
    })
  },

  // 七日天气
  getAllWeather:function(c){
    wx.request({
      url: 'https://tianqiapi.com/api',
      method:"GET",
      data:{
        appid: 85828262,
        appsecret:"V9SIaeBn",
        version:"v1",
        city:c
      },
      dataType:"json",
      success:res =>{
        console.error("请求七天天气！！")
        console.log("七天天气=>",res.data)

        if (that.data.flag) {  // flag为true 存缓存
          // 设置七天天气的缓存
          wx.setStorage({
            key: 'allweather',
            data: res.data,
          })
        }else{
          that.setData({
            all:res.data
          })
        }
      },
      complete:() =>{
        if(that.data.flag){
          that.getAllStorage();
        }
      }
    })
  },

  // 拿到缓存中的数据，并且存到data里面
  // 获取一天的缓存
  getOneStorage:function(){
    wx.getStorage({
      key: 'oneweather',
      success: function(res) {
        
        that.setData({
          one: res.data
        })
        console.log("data中的实况天气 =>", that.data.one);
      },
    })
  },
  // 获取七天的缓存
  getAllStorage: function (){
    wx.getStorage({
      key: 'allweather',
      success: function (res) {
        
        that.setData({
          all: res.data,
          date:res.data.update_time.substring(5,16), //裁掉前面的2020- 和后面的 :秒
          // 成功获取自身位置天气完成，并存到缓存中了，就关闭flag
          flag:false
        })

        // 更新缓存成功后，停止下拉动作
        wx.stopPullDownRefresh();
        
        console.log("data中的7日天气 =>", that.data.all);
      },

      // 成功获取自身位置天气完成，并存到缓存中了，就关闭flag
      // complete:() =>{
      //   flag: false
      // }
    })
  },

  // 判断天气缓存是否过期了
  init:function(){
    wx.getStorage({
      key:"out_time",
      success:res =>{
        console.log("有时间缓存 =>",res)

        // 获取当前时间
        var nowTime = Date.parse(new Date());

        if (res.data - nowTime <=0){
          console.log("缓存过期");
          // 重新缓存
          // that.getOneWeather();
          // that.getAllWeather();
          
          // 逆地址解析
          that.get_city();

        }else{
          console.log("获取缓存中的数据");
          // 获取缓存中的数据
          that.getOneStorage();
          that.getAllStorage();
        }
      },
      fail:err =>{
        console.log("没有缓存 =>",err)
        // 重新缓存
        // that.getOneWeather();
        // that.getAllWeather();

        // 逆地址解析，解析成功自动调用天气
        that.get_city();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

    that.init();
    // 调用天气预报
    // that.getOneWeather();
    // that.getAllWeather();

    // 逆地址解析
    // that.get_city();
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
    // 用户下拉以后，更新缓存中的数据
    that.get_city();
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