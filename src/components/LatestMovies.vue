<template>
  <b-container>
      <b-col>
        <h2 class="title-page">EN SALLE</h2>

        <b-card-group deck v-for="i in Math.ceil(movies.results.length / 5)" :key="i" class="filmRow">
          <b-card class="cardMovie" v-for="movie in movies.results.slice((i - 1) * 5, i * 5)" :key="movie.id" bg-variant="dark"
                    :title="movie.title"
                    :img-src="movie.poster_path ? path_img_movie_300+movie.poster_path  : require('../assets/No_Image_Available.jpg')"
                    img-alt="Img"
                    img-top>
            <div slot="footer">
              <b-link @click.stop="details(movie)" v-b-modal.detailsModal class="details">détails</b-link><br />
              <b-link v-b-modal.tagModal><icon class="saved" name="eye" scale="2"></icon></b-link>
            </div>
          </b-card>

        </b-card-group>
      </b-col>
    <b-row class="justify-content-md-center paginationRow">
      <b-pagination-nav :link-gen="change" :number-of-pages="movies.total_pages" v-model="currentPage" class="componentFont"/>
    </b-row>

    <b-modal id="detailsModal"
             :title= "movie.title"
             header-bg-variant="dark"
             header-text-variant="light"
             footer-bg-variant="dark"
             footer-text-variant="light"
             :hide-footer=false
              size="lg">

      <b-container fluid class="modal-text">
        <b-row>
          <b-col cols="4">
            <b-img fluid :src="movie.poster_path ? path_img_movie_200+movie.poster_path  : require('../assets/No_Image_Available.jpg')" alt="left image" />
          </b-col>
          <b-col>
          <h4>Synopsis : </h4>
            <span>{{ movie.overview }}</span>
          </b-col>
        </b-row>
        <b-row class="mainCharacters">
          <b-card-group deck>
            <b-card mx-auto class="cardCharacter" v-for="indexCharacter in 5" :key="indexCharacter" v-if="mainCharacters.length != 0"
                    :title="mainCharacters[indexCharacter].name "
                    :img-src="mainCharacters[indexCharacter].profile_path ? path_img_face_138_175+mainCharacters[indexCharacter].profile_path  : require('../assets/No_Image_Available.jpg')"
                    img-alt="Img">
              <p class="card-text">
                <span >{{mainCharacters[indexCharacter].character}}</span>
              </p>
            </b-card>
          </b-card-group>
        </b-row>
      </b-container>
      <div slot="modal-footer" class="w-100">
        <b-link v-b-modal.tagModal><icon class="saved" name="eye" scale="2"></icon></b-link>
      </div>
    </b-modal>

    <b-modal id="tagModal"
             :hide-header=true
             :hide-footer=true>
      <b-row class="my-1">
        <b-col sm="2"><label for="input-tag">Tags:</label></b-col>
        <b-col sm="8">
          <b-form-input id="input-tag" type="text" placeholder="Tags"></b-form-input>
        </b-col>
        <b-col sm="2">
          <b-button submit href="#">OK</b-button>
        </b-col>
      </b-row>
    </b-modal>
  </b-container>
</template>

<script>
import axios from 'axios'
import {URL_API_MOVIE, API_KEY, PATH_IMG_MOVIE_300, LNG, PATH_IMG_FACE_138_175, PATH_IMG_MOVIE_200} from '../constant.js'

export default {
  name: 'MovieList',
  data () {
    return {
      currentPage: 1,
      movies: [],
      errors: [],
      movie: {},
      path_img_movie_300: PATH_IMG_MOVIE_300,
      path_img_movie_200: PATH_IMG_MOVIE_200,
      path_img_face_138_175: PATH_IMG_FACE_138_175,
      mainCharacters: []
    }
  },
  created () {
    axios.get(URL_API_MOVIE + 'now_playing?api_key=' + API_KEY + '&language=' + LNG + '&page=' + this.currentPage)
      .then(response => {
        this.movies = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
  },
  methods: {
    details (movie) {
      this.mainCharacters = []
      axios.get(URL_API_MOVIE + movie.id + '?api_key=' + API_KEY + '&language=' + LNG)
        .then(response => {
          this.movie = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
      axios.get(URL_API_MOVIE + movie.id + '/credits?api_key=' + API_KEY)
        .then(response => {
          this.mainCharacters = response.data.cast
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    change () {
      axios.get(URL_API_MOVIE + 'now_playing?api_key=' + API_KEY + '&language=' + LNG + '&page=' + this.currentPage)
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
  .card-body > h4{
    font-weight: bold;
  }
  .paginationRow{
    margin-top: 30px;
  }
  .saved{
    color: #2D63A1;
  }
  .details{
    font-size: 22px;
    color: inherit;
    text-decoration: inherit;
  }
  .details:hover{
    color: inherit;
    text-decoration: inherit;
  }
  .modal-title{
    font-size: 32px;
    padding-left: 20px;
  }
  .modal-text{
    font-size: 22px;
    padding-top: 20px;
    text-align: initial;
  }
  .modal-text > h4{
    font-weight: bold;
    font-size: 30px;
  }
  .mainCharacters{
    margin-top: 40px;
    padding-left: 10px;
    padding-right: 10px;
  }
  #tagModal{
    font-size: 22px;
  }
</style>
