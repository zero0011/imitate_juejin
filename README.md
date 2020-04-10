# 模仿掘金

## 前端

### 运行
npm i

npm run dev

### 前端 md5 加密
1. 安装
 npm install crypto --save

### 状态管理 , EventBus(兄弟组件通信)
1. 首先 , 在main.js 文件中定义 一个 eventBus 对象 , 其实就是一个全新的 Vue实例

2. 接着在 兄弟组件中引入 main.js

#### 自己实现一个 发布订阅模式 , 实现一个 EventEmitter
 Vue 中 , emit和 on 方法. 他们都带有 类似发布订阅模式 , EventBus的原理

    let event = {
        list : {},
        on (key ,fn) {
        if(!this.list[key]) {
            this.list[key] = [];
        }
        this.list[key].push(fn)
        },
        emit() {
            let key = Array.prototype.shift.call(arguments);
            fns = this.list[key];

            if(!fns || fns.length === 0) {
                return false;
            }

            fns.forEach(fn => {
                fn.apply(this, arguments);
            })
        },
        // 取消订阅的方法
        remove(key, fn) {
            let fns = this.list[key];
            // 如果缓存列表中没有函数 , 返回 false
            if(!fns) return false;
            // 如果没有传对应函数的话 , 就会将 key 值对应缓存列表中的函数都情况掉
            if(!fn) {
                fns && (fns.length = 0)
            } else {
                // 遍历缓存列表 , 看看传入的 fn 与 哪个函数相同
                // 如果相同就直接从缓存列表中删除即可
                fns.forEach((cb ,i) => {
                    if(cb === fn) {
                        fns.splice(i,1)
                    }
                })
            }
        }
    }





#### 思路
- 创建一个对象(缓存列表)
- on 方法用来把回调函数 fn 都加到缓存列表中
- emit 方法取到 arguments 里第一个参数 key , 根据 key 值去执行对应缓存列表中的函数
- remove 方法根据 key 值取消订阅
### vuex , 状态管理
- state 用来数据共享数据存储
    state : {
        // 存放的键值对 就是所要管理的状态
        name : 'hw'
    }

    使用
    this.$store.state.name

- mutation 用来注册改变数据状态
    mutation 是操作数据的方法的集合 , 比如对该数据的修改 , 增加, 删除等待

    mutation 方法都有默认的行参
    ([state],[payload])
   1. state 是当前 vuex 对象中的 state
   2. payload 是该方法在被调用时传递参数使用的

   在组件中 , 我们需要这样去调用这个 mutation
   this.$store.commit('edit')

- getters 用来对共享数据进行过滤操作
    getters 可以对 state 中的成员加工后传递给外界
    
    getters 中方法有两默认参数
    1. state 当前 vuex对象中的状态对象
    2. getters 当前 getters 对象 , 用于将 getters 下其他 getter 拿来用

    组件中调用
    this.$store.getters.nameInfo

    note : 类似于 computed 计算属性

- actions 解决异步改变共享数据
    由于直接在 mutation 方法中进行异步操作 , 将会引起数据失效 .所以提供了 actions 来进行专门进行异步操作 , 最终提交 mutation 方法

    actions 中的方法有两个默认参数
    1. context 上下文()对象
    2. payload 挂载参数

    异步操作 , 需要使用 actions
    aEdit(context,payload) {
        setTimeout(() => {
            context.commit('edit',payload)
        },2000)
    }
    
    组件中调用
    this.$store.dispatch('aEdit',15)
    
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
    
### 运行
npm start

### 路由接口
    
#### login接口
ruoter.post('/login')

#### register接口
routor.post('/register')

#### markdown接口
    1. 用于把前端传递的 markdown (html) 数据保存在 数据库中
    2. 如果传递了封面图片 , 则把图片也传递给后端 , 并且存储到数据库中(分割图片)
#### 难点
    怎么用 sequelize 把 图片存储到 mysql 中

### 加密
从接口中获得用户信息之后 , 存到数据库之前 , 必须加密一下 , 以防止数据库中密码被窃取

    就直接用最简单的 md5 加密 , 虽然这样安全性并不高

#### MD5
md5 是开发中经常使用的算法之一 , 官方称为摘要算法 , 具有以下几个特点
 - 不可逆
 - 不管加密的内容多长 , 最后输出的结果长度都是相等的
 - 内容不同输出的结果完全不同 ,  内容相同输出的结果完全相同



## 数据库
 mysql

### 连接数据库 使用 sequelize 工具
    1.1 安装 sequelize 
        npm install --save sequelize
    1.2 sequelize 的 增删改查
    sequelize.findOne
### sequelize 的 增删改查
 - user.findOne
    查找一个
 - 查找所有 => 返回一个数组
   user.findAll

 - 更新 
   user.update

## git 的基本用法
- git add
- git commit -m ''
- git push