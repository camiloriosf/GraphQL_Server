const express = require('express');
const models = require('./models');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const passport = require('passport');
const schema = require('./schema/schema');
const { allowDevice } = require('./RESTful/api');

const app = express();

const MONGO_URI = 'mongodb://test:testpassword@ds117271.mlab.com:17271/graphql_server';

mongoose.Promise = global.Promise;

mongoose.connect(MONGO_URI);
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error));

app.use(passport.initialize());

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

app.get('/confirm', allowDevice)

app.listen(process.env.PORT || 4001, () => {
  console.log('Listening');
});