<template>
  <div class="questionType">
    <!-- 单选  -->
    <div v-if="questionForms.type == 1">
      <div v-for="item in questionForms.select_options" :key="item.label" class="box">
        <el-radio v-model="questionForms.single_select_answer" :label="item.label">{{item.label}}</el-radio>
        <el-input v-model="item.text"></el-input>
        <upload-file style="margin-left:15px;" v-model="item.image"></upload-file>
      </div>
    </div>
    <!-- 多选  -->
    <div v-if="questionForms.type==2">
      <div v-for="item in questionForms.select_options" :key="item.label" class="box">
        <el-checkbox
          v-model="questionForms.multiple_select_answer"
          :label="item.label"
        >{{item.label}}</el-checkbox>
        <el-input v-model="item.text" style="margin-left:15px;"></el-input>
        <upload-file v-model="item.image"></upload-file>
      </div>
    </div>
    <!-- 简答  -->
    <div v-if="questionForms.type==3">
      <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="questionForms.short_answer"></el-input>
    </div>
  </div>
</template>

<script>
import UploadFile from "./upload-file";
export default {
  // 父元素传过来 questionForms 对象 引用类型 这样这里改了 父元素里面的也会更改
  props: ["questionForms"],
  components: {
    UploadFile
  }
};
</script>

<style lang="less">
.questionType {
  .box {
    display: flex;
    align-items: center;
  }
}
</style>