<template>
  <div>
    我是child1子组件
    <button @click="giveparent">点我给父组件传值</button>
    我想吃{{list[0].name}}
    <button @click="givechild">点我给子组件传值</button>
  </div>
</template>

<script>
import bus from "./bus";
export default {
  data() {
    return {
      food: {
        name: "鸭腿饭",
        price: 15
      },
      dongman: {
        name: "海贼王",
        love: "娜美"
      }
    };
  },
  props: ["list"],
  methods: {
    giveparent() {
      this.$emit("sendFood", this.food);
    },
    givechild() {
      bus.$emit("getdongman", this.dongman);
    }
  }
};
</script>

<style>
</style>