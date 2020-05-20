// 这是注册弹出框模块 
<template>
  <div class="register">
    <el-dialog :visible.sync="dialogVisible" width="600px" center>
      <!-- 头部的 插槽 -->
      <div slot="title" class="title">注册</div>
      <!-- form表单 -->
      <el-form label-width="100px" :model="registerForm" :rules="rules" ref="registerForm">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :action="uploadAction"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称:" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input show-password v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-form-item label="图像码" prop="code">
          <el-row>
            <el-col :span="17">
              <el-input v-model="registerForm.code"></el-input>
            </el-col>
            <el-col :span="6" style="margin-left:10px">
              <img @click="changeUrl" class="captcha" :src="codeUrl" alt />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="验证码" prop="rcode">
          <el-row>
            <el-col :span="17">
              <el-input v-model.number="registerForm.rcode"></el-input>
            </el-col>
            <el-col style="margin-left:10px" :span="6">
              <el-button @click="getRcode" :disabled="times>0&&times<60">
                <span v-if="times>0&&times<60">倒计时:{{times}}</span>
                <span v-else>获取用户验证码</span>
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

      <!-- 底部的插槽 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      // 请求的地址 请求返回回来url
      uploadAction: process.env.VUE_APP_BASEURL + "/uploads",
      dialogVisible: false,
      imageUrl: "", // 头像
      codeUrl: process.env.VUE_APP_BASEURL + "/captcha?type=sendsms", //   图像码的图片
      times: 60, // 这个假装 手机手验证码

      registerForm: {
        username: "", // 用户名
        phone: "", // 手机号
        email: "", // 邮箱
        avatar: "", // 头像地址
        password: "", // 密码
        code: "", //图像码
        rcode: "" // 验证码
      },
      //   效验
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("电话不能为空"));
                return;
              }
              //   手机的正则
              const reg = /^1[3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                callback(new Error("电话不合法"));
                return;
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("邮箱不合法"));
                return;
              }
              //   邮箱的正则 正则他会报错，因为escape 检测说我们不规范 我们这要吧检测关闭
              const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
              if (!reg.test(value)) {
                callback(new Error("邮箱不合法"));
                return;
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 6, message: "密码长度最小是6位", trigger: "blur" }
        ],
        code: [
          { required: true, message: "图形码不能为空", trigger: "blur" },
          { min: 4, max: 4, message: "图形码必须是4位", trigger: "blur" }
        ],
        rcode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("验证码不能为空"));
              }
              if (!Number.isInteger(value)) {
                return callback(new Error("验证码必须是数字"));
              }
              callback();
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //   图像码点击更换
    changeUrl() {
      this.codeUrl =
        process.env.VUE_APP_BASEURL +
        "/captcha?type=sendsms&r=" +
        Math.random();
    },
    // 获取验证码
    async getRcode() {
      // 倒计时 按钮不可用
      this.times--;
      let timeout = setInterval(() => {
        this.times--;
        if (this.times == 0) {
          this.times == 60;
          clearInterval(timeout);
        }
      }, 1000);
      let res = await this.$axios.post("/sendsms", {
        code: this.registerForm.code,
        phone: this.registerForm.phone
      });
      if (res.data.code == 200) {
        // 验证码赋值
        this.registerForm.rcode = res.data.data.captcha;
      } else {
        this.$message.error(res.data.message);
        //在刷新 图像码 照片
        this.changeUrl();
      }
    },
    //   图片上传前的验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //   图片上传成功执行的函数
    handleAvatarSuccess(res, file) {
      //  给imgUrl赋值 显示图片
      this.imageUrl = process.env.VUE_APP_BASEURL + "/" + res.data.file_path;
      //   给registerForm 里面的avatar 赋值 一会发请求要用这个数据
      this.registerForm.avatar = res.data.file_path;
    },
    // 注册的确定 点击  提交数据 发送请求
    // 点击先验证下 上面都填了没
    submit() {
      this.$refs.registerForm.validate(async valid => {
        if (!valid) return;
        // 成功说明都填写了  发送请求
        const res = await this.$axios.post("/register", this.registerForm);
        //    成功提示成功  关闭注册窗口
        if (res.data.code == 200) {
          this.$message({
            message: "恭喜注册成功",
            type: "success"
          });
          //    关闭注册窗口
          this.dialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang="less">
.register {
  .title {
    height: 53px;
    background: #03c0f9;
    color: #fff;
    text-align: center;
    line-height: 53px;
  }
  .el-dialog__header {
    padding: 0px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .captcha {
    width: 100%;
    height: 40px;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader {
  text-align: center;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>