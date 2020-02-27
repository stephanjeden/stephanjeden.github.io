

<template>
<div>
  <div v-bind:key="itemInTodos.id" v-for="itemInTodos in todos">
    <h3>{{itemInTodos.title}}</h3>
  </div>
</div>
</template>

<script>

export default {
    name: "Todos",
    props: ["todos"]
  }

 
</script>

<style>

</style>