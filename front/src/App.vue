<template>
  <div id="app">
    <!-- 头部 -->
    <div id="header">
      <div class="left"></div>
      <div class="middle">
        <!-- 中间内容 -->
        <ul class="middle_header">
          <!-- 图标 -->
          <li class="icon">
            <a href="/" class="logo">
              <img
                src="https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg"
                alt="掘金"
                class="logo-img"
              />
              <img
                src="https://b-gold-cdn.xitu.io/v3/static/img/simplify-logo.3e3c253.svg"
                alt="掘金"
                class="mobile"
              />
            </a>
          </li>
          <li v-for="item in items" :key="item" :class="item.classname">
            <router-link :to="item.router">{{item.name}}</router-link>
          </li>
          <!-- 搜索框 -->
          <li class="search">
            <el-input placeholder="搜索掘金" v-model="input" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </li>
          <!-- 写文章button -->
          <li class="write_button" :class="{none : !state_array.IsloggedSuccessful}">
            <el-dropdown split-button type="primary" @click="handleClick">
              写文章
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>发布热点</el-dropdown-item>
                <el-dropdown-item>分享链接</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <!-- 通知 -->
          <li class="notification" :class="{none : !state_array.IsloggedSuccessful}">
            <a href="/notification" target="_blank">
              <img :src="state_array.notice_url" alt />
            </a>
          </li>
          <!-- 头像 -->
          <li class="avatar" :class="{none : !state_array.IsloggedSuccessful}">
            <el-dropdown trigger="click">
              <el-avatar :size="30" :src="state_array.avatar_src"></el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-plus">写文章</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus">草稿</el-dropdown-item>
                <el-dropdown-item icon="el-icon-user-solid" divided="true">我的主页</el-dropdown-item>
                <el-dropdown-item icon="el-icon-check">我赞过的</el-dropdown-item>
                <el-dropdown-item icon="el-icon-star-on">我的收藏夹</el-dropdown-item>
                <el-dropdown-item icon="el-icon-check">已购</el-dropdown-item>
                <el-dropdown-item icon="el-icon-check">标签管理</el-dropdown-item>
                <el-dropdown-item icon="el-icon-s-tools" divided="true">设置</el-dropdown-item>
                <el-dropdown-item icon="el-icon-warning">关于</el-dropdown-item>
                <el-dropdown-item icon="el-icon-check">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <!-- 未登录的写文章 -->
          <li class="submit_icon" :class="{ none : state_array.IsloggedSuccessful}">
            <img src="https://b-gold-cdn.xitu.io/v3/static/img/submit-icon.53f4253.svg" alt />
          </li>
          <li class="submit_article" :class="{none : state_array.IsloggedSuccessful}">
            <span>写文章</span>
          </li>
          <!-- 登录 注册-->
          <li class="auth" :class="{none : state_array.IsloggedSuccessful}">
            <span class="login" @click="login">登录</span>
            <span class="register" @click="register">注册</span>
          </li>
        </ul>
      </div>
      <div class="right"></div>
    </div>
    <router-view></router-view>
    <!-- 内容 -->
    <Main />
    <!-- 登录框 -->
    <div :class="{ none : Islogged }">
      <Login :Islogged="Islogged" @changeState="changeState" @get_state_array="get_state_array"/>
    </div>
    <!-- 注册框 -->
     <div :class="{ none : IsRegister}" >
      <Register :IsRegister="IsRegister" @registerState="registerState"/>
    </div> 
  </div>
</template>

