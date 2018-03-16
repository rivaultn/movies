<template>
  <div id="app">
    <b-navbar class="navbar navbar-dark bg-dark" toggleable="md" type="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#">NavBar</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item href="#/myMovies">Mes films</b-nav-item>
          <b-nav-item href="#/mySeries">Mes séries</b-nav-item>
          <b-nav-item href="#/latestMovies">Films</b-nav-item>
          <b-nav-item href="#/series">Séries</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Recherche"/>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Rechercher</b-button>
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  background-color: #2B3239 !important;
}

</style>
