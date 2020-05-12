const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type Product {
        id: ID!
        name: String!
        image: String!
        reviews: [Review!]!
        created_at: String!
        updated_at: String!
    }

    type Review {
        id: ID!
        text: String
        user: User
        created_at: String!
        updated_at: String!
    }

    type User {
        id: ID!
        username: String!
        avatar: String
    }

    type RootQuery {
        products: [Product!]!
    }

    schema {
        query: RootQuery
    }
`);