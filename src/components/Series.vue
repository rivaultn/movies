<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col class="filterColumn" sm="1" v-if="source == 'my_series'">
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
        <b-col offset-sm="1" sm="9">
          <b-nav>
            <b-nav-item @click="setSource('on_the_air')" active class="nav-tab">EN SALLE</b-nav-item>
            <b-nav-item @click="setSource('popular')" class="nav-tab">POPULAIRE</b-nav-item>
            <b-nav-item @click="setSource('top_rated')" class="nav-tab">MIEUX NOTÉES</b-nav-item>
            <b-nav-item @click="setSource('my_series')" class="nav-tab">MES SÉRIES</b-nav-item>
          </b-nav>

          <b-form @submit="search" class="searchForm">
            <b-row class="my-1">
              <b-col sm="4">
                <b-form-input id="input-search" type="text" class="componentFont" placeholder="recherche" v-model="searchKeyword"></b-form-input>
              </b-col>
              <b-col sm="2">
                <b-button type="submit" class="componentFont">Rechercher</b-button>
              </b-col>
            </b-row>
          </b-form>

          <b-card-group deck v-for="i in Math.ceil(series.length / 5)" :key="i" class="serieRow">
            <b-card class="cardserie" v-for="serie in series.slice((i - 1) * 5, i * 5)" :key="serie.id" bg-variant="dark"
                    :title="serie.name"
                    :img-src="serie.poster_path ? PATH_IMG_300+serie.poster_path  : require('../assets/No_Image_Available.jpg')"
                    img-alt="Img"
                    img-top>
              <div slot="footer">
                <b-link @click.stop="details(serie)" v-b-modal.detailsModal class="details">détails</b-link><br />
                <b-link @click="clickOnEye(serie)"><icon v-bind:class="{'saved': ids.includes(serie.id)}" class="eye" name="eye" scale="2"></icon></b-link>
                <b-link @click="editInformations(serie.id)" v-if="ids.includes(serie.id)" class="editLink"><icon class="eye" name="edit" scale="1.6"></icon></b-link>
                <p class="card-text">
                  <span v-if="ids.includes(serie.id)">{{ serie.comment }}</span>
                </p>
              </div>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center justify-content-sm-center paginationRow">
        <b-pagination v-on:input="change" :total-rows="totalResults" :per-page="20" v-model="currentPage" class="componentFont"/>
      </b-row>

      <b-modal id="detailsModal"
               :title= "serie.name"
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
              <b-img fluid :src="serie.poster_path ? PATH_IMG_200+serie.poster_path  : require('../assets/No_Image_Available.jpg')" alt="left image" />
            </b-col>
            <b-col>
              <h4 class="synopsis">Synopsis : </h4>
              <span>{{ serie.overview }}</span><br /><br />
              <b-link @click="filterByGenre(genre)" class="genreLink" v-for="genre in serie.genres" :key="genre.id"> {{genre.name}} </b-link>
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
          <b-link @click="clickOnEye(serie)"><icon v-bind:class="{'saved': ids.includes(serie.id)}" class="eye" name="eye" scale="2"></icon></b-link>
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
import {URL_API_SERIE, URL_LOCAL_API_SERIE, URL_API__DISCOVER_SERIE, URL_API_GENRE, URL_API_SEARCH, API_KEY, PATH_IMG_300, LNG, PATH_IMG_FACE_138_175, PATH_IMG_200} from '../constant.js'

