<template>
  <!-- 登录注册表 -->
  <div class="box">
    <div class="form">
      <div class="panfish">
        <img src="https://b-gold-cdn.xitu.io/v3/static/img/normal.0447fe9.png" style class="normal" />
        <img
          src="https://b-gold-cdn.xitu.io/v3/static/img/greeting.1415c1c.png"
          class="greeting"
          style="display: none"
        />
        <img
          src="https://b-gold-cdn.xitu.io/v3/static/img/blindfold.58ce423.png"
          class="blindfold"
          style="display: none"
        />
      </div>
      <i class="close-btn ion-close-round" title="关闭" @click="close"></i>
      <div class="panel">
        <h1 class="title">登录</h1>
        <div class="input-group">
          <div class="input-box">
            <input
              type="text"
              maxlength="64"
              placeholder="请输入手机号或邮箱"
              class="input"
              v-model="username"
              name="username"
            />
          </div>
          <div class="input-box">
            <input
              type="text"
              maxlength="64"
              placeholder="请输入密码"
              class="input"
              v-model="password"
              name="password"
            />
          </div>
        </div>
        <button class="btn" @click="login" type="submit">登录</button>
        <div class="prompt-box">
          没有账号?
          <span class="clickable">注册</span>
          <a href="/reset-password" class="floatright clickable">忘记密码</a>
        </div>
      </div>
      <div class="oauth-box">
        <div class="hint">第三方账号登录:</div>
        <div class="oauth">
          <div v-for="item in items" :key="item.id" class="oauth-bg">
            <img :src="item.src" :title="item.title" :alt="item.alt" class="oauth-btn" />
          </div>
        </div>
      </div>
      <div class="agreement-box">
        注册登录即可表示同意
        <a href="/terms" target="_blank">用户协议</a>
        ,
        <a href="/privacy" target="_blank">隐私政策</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      items: [
        {
          id : 1,
          title: "微博",
          alt: "微博",
          src: "https://b-gold-cdn.xitu.io/v3/static/img/weibo.fa758eb.svg"
        },
        {
          id : 2,
          title: "微信",
          alt: "微信",
          src: "https://b-gold-cdn.xitu.io/v3/static/img/wechat.e0ff124.svg"
        },
        {
          id : 3,
          title: "GitHub",
          alt: "GitHub",
          src: "https://b-gold-cdn.xitu.io/v3/static/img/github.547dd8a.svg"
        }
      ],
      // 用户名
      username : '',
      // 密码 
      password : '',
      
    };
  },
  methods : {
      // 关闭弹出
      close () {
        this.$emit('changeState',true);
      },
      // 登录功能
      login () {
        let data ={
          username : this.username,
          password : this.password,
        };
        this.$ajax.request({
          url : '/login', // 登录接口
          method : 'post',
          data : data
        })
        // 登录成功后返回数组 , 并传递给 App父组件
        .then(res => {
          // 成功返回
          // 传递给 App.vue
          this.$emit('get_state_array',res);
        })
        .catch(err => {
          console.log(err)
        })
      }
  },
  props : {
    // 是否登录
    Islogged :Boolean,
  }
};
</script>

<style>
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 500;
}
.form {
  position: relative;
  padding: 2rem;
  width: 22rem;
  max-width: 100%;
  font-size: 1.167rem;
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
}
.panfish {
  font-size: 1.167rem;
}
.panfish .normal {
  position: absolute;
  top: 0;
  left: 50%;
  width: 7.5rem;
  transform: translate(-50%, -83%);
  z-index: 1;
}
.panfish .greeting {
  position: absolute;
  top: 0;
  left: 50%;
  width: 7.5rem;
  transform: translate(-50%, -75.8%);
  z-index: 1;
}
.panfish .blindfold {
  position: absolute;
  top: 0;
  left: 50%;
  width: 7.5rem;
  transform: translate(-50%, -75%);
  z-index: 1;
}
.close-btn {
  float: right;
  cursor: pointer;
  opacity: 0.4;
  content: "\2716";
  color: #b20610;
}
.close-btn ::before {
  content: "\2716";
  color: #b20610;
}
.ion-close-round {
  cursor: pointer;
  position: absolute;
  right: 12px;
  top: 0;
  bottom: 0;
  margin-top: 2.5rem;
  width: 20px;
  height:4px;
  background-color: #55acee;
  transform: rotate(45deg);
}
.ion-close-round::after {
  cursor: pointer;
  content:'';
  display:block;
  width: 20px;
  height:5px;
  background-color: #55acee;
  transform: rotate(90deg);
}
.panel {
  font-size: 0.9rem;
}
.panel h1 {
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
.panel .title {
  font-size: 1.3rem;
  margin: 0 0 2rem;
}
.input-group {
  margin-bottom: 0.5rem;
  overflow: hidden;
}
.input-box {
  position: relative;
  margin-bottom: 0.8rem;
}
.input {
  padding: 10px;
  width: 100%;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  outline: none;
  box-sizing: border-box;
}
.btn {
  width: 100%;
  height: 2.5rem;
  color: #fff;
  background-color: #007fff;
  border-radius: 2px;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
}
button {
  -webkit-appearance: none;
  appearance: none;
  background-color: #007fff;
  color: #fff;
  border-radius: 2px;
  border: none;
  padding: 0.5rem 1.3rem;
  outline: none;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
}
.prompt-box {
  margin: 1rem 0 0;
  color: #767676;
}
.clickable {
  color: #007fff;
  cursor: pointer;
}
.floatright {
  float: right;
}
a {
  text-decoration: none;
  margin: initial;
}
.oauth-box {
  margin-top: 0.8rem;
  line-height: 1.9rem;
  color: #767676;
}
.oauth {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 10px;
}
.oauth-bg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f4f8fb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}
.hint {
  font-size: 0.9rem;
  color: #767676;
}
.agreement-box {
  margin-top: 1.2rem;
  color: #767676;
  font-size: 0.9rem;
}
.agreement-box a {
  color: #007fff;
  text-decoration: none;
  cursor: pointer;
  margin: initial;
}
</style>