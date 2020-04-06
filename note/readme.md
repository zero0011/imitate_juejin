# 写项目时的笔记

## 手写发布订阅 , EventEmiiter

### 思路
- 创建一个对象(缓存列表)
- on方法用来把回调函数 fn 都加到缓存列表中
- emit 方法取到 arguments 里第一个当做 key , 根据 key 值去执行对应缓存列表中的函数
- remove方法可以根据 key 值取消订阅