var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
// // 引入加密模块
var crypto = require('crypto');

// 引入 users 表 , 实现 增删改查
var user = require('../database/tables/user.js');


// session 状态 , 用于与 cookie 协作 , 前端只需要携带 cookie ,即可登录 , 无需每次都携带 用户信息
let SESSION_ID = 'connect.sid';
let session = {};


let whiteList = ['http://localhost:8080']; // 设置白名单

// 登录接口
router.post('/login', function (req, res, next) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    // 允许携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.end() // OPTIONS请求不做任何处理
  }
  let origin = req.headers.origin;
  if (whiteList.includes(origin)) {
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    // 设置哪个源可以访问我
    res.setHeader('Access-Control-Allow-Origin', origin);
    // 允许哪个方法访问我
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET');
    // 允许携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true);
    // 预检的存活时间
    res.setHeader('Access-Control-Max-Age', 6);

    // 用req.body引用请求体
    let { username, password } = req.body;
    let user = userList.find(item => item.username === username && item.password === password);
    if (user) {
      // 用户登录后给 用户一个 cookie
      const cardId = Math.random() + Date.now();
      session[cardId] = { user };
      res.cookie(SESSION_ID, cardId, { httpOnly: false, sameSite: 'strict' });
      // 登录状态数组
      let data = {
        // 是否成功登录
        IsloggedSuccessful: true,
        // notice_url
        notice_url: '@/assets/icon_notice.png',
        // 头像url
        avatar_src: '@/assets/avatar.png'
      }
      res.end(JSON.stringify(data));
    } else {
      let err = { code: 1, err: '用户未登录' }
      res.end(JSON.stringify(err));
    }
  } else {
    // 不允许 此 url访问
    res.end('非法登录');
  }
})


// 注册接口
router.post('/register', function(req, res, next) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    // 允许携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.end() // OPTIONS请求不做任何处理
  }
  let origin = req.headers.origin;
  if(whiteList.includes(origin)) {
    // 设置哪个源可以访问我
    res.setHeader('Access-Control-Allow-Origin', origin);
    // 允许哪个方法访问我
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET');
    // 允许携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true);
    // 预检的存活时间
    res.setHeader('Access-Control-Max-Age', 6);

    // 用req.body引用请求体
    let { registerUsername, registerPhoneNumber , registerPassword } = req.body;

    // 对密码进行加密
    let md5 = crypto.createHash("md5"); // md5加密
    let md5Sum = md5.update(registerPassword); // 对密码进行加密
    let encryption_password = md5Sum.digest("Base64"); // Base64编码

    // 号码作为唯一 ID , 不能重复
    // 在数据库查找是否查找 重复的号码 , 不存在便创造一个
     user.findOrCreate({
      where : {
        phone : registerPhoneNumber
      },
      defaults : {
        username : registerUsername,
        password : encryption_password,
        token : '',
        phone : registerPhoneNumber,
        createAt : Date.now(),
        updatedAt : Date.now(),
        createUser : 'zero0011',
        updateUser : 'zero0011'
      }
    })
    .then(result => {
      // 注册成功
      console.log(result);
    })
    .catch(err => {
      console.log(err)
    })
  }
})

module.exports = router;
