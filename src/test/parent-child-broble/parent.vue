<template>
  <div class="parent">
    我是父组件
    食物的名字是：{{foodname}}
    价格是：{{foodprice}}
    <br />
    <br />
    <br />
    <div class="child1">
      <child1 @sendFood="getfood" :list="foodlist"></child1>
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
      foodname: "",
      foodprice: "",
      foodlist: [
        { name: "炒饭", price: 20 },
        { name: "乌鸡汤", price: 30 }
      ]
    };
  },
  methods: {
    getfood(obj) {
      this.foodname = obj.name;
      this.foodprice = obj.price;
    }
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