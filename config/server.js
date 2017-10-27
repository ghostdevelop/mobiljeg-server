'use strict';

if(process.env.NODE_ENV === 'development') {
  require('dotenv').config();
};

if(!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET');
}

const config = {
  PORT: process.env.PORT || 4242,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGOURL: process.env.MONGODB_URI
};

export default config;
