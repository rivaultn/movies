<!--  Component the represent the left sidebar  -->
<template>
    <b-col class="filterColumn" sm="1" >
      <b-navbar class="filterNavbar" toggleable="md" type="dark">
        <b-navbar-toggle target="nav_filter_collapse"></b-navbar-toggle>

        <b-collapse is-nav id="nav_filter_collapse">
          <b-nav vertical class="componentFont filterList">
            <h3 v-if="local === true">TAGS</h3>
            <b-nav-item v-if="local === true" v-for="savedTag in savedTags" :key="savedTag" @click="filterByTag(savedTag, $event)" class="filterLink">{{ savedTag}}</b-nav-item><br />
            <h3>GENRES</h3>
            <b-nav-item v-for="genre in genres" :key="genre.id" @click="filterByGenre(genre, $event)" class="filterLink">{{ genre.name}}</b-nav-item>
          </b-nav>
        </b-collapse>
      </b-navbar>
    </b-col>
</template>

<script>
import axios from 'axios'
var c = require('../constant.js')

export default {
  name: 'sidebar',
  props: {
    genres: Array, // stock the genres to filter results
    itemSource: { // stock the source ('movie' || 'tv')
      type: String,
      default: c.MOVIE_KEYWORD
    },
    local: { // false if displayed items are from the external api, true if it's saved items
      type: Boolean,
      default: false
    },
    savedTags: Array, // stock the saved tags associated to items in local
    source: { // stock the source ('popular', 'now_playing', 'on_the_air', 'top_rated')
      type: String,
      default: c.NOW_PLAYING_MOVIE
    }
  },
  data () {
    return {
      c: c // constant
    }
  },
  // genre sidebar
  methods: {
    /**
     * Method to remove the class active
     * @param classToRemove the selector of the element
     */
    removeActiveClass (classToRemove) {
      var active = document.querySelector(classToRemove)

      if (active !== null) {
        active.classList.remove('active')
      }
    },
    /**
     * Method to filter movies or series by genre
     * @param genre the genre (Object)
     */
    filterByGenre (genre, event) {
      // reset input search
      document.querySelector('#input-search').value = ''

      // remove active class on tags & genres & add active class on the active link
      this.removeActiveClass('.filterList a.active')
      event.target.classList.add('active')

      this.$emit('filterByGenre', genre)
    },
    /**
     * Method to filter movies or series by a tag
     * @param tag the tag (String)
     */
    filterByTag (tag, event) {
      // reset input search
      document.querySelector('#input-search').value = ''

      this.removeActiveClass('.filterList a.active')
      event.target.classList.add('active')

      /** Get the results of the filter & alert the component parent */
      axios.get(c.URL_LOCAL_API + this.itemSource + c.TAG_URL_KEYWORD + tag + c.PAGE_URL_KEYWORD + 1)
        .then(response => {
          this.$emit('filterByTag', {
            'searchResults': false,
            'items': response.data.results,
            'totalResults': response.data.total_results
          })
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>

<style>
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
  .filterLink{
    font-size: 22px;
    color: inherit;
    text-decoration: inherit;
  }
  .filterLink:hover{
    color: #A2AFC1 !important;
    text-decoration: inherit;
  }
  @media (max-width: 768px) {
    .filterList {
      padding-left: 0px;
    }
  }
</style>
