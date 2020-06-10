require('dotenv').config()
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var cors = require('cors')

const models = require('./models/index');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const maps = require('./crawlers/map');

var app = express();
app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  context: { models },
  graphiql: true,
}));

const seed2 = async () => {
  const hierarchy = async (children, parent) => {
    for (let [k, v] of Object.entries(children)) {
      let childParent = await models.Category.create({
        name: k,
        seo_name: k.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '-').toLowerCase()
      });
      if (parent) {
        await parent.addChild(childParent);
      }
      await hierarchy(v, childParent);
    }
  }
  // let P = await  models.Product.create({
  //   group_name: 'iPhone 11 Pro',
  //   name: 'Apple iPhone 11 Pro 256gb Space Gray',
  //   image: 'https://www.image.here',
  //   product_eans: [
  //     {ean: '123123'},
  //     {ean: '234234'},
  //   ],
  //   product_mpns: [
  //     {mpn: 'MX123'},
  //     {mpn: 'MRT421'}
  //   ]
  // }, {
  //   include: [models.Ean, models.Mpn]
  // });

  // let P2 = await  models.Product.create({
  //   group_name: 'iPhone 11 Pro',
  //   name: 'Apple iPhone 11 Pro 256gb Tähtiharmaa',
  //   image: 'https://www.image.here',
  //   product_eans: [
  //     {ean: '242424'},
  //     {ean: '525255'},
  //   ],
  //   product_mpns: [
  //     {mpn: 'MX256'},
  //     {mpn: 'MRT555'}
  //   ]
  // }, {
  //   include: [models.Ean, models.Mpn]
  // });

  await hierarchy(maps.category_tree);
}

models.sequelize.sync().then(async () => {

}).then(() => {
  app.listen(4000);
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});







