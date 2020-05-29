<template>
  <div class="uploadFile">
    <el-upload
      name="file"
      class="avatar-uploader"
      :action="BASE_URL +'/question/upload'"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <!-- name="file"   上传的时候后台接收 name 跟form 提交那个那么差不多 -->
      <!-- // 上传的路径    :action="BASE_URL +'/question/upload'" -->
      <!-- 有video 就显示  视频框  -->
      <div v-if="type == 'video'">
        <video v-if="value" :src="BASE_URL+'/'+value" controls class="avatar"></video>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
      <!-- 没有type == 'video 的就是照片的框  -->
      <div v-else>
        <img v-if="value" :src="BASE_URL+'/'+value" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  // 父传子  判断是img 还是vido
  props: {
    type: {
      type: String, // 这里表明 type 类型是字符串
      default: "image" // 这个代表 type 的值，如果没有传递默认就是image
    },
    //   v-model 是  :value 和 @input 的语法糖
    //   相当于 父传子  把这个value 绑定的值  传给子组件
    value: String
  },
  //   上传的基路径
  data() {
    return {
      BASE_URL: process.env.VUE_APP_BASEURL
    };
  },
  methods: {
    //   成功后的回调
    handleAvatarSuccess(res) {
      // 我上传上去之后   后台返回一个url  1.我要赋值 让+  显示为图片或者视频
      //   2. 要双向绑定 给form 里面 video 赋值
      //   v-model 是  :value 和 @input 的语法糖
      //   相当于 子传父  把这个 url 通过 @input 监听传给 父组件
      this.$emit("input", res.data.url);
    },

    // 上传前的判断
    beforeAvatarUpload(file) {
      if (this.type === "video") {
        // 代表上传的是视频
        const isVideo = file.type === "video/mp4";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isVideo) {
          this.$message.error("上传视频只能是 mp4 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传视频大小不能超过 2MB!");
        }
        return isVideo && isLt2M;
      } else {
        // 代表上传的是图片
        const isImage =
          file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/gif";
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImage) {
          this.$message.error("上传文件只能是 png/jpeg/gif 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isImage && isLt2M;
      }
    }
  }
};
</script>

<style lang="less">
.uploadFile {
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
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
}
</style>