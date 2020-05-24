<template>
  <table>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
      <th>性别</th>
      <th>状态</th>
    </tr>
    <tr v-for="(item, index) in data" :key="index">
      <td>{{item.name}}</td>
      <td>{{item.age}}</td>
      <td>{{item.sex}}</td>
      <td>
        <slot :row="item"></slot>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  }
};
</script>

<style>
</style>