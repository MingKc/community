<template>
  <div class="login-container">
    <!-- 登录 -->
    <div class="login-box">
      <!-- 头像 -->
      <div class="logo-box">
        <img src="../assets/logo.jpg" @click="reverse">
      </div>
      <!-- 登录表单 -->
      <el-form ref="loginFormRef" label-width="0px" :model="loginForm" :rules="loginCheck" status-icon class="login-form">
        <!-- 用户名 -->
        <el-form-item  prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-orange" show-password></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 注册 -->
    <div class="register-box reverse">
      <!-- 头像 -->
      <div class="logo-box">
        <img src="../assets/register.jpg" @click="reverse">
      </div>
      <!-- 注册表单 -->
      <el-form ref="registerFormRef" label-width="0px" :model="registerForm" :rules="registerCheck" status-icon class="login-form">
        <!-- 用户名 -->
        <el-form-item  prop="username">
          <el-input v-model="registerForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" prefix-icon="el-icon-orange" show-password></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="repassword">
          <el-input v-model="registerForm.repassword" prefix-icon="el-icon-orange" show-password></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="register">注册</el-button>
          <el-button type="info" @click="resetRegister">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    data(){
      const passreg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,18}$/
      const namereg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{6,12}$/
      var validateUsername = async (rule, value, callback) => {
        if (!namereg.test(value)) {
          callback(new Error('请输入用户名,用户名由6-12位数字、字母或字符组成！'))
        } else {
          var params = new URLSearchParams()
          params.append('username', value)
          const ret = await this.axios.post('user/check', params)
          if(ret.meta.status !== 200){
            callback(new Error('用户名已存在，请重新输入！'))
          }
          callback()
        }
      }
      var validatePass = (rule, value, callback) => {
        if (!passreg.test(value)) {
          callback(new Error('请输入密码,密码由6-18位数字、字母或字符组成！'))
        } else {
          if (this.registerForm.password !== '') {
            this.$refs.registerFormRef.validateField('repassword')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (!passreg.test(value)) {
          callback(new Error('请再次输入密码！'))
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
      // 控制登录和注册页面 
      flag: true,
      // 登录表单数据绑定
      loginForm: {
        username: '',
        password: '',
        // 滑动验证
        value: 0,
        able: false,
        tip: '请滑动验证！'
      },
      // 注册表单数据绑定
      registerForm: {
        username: '',
        password: '',
        repassword: ''
      },
      // 登录验证
      loginCheck: {
        // 用户名
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        // 密码
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      // 注册验证
      registerCheck: {
        // 用户名
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        // 密码
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        // 确认密码
        repassword: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置登录表单
    resetLogin(){
      this.$refs.loginFormRef.resetFields()
    },
    // 重置注册表单
    resetRegister(){
      this.$refs.registerFormRef.resetFields()
    },
    // 登录
    login(){
      // 预验证
      this.$refs.loginFormRef.validate(async (validate) => {
        // 验证通过，提交表单
        if (validate) {
          // post请求
          var params = new URLSearchParams()
          params.append('username', this.loginForm.username)
          params.append('password', this.loginForm.password)
          const result = await this.axios.post('user/login', params)
          if (result.meta.status === 200) {
            this.$message.success('登录成功！')
            // 保存token到Session Storage
            window.sessionStorage.setItem('token', result.data.token)
            // 跳转到首页
            this.$router.push('/home')
          } else {
            this.$message.error('登录失败！用户名或密码错误！')
          }
        }
      })
    },
    // 注册
    register(){
      this.$refs.registerFormRef.validate(async (validate) => {
        // 验证通过
        if(validate){
          // post请求
          var params = new URLSearchParams()
          params.append('username', this.registerForm.username)
          params.append('password', this.registerForm.password)
          params.append('repassword', this.registerForm.repassword)
          const result = await this.axios.post('user/register', params)
          if (result.meta.status === 200) {
            this.$message.success('注册成功！')
            // 刷新页面
            this.$router.go(0)
          } else {
            this.$message.error('注册失败！')
          }
        }
      })
    },
    // 控制登录注册面板翻转
    reverse(){
      let login = document.getElementsByClassName('login-box')[0]
      let register = document.getElementsByClassName('register-box')[0]
      if(this.flag){
        login.classList.add('reverse')
        this.flag = !this.flag
        setTimeout(() => {
          register.classList.remove('reverse')
        },1000)
        this.resetLogin()
      }else{
        register.classList.add('reverse')
        this.flag = !this.flag
        setTimeout(() => {
          login.classList.remove('reverse')
        },1000)
        this.resetRegister()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container{
    height: 100%;
    background-color:#242662;
  }

  .register-box{
    width: 500px;
    height: 300px;
    border-radius: 15px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    transition: all 1000ms ease;
    transform-style: preserve-3d;
    .el-form{
      position: relative;
      margin-top: 65px;
    }
  }

  .login-box{
    width: 500px;
    height: 300px;
    border-radius: 15px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    transition: all 1000ms ease;
    transform-style: preserve-3d;
  }


  .reverse{
    transform: translate(-50%, -50%) rotateY(90deg);
    -webkit-transform: translate(-50%, -50%) rotateY(90deg);
  }

  .logo-box{
    width: 130px;
    height: 130px;
    background-color: #fff;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #eee;
    img{
      width: 100%;
      height: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
  }
  
  .login-form{
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
  }

  .btns{
    display: flex;
    justify-content: flex-end;
  }
</style>
