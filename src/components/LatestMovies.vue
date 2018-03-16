<template>
  <b-row align-h="center">
    <b-row align-h="center">
      <b-col cols="10">
        <h2 class="title-page">Au cinéma</h2>
        <b-row v-for="i in Math.ceil(movies.results.length / 5)" :key="i" class="filmRow">
          <b-col v-for="movie in movies.results.slice((i - 1) * 5, i * 5)" :key="movie.id">
            <b-img v-if="movie.poster_path != null" thumbnail fluid v-bind:src="'https://image.tmdb.org/t/p/w300/'+ movie.poster_path" alt="Thumbnail" />
            <b-img v-else thumbnail fluid v-bind:src="'/assets/No_image_Available'" alt="Thumbnail" />
          </b-col>
        </b-row>
      </b-col>
      </b-row>
    <b-row>
      <b-pagination-nav :link-gen="change" :number-of-pages="movies.total_pages" v-model="currentPage" />
    </b-row>
  </b-row>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MovieList',
  data () {
    return {
      currentPage: 1,
      movies: [],
      errors: []
    }
  },
  created () {
    axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=ae3e5728d96161eec2f5d86350cd1cdb&language=fr-FR&page='.concat(this.currentPage))
      .then(response => {
        this.movies = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
  },
  methods: {
    details (movie) {
      this.$router.push({
        name: 'ShowMovie',
        params: { id: movie._id }
      })
    },
    change () {
      axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=ae3e5728d96161eec2f5d86350cd1cdb&language=fr-FR&page='.concat(this.currentPage))
        .then(response => {
          this.movies = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}

</script>

<style>
.title-page {
  margin-bottom: 50px;
  margin-top: 20px;
  color: #707984;
}
.filmRow{
  margin-bottom: 20px;
}
</style>
