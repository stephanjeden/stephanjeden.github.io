<template>
  <div id="app">
    <Todos v-bind:todos="todos" /> 
  </div>
</template>

<script>

import Todos from './components/Todos';

export default {
  name: 'app',
  components: {
    Todos
  },
  data() {
    return {
      todos: [
        {
          id: 1,
          title: "Todo 1",
          completed: false
        },

        {
          id: 2,
          title: "Todo 2",
          completed: false
        },

        {
          id: 3,
          title: "Todo 3",
          completed: true
        }

      ]
    }
  }
}
</script>

<style>

@import url('https://fonts.googleapis.com/css?family=Oswald');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Oswald, sans-serif;
  line-height: 1.4;
}

h1 {
  text-align: center;
  margin-top: 20px;
  color: #333;
}

</style>
