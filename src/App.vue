<template>
  <div id="app">
    <b-navbar class="navbar navbar-dark bg-dark" toggleable="md" type="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#"><icon name="film" scale="2"></icon></b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav class="componentFont">
          <b-nav-item href="#/myMovies">MES FILMS</b-nav-item>
          <b-nav-item href="#/mySeries">MES SÉRIES</b-nav-item>
          <b-nav-item href="#/latestMovies">FILMS</b-nav-item>
          <b-nav-item href="#/latestSeries"><b>SÉRIES</b></b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2 componentFont" type="text" placeholder="recherche"/>
            <b-button size="sm" class="my-2 my-sm-0 componentFont" type="submit">Rechercher</b-button>
          </b-nav-form>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
      <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
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
