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

const seed = () => {
  return Promise.all([
    models.Product.create({ name: 'Testituote 1'}),
    models.Product.create({ name: 'Testituote 2'}),
    models.Review.create({text:"Oli ihan kiva tuote"}),
    models.Review.create({text:"Ei ollut ihan niin kiva"}),
    models.Review.create({text:"Kakkostuotteen eka arvostelija oon"}),
  ]).then(([tuote1,tuote2,arvostelu1,arvostelu2,arvostelu3]) => {
    return Promise.all([
      arvostelu1.setProduct(tuote1),
      arvostelu2.setProduct(tuote1),
      arvostelu3.setProduct(tuote2)
    ])
  })
  .catch(error => console.log(error));
};

models.sequelize.sync({force:true}).then(() => {
  seed();
}).then(() => {
  app.listen(4000);
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});







