<template>
  <div>
    测试作用域插槽
    <br />
    <br />
    <slotchild :data="list">
      <template slot-scope="scope">
        <div
          :style="{color:scope.row.status===0 ?'red':'green'}"
        >{{scope.row.status===0 ?'学裱':'演员'}}</div>
      </template>
    </slotchild>
  </div>
</template>

    </slotchild>
  </div>
</template>

<script>
import slotchild from "../slotall/slotchild";
export default {
  components: {
    slotchild
  },
  data() {
    return {
      list: [
        { name: "波波", age: "24", sex: "男", status: 0 },
        { name: "哲楷", age: "20", sex: "男", status: 1 },
        { name: "子丰", age: "22", sex: "女", status: 0 },
        { name: "俊辉", age: "26", sex: "女", status: 1 }
      ]
    };
  }
};
</script>

<style>
</style>