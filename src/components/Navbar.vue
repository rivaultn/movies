<!--  Component that represent the horizontal navbar  -->
<template>
  <div>
    <b-nav>
      <b-nav-item id='nowPlayingItem' @click="setSource(itemSource === c.TV_KEYWORD ? c.NOW_PLAYING_TV : c.NOW_PLAYING_MOVIE, $event)"
                  active class="nav-tab">EN SALLE</b-nav-item>
      <b-nav-item id='popularItem' @click="setSource('popular', $event)" class="nav-tab">POPULAIRE</b-nav-item>
      <b-nav-item id='topRatedItem' @click="setSource('top_rated', $event)" class="nav-tab">MIEUX NOTÉS</b-nav-item>
      <b-nav-item id='localSourceItem' @click="setSource('local', $event)" class="nav-tab">
        {{ itemSource === c.TV_KEYWORD ? 'MES SÉRIES' : 'MES FILMS' }}</b-nav-item>
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
  </div>
</template>

<script>
import axios from 'axios'
var c = require('../constant.js')

export default {
  name: 'navbar',
  props: {
    ids: Array, // stock the ids of saved items
    itemSource: { // stock the source ('movie' || 'tv')
      type: String,
      default: c.MOVIE_KEYWORD
    },
    local: { // false if displayed items are from the external api, true if it's saved items
      type: Boolean,
      default: false
    },
    source: { // stock the source ('popular', 'now_playing', 'on_the_air', 'top_rated')
      type: String,
      default: ' '
    },
    items: Array // stock the displayed items
  },
  data () {
    return {
      c: c, // constant
      currentPage: 1, // stock the current page
      searchResults: true, // true if it's a search result, false if it isn't
      searchKeyword: '' // stock the keyword if it's a search result
    }
  },
  methods: {
    /**
     * Methode to reset active link in genre & tags sections (sidebar component) & link in navbar component
     */
    resetActiveLink () {
      // reset active link in genres section in sidebar component
      var active = document.querySelector('.filterGenreList > li > a.active')
      if (active !== null) {
        active.classList.remove('active')
      }

      // reset active link in tags section in sidebar component
      active = document.querySelector('.filterTagList > li > a.active')
      if (active !== null) {
        active.classList.remove('active')
      }

      // reset active link in navbar component
      active = document.querySelector('.nav > li > a.active')
      if (active !== null) {
        active.classList.remove('active')
      }
    },
    /**
     * Method to search a film or serie by keyword
     * @param evt the emitter event (DOM)
     */
    search (evt) {
      evt.preventDefault()
      this.resetActiveLink()
      this.searchResults = true
      this.currentPage = 1

      if (this.searchKeyword !== '') {
        // local URL
        var localApi = c.URL_LOCAL_API + this.itemSource + '/' + c.SEARCH_URL_KEYWORD + this.searchKeyword +
          c.PAGE_URL_KEYWORD + this.currentPage

        // external URL
        var externalApi = c.URL_API_SEARCH + this.itemSource + c.API_KEY +
          c.LNG_PARAM_KEYWORD + c.LNG + c.QUERY_PARAM_KEYWORD + this.searchKeyword + c.PAGE_PARAM_KEYWORD + this.currentPage +
          c.NOINCLUDEADULTECONTENT_PARAM_KEYWORD

        /** Get the movies or films & alert the parent component */
        axios.get(this.source === c.LOCAL_SOURCE_KEYWORD ? localApi : externalApi)
          .then(response => {
            this.$emit('filterByNavbar', {
              'currentPage': this.currentPage,
              'searchResults': this.searchResults,
              'searchKeyword': this.searchKeyword,
              'items': response.data.results,
              'totalResults': response.data.total_results
            })
          }).catch(e => { this.errors.push(e) })
      }
    },
    /**
     * Set the current source & change the color of the active link
     * @param source the new source (String)
     * @param event the emitter event (DOM)
     */
    setSource (source, event) {
      // reset input search
      document.querySelector('#input-search').value = ''

      this.resetActiveLink()

      event.target.classList.add('active')

      var activeLocal = source === 'local'

      // alert the parent component
      this.$emit('sourceChange', {
        'currentPage': 1,
        'local': activeLocal,
        'source': source,
        'searchResults': false
      })
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
  .nav-tab > a:focus, .nav-tab > a:hover, .active{
    color: #A2AFC1 !important;
  }
  .searchForm{
    margin-bottom: 20px;
  }
</style>
