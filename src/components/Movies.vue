<template>
  <div>
    <b-container fluid>
        <b-row>
  <!--    sidebar component   -->
          <sidebar :item-source=itemSource :genres=genres :local=local :saved-tags=savedTags :source=source
                   v-on:filterByGenre="genreFilter($event)"
                   v-on:filterByTag="tagFilter($event)">
          </sidebar>

          <b-col offset-sm="1" sm="9">
  <!--    navbar component  -->
            <navbar :ids=ids :items=items :item-source=itemSource :local=local :source=source
                    v-on:filterByNavbar="navbarFilter($event)"
                    v-on:sourceChange="setSource($event)">
            </navbar>

  <!--    card group    -->
            <b-card-group deck v-for="i in Math.ceil(items.length / c.MAX_PER_ROW)" :key="i" class="itemRow">
  <!--  cardItem component   -->
              <card-item v-for="item in items.slice((i - 1) * c.MAX_PER_ROW, i * c.MAX_PER_ROW)" :key="item.id" :ids=ids
                         :item=item :item-source=itemSource :source=source
                         v-on:savingNewItem=savingItem($event)
                         v-on:deleteSavedItem=deleteId($event)
                         v-on:detailsItem=details($event)
                         v-on:editInformations=editInformations($event)>
              </card-item>
            </b-card-group>
          </b-col>
        </b-row>

  <!--    pagination    -->
        <b-row class="justify-content-md-center justify-content-sm-center paginationRow">
          <b-pagination v-on:input="changeItems" :total-rows="totalResults" :per-page="20" v-model="currentPage" class="componentFont"/>
        </b-row>

  <!--    detailsModal component    -->
        <details-modal :ids=ids :item=item :item-source=itemSource :mainCharacters=mainCharacters
                       v-on:savingNewItem=savingItem($event)
                       v-on:filterByGenre=genreFilter($event)
                       v-on:deleteSavedItem=deleteId($event)>
        </details-modal>

   <!--   tagmodal component    -->
        <tag-modal ref="tagModalComponent" :comment=comment :currentItem=currentItem  :item-source=itemSource :tags=tags
                   v-on:tagsSaved=loadTags>
        </tag-modal>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import CardItem from './CardItem'
import DetailsModal from './DetailsModal'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import TagModal from './TagModal'

var c = require('../constant.js')

