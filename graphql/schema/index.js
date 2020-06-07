const { buildSchema } = require('graphql')

module.exports = buildSchema(`

    type Product {
        id: ID!
        name: String!
        group_name: String!
        image: String!
        reviews: [Review!]
        reviews_count: Int
        rating_avg: Float
        createdAt: String
        updatedAt: String
        product_family_id: Int
        category: Category!
        brand: Brand!
        product_eans: [String!]
        product_mpns: [String!]
        parent_categories: [ParentCategory!]
    }

    type Ean {
        ean: String!
        product_id: Int!
    }

    type Mpn {
        mpn: String!
        product_id: Int!
    }

    type CategoryProducts {

        page: Int!
        total_pages: Int!
        limit: Int!
        products: [Product!]
    }

    type ParentCategory {
        name: String!
        seo_name: String!
    }

    type TitleInfo {
        product_count: Int!
        review_count: Int!
    }


    type Category {
        id: ID!
        name: String!
        seo_name: String!
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

    type FamilyProduct {
        id: ID!
        name: String!
        image: String
    }

    type RootQuery {
        families(limit: Int, offset: Int): [Family!]
        products(limit: Int, offset: Int, categorySeoName: String!): [Product!]!
        product(id: Int!): Product
        productReviews(id: Int!): [Review!]
        productsForCategory(limit: Int, page: Int, categorySeoName: String!, sortBy: String): CategoryProducts!
        categoryProducts(limit: Int, categorySeoName: String!): [Product!]
        productFamily(id: Int!): FamilyProduct!
        recentReviews: [Review!]!
        categories: [Category!]!
        category(categorySeoName: String, id: Int): Category
        titleInfo: TitleInfo!
    }

    schema {
        query: RootQuery

    }
`);