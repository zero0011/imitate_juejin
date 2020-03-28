<template>
  <div class="auth-modal-box">
    <div class="auth-form">
      <i class="close-btn ion-close-round" @click="close"></i>
      <div class="panel">
        <h1 class="title">注册</h1>
        <div class="input-group">
          <!-- 用户名 -->
          <div class="input-box">
            <input type="text" name="registerUsername" maxlength="20" placeholder="请输入用户名" class="input" v-model="registerUsername">
          </div>
          <!-- 手机号 -->
          <div class="input-box">
            <input type="text" name="registerPhoneNumber" maxlength="20" placeholder="请输入手机号" class="input" v-model="registerPhoneNumber">
          </div>
          <!-- 密码 -->
          <div class="input-box">
            <input type="password" name="registerPassword" maxlength="20" placeholder="请输入密码(不少于6 位)" class="input" v-model="registerPassword">
          </div>
        </div>
        <!-- 注册按键 -->
        <button class="btn" @click="register">注册</button>

        <!-- 已有账号登录 -->
        <div class="prompt-box center">
          <span class="clickable">已有账号登录</span>
        </div>
        <div class="agreement-box">
          注册登录即表示同意
          <a href="/terms" target="_blank">用户协议</a>
          ，
          <a href="/privacy" target="_blank">隐私政策</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "register",
  data() {
    return {
      // 用户名
      registerUsername: "",
      // 手机号
      registerPhoneNumber: "",
      // 密码
      registerPassword: ""
    };
  },
  props: {
    IsRegister: Boolean
  },
  methods: {
    //关闭按键
    close() {
      this.$emit("registerState", true);
    },
    // 注册按键
    register() {
      // 注册数据
      let data = {
        registerUsername : this.registerUsername,
        registerPhoneNumber : this.registerPhoneNumber,
        registerPassword : this.registerPassword
      }
      this.$ajax.request({
        url : '/register' ,// 注册接口
        method : 'POST',
        data : data
      })
      .then(res => {
        res = JSON.parse(res)
        if(res.code === 4) {
          console.log('号码已经存在');
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
};
</script>

<style>
.auth-modal-box {
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
.auth-form {
  position: relative;
  padding: 1.7rem;
  width: 20rem;
  max-width: 100%;
  font-size: 1rem;
  background-color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
}
.close-btn {
  float: right;
  cursor: pointer;
  opacity: 0.4;
}
.close-btn::before {
  content: "";
}
.register-title {
  font-size: 1.2rem;
  margin: 0 0 1.7rem;
}
.input-group {
  margin-bottom: 0.3rem;
  overflow: hidden;
}
.btn {
  width: 100%;
  height: 2.9rem;
  color: white;
  background-color: #007fff;
  border-radius: 2px;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
}
.prompt-box {
  text-align: center;
}
.clickable {
  color: #007fff;
  cursor: pointer;
}
.agreement-box {
  margin-top: 1.3rem;
  color: #767676;
}
</style>