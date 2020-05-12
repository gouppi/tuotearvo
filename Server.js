var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var cors = require('cors')

const {Sequelize} = require('sequelize');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

var app = express();
app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

const sequelize = new Sequelize('arvostelu','arvostelu','arvostelu', {
  host: 'localhost',
  dialect: 'postgres'
});

// DATABASE CONNECTiON HERE
sequelize.authenticate()
.then((foo) => {
  console.log("Database connection works");
}).catch((err) => {
  console.log("Connection error: ", err.message);
});
