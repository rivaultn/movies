<!-- Component that represent card of serie or film -->
<template>
    <b-card class="cardItem" bg-variant="dark"
            :title= "itemSource === c.TV_KEYWORD && local !== true ? item.name : item.title"
            :img-src="item.poster_path ? c.PATH_IMG_300+item.poster_path  : require('../assets/No_Image_Available.jpg')"
            img-alt="Img"
            img-top>
      <div slot="footer">
        <b-link @click.stop="clickOnDetails(item)" v-b-modal.detailsModal class="details">détails</b-link><br />
        <b-link @click="clickOnEye(item)"><icon v-bind:class="{'saved': ids.includes(item.id)}" class="eye" name="eye" scale="2"></icon></b-link>
        <b-link @click="clickOnEdit(item.id)" v-if="ids.includes(item.id)" class="editLink"><icon class="eye" name="edit" scale="1.6"></icon></b-link>
        <p class="card-text">
          <span v-if="ids.includes(item.id)">{{ item.comment }}</span>
        </p>
      </div>
    </b-card>
</template>

<script>
var c = require('../constant.js')

export default {
  name: 'CardItem',
  props: {
    ids: Array, // stock the ids of saved items
    item: {}, // stock the item
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
      default: c.NOW_PLAYING_MOVIE
    }
  },
  data () {
    return {
      c: c, // constants
      currentItem: {}, // stock the current item to get details, save or update it
      mainCharacters: [] // stock main characters of a film to display in details
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
     * Method to alert the parent component to show the details modal
     * @param item the item (Object)
     */
    clickOnDetails (item) {
      this.$emit('detailsItem', item)
    },
    /**
     * Method to alert the parent component to show the tag modal to edit comment & tags of a saved film / serie
     * @param id the id of item (Number)
     */
    clickOnEdit (id) {
      this.$emit('editInformations', id)
    }
  }
}
</script>

<style>
  .cardItem{
    color: #707984;
    max-width: 20rem;
  }
  .details{
    font-size: 28px;
    color: inherit;
    text-decoration: inherit;
  }
  .details:hover{
    color: inherit;
    text-decoration: inherit;
  }
  .editLink{
    margin-left: 15px;
  }
  .eye{
    color: #D1D1D1;
  }
  .saved{
    color: #2D63A1;
  }
</style>
