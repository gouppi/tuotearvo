const { buildSchema } = require('graphql')

module.exports = buildSchema(`

    type Product {
        id: ID!
        name: String!
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
        display_name: String
        model_code: String
        title: String
        text: String
        score: String
        origin: String


        createdAt: String
        updatedAt: String
        reviewedAt: String
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
    }

    schema {
        query: RootQuery

    }
`);