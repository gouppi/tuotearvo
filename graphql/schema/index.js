const { buildSchema } = require('graphql')

module.exports = buildSchema(`

    type Product {
        id: ID!
        name: String!
        group_name: String!
        image: String!
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

    type Brand {
        id: ID!
        name: String!
    }

    type Review {
        id: ID!
        text: String
        text_short: String
        title: String
        recommends: Boolean
        rating: Int
        origin: String
        reviewedAt: String
        product: Product!
    }

    type Price {
        price: Float!
        updatedAt: String
        shop: Shop!
    }

    type Shop {
        id: ID!
        name: String!
        link: String!
    }




    type Family {
        id: ID!
        name: String!
        image: String
        category: Category!
        brand: Brand!
        products: [Product!]!
    }




    type RootQuery {
        families(limit: Int, offset: Int): [Family!]
        products(limit: Int, offset: Int): [Product!]!
        recentReviews: [Review!]!
    }

    schema {
        query: RootQuery

    }
`);