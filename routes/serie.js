var constant = require('../src/constant.js')
var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Serie = require('../models/Serie.js')

/* Allows cross-origin resource sharing */
var cors = require('cors')

router.use(cors())

/** Get one serie by its id */
router.get('/one/:id', function (req, res, next) {
  Serie.findOne({ 'id': req.params.id }, function (err, post) {
    if (err) return next(err)
    res.json(post)
  })
})

/** Get several series with pagination, no filter
 * @page: the page number
 * */
router.get('/page/:page', function (req, res, next) {
  var perPage = constant.MAX_PER_PAGE // maximum result per page
  var page = req.params.page || 1
  Serie.find({}).count().exec(function (err, totalResults) {
    if (err) return next(err)
    Serie.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, results) {
        if (err) return next(err)
        res.json({total_results: totalResults, results})
      })
  })
})

/** Get several series with pagination and filtered by tag
 * @tag: the tag (string)
 * @page: the page number
 * */
router.get('/tag/:tag/page/:page', function (req, res, next) {
  var perPage = constant.MAX_PER_PAGE // maximum result per page
  var page = req.params.page || 1
  var tag = req.params.tag || ''
  Serie.find({'tags': tag}).count().exec(function (err, totalResults) {
    if (err) return next(err)
    Serie.find({'tags': tag})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, results) {
        if (err) return next(err)
        res.json({total_results: totalResults, results})
      })
  })
})

/** Get several series with pagination and filtered by genre
 * @genre: the genre (string)
 * @page: the page number
 * */
router.get('/genre/:genre/page/:page', function (req, res, next) {
  var perPage = constant.MAX_PER_PAGE // maximum result per page
  var page = req.params.page || 1
  var genre = req.params.genre || ''
  Serie.find({'genres': genre}).count().exec(function (err, totalResults) {
    if (err) return next(err)
    Serie.find({'genres': genre})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, results) {
        if (err) return next(err)
        res.json({total_results: totalResults, results})
      })
  })
})

/** Get several series with pagination and filtered by a keyword
 * @keyword: the keyword (string)
 * @page: the page number
 * */
router.get('/search/:keyword/page/:page', function (req, res, next) {
  var perPage = constant.MAX_PER_PAGE // maximum result per page
  var page = req.params.page || 1
  var keyword = req.params.keyword || ''
  Serie.find({ title: { $regex: '.*' + keyword + '.*', $options: 'i' } }).count().exec(function (err, totalResults) {
    if (err) return next(err)
    Serie.find({ title: { $regex: '.*' + keyword + '.*', $options: 'i' } })
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, results) {
        if (err) return next(err)
        res.json({total_results: totalResults, results})
      })
  })
})

/** Get distinct ids */
router.get('/ids', function (req, res, next) {
  Serie.distinct('id').exec(function (err, ids) {
    if (err) return next(err)
    res.json(ids)
  })
})

/** Get distinct tags */
router.get('/tags', function (req, res, next) {
  Serie.distinct('tags').exec(function (err, tags) {
    if (err) return next(err)
    res.json(tags.sort())
  })
})

/** Create a new serie */
router.post('/', function (req, res, next) {
  Serie.create(req.body, function (err, post) {
    if (err) return next(err)
    res.json(post)
  })
})

/** Update a saved serie */
router.put('/', function (req, res, next) {
  var query = {'id': req.body.id}
  Serie.findOneAndUpdate(query, {'$set': {
    'comment': req.body.comment,
    'tags': req.body.tags,
    'title': req.body.title,
    'poster_path': req.body.poster_path }}, {upsert: true}, function (err) {
    if (err) return next(err)
    return res.send('succesfully saved')
  })
})

/** Delete a saved serie */
router.delete('/:id', function (req, res, next) {
  Serie.deleteOne({ id: req.params.id }).exec(function (err, post) {
    if (err) return next(err)
    res.json(post)
  })
})

module.exports = router
