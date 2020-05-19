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

const seed2 = async () => {
  console.log("seed2");
  let c1 = await models.Category.create({name: 'Päätaso'});
  let c2 = await models.Category.create({name: 'Lapsitaso'});
  let c4 = await models.Category.create({name: 'Päätaso Toinen'});
  let c3 = await models.Category.create({name:'lapsenlapsi'});
  await c2.addChild(c3);
  await c1.addChild(c2);
}

models.sequelize.sync().then(async () => {
  
}).then(() => {
  app.listen(4000);
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});







