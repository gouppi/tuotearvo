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
    models.Brand.create({name:'Apple'}),
    models.User.create({username:'Pekka Perusjätkä', avatar:'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'}),
    models.Product.create({ model: 'Iphone 11 Pro', model_code:'MWC52FS/A / MWC52', image:'https://placekitten.com/g/200/200'}),
    models.Product.create({ model: 'Iphone 9', model_code:'MWMC2FS/A / MWMC2', image:'https://placekitten.com/g/200/200'}),
    models.Review.create({text:"Oli ihan kiva tuote"}),
    models.Review.create({text:"Ei ollut ihan niin kiva"}),
    models.Review.create({text:"Kakkostuotteen eka arvostelija oon"}),
    models.Ean.create({ean:'1231231231231'}),
    models.Ean.create({ean:'0101020203300'}),
    models.Ean.create({ean:'2294829109482'})
  ]).then(([apple, user,phone11,phone9,arvostelu1,arvostelu2,arvostelu3,ean1,ean2,ean3]) => {
    return Promise.all([
      phone11.setBrand(apple),
      phone9.setBrand(apple),
      arvostelu1.setProduct(phone11),
      arvostelu2.setProduct(phone11),
      arvostelu3.setProduct(phone9),
      arvostelu1.setUser(user),
      arvostelu3.setUser(user),
      ean1.setProduct(phone11),
      ean2.setProduct(phone11),
      ean3.setProduct(phone9)
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







