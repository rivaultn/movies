<template>
  <div>
  <b-container fluid>
      <b-row>
        <b-col class="filterColumn" sm="1" v-if="source == 'my_movies'">
          <ul class="filterList">
            <h3>TAGS</h3>
            <li v-for="savedTag in savedTags" :key="savedTag">
              <b-link @click="filterByTag(savedTag)" class="filterLink">{{ savedTag}}</b-link>
            </li>
          </ul>
          <ul class="filterList">
            <h3>GENRES</h3>
            <li v-for="genre in genres" :key="genre.id">
              <b-link @click="filterBySavedGenre(genre.id)" class="filterLink">{{ genre.name}}</b-link>
            </li>
          </ul>
        </b-col>
        <b-col class="filterColumn" sm="1" v-else>
          <ul class="filterList">
            <h3>GENRES</h3>
            <li v-for="genre in genres" :key="genre.id">
              <b-link @click="filterByGenre(genre)" class="filterLink">{{ genre.name}}</b-link>
            </li>
          </ul>
        </b-col>
        <b-col offset-sm="1" sm="10">
          <b-nav>
            <b-nav-item @click="setSource('now_playing')" active class="nav-tab">EN SALLE</b-nav-item>
            <b-nav-item @click="setSource('popular')" class="nav-tab">POPULAIRE</b-nav-item>
            <b-nav-item @click="setSource('top_rated')" class="nav-tab">MIEUX NOTÉS</b-nav-item>
            <b-nav-item @click="setSource('my_movies')" class="nav-tab">MES FILMS</b-nav-item>
          </b-nav>

          <b-card-group deck v-for="i in Math.ceil(movies.length / 5)" :key="i" class="filmRow">
            <b-card class="cardMovie" v-for="movie in movies.slice((i - 1) * 5, i * 5)" :key="movie.id" bg-variant="dark"
                      :title="movie.title"
                      :img-src="movie.poster_path ? PATH_IMG_300+movie.poster_path  : require('../assets/No_Image_Available.jpg')"
                      img-alt="Img"
                      img-top>
              <div slot="footer">
                <b-link @click.stop="details(movie)" v-b-modal.detailsModal class="details">détails</b-link><br />
                <b-link @click="clickOnEye(movie)"><icon v-bind:class="{'saved': ids.includes(movie.id)}" class="eye" name="eye" scale="2"></icon></b-link>
                <b-link @click="editInformations(movie.id)" v-if="ids.includes(movie.id)" class="editLink"><icon class="eye" name="edit" scale="1.6"></icon></b-link>
              </div>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    <b-row class="justify-content-md-center justify-content-sm-center paginationRow">
      <b-pagination v-on:input="change" :total-rows="totalResults" :per-page="20" v-model="currentPage" class="componentFont"/>
    </b-row>

    <b-modal id="detailsModal"
             :title= "movie.title"
             header-bg-variant="dark"
             header-text-variant="light"
             footer-bg-variant="dark"
             footer-text-variant="light"
             :hide-footer=false
              size="lg"
             ref="detailsModal">

      <b-container fluid class="modal-text">
        <b-row>
          <b-col cols="4">
            <b-img fluid :src="movie.poster_path ? PATH_IMG_200+movie.poster_path  : require('../assets/No_Image_Available.jpg')" alt="left image" />
          </b-col>
          <b-col>
          <h4 class="synopsis">Synopsis : </h4>
            <span>{{ movie.overview }}</span><br /><br />
            <b-link @click="filterByGenre(genre)" class="genreLink" v-for="genre in movie.genres" :key="genre.id"> {{genre.name}} </b-link>
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
        <b-link @click="clickOnEye(movie)"><icon v-bind:class="{'saved': ids.includes(movie.id)}" class="eye" name="eye" scale="2"></icon></b-link>
      </div>
    </b-modal>

    <b-modal id="tagModal"
             :hide-header=true
             :hide-footer=true
             ref="tagModal">
      <b-form @submit="onModalSubmit">
        <b-row class="my-1">
          <b-col sm="3"><label for="input-comment">Commentaires :</label></b-col>
          <b-col sm="9">
            <b-form-input ref="inputComment" id="input-comment" type="text" placeholder="Commentaires" v-model="comment"></b-form-input>
          </b-col>
        </b-row>
        <b-row class="my-1">
          <b-col sm="3"><label for="input-tag">Tags :</label></b-col>
          <b-col sm="7">
            <b-form-input ref="inputTag" id="input-tag" type="text" placeholder="Tags" v-model="tags"></b-form-input>
          </b-col>
          <b-col sm="2">
            <b-button type="submit">OK</b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-modal>
  </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import {URL_API_MOVIE, URL_LOCAL_API_MOVIE, URL_API__DISCOVER_MOVIE, URL_API_GENRE, API_KEY, PATH_IMG_300, LNG, PATH_IMG_FACE_138_175, PATH_IMG_200} from '../constant.js'