export default {
  name: 'serieList',
  data () {
    return {
      currentPage: 1,
      totalResults: 1,
      source: 'on_the_air',
      searchResults: false,
      errors: [],
      series: [],
      mainCharacters: [],
      ids: [],
      serie: {},
      currentSerie: {},
      currentGenre: 1,
      searchKeyword: '',
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
    axios.get(URL_API_SERIE + this.source + '?api_key=' + API_KEY + '&language=' + LNG + '&page=' + this.currentPage)
      .then(response => {
        this.series = response.data.results
        this.totalResults = response.data.total_results
      })
      .catch(e => {
        this.errors.push(e)
      })
    axios.get(URL_LOCAL_API_SERIE + '/ids')
      .then(response => {
        this.ids = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
    axios.get(URL_API_GENRE + '/tv/list?api_key=' + API_KEY + '&language=' + LNG)
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
      this.searchResults = false
      this.change()
    },
    details (serie) {
      this.mainCharacters = []
      this.currentSerie = {}
      axios.get(URL_API_SERIE + serie.id + '?api_key=' + API_KEY + '&language=' + LNG)
        .then(response => {
          this.serie = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
      axios.get(URL_API_SERIE + serie.id + '/credits?api_key=' + API_KEY)
        .then(response => {
          this.mainCharacters = response.data.cast
        })
        .catch(e => {
          this.errors.push(e)
        })
      this.currentSerie.id = serie.id
    },
    loadTags () {
      axios.get(URL_LOCAL_API_SERIE + '/tags')
        .then(response => {
          this.savedTags = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    filterByGenre (genre) {
      this.searchResults = false
      axios.get(URL_API__DISCOVER_SERIE + API_KEY + '&language=' + LNG + '&sort_by=popularity.desc&include_adult=false' +
        '&include_video=false&page=' + this.currentPage + '&with_genres=' + genre.id)
        .then(response => {
          this.source = 'genre'
          this.currentGenre = genre.id
          this.series = response.data.results
          this.totalResults = response.data.total_results
          this.$refs.detailsModal.hide()
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    filterByTag (tag) {
      this.searchResults = false
      axios.get(URL_LOCAL_API_SERIE + '/tag/' + tag + '/page/' + this.currentPage)
        .then(response => {
          this.series = response.data.series
          this.totalResults = response.data.total_results
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    filterBySavedGenre (idGenre) {
      this.searchResults = false
      axios.get(URL_LOCAL_API_SERIE + '/genre/' + idGenre + '/page/' + this.currentPage)
        .then(response => {
          this.series = response.data.series
          this.totalResults = response.data.total_results
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    editInformations (id) {
      axios.get(URL_LOCAL_API_SERIE + '/one/' + id)
        .then(response => {
          this.currentSerie = response.data
          this.$data.comment = this.currentSerie.comment
          this.$data.tags = this.currentSerie.tags.join(';')
          this.$refs.tagModal.show()
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    change () {
      if (this.searchResults) {
        if (this.source === 'my_series') {
          axios.get(URL_LOCAL_API_SERIE + '/search/' + this.searchKeyword + '/page/' + this.currentPage)
            .then(response => {
              this.series = response.data.series
              this.totalResults = response.data.total_results
            })
            .catch(e => {
              this.errors.push(e)
            })
        } else {
          axios.get(URL_API_SEARCH + 'tv?api_key=' + API_KEY + '&language=' + LNG + '&query=' + this.searchKeyword +
            '&page=' + this.currentPage + '&include_adult=false')
            .then(response => {
              this.series = response.data.results
              this.totalResults = response.data.total_results
            })
            .catch(e => {
              this.errors.push(e)
            })
        }
      } else {
        if (this.source === 'my_series') {
          axios.get(URL_LOCAL_API_SERIE + '/page/' + this.currentPage)
            .then(response => {
              this.series = response.data.series
              this.totalResults = response.data.total_results
            })
            .catch(e => {
              this.errors.push(e)
            })
        } else if (this.source === 'genre') {
          axios.get(URL_API__DISCOVER_SERIE + API_KEY + '&language=' + LNG + '&sort_by=popularity.desc&include_adult=false' +
            '&include_video=false&page=' + this.currentPage + '&with_genres=' + this.currentGenre)
            .then(response => {
              this.series = response.data.results
              this.totalResults = response.data.total_results
            }).catch(e => {
              this.errors.push(e)
            })
        } else {
          axios.get(URL_API_SERIE + this.source + '?api_key=' + API_KEY + '&language=' + LNG + '&page=' + this.currentPage)
            .then(response => {
              this.series = response.data.results
              this.totalResults = response.data.total_results
            }).catch(e => {
              this.errors.push(e)
            })
        }
      }
    },
    search () {
      this.searchResults = true
      this.currentPage = 1
      if (this.source === 'my_series') {
        axios.get(URL_LOCAL_API_SERIE + '/search/' + this.searchKeyword + '/page/' + this.currentPage)
          .then(response => {
            this.series = response.data.series
            this.totalResults = response.data.total_results
          })
          .catch(e => {
            this.errors.push(e)
          })
      } else {
        axios.get(URL_API_SEARCH + 'tv?api_key=' + API_KEY + '&language=' + LNG + '&query=' + this.searchKeyword +
          '&page=' + this.currentPage + '&include_adult=false')
          .then(response => {
            this.series = response.data.results
            this.totalResults = response.data.total_results
          })
          .catch(e => {
            this.errors.push(e)
          })
      }
    },
    clickOnEye (serie) {
      if (!this.ids.includes(serie.id)) {
        this.currentSerie.id = serie.id
        this.currentSerie.poster_path = serie.poster_path
        this.currentSerie.name = serie.name
        this.currentSerie.genres = serie.genre_ids
        axios.post(URL_LOCAL_API_SERIE, this.currentSerie)
          .then(response => {
            this.ids.push(this.currentSerie.id)
            this.$refs.tagModal.show()
          })
          .catch(e => {
            this.errors.push(e)
          })
      } else {
        axios.delete(URL_LOCAL_API_SERIE + '/' + serie.id)
          .then(response => {
            let idx = this.ids.indexOf(serie.id)
            this.ids.splice(idx, 1)
            if (this.source === 'my_series') {
              axios.get(URL_LOCAL_API_SERIE + '/page/' + this.currentPage)
                .then(response => {
                  this.series = response.data.series
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
      this.currentSerie.tags = this.tags.split(';')
      this.currentSerie.comment = this.comment
      axios.put(URL_LOCAL_API_SERIE, this.currentSerie)
        .then(response => {
          this.loadTags()
        })
        .catch(e => {
          this.errors.push(e)
        })
      this.$data.comment = ''
      this.$data.tags = ''
      this.$data.currentSerie = {}
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
  .serieRow, .searchForm{
    margin-bottom: 20px;
  }
  .cardserie{
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
