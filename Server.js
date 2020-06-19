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


  await hierarchy(maps.category_tree);
}

models.sequelize.sync().then(async () => {

  //let H = await models.Category.rebuildHierarchy();


}).then(() => {
  app.listen(4000);
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
});







