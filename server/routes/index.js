var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

// 引入获取 cookie 中间件
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// // 引入加密模块
var crypto = require('crypto');
var path = require('path');

// 引入 fse ， fs额外模块
var fse = require('fs-extra');


// 解析 application/json
app.use(bodyParser.json());
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// 解析 formData
var multiparty = require('multiparty');

// 原文件路径
const sourceFile = path.resolve(__dirname, '..', 'public/images');

// 目标路径
const targetFile = path.resolve(__dirname, '..', 'storage/images');

console.log(targetFile)


// 读写流
const pipeStream = (path, writeStream) => {
  new Promise(resolve => {
    // 创建可读流
    const readStream = fse.createReadStream(path);
    readStream.on("end", () => {
      fse.unlinkSync(path);
      resolve();
    });
    // 管道
    readStream.pipe(writeStream);
  })
}

// 合并切片
const mergeFileChunk = async (sourceFile, targetFile, size, filename) => {
  sourceFile = path.resolve(sourceFile, filename);
  targetFile = path.resolve(targetFile, filename);
  // 读取原目录下所有 文件名
  const chunkPaths = await fse.readdirSync(sourceFile);
  // 根据切片下标进行排序 , 从小到大
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
  await Promise.all(
    chunkPaths.map((chunkPath, index) => {
      pipeStream(
        path.resolve(sourceFile, chunkPath),
        // 指定位置创建可写流
        fse.createWriteStream(targetFile, {
          start: index * size,
        })
      )
    })
  )
}


// 引入 users 表 , 实现 增删改查
var user = require('../database/tables/user.js');


// session 状态 , 用于与 cookie 协作 , 前端只需要携带 cookie ,即可登录 , 无需每次都携带 用户信息
let SESSION_ID = 'connect.sid';
let session = {};


let whiteList = ['http://localhost:8080']; // 设置白名单

// 跨域设置
app.use(function (req, res, next) {
  let origin = req.headers.origin
  if (whiteList.includes(origin)) {
    // 设置哪个源可以访问我
    res.setHeader('Access-Control-Allow-Origin', origin)
    // 允许携带哪个头访问我
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // 允许哪个方法访问我
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    // 预检的存活时间
    // res.setHeader('Access-Control-Max-Age', 6)
    if (req.method === 'OPTIONS') {
      res.end() // OPTIONS请求不做任何处理
    }
  }
  next();
})

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

    // 对 password 进行 md5 消息摘要
    let md5 = crypto.createHash("md5");
    let md5Sum = md5.update(password);
    let encryption_password = md5Sum.digest("base64");
    // 查找数据库 , 以 username 为索引 , 查找是否存在 , 如果有 用户对应的 数据 , 并把对应的 cookie 存在数据中

    // 以 username 和 password为索引 查数据库
    function findByUsername(username, password) {
      return user.findOne({
        where: {
          username: username,
          password: password
        }
      })
    }

    // 更改 user 表中的 cookie
    function changeCookie(cookie, username) {
      return user.update({
        cookie: cookie
      }, {
        where: {
          username: username
        }
      })
    }

    // 登录并返回
    (async function loginAndReturn() {
      let is_exist = await findByUsername(username, encryption_password); // 是否存在
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
        res.cookie(SESSION_ID, cardId, { httpOnly: true, sameSite: 'strict' });
        // 存储 cookie
        await changeCookie(cardId, username);
        // 登录状态数组
        let data = {
          code: 2,
          // 是否成功登录
          IsloggedSuccessful: true,
          // notice_url
          notice_url: '@/assets/icon_notice.png',
          // 头像url
          avatar_src: '@/assets/avatar.png'
        }
        res.end(JSON.stringify(data));
      }
    })()//自执行函数

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


// markdown 文本 接口

const markdown_data = [];

router.post('/markdown', function (req, res, next) {
  // 跨域设置
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
    let { text, hash } = req.body;
    markdown_data[hash] = text
    res.json({
      code: 6
    })
  }
})


// markdown 文本 合并接口 , 并把 完整文本存储到数据库
router.post('/merge_markdown', function (req, res, next) {
  // 跨域设置
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
    let { length } = req.body;
    if (length == markdown_data.length) {
      // 全部接收完毕
      let merge_markdown = markdown_data.join("");

      // 会话 id
      let session_id = req.cookies[SESSION_ID];
      let userInfo = session[session_id];
      // 文本 存储到数据库
      function storageText(username, text) {
        user.update({
          article: text
        }, {
          where: {
            username: username
          }
        })
      }

      // 读取数据库中的
      let return_data = {
        href : '',
        author : '',
        time : Date.now(),
        title : '',
        tags : [
          {
            id : 1,
            class : 'like',
            src : "https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg",
            count : 18
          },
          {
            id : 2,
            class : 'comment',
            src : 'https://b-gold-cdn.xitu.io/v3/static/img/comment.4d5744f.svg',
            count : 1
          },
          {
            id : 3,
            class : 'share',
            src : 'https://b-gold-cdn.xitu.io/v3/static/img/share.1d55e69.svg',
            count : ''
          }
        ]
      };
      

      // 存储到数据库并返回
      async function storageAndReturn() {
        await storageText(userInfo.user.username, merge_markdown);

        res.json({
          code: 7, // 返回代码
          return_data
        })
      } // 自执行函数
      storageAndReturn();
    } else {
      // 数据丢失
      res.json({
        code: 8
      })
    }
  }
})


// markdown 图片接口
router.post('/markdown_image', function (req, res, next) {
  // 生成 multiparty 对象 
  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    if (err) {
      return;
    }
    const [chunk] = files.chunk;
    const [hash] = fields.hash;
    const [filename] = fields.filename;
    //  目标文件目录
    const chunkDir = path.resolve(sourceFile, filename);

    function IsExist(chunkDir) {
      // 切片目录不存在 , 创建切片目录
      if (!fse.exists(chunkDir)) {
        fse.mkdir(chunkDir);
      } else {
        return;
      }
    }

    function MoveFile(source, target) {
      fse.move(source, target)
    }

    // 1. 检测 目标目录是否存在 , 不存在 则创建该目录 
    // 2. 把文件写进目标目录
    (async function () {
      await IsExist(chunkDir);
      await MoveFile(chunk.path, `${chunkDir}/${hash}`);
      res.json({
        code: 0,
        mess: 'request_success'
      })
    })() // 自执行函数
  })
})

// markdown 图片合并接口
router.post('/merge_image', async function (req, res, next) {
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

    const { filename, size } = req.body;
    console.log(filename, size)
    // 合并切片
    await mergeFileChunk(sourceFile, targetFile, size, filename);
    res.end(
      JSON.stringify({
        code: 1,
        mess: 'merfe_success'
      })
    )
  }
})




module.exports = router;
