<template>
  <div>
    <el-card>
      <el-form inline :model="subjectForm" ref="subjectForm" label-width="80px">
        <el-form-item label="学科编号">
          <el-input v-model="subjectForm.rid" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="学科名称">
          <el-input v-model="subjectForm.name" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="学科编号">
          <el-input v-model="subjectForm.username" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="subjectForm.status" placeholder style="width:150px">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button>清除</el-button>
          <el-button type="primary">+新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <!-- <el-table :data="subjectList" border stripe></el-table> -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subjectForm: {
        name: "", //学科名称
        rid: "", //学科编号
        username: "", // 创建者用户名
        status: "" //  状态 0禁用 1 启用
      },
      page: "", //当前页码
      limit: "2", // 显示几条数据
      subjectList: []
    };
  },
  created() {
    this.getSubjectList();
  },
  methods: {
    async getSubjectList() {
      const res = await this.$axios.get("/subject/list", this.subjectForm);
      // console.log(res);
      if (res.data.code == 200) {
        this.subjectList = res.data.data.item;
      }
    }
  }
};
</script>

<style>
</style>