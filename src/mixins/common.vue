

<script>
export default {
  methods: {
    async changeStatus(url, id) {
      const res = await this.$axios.post(url, { id });
      if (res.data.code == 200) {
        this.$message({
          type: "success",
          message: "更改状态成功"
        });

        // 调用     this.search();
        this.search();
      }
    }
  }
};
</script>
