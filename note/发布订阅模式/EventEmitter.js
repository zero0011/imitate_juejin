/**
 * @description {手写发布订阅}
 */


 function EventEmitter() {
     // 用 Object.create(null) 代替空对象 {}
     // 好处是 无杂质 , 不继承原型链的方法
     this._events = Object.create(null);
 }

 EventEmitter.defaultMaxListeners = 10;

 // 同 on 方法
 EventEmitter.prototype.addLisetener = EventEmitter.prototype.on;

 // 返回监听的事件名
 EventEmitter.prototype.eventNames = function() {
     return Object.keys(this._events);
 }
 
 // 设置最大监听数
 EventEmitter.prototype.setMaxListeners = function(n) {
     this._count = n;
 }

 // 返回监听数
 EventEmitter.prototype.getMaxListeners = function() {
     return this._count ? this._count : this.defaultMaxListeners;
 }

 // 监听
 EventEmitter.prototype.on = function(type,cb , flag) {
    //默认值 , 如果没有 _events 的话 , 就给他创建一个
    if(!this._events) {
        this._events = Object.create(null);
    }
    // 不是 newListener 就应该让 newListener 执行以下
    if(type !== 'newListener') {
        this._events['newListener'] && this._events['newListener'].foreach(listener => {
            listener(type);
        })
    }
    if(this._events[type]) {
        // 根据传入的 flag 来决定是向前还是向后添加
        if(flag) {
            this._events[type].unshift(cb);
        } else {
            this._events[type].push(cb)
        }
    }
    //监听的事件不能超过了设置的最大监听数
    if(this._events[type].length === this.getMaxListeners()) {
        console.warn('警告')
    }
 };

 EventEmitter.prototype.removeAllListener = function () {
    this._events = Object.create(null);
};

// 返回所有的监听类型
EventEmitter.prototype.listeners = function (type) {
    return this._events[type];
};

//发布
EventEmitter.prototype.emit = function(type, ...args) {
    if(this._events[type]) {
        this._events[type].foreach(listener => {
            listener.call(this, ...args)
        })
    }
}

let events = new EventEmitter();

events.on('get_data',function(mess) {
    console.log(mess)
})

events.emit('get_data','66')