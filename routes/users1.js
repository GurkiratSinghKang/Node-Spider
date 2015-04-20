var express = require('express');
var request = require('request')
  , cheerio = require('cheerio')
  , async = require('async'),
  , seen = {};
var router = express.Router();


var queue = async.queue(function crawl(url, next) {
  if (!url || seen[url]) return next(null);
  request(url, function(err, response, body){
    if (err) return next(err);

    seen[url] = true;
    
    var $ = cheerio.load(body);
    console.log($('a').map(function(i, e){$(e).attr('href'); }));
    queue.push($('a').map(function(i, e){ return $(e).attr('href'); }));

    next(null);
  });
}, 2);

router.post('/', function(req, res, next){
    var url = req.body.url;
    queue.push(url);
	res.send('Check console!')
})

module.exports = router;
