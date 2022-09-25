<template>
  <div id="app">
    <Header v-if="showNav"></Header>
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from '@/components/Header'

export default {
  components: {
    Header
  },
  computed: {
    ...mapState(['userProfile']),
    showNav() {
      return Object.keys(this.userProfile).length > 1
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#header {
  padding: 30px;

  background-color: #54FF45;
  position: sticky;
  height: 126px;
  left: 0px;
  top: 0px;
}
#container {
  overflow: hidden;
      width: 100%;
}
#nav {
  padding: 10px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }

  float: right;
  width: 20%;
  background: #ccc;
  //adding: 20px;

  margin-right: -1px;
  padding-bottom: 500em;
  margin-bottom: -500em;
}
#article {
  float: right;
  //padding: 20px;
  width: 80%;
  background-color: #f1f1f1;

  padding-bottom: 500em;
  margin-bottom: -500em;
}
#footer {
  background-color: #777;
  padding: 10px;
  text-align: center;
  color: white;
}

* {
  box-sizing: border-box;
}

nav ul {
  list-style-type: none;
  padding-left: 20px;
  float: left;
}
section::after {
  content: "";
  display: table;
  clear: both;
}
</style>
