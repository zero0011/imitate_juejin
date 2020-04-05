
function EventEmitter() {
    // 用户 Object.create(null) 代替 空对象 {}
    // 好处是无杂质 , 不继承原型链的 方法
    this._events = Object.create(null);
}

// 默认最多的绑定次数
EventEmitter.defaultMaxListeners = 10;
// 同 on 方法
EventEmitter.prototype.addListener = EventEmitter.prototype.on;
// 返回监听的事件名
EventEmitter.prototype.eventNames = function() {
    return Object.keys(this._events);
};
// 设置最大监听数
EventEmitter.prototype.setMaxListeners = function(n) {
    this._count = n;
}
// 返回监听数
EventEmitter.prototype.getMaxListeners = function () {
    return this._count ? this._count : this.defaultMaxListeners;
};
// 监听
EventEmitter.prototype.on = function(type, cb , flag) {
    // 默认值，如果没有_events的话，就给它创建一个
    if (!this._events) {
        this._events = Object.create(null);
    }
    // 不是 newListener 就应该让 newListener 执行以下
    if(type !== 'newListener') {
        this._events['newListener'] && this._events['newListener'].forEach(listener => {
            listener(type);
        })
    }
    if(this._events[type]) {
        // 根据传入的 flag 来决定是向前还是向后添加
        if(flag) {
            this._events[type].unshift(cb);
        } else {
            this._events[type].push(cb);
        }
    } else {
        this._events[type] = [cb];
    }
    // 监听的事件不能超过了设置的最大监听数

}

