<!--  Component the represent modal to save comment & tags  -->
<template>
  <b-modal id="tagModal"
           :hide-header=true
           :hide-footer=true
           ref="tagModal">
    <b-form @submit="onModalSubmit">
      <b-row class="my-1">
        <b-col sm="3"><label for="input-comment">Commentaires :</label></b-col>

        <b-col sm="9">
          <b-form-input ref="inputComment" id="input-comment" type="text" placeholder="Commentaires" v-model="tmpComment"></b-form-input>
        </b-col>
      </b-row>

      <b-row class="my-1">
        <b-col sm="3"><label for="input-tag">Tags :</label></b-col>

        <b-col sm="7">
          <b-form-input ref="inputTag" id="input-tag" type="text" placeholder="Tags" v-model="tmpTags"></b-form-input>
        </b-col>

        <b-col sm="2">
          <b-button type="submit">OK</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-modal>
</template>

<script>
import axios from 'axios'
var c = require('../constant.js')

export default {
  name: 'tag-modal',
  props: {
    comment: { // stock the comment of an item
      type: String,
      default: ''
    },
    currentItem: {}, // stock the current item to get details, save or update it
    itemSource: { // stock the source ('movie' || 'tv')
      type: String,
      default: c.MOVIE_KEYWORD
    },
    tags: { // stock the tags of an item
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // to bind data with input fields
      tmpComment: this.comment,
      tmpTags: this.tags
    }
  },
  methods: {
    /**
     * Method to show up the modal
     * @param comment the comment (String)
     * @param tags the tags (String)
     */
    showModal (comment, tags) {
      this.tmpComment = comment
      this.tmpTags = tags
      this.$refs.tagModal.show()
    },
    /**
     * Method to hide the modal
     */
    hideModal () {
      this.$refs.tagModal.hide()
    },

    /**
     * Method to execute on submit
     * @param evt the event
     */
    onModalSubmit (evt) {
      evt.preventDefault()
      this.currentItem.tags = this.tmpTags.split(';')
      this.currentItem.comment = this.tmpComment

      /** Update the movie or film & alert the component parent */
      axios.put(c.URL_LOCAL_API + this.itemSource, this.currentItem)
        .then(response => {
          this.$emit('tagsSaved', this.currentItem)
        })
        .catch(e => {
          this.errors.push(e)
        })

      /** clear & hide modal */
      this.$data.comment = ''
      this.$data.tags = ''
      this.$data.currentItem = {}
      this.$refs.tagModal.hide()
    }
  }
}
</script>

<style>
  #tagModal{
    font-size: 22px;
  }
</style>
