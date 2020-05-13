const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type Product {
        id: ID!
        model: String!
        model_code: String!
        image: String!
        brand: Brand
        reviews: [Review!]!
        eans: [Ean!]
        created_at: String
        updated_at: String
    }

    type Brand {
        id: ID!
        name: String!
    }

    type Ean {
        id: ID!
        ean: String!
    }

    type Review {
        id: ID!
        text: String
        user: User
        created_at: String
        updated_at: String
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