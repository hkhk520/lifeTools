// pages/tips/tips.js

// 引入utils工具文件
var db_fn = require('../../utils/database.js');
var editor = require('../../utils/editor.js');

var that;

var db = wx.cloud.database();
var collection = db.collection("test");

var img_number = 0;
var url_number = 0;
var fileUrl_arr = [];

var uid;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    change: true
  },

  // 富文本编辑器被改变
  change:function(e){
    // 有图 number = -1
    // 无图 number = 0
    that.setData({
      number: that.data.number + 1
    })

    if(that.data.number > 0){
      that.setData({
        change: false
      })
    }
  },

  // 完成
  finish:function(){
      // 开始提交数据
      wx.showLoading({
        title: '上传中......',
      })

      // 不管是修改或者添加便签，都要先获取编辑器里的内容
      var editor = wx.createSelectorQuery().select("#editor");
      editor.context(function(e){
        // 拿到编辑器里面的所有内容
        e.context.getContents({
          success:res =>{
            console.log("富文本编辑器中的所有内容 =>",res)

              if(res.delta.ops.length == 1 && res.delta.ops[0].insert == "\n"){
                wx.showToast({
                  title: '内容不能为空！',
                  icon: "none"
                })
              }else if(uid && that.data.change){
                console.log("便签内容未被修改！");
                wx.hideLoading();
                wx.showToast({
                  title: '便签内容未修改！',
                  icon: "none"
                })
                // setTimeout(function(){
                //   wx.navigateBack();
                // },1800)
              }
              else if (uid){
                // 先删掉 原来的数据that.data.db.delta.ops
                for(let i in that.data.db.delta.ops){
                  if(that.data.db.delta.ops[i].insert.image){
                    // 把原来的图片 从服务器删除
                    wx.cloud.deleteFile({
                      fileList: [that.data.db.delta.ops[i].insert.image]
                    })
                  }
                }
                collection.doc(uid).remove();

                // 再添加修改了内容的数据
                // 判断是否有图片
                var flag = true;
                for (var i in res.delta.ops) {
                  // 有图片，先上传图片，再传数据库
                  if (res.delta.ops[i].insert.image) {
                    flag = false;
                    // 对图片进行计数
                    img_number++;

                    // 上传图片的方法
                    that.uploadImage(res.delta.ops[i].insert.image, res.delta, res.text);

                  }
                };
                // 没有图片 直接存富文本的内容到数据库里面
                if (flag) {
                  db_fn.addDataBase(res.delta, res.text, uid);
                }

              }
                
              // 从＋号进来的 uid为false
              else {
                // 判断是否有图片
                var flag = true;
                for(var i in res.delta.ops){
                  // 有图片，先上传图片，再传数据库
                  if(res.delta.ops[i].insert.image){
                    flag = false;
                    // 对图片进行计数
                    img_number++;

                    // 上传图片的方法
                    that.uploadImage(res.delta.ops[i].insert.image, res.delta, res.text);

                  }
                };
                // 没有图片 直接存富文本的内容到数据库里面
                if(flag){
                  db_fn.addDataBase(res.delta, res.text, uid);
                }
              }
          }
        })
      }).exec();
  },

  // 把图片上传到云存储
  uploadImage:function(path,delta,text){
    // 传到云存储里面  只能一张一张传（有换成真实图片路径的方法）
    // wx.cloud.uploadFile({
    //   cloudPath:"tips/"+(new Date()).getTime()+".png",
    //   filePath:path,
    //   success:e =>{
    //     // TODO 文件id  一条一条的回
    //     // console.log(e.fileID);

    //     // 把每一条真实图片的文件id存到数组中
    //     fileUrl_arr.push(e.fileID);
    //     // 图片路径的数量
    //     url_number++;

    //     if(url_number == img_number) {
    //       // 所有的图片都换取了真实路径
    //       // 所有的图片的文件id
    //       // console.log(fileUrl_arr);

    //       // 通过文件ID换取真实路径
    //       wx.cloud.getTempFileURL({
    //         fileList: fileUrl_arr,
    //         success: res => {

    //           // 一定要把图片文件id数组 初始化，否则文件id会累加
    //           fileUrl_arr = [];

    //           // 真实路径
    //           console.log(res);

    //           // 把富文本编辑器里面的图片路径改成真实路径
    //           let i = 0;
    //           for (var key in delta.ops) {
    //             if (delta.ops[key].insert.image) {
    //               // 把富文本编辑器里面的所有图片路径 改成 真实图片路径
    //               delta.ops[key].insert.image = res.fileList[i].tempFileURL;
    //               i++;
    //             }
    //           }
    //           console.log(delta);

    //           // 把数据存到数据库里面
    //           db_fn.addDataBase(delta, text, res.fileList[0].tempFileURL ,uid);
    //         },
    //       })
    //     } 
    //   }
    // })
    // 传到云存储里面  只能一张一张传（没有换成真实图片路径的方法）
    wx.cloud.uploadFile({
      cloudPath: "tips/" + (new Date()).getTime() + ".png",
      filePath: path,
      success: e => {
        // TODO 文件id  一条一条的回
        // console.log(e.fileID);

        // 把每一条真实图片的文件id存到数组中
        fileUrl_arr.push(e.fileID);
        // 图片路径的数量
        url_number++;

        if (url_number == img_number) {
          // 把富文本编辑器里面的图片路径改成文件id
          let i = 0;
          for (var key in delta.ops) {
            // 判断富文本编辑器里面是否有图片
            if (delta.ops[key].insert.image) {
              // 把富文本编辑器里面的所有图片路径 改成 文件id
              delta.ops[key].insert.image = fileUrl_arr[i];
              i++;
            }
          }
          // console.log(delta);

          // 把数据存到数据库里面
          db_fn.addDataBase(delta, text, fileUrl_arr[0], uid);

          fileUrl_arr = []; //清空数组的内容
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

    console.log(options._id);

    // ＋号进来 uid为false  ； 便签的item进来 uid为true
    uid = options._id;

    // 存在id的情况下
    if (options._id){
      // 通过便签的id获取数据
      collection.doc(options._id).get({
        success: res => {
          console.log("通过便签的id获取数据 =>",res.data);

          // 把数据库的数据存到data里面
          that.setData({
            db: res.data
          })

          that.setContents(res.data.delta);
        },
        complete:function(){
          // 先判断便签中是否有图片
          for (let i in that.data.db.delta.ops) {
            if (that.data.db.delta.ops[i].insert.image) {
              that.setData({
                number: -1
              })
              break;
            } else {
              that.setData({
                number: 0
              })
            }
          }
        }
      })
    }
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

  },





  // 删库 按钮事件
  _delete: function () {
    editor._delete();
  },

  // 加粗
  bolder: function () {
    editor.bolder();
  },

  // 斜体
  italic: function () {
    editor.italic();
  },

  // 下划线
  uline: function () {
    editor.uline();
  },

  // 添加图片
  addimg: function () {
    editor.addimg();
  },

  // 修改便签的方法
  setContents: function (delta) {
    editor.setContents(delta);
  },
})