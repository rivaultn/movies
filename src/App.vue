<template>
  <div id="app">
    <b-navbar class="navbar navbar-dark bg-dark" toggleable="md" type="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#"><icon name="film" scale="2"></icon></b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="componentFont">
          <b-nav-item class="itemNav active" @click="active($event)" href="../#/movie">FILMS</b-nav-item>
          <b-nav-item class="itemNav" @click="active($event)" href="../#/tv">SÉRIES</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    /**
     * Manage the color of the navbar Film / Serie
     * @param event the emitter event
     */
    active (event) {
      var active = document.querySelector('.itemNav a.active')

      if (active !== null) {
        active.classList.remove('active')
      }
      event.target.classList.add('active')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Dense', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  background-color: #2B3239 !important;
}

@font-face {
  font-family: Dense;
  src: url(/static/fonts/Dense-Regular.otf);
}

.navbar{
  font-weight: bold;
}

.componentFont{
  font-size: 22px;
}
</style>
