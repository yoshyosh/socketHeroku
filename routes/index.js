var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  // var url = 'mongodb://localhost:27017/socket-db';
  // var MongoClient = req.db;
  // MongoClient.connect(url, function(err, db){
  // 	var collection = db.collection('presentations');
  // 	collection.find({}).toArray(function(err, docs){
  // 	  console.dir(docs);
  // 	  db.close();
  // 	});
  // });
  request('http://schedule.altconf.com', function(error, response, body){
    if (!error && response.statusCode == 200){
      var data = JSON.parse(body);
      res.render('index', { title: 'Express', data: data.data });
    }
  });
});

module.exports = router;
