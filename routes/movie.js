var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Movie = require('../models/Movie.js')
var cors = require('cors')

router.use(cors())

router.get('/movie/one/:id', function (req, res, next) {
  Movie.findOne({ 'id': req.params.id }, function (err, post) {
    if (err) return next(err)
    res.json(post)
  })
})

router.get('/movie/page/:page', function (req, res, next) {
  var perPage = 20
  var page = req.params.page || 1
  Movie.find({}).count().exec(function (err, totalResults) {
    if (err) return next(err)
    Movie.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, movies) {
        if (err) return next(err)
        res.json({total_results: totalResults, movies})
      })
  })
})

router.get('/movie/tag/:tag/page/:page', function (req, res, next) {
  var perPage = 20
  var page = req.params.page || 1
  var tag = req.params.tag || ''
  Movie.find({'tags': tag}).count().exec(function (err, totalResults) {
    if (err) return next(err)
    Movie.find({'tags': tag})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, movies) {
        if (err) return next(err)
        res.json({total_results: totalResults, movies})
      })
  })
})

router.get('/movie/genre/:genre/page/:page', function (req, res, next) {
  var perPage = 20
  var page = req.params.page || 1
  var genre = req.params.genre || ''
  Movie.find({'genres': genre}).count().exec(function (err, totalResults) {
    if (err) return next(err)
    Movie.find({'genres': genre})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, movies) {
        if (err) return next(err)
        res.json({total_results: totalResults, movies})
      })
  })
})

router.get('/movie/search/:keyword/page/:page', function (req, res, next) {
  var perPage = 20
  var page = req.params.page || 1
  var keyword = req.params.keyword || ''
  Movie.find({ title: { $regex: '.*' + keyword + '.*', $options: 'i' } }).count().exec(function (err, totalResults) {
    if (err) return next(err)
    Movie.find({ title: { $regex: '.*' + keyword + '.*', $options: 'i' } })
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, movies) {
        if (err) return next(err)
        res.json({total_results: totalResults, movies})
      })
  })
})

router.get('/movie/ids', function (req, res, next) {
  Movie.distinct('id').exec(function (err, ids) {
    if (err) return next(err)
    res.json(ids)
  })
})

router.get('/movie/tags', function (req, res, next) {
  Movie.distinct('tags').exec(function (err, tags) {
    if (err) return next(err)
    res.json(tags.sort())
  })
})

router.post('/movie', function (req, res, next) {
  Movie.create(req.body, function (err, post) {
    if (err) return next(err)
    res.json(post)
  })
})

router.put('/movie', function (req, res, next) {
  var query = {'id': req.body.id}
  Movie.findOneAndUpdate(query, {'$set': { 'comment': req.body.comment,
    'tags': req.body.tags,
    'title': req.body.title,
    'poster_path': req.body.poster_path }}, {upsert: true}, function (err) {
    if (err) return next(err)
    return res.send('succesfully saved')
  })
})

router.delete('/movie/:id', function (req, res, next) {
  Movie.deleteOne({ id: req.params.id }).exec(function (err, post) {
    if (err) return next(err)
    res.json(post)
  })
})

module.exports = router
