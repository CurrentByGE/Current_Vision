// DEPENDENCIES
var sqlite3 = require('sqlite3').verbose();
var request = require('request');

// SETUP
var db = new sqlite3.Database('current_vision.db');

// CONSTANTS
const dbName = 'main';
const tables = ['pedestrians', 'vehicles', 'sensors', 'pins', 'businesses'];
const psWrapperUrl = "https://cv-ps-api.run.aws-usw02-pr.ice.predix.io/";
const psTablePrefix = "public."

// METHODS
function getData() {
  return new Promise(function(resolve, reject) {
    var data = {};
    db.serialize(function() {
      tables.forEach(function(table) {
        var source = dbName + "." + table;
        data[source] = [];
        db.each("SELECT * FROM " + source, function(err, row) {
          if (err)
            reject(new Error("Could not parse " + source));
          else
            data[source].push(row);
        });
      });
      resolve(data);
    });
    db.close();
  });
}

function clearTable(table) {
  var url = psWrapperUrl + table;
  return new Promise(function(resolve, reject) {
    request.delete({
      url: url
    }, function(err, response, body) {
      if (err) reject(err);
      else if (response.statusCode != 200) reject(new Error(
        "Code: " + response.statusCode +
        ", Message: " + response.statusMessage));
      else resolve(body);
    });
  });
}

function createRow(table, data) {
  var url = psWrapperUrl + table;
  return new Promise(function(resolve, reject) {
    request.post({
      url: url,
      body: data,
      headers: {
        "Content-Type": "application/json"
      },
      json: true
    }, function(err, response, body) {
      if (err) reject(err);
      else if (response.statusCode != 200) reject(new Error(
        "Code: " + response.statusCode +
        ", Message: " + response.statusMessage));
      else resolve(body);
    });
  });
}

function writeTable(table, tableData) {
  return clearTable(table).then(function() {
    console.log("cleared: " + table);
    var p = Promise.resolve(true);
    console.log("creating rows...");
    tableData.forEach(function(row, i, arr) {
      p = p.then(function() {
        return createRow(table, row);
      }).then(function() {
        console.log("wrote to " + table + " " + (i + 1) + "/" +
          tableData.length + " rows");
      });
    });
    return p;
  }).then(function() {
    console.log("done writing to: " + table);
  });
}

function writeTables(data) {
  var p = Promise.resolve(true);
  if (data == null) return Promise.reject(new Error(
    "no data recieved from sqlite!"))
  Object.keys(data).forEach(function(source, i, arr) {
    var table = source.split(".")[1];
    var tableData = data[source];
    p = p.then(function() {
      return writeTable(table, tableData);
    }).then(function() {
      console.log("wrote " + (i + 1) + "/" +
        arr.length + " tables");
    });
  });
  return p;
}

// LOGIC
console.log("starting...");
getData().then(function(data) {
  console.log("got data!");
  return writeTables(data);
}).then(function() {
  console.log("wrote data to ps on cloud!!!");
  console.log("you may now press CTRL-C at any time to quit");
}).catch(function(error) {
  console.error("Something went wrong :( :( :(  ", error);
});
