import gql from "graphql-tag";

/**
 * Query for category listing products
 */
export const CATEGORY_PRODUCTS_QUERY = gql`
  query categoryProducts(
    $categorySeoName: String!
    $limit: Int
    $page: Int
    $sort: String
  ) {
    productsForCategory(
      limit: $limit
      categorySeoName: $categorySeoName
      page: $page
      sort: $sort
    ) {
      limit
      page
      total_pages
      products {
        id
        product_family_id
        image
        reviews_count
        rating_avg
        name
        group_name
        category {
          id
          name
          seo_name
        }
      }
      filters {
        filter
        values {
          name
          id
          count
          group
        }
      }
    }
    category(categorySeoName: $categorySeoName) {
      id
      seo_name
      name
      parents {
        id
        seo_name
        name
      }
    }
  }
`;

/**
 * Query for front page most recently occured reviews.
 * TODO: Vain yksi per tuote.
 */

export const RECENT_REVIEWS_QUERY = gql`
  query {
    recentReviews {
      text
      text_short
      title
      rating
      origin
      reviewedAt
      product {
        id
        product_family_id
        name
        group_name
        image
        category {
          id
          seo_name
        }
        parent_categories {
          name
          seo_name
        }
      }
    }
  }
`;

/**
 * Query for specific product information
 */

export const PRODUCT_QUERY = gql`
  query productPage($product: Int!) {
    product(id: $product) {
      id
      name
      image
      rating_avg
      group_name
      product_eans
      product_mpns
      reviews {
        shop {
          name
        }
        text
        title
        recommends
        rating

        reviewedAt
        product {
          id
          name
          image
          category {
            id
            seo_name
          }
        }
      }
      category {
        id
        name
        seo_name
      }
      parent_categories {
        name
        seo_name
      }
      prices {
        price
        updatedAt
        shop {
          id
          name
          link
        }
      }
    }
  }
`;

/**
 * Query for navigation bar categories structure
 */

export const FILTERS_QUERY = gql`
  query categories {
    categories {
      id
      name
      seo_name
      parent_id
      children {
        id
        name
        seo_name
        parent_id
        children {
          id
          name
          seo_name
          parent_id
        }
      }
    }
  }
`;

export const TITLE_INFO_QUERY = gql`
  query titleInfo {
    titleInfo {
      product_count
      review_count
    }
  }
`;

export const SEARCH_QUERY = gql`
  query searchQuery(
    $q: String!
    $page: Int
    $limit: Int
    $sort: String
    $filters: SearchFilter
  ) {
    search(q: $q, page: $page, limit: $limit, sort: $sort, filters: $filters) {
      count
      page
      total_pages
      products {
        id
        product_family_id
        image
        reviews_count
        family_reviews_count
        rating_avg
        family_rating_avg
        name
        group_name
        category {
          id
          name
          seo_name
        }
      }
      filters {
        filter
        values {
          name
          id
          count
          group
        }
      }
    }
  }
`;
