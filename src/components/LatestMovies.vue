<template>
  <b-container>
      <b-col>
        <h2 class="title-page">EN SALLE</h2>

        <b-card-group deck v-for="i in Math.ceil(movies.results.length / 5)" :key="i" class="filmRow">
          <b-card class="cardMovie" v-for="movie in movies.results.slice((i - 1) * 5, i * 5)" :key="movie.id" bg-variant="dark"
                    :title="movie.title"
                    :img-src="movie.poster_path ? 'https://image.tmdb.org/t/p/w300/'+movie.poster_path  : require('../assets/No_Image_Available.jpg')"
                    img-alt="Img"
                    img-top>
          </b-card>

        </b-card-group>
      </b-col>
    <b-row class="justify-content-md-center paginationRow">
      <b-pagination-nav :link-gen="change" :number-of-pages="movies.total_pages" v-model="currentPage" class="bg-dark componentFont"/>
    </b-row>
  </b-container>
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
  margin-bottom: 30px;
  margin-top: 20px;
  color: #707984;
  font-weight: bold;
}
.filmRow{
  margin-bottom: 20px;
}
.cardMovie{
  color: #707984;
}
.paginationRow{
  margin-top: 30px;
}
</style>
