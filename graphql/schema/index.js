const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type Product {
        id: ID!
        model: String!
        model_code: String!
        image: String!
        brand: Brand
        variations: [Variation!]
        reviews: [Review!]
        reviews_count: Int
        created_at: String
        updated_at: String
    }

    type Brand {
        id: ID!
        name: String!
    }

    type Variation {
        id: ID!
        ean: String!
        display_name: String!
        model_code: String
        reviews: [Review!]
    }

    type Review {
        id: ID!
        display_name: String
        model_code: String
        title: String
        text: String
        score: String
        user: User
        variation: Variation!
        created_at: String
        updated_at: String
    }

    type User {
        id: ID!
        username: String!
        avatar: String
    }

    type RootQuery {
        products(id: Int): [Product!]! 
    }

    schema {
        query: RootQuery
    }
`);