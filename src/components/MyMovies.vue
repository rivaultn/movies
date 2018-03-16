<template>
  <h2>Mes films</h2>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MovieList',
  data () {
    return {
      fields: {
        isbn: { label: 'ISBN', sortable: true, 'class': 'text-center' },
        title: { label: 'Movie Title', sortable: true },
        actions: { label: 'Action', 'class': 'text-center' }
      },
      movies: [],
      errors: []
    }
  },
  created () {
    axios.get(`http://localhost:3000/movie`)
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
    }
  }
}
</script>
