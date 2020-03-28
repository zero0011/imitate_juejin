const Sequelize = require('sequelize');
const config = require('./config.js');

var sequelize = new Sequelize(config.database,config.username,config.password, {
    host : config.host,// 自定义链接地址 , 默认本机 localhost
    dialect : 'mysql',// 数据库类型 , 支持 'mysql' , 'sqlite'
    port : config.port, // 自定义端口 , 默认 3306
    // 连接池配置
    pool: {
        max : 5,
        min : 0,
        idle : 30000
    },
    // 是否开启日志 , 默认使用 console.log
    // 建议开启 , 方便对照生成的 sql 语句
    logging : true,
    // 是否同步 , 强制同步
    sync : { force : false }
})

module.exports = sequelize;