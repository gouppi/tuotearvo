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
        createdAt: String
        updatedAt: String
    }

    type ProductInfo {
        id: ID!
        model: String!
        image: String!
        reviews_count: Int!
        average_score: Float
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
        origin: String
        user: User
        variation: Variation!
        createdAt: String
        updatedAt: String
    }

    type User {
        id: ID!
        username: String!
        avatar: String
    }

    type RootQuery {
        products(id: Int, required: Boolean): [Product!]!
        productInfo: [ProductInfo!]
        search(q: String!): [Product!]
    }

    schema {
        query: RootQuery

    }
`);