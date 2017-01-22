# Node.js Mysql2Mongo Migration Example

This is a simple nodejs app to meet the business requirements of a coding task (outlined here - http://pastebin.com/VaFSi656). Please note that the following readme is written for linux and, at a stretch, OSX... Windows users, I'm sure you're used to extrapolating.

## Dependencies

* Node.js 6.x+. Developed with Node.js v6.6.0, has been tested as low as v6.0.0.
* MySQL. Just about anything... let's say MySQL 5+. Developed with MySQL 5.7.
* MongoDB 3.x. Untested on lower versions of Mongo.

## Pre-Installation

* You should have a MySQL database set up with an associated user that has at least full read access to that database.
* You should have a MongoDB database set up, with an associated user if you intend to put this code into any sort of production environment.

## Installation

* Step 1 - Clone this repository to a directory
> git clone https://github.com/perverse/mysql2mongotask.git /path/to/directory

* Step 2 - Navigate to directory and run npm install
> cd /path/to/directory && npm install

* Step 3 - Copy .env.example to .env and update file as necessary with your configuration (see Dotenv Configuration heading below for descriptions of each of the configuration options)
> cp .env.example .env && nano .env

* Step 4 - Import provided database into your mysql server
> mysql -u <username> -p<password> <name_of_database> < data/sample.sql

## Dotenv Configuration

* **MYSQL_DB_HOST** - IP or Hostname of your MySQL database server. [Defaults to 'localhost']
* **MYSQL_DB_PORT** - Port of your MySQL database server. [Defaults to '3306']
* **MYSQL_DB_USER** - Username of your MySQL user. [Defaults to 'user']
* **MYSQL_DB_PASS** - Corresponding password for your MySQL user. [Defaults to 'secret']
* **MYSQL_DB_NAME** - Database name of your database to be exported. [Defaults to 'testdb']

* **MONGO_DB_HOST** - IP or Hostname of your MongoDB database server. [Defaults to 'localhost']
* **MONGO_DB_PORT** - Port of your MongoDB database server. [Defaults to '27017']
* **MONGO_DB_DBNAME** - Database name of your MongoDB database. [Defaults to 'admin']
* **MONGO_DB_COLLECTION** - Collection name that you would like to export to. [Defaults to 'orders']
* **MONGO_DB_USER** - Username of the MongoDB user that has permission to the MONGO_DB_NAME database. Can be left blank if Mongo isn't configured for auth.
* **MONGO_DB_PASS** - Corresponding password for your MongoDB user. Should be left blank is MONGO_DB_USER is left blank.

## Usage

Once you have installed and configured the app, simply run it using:

> node /path/to/directory/index.js

and it will import the records from the MySQL database, reformat them in a collection friendly way and import them into your specified mongo database and collection.

## Project Thoughts/Musings

* Efficiency and scalability could definitely be gained using streams over promises, particularly where the reading from the DB is concerned. I couldn't find a way to pull this off cleanly in a single stream without modifying the MySQL DB Server config - in particular, managing additional async mysql calls mid-stream was causing me a bit of grief, and I couldn't get all the data I needed in a single query with a default MySQL server to kick the stream off.
* I considered giving a database import option from the sql file in the app rather than a part of setup, as well as giving the user an interactive menu, but ultimately my time was better spent making the core functionality solid.
* Adding CLI options to override the .env configuration would make the script easier to automate. Again, this was a time tradeoff... and I would argue against the usefulness of automating the script in its current form... which brings me to my last thought...
* When I first considered the task, I considered and did some testing around the concept of doing everything dynamically from reading the foreign keys of the mysql db and extrapolating the "shape" of the export accordingly... however, this approach would ultimately take a lot longer than the task probably warrents. If I had a situation where I was doing this regularly, it might be something I looked into.

## License

The MIT License (MIT)

Copyright (c) 2017 Ronnie Pyne

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.