<template>
  <div>
    我是child2子组件
    <br />
    <br />
    我喜欢看{{name}}
    喜欢里面的{{love}}
  </div>
</template>

<script>
import bus from "./bus";
export default {
  data() {
    return {
      name: "",
      love: ""
    };
  },
  
  created() {
    bus.$on("getdongman", obj => {
      this.name = obj.name;
      this.love = obj.love;
    });
  }
};
</script>

<style>
</style>