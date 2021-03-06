var express = require('express');
var router = express.Router();
var request = require('request');
/* GET users listing. */
router.get('/', function(req, res, next) {
  //Check database if content exists, if so create data from that, if not create data from request
  var url = 'mongodb://localhost:27017/socket-db';
  var MongoClient = req.db;
  MongoClient.connect(url, function(err, db){
    var collection = db.collection('presentations');
    collection.find({}).toArray(function(err, docs){
      if(docs.length > 0){
        console.log("Serving up stored presentations");
        // Need to check if there are any changes in the presentations, if so update, else serve up as usual
        res.json(docs)
        db.close();
      } else {
        console.log("fetching presentations"); // fetch schedule
        request('http://schedule.altconf.com', function(error, response, body){
          if (!error && response.statusCode == 200){
            var data = JSON.parse(body);
            var displayData = data.data;
            // store this data for next time
            collection.insert(displayData, function(err, result){
              db.close();
            });
            res.json(displayData);
          } // else respond with error
        });
      }
    });
  });
});

module.exports = router;