var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({
  id: Number,
  comment: String,
  tags: [String],
  stars: {type: Number, default: 0},
  title: String,
  poster_path: String
})

module.exports = mongoose.model('Movie', MovieSchema)
