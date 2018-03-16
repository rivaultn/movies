var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({
  id: Number,
  comment: String,
  author: String,
  tags: [String],
  stars: Number
})

module.exports = mongoose.model('Movie', MovieSchema)
