# juejin

## 运行

npm i 

npm run dev


## 前端 md5 加密
1. 安装
 npm install crypto --save

 
## 状态管理 , EventBus(兄弟组件通信)

1. 首先 , 在main.js 文件中定义 一个 eventBus 对象 , 其实就是一个全新的 Vue实例

2. 接着在 兄弟组件中引入 main.js


###  自己实现一个 发布订阅模式 , 实现一个 EventEmitter
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
- on方法用来把回调函数 fn 都加到缓存列表中
- emit 方法取到 arguments 里第一个当做 key , 根据 key 值去执行对应缓存列表中的函数
- remove方法可以根据 key 值取消订阅

## 状态管理 , Vuex

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


