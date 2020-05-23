<template>
  <div class="parent">
    我是父组件
    <br />
    <br />
    <br />
    <div class="child1">
      <child1></child1>
    </div>
    <div class="child2">
      <child2></child2>
    </div>
  </div>
</template>

<script>
import child1 from "@/test/parent-child-broble/child1";
import child2 from "@/test/parent-child-broble/child2";
export default {
  components: {
    child1,
    child2
  },
  data() {
    return {
      food: {}
    };
  }
};
</script>

<style lang="less">
.parent {
  border: 1px solid red;
  width: 1200px;
  height: 600px;
  .child1 {
    float: left;
    border: 1px solid green;
    margin-left: 20px;
    width: 500px;
    height: 450px;
  }
  .child2 {
    float: right;
    border: 1px solid blue;
    margin-right: 20px;
    width: 500px;
    height: 450px;
  }
}
</style>