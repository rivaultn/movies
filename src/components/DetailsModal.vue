<!-- Component that represent the details modal -->
<template>
  <b-modal id="detailsModal"
           :title= "itemSource === c.TV_KEYWORD ? item.name : item.title"
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
          <b-img fluid :src="item.poster_path ? c.PATH_IMG_200+item.poster_path  : require('../assets/No_Image_Available.jpg')" alt="left image" />
        </b-col>
        <b-col>
          <h4 class="synopsis">Synopsis : </h4>
          <span>{{ item.overview }}</span><br /><br />
          <b-link @click="filterByGenre(genre)" class="genreLink" v-for="genre in item.genres" :key="genre.id"> {{genre.name}} </b-link>
        </b-col>
      </b-row>

      <b-row class="mainCharacters" v-if="mainCharacters.length > 0">
        <b-card-group deck>
          <b-card mx-auto class="cardCharacter"
                  v-for="indexCharacter in mainCharacters.length > c.MAX_PER_ROW ? c.MAX_PER_ROW : mainCharacters.length"
                  :key="indexCharacter"
                  :title="mainCharacters[indexCharacter - 1].name "
                  :img-src="mainCharacters[indexCharacter - 1].profile_path ?
                  c.PATH_IMG_FACE_138_175+mainCharacters[indexCharacter - 1].profile_path  : require('../assets/No_Image_Available.jpg')"
                  img-alt="Img">
            <p class="card-text">
              <span>{{mainCharacters[indexCharacter - 1].character}}</span>
            </p>
          </b-card>
        </b-card-group>
      </b-row>
    </b-container>

    <div slot="modal-footer" class="w-100">
      <b-link @click="clickOnEye(item)"><icon v-bind:class="{'saved': ids.includes(item.id)}" class="eye" name="eye" scale="2"></icon></b-link>
    </div>
  </b-modal>
</template>

<script>
var c = require('../constant.js')

export default {
  name: 'details-modal',
  props: {
    ids: Array, // stock the ids of saved items
    item: {}, // stock the item
    itemSource: { // stock the source ('movie' || 'tv')
      type: String,
      default: c.MOVIE_KEYWORD
    },
    mainCharacters: Array // stock main characters of a film to display in details
  },
  data () {
    return {
      c: c, // constants
      currentItem: {} // stock the current item to get details, save or update it
    }
  },
  methods: {
    /**
     * Method to save a new film / serie or delete a saved one
     * @param item the item to save or delete (Object)
     */
    clickOnEye (item) {
      // if the item isn't currently saved
      if (!this.ids.includes(item.id)) {
        this.currentItem.id = item.id
        this.currentItem.poster_path = item.poster_path
        this.currentItem.title = this.itemSource === c.TV_KEYWORD ? item.name : item.title
        this.currentItem.genres = item.genre_ids

        // alert the parent component
        this.$emit('savingNewItem', this.currentItem)
      } else {
        // alert the parent component
        this.$emit('deleteSavedItem', item.id)
      }
    },
    /**
     * Method to filter the films / series displayed by their genre
     * @param genre the genre (Object)
     */
    filterByGenre (genre) {
      // alert the parent component
      this.$emit('filterByGenre', genre)
      // hide the details modal
      this.$refs.detailsModal.hide()
    }
  }
}
</script>

<style>
  .modal-title{
    font-weight: bold;
    font-size: 22px;
    color: #707984;
  }
  .genreLink{
    font-size: 22px;
    color: inherit;
    text-decoration: inherit;
  }
  .genreLink:hover{
    color: inherit;
    text-decoration: inherit;
  }
  .genreLink{
    font-weight: bold;
    margin-right: 10px;
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
  .saved{
    color: #2D63A1;
  }
</style>
