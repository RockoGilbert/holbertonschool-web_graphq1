const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');

// require the schema.js 
const schema = require('./schema/schema')
// const mongoose = require('mongoose');
// const cors = require('cors');

app.use('/graphql', graphqlHTTP({
  // add schema in an object
  // add the property graphiql: true to constructor to be able to use GraphiQL
  schema: schema, // defining a schema is how graphql knows which data to access based on query being sent
  graphiql: true // gives us a user interface to access our server without having to manually call it through something like Postman
}));
app.listen(4000,()=>{
  console.log('Now listening for request on port 4000');
});

//  Connect to MongoDB
// const db = process.env.MONGO_DB
// mongoose.connect(db);
// mongoose.connect('mongodb://localhost/graphql');

// mongoose.connection.once('open', () => {
//   console.log('Connected to database');
// });