export default {
  name: 'ItemList',
  components: {
    CardItem,
    DetailsModal,
    Navbar,
    Sidebar,
    TagModal
  },
  data () {
    return {
      c: c, // constant
      comment: '', // stock the comment of an item
      currentGenre: 1, // stock the id of the current genre for genre filter
      currentItem: {}, // stock the current item to get details, save or update it
      currentPage: 1, // stock the current page
      errors: [], // stock the errors
      genres: [], // stock the genres to filter results
      ids: [], // stock the ids of saved items
      item: {}, // stock the item
      items: [], // stock the displayed items
      itemSource: this.$route.params.itemSource || c.MOVIE_KEYWORD, // stock the source ('movie' || 'tv')
      local: false, // false if displayed items are from the external api, true if it's saved items
      mainCharacters: [], // stock main characters of a film to display in details
      savedTags: [], // stock the saved tags associated to items in local
      source: c.NOW_PLAYING_MOVIE, // stock the source ('popular', 'now_playing', 'on_the_air', 'top_rated')
      searchKeyword: '', // stock the keyword if it's a search result
      searchResults: false, // true if it's a search result, false if it isn't
      tags: '', // stock the tags of an item
      totalResults: 1 // stock the total number of items
    }
  },
  watch: {
    /**
     * Method to switch between series and films
     */
    '$route' () {
      this.itemSource = this.$route.params.itemSource

      if (this.itemSource === c.TV_KEYWORD) {
        this.source = c.NOW_PLAYING_TV
      } else {
        this.source = c.NOW_PLAYING_MOVIE
      }

      // actualize displayed items
      this.changeItems()
    }
  },
  created () {
    if (this.itemSource === c.TV_KEYWORD) { this.source = c.NOW_PLAYING_TV }

    // get the films or series
    axios.get(c.URL_API + this.itemSource + '/' + this.source + c.API_KEY + c.LNG_PARAM_KEYWORD +
      c.LNG + c.PAGE_PARAM_KEYWORD + this.currentPage)
      .then(response => {
        this.items = response.data.results
        this.totalResults = response.data.total_results
      })
      .catch(e => {
        this.errors.push(e)
      })

    // load list of saved current ids
    this.loadIds()

    // get the existing genres
    axios.get(c.URL_API_GENRE + this.itemSource + c.LIST__URL_KEYWORD + c.API_KEY + c.LNG_PARAM_KEYWORD + c.LNG)
      .then(response => {
        this.genres = response.data.genres
      })
      .catch(e => {
        this.errors.push(e)
      })

    // load list of saved current tags
    this.loadTags()
  },
  methods: {
    /**
     * Method to set the current source -> navbar component
     * @param dataResult the data to actualize local data (Object)
     */
    setSource (dataResult) {
      this.currentPage = dataResult.currentPage
      this.searchResults = dataResult.searchResults
      this.source = dataResult.source
      this.local = dataResult.local

      //  actualize displayed items & existing tags
      this.changeItems()
      this.loadTags()
    },
    /**
     *  Method to filter displayed items by genre (detailsmodal & sidebar component)
     * @param genre the genre (Object)
     */
    genreFilter (genre) {
      this.currentPage = 1
      this.source = 'genre'
      this.currentGenre = genre.id

      var externalUrl = c.URL_API__DISCOVER + this.itemSource + c.API_KEY + c.LNG_PARAM_KEYWORD + c.LNG +
        c.SORTBYPOPULARITYDESC_KEYWORD + c.NOINCLUDEADULTECONTENT_PARAM_KEYWORD + c.NOINCLUDEVIDEO_PARAM_KEYWORD +
        c.PAGE_PARAM_KEYWORD + this.currentPage + c.WITHGENRES_PARAM_KEYWORD + genre.id

      var localUrl = c.URL_LOCAL_API + this.itemSource + c.GENRE_URL_KEYWORD + genre.id + c.PAGE_URL_KEYWORD + this.currentPage

      axios.get(this.local === true ? localUrl : externalUrl)
        .then(response => {
          this.searchResults = false
          this.currentGenre = genre.id
          this.items = response.data.results
          this.totalResults = response.data.total_results
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    /**
     * Method to filter displayed items by tag (sidebar component)
     * @param eventResult the data to actualize (Object)
     */
    tagFilter (eventResult) {
      this.currentPage = 1
      this.searchResults = eventResult.searchResults
      this.items = eventResult.items
      this.totalResults = eventResult.totalResults
    },
    /**
     * Method to filter displayed items by a search keyword (navbar component)
     * @param eventResult the data to actualize (Object)
     */
    navbarFilter (eventResult) {
      this.currentPage = eventResult.currentPage
      this.searchResults = eventResult.searchResults
      this.searchKeyword = eventResult.searchKeyword
      this.items = eventResult.items
      this.totalResults = eventResult.totalResults
    },
    /**
     * Method to save a new item
     * @param item the item to save (Object)
     */
    savingItem (item) {
      this.currentItem = item

      axios.post(c.URL_LOCAL_API + this.itemSource, this.currentItem)
        .then(response => {
          this.ids.push(item.id)
          this.$refs.tagModalComponent.showModal('', '')
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    /**
     * Method to delete a saved item
     * @param id the item id to delete (Number)
     */
    deleteId (id) {
      axios.delete(c.URL_LOCAL_API + this.itemSource + '/' + id)
        .then(response => {
          let idx = this.ids.indexOf(id)
          this.ids.splice(idx, 1)

          if (this.local === true) {
            axios.get(c.URL_LOCAL_API + this.itemSource + c.PAGE_URL_KEYWORD + this.currentPage)
              .then(response => {
                this.items = response.data.results
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
    },
    /**
     * Method to get details of an item
     * @param item the item (Object)
     */
    details (item) {
      this.mainCharacters = []
      this.currentItem = {}

      axios.get(c.URL_API + this.itemSource + '/' + item.id + c.API_KEY + c.LNG_PARAM_KEYWORD + c.LNG)
        .then(response => {
          this.item = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })

      axios.get(c.URL_API + this.itemSource + '/' + item.id + c.CREDITS_URL_KEYWORD + c.API_KEY)
        .then(response => {
          this.mainCharacters = response.data.cast
        })
        .catch(e => {
          this.errors.push(e)
        })

      this.currentItem.id = item.id
    },
    /**
     * Actualize the existing tags in local
     */
    loadTags () {
      axios.get(c.URL_LOCAL_API + this.itemSource + c.TAGS_URL_KEYWORD)
        .then(response => {
          this.savedTags = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    /**
     * Actualize the ids of saved series or movies
     */
    loadIds () {
      axios.get(c.URL_LOCAL_API + this.itemSource + '/ids')
        .then(response => {
          this.ids = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    /**
     * Method to open tag modal component to edit comment & tags of a saved item
     * @param id the id of the item (Number)
     */
    editInformations (id) {
      axios.get(c.URL_LOCAL_API + this.itemSource + '/one/' + id)
        .then(response => {
          this.currentItem = response.data
          // show tag modal component
          this.$refs.tagModalComponent.showModal(this.currentItem.comment, this.currentItem.tags.join(';'))
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    /**
     * Method to actualize saved items
     */
    changeItems () {
      var url // the url to use to get new results

      // if it's a search result
      if (this.searchResults) {
        if (this.local === true) { // if the search is in saved items
          url = c.URL_LOCAL_API + this.itemSource + c.SEARCH_URL_KEYWORD + this.searchKeyword + c.PAGE_URL_KEYWORD + this.currentPage
        } else { // if it's an external search
          url = c.URL_API_SEARCH + this.itemSource + c.API_KEY + c.LNG_PARAM_KEYWORD + c.LNG + c.QUERY_PARAM_KEYWORD +
            this.searchKeyword + c.PAGE_PARAM_KEYWORD + this.currentPage + c.NOINCLUDEVIDEO_PARAM_KEYWORD
        }
      } else {
        if (this.local === true) { // if results are from saved items
          if (this.source === 'genre') { // if results are filtered by genre
            url = c.URL_LOCAL_API + this.itemSource + c.GENRE_URL_KEYWORD + this.currentGenre + c.PAGE_URL_KEYWORD + this.currentPage
          } else {
            url = c.URL_LOCAL_API + this.itemSource + c.PAGE_URL_KEYWORD + this.currentPage
          }
        } else {
          if (this.source === 'genre') { // if results are filtered by genre
            url = c.URL_API__DISCOVER + this.itemSource + c.API_KEY + c.LNG_PARAM_KEYWORD + c.LNG +
              c.SORTBYPOPULARITYDESC_KEYWORD + c.NOINCLUDEADULTECONTENT_PARAM_KEYWORD + c.NOINCLUDEVIDEO_PARAM_KEYWORD +
              c.PAGE_PARAM_KEYWORD + this.currentPage + c.WITHGENRES_PARAM_KEYWORD + this.currentGenre
          } else {
            url = c.URL_API + this.itemSource + '/' + this.source + c.API_KEY + c.LNG_PARAM_KEYWORD + c.LNG +
              c.PAGE_PARAM_KEYWORD + this.currentPage
          }
        }
      }

      // get the results
      axios.get(url)
        .then(response => {
          this.items = response.data.results
          this.totalResults = response.data.total_results
        }).catch(e => {
          this.errors.push(e)
        })
      // actualize saved item ids
      this.loadIds()
    }
  }
}
</script>

<style>
  .card-body > h4{
    font-weight: bold;
  }
  .itemRow{
    margin-bottom: 20px;
  }
  .paginationRow{
    margin-top: 30px;
  }
</style>
