'use strict';
// Load dependencies
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import PassportMiddleware from './middlewares/PassportMiddleware';
import indexRoute from './routes/index';

// Initialize mongoDB connection
const MONGOURL = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/sample-server';
const options = {
    useMongoClient: true,
    keepAlive: 300000,
    connectTimeoutMS: 30000
};

mongoose.Promise = global.Promise;
mongoose.connect(MONGOURL,  options, (err) => {
  console.log(err || `MongoDB connected to ${MONGOURL}`);
});

// Create an express instance
const app = express();

app.use(function(req, res, next) {
  const cors = { origin: ["http://localhost:3000"], default: "*" };
  const origin = req.headers.origin;
  const allowedOrigin = cors.origin.indexOf(origin) === -1 ? cors.default : origin;

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
  next();
});

// General purpose middlewares and configurations
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());

// Entry point for data routes (API)
app.use('/data', indexRoute);

// PRODUCTION ONLY:
if(process.env.NODE_ENV !== 'development') {
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('/*', function(req, res) {
    return res.sendFile(path.resolve( __dirname, 'build' , 'index.html'));
  });
}


//  404 Handler
app.use((req, res) => {
  res.status(404);
    // // respond with html page
    // if (req.accepts('html') && false) {
    //   res.render('404', { url: req.url });
    //   return;
    // }
    //
    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found!' });
      return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found!');
});

export default app;
