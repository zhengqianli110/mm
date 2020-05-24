<template>
  <div class="enterpriseEdit">
    <el-dialog :visible.sync="dialogVisible" width="600px" center title="提示">
      <!-- 头部插槽 -->
      <div slot="title" class="title">{{ mode ==='add' ? '添加企业':'编辑企业'}}</div>
      <!-- 中间的form -->
      <el-form :model="addEmterpriseForm" ref="EmterpriseForm" label-width="80px" :rules="rules">
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="addEmterpriseForm.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="addEmterpriseForm.name"></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="short_name">
          <el-input v-model="addEmterpriseForm.short_name"></el-input>
        </el-form-item>
        <el-form-item label="企业简介" prop="intro">
          <el-input v-model="addEmterpriseForm.intro"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addEmterpriseForm.remark"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部插槽 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      mode: "",
      addEmterpriseForm: {
        eid: "", //企业编号
        name: "", //企业名称
        short_name: "", //简称
        intro: "", //企业简介
        remark: "" //备注
      },
      // 校验规则
      rules: {
        eid: [{ required: true, message: "企业编号必填！", trigger: "blur" }],
        name: [{ required: true, message: "企业名称必填！", trigger: "blur" }],
        short_name: [
          { required: true, message: "企业简称必填！", trigger: "blur" }
        ],
        intro: [{ required: true, message: "企业简介必填！", trigger: "blur" }],
        remark: [{ required: true, message: "企业备注必填！", trigger: "blur" }]
      }
    };
  },
  watch: {
    dialogVisible(val) {
      // if (val) {
      //   this.$nextTick(() => {
      //     this.$refs.EmterpriseForm.clearValidate();
      //   });
      // }
      // 效果更好 隐藏时 清除 跟上面呢个对比 上面的会红色会闪动
      if (!val) {
        this.$refs.EmterpriseForm.clearValidate();
      }
    }
  },
  methods: {
    // 弹出框 确定的点击事件  提交信息发请求 一个请求是新增一个是编辑
    // 先效验
    submitForm() {
      this.$refs.EmterpriseForm.validate(async valid => {
        if (!valid) return;
        // 打这里就是效验过来 就发请求
        // 这里判断下 是新增还是编辑
        let res = null;
        if (this.mode == "add") {
          // mode==add 这里是新增 请求
          res = await this.$axios.post("/enterprise/add", {
            ...this.addEmterpriseForm
          });
        } else {
          // 这里是编辑的请求
          res = await this.$axios.post("/enterprise/edit", {
            ...this.addEmterpriseForm
          });
        }
        // 请求 成功到这里
        if (res.data.code == 200) {
          this.$message({
            message: this.mode == "add" ? "新增成功" : "编辑成功",
            type: "success"
          });
          // 关闭这个窗口   然后刷新列表（调用父组件那个方法）
          this.dialogVisible = false;
          // 调用父组件那个方法刷新
          this.$parent.searchEnterprise();
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang="less">
.enterpriseEdit {
  .title {
    height: 53px;
    text-align: center;
    color: #fff;
    background-color: #0e9cfa;
    line-height: 53px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>