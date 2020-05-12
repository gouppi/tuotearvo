var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var cors = require('cors')
const models = require('./models/index');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');

var app = express();
app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  context: {models},
  graphiql: true,
}));

models.sequelize.sync({force:true}).then(() => {
  app.listen(4000);
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});







