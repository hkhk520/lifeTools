var db = wx.cloud.database();
var collection = db.collection("test");
var _ = db.command;

// 把富文本编辑器里面的内容存储到数据库里
function addDataBase(delta, text, url ,uid ,title) {
  console.log("执行了！")

  // 时间对象
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();  // 月份从0开始
  var day = date.getDate();
  var hours = date.getHours();
  var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var xingqi = date.getDay();
  xingqi = xingqi == 0 ? "周日" : xingqi == 1 ? "周一" : xingqi == 2 ? "周二" : xingqi == 3 ? "周三" : xingqi == 4 ? "周四" : xingqi == 5 ? "周五" : "周六";

  // 便签的item进来 uid为true
  if (uid) {
    // 修改数据
    collection.doc(uid).set({
      data: {
        delta: delta,
        date: {
          year: year,
          month: month,
          day: day,
          hours: hours,
          min: min,
          xingqi: xingqi,
        },
        text: text,
        url: url,
        title: title
      },
      success: res => {
        console.log("成功修改数据！");
        wx.hideLoading();
        wx.showToast({
          title: '更新成功！',
        })
        // 数据添加成功，并延长2秒返回首页
        setTimeout(function () {
          wx.navigateBack();
        }, 1800)
      },
      fail: err => {
        console.log("更新失败", err);
        // 关闭loading
        wx.hideLoading();
        wx.showToast({
          title: '添加失败' + err,
          // 去掉打勾的图标
          icon: "none"
        })
      }
    })
  }
  // ＋号进来 uid为false  ； 
  else {
    collection.add({
      data: {
        delta: delta,
        date: {
          year: year,
          month: month,
          day: day,
          hours: hours,
          min: min,
          xingqi: xingqi,
        },
        text: text,
        url: url
      },
      success: res => {
        console.log("成功添加数据");

        // 关闭loading
        wx.hideLoading();
        wx.showToast({
          title: '添加成功！',
        })

        // 数据添加成功，并延长2秒返回首页
        setTimeout(function () {
          wx.navigateBack();
        }, 1800)

        // wx.showToast({
        //   title: '添加成功！',
        // })
      },
      fail: err => {
        console.log("添加数据失败", err);
        // 关闭loading
        wx.hideLoading();
        wx.showToast({
          title: '添加失败' + err,
          // 去掉打勾的图标
          icon: "none"
        })
      }
    })
  }
}

// 将接口暴露出去
module.exports={
  addDataBase: addDataBase
}