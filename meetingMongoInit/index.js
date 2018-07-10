"use strict";

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbHost = process.env.MONGO_HOST || "localhost";
const dbPort = process.env.MONGO_PORT || 27017;
const dbName = "meetingactions"; 

// Connection URL
const dbUrl = "mongodb://" + dbHost + ":" + dbPort;


// Use connect method to connect to the server
MongoClient.connect(dbUrl, function(err, client) {
  // test is the function return err, in case it throw an exception
  assert.equal(null, err);

  console.log("Connected successfully to server");

  const db = client.db(dbName);

  insertDocuments(db, function() {
    client.close();
  });
});

const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('todo');
  // Insert some documents
  collection.insertMany([
    {text : 'Send link to documentation'}, {text: 'Send the presentation'}
  ], function(err, result) {
//    assert.equal(err, null);
//    assert.equal(2, result.result.n);
    console.log("Inserted 2 documents into the collection");
    callback(result);
  });
}
