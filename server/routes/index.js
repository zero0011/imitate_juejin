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

// login接口
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
    console.log(username, password)
    // 查找数据库 , 以 username 为索引 , 查找是否存在 , 如果有 用户对应的 数据 , 并把对应的 cookie 存在数据中

    // 以 username 和 password为索引 查数据库
    function findByUsername(username) {
      return user.findOne({
        where: {
          username: username,
          password : password
        }
      })
    }

    // 更改 user 表中的 cookie
    function changeCookie(cookie,username) {
      return user.update({
        cookie: cookie
      }, {
        where : {
          username : username
        }
      })
    }

    // 登录并返回
    async function loginAndReturn() {
      let is_exist = await findByUsername(username); // 是否存在 
      if (!is_exist) {
        // 不存在
        let err = { code: 1 };
        res.end(JSON.stringify(err));
      } else {
        // 存在
        // 用户登录后给 用户一个 cookie
        const cardId = Math.random() + Date.now();
        let user = is_exist.dataValues;
        session[cardId] = { user };
        console.log(user);
        res.cookie(SESSION_ID, cardId, { httpOnly: true, sameSite: 'strict' });
        // 存储 cookie
        await changeCookie(cardId,username);
        // 登录状态数组
        let data = {
          code : 2,
          // 是否成功登录
          IsloggedSuccessful: true,
          // notice_url
          notice_url: '@/assets/icon_notice.png',
          // 头像url
          avatar_src: '@/assets/avatar.png'
        }
        res.end(JSON.stringify(data));
      }
    }
     // 执行函数
     loginAndReturn();
  } else {
    // 不允许 此 url访问
    res.end('非法登录');
  }
})


// register接口
router.post('/register', function (req, res, next) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    // 允许携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.end() // OPTIONS请求不做任何处理
  }
  let origin = req.headers.origin;
  if (whiteList.includes(origin)) {
    // 设置哪个源可以访问我
    res.setHeader('Access-Control-Allow-Origin', origin);
    // 允许哪个方法访问我
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET');
    // 允许携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true);
    // 预检的存活时间
    res.setHeader('Access-Control-Max-Age', 6);

    // 用req.body引用请求体
    let { registerUsername, registerPhoneNumber, registerPassword } = req.body;
    console.log(registerUsername);
    // 对密码进行加密
    let md5 = crypto.createHash("md5"); // md5加密
    let md5Sum = md5.update(registerPassword); // 对密码进行加密
    let encryption_password = md5Sum.digest("Base64"); // Base64编码

    // 号码作为唯一 ID , 不能重复
    // 在数据库中查找 是否有 相同的 phone 
    function findByPhone(phone) {
      // 返回 promise
      return user.findOne({
        where: {
          phone: phone
        }
      })
    }

    // 创建数据
    function createByPhone(username, password, phone) {
      // 返回 promise
      return user.create({
        username: username,
        password: password,
        phone: phone,
        token: '',
        createAt: Date.now(),
        updatedAt: Date.now(),
        createUser: 'zero0011',
        updateUser: 'zero0011'
      })
    }

    // 查找是否有相同的 phone , 如果没有 , 则创建一项数据项 , 并返回前端(注册成功 , 以及一些信息)
    // 否则返回前端 , 号码已经被注册 
    (async function register() {
      let Isregister = await findByPhone(registerPhoneNumber);
      if (Isregister) {
        // 号码已经存在
        // 注册失败返回的数据
        var register_failure_data = {
          code: 4
        }
        res.json(register_failure_data)// 号码已经存在
      } else {
        // 号码未存在
        await createByPhone(registerUsername, encryption_password, registerPhoneNumber);
        // 注册成功

        // 注册成功的返回的数据
        var register_success_data = {
          code: 5, // 成功码
          IsregisterState: true, // 注册框是否弹出状态
          avatar_url: '@/assets/avatar2.png' // 头像地址
        }
        res.json(register_success_data);
      }
    })() // 先不执行函数
  }
})


// markdown 接口

router.post('/markdown' ,function(req ,res ,next) {

})



module.exports = router;
