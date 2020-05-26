<template>
  <div class="questionEdit">
    <el-dialog title="提示" :visible.sync="dialogVisible" fullscreen>
      <div slot="title" class="title">{{mode=='add'?'新增题目':'编辑题目'}}</div>

      <el-form :model="questionForms" ref="questionForms" label-width="80px" class="form">
        <el-form-item label="学科" prop="subject">
          <el-select v-model="questionForms.subject" placeholder="请选择学科" class="selectWidth">
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="阶段">
          <el-select v-model="questionForms.stop" placeholder="请选择阶段" class="selectWidth">
            <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="企业">
          <el-select v-model="questionForms.enterprise" placeholder="请选择企业" class="selectWidth">
            <el-option
              v-for="item in enterpriseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="城市">
          <el-cascader
            size="large"
            :options="options"
            :props="{value:'label'}"
            v-model="questionForms.city"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="题型" prop="type">
          <el-radio-group v-model="questionForms.type">
            <el-radio v-for="(value,name) in typeObj" :key="name" :label="name">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="难度" prop="difficulty">
          <el-radio-group v-model="questionForms.difficulty">
            <el-radio v-for="(value,name) in difficultyObj" :key="name" :label="name">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button>取消</el-button>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { regionData } from "element-china-area-data";
export default {
  name: "qiyeadd",
  props: {
    subjectList: Array, // 学科列表
    enterpriseList: Array, // 企业列表
    stepObj: Object, //阶段
    typeObj: Object, //题型
    difficultyObj: Object //难度
  },
  data() {
    return {
      options: regionData,
      dialogVisible: false,
      mode: "",
      questionForms: {
        subject: "", // 学科
        stop: "", // 阶段
        enterprise: "", // 企业
        city: [], // 城市
        type: "1", // 题型
        difficulty: "2" // 难度
      }
    };
  },
  methods: {
    onSubmit() {}
  }
};
</script>

<style lang="less">
.questionEdit {
  .title {
    color: #fff;
    padding-left: 15px;
    height: 54px;
    line-height: 54px;
    background-color: #04bcfa;
  }
  .el-dialog__header {
    padding: 0px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .form {
    width: 832px;
    margin: 0 auto;
  }
  .selectWidth {
    width: 300px;
  }
}
</style>