<!--  Component the represent the left sidebar  -->
<template>
  <b-col class="filterColumn" sm="1">
    <ul class="filterTagList filterList" v-if="local === true">
      <h3>TAGS</h3>
      <li v-for="savedTag in savedTags" :key="savedTag">
        <b-link @click="filterByTag(savedTag, $event)" class="filterLink">{{ savedTag}}</b-link>
      </li>
    </ul>

    <ul class="filterGenreList filterList">
      <h3>GENRES</h3>
      <li v-for="genre in genres" :key="genre.id">
        <b-link @click="filterByGenre(genre, $event)" class="filterLink">{{ genre.name}}</b-link>
      </li>
    </ul>
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
      this.removeActiveClass('.filterTagList > li > a.active')
      this.removeActiveClass('.filterGenreList > li > a.active')
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

      this.removeActiveClass('.filterTagList > li > a.active')
      this.removeActiveClass('.filterGenreList > li > a.active')
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
</style>
