const { buildSchema } = require('graphql')

module.exports = buildSchema(`

    type Product {
        id: ID!
        name: String!
        group_name: String!
        image: String!
        reviews: [Review!]
        reviews_count: Int
        family_reviews_count: Int
        rating_avg: Float
        family_rating_avg: Float
        createdAt: String
        updatedAt: String
        product_family_id: Int
        category: Category!
        brand: Brand!
        product_eans: [String!]
        product_mpns: [String!]
        parent_categories: [ParentCategory!]
        prices: [Price!]
        product_family: Family!
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
        filters: [Filter!]
    }

    type Filter {
        filter: String!
        values: [FilterValue!]
    }

    type FilterValue {
        id: Int!
        name: String!
        count: Int!
        group: String!
    }

    type ParentCategory {
        name: String!
        seo_name: String!
    }

    type TitleInfo {
        product_count: Int!
        review_count: Int!
    }

    type SearchResults {
        count: Int!
        page: Int!
        total_pages: Int!
        products: [Product!]
        filters: [Filter!]
    }

    type Category {
        id: ID!
        name: String!
        seo_name: String!
        parent_id: Int
        children: [Category!]
        parents: [Category!]
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
        product: Product
        shop: Shop!
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
        reviews: [Review!]
    }

    type FamilyProduct {
        id: ID!
        name: String!
        image: String
    }

    input SearchFilter {
        brands:[Int!]
        categories:[Int!]
    }

    type RootQuery {
        category(categorySeoName: String, id: Int): Category
        productsForCategory(limit: Int, page: Int, categorySeoName: String!, sort: String): CategoryProducts!
        recentReviews: [Review!]!
        product(id: Int!): Product
        categories: [Category!]!
        titleInfo: TitleInfo!
        search(q: String!, filters: SearchFilter, page: Int, limit: Int, sort:String): SearchResults!
    }

    schema {
        query: RootQuery

    }
`);