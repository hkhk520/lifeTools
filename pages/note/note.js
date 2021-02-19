// pages/index/index.js
var that;

var db = wx.cloud.database();
var collection = db.collection("test");
var _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    all: []
  },

  tap: function () {
    that.setData({
      show: true
    })
  },
  end: function () {
    that.setData({
      show: false
    })
  },

  // 点击每一个item就页面跳转
  navigator: function (event) {
    console.log(event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../tips/tips?_id=' + event.currentTarget.dataset.id,
    })
  },

  // 输入框完成的事件，修改标题的数据
  setTitle: function (opt) {
    console.log("opt_id =>", opt.currentTarget.dataset.id);
    console.log("输入框的value =>", opt.detail.value);

    // 通过id 添加或修改数据
    collection.doc(opt.currentTarget.dataset.id).update({
      data: {
        title: "《" + opt.detail.value + "》"
      },
      success: () => {
        that.getAllDb();
      }
    })
  },

  // 一文
  hitokoto: function () {
    wx.request({
      url: 'https://v1.hitokoto.cn', // url后面可带 ?c=d&c=i 等参数c
      method: 'get',
      dataType: 'json',
      // data:{
      //   c:'d'
      // },
      success: res => {
        console.log(res.data.type);

        that.setData({
          content: res.data.hitokoto,
          _from: res.data.from
        })

        // 停止下拉刷新
        wx.stopPullDownRefresh();
      }
    })
  },

  // 日期
  nowtime: function () {
    var time = new Date;
    var day = time.getDay();
    var date = time.getDate();
    console.log("时间 =>", time);

    day = day == 0 ? "星期天" : day == 1 ? "星期一" : day == 2 ? "星期二" : day == 3 ? "星期三" : day == 4 ? "星期四" : day == 5 ? "星期五" : "星期六";

    date = date < 10 ? "0" + date : date;

    console.log("星期 =>", day);
    console.log("日期 =>", date);

    that.setData({
      day: day,
      date: date
    })
  },

  // 获取数据库中的所有便签数据
  getAllDb: function () {
    var arr = [];
    // 逐月获取数据
    for (var i = 0; i <= 11; i++) {
      (function (i) {
        collection.where({
          "date.month": _.eq(i)
        }).get({
          success: res => {
            // console.log(res)
            // 对月份进行分类，组成一个12月份的数组
            arr[i] = res.data;

            // 月份齐全，把所有的月份存到data里面去
            let index = 0;
            arr.map(function () {
              // 遍历数组每一项 确保数组每一项都有
              index++;
            });
            if (index == 12) {
              // console.log(arr)
              that.setData({
                all: arr
              })
              console.log("月份列表all =>", that.data.all)
            }
          }
        })
      })(i)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.nowtime();
    that.hitokoto();
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
    that.getAllDb();
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
    that.hitokoto();
    // wx.stopPullDownRefresh();
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