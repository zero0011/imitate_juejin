var Sequelize = require('sequelize');
var sequelize = require('../app.js');

var user = sequelize.define('users',{
    id : {
        type : Sequelize.BIGINT(11),
        primaryKey : true ,// 主键
        allowNull : false,
        unique : true,
        autoIncrement : true, // 自增
        comment : '自增id' // 注释 : 只在代码中有效
    },
    username : Sequelize.STRING(50), // 用户名
    // 密码
    password : {
        type : Sequelize.STRING(50),
        allowNull : false // 不允许为 null
    }, 
    // token
    token : {
        type : Sequelize.UUID,
    },
    // cookie
    cookie : {
        type : Sequelize.STRING(50)
    },
    phone : Sequelize.STRING(50), // 电话号码

    // 文章
    article : {
        type : Sequelize.TEXT
    },

    // 文本标题
    title : {
        type : Sequelize.STRING(50)
    },

    // 文本点赞数
    like_count : {
        type : Sequelize.INTEGER
    },

    // 文本讨论数
    comment_count : {
        type : Sequelize.INTEGER
    },

    // 封面图片
    image : {
        type : Sequelize.BLOB
    },

    // 创建时间
    createAt : {
        type : Sequelize.DATE,
        defaultValue : Sequelize.NOW
    },

    // 更新时间
    updatedAt : {
        type : Sequelize.DATE,
        defaultValue : Sequelize.NOW
    }, 

    createUser : Sequelize.STRING, // 创建者

    updateUser : Sequelize.STRING // 更新者
},{
    timestamps : false // 不要默认时间戳
});

// 同步 : 没有就新建 ,有就不变
// user.sync();

// 强制同步 , 先删除后同步
user.sync({
    force : true
})

module.exports = user;