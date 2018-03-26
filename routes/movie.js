var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Movie = require('../models/Movie.js')
var cors = require('cors')

router.use(cors())

router.get('/movie/page/:page', function (req, res, next) {
  var perPage = 20
  var page = req.params.page || 1
  Movie.find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function (err, products) {
      if (err) return next(err)
      res.json(products)
    })
})

router.get('/movie/total_pages', function (req, res, next) {
  var perPage = 20
  Movie.find({}).count().exec(function (err, count) {
    if (err) return next(err)
    res.json(Math.ceil(count / perPage))
  })
})

router.get('/movie/ids', function (req, res, next) {
  Movie.distinct('id').exec(function (err, ids) {
    if (err) return next(err)
    res.json(ids)
  })
})

router.post('/movie', function (req, res, next) {
  Movie.create(req.body, function (err, post) {
    if (err) return next(err)
    res.json(post)
  })
})

router.delete('/movie/:id', function (req, res, next) {
  Movie.deleteOne({
    id: req.params.id
  }).exec(function (err, post) {
    if (err) return next(err)
    res.json(post)
  })
})

module.exports = router
