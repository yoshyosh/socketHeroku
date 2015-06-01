var express = require('express');
var router = express.Router();
var request = require('request');
/* GET users listing. */
router.get('/', function(req, res, next) {
  //Check database if content exists, if so create data from that, if not create data from request
  request('http://schedule.altconf.com', function(error, response, body){
    if (!error && response.statusCode == 200){
      var data = JSON.parse(body);
      res.json(data);
    } // else respond with error
  });
});

module.exports = router;