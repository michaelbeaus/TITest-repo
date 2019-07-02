var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
ObjectId = require('mongodb').ObjectID;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/* GET home page. */
router.get('/', function(req, res, next) {
  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;
 
  // Define where the MongoDB server is
  var url = 'mongodb://admin:tiisc00l@ds243963.mlab.com:43963/twilight_imperium';
 
  // Connect to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    // We are connected
    console.log('Connection established to', url);
 
    // Get the documents collection
    var collection = db.collection('ac_cards');
 
    // Find all the cards
    collection.find({owner: "deck"}).toArray(function (err, result) {
      if (err) {
        res.send(err);
      } else {
      	res.render('index', { title: 'TI AC Deck Simulator' , decksize: result.length});
      }
      //Close connection
      db.close();
    });
  }});
});

router.get('/thelist', function(req, res){
 
  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;
 
  // Define where the MongoDB server is
  var url = 'mongodb://admin:tiisc00l@ds243963.mlab.com:43963/twilight_imperium';
 
  // Connect to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    // We are connected
    console.log('Connection established to', url);
 
    // Get the documents collection
    var collection = db.collection('ac_cards');
 
    // Find all the cards
    collection.find({}).sort({card_name: 1}).toArray(function (err, result) {
      if (err) {
        res.send(err);
      } else if (result.length) {
        res.render('cardlist',{
 
          // Pass the returned database documents to Jade
          "cardlist" : result
        });
      } else {
        res.send('No documents found');
      }
      //Close connection
      db.close();
    });
  }
  });
});

router.post('/drawcard', function(req, res){
 
    // Get a Mongo client to work with the Mongo server
    var MongoClient = mongodb.MongoClient;
 
    // Define where the MongoDB server is
    var url = 'mongodb://admin:tiisc00l@ds243963.mlab.com:43963/twilight_imperium';
 
    // Connect to the server
    MongoClient.connect(url, function(err, db){
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        console.log('Connected to Server');
 
        // Get the documents collection
        var collection = db.collection('ac_cards');

        // Find all the cards in deck
	    collection.find({owner: "deck"}).toArray(function (err, result) {
	      if (err) {
	        res.send(err);
	      } else if (result.length) {
	        	// Find a random row in the resulting list of cards
	        	var randomCard = result[getRandomInt(0, result.length)]._id;
	        	// Update that row so it is owned by the entered user
		        collection.update({_id: randomCard} , {$set : {'owner' : req.body.owner}} , function (err, upresult){
		          if (err) {
		            console.log(err);
		          } else {
		            collection.find({_id: randomCard}).toArray(function (err, foundcard) {
		            	if (err) {
		            		res.send(err);
		            	} else if (foundcard.length) {
		            		res.render('carddrawn',{	 
					          // Pass the returned database documents to Jade
					          "cardlist" : foundcard
					        });
		            	} else {
					    	res.send('No documents found');
					    }
					    // Close the database
		          		db.close();
		            });
		          }		 
		        });
		    }
	    });
      }
    });
});

router.post('/lookupcard', function(req, res){
 
    // Get a Mongo client to work with the Mongo server
    var MongoClient = mongodb.MongoClient;
 
    // Define where the MongoDB server is
    var url = 'mongodb://admin:tiisc00l@ds243963.mlab.com:43963/twilight_imperium';
 
    // Connect to the server
    MongoClient.connect(url, function(err, db){
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        console.log('Connected to Server');
 
        // Get the documents collection
        var collection = db.collection('ac_cards');

        // Find all the cards owned by the submitted owner
	    collection.find({owner: req.body.owner}).sort({card_name: 1}).toArray(function (err, result) {
	      if (err) {
	        res.send(err);
	      } else if (result.length) {
	        res.render('cardlist',{	 
	          // Pass the returned database documents to Jade
	          "cardlist" : result
	        });
	      } else {
	        res.send('No documents found');
	      }
	      //Close connection
	      db.close();
	    });
      }
    });
});

router.post('/updatecard', function(req, res){
 
    // Get a Mongo client to work with the Mongo server
    var MongoClient = mongodb.MongoClient;
 
    // Define where the MongoDB server is
    var url = 'mongodb://admin:tiisc00l@ds243963.mlab.com:43963/twilight_imperium';
 
    // Connect to the server
    MongoClient.connect(url, function(err, db){
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        console.log('Connected to Server');
 
        // Get the documents collection
        var collection = db.collection('ac_cards');

        // Update the selected card
    	collection.update({_id: ObjectId(req.body._id)} , {$set : {'owner' : req.body.owner}} , function (err, upresult){
    	  if (err) {
            console.log(err);
          } else {
            res.redirect('/');
          }
          // Close the database
          db.close();
        });
      }
    });
});

module.exports = router;
