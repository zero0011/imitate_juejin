
let corp = {}; // 自定义一个对象
// 这里放一个列表用来缓存回调函数
corp.list = {};
// 订阅事件
corp.on = function(key,fn) {
    // 如果对象中没有对应的 key 值
    // 也就是说明没有订阅过
    // 那就给 key 创建个 缓存列表
    if(!this.list[key]) {
        this.list[key] = []
    }
    // 把函数添加对应 key 的缓存列表里
    this.list[key].push(fn)
}

// 发布事件
corp.emit = function() {
    // 第一个参数是对应的 key 值
    // 直接用数组的 shift 方法取出
    // console.log(arguments) // 函数参数的类数组
    let key = Array.prototype.shift.call(arguments);
    let fns = this.list[key];
    console.log(fns)
    // 如果缓存列表里没有函数就返回 false
    if (!fns || fns.length === 0) {
        return false;
    }
    // 遍历 key 值对应的 缓存列表
    // 依次执行函数的方法
    fns.forEach(fn => {
        fn.apply(this, arguments);
    });
}

// 测试



/**
 * 通用的 发布订阅
 */

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

let data  = {
    username : 'zs'
}

event.on('get_data',(message) => {
    console.log(message)
})

event.on('get_data',(message) => {
    console.log(JSON.stringify(message))
})
event.remove('get_data')
event.emit('get_data',data);



