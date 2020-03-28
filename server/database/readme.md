# Node Web 开发 ORM框架 Sequelize

## 1.什么是 ORM
    ORM 是 [对象关系映射] , 全称为 Object Relational Mapping , 它是一种程序设计技术.
    ORM 用来把对象模型表示的对象 , 映射到基于 SQL的关系模型数据库结构中去。 这样 , 我们在具体的操作数据库时 , 就不需要再和复杂的 SQL语句打交道, 只需要操作实体对象的属性和 方法, 就达到了操作数据库的效果。

note : 使用 cmd 创建数据库 
    >mysql -u root -p 123456
    >create database 数据库名字

## 常见 Sequelize 数据类型
    Sequelize.STRING() // 字符串 , 长度默认255 , VARCHAR(255)
    Sequelize.STRING(1234)  //设定长度的字符串,VARCHAR(1234)
    Sequelize.TEXT           //长字符串,文本 TEXT
    Sequelize.TEXT('tiny')   //小文本字符串,TINYTEXT

    Sequelize.INTEGER      //int数字,int
    Sequelize.BIGINT       //更大的数字,BIGINT
    Sequelize.BIGINT(11)   //设定长度的数字,BIGINT(11)

    Sequelize.FLOAT        //浮点类型,FLOAT

    Sequelize.DATE    // 日期类型

    Sequelize.UUID  //MySQL是CHAR(36)类型

    Sequelize.BOOLEAN   // int类型,长度为1,TINYINT(1)

## sequelize 的配置
1. config.js 配置文件 

        var config = {
        database : 'juejin', // 使用哪个数据库
        username : 'root', // 用户名
        password : '123456', // 口令
        host : 'localhost', // 主机名
        port : 3306 // 端口号 , mysql 默认 3306
    };

2. 创建连接对象 ， 并模块化
    app.js

3. tables 
    表目录

4. /tables/user.js
    用户表



## sequelize 的 增删改查
    sql语句     orm

    select      findAll ,  findOne , findById , findOrCreate , findAndCountAll
    update
    insert
    delete
