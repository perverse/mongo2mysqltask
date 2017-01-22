"use strict"

const dotenv = require('dotenv').config().parsed;
const argv = require('optimist').argv;
const Promise = require('bluebird');
const mongo = require('mongodb').MongoClient;
const mysql = require('mysql2/promise');
const MysqlOrdersToMongo = require('./classes/MysqlOrdersToMongo.js');

let databases = [];

// Create mysql connection
databases.push(mysql.createConnection({
    host: dotenv['MYSQL_DB_HOST'] || 'localhost',
    port: dotenv['MYSQL_DB_PORT'] || 3306,
    user: dotenv['MYSQL_DB_USER'] || 'user',
    password: dotenv['MYSQL_DB_PASS'] || 'secret',
    database: dotenv['MYSQL_DB_NAME'] || 'testdb',
    Promise: Promise,
    multipleStatements: true // we're not worried about sql injection through this interface
}));

// Create Mongo Connection String
let mongoAuthStr;
if (dotenv['MONGO_DB_USER'] && dotenv['MONGO_DB_PASS']) {
    mongoAuthStr = [dotenv['MONGO_DB_USER'], ':', dotenv['MONGO_DB_PASS'], '@'].join("");
} else {
    mongoAuthStr = "";
}

let mongoConnectStr = [
    "mongodb://",
    mongoAuthStr,
    dotenv['MONGO_DB_HOST'] || 'localhost',
    ":",
    dotenv['MONGO_DB_PORT'] || 27017,
    dotenv['MONGO_DB_DBNAME'] ? "/" + dotenv['MONGO_DB_DBNAME'] : 'admin',
    
].join("");

// Create mongodb connection
databases.push(mongo.connect(mongoConnectStr, { promiseLibrary: Promise }));

Promise.all(databases).spread((mysqlConnection, mongoConnection) => {
    // got both databases, bootstrap our object and migrate away

    let m2m = new MysqlOrdersToMongo({ mysql: mysqlConnection, mongo: mongoConnection, collection: dotenv['MONGO_DB_COLLECTION'] });

    // migrate!
    m2m.migrate().then((ordersInserted) => {
        console.log('A total of ' + ordersInserted.n + ' orders were inserted into db:collection ' + dotenv['MONGO_DB_DBNAME'] + ':' + dotenv['MONGO_DB_COLLECTION'] + ' successfully');
        process.exit();
    }).catch((err) => {
        // there was an error somewhere in the migrate promise chain... alert user.
        console.log('There was an error processing the records: ' + err);
        process.exit();
    });
});