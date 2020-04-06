# 模仿掘金

## 前端

### 功能
#### 1. 登录
    查找数据 , 查看是否有已经存在的用户数据 , 有则返回 对应的数据(比如对应的头像) , 否则 返回 未注册
#### 2. 注册 
    2.1 手机验证 为识别 请求验证的 是 人 , 而非机器
    2.2 注册成功后 , 返回 cookie , 并返回默认头像 , 以及 登录显示状态

#### 3. 写文章
    设计思路
    3.1 通过写文章点击按键 , 来引导到 写文章页面 
#### 3.2 在 vue项目中 使用 markdown 
    1. 安装 mavonEditor
    npm install mavon-editor --save
    2. Vue 项目中引入 mavonEditor
    import { mavonEditor } from "mavon-editor";
    import "mavon-editor/dist/css/index.css";
    3. 难点和重点
        当点击保存按键时 , 把 markdown 数据 传递个后端(难点)
    
        如果有存在封面图片 , 把图片也传递给后端(难点)
##### 难点 => 大文件上传
 - 前端
 1. 获得文件对象 file
    <input type='file'>
 2. 生成文件切片
    const size = 1024; // 切片大小
    let cur = 0;
    file.slice(cur, cur + size)

 3. 并发上传切片
    ajax + Promise.all  
    发送 formData 

 4. 发送合并请求
    function mergeRequest() {}
    发送 file.size , file.name

 - 后端
 1. 跨域处理
    res.setHeader("Access-Control-Allow-Origin", "*");
 2. 接收切片
    使用 使用 multiparty 包处理前端传来的 FormData
 3. 合并切片
    3.1 对 切片进行排序
    3.2 合并切片
        创建读写流 , 
        const readStream = fs.createReadStream(path);
        readStream.pipe(wirteStream);
    并发合并切片

#### 4. 发表文章



## 后端
### 连接数据库 使用 sequelize 工具
    1.1 安装 sequelize 
        npm install --save sequelize
    1.2 sequelize 的 增删改查
    sequelize.findOne
    
### 路由接口
    
#### login接口

#### register接口

#### markdown接口
    1. 用于把前端传递的 markdown (html) 数据保存在 数据库中
    2. 如果传递了封面图片 , 则把图片也传递给后端 , 并且存储到数据库中(分割图片)
#### 难点
    怎么用 sequelize 把 图片存储到 mysql 中
    
## 数据库
 mysql



# git 的基本用法