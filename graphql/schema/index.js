const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type Product {
        id: ID!
        name: String!
        created_at: String!
        updated_at: String!
    }

    type RootQuery {
        products: [Product!]!
    }

    schema {
        query: RootQuery
    }
`);