export default {
  name: 'MovieList',
  data () {
    return {
      currentPage: 1,
      totalResults: 1,
      source: 'now_playing',
      errors: [],
      movies: [],
      mainCharacters: [],
      ids: [],
      movie: {},
      currentMovie: {},
      currentGenre: 1,
      tags: '',
      savedTags: [],
      genres: [],
      comment: '',
      PATH_IMG_300: PATH_IMG_300,
      PATH_IMG_200: PATH_IMG_200,
      path_img_face_138_175: PATH_IMG_FACE_138_175
    }
  },
  created () {
    axios.get(URL_API_MOVIE + this.source + '?api_key=' + API_KEY + '&language=' + LNG + '&page=' + this.currentPage)
      .then(response => {
        this.movies = response.data.results
        this.totalResults = response.data.total_results
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
    axios.get(URL_API_GENRE + '/movie/list?api_key=' + API_KEY + '&language=' + LNG)
      .then(response => {
        this.genres = response.data.genres
      })
      .catch(e => {
        this.errors.push(e)
      })
    this.loadTags()
  },
  methods: {
    setSource (source) {
      this.currentPage = 1
      this.source = source
      this.change()
    },
    details (movie) {
      this.mainCharacters = []
      this.currentMovie = {}
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
      this.currentMovie.id = movie.id
    },
    loadTags () {
      axios.get(URL_LOCAL_API_MOVIE + '/tags')
        .then(response => {
          this.savedTags = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    filterByGenre (genre) {
      axios.get(URL_API__DISCOVER_MOVIE + API_KEY + '&language=' + LNG + '&sort_by=popularity.desc&include_adult=false' +
        '&include_video=false&page=' + this.currentPage + '&with_genres=' + genre.id)
        .then(response => {
          this.source = 'genre'
          this.currentGenre = genre.id
          this.movies = response.data.results
          this.totalResults = response.data.total_results
          this.$refs.detailsModal.hide()
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    filterByTag (tag) {
      axios.get(URL_LOCAL_API_MOVIE + '/tag/' + tag + '/page/' + this.currentPage)
        .then(response => {
          this.movies = response.data.movies
          this.totalResults = response.data.total_results
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    filterBySavedGenre (idGenre) {
      axios.get(URL_LOCAL_API_MOVIE + '/genre/' + idGenre + '/page/' + this.currentPage)
        .then(response => {
          this.movies = response.data.movies
          this.totalResults = response.data.total_results
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    editInformations (id) {
      axios.get(URL_LOCAL_API_MOVIE + '/one/' + id)
        .then(response => {
          this.currentMovie = response.data
          this.$data.comment = this.currentMovie.comment
          this.$data.tags = this.currentMovie.tags.join(';')
          this.$refs.tagModal.show()
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    change () {
      if (this.source === 'my_movies') {
        axios.get(URL_LOCAL_API_MOVIE + '/page/' + this.currentPage)
          .then(response => {
            this.movies = response.data.movies
            this.totalResults = response.data.total_results
          })
          .catch(e => {
            this.errors.push(e)
          })
      } else if (this.source === 'genre') {
        axios.get(URL_API__DISCOVER_MOVIE + API_KEY + '&language=' + LNG + '&sort_by=popularity.desc&include_adult=false' +
          '&include_video=false&page=' + this.currentPage + '&with_genres=' + this.currentGenre)
          .then(response => {
            this.movies = response.data.results
            this.totalResults = response.data.total_results
          }).catch(e => {
            this.errors.push(e)
          })
      } else {
        axios.get(URL_API_MOVIE + this.source + '?api_key=' + API_KEY + '&language=' + LNG + '&page=' + this.currentPage)
          .then(response => {
            this.movies = response.data.results
            this.totalResults = response.data.total_results
          }).catch(e => {
            this.errors.push(e)
          })
      }
    },
    clickOnEye (movie) {
      if (!this.ids.includes(movie.id)) {
        this.currentMovie.id = movie.id
        this.currentMovie.poster_path = movie.poster_path
        this.currentMovie.title = movie.title
        this.currentMovie.genres = movie.genre_ids
        axios.post(URL_LOCAL_API_MOVIE, this.currentMovie)
          .then(response => {
            this.ids.push(this.currentMovie.id)
            this.$refs.tagModal.show()
          })
          .catch(e => {
            this.errors.push(e)
          })
      } else {
        axios.delete(URL_LOCAL_API_MOVIE + '/' + movie.id)
          .then(response => {
            let idx = this.ids.indexOf(movie.id)
            this.ids.splice(idx, 1)
            if (this.source === 'my_movies') {
              axios.get(URL_LOCAL_API_MOVIE + '/page/' + this.currentPage)
                .then(response => {
                  this.movies = response.data.movies
                  this.totalResults = response.data.total_results
                })
                .catch(e => {
                  this.errors.push(e)
                })
              this.loadTags()
            }
          })
          .catch(e => {
            this.errors.push(e)
          })
      }
    },
    onModalSubmit (evt) {
      evt.preventDefault()
      this.currentMovie.tags = this.tags.split(';')
      this.currentMovie.comment = this.comment
      axios.put(URL_LOCAL_API_MOVIE, this.currentMovie)
        .then(response => {
          this.loadTags()
        })
        .catch(e => {
          this.errors.push(e)
        })
      this.$data.comment = ''
      this.$data.tags = ''
      this.$data.currentMovie = {}
      this.$refs.tagModal.hide()
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
  .nav-tab > a:focus, .nav-tab > a:hover{
    color: #95A0AF;
  }
  .filterColumn{
    padding-top: 35px;
  }
  .filterList > h3,  .filterList > li > a{
    color: #707984;
    font-weight: bold;
  }
  .filterList{
    list-style-type: none;
    padding-top: 20px;
    text-align: left;
  }
  .filterList > li > a{
    font-size: 28px;
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
  .details, .filterLink, .genreLink{
    font-size: 22px;
    color: inherit;
    text-decoration: inherit;
  }
  .details:hover, .filterLink:hover, .genreLink:hover{
    color: inherit;
    text-decoration: inherit;
  }
  .genreLink{
    font-weight: bold;
    margin-right: 10px;
  }
  .editLink{
    margin-left: 15px;
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
