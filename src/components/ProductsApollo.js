import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import ReviewCardAlt from "./Review/ReviewCardAlt";
import ReviewCard from "./Review/ReviewCard";

const CATEGORY_PRODUCTS_QUERY = gql`
  query categoryProducts($categorySeoName: String, $limit: Int) {
    productInfo(limit: 10, categorySeoName: $categorySeoName) {
      id
      id
      name
      group_name
      reviews {
        id
        text
        text_short
        title
        recommends
        rating
      }
    }
  }
`;

const ProductsApollo = (props) => (
  <Query
    query={gql`
      {
        products(limit: 10) {
          id
          model
          image
          reviews {
            title
            text
            score
            reviewedAt
            variation {
              display_name
            }
          }
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) {
        console.log(error);
        return <p>Error :(</p>;
      }

      console.log(data.products[0]);
      return data.products.map((product) => (
        <ReviewCardAlt key={product.id} data={product} />
      ));
    }}
  </Query>
);

export default ProductsApollo;
