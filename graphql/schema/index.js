const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type Product {
        id: ID!
        model: String!
        model_code: String!
        image: String!
        brand: Brand
        categoryId: Int
        variations: [Variation!]
        reviews: [Review!]
        reviews_count: Int
        createdAt: String
        updatedAt: String
    }

    type Category {
        id: ID!
        name: String!
        parentId: Int
        children: [Category!]
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
        prices: [Price!]
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
        variation: Variation
        createdAt: String
        updatedAt: String
        reviewedAt: String
    }

    type Price {
        price: Float!
        updatedAt: String
    }

    type User {
        id: ID!
        username: String!
        avatar: String
    }

    type ProductFilters {
        categories: [Category!]!
        brands: [Brand!]!
    }


    type RootQuery {
        products(id: Int, required: Boolean, reviewsCount: Int, limit:Int, offset:Int): [Product!]!
        productInfo(limit:Int, offset:Int, categoryId:[Int!], brandId: [Int!]): [ProductInfo!]
        productFilters: ProductFilters!
        search(q: String!): [Product!]
        categories: [Category!]
    }

    schema {
        query: RootQuery

    }
`);