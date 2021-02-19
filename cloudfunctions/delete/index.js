// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"test-vgbli"
});

var db = cloud.database();
var collection = db.collection("test");
var _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {

    return await collection.where({
      _id: _.neq("")
    }).remove({
      success:res =>{
        console.log(res);
      }
    });
  
}