<script>
import Main from "@/components/main/main.vue";
import Login from "@/components/login/login.vue";
import Register from "@/components/register/register.vue"
export default {
  name: "App",
  data() {
    return {
      input : '',
      // 头标签数组
      items: [
        {
          classname: "home",
          router: "/",
          name: "首页"
        },
        {
          classname: "hot",
          router: "/hot",
          name: "沸点"
        },
        {
          classname: "topics",
          router: "/topics",
          name: "话题"
        },
        {
          classname: "books",
          router: "/books",
          name: "小册"
        },
        {
          classname: "events",
          router: "/events",
          name: "活动"
        }
      ],
      // 是否弹出登录框
      Islogged: true,
      // 是否弹出注册框
      IsRegister : true,
      // 登录成功后返回的数组 , 由login组件传递给 App
      state_array: {
        IsloggedSuccessful : false,
        notice_url : require('@/assets/icon_notice.png'),
        avatar_src : require('@/assets/avatar.png')
      }
    };
  },
  components: {
    Main, // 主要内容
    Login ,// 登录组件
    Register // 注册组件
  },
  methods: {
    // 登录
    login() {
      // 添加类名 , 使登录框显示
      this.Islogged = false;
    },
    // 子传父响应函数 , 登录状态
    changeState(value) {
      this.Islogged = value;
    },
    // 子传父响应函数 
    get_state_array(value) {
       value = JSON.parse(value);
      // 对 state_array 进行重新赋值
      this.state_array.IsloggedSuccessful = value.IsloggedSuccessful;
      // 一般 url , 客户端直接传递一个url字符串 , 这里本地文件就无法重新赋值

      // 对登录弹出框状态赋值
      this.Islogged = value.IsloggedSuccessful;
    },
    // 注册函数
    register() {
      // 添加类名 , 使注册框显示
      this.IsRegister = false;
    },
    // 子传父 , 注册状态
    registerState(value) {
      this.IsRegister = value;
    },
    handleClick() {}
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, Helvetica Neue,
    PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  text-rendering: optimizeLegibility;
  color: #333;
  background-color: #f4f5f5;
}
#header {
  height: 4.2rem;
  border: 1px solid #f1f1f1;
  background-color: #fff;
}
.left,
.header_tag_left {
  float: left;
  width: 255px;
  height: 100%;
}
.right,
.header_tag_right {
  float: right;
  width: 300px;
  height: 100%;
}
.middle,
.header_tag_middle {
  position: absolute;
  left: 255px;
  right: 255px;
  max-width: 1000px;
  word-wrap: break-word;
}
.middle_header {
  padding: 0;
  margin: 0;
  list-style: none;
  /* flex布局 */
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 4.2rem;
}
.middle_header li {
  list-style: none;
}
.icon {
  min-width: 98px;
  margin-right: 2rem;
  width: 10px;
  margin: 1rem 0 0 1rem;
}
.icon img {
  width: auto;
  height: auto;
  border-style: none;
}
.icon .mobile {
  display: none;
}
.home,
.hot,
.topics,
.books,
.events {
  margin: 1.5rem 0.3rem 0 3rem;
  color: #71777c;
}
.middle_header a {
  text-decoration: none;
  cursor: pointer;
  color: #71777c;
}
.middle_header a:hover {
  color: #007fff;
}
.search {
  margin-top: 1rem;
  margin-left: 5rem;
  min-width: 7rem;
  width: 10rem;
}
.write_button {
  margin-top: 1rem;
  margin-left: 2rem;
}
.notification {
  margin-left: 1rem;
  margin-top: 1.5rem;
}
.avatar {
  margin-left: 1rem;
  margin-top: 1.1rem;
  cursor: pointer;
}

.submit_icon {
  color: #007fff;
  position: relative;
  cursor: pointer;
}
.submit_icon img {
  width: auto;
  height: auto;
  border-style: none;
  margin-top: 1.5rem;
  margin-left: 2rem;
}
.submit_article {
  margin-top: 1.52rem;
  color: #007fff;
  cursor: pointer;
}
.auth {
  color: #007fff;
  margin-top: 1.52rem;
  margin-left: 1.15rem;
  box-sizing: border-box;
  cursor: pointer;
}

/* 是否显示 */

.none {
  display: none;
}
</style>
