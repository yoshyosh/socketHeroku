var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  request('http://schedule.altconf.com', function(error, response, body){
    if (!error && response.statusCode == 200){
      var data = JSON.parse(body);
      console.log('Here we are: ' + data);
      res.render('index', { title: 'Express', data: data.data });
    }
  });
});

module.exports = router;
