<template>
  <b-container>
      <b-col>
        <b-nav>
          <b-nav-item @click="setSource('now_playing')" active class="nav-tab">EN SALLE</b-nav-item>
          <b-nav-item @click="setSource('popular')" class="nav-tab">POPULAIRE</b-nav-item>
          <b-nav-item @click="setSource('top_rated')" class="nav-tab">MIEUX NOTÉS</b-nav-item>
          <b-nav-item @click="setSource('my_movies')" class="nav-tab">MES FILMS</b-nav-item>
        </b-nav>

        <b-card-group deck v-for="i in Math.ceil(movies.length / 5)" :key="i" class="filmRow">
          <b-card class="cardMovie" v-for="movie in movies.slice((i - 1) * 5, i * 5)" :key="movie.id" bg-variant="dark"
                    :title="movie.title"
                    :img-src="movie.poster_path ? path_img_movie_300+movie.poster_path  : require('../assets/No_Image_Available.jpg')"
                    img-alt="Img"
                    img-top>
            <div slot="footer">
              <b-link @click.stop="details(movie)" v-b-modal.detailsModal class="details">détails</b-link><br />
              <b-link v-b-modal.tagModal @click="clickOnEye(movie)"><icon v-bind:class="{'saved': ids.includes(movie.id)}" class="eye" name="eye" scale="2"></icon></b-link>
            </div>
          </b-card>

        </b-card-group>
      </b-col>
    <b-row class="justify-content-md-center paginationRow">
      <b-pagination-nav :link-gen="change" :number-of-pages="totalPages" v-model="currentPage" class="componentFont"/>
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
          <h4 class="synopsis">Synopsis : </h4>
            <span>{{ movie.overview }}</span><br /><br />
            <b-link class="genreLink" v-for="genre in movie.genres" :key="genre.id"> {{genre.name}} </b-link>
          </b-col>
        </b-row>
        <b-row class="mainCharacters">
          <b-card-group deck>
            <b-card mx-auto class="cardCharacter" v-for="indexCharacter in 5" :key="indexCharacter" v-if="mainCharacters.length != 0"
                    :title="mainCharacters[indexCharacter].name "
                    :img-src="mainCharacters[indexCharacter].profile_path ? path_img_face_138_175+mainCharacters[indexCharacter].profile_path  : require('../assets/No_Image_Available.jpg')"
                    img-alt="Img">
              <p class="card-text">
                <span>{{mainCharacters[indexCharacter].character}}</span>
              </p>
            </b-card>
          </b-card-group>
        </b-row>
      </b-container>
      <div slot="modal-footer" class="w-100">
        <b-link v-b-modal.tagModal @click="clickOnEye(movie)"><icon v-bind:class="{'saved': ids.includes(movie.id)}" class="eye" name="eye" scale="2"></icon></b-link>
      </div>
    </b-modal>

    <b-modal id="tagModal"
             :hide-header=true
             :hide-footer=true>
      <b-form @submit="onModalSubmit">
        <b-row class="my-1">
          <b-col sm="3"><label for="input-comment">Commentaires :</label></b-col>
          <b-col sm="9">
            <b-form-input id="input-comment" type="text" placeholder="Commentaires" v-model="movieToSave.comment"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="3"><label for="input-tag">Tags :</label></b-col>
          <b-col sm="7">
            <b-form-input id="input-tag" type="text" placeholder="Tags" v-model="tags"></b-form-input>
          </b-col>
          <b-col sm="2">
            <b-button type="submit">OK</b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
import axios from 'axios'
import {URL_API_MOVIE, URL_LOCAL_API_MOVIE, API_KEY, PATH_IMG_MOVIE_300, LNG, PATH_IMG_FACE_138_175, PATH_IMG_MOVIE_200} from '../constant.js'

export default {
  name: 'MovieList',
  data () {
    return {
      currentPage: 1,
      source: 'now_playing',
      movies: [],
      totalPages: 1,
      ids: [],
      movie: {},
      tags: '',
      movieToSave: {},
      errors: [],
      path_img_movie_300: PATH_IMG_MOVIE_300,
      path_img_movie_200: PATH_IMG_MOVIE_200,
      path_img_face_138_175: PATH_IMG_FACE_138_175,
      mainCharacters: []
    }
  },
  created () {
    axios.get(URL_API_MOVIE + this.source + '?api_key=' + API_KEY + '&language=' + LNG + '&page=' + this.currentPage)
      .then(response => {
        this.movies = response.data.results
        this.totalPages = response.data.total_pages
      })
      .catch(e => {
        this.errors.push(e)
      })
    axios.get(URL_LOCAL_API_MOVIE + '/ids')
      .then(response => {
        this.ids = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
  },
  methods: {
    details (movie) {
      this.mainCharacters = []
      this.movieToSave = {}
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
      this.movieToSave.id = movie.id
    },
    change () {
      if (this.source === 'my_movies') {
        axios.get(URL_LOCAL_API_MOVIE + '/page/' + this.currentPage)
          .then(response => {
            this.movies = response.data
          })
          .catch(e => {
            this.errors.push(e)
          })
        axios.get(URL_LOCAL_API_MOVIE + '/total_pages')
          .then(response => {
            this.totalPages = response.data
          })
          .catch(e => {
            this.errors.push(e)
          })
      } else {
        axios.get(URL_API_MOVIE + this.source + '?api_key=' + API_KEY + '&language=' + LNG + '&page=' + this.currentPage)
          .then(response => {
            this.movies = response.data.results
            this.totalPages = response.data.total_pages
          })
          .catch(e => {
            this.errors.push(e)
          })
      }
    },
    setSource (source) {
      this.currentPage = 1
      this.source = source
      this.change()
    },
    clickOnEye (movie) {
      if (!this.ids.includes(movie.id)) {
        this.movieToSave.id = movie.id
        this.movieToSave.poster_path = movie.poster_path
        this.movieToSave.title = movie.title
        axios.post(URL_LOCAL_API_MOVIE, this.movieToSave)
          .then(response => {
            this.ids.push(this.movieToSave.id)
          })
          .catch(e => {
            this.errors.push(e)
          })
      } else {
        axios.delete(URL_LOCAL_API_MOVIE + '/' + movie.id)
          .then(response => {
            let idx = this.ids.indexOf(movie.id)
            this.ids.splice(idx, 1)
          })
          .catch(e => {
            this.errors.push(e)
          })
      }
    },
    onModalSubmit (evt) {
      evt.preventDefault()
      this.movieToSave.tags = this.tags.split(';')
      axios.post(URL_LOCAL_API_MOVIE, this.movieToSave)
        .catch(e => {
          this.errors.push(e)
        })
      this.ids.push(this.movieToSave.id)
    }
  }
}
</script>

<style>
  .nav-tab {
    margin: 20px 20px 0 0;
    font-weight: bold;
    font-size: 28px;
  }
  .nav-tab > a{
    color: #707984;
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
  .eye{
    color: #D1D1D1;
  }
  .saved{
    color: #2D63A1;
  }
  .details, .genreLink{
    font-size: 22px;
    color: inherit;
    text-decoration: inherit;
  }
  .details:hover, .genreLink:hover{
    color: inherit;
    text-decoration: inherit;
  }
  .genreLink{
    font-weight: bold;
    margin-right: 10px;
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
  .synopsis{
    font-weight: bold;
    font-size: 28px;
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