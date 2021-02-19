// 删库 按钮事件
function _delete() {
  wx.showLoading({
    title: '删数据库中......',
  })
  wx.cloud.callFunction({
    name: "delete",
    success: res => {
      console.log("删库成功 =>", res);
      wx.hideLoading();
      wx.showToast({
        title: '删库成功！',
      })
    },
    fail: err => {
      console.log("删库失败 =>", err);
      wx.hideLoading();
      wx.showToast({
        title: '删库失败！',
        icon: 'none'
      })
    }
  });
};

// 加粗
function bolder() {
  // 创建选择器对象
  var query = wx.createSelectorQuery();
  // 通过css选择器获取节点
  var editor = query.select("#editor");
  // 通过节点获取富文本编辑器的内容对象
  editor.context(function (res) {
    // 修改富文本编辑器的内容样式——加粗
    res.context.format("bold");
  }).exec();  // 按顺序执行方法，将结果返回成数组
};

// 斜体
function italic() {
  var ele = wx.createSelectorQuery().select("#editor");
  ele.context(function (res) {
    res.context.format("italic")
  }).exec();
};

// 下划线
function uline() {
  var ele = wx.createSelectorQuery().select("#editor");
  ele.context(function (res) {
    res.context.format("underline")
  }).exec();
};

// 添加图片
function addimg() {
  var query = wx.createSelectorQuery();
  var editor = query.select("#editor");
  wx.chooseImage({
    // 图片格式为压缩图
    sizeType: ['compressed'],
    success: function (e) {
      // 临时图片路径 e.tempFilePaths
      // 把图片插入到编辑器里面
      editor.context(function (res) {
        // 循环所有的图片路径
        for (var i = 0; i < e.tempFilePaths.length; i++) {
          // 插入每一张图片
          res.context.insertImage({
            src: e.tempFilePaths[i]
          })
        }
      }).exec();
    },
  })
};

// 修改便签的方法
function setContents(delta) {
  // 选择器对象
  var query = wx.createSelectorQuery();
  // 通过选择器获取节点
  var ele = query.select("#editor");
  ele.context(function (res) {
    res.context.setContents({
      delta: delta
    })
  }).exec();
};

// 将接口暴露出去
module.exports = {
  _delete: _delete,
  bolder: bolder,
  italic: italic,
  uline: uline,
  addimg: addimg,
  setContents: setContents
}