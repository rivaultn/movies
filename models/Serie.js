var mongoose = require('mongoose')

var SerieSchema = new mongoose.Schema({
  id: Number,
  comment: String,
  tags: [String],
  title: String,
  poster_path: String,
  genres: [Number]
})

module.exports = mongoose.model('Serie', SerieSchema)
