var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Serie = require('../models/Serie.js')
var cors = require('cors')

router.use(cors())

router.get('/serie/one/:id', function (req, res, next) {
  Serie.findOne({ 'id': req.params.id }, function (err, post) {
    if (err) return next(err)
    res.json(post)
  })
})

router.get('/serie/page/:page', function (req, res, next) {
  var perPage = 20
  var page = req.params.page || 1
  Serie.find({}).count().exec(function (err, totalResults) {
    if (err) return next(err)
    Serie.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, series) {
        if (err) return next(err)
        res.json({total_results: totalResults, series})
      })
  })
})

router.get('/serie/tag/:tag/page/:page', function (req, res, next) {
  var perPage = 20
  var page = req.params.page || 1
  var tag = req.params.tag || ''
  Serie.find({'tags': tag}).count().exec(function (err, totalResults) {
    if (err) return next(err)
    Serie.find({'tags': tag})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, series) {
        if (err) return next(err)
        res.json({total_results: totalResults, series})
      })
  })
})

router.get('/serie/genre/:genre/page/:page', function (req, res, next) {
  var perPage = 20
  var page = req.params.page || 1
  var genre = req.params.genre || ''
  Serie.find({'genres': genre}).count().exec(function (err, totalResults) {
    if (err) return next(err)
    Serie.find({'genres': genre})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, series) {
        if (err) return next(err)
        res.json({total_results: totalResults, series})
      })
  })
})

router.get('/serie/search/:keyword/page/:page', function (req, res, next) {
  var perPage = 20
  var page = req.params.page || 1
  var keyword = req.params.keyword || ''
  Serie.find({ title: { $regex: '.*' + keyword + '.*', $options: 'i' } }).count().exec(function (err, totalResults) {
    if (err) return next(err)
    Serie.find({ title: { $regex: '.*' + keyword + '.*', $options: 'i' } })
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, series) {
        if (err) return next(err)
        res.json({total_results: totalResults, series})
      })
  })
})

router.get('/serie/ids', function (req, res, next) {
  Serie.distinct('id').exec(function (err, ids) {
    if (err) return next(err)
    res.json(ids)
  })
})

router.get('/serie/tags', function (req, res, next) {
  Serie.distinct('tags').exec(function (err, tags) {
    if (err) return next(err)
    res.json(tags.sort())
  })
})

router.post('/serie', function (req, res, next) {
  Serie.create(req.body, function (err, post) {
    if (err) return next(err)
    res.json(post)
  })
})

router.put('/serie', function (req, res, next) {
  var query = {'id': req.body.id}
  Serie.findOneAndUpdate(query, {'$set': { 'comment': req.body.comment,
    'tags': req.body.tags,
    'title': req.body.title,
    'poster_path': req.body.poster_path }}, {upsert: true}, function (err) {
    if (err) return next(err)
    return res.send('succesfully saved')
  })
})

router.delete('/serie/:id', function (req, res, next) {
  Serie.deleteOne({ id: req.params.id }).exec(function (err, post) {
    if (err) return next(err)
    res.json(post)
  })
})

module.exports = router
