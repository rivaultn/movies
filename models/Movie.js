/**
 * Movie schema
 * @type {*|Mongoose}
 */

var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({
  id: Number,
  comment: String,
  tags: [String],
  title: String,
  poster_path: String,
  genres: [Number]
})

module.exports = mongoose.model('Movie', MovieSchema)
