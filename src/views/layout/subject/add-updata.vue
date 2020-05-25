<template>
  <div class="subjectEdit">
    <el-dialog center :visible.sync="dialogVisible" width="600">
      <div class="title" slot="title">{{mode=='add'?"新添学科":"编辑学科"}}</div>

      <el-form :model="subjectlist" :rules="rules" ref="subjectlist" label-width="80px">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="subjectlist.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="subjectlist.name"></el-input>
        </el-form-item>
        <el-form-item label="学科简称" prop="short_name">
          <el-input v-model="subjectlist.short_name"></el-input>
        </el-form-item>
        <el-form-item label="学科简介" prop="intro">
          <el-input v-model="subjectlist.intro"></el-input>
        </el-form-item>
        <el-form-item label="学科备注" prop="remark">
          <el-input v-model="subjectlist.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
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
      subjectlist: {
        rid: "", // 学科编号
        name: "", // 学科名称
        short_name: "", // 学科简称
        intro: "", // 学科简介
        remark: "" // 备注
      },
      rules: {
        rid: [{ required: true, message: "学科编号不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "学科名称不能为空", trigger: "blur" }
        ],
        short_name: [
          { required: true, message: "学科简称不能为空", trigger: "blur" }
        ],
        intro: [
          { required: true, message: "学科简介不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "学科备注不能为空", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.$refs.subjectlist.clearValidate();
      }
    }
  },
  methods: {
    submit() {
      this.$refs.subjectlist.validate(async valid => {
        //   效验 不填完就  return
        if (!valid) return;
        //  填完 发请求
        let res = null;
        if (this.mode === "add") {
          // 新增
          res = await this.$axios.post("/subject/add", this.subjectlist);
        } else {
          // 修改
          res = await this.$axios.post("/subject/edit", this.subjectlist);
        }

        if (res.data.code == 200) {
          // 提示
          this.$message({
            type: "success",
            message: this.mode === "add" ? "新增成功~" : "编辑成功~"
          });
          // 关闭当前会话框
          this.dialogVisible = false;
          // 调用父组件的search方法
          this.$parent.search();
        }
      });
    }
  }
};
</script>

<style lang='less'>
.subjectEdit {
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